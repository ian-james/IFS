#!/usr/bin/env python
#
# This is a script that checks python formatting with accordance to PEP8
# Copyright (c) 2018 Grant Douglas gdouglas@uoguelph.ca
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
import string
from subprocess import call
from subprocess import Popen, PIPE
import shlex
import glob

# Include common helper files.
# Note: IFS runs this files from the main IFS/ifs folder.
helperFunctionPath = "./tools/commonTools/"
sys.path.append( os.path.abspath(helperFunctionPath) )
from helperFunctions import *


#Display data in JSON format for the IFS
def decorateData( result, options ):
	json_string = '{\n'
	json_string += '"feedback": [\n'
	for i in range(len(result)):
		json_string += json.dumps(result[i])
		if i != (len(result) - 1):
			json_string +=','
		json_string += '\n'

	json_string += ']\n'
	json_string += '}\n'
	return json_string


# Parsing the output of a couple simple formats
# Each format has a specific character split sequence such as '##' or ':'
# Types specify how to tag the incoming sections
def parse( text, options ):
	results = []
	types = options['splitTypes']

	for line in text.splitlines():

		feedback = {}
		feedback['toolName'] = options['tool']
		sections = line.split("|")

		# parse the sections into appropriate feedback keys
		feedback['filename'] = os.path.basename(sections[0])
		feedback['lineNum'] = sections[1]
		feedback['charPos'] = sections[2]
		feedback['feedback'] = sections[3]
		feedback['type'] = 'formatting'

		# append feedback
		results.append(feedback)

	return results




def createCmd(options):
	srcDir = os.path.normpath( os.path.join( options['dir'], options['srcDir']) )

	if not os.path.isdir(srcDir):
		srcDir = os.path.normpath( os.path.join(options['dir'], "*") )
	else:
		srcDir = os.path.join(srcDir,"*")

	cmdStr = ""

	# create the pycodestyle tool command
	if options['tool'] == 'pycodestyle':
		cmdStr = " ".join( [ options['tool'],
				" ".join(options['flags']),
				" " + options['format'] + " " + srcDir
			])
	else:
		return ""



	return cmdStr


def main(argv):
	currDirectory = ''

	options = { 'tool': 'pycodestyle',
				'ifs': True,
				'language':'python',
				'errorLevel':'all',
				'flags': [],
				'std': 'Python 3',
				'dir':'',
				'splitSeq': "##",
				'splitTypes': [ "filename", "lineNum", "type", "category", "feedback"],
				'outFile':'stdout.txt',
				'outErrFile':'stderr.txt',
				'initP': "--",
				'format': "--format=\"%(path)s|%(row)d|%(col)d|%(text)s|\" --first",
				'includeDir': "./import",
				'srcDir': ""
				}

	opts, args = getopt.getopt(argv,'t:i:l:e:f:s:u:d:h', ['tool=','ifsOff=','language=', 'errorLevel=', 'flags=', 'std=', 'suppress=', 'directory=', 'help'])

	# modify options dictionary by searching through the arguments
	for opt, arg in opts:

		if opt in ('--tool', '-t'):
			options['tool'] = arg

		elif opt in ('--isOff', '-i'):
			options['ifs'] = False

		elif opt in ('--language, -l'):
			options['language'] = arg

		elif opt in ('--errorLevel', '-e'):
			options['errorLevel'] = arg

		elif opt in ('--flag', '-f'):
			if arg[0] == '-':
				options['flags'].append(arg)

		elif opt in ('--std', '-s'):
			options['std'] = arg

		elif opt in ('--dir', '-d'):

			currDirectory = arg

			if not (os.path.isdir(currDirectory)):
				sys.stderr.write( 'Error. Directory ' + currDirectory + ' does not exist.\n' )
				sys.exit()
		else:
			print( 'Usage: Parses specific GCC/CPPCheck output files types to JSON format')
			print( 'programmingParser.py [-t tool] [-i IFS MODE] [-l LANGUAGE] [-e ERROR LEVEL] [-f FLAGS] [-s STD] [-u SUPPRESS MSG] -d InputDirectory')
			sys.exit()

	# create tool command, and generate JSON output
	if currDirectory != '':
		options['dir'] = currDirectory

		cmd = createCmd(options)

		if cmd:
			try:

				if options['tool'] == 'pycodestyle':
					outFile = os.path.normpath(os.path.join(currDirectory, options['outErrFile']) )
					outErrFile = os.path.normpath(os.path.join(currDirectory, options['outErrFile']) )
				else:
					outFile = os.path.normpath(os.path.join(currDirectory, options['outFile']) )
					outErrFile = os.path.normpath(os.path.join(currDirectory, options['outErrFile']) )

				code, out, err = getProcessInfo( cmd, outFile, outErrFile )

                result = parse( err, options )


              	# Did validate that the python file works. Since tool is currently or planned to be used.
                displayResultToIFS(options, decorateData, idirectory,"/feedback_python_unzipped", result )


			except:
				print("Unable to successfully retrieve compiler information")
		else:
			print("invalid tool used")
	else:
		print("give project dir")
		sys.exit()

	return(options)

if __name__ == '__main__':
	main(sys.argv[1:])