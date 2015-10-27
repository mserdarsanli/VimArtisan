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
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

#include <fcntl.h>
#include <errno.h>
#include <pty.h>
#include <string.h>
#include <sys/ioctl.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <termios.h>
#include <unistd.h>

#include <boost/format.hpp>

#include "utils/Runfiles.hpp"

#include "VimSession.hpp"

using namespace std;
using boost::format;

static void FixTTY(int termFd)
{
	struct termios rtt = {};
	cfmakeraw(&rtt);
	rtt.c_lflag &= ~ECHO;
	tcsetattr(termFd, TCSANOW, &rtt);
}

VimSession VimSession::CreateWithArgs(const vector<string> &args)
{
	VimSession vs;

	{
		int err;
		err = openpty(&vs.stdin_pipe.master, &vs.stdin_pipe.slave, 0, 0, 0);
		if (err == -1)
		{
			cerr << "OPENPTY ERROR: " << strerror(errno) << "\n";
			exit(1);
		}
		openpty(&vs.stdout_pipe.master, &vs.stdout_pipe.slave, 0, 0, 0);
		if (err == -1)
		{
			cerr << "OPENPTY ERROR: " << strerror(errno) << "\n";
			exit(1);
		}
	}


	FixTTY(vs.stdin_pipe.master);
	FixTTY(vs.stdout_pipe.master);
	FixTTY(vs.stdin_pipe.slave);
	FixTTY(vs.stdout_pipe.slave);

	cerr << ""; // I don't know why but this line is needed, FIXME
	vs.pid = fork();

	if (vs.pid < 0)
	{
		cerr << "Unable to fork\n";
		exit(1);
	}

	if (vs.pid > 0)
	{
		close(vs.stdout_pipe.slave);
		int flags = fcntl(vs.stdout_pipe.master, F_GETFL, 0);
		fcntl(vs.stdout_pipe.master, F_SETFL, flags | O_NONBLOCK);
		return vs;
	}

	// In child
	dup2(vs.stdin_pipe.master, STDIN_FILENO); // Weirdd
	dup2(vs.stdout_pipe.slave, STDOUT_FILENO);
	close(vs.stdin_pipe.slave);
	close(vs.stdout_pipe.slave);

	// No need to reset terminal size
	string vimBinary = RunfilesPath("third_party/vim/vim");
	// Launching vim requires VIM env variable to for rutime directory
	// There is also VIMRUNTIME, but I'm not sure of the differences
	// TODO Load these from runfiles
	string vimRuntimeDir = "/VimArtisan/third_party/vim/vim_repo/runtime";
	string vimCmd = (format("VIM=%1% %2%") % vimRuntimeDir % vimBinary).str();
	string shellCmd = vimCmd;
	for (const auto &a : args)
	{
		shellCmd += " '" + a + "'";
	}

	// Set the window size
	{
		// Row - Col
		struct winsize sz = {24, 80, 0, 0};
		int e = ioctl(0, TIOCSWINSZ, &sz);
		if (e == -1)
		{
			cerr << "IOCTL ERROR: " << strerror(errno) << "\n";
			exit(1);
		}
	}

	execl("/bin/bash", "/bin/bash", "-c", shellCmd.c_str(),  nullptr);

	cerr << "Unable to exec: " << strerror(errno) << "\n";
	exit(-1);
}

void VimSession::ReadOutput()
{
	if (hasExited)
		return;

	// Read all available output
	while (1)
	{
		stringstream ss;
		int s;
		char buf[4096];
		s = read(stdout_pipe.master, buf, 4096);

		if (s > 0)
		{
			ss.write(buf, s);
			ss >> term;
			continue;
		}
		if (s == 0)
		{
			hasExited = true;
			WaitPid();
			break;
		}
		if (s == -1)
		{
			if (errno == EIO)
			{
				hasExited = true;
				WaitPid();
				break;
			}
			// FIXME this would not work if we are not waiting until it exits
			continue;
		}
	}

}

Terminal VimSession::CaptureScreen()
{
	ReadOutput();
	return term;
}

void VimSession::BlockUntilExits()
{
	while (!hasExited)
	{
		ReadOutput();
	}
}

void VimSession::WaitPid()
{
	int s;
	while (pid != waitpid(pid, &s, 0));
}

void VimSession::Input(const string &s)
{
	// TODO, error checks
	write(stdin_pipe.slave, s.c_str(), s.size());
}
