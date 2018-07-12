import sys
import subprocess
import os.path
import re
import glob
from glob import glob

def main(argv):
	result = glob(argv[0]+'/*.c') + glob(argv[0]+'/*.h')
	with open('files_to_read.txt', 'w') as the_file:
		for file in result:
			the_file.write(file)
			the_file.write('\n')
	result = subprocess.run(['ctags', '-x', '--c-types=f', '-L', 'files_to_read.txt'], stdout=subprocess.PIPE)
	print result.stdout)
	#print output

if __name__ == '__main__':
	main(sys.argv[1:])