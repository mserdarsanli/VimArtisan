# VimArtisan

VimArtisan is a colorscheme generator for Vim. See it live at
https://mserdarsanli.github.io/VimArtisan/

VimArtisan is made by Mustafa Serdar Sanli.

## Copying

VimArtisan, except for the code snippets used, is licensed under
GNU General Public License Version 3, or any later version.
See COPYING file for license text.

Code snippets used in the project, located under vimartisan_snippets
directory, are licensed under GNU Free Documentation License 1.2.
See file vimartisan_snippets/README.md for details.

## Building

Building VimArtisan requires vagrant with virtualbox provider setup.
All dependencies are installed in vagrant environment by bootstrap script.

To log into the box, execute

    vagrant up && vagrant ssh

Source is made available at `/VimArtisan` directory. to compile and serve
VimArtisan, execute following in the vagrant box.

    cd /VimArtisan
    bazel build vimartisan/www:all
    ./bazel-bin/vimartisan/www/launch_www

at this point it is being served at http://192.168.33.10:8123/index.html which
can be opened with a browser in host computer.

## Deployment

VimArtisan output is a static directory of HTML and generated js files.
The contents of the directory can be copied to any static host.
