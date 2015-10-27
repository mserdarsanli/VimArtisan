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

#include <errno.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>

#include <deque>
#include <fstream>
#include <iostream>
#include <map>
#include <string>
#include <vector>

#include <gflags/gflags.h>

#include "Types.hpp"
#include "Utils.hpp"

#include "BaseSyntaxGroups.hpp"
#include "BuiltinColorschemeData.hpp"
#include "ExtractLanguageSyntax.hpp"
#include "ExtractSnippetData.hpp"

using namespace std;

DEFINE_string(out_base_syntax_groups, "", "Output file name for base syntax groups");
DEFINE_string(out_builtin_colorschemes, "", "Output file name for bultin colorschemes data");

struct LanguageFiles
{
	struct Snippet
	{
		string title;
		string file;
	};

	string output;
	vector<Snippet> snippets;
};

// Since this program does not know the languages beforehand, we can't create
// flags named like --cpp_snippet etc. Therefore, languages are also passed as
// flags along with relevant snippets
//
// Should be called as
// ./Main --out_builtin_colorschemes <some file name> --
//     out:cpp <cpp output file>
//     out:java <java output file>
//     snippet:cpp  "Snippet title 1" <snippet file 1>
//     snippet:cpp  "Snippet title 2" <snippet file 2>
//     snippet:java  "Snippet title 1" <snippet file 1>
//
int main(int argc, char** argv)
{
	google::ParseCommandLineFlags(&argc, &argv, true);

	InitTempDir();

	// Parse flags
	deque<string> flags(argv + 1, argv + argc);

	map<string, LanguageFiles> langFiles;

	while (flags.size())
	{
		string cmd = flags[0];

		if (cmd.substr(0, 4) == "out:")
		{
			if (flags.size() < 2)
			{
				cerr << "Not enough flags after " << cmd << "\n";
				exit(1);
			}

			string lang = cmd.substr(4);
			langFiles[lang].output = flags[1];

			flags.erase(flags.begin(), flags.begin() + 2);
			continue;
		}
		if (cmd.substr(0, 8) == "snippet:")
		{
			if (flags.size() < 3)
			{
				cerr << "Not enough flags after " << cmd << "\n";
				exit(1);
			}

			string lang = cmd.substr(8);

			LanguageFiles::Snippet snippet;
			snippet.title = flags[1];
			snippet.file = flags[2];

			// Check if snippet file exists
			struct stat st;
			int s = stat(snippet.file.c_str(), &st);
			if (s == -1)
			{
				cerr << "Unable to stat file: " << snippet.file << "\n";
				cerr << "Error: " << strerror(errno) << "\n";
				exit(1);
			}

			langFiles[lang].snippets.push_back(snippet);

			flags.erase(flags.begin(), flags.begin() + 3);
			continue;
		}
		else
		{
			cerr << "Unrecognized flag: " << cmd << "\n";
			exit(1);
		}
	}

	SyntaxRuleList baseSyntax = ExtractBaseSyntaxRules();
	{
		ofstream baseSyntaxFile(FLAGS_out_base_syntax_groups);

		baseSyntaxFile << baseSyntax;

		baseSyntaxFile.close();
		if (baseSyntaxFile.fail())
		{
			cerr << "Output stream error\n";
			exit(1);
		}
	}

	GenerateBuiltinColorchemesData();

	for (const auto &langIt : langFiles)
	{
		const string &lang = langIt.first;
		const LanguageFiles &langFiles = langIt.second;

		cout << "Processing data for language " << lang << "\n";

		SyntaxRuleList langSyntax = ExtractLanguageSyntax(lang);
		vector<SnippetCapture> snippetCaptures;

		for (const LanguageFiles::Snippet &snippet: langFiles.snippets)
		{
			cout << "Extracting snippet data for " << snippet.title
			     << " from file " << snippet.file << "\n";

			SnippetCapture capture = ExtractSnippetData(lang, langSyntax, snippet.file);
			capture.lang = lang;
			capture.title = snippet.title;

			snippetCaptures.push_back(capture);
		}

		// Write the output
		ofstream langSyntaxFile(langFiles.output);

		langSyntaxFile
		    << "(function() {\n"
		    << "var res = {};\n"
		    << "res['lang-syntax'] = " << langSyntax << ";\n"
		    << "res['snippets'] = [];\n";
	
		for (const auto &cap : snippetCaptures)
		{
			langSyntaxFile
			    << "res['snippets'].push({\n"
			    << "  'title': '" << cap.title << "',\n"
			    << "  'terminal-contents': '" << cap.contentsHtml << "'\n"
			    << "});\n";
		}

		langSyntaxFile
		    << "return res;\n"
		    << "}())";

		langSyntaxFile.close();
		if (langSyntaxFile.fail())
		{
			cerr << "Output stream error\n";
			exit(1);
		}
	}

	return 0;
}
