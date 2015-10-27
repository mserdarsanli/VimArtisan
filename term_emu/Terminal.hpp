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

#pragma once

#include <iostream>
#include <string>

const int TermWidth = 80;
const int TermHeight = 24;

class Terminal
{
public:
	struct Character
	{
		struct Style
		{
			// Range 0-255 are standard colors.
			// -1 means terminal default
			int fgColorId = -1;
			int bgColorId = -1;
			// fg/bg colors should be swapped if negative
			bool isNegative = false;
			bool isBold = false;

			static const Style Default;
		};

		int codePoint = ' ';
		Style style;
	};

	struct Cursor
	{
		int row;
		int col;

		void moveForward()
		{
			++col;
			if (col >= TermWidth)
			{
				col = 0;
				++row;
			}

			if (row >= TermHeight)
			{
				// Going out of bounds is fine,
				// as long as nothing is written there.
				// So, resetting position to the last cell.
				row = TermHeight - 1;
				col = TermWidth - 1;
			}
		}

		void moveBackward()
		{
			--col;
			if (col < 0)
			{
				col = TermWidth - 1;
				--row;
			}

			if (row < 0)
			{
				// Going out of bounds is fine,
				// as long as nothing is written there.
				// So, resetting position to the first cell.
				row = 0;
				col = 0;
			}
		}

		void moveTo(int r, int c)
		{
			// TODO check bounds
			row = r;
			col = c;
		}
	};

	// Puts a character into position pointed by the cursor
	void putChar(int codePoint);

	const Character& at(int r, int c) const
	{
		return cells[r][c];
	}

private:
	Character::Style style;

	// Terminal character index is row-col
	// 0,0   .. 0,w-1
	// ..       ..
	// h-1,0 .. 0,0
	public: // Temporary FIXME
	void selectGraphicRendition(const std::string &csi);

	Cursor cursor;
	Character cells[TermHeight][TermWidth];

	// Functions defined and documented in TermEmu.cpp
	void DirectCursorAddressing(const std::string &p);
	void EraseInLine(const std::string &p);
	void SetMode(const std::string &p);
	void ResetMode(const std::string &p);
	void EraseInDisplay(const std::string &p);
	void SendSecondaryDeviceAttributes(const std::string &p);
	void SendCursorPositionReport(const std::string &p);
	void SetScrollingRegion(const std::string &p);
	void CursorForward(const std::string &p);
	void ParseCsiEscape(std::istream&);
	void ParseDcs(std::istream&);
	void ParseEscape(std::istream&);
};

std::ostream& operator<<(std::ostream &out, const Terminal &t);
std::istream& operator>>(std::istream &in, Terminal &t);
