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

#include "Types.hpp"

using namespace std;

// Output functions that outputs *JS code* which will create the same structure
// in client javascript code when eval'd. JSON is not used here as it would
// require a lot of boilerplate to create typed objects, and TypeScript
// does not have a way to represent objetcs in JSON.

ostream& operator<<(ostream &out, const SyntaxRule &rule)
{
	// TODO attibutes like `is_bold` `is_negative` are lost here
	if (rule.linkTo != "")
	{
		out << "SyntaxGroup.FromLink('" << rule.name << "', "
		    << "'" << rule.linkTo << "')";
	}
	else
	{
		 out << "SyntaxGroup.FromColor('" << rule.name << "', "
		     << "new TermColor(" << rule.fgColorCode256 << "), "
		     << "new TermColor(" << rule.bgColorCode256 << "))";
	}

	return out;
}

ostream& operator<<(ostream &out, const SyntaxRuleList &list)
{
	out << "(function() {\n"
	    << "var res = {};\n"
	    // TODO change 'lang' to 'title'
	    << "res['lang'] = '" << list.title << "';\n";

	// Dump language syntax rules
	out << "res['syntax-groups'] = {};\n";
	for (const auto &rule : list.rules)
	{
		out << "res['syntax-groups']['" << rule.name << "'] = "
		    << rule << ";\n";
	}
	out << "return res;\n"
	    << "} ())\n";

	return out;
}

ostream& operator<<(ostream &out, const SnippetCapture &cap)
{
	out << "{\n"
	    << "title: '" << cap.title << "',\n"
	    << "'terminal-contents': '" << cap.contentsHtml << "'\n"
	    << "}";

	return out;
}

ostream& operator<<(ostream &out, const BuiltinColorschemeData &csData)
{
	// Dump builtin colorscheme syntax rules
	out << "(function() {\n";
	out << "var res = {};\n";

	for (const auto &csIt : csData.colorschemes)
	{
		const string &csName = csIt.first;
		const SyntaxRuleList &rules = csIt.second;

		out << "  res['" << csName << "'] = " << rules << ";";
	}
	out << "return res;\n"
	    << "} ())\n";

	return out;
}
