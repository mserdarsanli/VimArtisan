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

class VimConfigManager {
  // Base syntax groups (whan syntax is off)
  public BaseSyntaxGroups: { [key:string]:SyntaxGroup; } = {};

  // Data for default colorschemes, like `blue`, `desert` etc
  // It is loaded after page load, as the data is big
  // TODO FIXME, type here is wrong.
  public BuiltinColorschemes: { [key:string]: { [key:string]:SyntaxGroup; } };

  public LanguageSyntax: { [key:string]: { [key:string]:SyntaxGroup; } } = {
    'NO_LANG_SELECTED': {}, // To handle the case when language data are not loaded
  };

  // Current syntax groups settings
  // TODO make private
  public SyntaxGroups: { [key:string]:SyntaxGroup; } = {};

  constructor() {
    this.BuiltinColorschemes = {};
    this.SyntaxGroups = {};
  }

  private SelectedColorscheme = 'default';
  private SelectedLanguage = 'NO_LANG_SELECTED';

  // Should be called when a coloscheme/language is changed
  private ReloadSyntaxGroups() {
    console.log('Reloading syntax groups:' +
        ' colorscheme is ' + this.SelectedColorscheme +
        ' language is ' + this.SelectedLanguage);

    this.SyntaxGroups = {};

    for (let attr in this.BaseSyntaxGroups) {
      this.SyntaxGroups[attr] = this.BaseSyntaxGroups[attr];
    }

    let csSyntax = this.BuiltinColorschemes[this.SelectedColorscheme]['syntax-groups'];
    for (let attr in csSyntax) {
      this.SyntaxGroups[attr] = csSyntax[attr];
    }

    let langSyntax = this.LanguageSyntax[this.SelectedLanguage]['syntax-groups'];
    for (let attr in langSyntax) {
      this.SyntaxGroups[attr] = langSyntax[attr];
    }

    // TODO Remove unused grups again?
    // Clear up unnecessary ones
    // If a syntax rule has vales ctermfg=NODE ctermbg=NONE
    // then it is most likely to be a rule as aparsing implementation detail
    // Detect all rules as such, along with rules that link to those rules,
    // then remove them from the syntax groups.
    // We can not directly remove them as later we might find another group
    // linking to it, so here a list of syntax groups is collected to be
    // removed later.
  }

  // Returns array of syntax group names
  // Order is pre-order traversal of the inverted linkto trees
  // The order is meant to put together linked groups
  // So when a user clicks on a cString, in order to update main group
  // they need to jump cString --> String --> Constant which are located
  // far from each other on unordered table.
  // With this new order, after jumping to 'cString',
  // 'Constant' should be visible nearly above.
  public SyntaxGroupsOrdered(): Array<string> {
    let backlinks: {[key: string]: Array<string>} = {};
    let orderedGroups : Array<string> = [];

    // Initialize backlinks array
    backlinks['ROOT_ELEMENT'] = [];
    for (let groupName in this.SyntaxGroups) {
      backlinks[groupName] = [];
    }

    // Fill backlinks
    for (let groupName in this.SyntaxGroups) {
      let group = this.SyntaxGroups[groupName];
      if (group.IsLink()) {
        backlinks[group.GetLink()].push(groupName);
      } else {
        backlinks['ROOT_ELEMENT'].push(groupName);
      }
    }

    let queue = ['ROOT_ELEMENT'];
    while (queue.length > 0) {
      let groupName = queue.shift();

      if (groupName != 'ROOT_ELEMENT') {
        orderedGroups.push(groupName);
      }
      for (let i = backlinks[groupName].length - 1; i >= 0; --i) {
        queue.unshift(backlinks[groupName][i]);
      }
    }

    return orderedGroups;
  }

  public SelectColorscheme(colorscheme: string) {
    console.log('Setting colorscheme to ' + colorscheme);
    this.SelectedColorscheme = colorscheme;
    this.ReloadSyntaxGroups();
    VimStyle.ResetCss();

    // Update colorpickers

    // Remove old color table
    let wrapperDiv = <HTMLDivElement> document.getElementById('div-syntax-groups');
    while (wrapperDiv.firstChild) {
      wrapperDiv.removeChild(wrapperDiv.firstChild);
    }
    // Replace with new table
    ColorTable.Create().AppendTo(wrapperDiv);
  };

  public SelectLanguage(language: string) {
    console.log('Setting language to ' + language);
    this.SelectedLanguage = language;
    this.ReloadSyntaxGroups();
    VimStyle.ResetCss();

    // Update colorpickers

    // Remove old color table
    let wrapperDiv = <HTMLDivElement> document.getElementById('div-syntax-groups');
    while (wrapperDiv.firstChild) {
      wrapperDiv.removeChild(wrapperDiv.firstChild);
    }
    // Replace with new table
    ColorTable.Create().AppendTo(wrapperDiv);
  }

  public LoadColorschemeFile(fileName: string, contents: string) {
    console.log('Loading colorscheme file: ', fileName);

    let colorscheme: {[key: string]: SyntaxGroup} = {};

    let trimFn = function(s: string){
      return s.trim();
    }

    let lines = contents.split('\n').map(trimFn);

    for (let line of lines) {
      let sg: SyntaxGroup = SyntaxGroup.Parse(line);
      if (!sg) {
        continue;
      }
      colorscheme[sg.GetGroupName()] = sg;
    }

    this.BuiltinColorschemes[fileName] = <any>{'syntax-groups': colorscheme};

    Page.UpdateColorschemesDropdown();
  }
}

var Vim: VimConfigManager = new VimConfigManager();
