#!/usr/bin/env python3

# This script uses Hunspell to process arbitrary text strings and provide
# suggestions for spelling correction.
#
# Copyright (c) 2017 Keefer Rourke <mail@krourke.org>
#                    James Fraser  <jamey.fraser@gmail.com>
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
import hunspell


# this function prints usage information
def print_usage():
    print( 'Usage:')
    print( 'spell_check.py [--path=PATH] [--lang=LANG] [--limit=LIM] [--correct]')
    print( '               [--outfile=OUT.json] [--english OR --quiet]')
    print( '               --infile=INPUTFILE')
    print()
    print( 'spell_check.py [-p PATH] [-l LANG] [-d LIM] [-c] [-o OUT.json] [-q]')
    print( '               -i INPUTFILE')

    return


# this function returns true if a string is a valid complex, real, or integer
# number
def isnumber(string):
    try:
        complex(string)  # try casting the string as a complex type
    except ValueError:
        return False

    return True


# spcheck(string to_check, string lang, int limit, hunspell.HunSpell hun)
# returns two lists -- mispelled is a complicated structure that is handled in
# build_json() and print_data()
def spcheck(to_check, lang, limit, hun):
    misspelled = []  # each element is (line_num, word_num, (word, suggest[]))
    correct_words = []  # each element is (line_num, word_num, word)
    json_string = ''

    #    *_num is the global position ( line, word, char )
    #    *_pos relative position on the line ( word, char )
    char_num = 0
    line_num = 0
    word_num = 0
    # use built in word matching pattern
    regex = re.compile(r'((?!\'.*\')\b[\w\']+\b)')

    count = 0
    for line in to_check:
        char_pos= 0
        word_pos = 0
        for chunk in line.split():
            # simple regex to ensure that punctuation at the end of a word is
            # not passed to hunspell i.e. prevents false alarms
            res = regex.match(chunk)
            if res:
                word = res.group(0)
                char_pos = line.find(word, char_pos)

                if not hun.spell(word):
                    sug = [ x for x in hun.suggest(word) ]
                    suggestion = (line_num, word_num, char_num+char_pos, char_pos, word_pos, (word, sug))
                    misspelled.append(suggestion)

                else:
                    correct_words.append((line_num, word_num, word))

                word_num += 1
                word_pos += 1
                count += 1

        line_num += 1
        char_num += len(line)

        # limit error matches
        if count >= limit:
            break;

    feedback_stats = []
    # Note 'key' value shouldn't be changed unless changing in IFS
    # Storing Counts for correct and incorrect
    feedback_stats.append({
        'displayName': "Correct Word Count",
        'key': 'correctWordCount',
        'level': 'basic',
        'score': len(correct_words),
    })
    feedback_stats.append({
        'displayName': "Misspelled Word Count",
        'key': 'misspelledWordCount',
        'level': 'basic',
        'score': len(misspelled),
    })

    return misspelled, correct_words, feedback_stats


# build_feedbackStats_json(string filename, array of objects results)
# Results contains multiple items with key,level
# These attributes align with IFS Feedback_Mysql table
def build_feedbackStats_json(filename, results):
    shortFile = os.path.basename(filename)
    json_string = '"feedbackStats": [\n'
    for value in results:
        json_string += "{"
        json_string += '"type": "stat",\n'
        json_string += '"toolName": "hunspell",\n'
        json_string += '"name": "' + value['key'] + '",\n'
        json_string += '"level": "' + value['level'] + '",\n'
        json_string += '"category": "spelling",\n'
        json_string += '"filename": "' + shortFile + '",\n'
        json_string += '"statName": "' + value['displayName'] + '",\n'
        json_string += '"statValue": "' + str(value['score']) + '"\n'
        json_string += "}"
        json_string += ','

    # Remove the last ,
    json_string = json_string[:-1]
    json_string += ']\n'

    return json_string


# build_json(list misspelled, string filename, list correct=[])
# note that the correct list is optional
def build_json(misspelled, feedback_stats, filename, lang, correct=[]):
    filename = os.path.basename(filename)
    json_string = ''

    json_string += '{ '
    json_string += '"feedback": [ '
    # add correct words to the json string, if a list is provided
    # this may be useful in the event that someone wants to do an analysis on
    # most commonly correctly spelled words
    if correct:
        for i in range(len(correct)):
            json_string += ('{ '
                            + '"target": "' + str(correct[i][2]) + '", '
                            + '"wordNum": ' + str(correct[i][1]) + ', '
                            + '"lineNum": ' + str(correct[i][0]) + ', '
                            + '"filename": "' + filename + ', '
                            + '"type": "correct",'
                            + '"toolName": "Spell Checker",'
                            + '"feedback": "Selected word is correct.", '
                            + '"lang": ' + '"' + lang + '"'
                            + ' },')

    # always add misspelled words to the json, along with other useful info
    for i in range(len(misspelled)):
        j_array = json.dumps(misspelled[i][5][1])
        json_string += '{'
        json_string += '"target":"' + str(misspelled[i][5][0]) + '",'
        json_string += '"lineNum": ' + str(misspelled[i][0]) + ','
        json_string += '"wordNum": ' + str(misspelled[i][1]) + ','
        json_string += '"charNum": ' + str(misspelled[i][2]) + ','
        json_string += '"charPos": ' + str(misspelled[i][3]) + ','
        json_string += '"wordPos": ' + str(misspelled[i][4]) + ','
        json_string += '"type": "spelling",'
        json_string += '"toolName": "Spell Checker",'
        json_string += '"filename": "' + filename + '",'
        json_string += '"feedback": "Selected word not found in ' + lang + ' dictionary", '
        json_string += '"suggestions": ' + j_array + ''
        json_string += '}'

        if i != (len(misspelled) - 1):
            json_string += ','
    json_string += ' ],\n'
    json_string += build_feedbackStats_json(filename, feedback_stats) + "\n"
    json_string += ' }'

    # make formatting prettier
    json_obj = json.loads(json_string)
    json_string = json.dumps(json_obj, indent=4, sort_keys=True)
    json_string += '\n'

    return json_string


# print_data(string json_data, string lang, bool english=False,
#             list misspelled=[], list correct_words=[])
# note that all arguments are optional, but if the english flag is true, then
# the language and misspelled list must be provided. If no english flag is
# provided, then json_data must be provided.
def print_data(json_data='', lang='', english=False, misspelled=[],
               correct_words=[]):
    # print(data from lists in english if specified)
    if english is True:
        print('lang: ', lang)
        # print(correctly spelled words)
        if correct_words:
            print('correctly spelled words:')
            for i in range(len(correct_words)):
                print('at word:', correct_words[i][1],)
                print('on line:', correct_words[i][0],)
                print('"' + correct_words[i][2] + '"')
            print('\n')
        # print(suggestions for misspelled words)
        if not misspelled:
            sys.stderr.write('Error. Misspelled list is required for plain ' +
                             'English console output.\n')
            return
        else:
            for i in range(len(misspelled)):
                print('misspelled word:')
                print('at word:', misspelled[i][1],)
                print('on line:', misspelled[i][0],)
                print('"' + misspelled[i][5][0] + '"')
                print('suggestions:',)
                for j in range(len(misspelled[i][5][1])):
                    print(misspelled[i][5][1][j],)
                print('\n')
    else:
        if json_data:
            print(json_data)
        else:
            sys.stderr.write('Error. Cannot print output.\n')

    return


# main program that takes arguments
def main(argv):
    # options
    path_deb = '/usr/share/hunspell/'  # default hunspell install path on Debian
    path_rpm = '/usr/share/myspell/' # default hunspell dictionary path on Fedora
    lang = 'en_CA'  # default language
    limit = -1      # limit for number of errors reported
    json_path = ''
    infile = ''
    with_correct = False
    english = False  # prints plain English instead of json
    quiet = False

    misspelled = []
    correct_words = []
    feedback_stats = []

    # define command line arguments and check if the script call is valid
    try:
        opts, args = getopt.getopt(argv, 'p:l:d:o:i:cqh', ['path=', 'lang=', 'limit=', 'outfile=', 'infile=', 'correct', 'english', 'quiet', 'help'])
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
        if opt in ('--path', '-p'):
            path = arg
            if not os.path.isdir(path):
                sys.stderr.write('Error. Path ' + path + ' does not exist.\n')
                sys.exit()
        elif opt in ('--lang', '-l'):
            lang = arg
        elif opt in ('--limit', '-d'):
            limit = int(arg)
        elif opt in ('--outfile', '-o'):
            json_path = arg
        elif opt in ('--infile', '-i'):
            infile = arg
            if not (os.path.isfile(infile)):
                sys.stderr.write('Error. File ' + infile + ' does not exist.\n')
                sys.exit(1)
        elif opt in ('--correct', '-c'):
            with_correct = True
        elif opt == '--english':
            english = True
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
        sys.stderr.write('Error. The quiet option cannot be used without specifying an output file.\n')
        sys.exit(2)
    elif english and quiet:
        sys.stderr.write('Warning: Suppressing specified plain English output. Did you mean to do this?\n')

    # check dictionaries exist
    hun_path_deb = path_deb + '/' + lang
    hun_path_rpm = path_rpm + '/' + lang
    hun_path = '';
    if (os.path.isfile(hun_path_deb + '.dic')):
        hun_path = hun_path_deb
    elif (os.path.isfile(hun_path_rpm + '.dic')):
        hun_path = hun_path_rpm
    else:
        sys.stderr.write('Error. Could not find dictionary.\n')
        sys.exit(1)
    if not (os.path.isfile(hun_path + '.aff')):
        sys.stderr.write('Error. Count not find aff file at ' + hun_path + '.aff\n')
        sys.exit(1)

    # init hunspell
    hun = hunspell.HunSpell(hun_path + '.dic', hun_path + '.aff')

    # perform the spell check
    f_in = open(infile, 'r', encoding="utf-8")
    misspelled, correct_words, feedback_stats = spcheck(f_in, lang, limit, hun)
    f_in.close()

    # build json string
    if with_correct is True:
        json_data = build_json(misspelled, feedback_stats, infile, lang, correct_words)
    else:
        json_data = build_json(misspelled, feedback_stats, infile, lang)

    # print(to console)
    if not quiet:
        if english and with_correct:
            print_data(None, lang, english, misspelled, correct_words)
        elif english and not with_correct:
            print_data(None, lang, english, misspelled)
        else:
            print_data(json_data)

    # write to file if there is an output file specified
    if json_path and json_data != '':
        json_out = open(json_path, 'w')
        json_out.write(json_data)
        json_out.close()

if __name__ == '__main__':
    main(sys.argv[1:])
