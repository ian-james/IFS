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
from distutils.dir_util import copy_tree

from compliance import complianceManager

#Searches for instances of extra folders being above the desired assignment folder and copies the files out into a new folder just below the root which can be used to compilation testing. If no such folder is found, nothing happens.
#INPUT: A directory to search along its entire depth for the expected student folders.
#OUTPUT: If such a case of extra folders above the expected folder exists, copy the found folder to a folder just below the user root called !TESTFOLDER. If no such buried folder is found, do nothing.
def FindBuriedFolders(directory):
	folderVal = ""
	dirsCount = -1
	searchedDirectory = directory
	rootDirectory = directory
	i=0
	maxFolderCount = 0
	folderCount = 0
	realPath = ""
	listOfDirs = []
	fromDirectory = ""
	toDirectory = ""
	folderDepth = 0
	notPopulatedCheck = False

	while ("src" not in listOfDirs and "include" not in listOfDirs):
		#print "LIST OF DIRS:",listOfDirs
		searchedDirectory = searchedDirectory + realPath
		try:
			#print searchedDirectory
			#print "BEFORE"
			root, dirs, files = os.walk(searchedDirectory).next()
			if (len(dirs) == 0):
				return searchedDirectory
			#print "AFTER"
			#for dirs in os.walk(searchedDirectory).next()[1]:
			listOfDirs = dirs
			i=0
			for dir in dirs:
				folderVal = "/"+dirs[i]
				tempRoot, tempDirs, tempFiles = os.walk(searchedDirectory+folderVal).next()
				#print "LENTEMPDIRS:",len(tempDirs)
				#print "ROOT:", tempRoot
				folderCount = len(tempDirs)
				if (folderCount >= maxFolderCount):
					realPath = folderVal
					maxFolderCount = folderCount
				folderCount = 0
				i=i+1
				
		except StopIteration:
			print "Cannot find files to compile. User:", directory
			notPopulatedCheck = True
			break
			
			
	return searchedDirectory
	
	#if (searchedDirectory.count("/") > 2 and notPopulatedCheck == False):
		#print "Time to copy up"
		#print searchedDirectory
		#fromDirectory = searchedDirectory
		#toDirectory = rootDirectory + "/!TESTFOLDER"

		#copy_tree(fromDirectory, toDirectory)
		
		#root, dirs, files = os.walk(directory).next()
		#print dirs

#Copies the contents of a student assignment folder (only .c and .h files are allowed) to the correct position in the destination folder.
#INPUT: The file location of the root student assignment directory, the destination folder where the files will be copied to, an optional variable which allows for files to be excluded from the copy
#OUTPUT: Files will be copied from source to destination
def copyFiles(studentFolder, destination, excludeFiles=[]):
	#print destination
	#print studentFolder
	excludedStudentFiles = []
	foundFlag = False
	# Get all .c and .h files in the folder
	studentFiles = glob.glob(studentFolder+'/*.h') + glob.glob(studentFolder+'/*.c')
	#Look for all excluded files, if any
	for exclude in excludeFiles:
		for files in studentFiles:
			if exclude in files:
				excludedStudentFiles.append(files)
				break
	#Remove exlucded files from student file list
	for files in excludedStudentFiles:
		studentFiles.remove(files)
		#print files
		#copyfile(studentFiles, destination)
	if len(studentFiles) == 0:
		return -1
	for copyFile in studentFiles:
		#print copyFile, destination
		shutil.copy(copyFile, destination)
	return 1

#Runs the compile, testing and cleanup script. Also checks output and either displays it or stores it for CSV purposes.
#INPUT: Folder address of the folder to parse for the list of specific measures to calculate. Optional variables: csv determines whether or not the output prints or gathers results for csv formatting, csvList is the list of all data for the current file up until this point
#OUTPUT: Returns a blank list if CSV is set to false, or a populated list of measures in the directory if csv=true
def compileManager(projectFiles, runharness, showErrors, assignment, complianceFilePath, outputString, csv=False, csvList=[]):
	root, dirs, files = os.walk(projectFiles).next()
	actualLocation = ""
	#print dirs
	i=0
	tempCSVList = []
	resultsList = []
	#print [name for name in os.listdir(projectFiles) if os.path.isdir(name)]
	srcDirectory = "./"+projectFiles+"/src"
	includeDirectory = "./"+projectFiles+"/include"
	binDirectory = "./"+projectFiles+"/bin"
        #print srcDirectory
	#print includeDirectory
	actualLocation = FindBuriedFolders(projectFiles)
	#Copy all files to the correct location
	#errCode = copyFiles(srcDirectory, "./compiletest/studentCode")
	if (actualLocation != ""):
		srcDirectory = actualLocation + "/src"
		includeDirectory = actualLocation + "/include"
                binDirectory = actualLocation + "/bin"
		if (assignment == "A1"):
			copyFiles(srcDirectory, "./tools/programmingTools/MeasureCollector/compiletestF18A1/studentCode")
			copyFiles(includeDirectory, "./tools/programmingTools/MeasureCollector/compiletestF18A1/studentInclude")
		elif (assignment == "A2"):
			copyFiles(srcDirectory, "./compiletestA2/studentCode")
			copyFiles(includeDirectory, "./compiletestA2/studentInclude")
		elif (assignment == "A1R"):
			copyFiles(srcDirectory, "./compiletestA1R/studentCode")
			copyFiles(includeDirectory, "./compiletestA1R/studentInclude")
		elif (assignment == "A2R"):
			copyFiles(srcDirectory, "./compiletestA2R/studentCode")
			copyFiles(includeDirectory, "./compiletestA2R/studentInclude")
		else:
			print "ERROR: ASSIGNMENT UNKNOWN"
			exit()
		#print srcDirectory
		#print includeDirectory
	else:
		if (assignment == "A1"):
			errCode = copyFiles(srcDirectory, "./tools/programmingTools/MeasureCollector/compiletestF18A1/studentCode")
		elif (assignment == "A2"):
			errCode = copyFiles(srcDirectory, "./compiletestA2/studentCode")
		elif (assignment == "A1R"):
			errCode = copyFiles(srcDirectory, "./compiletestA1R/studentCode")
		elif (assignment == "A2R"):
			errCode = copyFiles(srcDirectory, "./compiletestA2R/studentCode")
		else:
			print "ERROR: ASSIGNMENT UNKNOWN"
			exit()
	#print errCode
		if (errCode == -1):
			for dir in dirs:
			
				srcDirectory = "./"+projectFiles+"/"+dir+"/src"
				includeDirectory = "./"+projectFiles+"/"+dir+"/include"
				#print srcDirectory
				#print includeDirectory
				if (assignment == "A1"):
					errCode = copyFiles(srcDirectory, "./tools/programmingTools/MeasureCollector/compiletestF18A1/studentCode")
					copyFiles(includeDirectory, "./tools/programmingTools/MeasureCollector/compiletestF18A1/studentInclude", ["VCardParser.h", "LinkedListAPI.h"])
				elif (assignment == "A2"):
					errCode = copyFiles(srcDirectory, "./compiletestA2/studentCode")
					copyFiles(includeDirectory, "./compiletestA2/studentInclude", ["GEDCOMparser.h", "LinkedListAPI.h"])
				elif (assignment == "A1R"):
					errCode = copyFiles(srcDirectory, "./compiletestA1R/studentCode")
					copyFiles(includeDirectory, "./compiletestA1R/studentInclude", ["GEDCOMparser.h", "LinkedListAPI.h"])
				elif (assignment == "A2R"):
					errCode = copyFiles(srcDirectory, "./compiletestA2R/studentCode")
					copyFiles(includeDirectory, "./compiletestA2R/studentInclude", ["GEDCOMparser.h", "LinkedListAPI.h"])
				else:
					print "ERROR: ASSIGNMENT UNKNOWN"
					exit()
		else:
			if (assignment == "A1"):
				copyFiles(includeDirectory, "./tools/programmingTools/MeasureCollector/compiletestF18A1/studentInclude", ["GEDCOMparser.h", "LinkedListAPI.h"])
			elif (assignment == "A2"):
				copyFiles(includeDirectory, "./compiletestA2/studentInclude", ["GEDCOMparser.h", "LinkedListAPI.h"])
			elif (assignment == "A1R"):
				copyFiles(includeDirectory, "./compiletestA1R/studentInclude", ["GEDCOMparser.h", "LinkedListAPI.h"])
			elif (assignment == "A2R"):
				copyFiles(includeDirectory, "./compiletestA2R/studentInclude", ["GEDCOMparser.h", "LinkedListAPI.h"])
			else:
				print "ERROR: ASSIGNMENT UNKNOWN"
				exit()

	#Execute the .subexecute script
	#Makes the test harness with the new student files, then runs the script
	if (runharness == True):
		result = subprocess.Popen("./tools/programmingTools/MeasureCollector/.subexecute.sh", stdout=subprocess.PIPE, stderr=subprocess.PIPE).communicate()

	else:
		if (assignment == "A1"):
			result = subprocess.Popen("./tools/programmingTools/MeasureCollector/.checkharnessA1.sh", stdout=subprocess.PIPE, stderr=subprocess.PIPE).communicate()
			#print "HEY THIS IS RUNNING"
		elif (assignment == "A2"):
			result = subprocess.Popen("./.checkharnessA2.sh", stdout=subprocess.PIPE, stderr=subprocess.PIPE).communicate()
		elif (assignment == "A1R"):
			result = subprocess.Popen("./.checkharnessA1R.sh", stdout=subprocess.PIPE, stderr=subprocess.PIPE).communicate()
		elif (assignment == "A2R"):
			result = subprocess.Popen("./.checkharnessA2R.sh", stdout=subprocess.PIPE, stderr=subprocess.PIPE).communicate()
		else:
			print "ERROR: ASSIGNMENT UNKNOWN"
			exit()
	#Trim garbage output
	listResult = list(result)

	#Call the cleanup script
	#Remove all student files and leftover files from the project
	csvListCompliance, outputString = complianceManager(projectFiles, assignment, complianceFilePath, outputString, binDirectory, includeDirectory, csv, [])
	tempCSVList.append(csvListCompliance+csvList)

	#Look for warning that the script failed
	#TO DO: Implement a better method in the future
	if "ERROR: Compilation Error" in listResult[0]:
		if (csv==True):
			resultsList.append("Failure")
		else:
			print "Compilation Success: False"
			if (showErrors == True):
				print listResult[1]
				print listResult[0]
		
	else:
		if (csv==True):
			resultsList.append("Success")
			#print "Compilation Success: True"
		elif (csv==False):
			print "Compilation Success: True"
			if (runharness == True):
				print listResult[0]

	subprocess.call("./tools/programmingTools/MeasureCollector/.cleanup.sh", stdout=subprocess.PIPE)
	for entry in resultsList:
		if (entry == "Success"):
			#print tempCSVList
			csvList = csvList + tempCSVList[0]
			csvList.append("Success")
			return csvList, outputString
	csvList = csvList + tempCSVList[0]
	csvList.append("Failure")
	#print outputString
	return csvList, outputString

#ONLY WORKS WITH testFiles FOLDER FILES
def main():
	#Copy all files to the correct location
	copyFiles("./tests/testFiles/assign1/src", "./compiletest/studentCode",  ["GEDCOMparser.c"])
	copyFiles("./tests/testFiles/assign1/include", "./compiletest/studentInclude", ["GEDCOMparser.h", "LinkedListAPI.h"])

	#Execute the .subexecute script
	#Makes the test harness with the new student files, then runs the script
	result = subprocess.Popen("./.subexecute.sh", stdout=subprocess.PIPE, stderr=subprocess.PIPE).communicate()

	#Trim garbage output
	listResult = list(result)
	listResult = listResult[:-1]

	#Look for warning that the script failed
	#TO DO: Implement a better method in the future
	if "Exiting" in listResult[0]:
		print "Error: Failure to Compile"
	else:
		print "Compilation Success"
	print listResult[0]

	#Call the cleanup script
	#Remove all student files and leftover files from the project
	subprocess.call("./.cleanup.sh", stdout=subprocess.PIPE)

if __name__ == '__main__':
	main()
	
	
