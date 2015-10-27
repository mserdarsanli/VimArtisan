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


// For managing the stylsheet for Vim color groups
class VimStyleSheetManager {

  // StyleSheet for holding styles for vim related tags like <v-type>
  private styleSheet: CSSStyleSheet;

  constructor() {
    let style = <HTMLStyleElement> document.getElementById('Style-SyntaxGroups');
    this.styleSheet = <CSSStyleSheet> style.sheet;
   }

  // Recomputes and updates all stylesheet values related to vim groups
  // Although this call is potentially slow, it is most of the times necesary.
  // Since a syntax rule can not easily detect what other rules might be
  // affected by a change.
  public ResetCss() {
    while (this.styleSheet.cssRules.length) {
      this.styleSheet.deleteRule(0);
    }

    // Generate CSS rules for base groups
    for (let groupName in Vim.SyntaxGroups) {
      let group = Vim.SyntaxGroups[groupName];
      group.AddCssStyleTo(this.styleSheet);
    }
  };

  public GetStyleSheet() {
    return this.styleSheet;
  }
}


var VimStyle = new VimStyleSheetManager();
