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

def printSLOC(SLOClist, dir):
	i=0
	for file in dir:
		print "File", file, "number of SLOC =", SLOClist[i]
		i=i+1

def remove_values_from_list(the_list, val):
   return [value for value in the_list if value != val]

def CountLOC(dir, csv=False, csvList=[]):
	SLOCCountList, commentCountList, comboCountList = readLOC(dir)
	#print LOCCountList
	#print commentCountList
	SLOCCountTotal = sum(SLOCCountList)
	commentCountTotal = sum(commentCountList)
	comboCountTotal = sum(comboCountList)
	#printSLOC(SLOCCountList, dir)
	if (csv == False):
		print "Total LOC:", SLOCCountTotal + commentCountTotal - comboCountTotal
		print "Total SLOC:", SLOCCountTotal
		print "Total Comment Count:", commentCountTotal
		if (len(SLOCCountList) == 0):
			print "Average LOC per Module: 0"
		else:
			print "Average LOC per Module:",  (SLOCCountTotal + commentCountTotal - comboCountTotal) / float(len(SLOCCountList))
		if (len(SLOCCountList) == 0):
					print "Average SLOC per Module: 0"
		else:
			print "Average SLOC per Module:",  SLOCCountTotal / float(len(SLOCCountList))
		if (len(commentCountList) == 0):
			print "Average comment count per Module: 0"
		else:
			print "Average comment count per Module:",	commentCountTotal / float(len(commentCountList))
	
	
	if csv==True:
		csvList.append(SLOCCountTotal + commentCountTotal - comboCountTotal)
		csvList.append(SLOCCountTotal)
		csvList.append(commentCountTotal)
		if (len(SLOCCountList) == 0):
			csvList.append(0)
		else:
			csvList.append(round((SLOCCountTotal + commentCountTotal) / float(len(SLOCCountList)),2))
		if (len(SLOCCountList) == 0):
			csvList.append(0)
		else:
			csvList.append(round(SLOCCountTotal / float(len(SLOCCountList)),2))
		if (len(commentCountList) == 0):
			csvList.append(0)
		else:
			csvList.append(round(commentCountTotal / float(len(commentCountList)),2))
		return SLOCCountTotal, csvList
	return SLOCCountTotal, []

def readLOC(projectFiles):
	LOCCountList = []
	commentCountList = []
	comboCountList = []
	LOCCount = 0
	commentCount = 0
	comboCount = 0
	commentState = False
	#projectFiles = glob(dir+'/*.c') + glob(dir+'/*.h')
	for file in projectFiles:
		fp	= open(file, "r")
		#Remove newlines and related characters
		lines = [line.strip() for line in fp]
		lines = remove_values_from_list(lines, '')
		#if (lines == ''):
			#print "EMPTY LINE IS INCLUDED"
		#print "File:", file,": number of LOC (including comments) =",len(lines)
		#print lines
		
		#for lineSmall in lines:
			#if lineSmall == (''):
				#print "hey empty line here"
				
		#Parse every line of code one at a time for comments and SLOC
		for line in lines:
			
			#If not a already in a comment block and if not starting a comment block
			if commentState == False and '/*' not in line:
				#If you do not find a single line comment on this line
				if '//' not in line:
					LOCCount = LOCCount + 1
				#If you fnd both SLOC and comments in a single line
				elif '//' in line and line.find('//') > 1:
					LOCCount = LOCCount + 1
					commentCount = commentCount + 1
					comboCount = comboCount + 1
				#If already in a comment block 
				else:
					commentCount = commentCount + 1
			#If not already in a comment block and starting a comment block
			elif commentState == False and '/*' in line:
				#If starting a comment block in a line featuring SLOC
				if line.find('/*') > 1:
					LOCCount = LOCCount + 1
					comboCount = comboCount + 1
				commentCount = commentCount + 1
				
				commentState = True
			#If already in a comment block
			else:
				commentCount = commentCount + 1
			#If ending a comment block
			if commentState == True and '*/' in line:
				commentState = False
		LOCCountList.append(LOCCount)
		commentCountList.append(commentCount)
		comboCountList.append(comboCount)
		commentCount = 0
		LOCCount = 0
		comboCount = 0
		commentState = False
	return LOCCountList, commentCountList, comboCountList

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
		
	CountLOC(idirectory)
		#Output final result to terminal. This is how IFS gains the feedback from includecheck.py
		#print json_string


if __name__ == '__main__':
	main(sys.argv[1:])