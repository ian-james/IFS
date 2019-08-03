#!/usr/bin/env python3

# This script attempts to implement and check arbitrary text against APA
# formatting rules.
#
# Copyright (c) 2017 Keefer Rourke <mail@krourke.org>
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

import sys
import getopt
import os
import io
import json
import re
from pyapa import pyapa


# this function prints usage information
def print_usage():
    print('Usage:')
    print('apa_check.py [--quiet][--outfile=OUT.json] --infile=INPUTFILE')
    print()
    print('apa_check.py [-q] [-o OUT.json] -i INPUTFILE')

    return


def apacheck(text):
    papaya = pyapa.ApaCheck()

    return papaya.match(text)


def build_json(matches, filename, line):
    filename = os.path.basename(filename)
    json_string = ''
    json_string += '{'
    json_string += '"feedback": ['
    for i in range(len(matches)):
        json_string += ('{'
                        + '"target": "' + str(matches[i].target) + '",'
                        + '"charNum": "' + str(matches[i].start) + '",'
                        + '"lineNum": "' + str(line) + '",'
                        + '"type": "style",'
                        + '"toolName": "APA Check",'
                        + '"filename": "' + str(filename) + '",'
                        + '"feedback": "' + str(matches[i].feedback) + '",'
                       )
        j_array = json.dumps(matches[i].suggestions)
        json_string += ('"suggestions": ' + j_array + '}')

        if i != (len(matches) - 1):
            json_string += ','
    json_string += ']}'

    # make formatting prettier
    json_obj = json.loads(json_string)
    json_string = json.dumps(json_obj, indent=4, sort_keys=True)
    json_string += '\n'


    return json_string


def print_json(json_data=''):
    if json_data:
        print(json_data)
    else:
        sys.stderr.write('Error. Cannot print output.\n')

    return


# main program that takes arguments
def main(argv):
    # options
    json_path = ''
    infile = ''
    quiet = False
    json_ofile = 'feedback_apaCheck_'

    # define command line arguments and check if the script call is valid
    try:
        opts, args = getopt.getopt(argv, 'o:i:qh', ['outfile=', 'infile=',
                                                    'quiet', 'help'])
    except getopt.GetoptError as err:
        sys.stderr.write('Error. ' + str(err) + '\n')
        print_usage()
        sys.exit(2)  # code 2 means misuse of shell cmd according to Bash docs

    # set options
    if not opts:
        sys.stderr.write('Error. No arguments provided.\n')
        print_usage()
        sys.exit(2)

    for opt, arg in opts:
        if opt in ('--outfile', '-o'):
            json_path = arg
        elif opt in ('--infile', '-i'):
            infile = arg
            if not (os.path.isfile(infile)):
                sys.stderr.write('Error. File ' + infile
                                 + ' does not exist.\n')
                sys.exit(1)
        elif opt in ('--quiet', '-q'):
            quiet = True
        elif opt in ('--help', '-h'):
            print_usage()
            sys.exit(0)
        else:
            assert False, 'unhandled option'

    # check that infile was actually provided
    if not infile:
        sys.stderr.write('Error. Input file is required.\n')
        print_usage()
        sys.exit(2)

    if not json_path and quiet:
        sys.stderr.write('Error. The quiet option cannot be used without '
                         + 'specifying an output file.\n')
        sys.exit(2)

    f_in = open(infile, 'r', encoding="utf-8")
    text = f_in.read()
    f_in.close()

    matches = []
    linecount = 1
    for line in text.splitlines():
        matches += apacheck(line)
        json_data = build_json(matches, infile, linecount)
        linecount += 1

    # print(to console)
    if not quiet:
        print_json(json_data)

    # write to file if there is an output file specified
    if json_data:
           # Changing this for IFS.
        ofile = os.path.normpath( os.path.join( os.path.dirname(infile) , json_ofile +  os.path.basename(infile) ) )
        json_out = open(ofile, 'w')
        json_out.write(json_data)
        json_out.close()

    return 0


if __name__ == '__main__':
    main(sys.argv[1:])
