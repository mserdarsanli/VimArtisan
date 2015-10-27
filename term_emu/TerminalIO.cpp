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

#include "Terminal.hpp"

bool ShouldEcho(int c);

std::ostream& operator<<(std::ostream &out, const Terminal &t)
{
	for (int r = 0; r < TermHeight; ++r)
	{
		for (int c = 0; c < TermWidth; ++c)
		{
			const auto &cell = t.cells[r][c];
			int ch = cell.codePoint;
			const auto &style = cell.style;
			if (isprint(ch))
			{
				out << "\033[0m";
				if (style.isNegative)
				{
					out << "\033[7m";
				}
				if (style.isBold)
				{
					out << "\033[1m";
				}
				if (style.fgColorId != -1)
				{
					out << "\033[38;5;" << style.fgColorId << "m";
				}
				if (style.bgColorId != -1)
				{
					out << "\033[48;5;" << style.bgColorId << "m";
				}
				out << (char)ch; // TODO unicode code-point?
			}
			else
			{
				out << "{Skipped codepoint " << ch << "}";
			}
		}
		out << (char)'\n';
	}
	return out;
}

std::istream& operator>>(std::istream &in, Terminal &t)
{
	int c;
	while ((c = in.get()) != EOF)
	{
		if (ShouldEcho(c))
		{
			t.putChar(c);
			continue;
		}
		else if (c == '\a')
		{
			// Bell, ignore
			continue;
		}
		else if (c == 033) // ESC
		{
			t.ParseEscape(in);
			continue;
		}
		// Check for utf-8 character
		if (c & 0b11000000)
		{
			unsigned char seq[7] = {0};
			seq[0] = c;
			int len;
			int cp = 0;

			if (c >= 0b11111100)
			{
				len = 6;
				cp <<= 1;
				cp += c & 0b00000001;
			}
			else if (c >= 0b11111000)
			{
				len = 5;
				cp <<= 2;
				cp += c & 0b00000011;
			}
			else if (c >= 0b11110000)
			{
				len = 4;
				cp <<= 3;
				cp += c & 0b00000111;
			}
			else if (c >= 0b11100000)
			{
				len = 3;
				cp <<= 4;
				cp += c & 0b00001111;
			}
			else
			{
				len = 2;
				cp <<= 5;
				cp += c & 0b00011111;
			}

			for (int i = 1; i < len; ++i)
			{
				seq[i] = in.get();
				if (seq[i] < 0b10000000 || seq[i] >= 0b11000000)
				{
					in.unget(); // Put it back
					// VIM putting different stuff if not in
					// tmux. FIXME find why it is and
					// force it to be utf8.
					std::cerr << "{invalid_utf8_seq:";
					for (int j = 0; j < i; ++j)
					{
						std::cerr << " " << (int)seq[j];
					}
					std::cerr << " *" << (int)seq[i] << "}\n";
					goto go_next;
				}
				cp <<= 6;
				cp += seq[i] & 0b00111111;
			}

			t.putChar(cp); // Echo the utf8 char
			continue;
		}
		std::cerr << "{Read_unknown_char " << c << "}";
		go_next:;
	}
	return in;
}

// Should we just echo the char? meaning it is not an escape code
bool ShouldEcho(int c)
{
	if (isprint(c) || isspace(c))
	{
		return true;
	}
	else if (c == '\b') // Backspace
	{
		return true;
	}
	return false;
}

void Terminal::putChar(int c)
{
	if (isprint(c) || c > 127) // Unicode or printable
	{
		// TODO find out if unicode character should consume
		// multiple cells
		cells[cursor.row][cursor.col].codePoint = c;
		cells[cursor.row][cursor.col].style = style;
		cursor.moveForward();
	}
	else if (c == '\b')
	{
		// TODO this might need a special handling
		cells[cursor.row][cursor.col].codePoint = ' ';
		cursor.moveBackward();
	}
	else if (c == '\r')
	{
		cursor.col = 0;
	}
	else if (c == '\n')
	{
		++cursor.row;
		if (cursor.row >= TermHeight)
		{
			cursor.row = TermHeight - 1;
			cursor.col = TermWidth - 1;
		}
	}
	else
	{
		fprintf(stderr, "{echo:%d}", c);
	}
}
