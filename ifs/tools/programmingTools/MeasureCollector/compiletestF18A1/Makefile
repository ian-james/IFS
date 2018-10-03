CC = gcc
CFLAGS = -Wall -g -Iinclude -IstudentInclude -std=c11
CARD_TEST_FILES = src/CardTest.c src/CardTestCreate.c src/CardTestOther.c src/CardTestUtilities.c src/TestHarness2.c

UNAME := $(shell uname)

ifeq ($(UNAME), Linux)
	CCFLAGS += -std=gnu11 
endif
ifeq ($(UNAME), Darwin)
	CCFLAGS += -std=c11
endif

cardTests:  
	$(CC)  $(CFLAGS) $(CARD_TEST_FILES) studentCode/*.c  -o bin/cardTests

debugTest:
	$(CC)  $(CFLAGS) src/DebugTest.c  studentCode/*.c  -o bin/debugTest

calMemTest:
	$(CC)  $(CFLAGS) src/calMemTest.c studentCode/*.c  -o bin/calMemTest1
	$(CC)  $(CFLAGS) src/calMemTestPrint.c studentCode/*.c  -o bin/calMemTest2

calMemTestConst:
	$(CC)  $(CFLAGS) -DCONST_ERR=0 src/calMemTest.c studentCode/*.c  -o bin/calMemTestConst1
	$(CC)  $(CFLAGS) -DCONST_ERR=0 src/calMemTestPrint.c studentCode/*.c  -o bin/calMemTestConst2

clean:
	rm -rf bin/*
