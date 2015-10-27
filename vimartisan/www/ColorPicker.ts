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

'use strict';

// Create event handler responsible for dismissing the popup
class DismissHandler implements EventListenerObject {
  private popup: HTMLElement;

  constructor() {
    // Use Create.. functions instead
  }

  // Checks if clicked target is hierarchically inside the popur
  private IsTargetInsidePopup(target: any) {
    while (target != document) {
      if (target == this.popup) {
       return true;
      }
      target = target.parentNode;
    }
    return false;
  }

  public handleEvent(event: MouseEvent) {
    if (this.IsTargetInsidePopup(event.target)) {
      return;
    }

    this.popup.parentNode.removeChild(this.popup);
    event.preventDefault();
    event.stopPropagation();
    window.removeEventListener('mouseup', this);
  }

  public static CreateFor(popup: HTMLElement) {
    let self = new DismissHandler();
    self.popup = popup;
    return self;
  }
}

/**
 * Wrapper tag for colorpicker box
 *
 * @param group      Vim style group
 * @param colorpart  'fg' or 'bg'
 *
 * private:
 * this.colorCode terminal color code [0-255] or -1 for if undefined
 */
class ColorPicker {

  // A div element showing the color
  private colorDiv: HTMLDivElement;

  private groupName: string;
  private colorPart: string;

  // Current color
  private colorCode: number;
  private selectedBox: HTMLElement;

  static Create(groupName: string, colorPart: string): ColorPicker {
    var self = new ColorPicker();

    self.colorDiv = document.createElement('div');
    self.colorDiv.id = 'colorpicker_' + colorPart + '_' + groupName;
    self.colorDiv.style.display = 'inline-block';
    self.colorDiv.style.width = '20px';
    self.colorDiv.style.height = '20px';
    self.colorDiv.style.cursor = 'pointer';

    self.groupName = groupName;
    self.colorPart = colorPart;

    let syntax = Vim.SyntaxGroups[self.groupName];
    if (self.colorPart == 'fg') {
      self.colorCode = syntax.GetFgColor().ColorCode();
    } else {
      self.colorCode = syntax.GetBgColor().ColorCode();
    }

    if (self.colorCode == -1) {
      self.colorDiv.style.backgroundImage = 'url("./transparency.png")';
    } else {
      self.colorDiv.style.backgroundColor = UserTerminal.GetColor(self.colorCode).CssRgba();
    }

    self.colorDiv.addEventListener('click', function(event) {
      this.ColorPicker256();
      event.stopPropagation();
    }.bind(self));

    return self;
  }

  public AppendTo(parent: HTMLElement) {
    parent.appendChild(this.colorDiv);
  }

  public SetColor(colorCode: number) {
    this.colorCode = colorCode;
    if (colorCode == -1) {
      this.colorDiv.style.backgroundColor = '';
      this.colorDiv.style.backgroundImage = 'url("./transparency.png")';
    } else {
      this.colorDiv.style.backgroundColor = UserTerminal.GetColor(colorCode).CssRgba();
      this.colorDiv.style.backgroundImage = '';
    }
  }

  // Callback that is executed when a color is picked by the colorpicker
  private OnNewColorPick(colorCode: number) {
    if (colorCode == -1) {
      this.colorDiv.style.backgroundColor = '';
      this.colorDiv.style.backgroundImage = 'url("./transparency.png")';
    } else {
      this.colorDiv.style.backgroundColor = UserTerminal.GetColor(colorCode).CssRgba();
      this.colorDiv.style.backgroundImage = '';
    }

    if (this.colorPart == 'fg') {
      Vim.SyntaxGroups[this.groupName].SetFgColor( new TermColor(colorCode) );
    } else {
      Vim.SyntaxGroups[this.groupName].SetBgColor( new TermColor(colorCode) );
    }
  }

  private ColorPickerOffset() {
    let cdOffset = $(this.colorDiv).offset();
    let baseOffset = $('#controls').offset();
    let baseScrollTop = $('#controls').scrollTop();

    return {top: cdOffset.top - baseOffset.top + baseScrollTop,
            left: cdOffset.left - baseOffset.left};
  }

  private CreateColorPickerDiv(): HTMLDivElement {
    let offset = this.ColorPickerOffset();

    let pickerPopup = document.createElement('div');
    pickerPopup.style.position = 'absolute';
    pickerPopup.style.top = (offset.top + 20) + 'px';
    pickerPopup.style.left = (offset.left + 20) + 'px';
    pickerPopup.style.backgroundColor = '#CCCCCC';

    let boxSize = 16;
    let offsetOut = 7;
    let offsetIn = 4;
    let offsetInExtra = 5;

    let offsetTop = offsetOut;
    for (let i = 0; i < XTerm.ChartColorCodes.length; ++i) {
      let row = XTerm.ChartColorCodes[i];

      let offsetLeft = offsetOut;

      if (i == 6 || i == 12 || i == 18 || i == 20) {
        offsetTop += offsetInExtra;
      }

      for (let j = 0, offsetLeft = 5; j < row.length; ++j) {

        let colorCode = row[j];

        let divIn = document.createElement('div');
        divIn.style.position = 'absolute';
        divIn.style.top = offsetTop + 'px';
        divIn.style.left = offsetLeft + 'px';
        divIn.style.width = boxSize + 'px';
        divIn.style.height = boxSize + 'px';

        divIn.classList.add('color-box');
        if (colorCode == this.colorCode) {
          this.selectedBox = divIn;
          divIn.classList.add('color-box-selected');
        }

        divIn.addEventListener('click', function(colorCode, event) {
          this.selectedBox.classList.remove('color-box-selected');
          this.OnNewColorPick(colorCode);
          this.selectedBox = event.target;
          this.selectedBox.classList.add('color-box-selected');
        }.bind(this, colorCode));

        if (colorCode == -1) {
          divIn.style.backgroundImage = 'url("./transparency.png")';
        } else {
          divIn.style.backgroundColor = UserTerminal.GetColor(colorCode).CssRgba();
        }
        pickerPopup.appendChild(divIn);

        offsetLeft += offsetIn + boxSize;
      }

      offsetTop += offsetIn + boxSize;
    }

    pickerPopup.style.width = (2 * offsetOut + 12 * boxSize + 11 * offsetIn) + 'px';
    pickerPopup.style.height =
        (2 * offsetOut + 23 * boxSize + 22 * offsetIn + 4 * offsetInExtra) + 'px';

    return pickerPopup;
  }

  // Creates and pops up the color picker popup.
  private ColorPicker256() {
    let pickerPopup = this.CreateColorPickerDiv();
    document.getElementById('controls').appendChild(pickerPopup);
    window.addEventListener('mouseup', DismissHandler.CreateFor(pickerPopup));
  }
}


