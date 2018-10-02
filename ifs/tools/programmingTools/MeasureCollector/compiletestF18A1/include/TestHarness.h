#ifndef _TEST_HARNESS_
#define _TEST_HARNESS_

#include <string.h>
#include <signal.h>
#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>

#include <unistd.h>
#include <sys/types.h>
#include <errno.h>
#include <sys/wait.h>

#define RED   "\x1B[31m"
#define GRN   "\x1B[32m"
#define RESET "\x1B[0m"

#define SUCCESS 1
#define FAIL 0

typedef int testResult;

typedef struct {
    testResult passed;
    char* feedback;
} SubTestRec;

typedef struct testRecord
{
	int numSubs;
	int testNum;
	int subsPassed;

	char ** feedback;
	int feedbackLen;
}testRec;

SubTestRec getSubDataFromChild(int* pipefd);
void sendSubDataToParent(int* pipefd, SubTestRec* tmpRec);
void runSubTest(int testNum, int subTest, testRec* rec, SubTestRec (*testFunc)(int, int));
void runSubTestWithFile(int testNum, int subTest, testRec* rec, char* fileName, SubTestRec (*testFunc)(int, int, char* fileName));
void runSubTestWithFileAndObj(int testNum, int subTest, testRec* rec, char* fileName, void* obj, SubTestRec (*testFunc)(int, int, char*fileName, void* obj));
testRec * initRec(int testNum, int numSubs, char * header);
void addResult( testRec * rec, testResult res, char * add);
SubTestRec createSubResult(testResult res, char* feedback);
void printRecord (testRec * rec);
int getScore(testRec * rec);
void destroyRecords(testRec ** testRecords, int size);
void destroyRecord(testRec * tmp);

#endif

