import sys
import subprocess
import os.path
import re
import glob
from glob import glob

def generateFunctionJSON(allFunctions):
	print '"functionNames": {'
	start = True
	foundFileName = ''
	for entry in allFunctions:
		tempFile = entry.split()
		if tempFile[0] != foundFileName:
			if start == False:
				print '],'
			foundFileName = tempFile[0]
			print '"'+foundFileName+'": ['
			start = False
		print '"'+tempFile[1]+'",'
	print ']'
	print '}'
	
	
def getCtagsInfo(filesToRead):
	allEntries = []
	#filesToRead = glob(fileDirectory+'/*.c') + glob(fileDirectory+'/*.h')
	with open('files_to_read.txt', 'w') as the_file:
		for file in filesToRead:
			the_file.write(file)
			the_file.write('\n')
	result = subprocess.Popen(['ctags', '-x', '--c-types=f', '-L', 'files_to_read.txt'], stdout=subprocess.PIPE)
	#print (result.stdout.decode('utf-8'))
	while True:
		line = result.stdout.readline()
		if len(line) == 0:
			break
		functions = line.split()
		functionString = ''
		functionFile = functions[3]
		for partialString in functions[4:]:
			functionString = functionString + partialString
		functionString = functionString.replace('{','')
		#print functionFile,",",functionString
		allEntries.append(functionFile+" "+functionString)
		#print functions
	#print allEntries
	os.remove("files_to_read.txt")
	return allEntries
	
def countFunctions(filesToRead, csv=False, csvList=[]):
	count = 0
	allEntries = []
	allEntries = getCtagsInfo(filesToRead)
	#print allEntries
	count = len(allEntries)
	allEntries.sort(key=lambda v: v.upper())
	#for entries in allEntries:
		#print entries
	#generateFunctionJSON(allEntries)
	if (csv == False):
		print "Total number of functions in directory =", count
		if (len(filesToRead) != 0):
			print "Average number of functions per module =", count / float(len(filesToRead))
		else:
			print "Cannot calculate average number of functions. Check ctags is installed"

	if (csv==True):
		csvList.append(count)
		if (len(filesToRead) != 0):
			csvList.append(round(count / float(len(filesToRead)),2))
		else:
			return csvList.append("Error: No Functions Found")
		return count, csvList

	return count, []

def main(argv):
	if (len(argv) == 0):
		print "Cannot find files. Please pass a directory to parse for functions."
		exit()
	countFunctions(argv)
	
if __name__ == '__main__':
	main(sys.argv[1:])