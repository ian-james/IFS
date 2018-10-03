import sys
import os.path
import re
import glob
from glob import glob

def getOperatorsList():
	operatorList = [
		"(type)*",
		"sizeof",
		"<<",
		">>",
		"<=",
		">=",
		"==",
		"!=",
		"?:",
		"+=",
		"-=",
		"=+",
		"=-",
		"*=",
		"=*",
		"/=",
		"=/",
		"%=",
		"=%",
		">>=",
		"<<=",
		"&=",
		"^=",
		"|=",
		"->",
		"++",
		"--",
		"||",
		"&&",
		"&",
		"^",
		"*",
		"/",
		"%",
		"(",
		")",
		"[",
		"]",
		"+",
		"-",
		".",
		"!",
		"~",
		"<",
		">",
		"|",
		"=",
		","
	]
	return operatorList

def getOperators(projectFiles, csv=False, csvList=[]):
	totalCount = 0
	uniqueOperatorCount = 0
	foundBreak = False
	i=0
	copiedFiles = []
	operatorsList = []
	operatorsList.append([])

	#Set each keyword
	operatorsList[0] = getOperatorsList()
	#projectFiles = glob(dir+'/*.c') + glob(dir+'/*.h')
	for files in projectFiles:
		if os.path.isfile(files) == False:
			print "File", file, "to parse does not exist, please enter a valid file"
			exit()
		#Set list counters to 0 for each keyword
		operatorsList.append([0 for i in range(48)])

	#Set each keyword


	for files in projectFiles:
		#print files
		resultant = open(files, 'r').read().split()
		copiedFiles.append(resultant)
		#print copiedFiles
	#print copiedFiles

	#Begin matching word by word for operator matching

	stringStart = 0
	stringEnd = 99999
	testCount = 0
	i=0
	j=0
	outerBreak = False
	foundFlag = False
	
	#Look through each file one at a time
	for files in copiedFiles:
		#Look through each unique "word" one at a time
		for word in files:
			#print word
			#Set the start and end of the word string to search for operators
			stringStart = 0
			stringEnd = len(word)
			for operator in operatorsList[0]:
			#while (outerBreak == False):
				#print j
				#operator = operatorsList[0][j]
				#print operator
				#foundFlag = False
				while (foundBreak == False):

					stringIndex = word.find(operator,stringStart, stringEnd)
					if stringIndex > -1:
						foundFlag = True
						#print stringIndex
						totalCount = totalCount+1
						#foundBreak = True
						stringStart = stringIndex+len(operator)
						operatorsList[1][i] = operatorsList[1][i]+1
						#if (operator == "->"):
							#testCount=testCount+1
							#print "string start =",stringStart
					else:
						foundBreak = True
					if (j==len(operatorsList[0])-1):
						foundBreak = True
				i=i+1
				foundBreak = False
			i=0
			#if (testCount >= 1):
				#print "NUMBER OF arrows IN WORD", word, ":",testCount
			testCount = 0

	i=0
	for entry in operatorsList[1]:
		if entry != 0:
			#print operatorsList[0][i]
			uniqueOperatorCount = uniqueOperatorCount + 1
		i=i+1
	if (csv == False):
		print "Total number of operators across all files =",totalCount
		print "Number of unique operators across all files =",uniqueOperatorCount
	if (csv==True):
		csvList.append(totalCount)
		csvList.append(uniqueOperatorCount)
		return csvList
	
	return []


def main(argv):

	if len(sys.argv) < 0:
		print "Please run with a file to parse as command line argument 1"
		exit()


	#print 'Num of arguments', len(sys.argv)
	#print 'Arg list:', str(sys.argv)

	#projectFiles = glob(argv[0]+'/*.c') + glob(argv[0]+'/*.h')
	print projectFiles

	getOperators(projectFiles)

if __name__ == '__main__':
	main(sys.argv[1:])