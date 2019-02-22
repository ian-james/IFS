#include "CalendarParser.h"

#include "CalTestCases.h"
#include <string.h>
#include <signal.h>
#include <stdlib.h>
#include <stdio.h>

#include <unistd.h>
#include <sys/types.h>
#include <errno.h>
#include <sys/wait.h>

#include "TestHarness.h"

#define TESTS 23
#define DEBUG 1
#define OUT stdout

int testNo;
testRec * * testRecords;
int studentScore;  //globals  required to handle segfaults gracefully

void addTestResult(testRec* tmpRec){
    testRecords[testNo-1] = tmpRec;
    studentScore = studentScore + getScore(testRecords[testNo-1]);
    testNo++;
}

float calcGrade(void){
    float weights[] = {3,3,3,3,3,3,3,3,4,4,4,5,5,
                        7,      //Print
                        8,      //Delete
                        5,      //Print error
                        4,      //inFile
                        5,      //inCal
                        2,      //inProdID
                        2,      //inWer
                        5,      //inEent
                        2,      //inDT
                        4,      //inAlm
    };
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

    //Create calendar
    if (DEBUG) fprintf(OUT,"Testing calendar creation...\n");
    // tmpRec = simpleCalTest(testNo);
    // addTestResult(tmpRec);

    // tmpRec = medCalTest(testNo);
    // addTestResult(tmpRec);

    // tmpRec = largeCalTest(testNo);
    // addTestResult(tmpRec);

    // tmpRec = foldedCalTest(testNo);
    // addTestResult(tmpRec);

    // tmpRec = megaCalTestRead(testNo);
    // addTestResult(tmpRec);

    tmpRec = _tValidFileTest1(testNo);
    addTestResult(tmpRec);

    tmpRec = _tValidFileTest2(testNo);
    addTestResult(tmpRec);

    tmpRec = _tValidFileTest3(testNo);
    addTestResult(tmpRec);

    tmpRec = _tValidFileTest4(testNo);
    addTestResult(tmpRec);

    tmpRec = _tValidFileTest5(testNo);
    addTestResult(tmpRec);

    tmpRec = _tValidFileTest6(testNo);
    addTestResult(tmpRec);

    tmpRec = _tValidFileTest7(testNo);
    addTestResult(tmpRec);

    tmpRec = _tValidFileTest8(testNo);
    addTestResult(tmpRec);

    tmpRec = _tValidFileTest9(testNo);
    addTestResult(tmpRec);
    
    tmpRec = _tValidFileTest10(testNo);
    addTestResult(tmpRec);
    
    tmpRec = _tValidFileTest11(testNo);
    addTestResult(tmpRec);

    tmpRec = _tValidFileTest12(testNo);
    addTestResult(tmpRec);

    tmpRec = _tValidFileTest13(testNo);
    addTestResult(tmpRec);


    //Print calendar
    if (DEBUG) fprintf(OUT,"Testing printCalendar...\n");
    tmpRec = _tPrintCalTest(testNo);
    addTestResult(tmpRec);

    //Delete calendar - test for crashes
    if (DEBUG) fprintf(OUT,"Testing deleteCalendar...\n");
    tmpRec = _tDeleteCalTest(testNo);
    addTestResult(tmpRec);

    //Print error test
    if (DEBUG) fprintf(OUT,"Testing printError...\n");
    tmpRec = _tPrintErrTest(testNo);
    addTestResult(tmpRec);

    //Test file error handling
    if (DEBUG) fprintf(OUT,"Testing file error handling...\n");
    tmpRec = _tInvFileTest(testNo);
    addTestResult(tmpRec);

    //Test invalid calendars
    if (DEBUG) fprintf(OUT,"Testing invalid caledar object...\n");
    tmpRec = _tInvCalTest(testNo);
    addTestResult(tmpRec);

    tmpRec = _tInvProdIDTest(testNo);
    addTestResult(tmpRec);    
    
    tmpRec = _tInvVerTest(testNo);
    addTestResult(tmpRec);

    //Test invalid events
    if (DEBUG) fprintf(OUT,"Testing caledar object with invalid events...\n");
    tmpRec = _tInvEvtTest(testNo);
    addTestResult(tmpRec);

    tmpRec = _tInvDTTest(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Testing caledar object with invalid events...\n");
    tmpRec = _tInvAlmTest(testNo);
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
    //fclose(output);
    
    printf("Score: %.0f/90\n", calcGrade());
    
    return 0;
    
}



