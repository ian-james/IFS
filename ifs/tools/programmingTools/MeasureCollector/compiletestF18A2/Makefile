CC = gcc
CFLAGS = -Wall -g -Iinclude -IstudentInclude -std=c11
CARD_TEST_FILES = src/CardTest.c src/CardTestCreate.c src/CardTestOther.c src/CardTestUtilities.c src/CardTestWrite.c src/CardTestValidate.c src/CardTestA2Module3.c src/TestHarness2.c

UNAME := $(shell uname)

ifeq ($(UNAME), Linux)
	CCFLAGS += -std=gnu11 
endif
ifeq ($(UNAME), Darwin)
	CCFLAGS += -std=c11
endif

cardTests:  
	$(CC)  $(CFLAGS) $(CARD_TEST_FILES) studentCode/*.c  -o bin/cardTests

funcTest: cardTests
	bin/cardTests

leakTest: memTests
	valgrind --show-leak-kinds=all --leak-check=yes --track-origins=yes bin/memTest 1; \
	valgrind --show-leak-kinds=all --leak-check=yes --track-origins=yes bin/memTest 2; \
	valgrind --show-leak-kinds=all --leak-check=yes --track-origins=yes bin/memTest 3; \
	valgrind --show-leak-kinds=all --leak-check=yes --track-origins=yes bin/memTest 4; \
	valgrind --show-leak-kinds=all --leak-check=yes --track-origins=yes bin/memTestPrint 1; \
	valgrind --show-leak-kinds=all --leak-check=yes --track-origins=yes bin/memTestPrint 2; \
	valgrind --show-leak-kinds=all --leak-check=yes --track-origins=yes bin/memTestPrint 3; \
	valgrind --show-leak-kinds=all --leak-check=yes --track-origins=yes bin/memTestPrint 4

memTests:
	$(CC) $(CFLAGS) src/MemTests.c studentCode/*.c  -o bin/memTest; \
	$(CC) $(CFLAGS) src/MemTestsPrint.c studentCode/*.c  -o bin/memTestPrint

clean:
	rm -rf bin/*