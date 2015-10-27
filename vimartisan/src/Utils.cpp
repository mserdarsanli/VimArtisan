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
#include <stdio.h>
#include <string.h>
#include <unistd.h>

#include "Utils.hpp"

using namespace std;

static char tempDir[] = "/tmp/vimartisanXXXXXX";

string TempFile()
{
	char tempFile[100];
	sprintf(tempFile, "%s/XXXXXX", tempDir);
	int fd = mkstemp(tempFile);
	if (-1 == fd)
	{
		cerr << strerror(errno) << "\n";
		exit(1);
	}
	close(fd);
	return tempFile;
}

void InitTempDir()
{
	if (nullptr == mkdtemp(tempDir))
	{
		cerr << strerror(errno) << "\n";
		exit(1);
	}
}
