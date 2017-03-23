#!/usr/bin/env python3.5

# This script uses Hunspell to process arbitrary text strings and provide
# suggestions for spelling correction.
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
import hunspell

# spcheck(string to_check, string lang, hunspell.HunSpell hun, bool console)
def spcheck(to_check, lang, hun, console, filename):
    misspelled = [] # each element is (line_num, word_num, (word, suggest[]))
    correct = [] # each element is (line_num, word_num, word)
    json_string = ''

    # Just the filename is needed for the IFS.
    filename = os.path.basename(filename)
    regex = re.compile(r'[^a-zA-z]*([a-zA-Z]+([-\'][a-zA-Z]+)*)')

    #
    #    *_num is the global position ( line, word, char )
    #    *_pos relative position on the line ( word, char )
    #

    char_num = 0
    line_num = 0
    word_num = 0
    for line in to_check:

        char_pos= 0
        word_pos = 0
        for word in line.split(): # tokenize by whitespace delimeters?
            # simple regex to ensure that punctuation at the end of a word is
            # not passed to hunspell i.e. prevents false alarms
            res = regex.match(word )
           
            if( res ):
                word = res.group(1)

            char_pos = line.find( word, char_pos )
            # note that hunspell will think that cat!dog is not a word, but
            # hyphenated words such as cat-dog may pass, even though they
            # aren't in the English lexicon
            if not hun.spell(word):
                sug = [ x.decode('utf-8') for x in hun.suggest(word) ]
                suggestion = (line_num, word_num, char_num+char_pos, char_pos, word_pos, (word, sug))
                misspelled.append(suggestion)
            else:
                correct.append((line_num, word_num, word))

            word_num += 1
            word_pos += 1

        line_num += 1
        char_num += len(line)
    # print data from lists to the console if in console mode
   
    json_string += '{\n'
    json_string += '"feedback": [\n'
    for i in range(len(misspelled)):
        json_string += '{\n'
        json_string += '"target":"' + str(misspelled[i][5][0]) + '",\n' 
        json_string += '"lineNum": ' + str(misspelled[i][0]) + ',\n'
        json_string += '"wordNum": ' + str(misspelled[i][1]) + ',\n'
        json_string += '"charNum": ' + str(misspelled[i][2]) + ',\n'
        json_string += '"charPos": ' + str(misspelled[i][3]) + ',\n'
        json_string += '"wordPos": ' + str(misspelled[i][4]) + ',\n'
        json_string += '"type": "spelling",\n'
        json_string += '"toolName": "hunspell",\n'
        json_string += '"filename": "' + str(filename) + '",\n'
        json_string += '"feedback": "Selected word not found in dictionary",\n'

        j_array = json.dumps(misspelled[i][5][1]) 
        json_string += '"suggestions": ' + j_array + '\n'
        json_string += '}'
        if i != (len(misspelled) - 1):
            json_string +=','
        json_string += '\n'
    json_string += ']\n'
    json_string += '}\n'

    # make formatting prettier
    json_obj = json.loads(json_string)
    json_string = json.dumps(json_obj, indent=4, sort_keys=False)

    return json_string

# main program that takes arguments
def main(argv):
    # options
    path = '/usr/share/hunspell/' # default hunspell install path
    lang = 'en_CA' #default language
    json_path = ''
    ifile = ''
    console = True

    # define command line arguments and check if the script call is valid
    opts, args = getopt.getopt(argv,'p:l:j:i:h',['path=','lang=', 'json=', 'ifile=', 'help'])

    for opt, arg in opts:
        if opt in ('--path', '-p'):
            path = arg
            if not os.path.isdir(path):
                print('Error. Path', path, 'does not exist.')
                sys.exit()
        elif opt in ('--lang', '-l'):
                lang = arg
        elif opt in ('--json', '-j'):
            json_path = arg
            console = False
        elif opt in ('--ifile', '-i'):
            ifile = arg
            if not (os.path.isfile(ifile)):
                print('Error. File', ifile, 'does not exist.')
                sys.exit()
        elif opt in ('--help', '-h') or opt not in ('--ifile', '-i'):
            print('Usage:')
            print('spell_check.py [--path=PATH] [--lang=LANG] [--json=OUT.json] --ifile=INPUTFILE')
            print('spell_check.py [-p PATH] [-l LANG] [-j OUT.json] -i INPUTFILE')
            sys.exit()

    # check dictionaries exist    
    hun_path = path + '/' + lang
    if not (os.path.isfile(hun_path + '.dic')):
        sys.stderr.write('Error. Could not find dictionary at '
                         + hun_path + '.dic\n')
        sys.exit()
    if not (os.path.isfile(hun_path + '.aff')):
        sys.stderr.write('Error. Count not find aff file at '
                         + hun_path + '.aff\n')
        sys.exit()

    # init hunspell
    hun = hunspell.HunSpell(hun_path+'.dic', hun_path+'.aff')

    # open infile for reading
    f_in = open(ifile, 'r', encoding="utf-8")

    # perform analysis on file and return json_data for writing to file
    json_data = spcheck(f_in, lang, hun, console, ifile)
    print(json_data)
    
    #
    #if console == False and json_data != '':
    #    json_out = open(json_path, 'w')
    #    json_out.write(json_data)
    #    json_out.close();

    #f_in.close()

if __name__ == '__main__':
    main(sys.argv[1:])
