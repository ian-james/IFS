import sys
import os.path
import re
import glob
from glob import glob

def getNonLoop(flow, flowCount, projectFileCount, csv=False):
	foundCount = 0
	i = 0
	nonLoopConditional = [
	'case',
	'do', 
	'else',
	'goto',
	'if', 
	'switch']
	
	#print flow
	
	for keywords in flow:
		for nlc in nonLoopConditional:
			if keywords == nlc:
				foundCount = foundCount + flowCount[i]
		i = i+1
	
	if (csv == False):
		print "Total number of non-loop conditional keywords =", foundCount
		if (projectFileCount == 0):
			print "Average number of non-loop conditional keywords per module = 0"
		else:
			print "Average number of non-loop conditional keywords per module =", foundCount / float(projectFileCount)
	foundAverage = 0
	if (projectFileCount != 0):
		return foundCount, foundCount / float(projectFileCount)
	return foundCount, 0

def getKeywordCount(projectFiles, csv=False, csvList=[]):
	fileIndex = 1
	list = []
	list.append([])

	#Set each keyword
	keywords = getKeywords()
	list[0] = splitList(keywords)
	#projectFiles = glob(dir+'/*.c') + glob(dir+'/*.h')
	for files in projectFiles:
		if os.path.isfile(files) == False:
			print "File", file, "to parse does not exist, please enter a valid file"
			exit()
		#Set list counters to 0 for each keyword
		list.append([0 for i in range(32)])

	#Set each keyword


	for files in projectFiles:
		#print files
		parse = open(files, 'r')

	# Remove all special characters from words to ensure correct matching

		for line in parse:
			test = re.sub(r'[^A-Za-z0-9 ]+', r' ', line)
	
			for word in test.split():
				#print word
				result = binarySearch(list[0], word)
				if result == True:
					#print "---------Found", word
					resultCounter(list, word, fileIndex)
				#else:
					#print word
		fileIndex = fileIndex+1
	talliedTotals = tallyTotals(list)
	#printCounts(talliedTotals)
	#print talliedTotals
	type, flow = separateKeywords(keywords,talliedTotals)
	if (csv == False):
		print "Total number of type keywords =", sum(type[1])
		if (len(projectFiles) == 0):
			print "Average number of type keywords per module = 0"
		else:
			print "Average number of type keywords per module =", sum(type[1]) / float(len(projectFiles))
		print "Total number of flow keywords =", sum(flow[1])
		if (len(projectFiles) == 0):
			print "Average number of flow keywords per module = 0"
		else:
			print "Average number of flow keywords per module =", sum(flow[1]) / float(len(projectFiles))
	total, average = getNonLoop(flow[0], flow[1], len(projectFiles), csv)
	
	if (csv==True):
		csvList.append(sum(type[1]))
		if (len(projectFiles) != 0):
			csvList.append(round(sum(type[1]) / float(len(projectFiles)),2))
		else:
			csvList.append(0)
		csvList.append(sum(flow[1]))
		if (len(projectFiles) != 0):
			csvList.append(round(sum(flow[1]) / float(len(projectFiles)),2))
		else:
			csvList.append(0)
		csvList.append(round(float(total),2))
		csvList.append(round(float(average),2))
		return csvList
	return []
	
	
def separateKeywords(keywords, talliedTotals):
	type = []
	type.append([])
	type.append([])
	#type[1] = [0 for i in range(32)]
	flow = []
	flow.append([])
	flow.append([])
	#flow[1] = [0 for i in range(32)]
	#print len(keywords)
	for i in range (0, len(talliedTotals[0])):
		#print i
		#print keywords[i*2]
		#print talliedTotals[0][i]
		if (keywords[i*2] == talliedTotals[0][i]):
			if (keywords[(i*2)+1] == 't'):
				type[0].append(talliedTotals[0][i])
				#print talliedTotals[1][i]
				#print type[1]
				type[1].append(talliedTotals[1][i])
			else:
				flow[0].append(talliedTotals[0][i])
				#print talliedTotals[1][i]
				flow[1].append(talliedTotals[1][i])
	#print type
	#print flow
	return type, flow



def tallyTotals(list):
	count = 0
	valTotal = 0
	listSize = len(list)
	tallyList = []
	tallyList.append(list[0])
	tallyList.append([])
	tallyList[1] = [0 for i in range(32)]
	
	for entry in list[0]:
		for i in range (1, listSize):
			valTotal = valTotal + list[i][count]
		
		#print entry, valTotal
		tallyList[1][count] = valTotal
		valTotal = 0
		count+=1
	return tallyList

def printCounts(talliedList):
	for i in range (0, len(talliedList[0])):
		print talliedList[0][i], talliedList[1][i]
		

def binarySearch(list, item):
	if len(list) == 0:
			return False
	else:
			midpoint = len(list)//2
			if list[midpoint] == item:
				return True
			else:
				if item<list[midpoint]:
					return binarySearch(list[:midpoint], item)
				else:
					return binarySearch(list[midpoint+1:], item)


def resultCounter(list, item, listIndex):
	count = 0
	for word in list[0]:
		if word == item:
			list[listIndex][count]+=1
			#print list[1][count]
			#print "IT'S HAPPENING"
			return
		count+=1

#Don't run without a keyword file

def splitList(the_list):
	return the_list[::2]

#def countKeywordTypes(list, keywords)

def getKeywords():
	keywords = ['auto', 't', 
	'break', 'f', 
	'case', 'f', 
	'char', 't', 
	'const', 't', 
	'continue', 'f', 
	'default', 'f', 
	'do', 'f', 
	'double', 't', 
	'else', 'f', 
	'enum', 't', 
	'extern', 't', 
	'for', 'f', 
	'float', 't', 
	'goto', 'f', 
	'if', 'f', 
	'int', 't', 
	'long', 't', 
	'register', 't', 
	'return', 'f', 
	'short', 't', 
	'signed', 't', 
	'sizeof', 't', 
	'static', 't', 
	'struct', 't', 
	'switch', 'f', 
	'typedef', 't', 
	'union', 't', 
	'unsigned', 't', 
	'void', 't', 
	'volatile', 't', 
	'while', 'f']
	return keywords

def main(argv):

	if len(sys.argv) < 2:
		print "Please run with a file to parse as command line argument 1"
		exit()


	#print 'Num of arguments', len(sys.argv)
	#print 'Arg list:', str(sys.argv)

	projectFiles = glob(argv[0]+'/*.c') + glob(argv[0]+'/*.h')

	getKeywordCount(projectFiles)

if __name__ == '__main__':
	main(sys.argv[1:])