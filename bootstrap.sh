#!/usr/bin/env bash

# Copyright 2015 Mustafa Serdar Sanli
#
# This file is part of VimArtisan.
#
# VimArtisan is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# VimArtisan is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with VimArtisan.  If not, see <http://www.gnu.org/licenses/>.

set -o verbose
set -e

# This is required for JDK8, which bazel requires
echo "deb http://ppa.launchpad.net/webupd8team/java/ubuntu trusty main" | tee /etc/apt/sources.list.d/webupd8team-java.list
echo "deb-src http://ppa.launchpad.net/webupd8team/java/ubuntu trusty main" | tee -a /etc/apt/sources.list.d/webupd8team-java.list
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys EEA14886

apt-get update

# Accept Oracle license
echo "oracle-java8-installer shared/accepted-oracle-license-v1-1 select true" | sudo debconf-set-selections

apt-get install -y oracle-java8-installer npm cmake libboost-dev libgflags-dev

# Some nodejs tools assume the binary is named as `node`
ln -f -s /usr/bin/nodejs /usr/bin/node

# npm global packages
npm install -g typescript

# Build & Install Bazel
if [ ! -f "/usr/local/bin/bazel" ]
then
  (
    # Enable USER_NS for bazel to build hermetically
    sudo sysctl kernel.unprivileged_userns_clone=1
    # Make it persistent
    echo 'kernel.unprivileged_userns_clone = 1' > /etc/sysctl.d/99-enable-user-namespaces.conf

    TMP_DIR=$(mktemp -d)

    cd "$TMP_DIR"

    # Install from a release package
    wget https://github.com/bazelbuild/bazel/releases/download/0.1.1/bazel-0.1.1-installer-linux-x86_64.sh

    chmod +x bazel-0.1.1-installer-linux-x86_64.sh

    ./bazel-0.1.1-installer-linux-x86_64.sh

    rm -rf "$TMP_DIR"
  )
fi
