#!/usr/bin/env python

# This script uses LanguageTool to process arbitrary text strings and provide
# suggestions for grammatical improvements.
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
import language_check


# print_usage(list supported_langs = [])
# this function prints usage information, optionally provide a list of
# supported languages as an argument
def print_usage(supported_langs = []):
    print 'Usage:'
    print 'grammar.py [--lang=LANG] [--outfile=OUT.json] [--with-spelling]'
    print '           [--english] [--quiet] --infile=INPUTFILE'
    print
    print 'grammar.py [-l LANG] [-j OUT.json] [-seq] -i INPUTFILE'
    print
    if supported_langs:
        supported_langs = list(supported_langs)  # sets are not iterable?
        print 'Supported languages on this system:'
        for i in range(len(supported_langs)):
            print supported_langs[i],
            if i != len(supported_langs) - 1:
                print ",",
        print

# grcheck(string to_check, language_check.LanguageTool ltool,
#         bool with_spelling=False)
# this function performs a grammar check over a string of text, optionally with
# spell checking enabled
def grcheck(to_check, ltool, with_spelling=False):
    matches = ltool.check(to_check)

    if with_spelling is True:
        return matches
    else:
        matches[:] = [x for x in matches
                      if (x.locqualityissuetype != "misspelling")]
        return matches

# LanguageTool.check.Match type is not JSON serializeable, so this function
# builds a JSON string from the array of Match objects
# build_json(string filename, string lang, list matches)
def build_json(filename, lang, matches):
    num_matches = len(matches)
    json_string = ''
    json_string += '{ '
    json_string += '"feedback": ['
    for i in range(num_matches):
        json_string += ('{ '
                        + '"target": "' + str(matches[i].context) + '", ')
        # a grammatical issue may span multiple words and lines, so it's best
        # to represent the position of the issue as a span of char coordinates;
        # the hl_begin and hl_end attributes consist of the following structure:
        # [char pos relative to start of line, line relative to start of file]
        hl_begin = [matches[i].fromx + 1, matches[i].fromy + 1]
        hl_begin = json.dumps(hl_begin)
        hl_end = [matches[i].tox + 1, matches[i].toy + 1]
        hl_end = json.dumps(hl_end)
        json_string += ('"hl_begin": ' + hl_begin + ', '
                        + '"hl_end": ' + hl_end + ', '
                        + '"lang": ' + '"' + lang + '", '
                        + '"type": ' + matches[i].locqualityissuetype + '", '
                        + '"toolName": "Language Tool", '
                        + '"filename": "' + filename + '", '
                        + '"feedback": ' + '"' + str(matches[i].msg) + '", ')
        j_array = json.dumps(matches[i].replacements)
        json_string += ('"suggestions": ' + j_array
                        + ' }')
        if i != (num_matches - 1):
            json_string += ','
    json_string += ' ] }'

    # make formatting prettier
    json_obj = json.loads(json_string)
    json_string = json.dumps(json_obj, indent=4, sort_keys=True)
    json_string += '\n'

    return json_string


# print_data(string json_data, lang, bool english=False, list matches=[]
# note that all arguments are optional, but if the english flag is true, then
# the language and matches list must be provides. If no english flag is
# provided, then the json_data must be provided
def print_data(json_data='', lang='', english=False, matches=[]):
    if english is True:
        print 'lang: ', lang
        print 'possible errors: ', len(matches)
        print
        for i in range(len(matches)):
            print "hl_start:", (matches[i].fromx + 1, matches[i].fromy + 1)
            print "hl_end  :", (matches[i].tox, matches[i].toy)
            print "rule violated:", matches[i].ruleId
            print "Message:", matches[i].msg
            print "Problem category:", matches[i].category
            print "Issue type:", matches[i].locqualityissuetype
            print "Possible replacements:",
            for j in range(len(matches[i].replacements)):
                print matches[i].replacements[j],
            print
            print "Context:", matches[i].context
            if i != len(matches) - 1:
                print
    else:
        if json_data:
            print json_data
        else:
            sys.stderr.write('Error. Cannot print output.\n')

    return


# main program that takes arguments
def main(argv):
    supported_langs = language_check.get_languages()

    # options
    lang = 'en_CA'  # default language
    json_path = ''
    infile = ''
    english = False # prints plain English instead of json
    quiet = False
    with_spelling = False

    # define command line arguments and check if the script call is valid
    try:
        opts, args = getopt.getopt(argv, 'l:o:i:sqh', ['lang=', 'outfile=',
                                                      'infile=',
                                                      'with-spelling', 'quiet',
                                                      'english', 'help'])
    except getopt.GetoptError as err:
        sys.stderr.write('Error. ' + str(err) + '\n')
        print_usage();
        sys.exit(2) # code 2 means misuse of shell cmd according to Bash docs

    # set options
    if not opts:
        sys.stderr.write('Error. No arguments provided.\n')
        print_usage()
        sys.exit(2)

    for opt, arg in opts:
        if opt in ('--lang', '-l'):
            lang = arg
            if lang not in supported_langs:
                sys.stderr.write('Error. Language ' + lang
                                 + ' not supported.\n')
                sys.stderr.write('Available languages:\n')
                for i in range(len(supported_langs)):
                    sys.stderr.write(supported_langs[i])
                    sys.stderr.write(' ')
                sys.stderr.write('\n')
                sys.exit()
        elif opt in ('--outfile', '-o'):
            json_path = arg
        elif opt in ('--infile', '-i'):
            infile = arg
            if not (os.path.isfile(infile)):
                sys.stderr.write('Error. File ' + infile
                                 + ' does not exist.\n')
                sys.exit(1)
        elif opt in ('-s', '--with-spelling'):
            with_spelling = True
        elif opt == '--english':
            english = True
        elif opt == '--quiet':
            quiet = True
        elif opt in ('--help', '-h'):
            print_usage(supported_langs);
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
    elif english and quiet:
        sys.stderr.write('Warning: Suppressing specified plain English '
                         + 'output. Did you mean to do this?\n')

    # init language check
    ltool = language_check.LanguageTool(lang)

    # perform the grammar check
    f_in = open(infile, 'r')
    text = f_in.read()
    matches = grcheck(text, ltool, with_spelling)
    f_in.close()

    # build json string
    json_data = build_json(infile, lang, matches)

    # print to console
    if not quiet:
        if english is True:
            print_data(None, lang, english, matches)
        else:
            print_data(json_data)


    # write to file if there is an output file specified
    if json_path and json_data != '':
        json_out = open(json_path, 'w')
        json_out.write(json_data)
        json_out.close()

if __name__ == '__main__':
    main(sys.argv[1:])
