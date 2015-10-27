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

#pragma once

#include <iostream>
#include <map>
#include <string>
#include <vector>

// Basic types defined related to Vim

// A syntax rule as Vim defines
// Type `:hi` in Vim to see what they are.
struct SyntaxRule
{
	std::string name;

	// This syntax rule links to another, if this field is not empty
	// Rest of the fields are only useful if linkto is empty.
	std::string linkTo;

	// Color codes might have values [0-255] and -1
	int fgColorCode256 = -1;
	int bgColorCode256 = -1;

	// Other attributes
	bool hasBoldAttribute = false;
	bool hasNegativeAttribute = false;
};

// A list of syntax rules, useful for representing "language rules",
// "base syntax rules" etc.
struct SyntaxRuleList
{
	// Identifier for this list
	// Put useful values for debugging, like "LangSyntax: cpp"
	std::string title;

	// array of rules, order here is same as what vim outputs
	std::vector<SyntaxRule> rules;
};

// Terminal capture of a Vim snippet
struct SnippetCapture
{
	// Snippet title, like "Javadoc example", "Raw string literals" etc.
	std::string title;

	// Which language this snippet belongs to
	std::string lang;

	// Capture of the terminal, encoded in html to be imported
	// Data is like "<v-group-name>text</v-group-name><v-other-group>.."
	std::string contentsHtml;
};

// All builtin colorscheme syntax data
struct BuiltinColorschemeData
{
	// Map of colorscheme name -> its rules
	std::map<std::string, SyntaxRuleList> colorschemes;
};

// JS output functions, defined in Types.cpp
std::ostream& operator<<(std::ostream &out, const SyntaxRule &rule);
std::ostream& operator<<(std::ostream &out, const SyntaxRuleList &list);
std::ostream& operator<<(std::ostream &out, const SnippetCapture &cap);
std::ostream& operator<<(std::ostream &out, const BuiltinColorschemeData &csData);
