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

#define TESTS 24
#define DEBUG 1
#define OUT stdout

int testNo;
testRec * * testRecords;
int studentScore;  //globals  required to handle segfaults gracefully

//------------ Something went wrong and student code segfaulted --------------
// static void segfaultCatcher(int signal,  siginfo_t* si, void *arg)
// {
//     printf("\n\n************** Code Segfaulted: Partial Report ********************\n");
//     int j;
//     for(j=0; j<TESTS; j++){
//         if(testRecords[j] != NULL){
//             printRecord(testRecords[j]);
//         }
//     }
    
//     printf("*******************\nPARTIAL RESULTS\nProgram caused segfault\n*******************\n");
//     printf("Partial Score:%d\n",studentScore);
    
    
//     exit(EXIT_FAILURE);
// }

void addTestResult(testRec* tmpRec){
    testRecords[testNo-1] = tmpRec;
    studentScore = studentScore + getScore(testRecords[testNo-1]);
    testNo++;
}

float calcGrade(void){
    float weights[] = {0,0,0,0,0,0,0,0,0,0,0,
                        0,      //Print
                        0,      //Delete
                        0,      //Print error
                        0,      //inFile
                        0,      //inCal
                        0,      //inProdID
                        0,      //iner
                        0,      //inEent
                        0,      //inDT
                        0,      //inAlm
                        15,15,5};
    float totalScore = 0;
    int i = 0;
    for (i = 0; i < TESTS; i++){
        totalScore += weights[i]*(float)getScore(testRecords[i]);
        if (i < 10) {
            if (getScore(testRecords[i]) == 0) {
                totalScore -= 2;
            }
        }
    }
    return totalScore;
}

int main(void)
{
    
    studentScore = 0;
    testNo = 1;
    testRec* tmpRec = NULL;
    // struct sigaction segfaultSignaler;
    // set up the segfault handler
    // memset(&segfaultSignaler, 0, sizeof(struct sigaction));
    // sigemptyset(&segfaultSignaler.sa_mask);
    // segfaultSignaler.sa_sigaction = segfaultCatcher;
    // segfaultSignaler.sa_flags = SA_SIGINFO;
    // sigaction(SIGSEGV, &segfaultSignaler, NULL);
    
    
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



    //MARK: ASSIGNMENT 2 ADDITIONS

    //testNo++;
    // if (DEBUG) fprintf(OUT, "Testing Invalid Props...\n");
    // tmpRec = paramsTest(testNo);

    // //return 0;
    // addTestResult(tmpRec);


    if (DEBUG) fprintf(OUT, "Testing Validate Function...\n");
    tmpRec = validateTest(testNo);

    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT, "Testing output Function...\n");
    tmpRec = outputTest(testNo);

    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT, "Testing megaCal...\n");
    tmpRec = megaCalTestWrite(testNo);

    addTestResult(tmpRec);


    int j;
    for(j=0; j<TESTS; j++)
    {

        if (j == 0) {
            printf("REGRESSION TESTING (2%% deduction for any test that fails)\n");
        }

        if (j == TESTS-3) {
            printf("\n\nASSIGNMENT 2 TESTING\n");
        }

        printRecord(testRecords[j]);
        //printf("\n");
    }
    //fclose(output);
    
    printf("Score: %.0f/50\n", calcGrade());
    
    return 0;
    
}



