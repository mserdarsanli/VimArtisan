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

#include <fstream>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

#include <boost/tokenizer.hpp>

#include "Types.hpp"
#include "VimHighlight.hpp"

using namespace std;

// Functions that parse `:hi output`

// Given a file name, returuns list of syntax rule definitions
static
vector<string> GetSyntaxRuleDefinitions(const string &file)
{
	vector<string> ruleDefs;

	ifstream in(file);
	string line;

	// Make each rule into a line, to process easier
	while (getline(in, line))
	{
		if (line[0] != ' ')
		{
			ruleDefs.push_back(line);
		}
		else
		{
			ruleDefs[ruleDefs.size() - 1].append(line);
		}
	}

	return ruleDefs;
}

static
SyntaxRule ParseStyle(const string &ruleDef)
{
	SyntaxRule syntaxRule;

	using namespace boost;
	stringstream tokens(ruleDef);
	string token;

	// First two tokens are {ruleName} and "xxx"
	tokens >> token;
	syntaxRule.name = token;
	tokens >> token;

	while (tokens >> token)
	{
		if (token == "cleared")
		{
			cerr << "TODO Skipping: Found cleared token in " << ruleDef << "\n";
			return syntaxRule;
		}

		if (token == "links") {
			tokens >> token; // "to"
			tokens >> token;
			syntaxRule.linkTo = token;
			continue;
		}

		size_t s = token.find('=');
		if (s == string::npos)
		{
			printf("Syntax token skipped: %s\n", token.c_str());
			continue;
		}
		string key = token.substr(0, s);
		string val = token.substr(s+1);

		if (key == "gui" || key == "guifg" || key == "guibg" || key == "guisp"
		  || key == "term")
		{
			continue;
		}
		else if (key == "ctermbg" || key == "ctermfg")
		{
			int color;
			if (sscanf(val.c_str(), "%d", &color) == 1)
			{
				if (key == "ctermbg")
				{
					syntaxRule.bgColorCode256 = color;
				}
				else
				{
					syntaxRule.fgColorCode256 = color;
				}
				continue;
			}
			else
			{
				printf("Syntax token skipped: %s\n", token.c_str());
				continue;
			}
		}
		else if (key == "cterm")
		{
			char_separator<char> sep(",");
			tokenizer< char_separator<char> > attributes(val, sep);
			for (const string &attribute : attributes)
			{
				if (attribute == "bold")
				{
					syntaxRule.hasBoldAttribute = true;
				}
				else if (attribute == "inverse" || attribute == "reverse")
				{
					syntaxRule.hasNegativeAttribute = true;
				}
				else
				{
					//printf("Attribute skipped: %s\n", attribute.c_str());
				}
			}
		}
		else
		{
			printf("Unhandled syntax token skipped: %s\n", token.c_str());
			continue;
		}
	}

	return syntaxRule;
}

// If the rule being processed is not worth presenting in the UI.
// Example rules to be skipped:
// cBitField ctermfg=-1 ctermbg=-1 (Don't know what these are for)
// TODO Not sure if this is a good assumption (comment added below)
static
bool ShouldSkipRule(SyntaxRule &rule)
{
	if (rule.linkTo != "")
		return false;

	// Ignore rules from uncolor.vim
	if (rule.fgColorCode256 == 197 && rule.bgColorCode256 == 197)
		return true;

	// These rules are used only for syntax parsing?
	// Though if these are ignored, other rules linking to these
	// should also be ignored.
	// That may be hard to detect, and not possible to detect here,
	// so these are not allowed, not for other groups to fail
	if (rule.fgColorCode256 == -1 && rule.bgColorCode256 == -1)
		return false;

	return false;
}

SyntaxRuleList ExtractSyntaxRulesFromHighlightFile(const string &rulesFile)
{
	SyntaxRuleList res;

	vector<string> ruleDefs = GetSyntaxRuleDefinitions(rulesFile);

	// A rule definition might color attributes AND a linkto
	// Though only linkto is important if exists
	for (const auto &ruleDef : ruleDefs)
	{
		if (ruleDef.length() == 0) // Skip empty lines
		{
			continue;
		}

		SyntaxRule syntaxRule = ParseStyle(ruleDef);

		// TODO disable skipping when "Advanced mode" is supported
		if (!ShouldSkipRule(syntaxRule))
		{
			res.rules.push_back(syntaxRule);
		}
	}

	return res;
}
