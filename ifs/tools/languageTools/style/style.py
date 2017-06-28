#!/usr/bin/env python3

# This script parses diction data for statistics about the running program.
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

import sys, getopt, os
import io
import json
import re
import string
from subprocess import call
from subprocess import Popen, PIPE
import shlex
import glob

def createCmd( options ):

    cmdStr = ""
    cmdStr = " ".join( [ options['tool'], options['arg'], options['file']])
    return cmdStr

def findArr(arr, target):
    try:
        return arr.index(target)
    except:
        return -1

# setupSectionTargets - identifies the sections by the following titles
def setupSectionTargets():
    targets = [];
    targets.append("readability grades:")
    targets.append("sentence info:")
    targets.append("word usage:")
    targets.append("sentence beginnings:")
    return targets;

# separate and clean data of white space
def cleanData(line, splitter):
    sides = line.split(splitter)
    for i,s in enumerate(sides):
        sides[i] = s.strip()
    return sides

# combines two arrays into object
def keyValues( keys, values ):
    dictionary = dict(zip(keys,values))
    return dictionary

# Separates data into sections based on a separated.
def countSections(line, options, keys):
    sections = cleanData(line, options['sep'])
    return keyValues(keys, sections)

# retrieves all values in a sentence with a specific structure, ie all numbers
def countStructure(line, options, keys):
    sections = re.findall(options['regex'],line)
    ##print("COUNT SECT", sections)
    return keyValues(keys, sections)

# parse for readability scores
def findReadabilityScore(line, values):
   return countSections(line,{'sep':":"},values)

# parse a number from a line
def numericValue (line ):
    regex = re.compile(r"([-+]?\d*\.\d+|[-+]?\d+)")
    res = regex.match(line)
    if res:
        return res.group(1)
    return 0

# Retrieve simple character format 123 characters.
def countChars(line):
    regex = re.compile(r'(\d+)')
    res = regex.match(line)
    wordCount = 0
    if res:
        wordCount = res.group(1)
    return {'character count':wordCount }

# readGrades - parses the readability scores test names and values
def readGrades( file ):
    #Kincaid
    ##ARI
    #Coleman-Liau
    #Flesch Index
    #Fog
    #Lix
    #SMOG
    grades = {}
    scores = ["Kincaid", "ARI","Coleman-Liau","Flesch Index", "Fog Index", "Lix","SMOG-Grading"]
    for score in scores:
        obj = findReadabilityScore(file.readline().strip(), ['Name', 'Value'])
        grades[score] = numericValue(obj['Value'])
    return grades

# readSentence - parses the sentence info from (Diction tool)
# Severall lines are skipped due to lack of information and clarity.
def readSentenceInfo(file):
    # chars
    option = {'regex':r"[-+]?\d*\.\d+|[-+]?\d+"}
    line = file.readline().strip()
    result = countChars(line)
    # 3 num, words
    line = file.readline().strip()
    result.update( countStructure(line, option, ["words count","avg characters per word","avg syllables"]) )    
    # 2 nums sentences
    line = file.readline().strip()
    result.update( countStructure(line, option, ["number of sentences","average words per sentence"]) )
    
    # % Short Sentences
    line = file.readline().strip()
    result.update( countStructure(line, option, ["short sentences percentage","shortNum","at most N words"]) )
    # % Long Sentences
    line = file.readline().strip()
    result.update( countStructure(line, option, ["long sentences percentage","longNum","at least N words"]) )
    # 2 num, Paragraphs
    line = file.readline().strip()
    result.update( countStructure(line, option, ["number of paragraphs","average sentences per paragraph"]) )
    # % Questions
    line = file.readline().strip()
    # % Passive Sentences
    line = file.readline().strip()
    # sentence wds (?)
    line = file.readline().strip()
    return result


def parseData( file, options ):
    section = 0
    line = 0
    sectionTargets = setupSectionTargets()

    result = {}
    line = file.readline().strip()

    while( line ):
        idx  = findArr(sectionTargets,line)

        if( idx == 0 ):
            result = readGrades(file)
        elif (idx == 1):
            result.update( readSentenceInfo(file) )
        else:
            # Only reading until word usage section
            # Usefulness of other sections is undetermined.
            break
        line = file.readline().strip()
    return result

# Put this into IFS format.
def decorateData( result, options ):
    
    json_string = ''
    json_string += '{ '
    json_string += '"feedback": [],\n'
    json_string += '"feedbackStats": [\n'
    
    addedFeedback = False
    for key,value in result.items():
        addedFeedback = True
        json_string += "{"
        json_string += '"type": "statistics",\n'
        json_string += '"toolName": "style",\n'

        json_string += '"filename": "' + options['file'] + '",\n'

        json_string += '"statName": "' + key + '",\n'
        json_string += '"statValue": "' + str(value) + '"\n'
        json_string += "}"

        if( addedFeedback ):
            json_string += ','

    # Remove the last ,
    json_string = json_string[:-1]
    json_string += ']\n'
    json_string += '}\n'

    return json_string

# This function runs a command output results to two files
def getProcessInfo( cmd, outFile, errorFile ):
    # Executing an external command, to retrieve the output
    # This funciton is supported by several answers on StackOverflow
    # https://stackoverflow.com/questions/1996518/retrieving-the-output-of-subprocess-call/21000308#21000308
    with open(outFile, 'w', encoding='utf-8') as fout:
        with open(errorFile,'w', encoding='utf-8') as ferr:
            args = shlex.split(cmd)

            # Note this requires python 3.3
            proc = Popen(args, stdout=fout, stderr=ferr)

            out, err = proc.communicate()
            exitcode = proc.returncode

            return exitcode, out, err

# main program that takes arguments
def main(argv):
    ifile = ''
    options = { 'tool': 'style',
                'ifs': True,
                'outFile':'stdout.txt',
                'outErrFile':'stderr.txt',
                'arg': ''
              }

    # define command line arguments and check if the script call is validq
    opts, args = getopt.getopt(argv,'f:h', ['file=','help'])

    for opt, arg in opts:
        if opt in ('file', '-f'):
            ifile = arg
            if not (os.path.isfile(ifile)):
                sys.stderr.write( 'Error: File ' + ifile + ' does not exist.\n' )
                sys.exit()
        else:
            print( 'Usage: Process files looking for readability scores.')
            print( options['tool'], ' -f file')
            sys.exit()

    if ifile != '':
        options['file'] = ifile

        cmd = createCmd( options )

        if( cmd ):
            try:
                outFile = os.path.normpath( os.path.join( os.path.dirname(ifile), options['outFile']) )
                outErrFile = os.path.normpath( os.path.join( os.path.dirname(ifile), options['outErrFile']) )
                code, out, err = getProcessInfo( cmd, outFile, outErrFile )

                with open(outFile, 'r', encoding='utf-8') as outFile:

                    result = parseData(outFile, options)
                    if( result and options['ifs'] ):
                        result = decorateData( result, options )
                    print( result )
            except:
                sys.stderr.write("Unable to successfully retrieve assessment information.\n")
        else:
            sys.stderr.write( 'Invalid tool selected, please select a valid tool name.\n')
    else:
        sys.stderr.write( 'Please provide a text file for evaluation.\n')
        sys.exit()

if __name__ == '__main__':
    main(sys.argv[1:])