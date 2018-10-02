#!/bin/sh
  
cd compiletestA2 2> /dev/null
make > /dev/null
[ -f ./bin/GEDCOMtests ] || { echo "ERROR: Compilation Error\nProblem in testing program compilation\nEnsure all assignment specific files/functions are present and named correctly";exit 1; }
