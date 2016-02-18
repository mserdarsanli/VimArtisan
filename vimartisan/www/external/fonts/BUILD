# Copyright 2016 Mustafa Serdar Sanli
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
        "//vimartisan/www/external:__pkg__",
    ],
)

load("/vimartisan/www/external/copy_resource", "copy_resource")

copy_resource("//third_party/bootstrap:glyphicons-halflings-regular.woff")
copy_resource("//third_party/bootstrap:glyphicons-halflings-regular.woff2")
copy_resource("//third_party/bootstrap:glyphicons-halflings-regular.ttf")

filegroup(
    name = "fonts",
    srcs = [
        ":glyphicons-halflings-regular.woff",
        ":glyphicons-halflings-regular.woff2",
        ":glyphicons-halflings-regular.ttf",
    ],
)
