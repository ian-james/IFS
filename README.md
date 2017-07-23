# IFS
_Immediate Feedback System_ for student programming assignments and essay
writing

This projects allows students to receive formative feedback for C/C++
assignments and written works.

The project provides a website for students to upload their assignments or
work and select assessment tools, formative feedback will be generated based
on tools and the student's work.

## Getting started

IFS is a collaborative interdisciplinary project hosted by the University of
Guelph. For collaborator contact information please see:
https://sat.socs.uoguelph.ca/about

The IFS is currently available on [GitHub](https://github.com/ian-james/IFS),
clone or fork as needed.

### Installation and setup

The IFS comes with an installation script for Debian-based servers. On your
internet-facing server, simply run:
```
wget https://raw.githubusercontent.com/ian-james/IFS/master/install
sudo ./install
```
Note that this script will clone this git repository, so there is no need
to clone a local copy yourself. The IFS has a large set of dependencies which
are most easily managed by running the installation script.

Complete the prompts, then start your local server by running:
```
npm start
```

In your browser go to the domain that you specified in the installation
script to see the web interface. See the
[wiki](https://github.com/ian-james/IFS/wiki) for more details on set up.
