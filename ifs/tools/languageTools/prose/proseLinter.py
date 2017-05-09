#!/usr/bin/env python3

# This script uses proselint to process text and provide suggestions for
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

##
# Example output
# {
#"check": "typography.symbols.sentence_spacing",
# "column": 35,
# "end": 95,
# "extent": 3,
# "line": 2,
# "message": "More than two spaces after the period; use 1 or 2.",
# "replacements": null,
# "severity": "warning",
# "start": 92}

def createCmd( options):

    cmdStr = ""
    cmdStr = " ".join( [ options['tool'], options['arg'], options['file']])
    return cmdStr


def decorateData( result, options ):

    jdata = ""
    try:
        jdata = json.loads(result)
    except:
        print("FAILED")

    filename = os.path.basename(options['file'])

    content = ""
    with open(options['file'], 'r') as outFile:
        content = outFile.read()

    jdata = jdata["data"]

    json_string = ''
    json_string += '{ '
    json_string += '"feedback": [ '

    for i in range(len(jdata["errors"])):

        obj = jdata["errors"][i]

        json_string += "{"
        json_string += '"target": "' + content[ obj["start"]-1 : obj["end"] ] + '",\n'
        json_string += '"lineNum": ' + str(obj["line"]) + ',\n'
        json_string += '"charNum": ' + str(obj["start"])  + ',\n'
        json_string += '"charPos": ' + str(obj["column"]) + ',\n'
        json_string += '"severity": "' + str(obj["severity"]) + '",\n'
        json_string += '"type": "'  + str(obj['check']) + '",\n'
        json_string += '"toolName": "proseLinter",\n'
        json_string += '"filename": "' + filename + '",\n'
        json_string += '"feedback":' + json.dumps(obj["message"]) + ',\n'

        j_array = "[]"
        if obj["replacements"] != None:
            j_array = json.dumps( [ obj["replacements"] ] )
        json_string += '"suggestions": ' + j_array + '\n'
        json_string += "}"
        if i != (len(jdata["errors"]) - 1):
            json_string += ','

    json_string += ']\n'
    json_string += '}\n'

    return json_string

    # This function runs a command output results to two files
def getProcessInfo( cmd, outFile, errorFile ):
    # Executing an external command, to retrieve the output
    # This funciton is supported by several answers on StackOverflow
    # https://stackoverflow.com/questions/1996518/retrieving-the-output-of-subprocess-call/21000308#21000308

    with open(outFile, 'w') as fout:
        with open(errorFile,'w') as ferr:
            args = shlex.split(cmd)

            # Note this requires python 3.3
            proc = Popen(args, stdout=fout, stderr=ferr)

            out, err = proc.communicate()
            exitcode = proc.returncode

            return exitcode, out, err


# main program that takes arguments
def main(argv):
    ifile = ''
    options = { 'tool': 'proselint',
                'ifs': True,
                'outFile':'stdout.txt',
                'outErrFile':'stderr.txt',
                'arg': '-j'
              }

    # define command line arguments and check if the script call is validq
    opts, args = getopt.getopt(argv,'t:i:l:f:h',
        ['tool=','ifsOff=','language=','file=','help'])

    for opt, arg in opts:
        if opt in ('--tool', '-t'):
            options['tool'] = arg
        elif opt in ('--ifsOff', '-i'):
            options['ifs'] = False
        elif opt in ('--language', '-l'):
            options['language'] = arg
        elif opt in ('file', '-f'):
            ifile = arg
            if not (os.path.isfile(ifile)):
                sys.stderr.write( 'Error. Directory ' + ifile + ' does not exist.\n' )
                sys.exit()
        else:
            print( 'Usage: Process prose files and out error to JSON format')
            print( 'proseLinter.py [-t tool] [-i IFS MODE] [-l LANGUAGE] -d InputDirectory')
            sys.exit()

    if ifile != '':
        options['file'] = ifile

        cmd = createCmd( options )

        if( cmd ):
            try:
                outFile = os.path.normpath( os.path.join( os.path.dirname(ifile), options['outFile']) )
                outErrFile = os.path.normpath( os.path.join( os.path.dirname(ifile), options['outErrFile']) )
                code, out, err = getProcessInfo( cmd, outFile, outErrFile )

                with open(outFile, 'r') as outFile:
                    result = outFile.read()

                    if( result and options['ifs'] ):
                        result = decorateData( result, options )
                    print( result )
            except:
                sys.stderr.write("Unable to successfully retrieve assessment information")
        else:
            sys.stderr.write( 'Invalid tool selected, please select a valid tool name.\n')
    else:
        sys.stderr.write( 'Please a project directory to evaluate.\n')
        sys.exit()

if __name__ == '__main__':
    main(sys.argv[1:])
