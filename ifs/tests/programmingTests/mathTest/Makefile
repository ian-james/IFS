CC          =	gcc
# Flags that are sent to the compiler

CFLAGS      =	-Wall -std=c99 -pedantic -g 
INCLUDES = -I


# NOte this  command doesn't actually build all, it build the main program only, ie not the tests.
prog : mathTest.o mathFunc.o
	$(CC) mathFunc.o mathTest.o -o mathFuncs 

mathTest.o: mathTest.c
	$(CC) $(CFLAGS) $(INCLUDES) -c mathTest.c -o mathTest.o  -lm

mathFunc.o: mathFunc.c
	$(CC) $(CFLAGS) $(INCLUDES) -c mathFunc.c -o mathFunc.o -lm 

# This is another make command, run: make clean and it removes *.o and programs.
# You can make similar commands to perform different common actions.
clean:
	@ rm *.o 
