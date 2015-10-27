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
        "//vimartisan/www:__pkg__",
    ],
)

# Copy must be made since they are needed to be served under the same directory
# tree.
load("copy_resource", "copy_resource")

copy_resource("//third_party/jquery:jquery_2.1.4.min.js")
copy_resource("//third_party/bootstrap:bootstrap_3.3.5.min.js")
copy_resource("//third_party/bootstrap:bootstrap_3.3.5.min.css")
copy_resource("//third_party/spectrum_colorpicker:spectrum_1.7.0.js")
copy_resource("//third_party/spectrum_colorpicker:spectrum_1.7.0.min.css")

filegroup(
    name = "external_resources",
    srcs = [
        ":bootstrap_3.3.5.min.css",
        ":bootstrap_3.3.5.min.js",
        ":jquery_2.1.4.min.js",
        ":spectrum_1.7.0.js",
        ":spectrum_1.7.0.min.css",
    ],
)
