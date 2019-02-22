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
import shutil

def main(argv):
	
path = "./users/"
users = glob.glob(path+"*")
fileName = "IFS-SPECIFIC-MEASURE-FILE.txt"

for user in users:
	submissions = glob.glob(users+"/*")
	for submission in submissions:
		fileObject = open(submission+"/"+fileName, "r")
		fileValue = fileObject.read()
		print fileValue
		

if __name__ == '__main__':
	main(sys.argv[1:])

