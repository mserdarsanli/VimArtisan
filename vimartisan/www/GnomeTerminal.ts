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

class GnomeTerminal implements Terminal {

  public GetFgColor(): Color {
    return this.Foreground;
  }

  public GetBgColor(): Color {
    return this.Background;
  }

  public SetFgColor(c: Color) {
    this.Foreground = c;
  }

  public SetBgColor(c: Color) {
    this.Background = c;
  }

  public GetColor(colorCode: number): Color {
    if (colorCode == -1) {
      console.error('GetColor called with -1');
    }

    return this.Colors[colorCode];
  }

  public SetColor(colorCode: number, c: Color) {
    this.Colors[colorCode] = c;
  }

  // Returns a list of colorschemes the terminal supports
  // GNOME terminal supports a few colorschemes, which changes
  // foreground and background colors
  public GetColorSchemes(): Array<string> {
    return Object.keys(GnomeTerminal.ColorSchemes);
  }

  public UseColorScheme(colorScheme: string) {
    console.log('Using colorscheme ' + colorScheme);

    var fgColor = GnomeTerminal.ColorSchemes[colorScheme][0];
    var bgColor = GnomeTerminal.ColorSchemes[colorScheme][1];

    this.SetFgColor(fgColor);
    this.SetBgColor(bgColor);
  }

  // Returns a list of palettes the terminal supports
  // GNOME terminal supports a few palettes, which allows changes
  // first 16 colors
  public GetPalettes(): Array<string> {
    return Object.keys(GnomeTerminal.Palettes);
  }

  public UsePalette(paletteName: string) {
    console.log('Using palette ' + paletteName);

    for (var i = 0; i < 16; ++i) {
      var color = GnomeTerminal.Palettes[paletteName][i];
      this.SetColor(i, color);
    }
  }

  // Terminal foreground and background colors
  // Applies when they are not overridden
  // Vim uses 'Normal' group to override this for all elements
  private Background: Color = Color.FromRGB(0, 0, 0);
  private Foreground: Color = Color.FromRGB(255, 255, 255);

  // ColorScheme/Palette values are copied from:
  // https://github.com/GNOME/gnome-terminal/blob/master/src/profile-editor.c

  // Map of colorscheme => [ fgcolor, bgcolor ]
  // Each color is of form: [r, g, b, a] as doubles
  private static ColorSchemes: {[key:string]: Array<Color>} = {
    'Black on light yellow': [
      Color.FromRGB(   0,   0,   0 ),
      Color.FromRGB( 255, 255, 221 ),
    ],
    'Black on white': [
      Color.FromRGB(   0,   0,   0 ),
      Color.FromRGB( 255, 255, 255 ),
    ],
    'Gray on black': [
      Color.FromRGB( 170, 170, 170 ),
      Color.FromRGB(   0,   0,   0 ),
    ],
    'Green on black': [
      Color.FromRGB(   0, 255,   0 ),
      Color.FromRGB(   0,   0,   0 ),
    ],
    'White on black': [
      Color.FromRGB( 255, 255, 255 ),
      Color.FromRGB(   0,   0,   0 ),
    ],
    'Solarized light': [
      Color.FromRGB( 101, 123, 131 ),
      Color.FromRGB( 253, 246, 227 ),
    ],
    'Solarized dark': [
      Color.FromRGB( 131, 148, 150 ),
      Color.FromRGB(   0,  43,  54 ),
    ],
  };

  // Map of paletteName => [ color0, color255, ..., color3825 ]
  private static Palettes: {[key:string]: Array<Color>} = {
    'Tango': [
      Color.FromRGB(   0,   0,   0 ),
      Color.FromRGB( 204,   0,   0 ),
      Color.FromRGB(  78, 154,   6 ),
      Color.FromRGB( 196, 160,   0 ),
      Color.FromRGB(  52, 101, 164 ),
      Color.FromRGB( 117,  80, 123 ),
      Color.FromRGB(   6, 152, 154 ),
      Color.FromRGB( 211, 215, 207 ),
      Color.FromRGB(  85,  87,  83 ),
      Color.FromRGB( 239,  41,  41 ),
      Color.FromRGB( 138, 226,  52 ),
      Color.FromRGB( 252, 233,  79 ),
      Color.FromRGB( 114, 159, 207 ),
      Color.FromRGB( 173, 127, 168 ),
      Color.FromRGB(  52, 226, 226 ),
      Color.FromRGB( 238, 238, 236 ),
    ],
    'Linux console': [
      Color.FromRGB(   0,   0,   0 ),
      Color.FromRGB( 170,   0,   0 ),
      Color.FromRGB(   0, 170,   0 ),
      Color.FromRGB( 170,  85,   0 ),
      Color.FromRGB(   0,   0, 170 ),
      Color.FromRGB( 170,   0, 170 ),
      Color.FromRGB(   0, 170, 170 ),
      Color.FromRGB( 170, 170, 170 ),
      Color.FromRGB(  85,  85,  85 ),
      Color.FromRGB( 255,  85,  85 ),
      Color.FromRGB(  85, 255,  85 ),
      Color.FromRGB( 255, 255,  85 ),
      Color.FromRGB(  85,  85, 255 ),
      Color.FromRGB( 255,  85, 255 ),
      Color.FromRGB(  85, 255, 255 ),
      Color.FromRGB( 255, 255, 255 ),
    ],
    'XTerm': [
      Color.FromRGB(   0,   0,   0 ),
      Color.FromRGB( 205,   0,   0 ),
      Color.FromRGB(   0, 205,   0 ),
      Color.FromRGB( 205, 205,   0 ),
      Color.FromRGB(  30, 144, 255 ),
      Color.FromRGB( 205,   0, 205 ),
      Color.FromRGB(   0, 205, 205 ),
      Color.FromRGB( 229, 229, 229 ),
      Color.FromRGB(  76,  76,  76 ),
      Color.FromRGB( 255,   0,   0 ),
      Color.FromRGB(   0, 255,   0 ),
      Color.FromRGB( 255, 255,   0 ),
      Color.FromRGB(  70, 130, 180 ),
      Color.FromRGB( 255,   0, 255 ),
      Color.FromRGB(   0, 255, 255 ),
      Color.FromRGB( 255, 255, 255 ),
    ],
    'Rxvt': [
      Color.FromRGB(   0,   0,   0 ),
      Color.FromRGB( 205,   0,   0 ),
      Color.FromRGB(   0, 205,   0 ),
      Color.FromRGB( 205, 205,   0 ),
      Color.FromRGB(   0,   0, 205 ),
      Color.FromRGB( 205,   0, 205 ),
      Color.FromRGB(   0, 205, 205 ),
      Color.FromRGB( 250, 235, 215 ),
      Color.FromRGB(  64,  64,  64 ),
      Color.FromRGB( 255,   0,   0 ),
      Color.FromRGB(   0, 255,   0 ),
      Color.FromRGB( 255, 255,   0 ),
      Color.FromRGB(   0,   0, 255 ),
      Color.FromRGB( 255,   0, 255 ),
      Color.FromRGB(   0, 255, 255 ),
      Color.FromRGB( 255, 255, 255 ),
    ],
    'Solarized': [
      Color.FromRGB(   7,  54,  66 ),
      Color.FromRGB( 220,  50,  47 ),
      Color.FromRGB( 133, 153,   0 ),
      Color.FromRGB( 181, 137,   0 ),
      Color.FromRGB(  38, 139, 210 ),
      Color.FromRGB( 211,  54, 130 ),
      Color.FromRGB(  42, 161, 152 ),
      Color.FromRGB( 238, 232, 213 ),
      Color.FromRGB(   0,  43,  54 ),
      Color.FromRGB( 203,  75,  22 ),
      Color.FromRGB(  88, 110, 117 ),
      Color.FromRGB( 101, 123, 131 ),
      Color.FromRGB( 131, 148, 150 ),
      Color.FromRGB( 108, 113, 196 ),
      Color.FromRGB( 147, 161, 161 ),
      Color.FromRGB( 253, 246, 227 ),
    ],
  };

  private Colors: Array<Color> = [
    // Basic colors [0..15]
    // These might be overridden by terminal palette settings
    '#2E3436', '#CC0000', '#4E9A06', '#C4A000', '#3465A4', '#75507B', '#06989A', '#D3D7CF',
    '#555753', '#EF2929', '#8AE234', '#FCE94F', '#729FCF', '#AD7FA8', '#34E2E2', '#EEEEEC',
    // Rest of the colors [16..231]
    // Those 216 codes are colored by 6*6*6 RGB combinations,
    '#000000', '#00005F', '#000087', '#0000AF', '#0000D7', '#0000FF',
    '#005F00', '#005F5F', '#005F87', '#005FAF', '#005FD7', '#005FFF',
    '#008700', '#00875F', '#008787', '#0087AF', '#0087D7', '#0087FF',
    '#00AF00', '#00AF5F', '#00AF87', '#00AFAF', '#00AFD7', '#00AFFF',
    '#00D700', '#00D75F', '#00D787', '#00D7AF', '#00D7D7', '#00D7FF',
    '#00FF00', '#00FF5F', '#00FF87', '#00FFAF', '#00FFD7', '#00FFFF',
    '#5F0000', '#5F005F', '#5F0087', '#5F00AF', '#5F00D7', '#5F00FF',
    '#5F5F00', '#5F5F5F', '#5F5F87', '#5F5FAF', '#5F5FD7', '#5F5FFF',
    '#5F8700', '#5F875F', '#5F8787', '#5F87AF', '#5F87D7', '#5F87FF',
    '#5FAF00', '#5FAF5F', '#5FAF87', '#5FAFAF', '#5FAFD7', '#5FAFFF',
    '#5FD700', '#5FD75F', '#5FD787', '#5FD7AF', '#5FD7D7', '#5FD7FF',
    '#5FFF00', '#5FFF5F', '#5FFF87', '#5FFFAF', '#5FFFD7', '#5FFFFF',
    '#870000', '#87005F', '#870087', '#8700AF', '#8700D7', '#8700FF',
    '#875F00', '#875F5F', '#875F87', '#875FAF', '#875FD7', '#875FFF',
    '#878700', '#87875F', '#878787', '#8787AF', '#8787D7', '#8787FF',
    '#87AF00', '#87AF5F', '#87AF87', '#87AFAF', '#87AFD7', '#87AFFF',
    '#87D700', '#87D75F', '#87D787', '#87D7AF', '#87D7D7', '#87D7FF',
    '#87FF00', '#87FF5F', '#87FF87', '#87FFAF', '#87FFD7', '#87FFFF',
    '#AF0000', '#AF005F', '#AF0087', '#AF00AF', '#AF00D7', '#AF00FF',
    '#AF5F00', '#AF5F5F', '#AF5F87', '#AF5FAF', '#AF5FD7', '#AF5FFF',
    '#AF8700', '#AF875F', '#AF8787', '#AF87AF', '#AF87D7', '#AF87FF',
    '#AFAF00', '#AFAF5F', '#AFAF87', '#AFAFAF', '#AFAFD7', '#AFAFFF',
    '#AFD700', '#AFD75F', '#AFD787', '#AFD7AF', '#AFD7D7', '#AFD7FF',
    '#AFFF00', '#AFFF5F', '#AFFF87', '#AFFFAF', '#AFFFD7', '#AFFFFF',
    '#D70000', '#D7005F', '#D70087', '#D700AF', '#D700D7', '#D700FF',
    '#D75F00', '#D75F5F', '#D75F87', '#D75FAF', '#D75FD7', '#D75FFF',
    '#D78700', '#D7875F', '#D78787', '#D787AF', '#D787D7', '#D787FF',
    '#D7AF00', '#D7AF5F', '#D7AF87', '#D7AFAF', '#D7AFD7', '#D7AFFF',
    '#D7D700', '#D7D75F', '#D7D787', '#D7D7AF', '#D7D7D7', '#D7D7FF',
    '#D7FF00', '#D7FF5F', '#D7FF87', '#D7FFAF', '#D7FFD7', '#D7FFFF',
    '#FF0000', '#FF005F', '#FF0087', '#FF00AF', '#FF00D7', '#FF00FF',
    '#FF5F00', '#FF5F5F', '#FF5F87', '#FF5FAF', '#FF5FD7', '#FF5FFF',
    '#FF8700', '#FF875F', '#FF8787', '#FF87AF', '#FF87D7', '#FF87FF',
    '#FFAF00', '#FFAF5F', '#FFAF87', '#FFAFAF', '#FFAFD7', '#FFAFFF',
    '#FFD700', '#FFD75F', '#FFD787', '#FFD7AF', '#FFD7D7', '#FFD7FF',
    '#FFFF00', '#FFFF5F', '#FFFF87', '#FFFFAF', '#FFFFD7', '#FFFFFF',
    // Greyscale colors [232..255]
    '#080808', '#121212', '#1C1C1C', '#262626', '#303030', '#3A3A3A',
    '#444444', '#4E4E4E', '#585858', '#626262', '#6C6C6C', '#767676',
    '#808080', '#8A8A8A', '#949494', '#9E9E9E', '#A8A8A8', '#B2B2B2',
    '#BCBCBC', '#C6C6C6', '#D0D0D0', '#DADADA', '#E4E4E4', '#EEEEEE',
  ].map(Color.FromHex);
}
