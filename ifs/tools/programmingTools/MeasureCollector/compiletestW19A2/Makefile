CC = gcc
CFLAGS = -Wall -g -Iinclude -IstudentInclude -std=c11
CAL_TEST_FILES = src/CalTestUtilities.c src/CalTestObjects.c src/TestHarness2.c
A1_TEST = src/CalTestA1.c src/CalTestCasesA1.c
A2_TEST = src/CalTestAll.c src/CalTestCasesA1.c src/CalTestCasesA2.c src/CalTestCasesA2Mod3.c 

UNAME := $(shell uname)

ifeq ($(UNAME), Linux)
	CCFLAGS += -std=gnu11 
endif
ifeq ($(UNAME), Darwin)
	CCFLAGS += -std=c11
endif

calTestA1:  
	rm -rf bin/*; \
	$(CC)  $(CFLAGS) $(A1_TEST) $(CAL_TEST_FILES) studentCode/*.c  -o bin/calTestsA1; \
	bin/calTestsA1

runCalTestA2: calTestA2
	bin/calTestA2

calTestA2:  
	rm -rf bin/*; \
	$(CC)  $(CFLAGS) $(A2_TEST) $(CAL_TEST_FILES) studentCode/*.c  -o bin/calTestA2

tmpTestA2:
	$(CC)  $(CFLAGS) src/MemTestA2.c studentCode/*.c  -o bin/tmpTestA2

leakTestA1: memTestsA1
	valgrind --show-leak-kinds=all --leak-check=yes --track-origins=yes bin/memTest 1; \
	valgrind --show-leak-kinds=all --leak-check=yes --track-origins=yes bin/memTest 2; \
	valgrind --show-leak-kinds=all --leak-check=yes --track-origins=yes bin/memTest 3; \
	valgrind --show-leak-kinds=all --leak-check=yes --track-origins=yes bin/memTest 4; \
	valgrind --show-leak-kinds=all --leak-check=yes --track-origins=yes bin/memTest 5; \
	valgrind --show-leak-kinds=all --leak-check=yes --track-origins=yes bin/memTest 6; \
	valgrind --show-leak-kinds=all --leak-check=yes --track-origins=yes bin/memTestPrint 1; \
	valgrind --show-leak-kinds=all --leak-check=yes --track-origins=yes bin/memTestPrint 2; \
	valgrind --show-leak-kinds=all --leak-check=yes --track-origins=yes bin/memTestPrint 3; \
	valgrind --show-leak-kinds=all --leak-check=yes --track-origins=yes bin/memTestPrint 4

memErrTestA1: memTestsA1
	valgrind -v bin/memTest 1; \
	valgrind -v bin/memTest 2; \
	valgrind -v bin/memTest 3; \
	valgrind -v bin/memTest 4; \
	valgrind -v bin/memTest 5; \
	valgrind -v bin/memTest 6; \
	valgrind -v bin/memTestPrint 1; \
	valgrind -v bin/memTestPrint 2; \
	valgrind -v bin/memTestPrint 3; \
	valgrind -v bin/memTestPrint 4


leakTestA2: memTestsA2
	valgrind --show-leak-kinds=all --leak-check=yes --track-origins=yes bin/memTestWrite 1; \
	valgrind --show-leak-kinds=all --leak-check=yes --track-origins=yes bin/memTestWrite 2; \
	valgrind --show-leak-kinds=all --leak-check=yes --track-origins=yes bin/memTestWrite 3; \
	valgrind --show-leak-kinds=all --leak-check=yes --track-origins=yes bin/memTestWrite 4; \
	valgrind --show-leak-kinds=all --leak-check=yes --track-origins=yes bin/memTestValidate 1; \
	valgrind --show-leak-kinds=all --leak-check=yes --track-origins=yes bin/memTestValidate 2; \
	valgrind --show-leak-kinds=all --leak-check=yes --track-origins=yes bin/memTestValidate 3; \
	valgrind --show-leak-kinds=all --leak-check=yes --track-origins=yes bin/memTestValidate 4

memTestsA2:
	$(CC) $(CFLAGS) src/MemTestsWrite.c studentCode/*.c  -o bin/memTestWrite; \
	$(CC) $(CFLAGS) src/MemTestsValidate.c studentCode/*.c  -o bin/memTestValidate

memTestsA1:
	$(CC) $(CFLAGS) src/MemTests.c studentCode/*.c  -o bin/memTest; \
	$(CC) $(CFLAGS) src/MemTestsPrint.c studentCode/*.c  -o bin/memTestPrint

clean:
	rm -rf bin/*