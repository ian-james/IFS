import sys
import subprocess
import os.path
import re
import glob
from glob import glob

def countFunctions(filesToRead):
	count = 0
	#filesToRead = glob(fileDirectory+'/*.c') + glob(fileDirectory+'/*.h')
	with open('files_to_read.txt', 'w') as the_file:
		for file in filesToRead:
			the_file.write(file)
			the_file.write('\n')
	result = subprocess.Popen(['ctags', '-x', '--c-types=f', '-L', 'files_to_read.txt'], stdout=subprocess.PIPE)
	#print (result.stdout.decode('utf-8'))
	while True:
		line = result.stdout.readline()
		#print line
		if line == '':
			break
		else:
			count = count+1
	print "Total number of functions in directory =", count
	print "Average number of functions per module =", count / float(len(filesToRead))
	os.remove("files_to_read.txt")

def main(argv):
	if (len(argv) == 0):
		print "Cannot find files. Please pass a directory to parse for functions."
		exit()
	countFunctions(argv)
	
if __name__ == '__main__':
	main(sys.argv[1:])