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

from . import __version__
from . import pyapa


def print_usage():
    print('Usage:')
    print('pyapa [-h] [--version] [-o OUTPUT_FILE] -i INPUT_FILE')


def f_open(filename):
    f_in = open(filename, 'r', encoding='utf-8')
    text = f_in.read()
    f_in.close()

    return text

def f_write(filename, matches):
    output = ''
    for m in matches:
        output += m.sprint()
        output += '\n'

    f_out = open(filename, 'w')
    f_out.write(output)
    f_out.close()


def apacheck(text):
    a = pyapa.ApaCheck()

    return a.match(text)

def main(argv):
    infile = ''
    outfile = ''
    version = ''

    try:
        opts, args = getopt.getopt(argv, 'o:i:vh', ['output=', 'input=',
                                                    'version', 'help'])
    except getopt.GetoptError as err:
        sys.stderr.write('Error. ' + str(err) + '\n')
        print_usage()
        sys.exit(2)

    if not opts:
        sys.stderr.write('Error. No arguments provided.')
        print_usage()
        sys_exit(2)

    for opt, arg in opts:
        if opt in ('--output', '-o'):
            outfile = arg
        elif opt in ('--input', '-i'):
            infile = arg
            if not os.path.isfile(infile):
                sys.stderr.write('Error. File ' + infile
                                 + 'does not exist.\n')
                sys.exit(1)
        elif opt in ('--version', '-v'):
            version = 'pyapa v' + str(__version__)
            print(version)
        elif opt in ('--help', '-h'):
            print_usage()
            sys.exit(0)
        else:
            assert False, 'unhandled option'

    if not infile and version:
        sys.exit(0)
    elif not infile and not version:
        sys.stderr.write('Error. Input file is required.\n')
        print_usage()
        sys.exit(2)

    text = f_open(infile)
    matches = apacheck(text)

    if outfile and matches:
        f_write(outfile, matches)
    elif (not outfile) and matches:
        for m in matches:
            m.print()
            print("\n")
    else:
        print("No errors found! Your file might conform to APA style!")

    return 0
