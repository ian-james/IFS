#!/usr/bin/env python3.5
#
# This script uses Hunspell to process arbitrary text strings and provide
# suggestions for spelling correction.
#
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
from nltk.probability import FreqDist
from nltk.corpus import stopwords
from nltk.tokenize import wordpunct_tokenize

def decorateData( result, options ):
    json_string = ""
    json_string += '{\n'
    json_string += '"feedback": [\n'
    json_string += '{\n'
    json_string += '"type": "wordCloud",\n'
    json_string += '"wordCount":' + str(options['termLimit']) + ',\n'
    j_array = json.dumps( result );
    json_string += '"wordFreq": ' + j_array + '\n'
    json_string += '}\n'
    json_string += ']\n'
    json_string += '}\n'

    return json_string

# This function creates an array of array of [term freq] of words in text
# Stop words and punctutation are removed.
def termFreq( text, options ):
    # Stop Words
    swords = set(stopwords.words( options['language'] ) )
    swords.update(['.', ',', '"', "'", '?', '!', ':', ';', '(', ')', '[', ']', '{', '}'])

    # Change to lower case and tokenize, exclude punctuation and stopwords
    words = [ i.lower() for i in wordpunct_tokenize(text) if i.lower() not in swords]

    fdist = FreqDist(words)
    result = [ list(i) for i in fdist.most_common( options['termLimit'] ) ]

    return result

# main program that takes arguments
def main(argv):

    ifile =''
    console = True
    options = { 'termLimit': 20, 'file':'', 'language':'english','ifs': True }

    # define command line arguments and check if the script call is valid
    opts, args = getopt.getopt(argv,'i:t:l:f:h',['ifsOff=', 'terms=','language=','file=', 'help'])

    for opt, arg in opts:
        if opt in ('--terms', '-t'):
           options['termLimit'] = int(arg)
            
        elif opt in ('--file', '-f'):
            ifile = arg
            if not (os.path.isfile(ifile)): 
                sys.stderr.write( 'Error. File ' + ifile + ' does not exist.' )
                sys.exit()
        elif opt in ('--ifsOff', '-i'):
            options['ifs'] = False
        else:
            print('Usage: Displays the most frequently occurring terms from a file')
            print('termFreq.py [-i IFS MODE] [-t TERM_LIMIT] [-l LANGUAGE] -f InputFile')
            sys.exit()

    if ifile != '':
        options['file'] = ifile
        with open(ifile, 'r', encoding='utf-8') as myfile:
            fileContents= myfile.read().replace('\n','')

        result = termFreq(fileContents, options )
        if( options['ifs'] ):
            result = decorateData( result, options )
        print( result )
    else:
        sys.stderr.write( 'Please provide a file to evaluate.\n')
        sys.exit()

if __name__ == '__main__':
    main(sys.argv[1:])
