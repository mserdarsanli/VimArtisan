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

# When bazel runs in sandboxed mode, typescript compiler fails as the directory
# is not made available.
new_local_repository(
  name = "typescript-compiler",
  path = "/usr/local/lib/node_modules/typescript",
  build_file = "./tools/typescript/BUILD.typescript-compiler",
)
