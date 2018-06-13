#!/usr/bin/env python
#
# This script parses gcc based output into JSON.
# Works for GCC -fno-diagnostics-show-caret  and cppcheck (template=gcc) and
# Copyright (c) 2018 John Harmer jharmer@uoguelph.ca
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

import sys, getopt, os
import io, json
import re
import string
from subprocess import call
from subprocess import Popen, PIPE
import shlex
import glob
from glob import glob

def PathSplit(fileNames, includePaths, includeLineNum):
    i=0
    j=0
    improperPaths = []
    for entries in includePaths:
        j=0
        for entry in entries:
            result = str.split(entry)
            #print result[1]
            #Ensure the first and last characters of the include file have " indicating a custom include file
            if (result[1][0] == '"') and (result[1][-1:] == '"'):
                if "/" in result[1]:
                    cutFileNames = fileNames[i].split("/")
                    output = ""
                    for folder in cutFileNames[3:]:
                        output += folder
                    
                    improperPaths.append([output,includeLineNum[i][j]])
                    #print includeLineNum[i][j]
            j=j+1
        i=i+1
    return improperPaths

def PathCollect(includes):
    fileNames = []
    includePaths = []
    includeLineNum = []
    errors = []
    #includePathOnlyFile = []
    i=0
    for entries in includes:
        if i==0:
            fileNames.append(entries)
            i=i+1
        elif i==1:
            includePaths.append(entries)
            i=i+1
        else:
            includeLineNum.append(entries)
            i=0
            
    for lists in includePaths:
        for entries in lists:
            splitEntry = str.split(entries)
            includeName = splitEntry[1]
    return fileNames, includePaths, includeLineNum  

def PathFind(dir):
    includeList = []
    lineList = []
    projectFiles = glob(dir+'/*.c') + glob(dir+'/*.h')
    lineNumber = 0
    for file in projectFiles:
        fp  = open(file, "r")
        #print(file)
        #print(fp).read()
        lines = [line.strip() for line in fp]
        #print lines
        includeKey = "#include"
        includeList.append(file)  
        includeList.append([s for s in lines if includeKey.lower() in s.lower()])
        i=1
        for line in lines:
            if includeKey.lower() in line.lower():
                #print includeKey, " in file ", file, " at line ", i
                lineList.append(i)
            i=i+1
        includeList.append(lineList)
        lineList = []   
    
    #print includeList
    return includeList
            
    #for entries in fileNames:
        #print entries
    #for entries in includePaths:
        #print entries
    #for entries in includeLineNum:
        #print entries
    
    #for p in includeList:
        #print p
    
    
    #includeList = str.split("#include \"some/stuff/testfile.h\"")
    #result = includeList[1]#.strip('\"')
    #print result
def decorateData(result):
    json_string = '{\n'
    json_string += '"feedback": [\n'
    i=0
    for entry in result:
        json_string += '{"severity": "Warning, Potential Mark Deduction","filename\": "'
        json_string += entry[0]
        json_string += '", "lineNum": "'
        json_string += str(entry[1])
        json_string += '", "toolName": "includecheck", "charPos": "1", "type": "warning", "feedback": "#include flag contains an absolute or relative path. Only include filenames in #include commands."}'
        i=i+1
        if (i<len(result)):
            json_string += ','
        json_string += '\n'
    json_string += ']\n'
    json_string += '}\n'
    return json_string

    
def main(argv):
    idirectory = ''
    #Make sure a file directory is provided
    if (len(argv) <= 1):
        print "Please provide a directory to search for C files."
        sys.exit()
    #elif 
        #print "Path provided is not a valid directory. Please provide a valid directory to search for C files."
    else:
        options = { 'tool': 'pathcheck',
                    'dir':''
                    }

        # define command line arguments and check if the script call is valid
        opts, args = getopt.getopt(argv,'t:d:h',
            ['tool=','directory=', 'help'])

        for opt, arg in opts:
            if opt in ('--tool', '-t'):
                options['tool'] = arg
            elif opt in ('directory', '-d'):
                idirectory = arg
                if not (os.path.isdir(idirectory)):
                    sys.stderr.write( 'Error. Directory ' + idirectory + ' does not exist.\n' )
                    sys.exit()
        #PathCheck(argv[1], "")
        if idirectory != '':
            options['dir'] = idirectory
        includeList = PathFind(idirectory)
        fileNames, includePaths, includeLineNum = PathCollect(includeList)
        improperPaths = PathSplit(fileNames, includePaths, includeLineNum)
        json_string = decorateData(improperPaths)
        print json_string
    #PathCheck(argv[1], "")
if __name__ == '__main__':
    main(sys.argv[1:])
