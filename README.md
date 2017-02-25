# IFS
Immediate Feedback System for student programming assignments and essay writing

This projects allows students to receive formative feedback for C/C++ assignments and written.
The project provides a website for students to upload their assignments or work and select assessment tools, formative feedback will be generated based tools and the student's work.

To Get started with the IFS projet,

https://redmine.socs.uoguelph.ca/projects/ifs

You'll need the following
To get started you should install the following: ( development variables indicated in brackets )
npm (4.0.3)
Node (6.9.4)
mysql (14.14 Distrib 5.7.17)
Redis Server (v3.2.1)
oracle-java8-installer

The IFS is currently available at my GitHub (https://github.com/ian-james/IFS), clone or fork as needed.

Getting Started

Install or update NPM and Node 
Install Redis-Server (sudo apt-get install redis-server)

Ensure the following ports are unblocked:
6379 for redis, 3000 localhost, 4000 Redis Job UI

start redis server
In command line type: redis-server

Modify ifs/config/databaseConfig.js with your local mysql Parameters

Install all required Node_modules (from /ifs folder)
type: sudo npm install

To start your localServer
type: npm test

In your browser go to localhost:3000/

Tools included

NLTK -> http://www.nltk.org/install.html

cppCheck (from universe) -> (sudo apt install cppCHeck)

valgrind -(sudo apt install valgrid)

hunspell and libhunspell



