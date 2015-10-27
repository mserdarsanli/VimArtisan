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

#include "BaseSyntaxGroups.hpp"
#include "Types.hpp"
#include "Utils.hpp"
#include "VimHighlight.hpp"
#include "VimSession.hpp"

using namespace std;

// Syntax rules defines shen syntax highlighting is off
// There are the rules like 'LineNr', 'Serach', 'Visual' etc.
SyntaxRuleList ExtractBaseSyntaxRules()
{
	SyntaxRuleList res;

	string rulesFile = TempFile();

	VimSession vs = VimSession::CreateWithArgs({
	   "-u", "NONE", // Skip vimrc
	   "-c", ":redir! > " + rulesFile,
	   "-c", ":silent hi",
	   "-c", ":redir END",
	   "-c", ":exit",
	});
	vs.BlockUntilExits();

	res = ExtractSyntaxRulesFromHighlightFile(rulesFile);
	res.title = "Base syntax groups";

	return res;
}
