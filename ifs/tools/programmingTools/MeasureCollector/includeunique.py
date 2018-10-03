#!/usr/bin/env python
#
# This script parses c files to find absolutely/relatively addressed paths and reports output into JSON.
# Works for GCC -fno-diagnostics-show-caret and cppcheck (template=gcc) and
# Copyright (c) 2018 John Harmer jharmer@uoguelph.ca
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
import string
from subprocess import call
from subprocess import Popen, PIPE
import shlex
import glob
from glob import glob


def calcUnique(idirectory,csv=False, csvList=[]):
	includeTotalCount = 0
	includeList = PathFind(idirectory)
	for sublist in includeList:
		for entry in sublist:
			includeTotalCount = includeTotalCount+1
	if (csv == False):
		print "Total number of includes = ", includeTotalCount
	#print includeList
	resultant = mergeLists(includeList)
	if (csv == False):
		print "Number of unique includes =",len(resultant)
	
	if csv==True:
		csvList.append(includeTotalCount)
		csvList.append(len(resultant))
		return csvList
	return []

def mergeLists(includeList):
	newList = []
	for sublist in includeList:
		for entry in sublist:
			if (entry != ""):
				newList.append(entry)
	#print newList
	resultant = list(set(newList))
	return resultant

#Find each instance of an #include command and save what file and line it is located on
#INPUT: A directory in the form of a string to find files in
#OUTPUT: A list of include data where the format is [file name, [#include commands], [line nums], file name, [#include commands], [line nums], ...]
def PathFind(projectFiles):
	includeList = []
	lineList = []
	#projectFiles = glob(dir+'/*.c') + glob(dir+'/*.h')
	lineNumber = 0
	for file in projectFiles:
		fp	= open(file, "r")
		#Remove newlines and related characters
		lines = [line.strip() for line in fp]
		
		includeKey = "#include"
		#includeList.append(file)
		#Get all include commands  and save the to a list
		includeList.append([s for s in lines if includeKey.lower() in s.lower()])
	
	#print includeList
	return includeList

#Create the JSON string which IFS will read from the terminal as the output from the program call.	  
#INPUT: A list of list containing [[file name, line number], ...] detailing the incorrectly formed #include flags
#OUTPUT: A JSON string detailing the feedback in the form IFS expects.
def decorateData(result):
	json_string = '{\n'
	json_string += '"feedback": [\n'
	i=0
	for entry in result:
		json_string += '{"severity": "Warning, Potential Mark Deduction","filename\": "'
		json_string += entry[0]
		json_string += '", "lineNum": "'
		json_string += str(entry[1])
		json_string += '", "toolName": "includecheck", "charPos": "1", "type": "warning", "feedback": "#include flag contains an absolute or relative path. Only include filenames in #include commands."}'
		i=i+1
		if (i<len(result)):
			json_string += ','
		json_string += '\n'
	json_string += ']\n'
	json_string += '}\n'
	return json_string

#Find all instances of absolute or relative paths in #include commands in a .c or .h file
#INPUT: Command line args: -t includecheck -d <directory/to/parse> 
#OUTPUT: A JSON string containing the feedback of the file, line number and severity of the absolutely or relatively coded #include commands in the expected IFS form 
def main(argv):
	idirectory = ''
	#Make sure a file directory is provided
	if (len(argv) <= 1):
		print "Please provide a directory to search for C files."
		sys.exit()
	else:
		#Get command line arguments and put them into list
		options = { 'tool': 'includecheck',
					'dir':''
					}

		# define command line arguments and check if the script call is valid
		opts, args = getopt.getopt(argv,'t:d:h',
			['tool=','directory=', 'help'])
		
		#Set options and tool being selected
		#Currentl only grabs includecheck.py but can be expanded in the future
		for opt, arg in opts:
			if opt in ('--tool', '-t'):
				options['tool'] = arg
			elif opt in ('directory', '-d'):
				idirectory = arg
				if not (os.path.isdir(idirectory)):
					sys.stderr.write( 'Error. Directory ' + idirectory + ' does not exist.\n' )
					sys.exit()


		if idirectory != '':
			options['dir'] = idirectory
		
		#Get and format data into proper JSON format	
		includeList = PathFind(idirectory)
		print includeList
		resultant = mergeLists(includeList)
		#print resultant
		print "Number of unique includes =",len(resultant)
if __name__ == '__main__':
	main(sys.argv[1:])
