#!/bin/sh
  
cd tools/programmingTools/MeasureCollector/compiletestF18A1 2> /dev/null
make > /dev/null
[ -f ./bin/cardTests ] || { echo "ERROR: Compilation Error\nProblem in testing program compilation\nEnsure all assignment specific files/functions are present and named correctly";exit 1; }
