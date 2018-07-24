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
	#print idirectory
	projectFiles = [os.path.join(dirpath, f)
	    for dirpath, dirnames, files in os.walk(idirectory)
	    for f in files if (f.endswith('.c')) or (f.endswith('.h'))]
	CountLOC(projectFiles)
	calcUnique(projectFiles)
	getKeywordCount(projectFiles)
	countFunctions(projectFiles)
if __name__ == '__main__':
	main(sys.argv[1:])