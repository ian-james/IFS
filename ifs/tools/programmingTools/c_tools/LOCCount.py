#!/usr/bin/env python
#
# This script handles all the various subtools requested by the user in IFS, combines the output and reports them as JSON.
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



def remove_values_from_list(the_list, val):
   return [value for value in the_list if value != val]


   
def readLOC(dir):
	LOCCountList = []
	commentCountList = []
	LOCCount = 0
	commentCount = 0
	commentState = False
	projectFiles = glob(dir+'/*.c') + glob(dir+'/*.h')
	for file in projectFiles:
		fp	= open(file, "r")
		#Remove newlines and related characters
		lines = [line.strip() for line in fp]
		lines = remove_values_from_list(lines, '')
		#if (lines == ''):
			#print "EMPTY LINE IS INCLUDED"
		print "File:", file,": lines size =",len(lines)
		#print lines
		
		#for lineSmall in lines:
			#if lineSmall == (''):
				#print "hey empty line here"
		for line in lines:
			if commentState == False and '/*' not in line:
				if '//' not in line:
					LOCCount = LOCCount + 1
				elif '//' in line and line.find('//') > 1:
					LOCCount = LOCCount + 1
					commentCount = commentCount + 1
				else:
					commentCount = commentCount + 1
			elif commentState == False and '/*' in line:
				if line.find('/*') > 1:
					LOCCount = LOCCount + 1
				commentCount = commentCount + 1
				commentState = True
			else:
				commentCount = commentCount + 1
			if commentState == True and '*/' in line:
				commentState = False;
		LOCCountList.append(LOCCount)
		commentCountList.append(commentCount)
		commentCount = 0
		LOCCount = 0
	return LOCCountList, commentCountList

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
		LOCCountList, commentCountList = readLOC(idirectory)
		#print LOCCountList
		#print commentCountList
		LOCCountTotal = sum(LOCCountList)
		commentCountTotal = sum(commentCountList)
		print "Total LOC:", LOCCountTotal + commentCountTotal
		print "Total SLOC:", LOCCountTotal
		print "Total Comment Count:", commentCountTotal
		print "Average LOC per Module:",  (LOCCountTotal + commentCountTotal) / float(len(LOCCountList))
		print "Average SLOC per Module:",  LOCCountTotal / float(len(LOCCountList))
		print "Average comment count per Module:",  commentCountTotal / float(len(commentCountList))
		#Output final result to terminal. This is how IFS gains the feedback from includecheck.py
		#print json_string


if __name__ == '__main__':
	main(sys.argv[1:])