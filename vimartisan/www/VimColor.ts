// Copyright 2016 Mustafa Serdar Sanli
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

// Utility class for mapping Vim color names to terminal color codes.
// Only 256-color terminals are supported.
class VimColor {

  // Following data is extracted from Vim src/syntax.c
  // All made lowercase since Vim handles names case insensitively.
  private static ColorValues:  {[key:string]: number} = {
    "black": 0,
    "darkblue": 4,
    "darkgreen": 2,
    "darkcyan": 6,
    "darkred": 1,
    "darkmagenta": 5,
    "brown": 130,
    "darkyellow": 130,
    "gray": 248,
    "grey": 248,
    "lightgray": 7,
    "lightgrey": 7,
    "darkgray": 242,
    "darkgrey": 242,
    "blue": 12,
    "lightblue": 81,
    "green": 10,
    "lightgreen": 121,
    "cyan": 14,
    "lightcyan": 159,
    "red": 9,
    "lightred": 224,
    "magenta": 13,
    "lightmagenta": 225,
    "yellow": 11,
    "lightyellow": 229,
    "white": 15,
    "none": -1,
  };

  // Parses color name or value
  // Accepted values: 'yellow', 'none', '-1', '13' ...
  public static Parse(vimColorName: string): TermColor {
    let numberVal: number = parseInt(vimColorName);
    if (!isNaN(numberVal) && numberVal >= -1 && numberVal <= 255) {
      return new TermColor(numberVal);
    }

    let name: string = vimColorName.toLowerCase();

    if (!VimColor.ColorValues.hasOwnProperty(name)) {
      console.log('Unable to parse vim color name: ', vimColorName);
      return new TermColor(-1);
    }
    return new TermColor(VimColor.ColorValues[name]);
  }
}
