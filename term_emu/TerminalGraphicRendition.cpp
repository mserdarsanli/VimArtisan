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

#include <cstdio>

#include "Terminal.hpp"

const Terminal::Character::Style Terminal::Character::Style::Default;

// For CSI Graphic Rendition subset
// <ESC> + '[' + {csi} + 'm'

enum Rendition {
	Default = 0,
	Bold = 1,

	NegativeImage = 7,

	PositiveImage = 27,

	ForegroundColorStart = 30,
	ForegroundColorEnd = 37,
	ForegroundFromPalette = 38,

	BackgroundColorStart = 40,
	BackgroundColorEnd = 47,
	BackgroundFromPalette = 48,

	BrightForegroundColorStart = 90,
	BrightForegroundColorEnd = 97,

	BrightBackgroundColorStart = 100,
	BrightBackgroundColorEnd = 107,
};

void Terminal::selectGraphicRendition(const std::string &csi)
{
	int n1 = 0;
	std::sscanf(csi.c_str(), "%d", &n1);
	int n2, n3;

	switch (n1)
	{
	case Rendition::Default:
		// Reset to terminal defaults
		style = Character::Style::Default;
		return;
	case Rendition::Bold:
		// Bold TODO unignore
		style.isBold = true;
		return;
	case Rendition::NegativeImage:
		style.isNegative = true;
		return;;
	case Rendition::PositiveImage:
		style.isNegative = false;
		return;
	case Rendition::ForegroundFromPalette:
		if (std::sscanf(csi.c_str(), "%*d;%d;%d", &n2, &n3) == 2 && n2 == 5)
		{
			style.fgColorId = n3;
		}
		else
		{
			std::printf("{graphic:%s}", csi.c_str());
		}
		return;
	case Rendition::BackgroundFromPalette:
		if (sscanf(csi.c_str(), "%*d;%d;%d", &n2, &n3) == 2 && n2 == 5)
		{
			style.bgColorId = n3;
		}
		else
		{
			std::printf("{graphic:%s}", csi.c_str());
		}
		return;
	}

	// Foreground and background from basic set
	if (n1 >= Rendition::ForegroundColorStart &&
	    n1 <= Rendition::ForegroundColorEnd)
	{
		style.fgColorId = n1 - ForegroundColorStart;
		return;
	}
	if (n1 >= Rendition::BackgroundColorStart &&
	    n1 <= Rendition::BackgroundColorEnd)
	{
		style.bgColorId = n1 - BackgroundColorStart;
		return;
	}

	// Hight intensity foreground and background
	// TODO, high intensity is not set here
	if (n1 >= Rendition::BrightForegroundColorStart &&
	    n1 <= Rendition::BrightForegroundColorEnd)
	{
		style.fgColorId = n1 - BrightForegroundColorStart;
		return;
	}
	if (n1 >= Rendition::BrightBackgroundColorStart &&
	    n1 <= Rendition::BrightBackgroundColorEnd)
	{
		style.bgColorId = n1 - BrightBackgroundColorStart;
		return;
	}

	std::fprintf(stderr, "{unhandled_graphic_rendition:%s}", csi.c_str());
}
