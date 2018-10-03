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


#Checks for the form of includes being passed in. Checks for adherance based on the following conditions:
#If the include statement has <> surroundng the path, ignore.
#If the include statement has "" surrounding the path:
#If the path contains / characters, flag as containing absolute or relative paths.
#INPUT: Three lists: [file name], [#include command], [line num]. Each list contains potentially multiple elements.
#OUTPUT: A list of list containing [[file name, line number], ...] detailing the incorrectly formed #include flags
def PathValidate(fileNames, includePaths, includeLineNum):
	i=0
	j=0
	improperPaths = []
	for entries in includePaths:
		j=0
		for entry in entries:
			result = str.split(entry)
			if len(result) > 1:
				
			
				#Ensure the first and last characters of the include file have " indicating a custom include file
				if (result[1][0] == '"') and (result[1][-1:] == '"'):
					if "/" in result[1]:
						cutFileNames = fileNames[i].split("/")
						output = ""
						#Only grab the actual file name relevant to the file. Don't grab "unzipped" or anything earlier in the file name
						for folder in cutFileNames[4:]:
							output += folder
						improperPaths.append([output,includeLineNum[i][j]])

			j=j+1
		i=i+1
	
	return improperPaths

#Take the list of lists from PathFind and split them into 3 discrete lists	
#INPUT: A list of include data where the format is [file name, [#include commands], [line nums], file name, [#include commands], [line nums], ...]
#OUTPUT: Three lists: [file name], [#include command], [line num]. Each list contains potentially multiple elements in the same order that the input list contained.
def PathCollect(includes):
	fileNames = []
	includePaths = []
	includeLineNum = []
	errors = []
	#includePathOnlyFile = []
	i=0
	for entries in includes:
		#print entries
		if i==0:
			fileNames.append(entries)
			i=i+1
		elif i==1:
			includePaths.append(entries)
			i=i+1
		else:
			includeLineNum.append(entries)
			i=0
			
	#for lists in includePaths:
		#for entries in lists:
			#splitEntry = str.split(entries)
			#includeName = splitEntry[1]
	return fileNames, includePaths, includeLineNum	

#Find each instance of an #include command and save what file and line it is located on
#INPUT: A directory in the form of a string to find files in
#OUTPUT: A list of include data where the format is [file name, [#include commands], [line nums], file name, [#include commands], [line nums], ...]
def PathFind(dir):
	includeList = []
	lineList = []
	projectFiles = [os.path.join(dirpath, f)
		for dirpath, dirnames, files in os.walk(dir)
		for f in files if (f.endswith('.c')) or (f.endswith('.h'))]
	#print projectFiles
	lineNumber = 0
	for file in projectFiles:
		fp	= open(file, "r")
		#Remove newlines and related characters
		lines = [line.strip() for line in fp]
		includeKey = "#include"
		includeList.append(file)
		#Get all include commands  and save the to a list
		includeList.append([s for s in lines if includeKey.lower() in s.lower() and s[0] != '/' and s[0] != '*'])
		i=1
		#Find line number of line where #include commands are
		for line in lines:
			if includeKey.lower() in line.lower():
				lineList.append(i)
			i=i+1
		includeList.append(lineList)
		lineList = []	
	
	#print includeList
	return includeList

#Create the JSON string which IFS will read from the terminal as the output from the program call.	  
#INPUT: A list of list containing [[file name, line number], ...] detailing the incorrectly formed #include flags
#OUTPUT: A JSON string detailing the feedback in the form IFS expects.
def decorateData(result, firstPrint, manager):
	if manager == True:
		i=0
		if firstPrint == False:
			json_string = ","
		else:
			json_string = ""
		if len(result) == 0:
			return ""
		for entry in result:
			json_string += '{"severity": "Warning, Potential Mark Deduction","filename\": "'
			json_string += entry[0]
			json_string += '", "lineNum": "'
			json_string += str(entry[1])
			json_string += '", "toolName": "Compliance", "charPos": "1", "type": "warning", "feedback": "#include flag contains an absolute or relative path. Only include filenames in #include commands."}'
			i=i+1
			if (i<len(result)):
				json_string += ','
				#print "HEY"
			json_string += '\n'
		
		
		
	else:	
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
	
def improperCount(idirectory, outputString, firstPrint=False, csv=False, csvList=[]):
	manager=True;
	includeList = PathFind(idirectory)
	fileNames, includePaths, includeLineNum = PathCollect(includeList)
	improperPaths = PathValidate(fileNames, includePaths, includeLineNum)
	
	#if (csv == False):
	json_string = decorateData(improperPaths, firstPrint, manager)
	print json_string
	outputString += json_string
		#print "Total number of improper/hardcoded include paths =",len(improperPaths)
	if (csv==True):
		csvList.append(len(improperPaths))
		return csvList, firstPrint, outputString
	return [], firstPrint, outputString

#Find all instances of absolute or relative paths in #include commands in a .c or .h file
#INPUT: Command line args: -t includecheck -d <directory/to/parse> 
#OUTPUT: A JSON string containing the feedback of the file, line number and severity of the absolutely or relatively coded #include commands in the expected IFS form 
def main(argv):
	idirectory = ''
	manager = False
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
		fileNames, includePaths, includeLineNum = PathCollect(includeList)
		improperPaths = decorateData(fileNames, includePaths, includeLineNum)
		json_string = decorateData(improperPaths, firstPrint, manager)
		
		#Output final result to terminal. This is how IFS gains the feedback from includecheck.py
		print json_string

if __name__ == '__main__':
	main(sys.argv[1:])
