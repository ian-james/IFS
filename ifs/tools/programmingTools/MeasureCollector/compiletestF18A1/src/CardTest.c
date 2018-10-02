#include <string.h>
#include <signal.h>
#include <stdlib.h>
#include <stdio.h>

#include <unistd.h>
#include <sys/types.h>
#include <errno.h>
#include <sys/wait.h>

#include "TestHarness.h"
#include "CardTestCases.h"



#define TESTS 16
#define DEBUG 0
#define OUT stdout

static int testNo;
static testRec * * testRecords;
static int studentScore;  //globals  required to handle segfaults gracefully
//------------ Something went wrong and student code segfaulted --------------

/*
static void segfaultCatcher(int signal,  siginfo_t* si, void *arg)
{
    printf("\n\n************** Code Segfaulted: Partial Report ********************\n");
    int j;
    for(j=0; j<TESTS; j++){
        if(testRecords[j] != NULL){
            printRecord(testRecords[j]);
        }
    }
    
    printf("*******************\nPARTIAL RESULTS\nProgram caused segfault\n*******************\n");
    printf("Partial Score:%d\n",studentScore);
    
    
    exit(EXIT_FAILURE);
}
*/
static void addTestResult(testRec* tmpRec){
    testRecords[testNo-1] = tmpRec;
    studentScore = studentScore + getScore(testRecords[testNo-1]);
    testNo++;
}

static float calcGrade(void){
    float weights[] = {	5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5 };  //More weights go here
    float totalScore = 0;
    int i = 0;
    for (i = 0; i < TESTS; i++){
        totalScore += weights[i]*(float)getScore(testRecords[i]);
        
    }
    return totalScore;
}

int main(void)
{
    studentScore = 0;
    testNo = 1;
    testRec* tmpRec = NULL;

    //record keeping array
    testRecords =  malloc(sizeof(testRec *)* TESTS);
    
    if(DEBUG) fprintf(OUT, "************** Testing Details ********************\n\n");
    
    
    //Create GEDCOM tests
    if (DEBUG) fprintf(OUT,"Testing vCard creation\n");
    
    if (DEBUG) fprintf(OUT,"Test 1\n");
    tmpRec = _tValidFileTest1(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test 2\n");
    tmpRec = _tValidFileTest2(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test 3\n");
    tmpRec = _tValidFileTest3(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test 4\n");
    tmpRec = _tValidFileTest4(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test 5\n");
    tmpRec = _tValidFileTest5(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test 6\n");
    tmpRec = _tValidFileTest6(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test 7\n");
    tmpRec = _tValidFileTest7(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test 8\n");
    tmpRec = _tValidFileTest8(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test 9\n");
    tmpRec = _tValidFileTest9(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test 10\n");
    tmpRec = _tValidFileTest10(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test 11\n");
    tmpRec = _tValidFileTest11(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test 12\n");
    tmpRec = _tValidFileTest12(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tInvalidFileTests(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tPrintCardErrorTest(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tPrintCardTests(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tDeleteCardTests(testNo);
    addTestResult(tmpRec);

        
    int j;
    for(j=0; j<TESTS; j++)
    {
        
        if (j == 0) {
            printf("\n\nASSIGNMENT 1 TESTING\n");
        }

        printRecord(testRecords[j]);
        //printf("\n");
    }
    
    printf("Score: %.0f\n", calcGrade());
    destroyRecords(testRecords, TESTS);
    
    return 0;
    
}
