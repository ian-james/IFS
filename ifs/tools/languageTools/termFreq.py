#!/usr/bin/env python
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
    options = { 'termLimit': 50, 'file':'', 'language':'english' }

    # define command line arguments and check if the script call is valid
    opts, args = getopt.getopt(argv,'t:l:f:h',['terms=','language=','file=', 'help'])

    for opt, arg in opts:
        if opt in ('--terms', '-t'):
           # open infile for reading
           options['termLimit'] = int(arg)
            
        elif opt in ('--file', '-f'):
            ifile = arg
            if not (os.path.isfile(ifile)): 
                sys.stderr.write( 'Error. File ' + ifile + ' does not exist.' )
                sys.exit()
        else:
            print 'Usage: Displays the most frequently occurring terms from a file'
            print 'termFreq.py [-t TERM_LIMIT] [-l LANGUAGE] -i INPUTFILE'
            sys.exit()

    if ifile != '':
        options['file'] = ifile
        with open(ifile, 'r') as myfile:
            fileContents= myfile.read().replace('\n','')

        print( termFreq(fileContents, options ) )
    else
        sys.stderr.write( 'Please provide a file to evaluate.')
        sys.exit()

if __name__ == '__main__':
    main(sys.argv[1:])
