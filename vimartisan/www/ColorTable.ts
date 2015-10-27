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

// Color table (for showing/modifying vim styles)
// Shown on the right side of the page

'use strict';

class ColorTable {

  private colorTable: HTMLTableElement;

  public static Create() {
    var self = new ColorTable();
    self.Initialize();
    return self;
  }

  private Initialize() {
    this.colorTable = document.createElement('table');

    // Append title row
    this.colorTable.innerHTML =
        '<tr>' +
          '<th>\u25b6\u00a0\u00a0</th>' +
          '<th>Rule Name</th>' +
          '<th>FG Color</th>' +
          '<th>BG Color</th>' +
          '<th>Bold</th>' +
          '<th>Toggle</th>' +
          '<th class="color-table-col-preview">Preview</th>' +
        '</tr>';

    var groupNames = Vim.SyntaxGroupsOrdered();
    // Put the row for 'Normal' first, which is special
    groupNames.splice(groupNames.indexOf('Normal'), 1);
    groupNames.unshift('Normal');

    for (var groupName of groupNames) {
      let syntaxGroup = Vim.SyntaxGroups[groupName];
      var tagName = syntaxGroup.GetTagName();

      var rowId = 'syngroup-' + groupName;
      var row = document.createElement('tr');
      row.id = rowId;
      // Type of the syntax group, linkto or color
      row.dataset['groupType'] = (syntaxGroup.IsLink() ? 'linkto' : 'color');

      var col;
      col = document.createElement('td');
      var span = document.createElement('span');
      span.id = 'syngroup-' + groupName + '-triangle';
      span.textContent = '\u25b6';
      span.style.visibility = 'hidden';
      col.appendChild(span);
      row.appendChild(col);

      col = document.createElement('td');
      col.textContent = groupName;
      // Add some padding to the special group
      if (groupName == 'Normal') {
        col.style.paddingTop = '15px';
        col.style.paddingBottom = '15px';
      }
      row.appendChild(col);

      var linktoDis = (syntaxGroup.IsLink() ? 'table-cell' : 'none');
      var colorDis =  (syntaxGroup.IsLink() ? 'none' : 'table-cell');

      // Linkto info, spans 3 columns
      col = document.createElement('td');
      col.classList.add('linkto-col');
      col.style.display = linktoDis;
      col.colSpan = '3';
      col.appendChild(this.MakeLinktoDiv(groupName, syntaxGroup.GetLink()));
      row.appendChild(col);

      // Foreground color column
      col = document.createElement('td');
      col.classList.add('color-col');
      col.style.display = colorDis;
      syntaxGroup.fgColorPicker = ColorPicker.Create(groupName, 'fg');
      syntaxGroup.fgColorPicker.AppendTo(col);
      row.appendChild(col);

      // Background color column
      col = document.createElement('td');
      col.classList.add('color-col');
      col.style.display = colorDis;
      syntaxGroup.bgColorPicker = ColorPicker.Create(groupName, 'bg');
      syntaxGroup.bgColorPicker.AppendTo(col);
      row.appendChild(col);

      // Bold column
      col = document.createElement('td');
      col.classList.add('color-col');
      col.style.display = colorDis;
      col.appendChild(this.MakeBoldToggleDiv(groupName));
      row.appendChild(col);


      // Toggle column
      col = document.createElement('td');
      col.appendChild(this.MakeColorLinkToggleButton(groupName, syntaxGroup));
      row.appendChild(col);

      // Preview column
      col = document.createElement('td');
      col.classList.add('color-table-col-preview');
      col.appendChild(this.MakeGroupPreview(tagName));
      row.appendChild(col);

      this.colorTable.appendChild(row);
    }

  }

  public AppendTo(parent: HTMLElement) {
    parent.appendChild(this.colorTable);
  }


  private static GroupLinkChanged(group: string, linkSelector: HTMLSelectElement) {
    Vim.SyntaxGroups[group].SetLink(linkSelector.value);
  }

  private static ScrollFromGroup(groupName: string) {
    let group = Vim.SyntaxGroups[groupName];
    Page.ScrollToGroup(group.GetLink());
  }

  /**
   * Creates a div for jumping to another syntax group.
   *
   * @param targetGroup  Group to jump to
   * @return             Created div
   */
  private MakeLinktoDiv(group: string, targetGroup: string): HTMLElement {
    var div = document.createElement('div');

    var jumpBtn = document.createElement('a');
    // \u219f is up pointing arrow with two heads
    jumpBtn.textContent = '\u219f Links to: '
    jumpBtn.href = '#';
    jumpBtn.addEventListener('click', ColorTable.ScrollFromGroup.bind(this, group));
    div.appendChild(jumpBtn);

    let select = document.createElement('select');
    {
      // Add special case to front
      let option = document.createElement('option');
      option.appendChild(document.createTextNode('NO_LINK'));
      select.appendChild(option);
    }
    let groups = Object.keys(Vim.SyntaxGroups).sort();
    for (let i in groups) {
      let group = groups[i];
      let option = document.createElement('option');
      if (group == targetGroup) {
        option.selected = true;
      }
      option.appendChild(document.createTextNode(group));
      select.appendChild(option);
    }

    select.addEventListener('change', ColorTable.GroupLinkChanged.bind(this, group, select));

    div.appendChild(select);
    return div;
  }

  /**
   * Creates div to toggle bold style
   *
   * @param groupName  Vim groupname for which the toggle belongs
   * @return           Created div wrapped in jQuery object
   */
  private MakeBoldToggleDiv(groupName: string): HTMLElement {
    var syntax = Vim.SyntaxGroups[groupName];

    var input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = syntax.IsBold();
    input.setAttribute('data-toggleforgroup', groupName);
    input.addEventListener('click', function(event) {
      Vim.SyntaxGroups[groupName].SetBold(this.checked);
      event.stopPropagation();
    });
    return input;
  }

  /**
   * Makes a button to toggle between color/linkto states for a syntax group.
   *
   * @param syntaxGroup  Syntax for the group.
   * @return           Created button.
   */
  private MakeColorLinkToggleButton(groupName: string, syntaxGroup: SyntaxGroup): HTMLElement {
    var button = document.createElement('button');
    button.type = 'button';
    button.classList.add('btn');
    button.classList.add('btn-default');

    var MakeToggleFn = function(groupName, button) {
      return function() {
        console.log('Toggling ' + groupName);
        var row = document.getElementById('syngroup-' + groupName);

        var colorCols = <NodeListOf<HTMLElement>> row.getElementsByClassName('color-col');
        var linktoCols = <NodeListOf<HTMLElement>> row.getElementsByClassName('linkto-col');

        var colorColDisplay;
        var linktoColDisplay;

        if (row.dataset['groupType'] == 'color') {
          // Make it a linkto
          colorColDisplay = 'none';
          linktoColDisplay = 'table-cell';
          button.textContent = 'Set as Color';
          row.dataset['groupType'] = 'linkto';
          syntaxGroup.SetAsLink();
        } else {
          // Make it a color
          colorColDisplay = 'table-cell';
          linktoColDisplay = 'none';
          button.textContent = 'Set as Linkto';
          row.dataset['groupType'] = 'color';

          // Syntax should be resolved while this group is still a link
          console.log('Syntax was', Vim.SyntaxGroups[groupName]);
          syntaxGroup.ResolveSyntax();
          console.log('Syntax is', Vim.SyntaxGroups[groupName]);
          syntaxGroup.UpdateAssociatedColorPickers();
          syntaxGroup.SetAsColor();
        }

        for (let i = 0; i < colorCols.length; ++i) {
          colorCols[i].style.display = colorColDisplay;
        }
        for (let i = 0; i < linktoCols.length; ++i) {
          linktoCols[i].style.display = linktoColDisplay;
        }
      };
    };

    button.addEventListener('click', MakeToggleFn(groupName, button));
    if (syntaxGroup.IsLink()) {
      button.textContent = 'Set as Color';
    } else {
      button.textContent = 'Set as Linkto';
    }
    return button;
  }

  /**
   * Creates an element for syntax group preview.
   *
   * @param tagName  HTML tag name for the syntax group.
   * @return         Created preview element.
   */
  private MakeGroupPreview(tagName: string): HTMLElement {
    var pre = document.createElement('pre');
    pre.classList.add('terminal');
    var previewContent = document.createElement(tagName);
    previewContent.textContent = '  Preview  ';
    pre.appendChild(previewContent);
    return pre;
  }
}
