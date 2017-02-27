# IFS
_Immediate Feedback System_ for student programming assignments and essay
writing

This projects allows students to receive formative feedback for C/C++
assignments and written works.

The project provides a website for students to upload their assignments or work
and select assessment tools, formative feedback will be generated based on
tools and the student's work.

## Getting started

IFS project management is hosted is on the University of Guelph Redmine:
https://redmine.socs.uoguelph.ca/projects/ifs

### Basic dependencies
To get started you should install the following:
 * npm (4.0.3)
 * Node (6.9.4)
 * MySQL (14.14 Distrib 5.7.17)
 * Redis Server (v3.2.1)
 * Java 8

The IFS is currently available on [GitHub](https://github.com/ian-james/IFS),
clone or fork as needed.

### Installation and setup

Install or update NPM and Node:
```
sudo apt install npm nodejs; sudo ln -s /usr/bin/nodejs /usr/bin/node
```

Install Redis Server:
```
sudo apt-get install redis-server)
```

Ensure the following ports are allowed through your firewall:
 * 6379 for Redis
 * 3000 for Node
 * 4000 for Redis Job UI

Start the Redis server by executing `redis-server`

Modify `ifs/config/databaseConfig.js` with your local mySQL parameters

Install all required node\_modules (from `ifs/` folder) :
```
cd ifs/
sudo npm install
```

Start your localServer:
```
npm test
```

In your browser go to localhost:3000/ to see the web interface

### Dependencies for included tools

 * NLTK &rarr; http://www.nltk.org/install.html
 * cppCheck &rarr; `sudo apt install cppcheck`
 * valgrind &rarr; `sudo apt install valgrid`
 * Hunspell &rarr; `sudo apt install hunspell`
   + pyHunspell &rarr; `sudo -H pip install hunspell`
 * LanguageTool
   + language-check &rarr; `sudo -H pip install 3to2 && sudo -H pip install
                        language-check`


