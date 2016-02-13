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

declare var $: any; // TODO :(

// Define user's terminal
var UserTerminal: Terminal = new GnomeTerminal();

// Define Terminal Settings handler
var TerminalSettings: TerminalSettingsManager = new TerminalSettingsManager();

class Page {

  public static Initialize() {
    // Update snippets language list
    {
      let langCodes: Array<string> = LangNames.GetSnippetLangs();
      let languagesListElem = <HTMLUListElement> document.getElementById("snippet-lang-select-list");

      for (let i = 0; i < langCodes.length; ++i) {
        let langCode = langCodes[i];
        let langName = LangNames.GetLangName(langCode);

        let a = document.createElement('a');
        a.addEventListener('click',
            Page.PickSnippetLang.bind(Page, langCode));
        a.href = '#';
        a.appendChild(document.createTextNode(langName));
        let li = document.createElement('li');
        li.appendChild(a);

        languagesListElem.appendChild(li);
      }
    }

    let loadColorschemeBtn = document.getElementById("load-colorscheme-button");
    loadColorschemeBtn.addEventListener('click', Page.LoadColorscheme);

    Page.LoadBaseSyntaxGroups();
    Page.LoadBuiltinColorschemes();
    // Load initial terminals for the default language
    Page.PickSnippetLang('cpp');
  }

  // Trigger loading base syntax groups
  public static LoadBaseSyntaxGroups() {
    let req = new XMLHttpRequest();

    req.onreadystatechange = function() {
      if (req.readyState !== 4) {
        return;
      }
      if (req.status !== 200) {
        console.error('Unable to load base syntax groups');
        return;
      }

      Page.BaseSyntaxGroupsLoaded(req.responseText);
    }
    req.open('GET', 'runtime/base.eval.js');
    req.send();
  }

  private static BaseSyntaxGroupsLoaded(res: string) {
    Vim.BaseSyntaxGroups = eval(res)['syntax-groups'];
    console.log('Base syntax groups loaded');
  }

  /**
   * Function to trigger loading coloschemes data
   */
  public static LoadBuiltinColorschemes() {
    $.get('./runtime/colorschemes.eval.js', Page.BuiltinColorschemesLoaded, 'script')
      .fail(function() {
        console.log('Error loading colorschemes');
      });
  };

  /**
   * Callback for when colorschemes data is available
   *
   * @param res  loaded colorscheme data object
   */
  private static BuiltinColorschemesLoaded = function(res: string) {
    Vim.BuiltinColorschemes = eval(res);

    console.log('BuiltinColorschemes', Vim.BuiltinColorschemes);

    // Add colorschemes list to the drowdown
    let btn = document.getElementById('vim-builtin-colorscheme-picker-button');
    btn.classList.remove('disabled');

    let ul = document.getElementById('vim-builtin-colorschemes-list');
    // Clean up the list
    while (ul.firstChild) {
      ul.removeChild(ul.firstChild);
    }

    for (var colorscheme in Vim.BuiltinColorschemes) {
      let li = document.createElement('li');
      let a = document.createElement('a');
      a.href = '#';
      a.textContent = colorscheme;
      a.addEventListener('click', Vim.SelectColorscheme.bind(Vim, colorscheme));
      li.appendChild(a);

      ul.appendChild(li);
    }

    // Load the default colorscheme
    console.log('Loading default colorscheme');
    Vim.SelectColorscheme('default');
  };

  // TODO move to another class
  private static LastScrolledGroupTriangle: any = undefined;

  public static GroupSelected(event) {
    console.log('Event target was', event.target);
    var tagName = $(event.target).prop('tagName');
    var groupName = SyntaxGroup.ConvertTagNameToGroupName(tagName);
    Page.ScrollToGroup(groupName);
  }

  public static ScrollToGroup(groupName) {
    // As static variable
    if (typeof Page.LastScrolledGroupTriangle != 'undefined') {
      Page.LastScrolledGroupTriangle.style.visibility = 'hidden';
    }
    // Make new group have the triangle pointer
    Page.LastScrolledGroupTriangle =
        document.getElementById('syngroup-' + groupName + '-triangle');
    Page.LastScrolledGroupTriangle.style.visibility = 'visible';

    var scrollY = $('#syngroup-' + groupName).offset().top - $('#controls').offset().top + $('#controls').scrollTop();
    $('#controls').animate({
      scrollTop: scrollY,
    }, 1000);
  }

  public static PickSnippetLang(langCode: string) {
    $('#snippet-lang-dropdown-text').text('Snippets in ' + LangNames.GetLangName(langCode));
    Page.LoadSnippetsForLang(langCode);
  }

  public static LoadSnippetsForLang(lang: string) {
    $.get('./runtime/' + lang + '.eval.js', Page.LangDataLoaded.bind(Page, lang), 'script')
      .fail(function() {
        console.log('Error loading snippet');
      });
  }

  public static LangDataLoaded(language:string, res: any) {
    res = eval(res);
    console.log('Loading language data');
    var terminals = $('#terminals').empty();
    for (var i = 0; i < res.snippets.length; ++i) {
      var snippet = res.snippets[i];

      terminals.append(
          $('<div>').append(
              $('<pre>').addClass('terminal').append(
                  $('<code>', {id: 'terminal' + i})
                      .html(snippet['terminal-contents'])
              )
          )
      );
    }

    Vim.LanguageSyntax[language] = res['lang-syntax'];
    Vim.SelectLanguage(language);
  }

  private static GenerateColorschemeFile(csName: string): string {
    // Create colorscheme file contents
    var fileContents =
      '" Created with VimArtisan (Vim Colorscheme Generator)\n' +
      '" http://mserdarsanli.github.io/VimArtisan/index.html\n' +
      '\n' +
      'hi clear\n' +
      '\n' +
      'if exists("syntax_on")\n' +
      '    syntax reset\n' +
      'endif\n' +
      '\n' +
      'let colors_name = "' + csName + '"\n' +
      '\n' +
      'set bg&\n' +
      '\n';

    for (var groupName in Vim.SyntaxGroups) {
      let line = 'hi ' + groupName + '\t';

      let syntax = Vim.SyntaxGroups[groupName];
      // TODO support linkto

      let fgColor = syntax.GetFgColor();
      let bgColor = syntax.GetBgColor();

      line += ' ctermfg=' + fgColor.VimTermCode();
      line += ' ctermbg=' + bgColor.VimTermCode();
      line += ' cterm=NONE';
      line += ' guifg=' + fgColor.VimGuiCode();
      line += ' guibg=' + bgColor.VimGuiCode();
      line += ' gui=NONE';

      fileContents += line + '\n';
    }

    return fileContents;
  }

  public static SaveCurrentStyle() {
    $('#color-scheme-save-modal').modal('show');
  }

  public static DownloadColorscheme() {
    let csName = (<HTMLInputElement>document.getElementById('colorscheme-name-input')).value;

    let a = <HTMLAnchorElement>document.getElementById('colorscheme-download-anchor');
    a.href = 'data:application/octet-stream;base64,'
           + window.btoa(Page.GenerateColorschemeFile(csName));
    a['download'] = csName + '.vim';

    a.click();
  }

  public static LoadColorschemeModal() {
    $('#color-scheme-load-modal').modal('show');
  }

  public static LoadColorscheme() {
    let filePicker = <HTMLInputElement>document.getElementById('load-colorscheme-file');
    if (filePicker.files.length != 1) {
      alert('No file selected');
      return;
    }

    let file = filePicker.files[0];

    let reader = new FileReader();
    reader.onload = function(e) {
      Vim.LoadColorschemeFile(file.name, reader.result);
    }
    reader.readAsText(file);
  }

  public static ConfigureTerminal() {
    $('#configure-terminal-modal').modal('show');
  }

  public static ShowAboutPopup() {
    $('#about-modal').modal('show');
  }

}
