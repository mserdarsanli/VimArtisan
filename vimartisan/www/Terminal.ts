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


// Defines the 256 color terminal user is using
// In case we more terminals are to be supported..
interface Terminal {
  GetFgColor(): Color;
  GetBgColor(): Color;
  SetFgColor(c: Color);
  SetBgColor(c: Color);

  // Gets/sets color for given color code
  GetColor(colorCode: number): Color;
  SetColor(colorCode: number, c: Color);

  // Returns a list of colorschemes the terminal supports
  // GNOME terminal supports a few colorschemes, which changes
  // foreground and background colors
  GetColorSchemes(): Array<string>;
  UseColorScheme(colorScheme: string);

  // Returns a list of palettes the terminal supports
  // GNOME terminal supports a few palettes, which allows changes
  // first 16 colors
  GetPalettes(): Array<string>;
  UsePalette(palette: string);
}

// For 256-color terminal globals
class XTerm {
  // Table of color codes in the same design as
  // http://upload.wikimedia.org/wikipedia/en/1/15/Xterm_256color_chart.svg
  //
  // Used for presenting color picker
  public static ChartColorCodes: Array<Array<number>> = [
    // Colors
    [16,  22,  28,  34,  40,  46,  82,  76,  70,  64,  58,  52],
    [17,  23,  29,  35,  41,  47,  83,  77,  71,  65,  59,  53],
    [18,  24,  30,  36,  42,  48,  84,  78,  72,  66,  60,  54],
    [19,  25,  31,  37,  43,  49,  85,  79,  73,  67,  61,  55],
    [20,  26,  32,  38,  44,  50,  86,  80,  74,  68,  62,  56],
    [21,  27,  33,  39,  45,  51,  87,  81,  75,  69,  63,  57],
    [93,  99,  105, 111, 117, 123, 159, 153, 147, 141, 135, 129],
    [92,  98,  104, 110, 116, 122, 158, 152, 146, 140, 134, 128],
    [91,  97,  103, 109, 115, 121, 157, 151, 145, 139, 133, 127],
    [90,  96,  102, 108, 114, 120, 156, 150, 144, 138, 132, 126],
    [89,  95,  101, 107, 113, 119, 155, 149, 143, 137, 131, 125],
    [88,  94,  100, 106, 112, 118, 154, 148, 142, 136, 130, 124],
    [160, 166, 172, 178, 184, 190, 226, 220, 214, 208, 202, 196],
    [161, 167, 173, 179, 185, 191, 227, 221, 215, 209, 203, 197],
    [162, 168, 174, 180, 186, 192, 228, 222, 216, 210, 204, 198],
    [163, 169, 175, 181, 187, 193, 229, 223, 217, 211, 205, 199],
    [164, 170, 176, 182, 188, 194, 230, 224, 218, 212, 206, 200],
    [165, 171, 177, 183, 189, 195, 231, 225, 219, 213, 207, 201],
    // Greyscale
    [232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243],
    [255, 254, 253, 252, 251, 250, 249, 248, 247, 246, 245, 244],
    // Basic
    [0,   1,   2,   3,   4,   5,   6,   7],
    [8,   9,   10,  11,  12,  13,  14,  15],
    // No-color
    [-1],
  ];
}
