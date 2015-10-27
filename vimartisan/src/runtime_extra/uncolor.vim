" Copyright 2015 Mustafa Serdar Sanli
"
" This file is part of VimArtisan.
"
" VimArtisan is free software: you can redistribute it and/or modify
" it under the terms of the GNU General Public License as published by
" the Free Software Foundation, either version 3 of the License, or
" (at your option) any later version.
"
" VimArtisan is distributed in the hope that it will be useful,
" but WITHOUT ANY WARRANTY; without even the implied warranty of
" MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
" GNU General Public License for more details.
"
" You should have received a copy of the GNU General Public License
" along with VimArtisan.  If not, see <http://www.gnu.org/licenses/>.


" Uncolor.vim, makes all colors the same, so any override is easier to see

set background=light
hi clear
if exists("syntax_on")
  syntax reset
endif
let g:colors_name = "uncolor"

hi       Comment               ctermfg=197    ctermbg=197
hi       Normal                ctermfg=197    ctermbg=197
hi       Constant              ctermfg=197    ctermbg=197
hi       Special               ctermfg=197    ctermbg=197
hi       Identifier            ctermfg=197    ctermbg=197
hi       Statement             ctermfg=197    ctermbg=197
hi       PreProc               ctermfg=197    ctermbg=197
hi       Type                  ctermfg=197    ctermbg=197
hi       Visual                ctermfg=197    ctermbg=197
hi       Search                ctermfg=197    ctermbg=197
hi       Tag                   ctermfg=197    ctermbg=197
hi       Error                 ctermfg=197    ctermbg=197
hi       Todo                  ctermfg=197    ctermbg=197
hi       StatusLine            ctermfg=197    ctermbg=197
hi       MoreMsg               ctermfg=197    ctermbg=197
hi       ErrorMsg              ctermfg=197    ctermbg=197
hi       WarningMsg            ctermfg=197    ctermbg=197
hi       Question              ctermfg=197    ctermbg=197
hi       String                ctermfg=197    ctermbg=197
hi       Character             ctermfg=197    ctermbg=197
hi       Number                ctermfg=197    ctermbg=197
hi       Boolean               ctermfg=197    ctermbg=197
hi       Float                 ctermfg=197    ctermbg=197
hi       Function              ctermfg=197    ctermbg=197
hi       Conditional           ctermfg=197    ctermbg=197
hi       Repeat                ctermfg=197    ctermbg=197
hi       Label                 ctermfg=197    ctermbg=197
hi       Operator              ctermfg=197    ctermbg=197
hi       Keyword               ctermfg=197    ctermbg=197
hi       Exception             ctermfg=197    ctermbg=197
hi       Include               ctermfg=197    ctermbg=197
hi       Define                ctermfg=197    ctermbg=197
hi       Macro                 ctermfg=197    ctermbg=197
hi       PreCondit             ctermfg=197    ctermbg=197
hi       StorageClass          ctermfg=197    ctermbg=197
hi       Structure             ctermfg=197    ctermbg=197
hi       Typedef               ctermfg=197    ctermbg=197
hi       SpecialChar           ctermfg=197    ctermbg=197
hi       Delimiter             ctermfg=197    ctermbg=197
hi       SpecialComment        ctermfg=197    ctermbg=197
hi       Debug                 ctermfg=197    ctermbg=197
