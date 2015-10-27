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

# Snippet files are located under snippets dir
# Here they are defined in a list of tuples
# each tuple is of form ('lang_code', 'lang_name', [snippets...])
# and each snippet is define as a tuple of form
# (id, 'snippet_title', 'snippet_file')
# Since baze does not support iterating on arrays with indices,
# id is also written manually here
SNIPPETS = [
    ("ada", "Ada", [
        (1, "Find Missing Perm", "snippets/rosetta_Find_the_missing_permutation/code.ada"),
        (2, "File Input/Output", "snippets/rosetta_File_input_output/code.ada"),
    ]),
    ("awk", "AWK", [
        (1, "File Input/Output", "snippets/rosetta_File_input_output/code.awk"),
    ]),
    ("c", "C", [
        (1, "Find Missing Perm", "snippets/rosetta_Find_the_missing_permutation/code.c"),
        (2, "File Input/Output", "snippets/rosetta_File_input_output/code.c"),
    ]),
    ("clojure", "Clojure", [
        (1, "Find Missing Perm", "snippets/rosetta_Find_the_missing_permutation/cole.clj"),
        (2, "File Input/Output", "snippets/rosetta_File_input_output/code.clj"),
    ]),
    ("lisp", "Lisp", [
        (1, "Find Missing Perm", "snippets/rosetta_Find_the_missing_permutation/code.cl"),
        (2, "File Input/Output", "snippets/rosetta_File_input_output/code.cl"),
    ]),
    ("cpp", "C++", [
        (1, "Hello, World!", "snippets/HelloWorld.cpp"),
        (2, "Arguments",     "snippets/Arguments.cpp"),
        (3, "Find Missing Perm", "snippets/rosetta_Find_the_missing_permutation/code.cpp"),
        (4, "File Input/Output", "snippets/rosetta_File_input_output/code.cpp"),
    ]),
    ("java", "Java", [
        (1, "Hello, World!", "snippets/HelloWorld.java"),
        (2, "Javadoc",       "snippets/Javadoc.java"),
        (3, "Find Missing Perm", "snippets/rosetta_Find_the_missing_permutation/code.java"),
        (4, "File Input/Output", "snippets/rosetta_File_input_output/code.java"),
    ]),
    ("cs", "C#", [
        (1, "Find Missing Perm", "snippets/rosetta_Find_the_missing_permutation/code.cs"),
        (2, "File Input/Output", "snippets/rosetta_File_input_output/code.cs"),
    ]),
    ("d", "D", [
        (1, "Find Missing Perm", "snippets/rosetta_Find_the_missing_permutation/code.d"),
        (2, "File Input/Output", "snippets/rosetta_File_input_output/code.d"),
    ]),
    ("erlang", "Erlang", [
        (1, "Find Missing Perm", "snippets/rosetta_Find_the_missing_permutation/code.erl"),
        (2, "File Input/Output", "snippets/rosetta_File_input_output/code.erl"),
    ]),
    ("go", "Go", [
        (1, "Find Missing Perm", "snippets/rosetta_Find_the_missing_permutation/code.go"),
        (2, "File Input/Output", "snippets/rosetta_File_input_output/code.go"),
    ]),
    ("haskell", "Haskell", [
        (1, "Find Missing Perm", "snippets/rosetta_Find_the_missing_permutation/code.hs"),
        (2, "File Input/Output", "snippets/rosetta_File_input_output/code.hs"),
    ]),
    ("javascript", "JavaScript", [
        (1, "Find Missing Perm", "snippets/rosetta_Find_the_missing_permutation/code.js"),
        (2, "File Input/Output", "snippets/rosetta_File_input_output/code.js"),
    ]),
    ("lua", "Lua", [
        (1, "File Input/Output", "snippets/rosetta_File_input_output/code.lua"),
    ]),
    ("matlab", "MATLAB", [
        (1, "Find Missing Perm", "snippets/rosetta_Find_the_missing_permutation/code.matlab"),
    ]),
    ("ocaml", "OCaml", [
        (1, "Find Missing Perm", "snippets/rosetta_Find_the_missing_permutation/code.ml"),
        (2, "File Input/Output", "snippets/rosetta_File_input_output/code.ml"),
    ]),
    # FIXME Perl 6 is not being highlighted
    ("perl6", "Perl 6", [
        (1, "Find Missing Perm", "snippets/rosetta_Find_the_missing_permutation/code.p6"),
        (2, "File Input/Output", "snippets/rosetta_File_input_output/code.p6"),
    ]),
    ("perl", "Perl", [
        (1, "Find Missing Perm", "snippets/rosetta_Find_the_missing_permutation/code.perl"),
        (2, "File Input/Output", "snippets/rosetta_File_input_output/code.perl"),
    ]),
    ("php", "PHP", [
        (1, "Find Missing Perm", "snippets/rosetta_Find_the_missing_permutation/code.php"),
        (2, "File Input/Output", "snippets/rosetta_File_input_output/code.php"),
    ]),
    ("python", "Python", [
        (1, "Find Missing Perm", "snippets/rosetta_Find_the_missing_permutation/code.py"),
        (2, "File Input/Output", "snippets/rosetta_File_input_output/code.py"),
    ]),
    ("ruby", "Ruby", [
        (1, "Find Missing Perm", "snippets/rosetta_Find_the_missing_permutation/code.rb"),
        (2, "File Input/Output", "snippets/rosetta_File_input_output/code.rb"),
    ]),
]

