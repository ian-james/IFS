#!/usr/bin/python

import sys, getopt, os
import io, json
from pprint import pprint
import re
import string
import glob
import csv

from compliance import complianceManager
from MeasureCollector import measureManager
from compiletest import compileManager
#from jsonDecorator import decorate

def writeToFile(stringToWrite, fileLocation):
	fileLocation = fileLocation+"/feedback_Compliance_unzipped"
	f = open(fileLocation, "w")
	f.write("%s" % stringToWrite)
	f.close()

def main(argv):
	i=0
	j=1
	anon=False
	runHarness=False
	showErrors=False
	broadcastFolder=False
	csvFileAddress = "output.csv"
	csvList = []
	idirectory = 'studentfolders'
	chosenSubmission="A1"
	complianceFilePath = "./tools/programmingTools/MeasureCollector/complianceF18A1.json"
	outputString = ""
	#Make sure a file directory is provided
	#if (len(argv) <= 1):
		#print "Please provide a directory to search for C files."
		#sys.exit()
	#else:
		#Get command line arguments and put them into list
	options = { 'tool':'', 'directory':'', 'ifsOff':'',
				'csv':'', 'output':'','runharness':'','showerrors':'','help':''
				}

	# define command line arguments and check if the script call is valid
	opts, args = getopt.getopt(argv,'t:d:i:co:vbh',
		['tool=','directory=', 'jsonInput=', 'ifsOff=', 'csv','output=','verbose','broadcast','help'])
	
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
		elif opt in ('--jsonInput', '-j'):
			options['jsonInput'] = arg
		elif opt in ('--ifsOff', '-i'):
			options['ifs'] = False
		elif opt in ('--csv', '-c'):
			options['csv'] = True
		elif opt in ('--output', '-o'):
			#print arg
			csvFileAddress = arg
		elif opt in ('--verbose', '-v'):
			#print arg
			showErrors = True
			runHarness = True
		elif opt in ('--broadcast', '-b'):
			broadcastFolder = True


	if idirectory != '':
		options['dir'] = idirectory
	#print options['csv']
	
	
	if options['csv'] != True:
		csvListMeasure = []
		csvListCompliance = []
		csvListCompilation = []
		csvList = []
		#folder = idirectory
		#print folder
		zipfolder = idirectory.replace("unzipped", "tempUnzipped")
		if (os.path.exists(zipfolder)):
			folder = zipfolder
		elif (os.path.exists(idirectory)):
			folder = idirectory
		else:
			print "WARNING: NO FILE FOUND"
		#print folder
		#print "---------------------------------------------------------------"
		#print "User", folderNoRoot
		print "{ \"feedback\": ["
		outputString += "{ \"feedback\": ["
		csvListMeasure = measureManager(folder, True, csvListMeasure)
		#csvListCompliance = complianceManager(folder, True, csvListCompliance)
		
		csvListCompilation, outputString = compileManager(folder, runHarness, showErrors, chosenSubmission, complianceFilePath, outputString, True, csvListCompilation)
		csvList = ["User"]+csvListMeasure + csvListCompliance + csvListCompilation
		#print csvList
		
		#decorate("Compliance", "warning", "Warning, potential mark deduction", "Testing.c", 20, 5, "Testing!!!")
		
		print "]\n}"
		outputString += "]\n}"
		fileLocation = idirectory.rsplit('/', 1)[0]
		fileLocation = fileLocation + "/IFS-SPECIFIC-MEASURE-FILE.txt"
		f = open(fileLocation, "w")
		first = True
		for entry in csvList:
			if first == True:
				f.write("%s" % entry)
				first = False
			else:
				f.write(", %s" % entry)
		f.close()
		#print fileLocation
		#print outputString
		writeToFile(outputString, idirectory.rsplit('/', 1)[0])
		#print csvList
	else:
		with open(csvFileAddress,'wb') as csvFile:
			filewriter = csv.writer(csvFile, delimiter=',', quotechar='|', quoting=csv.QUOTE_MINIMAL)
			filewriter.writerow(['User',
			'Total-LOC',
			'Total-SLOC',
			'Total-Comment-Count',
			'Average-LOC-per-Module',
			'Average-SLOC-per-Module',
			'Average-comment-count-per-Module',
			'Total-number-of-includes',
			'Number-of-unique-includes',
			'Total-number-of-type-keywords',
			'Average-number-of-type-keywords-per-module',
			'Total-number-of-flow-keywords',
			'Average-number-of-flow-keywords-per-module',
			'Total-number-of-non-loop-conditional-keywords',
			'Average-number-of-non-loop-conditional-keywords-per-Module',
			'Total-number-of-functions-in-directory',
			'Average-number-of-functions-per-module',
			'Average-function-length',
			'Total-number-of-operators-across-all-files',
			'Number-of-unique-operators-across-all-files',
			'Missing-Expected-Folders',
			'Extra-Non-Specification-Folders',
			'Missing-Expected-Files',
			'Extra-Non-Specification-Files',
			'Missing-Expected-Functions',
			#'Expected-Readme-Headings-Missing',
			'Total-number-of-improper/hardcoded-include-paths',
			'Number-Of-Missing-Output-Files',
			'Compilation-Success'])
			
			print "---------- BEGINNING CSV FILE WRITING ----------"

			for folder in studentFolders:
				trash, othertrash, thirdtrash, folderNoRoot = folder.split("/")
				if broadcastFolder == True:
					print "PARSING", folderNoRoot
					print "Folder #",j
					j=j+1
				i=i+1
				csvListMeasure = []
				csvListCompliance = []
				csvListCompilation = []
				csvList = []
				#print "---------------------------------------------------------------"
				#print "User", folderNoRoot
				csvListMeasure = measureManager(folder, True, csvListMeasure)
				#csvListCompliance = complianceManager(folder, True, csvListCompliance)
				csvListCompilation = compileManager(folder, runHarness, showErrors, chosenSubmission, complianceFilePath, True, csvListCompilation)
				userName = folderNoRoot
				csvList = [userName]+csvListMeasure + csvListCompliance + csvListCompilation
				#print ''
				#print csvList
				filewriter.writerow(csvList)
	
	
	
if __name__ == '__main__':
	#print sys.argv
	main(sys.argv[1:])
