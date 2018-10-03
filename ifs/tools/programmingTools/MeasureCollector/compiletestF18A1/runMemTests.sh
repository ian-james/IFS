#!/bin/bash

make calMemTest
echo "**************************** Create/delete: Test 1 ****************************"
valgrind bin/calMemTest1 1
echo ""
echo ""
echo "**************************** Create/delete: Test 2 ****************************"
valgrind bin/calMemTest1 2
echo ""
echo ""
echo "**************************** Create/delete: Test 3 ****************************"
valgrind bin/calMemTest1 3
echo ""
echo ""
echo "**************************** Create/delete: Test 4 ****************************"
valgrind bin/calMemTest1 4
echo ""
echo ""
echo "**************************** Create/delete/print: Test 1 ****************************"
valgrind bin/calMemTest2 1
echo ""
echo ""
echo "**************************** Create/delete/print: Test 2 ****************************"
valgrind bin/calMemTest2 2
echo ""
echo ""
echo "**************************** Create/delete/print: Test 3 ****************************"
valgrind bin/calMemTest2 3
echo ""
echo ""
echo "**************************** Create/delete/print: Test 4 ****************************"
valgrind bin/calMemTest2 4
echo ""
echo ""
