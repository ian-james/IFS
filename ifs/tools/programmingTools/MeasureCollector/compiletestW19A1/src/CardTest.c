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



#define TESTS 62
#define GRADED_SECTION 25

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
   float weights[] = {	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
                        0, 0, 0, 0, 0, 0,   //DT
                        0,                  //vCard from RFC
                        0,                  //Groups
                        0, 0, 0,          //error handling
                        //0,                 //Print
                        0,                  //Print
                        0,                  //Delete
                        // 2, 2, 2, 2, 3, 2, 3, 3, 3, 3, 3, 3, 
                        // 2, 2, 2, 2, 2, 2,   //DT
                        // 4,                  //vCard from RFC
                        // 3,                  //Groups
                        // 5, 10, 10,          //error handling
                        // 5,                  //Print
                        // 5,                  //Print
                        // 5,                  //Delete
//************************************************************************
                        2,                  //Write NULL    
                        3,                  //Write minValid  
                        3,                  //Props vals
                        3,                  //Props params
                        4,                  //Props params
                        3,                  //Fn + text DT
                        3,3,3,              //Other DT writes
                        3,                  //UTC DT
                        4,                  //Card from RFC
//************************************************************************
                        4,                  //Null card, fn, and otherProps   
                        4,                  //Null prop name, group, values, parameters
                        2,                  //Missing prop value, 
                        2,                  //Unknown prop name
                        3,                  //bad PROP cardinality
                        3,                  //baf prop value cardinality
                        4,                  //Inconsistent DT struct
                        2,                  //Dup BD or anniversary
                        4,                  //Valid without DT
                        4,                  //Valid with DT
//************************************************************************
                        2,                  //Null / empty list (ListToJSON)
                        4,                  //ListToJSON

                        1,                  //NULL str (JSONtoList)
                        4,                  //JSONtoList

                        1,                  //NULL prop (PropToJSON)
                        2,                  //PropToJSON

                        1,                  //NULL str (JSONtoProp)
                        4,                  //JSONtoProp

                        1,                  //NULL DT (DTtoJSON)
                        3,                  //DTtoJSON

                        1,                  //NULL str (JSONtoDT)
                        4,                  //JSONtoDT

                        1,                  //NULL str (JSONtoCard)
                        2,                  //JSONtoCard

                        1,                  //NULL args (addProp)
                        2                   //addProp
   };  //More weights go here
    
    float totalScore = 0;
    int i = 0;
    for (i = 0; i < TESTS; i++){
        float score = (float)getScore(testRecords[i]);
        totalScore += weights[i]*score;
        
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

    // if (DEBUG) fprintf(OUT,"Test \n");
    // tmpRec = _tPrintCardErrorTest(testNo);
    // addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tPrintCardTests(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tDeleteCardTests(testNo);
    addTestResult(tmpRec);

    //************************* A2 test cases *************************

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


    //*********** Validate tests ************
    
    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tValidateTest1(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tValidateTest2(testNo);
    addTestResult(tmpRec);


    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tValidateTest31(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tValidateTest32(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tValidateTest33(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tValidateTest34(testNo);
    addTestResult(tmpRec);



    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tValidateTest4(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tValidateTest5(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tValidateTest6(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tValidateTest7(testNo);
    addTestResult(tmpRec);


    //*********** StrListToJSON *************
    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tTestStrListToJSONInv(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tTestStrListToJSON(testNo);
    addTestResult(tmpRec);

    //*********** JSONToStrList *************
    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tTestJSONToStrListInv(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tTestJSONToStrList(testNo);
    addTestResult(tmpRec);


    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tTestPropToJSONInv(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tTestPropToJSON(testNo);
    addTestResult(tmpRec);


    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tTestJSONToPropInv(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tTestJSONToProp(testNo);
    addTestResult(tmpRec);


    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tTestDTtoJSONInv(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tTestDTtoJSON(testNo);
    addTestResult(tmpRec);


    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tTestJSONtoDTInv(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tTestJSONtoDT(testNo);
    addTestResult(tmpRec);


    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tTestJSONtoCardInv(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tTestJSONtoCard(testNo);
    addTestResult(tmpRec);


    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tTestAddPropInv(testNo);
    addTestResult(tmpRec);

    if (DEBUG) fprintf(OUT,"Test \n");
    tmpRec = _tTestAddProp(testNo);
    addTestResult(tmpRec);


    int j;
    for(j=0; j<TESTS; j++)
    {
        
        if (j == 0) {
            printf("\n\nREGRESSION TESTING: ASSIGNMENT 1 FUNCTIONALITY\n");
        }

        printRecord(testRecords[j]);

        if (j == GRADED_SECTION-1) {
            printf("\n\nASSIGNMENT 2 TESTING\n");
        }
        //printf("\n");
    }
    
    printf("Score: %.0f\n", calcGrade());
    destroyRecords(testRecords, TESTS);
    
    return 0;
    
}
