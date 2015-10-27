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

#include <errno.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>

#include <iostream>
#include <string>

inline
std::string CurrentBinaryPath()
{
	char link_name[512];

	// /proc/self/exe is a symlink to current binary
	int s = readlink("/proc/self/exe", link_name, 511);
	if (s == -1)
	{
		std::cerr << "Error in CurrentBinaryPath: " << strerror(errno) << "\n";
		exit(1);
	}
	link_name[s] = '\0';

	return link_name;
}

inline
std::string RunfilesDir()
{
	return CurrentBinaryPath() + ".runfiles";
}

inline
std::string RunfilesPath(const std::string &p)
{
	return RunfilesDir() + "/" + p;
}
