#!/usr/bin/env python
#
# Copyright (c) 2018 Nicholas Domenichini ndomenic@uoguelph.ca
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
import json
import string

def decorateData(allResults):
    json_string = '{"feedbackStats": ['

    for results in allResults:
        for result in results:
            json_string += ('{'
                            + '"toolName": "c_stats",'
                            + '"type": "stat",'
                            + '"level": "basic",'
                            + '"category": "spelling",'
                            + '"filename": "' + result[0] + '",'
                            + '"statName": "' + result[1] + '",'
                            + '"statValue": "' + str(result[2]) + '",'
                            + '"name": "' + result[3] + '"'
                            + '},')

    json_string = json_string[:-1]
    json_string += ']}'

    json_string = json.loads(json_string)
    json_string = json.dumps(json_string, indent=4, sort_keys=True)

    return json_string

def parse (dir, tool):
    ret = []

    allFiles = os.listdir(dir)
    for file in allFiles:
        if file != 'stderr.txt' and file != 'stdout.txt':
            title, val, name = tool(dir + '/' + file)
            data = (file, title, val, name)
            ret.append(data)

    return ret

def countLines(path):
    title = 'Lines of Code'
    val = 0
    name = 'chCount'

    with open(path) as file:
        for i, j in enumerate(file):
            pass
    val = i + 1

    return title, val, name

def countComments(path):
    title = 'Number of Comments'
    val = 0
    name = 'wordCount'
    flag = False

    with open(path) as file:
        for line in file:
            for i in range(len(line)):
                if (flag == False and line[i] == '/' and line[i+1] == '*'):
                    flag = True
                    val += 1
                if (flag == True and line[i] == '*' and line[i+1] == '/'):
                    flag = False
                if (flag == False and line[i] == '/' and line[i+1] == '/'):
                    val += 1

    return title, val, name

def main (argv):
    results = []
    options = { 'dir':'',
                'totalLines': False,
                'totalComments': False,
                }

    opts, args = getopt.getopt(argv,'d:t:c:h',['directory=','totalLines=','totalComments=','help'])

    for opt, arg in opts:
        if opt in ('directory', '-d'):
            options['dir'] = arg
            if not (os.path.isdir(options['dir'])):
                sys.stderr.write( 'Error. Directory ' + options['dir'] + ' does not exist.\n' )
                sys.exit()
        elif opt in ('totalLines', '-t'):
            options['totalLines'] = True
        elif opt in ('totalComments', '-c'):
            options['totalComments'] = True
        else:
            print('Usage: Parses specific GCC/CPPCheck output files types to JSON format')
            print('stats.py [-t totalLines] -d InputDirectory')
            sys.exit()


    if (options['totalLines']):
        result = parse(options['dir'], countLines)
        results.append(result)

    if (options['totalComments']):
        result = parse(options['dir'], countComments)
        results.append(result)

    results = decorateData(results)

    idirectory = options['dir']
    outputfile = os.path.normpath( os.path.join( os.path.dirname(idirectory) +  "/feedback_stats_unzipped" ) )

    file = open( outputfile, "w")
    file.write(results)
    file.close()

    print(results)

if __name__ == '__main__':
    main(sys.argv[1:])