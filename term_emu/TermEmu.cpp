// Copyright 2015 Mustafa Serdar Sanli
//
// This file is part of VimArtisan.
//
// VimArtisan is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// VimArtisan is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with VimArtisan.  If not, see <http://www.gnu.org/licenses/>.

#include <ctype.h>
#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <algorithm>
#include <iostream>
#include <string>

#include "Terminal.hpp"

// Indexed from 1
// Can be empty, meaning 1;1
// Can be {row};{col}
void Terminal::DirectCursorAddressing(const std::string &p)
{
	if (p.size() == 0)
	{
		cursor.moveTo(0, 0);
		return;
	}
	int r, c;
	if (sscanf(p.c_str(), "%d;%d", &r, &c) == 2)
	{
		cursor.moveTo(r-1, c-1);
		return;
	}
	fprintf(stderr, "{unhandled:cursor_addr:%s}", p.c_str());
}

//  ESC [ Pn K                      Erase in Line
//        Pn = None or 0            From Cursor to End of Line
//             1                    From Beginning of Line to Cursor
//             2                    Entire Line
void Terminal::EraseInLine(const std::string &p)
{
	if (p == "" || p == "0")
	{
		// Erase from cursor to end of line
		for (int i = cursor.col; i < TermWidth; ++i)
		{
			cells[cursor.row][i].codePoint = ' '; // Is this the right CP?
		}
		return;
	}
	if (p == "1")
	{
		// Erase from beginning of line to cursor
		for (int i = 0; i < cursor.col; ++i)
		{
			cells[cursor.row][i].codePoint = ' '; // Is this the right CP?
		}
		return;
	}
	if (p == "2")
	{
		// Erase entire line
		for (int i = 0; i < TermWidth; ++i)
		{
			cells[cursor.row][i].codePoint = ' '; // Is this the right CP?
		}
		return;
	}
	fprintf(stderr, "{unhandled:erase_in_line:%s}", p.c_str());
}

void Terminal::SetMode(const std::string &p)
{
	//printf("{set_mode:%s}", p.c_str()); TODO unignore
}

void Terminal::ResetMode(const std::string &p)
{
	//printf("{reset_mode:%s}", p.c_str()); TODO unignore
}

//  ESC [ Pn J                      Erase in Display
//        Pn = None or 0            From Cursor to End of Screen
//             1                    From Beginning of Screen to Cursor
//             2                    Entire Screen
void Terminal::EraseInDisplay(const std::string &p)
{
	int cursorIndex = cursor.row * TermWidth + cursor.col;

	if (p == "" || p == "0")
	{
		// Erase from cursor to end of screen
		for (int i = cursorIndex; i < TermHeight * TermWidth; ++i)
		{
			cells[0][i].codePoint = ' '; // Is this the right CP?
		}
		return;
	}
	if (p == "1")
	{
		// Erase from beginning to cursor
		for (int i = 0; i < cursorIndex; ++i)
		{
			cells[0][i].codePoint = ' '; // Is this the right CP?
		}
		return;
	}
	if (p == "2")
	{
		// Erase entire screen
		for (int i = 0; i < TermHeight * TermWidth; ++i)
		{
			cells[0][i].codePoint = ' '; // Is this the right CP?
		}
		return;
	}

	fprintf(stderr, "{unhandled:erase_in_display:%s}", p.c_str());
}

void Terminal::SendSecondaryDeviceAttributes(const std::string &p)
{
	// Ignored.
}

void Terminal::SendCursorPositionReport(const std::string &p)
{
	if (p == "6")
	{
		// Should be 6
		return;
	}

	fprintf(stderr, "{FAIL:send_cursor_position_report:%s}", p.c_str());
}

void Terminal::SetScrollingRegion(const std::string &p)
{
	// Ignoring
	// printf("{set_scrolling_region:%s}", p.c_str());
}

void Terminal::CursorForward(const std::string &p)
{
	int t = 1;
	if (p.size())
	{
		sscanf(p.c_str(), "%d", &t);
	}

	for (int i = 0; i < t; ++i)
	{
		cursor.moveForward();
	}
}

// https://www.gnu.org/software/screen/manual/html_node/Control-Sequences.html
// http://en.wikipedia.org/wiki/ANSI_escape_code
// http://invisible-island.net/xterm/ctlseqs/ctlseqs.html
void Terminal::ParseCsiEscape(std::istream &in)
{
	std::string csi;
	while (1)
	{
		int c = in.get();

		if (c == EOF)
		{
			std::cerr << __FILE__ << " " << __LINE__ << ":"
			          << "Csi code ignored\n";
			return;
		}
		if (c >= '@' && c <= '~') // End of CSI code
		{
			switch (c)
			{
			case 'm': this->selectGraphicRendition(csi); break;
			case 'H': DirectCursorAddressing(csi); break;
			case 'K': EraseInLine(csi); break;
			case 'l': ResetMode(csi); break;
			case 'h': SetMode(csi); break;
			case 'J': EraseInDisplay(csi); break;
			case 'c': SendSecondaryDeviceAttributes(csi); break;
			case 'n': SendCursorPositionReport(csi); break;
			case 'r': SetScrollingRegion(csi); break;
			case 'C': CursorForward(csi); break;
			default:
				fprintf(stderr, "{unhandled:%s%c}", csi.c_str(), c);
				break;
			}
			return;
		}
		csi.push_back(c);
	}
}

// Example parsed <ESC>P+q436f <ESC>'\'
// <ESC>\ is string terminator
void Terminal::ParseDcs(std::istream &in)
{
	std::string dcs;
	while (1)
	{
		int c = in.get();

		if (c == EOF)
		{
			std::cerr << __FILE__ << " " << __LINE__ << ":"
			          << "Dcs code ignored\n";
			return;
		}
		if (c == 033) // DCS Terminator
		{
			if (in.get() != '\\')
			{
				std::cerr << __FILE__ << " " << __LINE__ << ":"
					  << "Unexpected sequence\n";
				return;
			}
			// string is parsed into `dcs`
			// Ignoring
			return;
		}

		dcs.push_back(c);
	}
}

// This is called whan an escape character (033) is seen
void Terminal::ParseEscape(std::istream &in)
{
	int c = in.get();
	if (c == EOF)
	{
		std::cerr << __FILE__ << " " << __LINE__ << ":"
		          << "Escape ignored\n";
		return;
	}

	if (c == '[')
	{
		ParseCsiEscape(in);
		return;
	}
	else if (c == 'P')
	{
		ParseDcs(in);
		return;
	}
	else if (c == '=')
	{
		// Ignoring
		// printf("{AltKeypad}");
	}
	else
	{
		fprintf(stderr, "Unknown escape %d\n", c);
	}
}
