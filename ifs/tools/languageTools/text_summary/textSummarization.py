#!/usr/bin/env python3
#
# This script identifies the most prevalent sentences in writing based on term
# frequency
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
#
# Inspired by:
# http://glowingpython.blogspot.ca/2014/09/text-summarization-with-nltk.html
# Optimiziationa and Customization performed to suit our own academic needs.
#
#
# Required is nltk punkt and stopwords
#
# This file reads in a text file and summarizes the text.
# It does this by selecting sentences with the high total score based on
# the frequency of terms in the sentences. So it estimates that reoccuring
# words are important after elminating overly/underly used words.

import sys, getopt, os
import io, json
import re

from nltk.probability import FreqDist
from nltk.corpus import stopwords
from nltk.tokenize import sent_tokenize, wordpunct_tokenize, word_tokenize
from collections import defaultdict
from heapq import nlargest
from string import punctuation

class FrequencySummarizer:

    def __init__(self, options  = None ):

        options = options or {};
        self.minCut = 0.2 if not hasattr(options,'minCut') else options['minCut']
        self.maxCut = 0.9 if not hasattr(options,'maxCut') else options['maxCut']
        self.lang =  'english' if not hasattr(options, 'lang') else options['lang']
        self.stopwords = set( stopwords.words( self.lang ) )

        # Remove stop words
    def cleanWords(self, text ):
        swords = self.stopwords.union(set(punctuation))
        #swords.update(['.', ',', '"', "'", '?', '!', ':', ';', '(', ')', '[', ']', '{', '}'])
        # Change to lower case and tokenize, exclude punctuation and stopwords
        words = [ i.lower() for i in word_tokenize(text) if i.lower() not in swords]
        return words

    # Computes the frequency for each word
    def termFreq(self, text ):
        fdist = FreqDist(text)
        return fdist

        # Remove Words that are too common or too rare.
    def cutWords(self, freqDist ):

        maxValue = freqDist.max()
        maxFreq = freqDist[maxValue]

        maxCut = self.maxCut * maxFreq
        minCut = self.minCut * maxFreq

        # Doesn't delete in iteration, likely newer python feature
        toDelete = [];
        for w,v in freqDist.items():
            if( freqDist[w] < minCut or freqDist[w] > maxCut ):
                toDelete.append(w)

        for w in toDelete:
            del freqDist[w]

        return freqDist

        # Retrieve the highest ranked sentences
    def rank(self, ranking, n ):
        return nlargest(n, ranking, key=ranking.get)

        # Process of taking words tokenization and frequency counting.
    def summarize(self, text, numSentences ):

        # Tokensize sentences
        # Term Frequency and Cut words
        words= self.cleanWords( text )
        termFreq = self.termFreq( words )
        usefulWords = self.cutWords( termFreq )

        # Tokenize sentences
        sents = sent_tokenize( text )
        numSentences =  max( 0, min( int(numSentences), len(sents) ) )

        ranking = defaultdict(int)
        for i, sent in enumerate(sents):
            for w in sent.split():
                if w in usefulWords:
                    ranking[i] += usefulWords[w]

        sentIdx = self.rank(ranking, numSentences)
        return [ sents[j] for j in sentIdx ]


# Prepare for IFS
def decorateData( result, options ):
    json_string = ""
    json_string += '{\n'
    json_string += '"feedback": [\n'
    json_string += '{\n'
    json_string += '"tool": "textSummarization",\n'
    json_string += '"filename": "' + str(options['file']) + '",\n'
    json_string += '"originalname": "' + str( os.path.basename( options['file']) ) + '",\n'
    json_string += '"senCount":' + str(options['sentences']) + ',\n'
    j_array = json.dumps( result );
    json_string += '"sentences": ' + j_array + '\n'
    json_string += '}\n'
    json_string += ']\n'
    json_string += '}\n'

    return json_string


# main program that takes arguments
def main(argv):

    ifile = ""
    options = { 'ifs': True, 'sentences': 2 }
    fileContents = ""
    # define command line arguments and check if the script call is valid

    opts, args = getopt.getopt(argv,'i:s:f:h',['ifsOff=','sentences=', 'file=', 'help'])

    for opt, arg in opts:
        if opt in ('--file', '-f'):
            ifile = arg
            if not (os.path.isfile(ifile)):
                sys.stderr.write( 'Error. File ' + ifile + ' does not exist.' )
                sys.exit()
        elif opt in ('--sentences', '-s'):
            options['sentences'] = arg
        else:
            print('Usage: Displays the sentences with the most commonly used words')
            print('textSummarization.py [-s SENTANCES TO INCLUDE] -f InputFile')
            sys.exit()

    if ifile != '':
        options['file'] = ifile;
        with open(ifile, 'r', encoding='utf-8') as myfile:
            fileContents= myfile.read()

        summarizer = FrequencySummarizer()
        result = summarizer.summarize(fileContents, options['sentences'] )

        if( options['ifs'] ):
            result = decorateData( result, options )
        print( result )

if __name__ == '__main__':
    main(sys.argv[1:])

