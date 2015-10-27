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
#include <map>
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

#include <boost/tokenizer.hpp>

#include "term_emu/Terminal.hpp"

#include "Types.hpp"
#include "Utils.hpp"
#include "VimCapture.hpp"
#include "VimSession.hpp"

using namespace std;

struct RuleColors
{
	struct RuleColor
	{
		int ctermfg;
		int ctermbg;
	};

	int nextBg = 120;
	int nextFg = 100;

	// Created a unique color, if not exists
	RuleColor getColorForRule(const string &ruleName)
	{
		auto it = ruleColorsMap.find(ruleName);
		if (it != ruleColorsMap.end())
		{
			return it->second;
		}

		RuleColor res;
		res.ctermfg = nextFg;
		res.ctermbg = nextBg;

		// Increment
		if (nextBg == nextFg + 20)
		{
			nextBg++;
			nextFg = 100;
		}
		else
		{
			nextFg++;
		}

		ruleColorsMap[ruleName] = res;
		colorsInvMap[ make_pair(res.ctermfg, res.ctermbg) ] = ruleName;

		return res;
	}

	string getRuleNameForColor(int ctermfg, int ctermbg) const
	{
		auto it = colorsInvMap.find(make_pair(ctermfg, ctermbg));
		if (it == colorsInvMap.end())
		{
			cerr << "Unable to find color [" << ctermfg << ", "
			          << ctermbg << "]\n";
			return "";
		}
		return it->second;
	}

private:
	// Mapping from rule name to its given colors
	map<string, RuleColor> ruleColorsMap;

	// Maps colors to rule names, pair is formed of ctermfg, ctermbg in order
	map< pair<int, int>, string> colorsInvMap;
};

// Converts vim syntax grop name to html tag name
// This function should be same as GetTagName in www/TerminalColors.js
// Ex: 'String' => 'v-string'
// Ex: 'PreProc' => 'v-pre-proc'
string GetTagName(const string &rule)
{
	string tagName = "v";

	for (size_t i = 0; i < rule.size(); ++i)
	{
		if (isupper(rule[i]))
		{
			// Prepend '-' if character is upercase
			tagName += '-';
		}
		tagName += tolower(rule[i]);
	}

	return tagName;
}

// Returns the html representation as string for the given char
// Ex: 'a' => "a"
// Ex: '<' => "&lt;"
string HtmlEscape(int c)
{
	switch (c)
	{
	case '"':  return "&quot;";
	case '\'': return "&apos;";
	case '<':  return "&lt;";
	case '>':  return "&gt;";
	case '&':  return "&amp;";
	case '\\': return "&#92;"; // Otherwise it is harder to escape js string
	default:
		// TODO handle unicode?
		return string(1, c);
	}
}

void ExtractTags(const Terminal &outputTerminal, const RuleColors &colorMapper, ostream &out)
{
	for (int r = 0; r < TermHeight; ++r)
	{
		string lastRuleName = "";
		for (int c = 0; c < TermWidth; ++c)
		{
			auto ch = outputTerminal.at(r, c);
			string ruleName
			  = colorMapper.getRuleNameForColor(
			    ch.style.fgColorId, ch.style.bgColorId);

			if (ruleName != lastRuleName)
			{
				if (c != 0)
				{
					out << "</" << GetTagName(lastRuleName) << ">";
				}
				out << "<" << GetTagName(ruleName) << ">";
			}

			if (ch.codePoint < 128)
			{
				out << HtmlEscape(ch.codePoint);
			}
			else
			{
				out << "?";
			}

			lastRuleName = ruleName;
		}

		out << "</" << GetTagName(lastRuleName) << ">\\n";
	}
}

void CaptureVim(const string &lang,
                const SyntaxRuleList &langSyntax,
                const string &contents,
                ostream &out)
{
	RuleColors colorMapper;

	string tempFileName = TempFile();
	{
		ofstream out(tempFileName);
		out << contents;
		out.close();
	}

	string vimCmdsFile = TempFile();
	{
		ofstream out(vimCmdsFile);
		out << ":syntax on\n";
		out << ":set filetype=" << lang << "\n";

		// Special colors
		{
			auto col = colorMapper.getColorForRule("Normal");
			out << ":hi Normal"
			    << " ctermfg=" << col.ctermfg
			    << " ctermbg=" << col.ctermbg
			    << "\n";
		}
		for (const SyntaxRule &rule : langSyntax.rules)
		{
			// FIXME the "Normal" special rule is not handled
			auto col = colorMapper.getColorForRule(rule.name);
			out << ":hi " << rule.name
			    << " ctermfg=" << col.ctermfg
			    << " ctermbg=" << col.ctermbg
			    << "\n";
		}
		out << ":exit\n";
		out.close();
	}

	// Run vim which shows the file contents and exits
	VimSession vs = VimSession::CreateWithArgs({
	    "-u", "NONE",
	    "-f",
	    "-s", vimCmdsFile,
	    tempFileName
	});

	// Terminal object to pipe the vim output to.
	// It will hold the state of the terminal in a nice format.
	Terminal outputTerminal = vs.CaptureScreen();
	cout << "\n" << outputTerminal;

	ExtractTags(outputTerminal, colorMapper, out);
}
