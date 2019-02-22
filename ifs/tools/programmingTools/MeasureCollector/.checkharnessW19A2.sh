#!/bin/sh
  
cd tools/programmingTools/MeasureCollector/compiletestW19A2 2> /dev/null
make calTestA2 > /dev/null
[ -f ./bin/calTestA2 ] || { echo "ERROR: Compilation Error\nProblem in testing program compilation\nEnsure all assignment specific files/functions are present and named correctly";exit 1; }
