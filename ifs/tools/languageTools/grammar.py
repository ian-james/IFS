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

import sys, getopt, os
import io, json
import re
import language_check

# grcheck(string to_check, string lang, language_check.LanguageTool ltool, bool console)
def grcheck(to_check, lang, ltool, console):
    json_string = ''
    matches = ltool.check(to_check)
    num_matches = len(matches)

    if console == True:
        print 'lang: ', lang
        print 'matches: ', num_matches
        for i in range(num_matches):
            print "On line:", matches[i].fromy, "at char:", matches[i].fromx,
            print "rule violated:", matches[i].ruleId
            print "Message:", matches[i].msg
            print "Problem category:", matches[i].category
            print "Issue type:", matches[i].locqualityissuetype
            print "Possible replacements:",
            for j in range(len(matches[i].replacements)):
                print matches[i].replacements[j],
            print
            print "Context:", matches[i].context
            print
    # LanguageTool.check.Match type is not JSON serializeable
    # build a JSON string from the array of Match objects
    else:
        json_string += '{\n'
        json_string += '"lang": ' + '"' + lang + '",\n'
        json_string += '"num_matches": ' + str(num_matches) +',\n'
        json_string += '"matches": {\n'
        for i in range(num_matches):
            json_string += '"' + str(i) + '": {\n'
            json_string += '"fromy": ' + str(matches[i].fromy) + ',\n'
            json_string += '"fromx": ' + str(matches[i].fromx) + ',\n'
            json_string += '"ruleId": ' + '"' + str(matches[i].ruleId) + '",\n'
            json_string += '"msg": ' + '"' + str(matches[i].msg) + '",\n'
            json_string += '"category": ' + '"' + str(matches[i].category) + '",\n'
            json_string += '"issuetype": ' + '"' + str(matches[i].locqualityissuetype) + '",\n'
            j_array = json.dumps(matches[i].replacements)
            json_string += '"replacements": ' + j_array + ',\n'
            json_string += '"context": ' + '"' + str(matches[i].context) + '"\n'
            json_string += '}'
            if i != (num_matches -1):
                json_string += ','
            json_string += '\n'
        json_string += '}\n}\n'

        # make formatting prettier
        json_obj = json.loads(json_string)
        json_string = json.dumps(json_obj, indent=2, sort_keys=True)

        return json_string

# main program that takes arguments
def main(argv):
    supported_langs = language_check.get_languages()

    # options
    lang = 'en_CA' #default language
    json_path = ''
    ifile = ''
    console = True

    #define command line arguments and check if the script call is valid
    opts, args = getopt.getopt(argv, 'l:j:i:h',['lang=', 'json=', 'ifile=', 'help'])

    for opt, arg in opts:
        if opt in ('--lang', '-l'):
            lang = arg
            if lang not in supported_langs:
                print 'Error. Language', lang, 'not supported.'
                print 'Available languages:'
                for i in range(len(supported_langs)):
                    print supported_langs[i],
                print
                sys.exit()
        elif opt in ('--json', '-j'):
            json_path = arg
            console = False
        elif opt in ('--ifile', '-i'):
            ifile = arg
            if not (os.path.isfile(ifile)):
                print 'Error. File', ifile, 'does not exist.'
                sys.exit()
        elif opt in ('--help', '-h') or opt not in ('--ifile', '-i'):
            print 'Usage:'
            print 'grammar.py [--lang=LANG] [--json=OUT.json] --ifile=INPUTFILE'
            print 'grammar.py [-l LANG] [-j OUT.json] -i INPUTFILE'
            print
            print 'Supported languages:'
            for i in range(len(supported_langs)):
                print supported_langs[i],
            print
            sys.exit()
    # init language check
    ltool = language_check.LanguageTool(lang)

    # open infile for reading
    f_in = open(ifile, 'r')
    text = f_in.read()

    # perform analysis on file and return json_data for writing to file
    json_data = grcheck(text, lang, ltool, console)
    print(json_data)
  

    f_in.close()

if __name__ == '__main__':
    main(sys.argv[1:])
