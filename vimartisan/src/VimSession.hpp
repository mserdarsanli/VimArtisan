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

#include <string>
#include <vector>

#include "term_emu/Terminal.hpp"

// A shitty sandbox for running vim, runs in a temporary directory and cleans
// it up when destroyed.
//
// Does not support terminal size settings
class VimSession
{
private:
	int pid = 0;
	bool hasExited = false;

	struct PtyMasterSlave
	{
		int master = -1;
		int slave = -1;
	};
	PtyMasterSlave stdin_pipe, stdout_pipe;

	// All vim output is piped here, to track terminal state
	Terminal term;

	VimSession() = default;
	void ReadOutput();
public:
	~VimSession() = default; // TODO destruct stuff?
	static VimSession CreateWithArgs(const std::vector<std::string> &args);
	Terminal CaptureScreen();
	void Input(const std::string &s);
	void BlockUntilExits();
	void WaitPid();
};
