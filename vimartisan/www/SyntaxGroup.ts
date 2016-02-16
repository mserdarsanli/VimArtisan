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


// Syntax group, used for highlighting a region of source file.
// Has fgcolor bgcolor and various other properties
// Can instead be a link to other group also.
class SyntaxGroup {
  private name: string;

  // IsLink is sepatate from linkto because linkto valueo should be kept
  // even after the syntax rule is made into a color.
  // Since it can go back to be a link later, using old linto value would
  // be useful.
  private isLink: boolean;
  private linkto: string;

  private fgColor: TermColor;
  private bgColor: TermColor;

  private isBold: boolean;

  // References to color pickers, if any
  public fgColorPicker: ColorPicker;
  public bgColorPicker: ColorPicker;

  static FromLink(name: string, linkto: string): SyntaxGroup {
    var self:SyntaxGroup = new SyntaxGroup();
    self.isBold = false;
    self.name = name;

    self.isLink = true;
    self.linkto = linkto;

    // Links also have color components
    // Even though they are useless initially, they can be used
    // if user switches group to be a color type
    self.fgColor = new TermColor(-1);
    self.bgColor = new TermColor(-1);

    return self;
  }

  static FromColor(name: string, fg: TermColor, bg: TermColor): SyntaxGroup {
    var self:SyntaxGroup = new SyntaxGroup();
    self.isBold = false;
    self.name = name;
    self.fgColor = fg;
    self.bgColor = bg;

    self.isLink = false;
    self.linkto = 'NO_LINK';

    return self;
  }

  static Parse(line: string): SyntaxGroup {
    // Try parsing `hi link`
    if (/hi\s*link/.exec(line))
    {
      let res = /hi\s*link\s*(\w*)\s*(\w*)/.exec(line);
      if (!res) {
        return null;
      }
      return SyntaxGroup.FromLink(res[1], res[2]);
    }

    // Parse `hi` line, example:
    // hi SpecialKey	 ctermfg=4 ctermbg=NONE cterm=NONE guifg=#3465a4 guibg=NONE gui=NONE
    // TODO handle color names like `yellow`

    let groupName: string;
    let ctermfg: TermColor;
    let ctermbg: TermColor;

    // Extract group name
    {
      let res = /hi\s(\w*)\s/.exec(line);
      if (!res) {
        return null;
      }
      groupName = res[1];
    }

    // Extract ctermfg
    {
      let res = /.*\sctermfg\s*=\s*(\w*)/i.exec(line);
      if (!res) {
       return null;
      }
      if (res[1] == 'none') {
        ctermfg = new TermColor(-1);
      } else {
        ctermfg = new TermColor(parseInt(res[1]));
      }
    }

    // Extract ctermbg
    {
      let res = /.*\sctermbg\s*=\s*(\w*)/i.exec(line);
      if (!res) {
       return null;
      }
      if (res[1] == 'none') {
        ctermbg = new TermColor(-1);
      } else {
        ctermbg = new TermColor(parseInt(res[1]));
      }
    }

    return SyntaxGroup.FromColor(groupName, ctermfg, ctermbg);
  }

  public IsLink(): boolean {
    return this.isLink;
  }

  public SetAsColor() {
    this.isLink = false;
    VimStyle.ResetCss();
  }

  public SetAsLink() {
    this.isLink = true;
    VimStyle.ResetCss();
  }

  public GetLink(): string {
    return this.linkto;
  }

  public SetLink(link: string) {
    this.linkto = link;
    this.isLink = true;
    VimStyle.ResetCss();
  }

  public IsBold(): boolean {
    return this.isBold;
  }

  public SetBold(bold: boolean) {
    this.isBold = bold;
    VimStyle.ResetCss();
  }

  public GetFgColor(): TermColor {
    return this.fgColor;
  }

  public SetFgColor(col: TermColor) {
    this.fgColor = col;
    VimStyle.ResetCss();
  }

  public GetBgColor(): TermColor {
    return this.bgColor;
  }

  public SetBgColor(col: TermColor) {
    this.bgColor = col;
    VimStyle.ResetCss();
  }

  // Helper function to update colorpickers
  // Since not all SetFgColor etc calls are caused by colorpickers
  // This is to keep coorpickers synchronized with the actual colors
  public UpdateAssociatedColorPickers() {
    console.log('Updating pickers for', this.GetGroupName());

    this.fgColorPicker.SetColor(this.GetFgColor().ColorCode());
    this.bgColorPicker.SetColor(this.GetBgColor().ColorCode());
  }

  // Traverses linked syntax groups and updates fgColor, bgColor of this group.
  // It does not change whether this is a linked group or not.
  public ResolveSyntax() {
    if (this.IsLink()) {
      if (this.GetLink() == 'NO_LINK') {
        return; // Nothing to resolve
      }
      var linkedGroup: SyntaxGroup = Vim.SyntaxGroups[this.GetLink()];
      linkedGroup.ResolveSyntax();
      this.fgColor = linkedGroup.fgColor;
      this.bgColor = linkedGroup.bgColor;
      this.isBold  = linkedGroup.isBold;
    }
  }

  // Adds CSS rule for this group with the resolved syntax value
  public AddCssStyleTo(styleSheet: CSSStyleSheet) {
    this.ResolveSyntax();

    var tagName = this.GetTagName();

    var fgTermColor: TermColor = Vim.SyntaxGroups['Normal'].GetFgColor();
    var bgTermColor: TermColor = Vim.SyntaxGroups['Normal'].GetBgColor();

    if (this.GetFgColor().ColorCode() != -1) {
      fgTermColor = this.GetFgColor();
    }
    if (this.GetBgColor().ColorCode() != -1) {
      bgTermColor = this.GetBgColor();
    }

    var fgColorRgba =
        (fgTermColor.ColorCode() == -1 ? UserTerminal.GetFgColor().CssRgba()
                                       : UserTerminal.GetColor(fgTermColor.ColorCode()).CssRgba());
    var bgColorRgba =
        (bgTermColor.ColorCode() == -1 ? UserTerminal.GetBgColor().CssRgba()
                                       : UserTerminal.GetColor(bgTermColor.ColorCode()).CssRgba());


    var ruleText =
         tagName + ' {\n' +
        '  color: ' + fgColorRgba + ';\n' +
        '  background-color: ' + bgColorRgba + ';\n' +
        '  font-weight: ' + (this.isBold ? 'bold' : 'normal') + ';\n' +
        '}\n';

    styleSheet.insertRule(ruleText, styleSheet.cssRules.length);

    // TODO FIXME selecting text causes page to stop working properly

    // Inverts fg and bg color when selected
    var invRuleText =
         tagName + '::selection {\n' +
        '  color: ' + bgColorRgba + ';\n' +
        '  background-color: ' + fgColorRgba + ';\n' +
        '}\n';
    // Firefox does not accept ::selection :(
    var invRuleTextMoz =
         tagName + '::-moz-selection {\n' +
        '  color: ' + bgColorRgba + ';\n' +
        '  background-color: ' + fgColorRgba + ';\n' +
        '}\n';

    // One of the following blocks should succeed?
    try {
      styleSheet.insertRule(invRuleText, styleSheet.cssRules.length);
    } catch (e) {
    }
    try {
      styleSheet.insertRule(invRuleTextMoz, styleSheet.cssRules.length);
    } catch (e) {
    }
  }


  // Converts vim syntax grop name to html tag name
  // Ex: 'String' => 'v-string'
  // Ex: 'PreProc' => 'v-pre-proc'
  public GetTagName() {
    var groupName = this.name;
    var tagName = 'v';
    for (let i = 0; i < groupName.length; ++i) {
      if (groupName[i] == groupName[i].toUpperCase()) {
        // Prepend '-' if character is upercase
        tagName += '-';
      }
      tagName += groupName[i].toLowerCase();
    }
    return tagName;
  };

  // TODO: Group name should behave case insensitively.
  // https://github.com/mserdarsanli/VimArtisan/issues/2
  public GetGroupName() {
    return this.name;
  };

  // Converts html tag name to vim syntax grop name
  // Ex: 'v-string' => 'String'
  // Ex: 'v-pre-proc' => 'PreProc'
  public static ConvertTagNameToGroupName(tagName: string) {
    var groupName = '';
    tagName = tagName.substr(1);

    for (let i = 0; i < tagName.length; ++i) {
      if (tagName[i] == '-') {
        ++i;
        groupName += tagName[i];
        continue;
      }
      groupName += tagName[i].toLowerCase();
    }

    return groupName;
  };
}
