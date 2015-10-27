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

#include <array>
#include <map>
#include <iterator>
#include <fstream>
#include <sstream>

#include <errno.h>
#include <fcntl.h>
#include <string.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <unistd.h>

#include "utils/Runfiles.hpp"

#include "ExtractSnippetData.hpp"
#include "VimCapture.hpp"
#include "Utils.hpp"

using namespace std;

SnippetCapture ExtractSnippetData(const string &lang,
                                  const SyntaxRuleList &langSyntax,
                                  const string &snippetFile)
{
	SnippetCapture res;

	// CaptureVim works with contents, TODO?
	string snippetContents;
	{
		ifstream in(snippetFile);
		snippetContents.assign(istreambuf_iterator<char>(in),
		                       istreambuf_iterator<char>());
	}

	stringstream ss;
	CaptureVim(lang, langSyntax, snippetContents, ss);
	res.contentsHtml = ss.str();

	return res;
}
