#!/usr/bin/env python
#
# This script parses gcc based output into JSON.
# Works for GCC -fno-diagnostics-show-caret  and cppcheck (template=gcc) and
# Copyright (c) 2017 James Fraser jfrase09@uoguelph.ca
#
# Permission to use, copy, modify, and/or distribute this software for any
# purpose with or without fee is hereby granted, provided that the above
# copyright notice and this permission notice appear in all copies.
#
# THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
# REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
# AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
# INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
# LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
# OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
# PERFORMANCE OF THIS SOFTWARE.
#
# This file lists a couple functions that are helpful across several tools.
# It's a common location to share reoccuring task.

import sys, getopt, os
import io, json
import re
import string
import subprocess
import shlex
import glob


# This function runs a command output results to two files
# Executing an external command, to retrieve the output
# This funciton is supported by several answers on StackOverflow
# https://stackoverflow.com/questions/1996518/retrieving-the-output-of-subprocess-call/21000308#21000308

def getProcessInfo( cmd, outFile, errorFile ):

    args = shlex.split(cmd)
    # Expand the wildcard to be processed as expected, gets the requested files.
    args = args[:-1] + glob.glob(args[-1])

    p = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    out, err = p.communicate()

    return out, err



# Displays the results to either a file for ifs to read or to standard output.
# Check options for IFS boolean
# DecorateDataForOutput can set the data to JSON for output in IFS
# idirectory - where the student's submission exists.
# cofile is the IFS file to be read. Usually of the form feedback_<toolName>_unzipped
# result is the program's output data - it can be any format as prepareData will make it json if needed.
# Note: Check which tags your program needs to prepare data for IFS.
def displayResultToIFS(options, prepareData, idirectory, cofile, result):
    if( options['ifs'] ):
        result = prepareData( result, options )

        outputfile = os.path.normpath( os.path.join( os.path.dirname(idirectory) +  cofile  ) )

        file = open(outputfile, "w")
        file.write(result)
        file.close()
    else:
        print( result )