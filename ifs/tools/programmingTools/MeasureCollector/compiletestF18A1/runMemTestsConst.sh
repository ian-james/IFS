#!/bin/bash

make calMemTestConst
echo "**************************** Create/delete: Test 1 ****************************"
valgrind bin/calMemTestConst1 1
echo ""
echo ""
echo "**************************** Create/delete: Test 2 ****************************"
valgrind bin/calMemTestConst1 2
echo ""
echo ""
echo "**************************** Create/delete: Test 3 ****************************"
valgrind bin/calMemTestConst1 3
echo ""
echo ""
echo "**************************** Create/delete: Test 4 ****************************"
valgrind bin/calMemTestConst1 4
echo ""
echo ""
echo "**************************** Create/delete/print: Test 1 ****************************"
valgrind bin/calMemTestConst2 1
echo ""
echo ""
echo "**************************** Create/delete/print: Test 2 ****************************"
valgrind bin/calMemTestConst2 2
echo ""
echo ""
echo "**************************** Create/delete/print: Test 3 ****************************"
valgrind bin/calMemTestConst2 3
echo ""
echo ""
echo "**************************** Create/delete/print: Test 4 ****************************"
valgrind bin/calMemTestConst2 4
echo ""
echo ""
