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


declare var $: any;

// For managing terminal configuration like palettes, fg-bg colors etc.
class TerminalSettingsManager {

  // Set up initial page elements
  public Initialize() {
    console.log('Initializing Terminal Settings');

    // Terminal FG Colorpicker
    $("#terminal-text-colorpicker").spectrum({
      color: "#fff",
      change: function(c) {
        UserTerminal.SetFgColor(Color.FromRGB(c._r, c._g, c._b));
        TerminalSettings.UpdateCss();
      }
    });

    // Terminal BG Colorpicker
    $("#terminal-background-colorpicker").spectrum({
      color: "#000",
      change: function(c) {
        UserTerminal.SetBgColor(Color.FromRGB(c._r, c._g, c._b));
        TerminalSettings.UpdateCss();
      }
    });

    // Terminal colorpicker for colors [0..15]
    for (var i = 0; i < 16; ++i) {
      var pickerElement = $('#terminal-palette' + i + '-colorpicker');
      pickerElement.spectrum({
        color: UserTerminal.GetColor(i).CssRgba(),
        change: function(colorCode, c) {
          UserTerminal.SetColor(colorCode, Color.FromRGB(c._r, c._g, c._b));
          TerminalSettings.UpdateCss();
        }.bind(null, i)
      });
    }

    // Populate terminal colorschemes selector
    {
      let colorschemes = UserTerminal.GetColorSchemes();
      let csSelector = <HTMLUListElement>document.getElementById("terminal-colorscheme-reset-list");
      for (let i = 0; i < colorschemes.length; ++i) {
        let a = document.createElement('a');
        a.addEventListener('click',
            TerminalSettings.ResetTerminalColorscheme.bind(TerminalSettings, colorschemes[i]));
        a.href = '#';
        a.appendChild(document.createTextNode(colorschemes[i]));
        let li = document.createElement('li');
        li.appendChild(a);

        csSelector.appendChild(li);
      }
    }

    // Populate terminal palette selector
    {
      let palettes = UserTerminal.GetPalettes();
      let pSelector = <HTMLUListElement>document.getElementById("terminal-palette-reset-list");
      for (let i = 0; i < palettes.length; ++i) {
        let a = document.createElement('a');
        a.addEventListener('click',
            TerminalSettings.ResetColorPalette.bind(TerminalSettings, palettes[i]));
        a.href = '#';
        a.appendChild(document.createTextNode(palettes[i]));
        let li = document.createElement('li');
        li.appendChild(a);

        pSelector.appendChild(li);
      }
    }
  }

  public ResetColorPalette(paletteName: string) {
    UserTerminal.UsePalette(paletteName);

    for (var i = 0; i < 16; ++i) {
      var picker = $('#terminal-palette' + i + '-colorpicker');
      picker.spectrum('set', UserTerminal.GetColor(i).CssRgba());
    }
    TerminalSettings.UpdateCss();
  }

  public ResetTerminalColorscheme(colorSchemeName: string) {
    UserTerminal.UseColorScheme(colorSchemeName);

    $('#terminal-text-colorpicker').spectrum('set',
        UserTerminal.GetFgColor());
    $('#terminal-background-colorpicker').spectrum('set',
        UserTerminal.GetBgColor());

    TerminalSettings.UpdateCss();
  }

  /**
   * Recomputes and updates all stylesheet values related to terminal styles
   */
  public UpdateCss() {
    let SsName = 'Style-TerminalSettings';
    let style = <HTMLStyleElement> document.getElementById(SsName);
    let ss = <CSSStyleSheet> style.sheet;

    if (ss == null) {
      console.error('Unable to find stylesheet: ', SsName);
      return;
    }

    // Clear
    while (ss.cssRules.length) {
      ss.deleteRule(0);
    }

    var ruleText =
        '.terminal {\n' +
        '  color: ' + UserTerminal.GetFgColor().CssRgba() + ';\n' +
        '  background-color: ' + UserTerminal.GetBgColor().CssRgba() + ';\n' +
        '}\n';
    ss.insertRule(ruleText, ss.cssRules.length);

    // Any change in terminal CSS might affect Vim styles too?
    VimStyle.ResetCss();
  };
}
