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

#include <string>

#include "utils/Runfiles.hpp"

#include "ExtractLanguageSyntax.hpp"
#include "Types.hpp"
#include "Utils.hpp"
#include "VimHighlight.hpp"
#include "VimSession.hpp"

using namespace std;

SyntaxRuleList ExtractLanguageSyntax(const string &lang)
{
	SyntaxRuleList res;

	std::string rulesFile = TempFile();

	// Run vim which executes :hi and exits
	VimSession vs = VimSession::CreateWithArgs({
	   "-u", "NONE",
	   "-c", ":syntax on",
	   "-c", ":source " + RunfilesPath("vimartisan/src/runtime_extra/uncolor.vim"),
	   "-c", ":set filetype=" + lang,
	   "-c", ":redir! > " + rulesFile,
	   "-c", ":silent hi",
	   "-c", ":redir END",
	   "-c", ":exit",
	});
	vs.BlockUntilExits();

	res = ExtractSyntaxRulesFromHighlightFile(rulesFile);
	res.title = "Rules for Lang: " + lang;

	return res;
}
