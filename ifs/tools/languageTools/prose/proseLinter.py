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

# Include common helper files.
# Note: IFS runs this files from the main IFS/ifs folder.
helperFunctionPath = "./tools/commonTools/"
sys.path.append( os.path.abspath(helperFunctionPath) )
from helperFunctions import *

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

def createCmd( options ):

    cmdStr = ""
    cmdStr = " ".join( [ options['tool'], options['arg'], options['file']])
    print( cmdStr )

    return cmdStr

def decorateData( result, options ):

    jdata = ""
    try:
        jdata = json.loads(result)
    except:
        raise


    filename = os.path.basename(options['file'])

    content = ""
    with open(options['file'], 'r', encoding='utf-8') as outFile:
        content = outFile.read()

    jdata = jdata["data"]

    json_string = ''
    json_string += '{ '
    json_string += '"feedback": [ '

    for i in range(len(jdata["errors"])):

        obj = jdata["errors"][i]

        json_string += "{"
        json_string += '"target": "' + content[ obj["start"]-1 : obj["end"]-1 ] + '",\n'
        json_string += '"lineNum": ' + str(obj["line"]) + ',\n'
        json_string += '"charNum": ' + str(obj["start"]-1)  + ',\n'
        json_string += '"charPos": ' + str(obj["column"]-1) + ',\n'
        json_string += '"severity": "' + str(obj["severity"]) + '",\n'
        json_string += '"type": "recommendation",\n'
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
    opts, args = getopt.getopt(argv,'l:f:h', ['language=','file=','help'])

    for opt, arg in opts:
        if opt in ('--language', '-l'):
            options['language'] = arg
        elif opt in ('file', '-f'):
            ifile = arg
            if not (os.path.isfile(ifile)):
                sys.stderr.write( 'Error: File ' + ifile + ' does not exist.\n' )
                sys.exit()
        else:
            print( 'Usage: Process files looking for common errors and inconsistencies.')
            print( 'proseLinter.py [-l LANGUAGE] -f file')
            sys.exit()

    if ifile != '':
        options['file'] = ifile

        idirectory = os.path.dirname(ifile)

        cmd = createCmd( options )

        if( cmd ):
            try:
                outFile = os.path.normpath( os.path.join( idirectory, options['outFile']) )
                outErrFile = os.path.normpath( os.path.join( idirectory, options['outErrFile']) )

                # proselin write errors to out
                out, err = getProcessInfo( cmd, outFile, outErrFile )

                try:
                    out = out.decode("utf-8", "replace")
                except:
                    i =0

                # Note ifile used as directory because displayResultsToIFS strips the filename.
                # Programming tools have unzipped folder but writing tools do not
                # So we don't use idirectory which already points to the top folder or it would remove that last folder.
                displayResultToIFS(options, decorateData, ifile,"/feedback_proseLinter_" + os.path.basename(ifile), out )

            except:
                sys.stderr.write("Unable to successfully retrieve assessment information.\n")
        else:
            sys.stderr.write( 'Invalid tool selected, please select a valid tool name.\n')
    else:
        sys.stderr.write( 'Please provide a text file for evaluation.\n')
        sys.exit()

if __name__ == '__main__':
    main(sys.argv[1:])
