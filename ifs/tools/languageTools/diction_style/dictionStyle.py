#!/usr/bin/env python3

# This script uses to process text and provide suggestions for
# strengthening language and tone.
#
# Copyright (c) 2017  James Fraser  <jamey.fraser@gmail.com>
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

# Line Number, column starts at 1.

import sys, getopt, os
import io
import json
import re
import string
from subprocess import call
from subprocess import Popen, PIPE
import shlex
import glob

def createCmd( options ):

    cmdStr = ""
    cmdStr = " ".join( [ options['tool'], options['arg'], options['file']])
    return cmdStr

# Finds target in word from start position or returns -1
def find( word, target, start ):
    if (start < 0 ):
        return -1
    try:
        return word.index(target,start)
    except:
        return -1

# searches target for start and end characters, first index begin
# Designed to find subsections of strings between set characters
# If end char is not find the remained of the target is used.
# (suggestion ) [error]
def findSection( target, sch, ech, begin ):

    fid = find( target, sch, begin )
    if( fid >= 0 ):
        sid = find( target, ech, fid+1 )

        if( sid < 0):
            targetSub   = target[fid+1:]
            sid = len(target)
        else:
            targetSub = target[fid+1:sid]
        return [fid, sid, targetSub ]

    return [-1,-1, ""]


def getStartLineCharPosition( content, lineNum ):
    res = 0
    for i in range(min(len(content),lineNum)):
        res += len(content[i])
    return res


def decorateData( result, options ):

    i = 0
    divCh = "->"
    json_string = ''
    json_string += '{ '
    json_string += '"feedback": [ '

    content = ""
    with open(options['file'], 'r', encoding='utf-8') as outFile:
        content = outFile.readlines()

    lines = result.splitlines()
    for line in lines:

        if( len(line) == 0 ):
            continue

        sections = line.split(':')

        if( len(sections) < 3 ):
            continue

        # Parse the section of the output
        filename = sections[0]
        linenum = sections[1]
        fullFeedback =  sections[2]

        try:
            fid = 0
            globalFilePosition = 0
            while( fid >= 0 and fid < len(fullFeedback) ):

                # 0 is position, 1 is target substr
                error = findSection(fullFeedback,'[', ']', fid)
                #print(error)

                # No more errors to process
                if( error[0] < 0 or error[1] < 0 ):
                    break

                # identify position of -> symbol
                divider = error[2].find(divCh, 0)

                # Divider separate input [] statements user writing and feedback
                addedFeedback = False
                if( divider >= 0 ):
                    # First part is target, second part is suggestion, sometimes in ()
                    target = error[2][0:divider]
                    feedback = findSection( error[2],'(',')', divider )

                    if( feedback[0] < 0 ):
                        feedback[0] = divider
                        feedback[1] = divider+len(divCh)+1
                        feedback[2] = error[2][ feedback[1]:]

                    # Get the character position of this sentence in the document
                    globalFilePosition = getStartLineCharPosition(content,int(linenum)-1)

                    # Find the local position relative to the start of the sentence
                    # key is the start of the feedback you received
                    # cidex is the position in the content sentence.
                    key = fullFeedback[0:error[0]]
                    cidx = max(0, find(content[int(linenum)-1], key , 0))

                    addedFeedback = True
                    json_string += "{"
                    json_string += '"lineNum": ' + str(linenum) + ',\n'
                    json_string += '"charPos": ' + str( cidx + len(key) ) + ',\n'
                    json_string += '"charNum": ' + str( globalFilePosition + cidx + len(key) ) + ',\n'
                    json_string += '"severity": "' + "warning" + '",\n'
                    json_string += '"type": "recommendation",\n'
                    json_string += '"toolName": "Diction Checker",\n'
                    json_string += '"filename": "' + os.path.basename(filename) + '",\n'
                    json_string += '"target": ' + json.dumps(target.strip()) + ',\n'
                    json_string += '"feedback": ' + json.dumps(feedback[2].strip()) + '\n'
                    json_string += "}"

                fid = error[1]+1
                if( addedFeedback ):
                    json_string += ','

        except:
            # find will throw exceptions when not found, no need to report as errors
            pass

    # Remove the last ,
    json_string = json_string[:-1]
    json_string += ']\n'
    json_string += '}\n'

    return json_string

    # This function runs a command output results to two files
def getProcessInfo( cmd, outFile, errorFile ):
    # Executing an external command, to retrieve the output
    # This funciton is supported by several answers on StackOverflow
    # https://stackoverflow.com/questions/1996518/retrieving-the-output-of-subprocess-call/21000308#21000308

    with open(outFile, 'w', encoding='utf-8') as fout:
        with open(errorFile,'w', encoding='utf-8') as ferr:
            args = shlex.split(cmd)

            # Note this requires python 3.3
            proc = Popen(args, stdout=fout, stderr=ferr)

            out, err = proc.communicate()
            exitcode = proc.returncode

            return exitcode, out, err

# main program that takes arguments
def main(argv):
    ifile = ''
    options = { 'tool': 'diction',
                'ifs': True,
                'outFile':'stdout.txt',
                'outErrFile':'stderr.txt',
                'arg': '-s'
              }

    # define command line arguments and check if the script call is validq
    opts, args = getopt.getopt(argv,'f:h', ['file=','help'])

    for opt, arg in opts:
        if opt in ('file', '-f'):
            ifile = arg
            if not (os.path.isfile(ifile)):
                sys.stderr.write( 'Error: File ' + ifile + ' does not exist.\n' )
                sys.exit()
        else:
            print( 'Usage: Process files looking for common errors and inconsistencies.')
            print( options['tool'], ' -f file')
            sys.exit()

    if ifile != '':
        options['file'] = ifile

        cmd = createCmd( options )

        if( cmd ):
            try:
                outFile = os.path.normpath( os.path.join( os.path.dirname(ifile), options['outFile']) )
                outErrFile = os.path.normpath( os.path.join( os.path.dirname(ifile), options['outErrFile']) )
                code, out, err = getProcessInfo( cmd, outFile, outErrFile )

                with open(outFile, 'r', encoding='utf-8') as outFile:
                    result = outFile.read()

                    if( result and options['ifs'] ):
                        result = decorateData( result, options )
                    print( result )
            except:
                sys.stderr.write("Unable to successfully retrieve assessment information.\n")
        else:
            sys.stderr.write( 'Invalid tool selected, please select a valid tool name.\n')
    else:
        sys.stderr.write( 'Please provide a text file for evaluation.\n')
        sys.exit()

if __name__ == '__main__':
    main(sys.argv[1:])
