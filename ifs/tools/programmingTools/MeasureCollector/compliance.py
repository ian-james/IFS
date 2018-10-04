#!/usr/bin/env python
#
# This script parses c and h files for compliance with the CIS*2750 assignment outline when paired with a corresponding JSON string.
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
from pprint import pprint
import re
import string
from subprocess import call
from subprocess import Popen, PIPE
import shlex
import glob
from cStringIO import StringIO
import subprocess
import shutil
from includecheck import improperCount
from functionscount import getCtagsInfo
from time import sleep
#from jsonDecorator import decorate

def decorate(tool, severity, severityComment, fileName, lineNum, charPos, feedback, firstPrint=False):
	#print firstPrint
	json_string = ""
	if firstPrint != True:
		json_string += ","
		print ","
	json_string += '{"severity": "'
	json_string += severityComment
	json_string += '", "filename": "'
	json_string += fileName
	json_string += '", "lineNum": "'
	json_string += str(lineNum)
	json_string += '", "toolName": "'
	json_string += tool
	json_string += '", "charPos": "'
	json_string += str(charPos)
	json_string += '", "type": "'
	json_string += severity
	json_string += '", "feedback": "'
	json_string += feedback
	json_string += '"}'
	print json_string
	return json_string
	#print "TESTING"

def getReferenceFunctions():
	return ["VCardParser.c",[
"VCardErrorCode createCard(char* fileName, Card** obj)",
"char* printCard(const Card* obj)",
"void deleteCard(Card* obj)",
"char* printError(VCardErrorCode err)",

"void deleteProperty(void* toBeDeleted)",
"int compareProperties(const void* first, const void* second)",
"char* printProperty(void* toBePrinted)",

"void deleteParameter(void* toBeDeleted)",
"int compareParameters(const void* first, const void* second)",
"char* printParameter(void* toBePrinted)",

"void deleteValue(void* toBeDeleted)",
"int compareValues(const void* first, const void* second)",
"char* printValue(void* toBePrinted)",

"void deleteDate(void* toBeDeleted)",
"int compareDates(const void* first, const void* second)",
"char* printDate(void* toBePrinted)"]]

def getRegexes():
	return ["VCardParser.c",["VCardErrorCode *createCard *\( *char *\* *[A-Za-z]* *, *Card *\*\* *[A-Za-z]* *\)",

"char *\* *printCard *\( *const *Card *\* *[A-Za-z]* *\)",

"void *deleteCard *\( *Card *\* *[A-Za-z]* *\)",

"char *\* *printError *\( *VCardErrorCode *[A-Za-z]* *\)",

"void *deleteProperty *\( *void *\* *t[A-Za-z]* *\)",
"int *compareProperties *\( *const *void *\* *[A-Za-z]* *\, *const *void *\* *[A-Za-z]* *\)",
"char *\* *printProperty *\( *void *\* *[A-Za-z]* *\)",

"void *deleteParameter *\( *void *\* *[A-Za-z]* *\)",
"int *compareParameters *\( *const *void *\* *[A-Za-z]* *\, *const *void *\* *[A-Za-z]* *\)",
"char *\* *printParameter *\( *void *\* *[A-Za-z]* *\)",

"void *deleteValue *\( *void *\* *[A-Za-z]* *\)",
"int *compareValues *\( *const *void *\* *[A-Za-z]* *\, *const *void *\* *[A-Za-z]* *\)",
"char *\* *printValue *\( *void *\* *[A-Za-z]* *\) *",

"void *deleteDate *\( *void *\* *[A-Za-z]* *\)",
"int *compareDates *\( *const *void *\* *[A-Za-z]* *\, *const *void *\* *[A-Za-z]* *\)",
"char *\* *printDate *\( *void *\* *[A-Za-z]* *\)"]]
	

#Parse the JSON string for information and translate that into a list which can be interpreted by other functions
#INPUT: The directory passed as a command line argument where student folders exist, the JSON file which was written for the assignment
#OUTPUT: Four lists which contain all of the expected folder, files, functions and readme headings
def getExpectedStructure(idirectory, jsonString, assignment):
	expectedFolderNames = []
	expectedFileNames = []
	expectedFunctionDeclarations = []
	expectedReadmeStructure = []
	expectedOutputFiles = []
	newExpectedFolderNames = []
	newExpectedFileNames = []
	
	
	#Test file of prewritten JSON to match files
	with open(jsonString) as f:
		data = json.load(f)
	expectedFolderNames = data["compliance"]["folderNames"]
	#for efn in expectedFolderNames:
		#newExpectedFolderNames.append(idirectory+"/"+efn)
	newExpectedFolderNames = [str(x) for x in expectedFolderNames]
	#print "From JSON string:",newExpectedFolderNames
	[x.encode('ascii') for x in newExpectedFolderNames]
	expectedFileNames = data["compliance"]["fileNames"]
	#for efn in expectedFileNames:
		#newExpectedFileNames.append(idirectory+"/"+efn)
	newExpectedFileNames = [str(x) for x in expectedFileNames]
	[x.encode('ascii') for x in newExpectedFileNames]
	expectedReadmeStructure = data["compliance"]["readmeCategories"]
	[x.encode('ascii') for x in expectedReadmeStructure]
	expectedOutputFiles = data["compliance"]["outputFiles"]
	[x.encode('ascii') for x in expectedOutputFiles]
	if (assignment == "A1" or assignment == "A1R"):
		expectedFunctionDeclarations = getRegexes()
	elif (assignment == "A2" or assignment == "A2R"):
		expectedFunctionDeclarations = getRegexesA2()
	else:
		print "ERROR: ASSIGNMENT UNKNOWN"
		exit()
	#print len(expectedFunctionDeclarations)
	#print newExpectedFolderNames
	#print newExpectedFileNames
	return newExpectedFileNames, newExpectedFolderNames, expectedFunctionDeclarations, expectedReadmeStructure, expectedOutputFiles

def compareOutputFiles(expectedOutputFiles, actualOutputFiles, firstPrint, outputString, csv=False, csvList=[]):
	found = False
	missingCount = 0
	#print expectedOutputFiles
	#print actualOutputFiles
	for expected in expectedOutputFiles:
		#print "EXPECTED = ", expected
		for actual in actualOutputFiles:
			#print "ACTUAL = ", actual
			if (expected.lower() in actual.lower()):
				#print "TRUE!"
				found = True
		if (found == False):
			fileMessage = ""
			fileMessage += "Missing output file "
                        
			fileMessage += expected
			fileMessage += " from submission. File was not generated after attempting make."
			#print folderMessage
			#res = decorate("Compliance", "error", "Error: Missing File", expected, "NULL", "NULL", fileMessage, firstPrint)
			print outputString
			outputString += decorate("Compliance", "error", "Error: Missing File", expected, 0, 0, fileMessage, firstPrint)
			firstPrint = False
			if (csv == False):
				print "ERROR: Missing output file:", expected
			missingCount = missingCount +1
		found = False
	if (csv == False):
		print "Missing a total of",missingCount,"expected output files"

	if (csv==True):
		csvList.append(missingCount)
		return csvList, firstPrint, outputString
	return [], firstPrint, outputString
	
#Scrape a directory for all folders, files and functions in the given directory
#INPUT: File path to a directory to parse
#OUTPUT: 3 lists containing the folders, files and function declarations in the directory
def getActualStructure(path):
	#print path
	i=0
	actualFolders = []
	actualFiles = []
	actualFunctions = []
	for newPath, dirs, files in os.walk(path):
		#print "DIRS =",dirs
		#print "NEWPATH=", newPath
		#print "PATH=", path
		if (newPath != path):
			#print "path =",path
			#print "newPath =",newPath
			if "/." not in newPath:
				actualFolders.append(newPath)
			#else:
				#print "NOT IN"
		for f in files:
			#print "newpath =",newPath
			if f != '':
				if "/." not in newPath:
					actualFiles.append(newPath+"/"+f)
	#print actualFiles
	projectFiles = [os.path.join(dirpath, f)
		for dirpath, dirnames, files in os.walk(path)
		for f in files if (f.endswith('.c')) or (f.endswith('.h'))]
	actualFunctions = getCtagsInfo(projectFiles)
	#print "ACTUAL FOLDERS=",actualFolders[1:]
	#print "ACTUAL FILES=",actualFolders[1:]
	return actualFolders, actualFiles, actualFunctions

#Read a README file for specific headers as defined by the JSON compliance file
#INPUT: The file address of the readme and a list of the expected categories for the readme. Optional variables: csv determines whether or not the output prints or gathers results for csv formatting, csvList is the list of all data for the current file up until this point.
#OUTPUT: Returns a blank list if CSV is set to false, or a populated list of number of missing headers and unexpected folders in the directory if csv=true

def checkReadme(readme, readmeCategories, csv=False, csvList=[]):
	categoryCount = len(readmeCategories)
	categoryFound = 0
	try:
		file_object = open(readme, "r")
	except IOError:
		if (csv == True):
			csvList.append(categoryCount)
			return csvList
		else:
			print "Cannot open README file, check that it exists and is named as per the specification"
			return []
	str_list = filter(None, file_object.read().splitlines())
	#print str_list
	for entry in str_list:
		if categoryFound >= categoryCount:
			if (csv == False):
				print "All Readme Headings found"
			if (csv==True):
				csvList.append(0)
				return csvList
			return []
		for category in readmeCategories:
			if category in entry:
				categoryFound = categoryFound + 1
				break
	if (csv == False):
		print "Missing",categoryCount - categoryFound,"Readme Headings, check assignment outline"
	if (csv==True):
		csvList.append(categoryCount - categoryFound)
		return csvList
	return []

#Compares expected file structure to actual file structure in a given directory
#INPUT: A list of expected file names populated from the JSON string passed to this file, a list of actual file names created by scraping the directory being parsed. Optional variables: csv determines whether or not the output prints or gathers results for csv formatting, csvList is the list of all data for the current file up until this point
#OUTPUT: Returns a blank list if CSV is set to false, or a populated list of number of missing files and unexpected files in the directory if csv=true
def compareFiles(expectedFileNames, actualFileNames, firstPrint, outputString, csv=False, csvList=[]):
	found = False
	missingCount = 0
	for expected in expectedFileNames:
		#print expected
		for actual in actualFileNames:
			#print actual
			searchLen = len(actual) - len(expected)
			#print "Expected =", expected
			#print "Actual =", actual[searchLen:]
			if (expected.lower() == actual[searchLen:].lower() or "readme" in expected.lower() or "makefile" in expected.lower()):
				found = True
				#print "FOUND!!!!"
		if (found == False):
			#if (csv == False):
			#if (csv == False):
                        fileMessage = ""
			fileMessage += "Missing file "
			fileMessage += expected
			fileMessage += " from submission. Mandatory for compilation."
			#print folderMessage
			#res = decorate("Compliance", "error", "Error: Missing File", expected, "NULL", "NULL", fileMessage, firstPrint)
			print outputString
			outputString += decorate("Compliance", "error", "Error: Missing File", expected, 0, 0, fileMessage, firstPrint)
			firstPrint = False
			missingCount = missingCount +1
		found = False
	if (csv == False):
		print "Missing a total of",missingCount,"Files"
	#print missingCount
	found = False
	extraCount = 0
	for actual in actualFileNames:
		for expected in expectedFileNames:
			searchLen = len(actual) - len(expected)
			if (expected.lower() == actual[searchLen:].lower() or ".DS_Store" in actual or "readme" in actual.lower() or "makefile" in actual.lower() or ".zip" in actual.lower()):
				found = True
		if (found == False):
			#if (csv == False):
			#print "WARNING: Extra non-specification outlined file:", actual
			fileMessage = ""
			fileMessage += "Additional non-spec file "
			fileErr = actual.rsplit('/', 1)[1]
			fileMessage += fileErr
			fileMessage += " exists in submission directory. Check to make sure it and its contents are necessary."
			#print folderMessage
			outputString += decorate("Compliance", "warning", "Warning, potential mark deduction", fileErr, 0, 0, fileMessage, firstPrint)
			firstPrint = False
			extraCount = extraCount +1
		found = False
	if (csv == False):
		print "Directory contains a total of",extraCount,"non-specification outlined files"
	if (csv==True):
		csvList.append(missingCount)
		csvList.append(extraCount)
		return csvList, firstPrint, outputString
	return [], firstPrint, outputString


#Compares expected folder structure to actual folder structure in a given directory
#INPUT: A list of expected folder names populated from the JSON string passed to this file, a list of actual folder names created by scraping the directory being parsed. Optional variables: csv determines whether or not the output prints or gathers results for csv formatting, csvList is the list of all data for the current file up until this point
#OUTPUT: Returns a blank list if CSV is set to false, or a populated list of number of missing folders and unexpected folders in the directory if csv=true
def compareFolders(expectedFolderNames, actualFolderNames, firstPrint, outputString, csv=False, csvList=[]):
	
	#NOTE: FIX THE OUTPUT TO TRACK ACCURATE EXTRA FOLDERS NAMED THE SAME AS THE EXPECTED FOLDERS
	
	#print "Expected Folders:", expectedFolderNames
	#print "Actual Folders:", actualFolderNames
	maxFoundFolderCount = len(expectedFolderNames)
	totalFoundFolderCount = 0
	found = False
	missingCount = 0
	for expected in expectedFolderNames:
		for actual in actualFolderNames:
			searchLen = len(actual) - len(expected)
			if (expected.lower() == actual[searchLen:].lower()):
				found = True
				totalFoundFolderCount = totalFoundFolderCount + 1
		if (found == False):
			#if (csv == False):
			folderMessage = ""
			folderMessage += "Missing folder "
			folderMessage += expected
			folderMessage += " from submission directory. Mandatory for compilation."
			#print folderMessage
			outputString += decorate("Compliance", "error", "Error: Missing Folder", expected, 0, 0, folderMessage, firstPrint)
			firstPrint = False
			missingCount = missingCount +1
		found = False
	if (csv == False):
		print "Missing a total of",missingCount,"folders"
	
	found = False
	extraCount = 0
	for actual in actualFolderNames:
		#print actual
		for expected in expectedFolderNames:
			searchLen = len(actual) - len(expected)
			if (expected.lower() == actual[searchLen:].lower()):
				found = True
		if (found == False):
			#if (csv == False):
			folderMessage = ""
			folderMessage += "Additional non-spec folder "
			folderMessage += actual.rsplit('/', 1)[1]
			folderMessage += " exists in submission directory. Check to make sure it and its contents are necessary."
			#print folderMessage
			outputString += decorate("Compliance", "warning", "Warning, potential mark deduction", actual.rsplit('/',1)[1], 0, 0, folderMessage, firstPrint)
			firstPrint = False
			#print "WARNING: Extra non-specification outlined folder:", actual
			extraCount = extraCount +1
		found = False
	found = True
	for actual in actualFolderNames:
		for sub in actualFolderNames:
			if actual not in sub:
				found = False
		if found == True:
			extraCount = extraCount - 1
		found = True
	if totalFoundFolderCount > maxFoundFolderCount:
		extraCount = extraCount + (totalFoundFolderCount - maxFoundFolderCount)
	if (csv == False):
		print "Directory contains a total of",extraCount,"non-specification outlined folders"
	if (csv==True):
		csvList.append(missingCount)
		csvList.append(extraCount)
		#print extraCount
		#print totalFoundFolderCount
		return csvList, firstPrint, outputString
	return [], firstPrint, outputString

def compareFunctions(expectedFunctionRegexes, actualFunctionNames, assignment, firstPrint, outputString, csv=False, csvList=[]):
	tempList = []
	i = 0
	found = False
	missingCount = 0
	if (assignment == "A1" or assignment == "A1R"):
		refList = getReferenceFunctions()
	elif (assignment == "A2" or assignment == "A2R"):
		refList = getReferenceFunctionsA2()
	else:
		print "ERROR: UNKNOWN ASSIGNMENT"
		exit()
	refFunctions=refList[1]
	#print len(expectedFunctionNames)
	for functions in expectedFunctionRegexes[1]:
		#print i
		#print "EXPECTED =",functions
		
		for actual in actualFunctionNames:
			#print "ACTUAL =",actual
			if (re.search(functions, actual) != None):
				found = True
				#print "MATCH FOUND"
				break
		if (found == False):
			#print "EXPECTED =",functions, "NOT FOUND"
			#if (csv == False):
			functionMessage = ""
			functionMessage += "Missing function "
			functionMessage += refFunctions[i]
			functionMessage += " from file "
			functionMessage += refList[0]
			functionMessage += ". Ensure the function is named correctly and implemented in the correct file."
			#print folderMessage
			outputString += decorate("Compliance", "error", "Error, missing function", refList[0], 0, 0, functionMessage, firstPrint)
			firstPrint = False
				#print "ERROR: Missing or improperly defined function:", refList[0],":", refList[1][i]
			missingCount = missingCount+1
		found = False
		i=i+1
	if (csv == False):
		print "Missing a total of",missingCount,"Functions"

	if (csv==True):
		#print missingCount
		csvList.append(missingCount)
		return csvList, firstPrint, outputString
	return [], firstPrint, outputString

def runMakefile(folder):
		result = ""
		#print folder
		makefiles = glob.glob(folder+"/**/Makefile") + glob.glob(folder+"/**/makefile") + glob.glob(folder+"/Makefile") + glob.glob(folder+"/makefile")
		for filename in makefiles:
			result = filename.rsplit('/', 1)[0]
			#print "result =", result
			#print "----------------------------------------"
		#print result
		result = subprocess.Popen(['make', '-C', result], stdout=subprocess.PIPE, stderr=subprocess.PIPE)




def insertHFiles(studentFolder, hFileLocation):
	#print destination
	#print studentFolder
	excludedStudentFiles = []
	foundFlag = False
	# Get all .c and .h files in the folder
	hFiles = glob.glob(hFileLocation+'/LinkedListAPI.h') + glob.glob(hFileLocation+'/VCardParser.h')
	#Look for all excluded files, if any
	#Remove exlucded files from student file list
	if len(hFiles) == 0:
		return -1
	for copyFile in hFiles:
		#print copyFile, destination
		shutil.copy(copyFile, studentFolder)
	return 1

#Handles all the compliance measures being calculated.
#Input: A folder with student submission inside. Optional variables: csv determines whether or not the output prints or gathers results for csv formatting, csvList is the list of all data for the current file up until this point
#OUTPUT: Returns a blank list if CSV is set to false, or a populated list of number of measures calculated by this file if csv=true

def complianceManager(idirectory, assignment, complianceFilePath, outputString, binDirectory, includeDirectory, csv=False, csvList=[]):
	#print "---------------------------------------------------------"
	firstPrint = True
	actualFolderNames = []
	actualFileNames = []
	actualFunctionNames = []
	expectedFolderNames = []
	expectedFileNames = []
	expectedFunctionDeclarations = []
	expectedReadmeCategories = []
	expectedOutputFiles = []
	
	expectedFileNames, expectedFolderNames, expectedFunctionDeclarations, expectedReadmeCategories, expectedOutputFiles = getExpectedStructure(idirectory, complianceFilePath, assignment)

	#actualFunctionNames = getCtagsInfo(idirectory)

	actualFolderNames, actualFileNames, actualFunctionDeclarations = getActualStructure(idirectory)
	
	
	
	
		#print actualOutputFiles
		#print "EXPECTED FUNCTIONS"
	#print expectedFunctionDeclarations
	
	#print "ACTUAL FUNCTIONS"
	#print actualFunctionDeclarations
	
	for entry in expectedFileNames:
		entry = entry.encode("utf-8")
	
	#print expectedFolderNames
	#print actualFolderNames
	#print expectedFileNames
	#print actualFileNames
	
	csvList, firstPrint, outputString = compareFolders(expectedFolderNames,actualFolderNames, firstPrint, outputString, csv, csvList)
	csvList, firstPrint, outputString = compareFiles(expectedFileNames,actualFileNames, firstPrint, outputString, csv, csvList)
	csvList, firstPrint, outputString = compareFunctions(expectedFunctionDeclarations,actualFunctionDeclarations, assignment, firstPrint,  outputString, csv, csvList)
	
	#print csvList
	#csvList = checkReadme(idirectory+"/assign1/README", expectedReadmeCategories, csv, csvList)
	csvList, firstPrint, outputString = improperCount(idirectory, outputString, firstPrint, csv, csvList)
	#print "ACTUAL OUTPUT FILES"
	#print actualOutputFiles
	
	#print "includeDirectory = ", includeDirectory
	
	insertHFiles(includeDirectory, "./tools/programmingTools/MeasureCollector/compiletestF18A1/include")
	
	runMakefile(idirectory)
	sleep(2)
	actualOutputFiles = glob.glob(binDirectory+'/*')
	#print "birDir = ", binDirectory+'/*'
	#print "actual outputFiles = ", actualOutputFiles
        
	csvList, firstPrint, outputString = compareOutputFiles(expectedOutputFiles, actualOutputFiles,firstPrint, outputString, csv, csvList)
	#print expectedFunctionDeclarations
	#print actualFunctionDeclarations
	
	return csvList, outputString
	#getFunctionHeaders("./assign1/src/hash.c")

def main(argv):

	
	
	
	idirectory = ''
	#Make sure a file directory is provided
	if (len(argv) <= 1):
		print "Please provide a directory to search for C files."
		sys.exit()
	else:
		#Get command line arguments and put them into list
		options = { 'tool':'', 'includecheck':'', 'jsonInput':'', 'ifsOff':'',
					'dir':''
					}

		# define command line arguments and check if the script call is valid
		opts, args = getopt.getopt(argv,'t:d:j:i:h',
			['tool=','directory=', 'jsonInput=', 'ifsOff=', 'help'])
		
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


		if idirectory != '':
			options['dir'] = idirectory
		
	complianceManager(idirectory)


		
if __name__ == '__main__':
	main(sys.argv[1:])

