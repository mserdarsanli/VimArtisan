# Copyright 2015 Mustafa Serdar Sanli
#
# This file is part of VimArtisan.
#
# VimArtisan is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# VimArtisan is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with VimArtisan.  If not, see <http://www.gnu.org/licenses/>.

load("/tools/js/typescript", "typescript_compile_all")

genrule(
    name = "grab_langnames",
    srcs = ['//vimartisan/www/runtime:LangNames.gen.ts'],
    outs = ['LangNames.gen.ts'],
    cmd = "cp $< $@",
)

# Order is important, dependent files should appear before
TS_FILES = [
  'LangNames.gen.ts',
  'Color.ts',
  'TermColor.ts',
  'SyntaxGroup.ts',
  'VimConfig.ts',
  'VimStyle.ts',
  'Terminal.ts',
  'TerminalSettings.ts',
  'GnomeTerminal.ts',
  "ColorTable.ts",
  "ColorPicker.ts",
  'Page.ts',
]

typescript_compile_all('Gen.ts.js', TS_FILES)

filegroup(
    name = "site_files_core",
    srcs = [
        "index.html",
        "transparency.png",
        "VimArtisan.css",
        "Vim-Icon-Colored.png", # Favicon
        ":Gen.ts.js",
    ],
)

sh_binary(
    name = "launch_www",
    srcs = ["launch_www.sh"],
    data = [
        ":site_files_core",
        "//vimartisan/www/runtime:gen_all_files",
        "//vimartisan/www/external:external_resources",
    ],
)
