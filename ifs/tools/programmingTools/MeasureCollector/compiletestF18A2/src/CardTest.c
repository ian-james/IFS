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



#define TESTS 38

#define DEBUG 0
#define OUT stdout

static int testNo;
static testRec * * testRecords;
static int studentScore;  //globals  required to handle segfaults gracefully

static void addTestResult(testRec* tmpRec){
    testRecords[testNo-1] = tmpRec;
    studentScore = studentScore + getScore(testRecords[testNo-1]);
    testNo++;
}

static float calcGrade(void){
   float weights[] = {	2, 2, 2, 2, 3, 2, 3, 3, 3, 3, 3, 3, 
                        2, 2, 2, 2, 2, 2,   //DT
                        4,                  //vCard from RFC
                        3,                  //Groups
                        5, 10, 10,          //error handling
                        5,                  //Print
                        5,                  //Print
                        5,                  //Delete
//************************************************************************
                        4,                  //Write NULL    
                        2,                  //Write minValid  
                        3,                  //Props vals
                        3,                  //Props params
                        4,                  //Props params
                        3,                  //Fn + text DT
                        3,3,3,              //Other DT writes
                        3,                  //UTC DT
                        5,                  //Card from RFC
//************************************************************************
                        4,                  //Null card, fn, and otherProps   
   };  //More weights go here
    
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

    if (DEBUG) fprintf(OUT,"Test 13\n");
    tmpRec = _tValidFileTest13(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test 14\n");
    tmpRec = _tValidFileTest14(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test 15\n");
    tmpRec = _tValidFileTest15(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test 16\n");
    tmpRec = _tValidFileTest16(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test 17\n");
    tmpRec = _tValidFileTest17(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test 18\n");
    tmpRec = _tValidFileTest18(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test 19\n");
    tmpRec = _tValidFileTest19(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test 20\n");
    tmpRec = _tValidFileTest20(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tInvalidFileTests(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tInvalidCardTests(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tInvalidPropTests(testNo);
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

    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tWriteTestNull(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tValidWriteTest1(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tValidWriteTest2(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tValidWriteTest3(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tValidWriteTest4(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tValidWriteTest5(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tValidWriteTest6(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tValidWriteTest7(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tValidWriteTest8(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tValidWriteTest9(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tValidWriteTest10(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tValidateTest1(testNo);
    addTestResult(tmpRec);




    int j;
    for(j=0; j<TESTS; j++)
    {
        
        if (j == 0) {
            printf("\n\nREGRESSION TESTING: ASSIGNMENT 1 FUNCTIONALITY\n");
        }

        printRecord(testRecords[j]);

         if (j == 25) {
            printf("\n\nASSIGNMENT 2 TESTING\n");
        }
        //printf("\n");
    }
    
    printf("Score: %.0f\n", calcGrade());
    destroyRecords(testRecords, TESTS);
    
    return 0;
    
}
