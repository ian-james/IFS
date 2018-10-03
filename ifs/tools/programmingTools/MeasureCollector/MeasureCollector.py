import sys, getopt, os
import io, json
import re
import string
from subprocess import call
from subprocess import Popen, PIPE
import shlex
import glob
from glob import glob
from LOCCount import CountLOC
from includeunique import calcUnique
from keywordcount import getKeywordCount
from functionscount import countFunctions
from operatorsOperands import getOperators

#Handles all the measure gatherer functions and can save values to a list for CSV processing by manager.py
#INPUT: Folder address of the folder to parse for the list of specific measures to calculate. Optional variables: csv determines whether or not the output prints or gathers results for csv formatting, csvList is the list of all data for the current file up until this point
#OUTPUT: Returns a blank list if CSV is set to false, or a populated list of measures in the directory if csv=true

def measureManager(idirectory, csv=False, csvList=[]):
	projectFiles = [os.path.join(dirpath, f)
		for dirpath, dirnames, files in os.walk(idirectory)
		for f in files if (f.endswith('.c')) or (f.endswith('.h'))]

	SLOCTotalCount, csvList = CountLOC(projectFiles, csv, csvList)
	csvList = calcUnique(projectFiles, csv, csvList)
	csvList = getKeywordCount(projectFiles, csv, csvList)
	if len(projectFiles) == 0:
		csvList.append(0)
		csvList.append(0)
		csvList.append(0)
		csvList.append(0)
		csvList.append(0)
		return csvList
	functionsCount, csvList = countFunctions(projectFiles, csv, csvList)
	if (csv == False):
		if (functionsCount != 0):
			print "Average function length = ", (SLOCTotalCount / float(functionsCount))
		else:
			print "Average function length is unknown, functions not found."
	if (csv==True):
		if (functionsCount != 0):
			csvList.append(round(SLOCTotalCount / float(functionsCount),2))
		else:
			csvList.append("Error: No functions found")
	csvList = getOperators(projectFiles, csv, csvList)
	return csvList

def main(argv):
	
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
	measureManager(idirectory)

if __name__ == '__main__':
	main(sys.argv[1:])