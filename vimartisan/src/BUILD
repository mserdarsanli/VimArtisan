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

package(
    default_visibility = [
        "//vimartisan/www/runtime:__pkg__",
    ],
)

cc_binary(
    name = "GenData",
    srcs = [
        "Main.cpp",
        "Types.cpp",
        "BaseSyntaxGroups.cpp",
        "BuiltinColorschemeData.cpp",
        "ExtractLanguageSyntax.cpp",
        "ExtractSnippetData.cpp",
        "SyntaxExtractor.cpp",
        "Utils.cpp",
        "VimHighlight.cpp",
    ],
    deps = [
        ":VimSession",
    ],
    linkopts = [
      "-lutil", # For openpty
      "-lgflags",
    ],
    data = [
        "runtime_extra/uncolor.vim",
    ],
)

cc_library(
    name = "VimSession",
    srcs = [
        "VimSession.cpp",
    ],
    hdrs = [
        "VimSession.hpp",
    ],
    deps = [
        "//term_emu",
        "//utils:runfiles",
    ],
    data = [
        # Vim binary is needed
        "//third_party/vim:vim",
    ],
)

sh_binary(
    name = "test_terminal",
    srcs = [
        "test_terminal.sh",
    ],
)
