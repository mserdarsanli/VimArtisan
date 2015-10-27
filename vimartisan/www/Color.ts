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


// Representation of a real color
// Has utilities to print as "rgba(100, 200, 50, 1)" etc.
class Color {
  private r: number;
  private g: number;
  private b: number;

  public static FromRGB(red: number, green: number, blue: number): Color {
    var self = new Color();
    self.r = Math.round(red);
    self.g = Math.round(green);
    self.b = Math.round(blue);
    return self;
  }

  // Creates from a string of form #AAAAAA
  public static FromHex(hex: string) {
    if (hex.length != 7 || hex[0] != '#') {
      console.error('Unable to parse color: ', hex);
    }

    var self = new Color();
    self.r = parseInt(hex.substr(1, 2), 16);
    self.g = parseInt(hex.substr(3, 2), 16);
    self.b = parseInt(hex.substr(5, 2), 16);
    return self;
  }

  public CssRgba() {
    return 'rgba(' + this.r + ', ' + this.g + ', ' + this.b + ', 1)';
  }
}
