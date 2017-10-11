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
#
# Usage notes: You'll have to install stopwords from nltk.download('stopwords')

import sys, getopt, os
import io, json
import re
import string
from subprocess import call
from subprocess import Popen, PIPE
import shlex
import glob

#Display data in JSON format for the IFS
def decorateData( result, options ):
    json_string = '{\n'
    json_string += '"feedback": [\n'
    for i in range(len(result)):
        json_string += json.dumps(result[i])
        if i != (len(result) - 1):
            json_string +=','
        json_string += '\n'

    json_string += ']\n'
    json_string += '}\n'
    return json_string


# This function runs a command output results to two files
def getProcessInfo( cmd, outFile, errorFile ):
    # Executing an external command, to retrieve the output
    # This funciton is supported by several answers on StackOverflow
    # https://stackoverflow.com/questions/1996518/retrieving-the-output-of-subprocess-call/21000308#21000308

    #print("cmd is", cmd )

    with open(outFile, 'w') as fout:
        with open(errorFile,'w') as ferr:

            args = shlex.split(cmd)
            # Expand the wildcard to be processed as expected, gets the requested files.
            args = args[:-1] + glob.glob(args[-1])

            # Note this requires python 3.3
            proc = Popen(args, stdout=fout, stderr=ferr)
            out, err = proc.communicate();
            exitcode = proc.returncode

            return exitcode, out, err

# Parsing the output of a couple simple formats
# Each format has a specific character split sequence such as '##' or ':'
# Types specify how to tag the incoming sections
def parse( text, options ):
    results = []
    types = options['splitTypes']
    for line in text.splitlines():
        sNum = 0
        feedback = {}
        feedback['toolName'] = options['tool']
        sections = line.split( options['splitSeq'])

        # Check that we can put each parsed section into an expect tag type.
        if( len(sections) == len(types) ):
            for section in sections:
                if( sNum < len(types) ):
                    if( types[sNum] == 'filename'):
                        feedback[ types[sNum] ] = os.path.basename(section)
                    elif ( types[sNum] == "feedback"):
                        feed = section.strip()
                        feedtext = re.findall(r"\[([^[]*)]$",feed)
                        # Find [section] and remove from feedback
                        if( feedtext and len(feedtext) > 0 ):
                            feedback[ 'severity' ] = feedtext[0]
                            fid = feed.find(feedtext[0])
                            if( fid >= 0 ):
                                feedback[ types[sNum] ] = feed[0:fid-1]
                            else:
                                feedback[ types[sNum] ] = feed
                        else:
                            feedback[ types[sNum] ] = feed
                    else:
                        feedback[ types[sNum] ] = section.strip()
                else:
                    sys.stderr.write("************ Error: Section types doesn't mtch split Sections ***** ")
                sNum = sNum + 1
            results.append( feedback )
        #else:
            # This is not so much an error as often an intended not from compiler.
            #print("*** Error: incorrectly matching regular expression items")

    return results


# Short-hand function to return format of parameter
def getNKV( dict, name, key ):
    if( dict[key]):
        return dict['initP'] + name + "=" + dict[key]
    return ""

# Short-hand parameter to also display the key and value
def getKV( dict, key ):
    return getNKV( dict, key, key )


def createCmd( options ):
    iDir = os.path.normpath( os.path.join( options['dir'], options['includeDir']) )
    srcDir = os.path.normpath( os.path.join(options['dir'], options['srcDir']) )
    # Assumption here that we can still try directory for .h and .c files at the top level
    # The intended is for non zip files where just a flat array of files exists.
    if not os.path.isdir(iDir):
        iDir = ""

    if not os.path.isdir(srcDir):
        srcDir = os.path.normpath( os.path.join(options['dir'], "*") )
    else:
        srcDir = os.path.join(srcDir,"*")

    cmdStr = ""
    if( options['tool'] == 'cppcheck'):
        cmdStr = " ".join( [ options['tool'],
                        getNKV(options,'enable','errorLevel'),
                        getKV(options,'language'),
                        getKV(options,'std'),
                        " ".join(options['flags']),
                        getKV(options,'suppress'),
                        '--template="{file}##{line}##{severity}##{id}##{message}"',
                        " " + srcDir  if iDir == "" else "-I " + iDir + " " + srcDir
                    ])

    elif options['tool'] == 'gcc':
        options['initP'] = '-'
        options['splitSeq'] = ':'
        options['flags'].append(' -fno-diagnostics-show-caret -fsyntax-only')
        options['splitTypes'] = [ "filename", "lineNum", "charPos", "type", "feedback"]
        cmdStr = " ".join( [
                        options['tool'],
                        getKV(options,'std'),
                        " ".join(options['flags']),
                        " " + srcDir if iDir == "" else "-iquote " + iDir + " " + srcDir
                    ])
    elif options['tool'] == 'clang':
        options['initP'] = '-'
        options['splitSeq'] = ':'
        options['flags'].append(' -fno-caret-diagnostics -fsyntax-only -fdiagnostics-show-category=name')
        options['splitTypes'] = [ "filename", "lineNum", "charPos", "type", "feedback"]
        cmdStr = " ".join( [
                        options['tool'],
                        getKV(options,'std'),
                        " ".join(options['flags']),
                        " " + srcDir  if iDir == "" else "-iquote " + iDir + " " + srcDir
                    ])
    else:
        # Protect against random tool calls
        return "";

    #print("Your command was:" + cmdStr + ":")
    return cmdStr



# main program that takes arguments
def main(argv):

    idirectory =''
    # Many default options set for cppCheck, most of which will be used in gcc and ctags
    # outFiles are temporary files

    options = { 'tool': 'cppcheck',
                'ifs': True,
                'language':'c',
                'errorLevel':'all',
                'flags': [],
                'std': 'c89',
                'suppress':'',
                'dir':'',
                'splitSeq': "##",
                'splitTypes': [ "filename", "lineNum", "type", "category", "feedback"],
                'outFile':'stdout.txt',
                'outErrFile':'stderr.txt',
                'initP': "--",
                'includeDir': "./include",
                'srcDir': "./src"
                }

    # define command line arguments and check if the script call is validq
    opts, args = getopt.getopt(argv,'t:i:l:e:f:s:u:d:h',
        ['tool=','ifsOff=','language=', 'errorLevel=', 'flags=', 'std=',  'suppress=', 'directory=', 'help'])

    for opt, arg in opts:
        if opt in ('--tool', '-t'):
            options['tool'] = arg
        elif opt in ('--ifsOff', '-i'):
            options['ifs'] = False
        elif opt in ('--language', '-l'):
            options['language'] = arg
        elif opt in ('--errorLevel', '-e'):
            options['errorLevel'] = arg
        elif opt in ('--flags=', '-f'):
            if arg.startswith('-'): # safeguard against malformed flags
                options['flags'].append(arg)
        elif opt in ('--std=', '-s'):
            options['std'] = arg
        elif opt in ('--suppress', '-u'):
            options['suppress'] = arg
        elif opt in ('directory', '-d'):
            idirectory = arg
            if not (os.path.isdir(idirectory)):
                sys.stderr.write( 'Error. Directory ' + idirectory + ' does not exist.\n' )
                sys.exit()
        else:
            print( 'Usage: Parses specific GCC/CPPCheck output files types to JSON format')
            print( 'programmingParser.py [-t tool] [-i IFS MODE] [-l LANGUAGE] [-e ERROR LEVEL] [-f FLAGS] [-s STD] [-u SUPPRESS MSG] -d InputDirectory')
            sys.exit()

    if idirectory != '':
        options['dir'] = idirectory

        cmd = createCmd( options )

        if( cmd ):
            try:
                outFile = os.path.normpath( os.path.join( idirectory, options['outFile']) )

                outErrFile = os.path.normpath( os.path.join( idirectory, options['outErrFile']) )
                code, out, err = getProcessInfo( cmd, outFile, outErrFile )

                with open(outErrFile, 'r') as errFile:
                    errors = errFile.read()
                    result = parse( errors, options )

                    if( options['ifs'] ):
                        result = decorateData( result, options )
                    print( result )
            except:
                sys.stderr.write("Unable to successfully retrieve compiler information")
        else:
            sys.stderr.write( 'Invalid tool selected, please select a valid tool name.\n')
    else:
        sys.stderr.write( 'Please rovide a project directory to evaluate using -d <dir>.\n')
        sys.exit()

if __name__ == '__main__':
    main(sys.argv[1:])
