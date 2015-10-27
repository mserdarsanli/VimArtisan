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

#include <cstdlib>
#include <fstream>
#include <iostream>
#include <string>
#include <sstream>
#include <vector>

#include <fcntl.h>
#include <errno.h>
#include <pty.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <termios.h>
#include <unistd.h>

#include <gflags/gflags.h>

#include "term_emu/Terminal.hpp"
#include "utils/Runfiles.hpp"

#include "BuiltinColorschemeData.hpp"
#include "Utils.hpp"
#include "VimHighlight.hpp"
#include "VimSession.hpp"

using namespace std;

DEFINE_string(out, "", "Output file name");

// The list here should track default vim colorschemes
// Whenever new vim version is found, this list should be updated.
// TODO, move this to a BUILD file or automatically extract from vim runtime dir
vector<string> BuiltinColorschemeFiles = {
  "blue",
  "darkblue",
  "default",
  "delek",
  "desert",
  "elflord",
  "evening",
  "koehler",
  "morning",
  "murphy",
  "pablo",
  "peachpuff",
  "ron",
  "shine",
  "slate",
  "torte",
  "zellner",
};

// Extracts list of syntax rules for given colorscheme
SyntaxRuleList ExtractBuiltinColorschemeRules(const string &colorscheme)
{
	SyntaxRuleList res;

	string rulesFile = TempFile();

	VimSession vs = VimSession::CreateWithArgs({
	   "-u", "NONE", // Skip vimrc
	   "-c", ":syntax on",
	   "-c", ":colorscheme " + colorscheme,
	   "-c", ":redir! > " + rulesFile,
	   "-c", ":silent hi",
	   "-c", ":redir END",
	   "-c", ":exit",
	});
	vs.BlockUntilExits();

	res = ExtractSyntaxRulesFromHighlightFile(rulesFile);
	res.title = "Builtin Colorscheme: " + colorscheme;

	return res;
}

DECLARE_string(out_builtin_colorschemes);

void GenerateBuiltinColorchemesData()
{
	ofstream out(FLAGS_out_builtin_colorschemes);
	if (!out.is_open())
	{
		cerr << "Unable to open file: \"" << FLAGS_out << "\"\n";
		exit(1);
	}

	BuiltinColorschemeData csData;

	for (const string &colorscheme : BuiltinColorschemeFiles)
	{
		csData.colorschemes[colorscheme] = ExtractBuiltinColorschemeRules(colorscheme);
	}

	out << csData;
	out.close();

	if (out.fail())
	{
		cerr << "Output stream error\n";
		exit(1);
	}
}
