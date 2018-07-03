#!/usr/bin/python
import urllib, mimetypes

url = urllib.pathname2url('/users/1/unzipped/programmingParser.py')
print mimetypes.guess_type(url)