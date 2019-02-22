#include "LinkedListAPI.h"
#include "CalTestUtilities.h"
#include "CalTestObjects.h"

#include <string.h>
#include <signal.h>
#include <stdlib.h>
#include <stdio.h>
#include <ctype.h>

#include <unistd.h>
#include <sys/types.h>
#include <errno.h>
#include <sys/wait.h>

static char * errVals[] = {
        "OK", "INV_FILE", "INV_CAL", "INV_VER", "DUP_VER", "INV_PRODID", "DUP_PRODID", "INV_EVENT", "INV_DT", "INV_ALARM", "WRITE_ERROR", "OTHER_ERROR"
};

static char* _tPrintError(ICalErrorCode err){
    return errVals[err];
}


//******************************** TEST CASES ********************************

static SubTestRec _tCreateCalTestGeneric(int testNum, int subTest, char* fileName, void* obj){
    SubTestRec result;
    char feedback[300];
    
    Calendar* testCal;
    Calendar* refCal = (Calendar*)obj;

    ICalErrorCode err = createCalendar(fileName, &testCal);

    if (err != OK){
        sprintf(feedback, "Subtest %d.%d: Did not return OK (returned %s) when parsing a valid file (%s).",testNum,subTest,_tPrintError(err), fileName);
        result = createSubResult(FAIL, feedback);
        return result;
    }

    if (_tCalEqual(testCal, refCal)){
        sprintf(feedback, "Subtest %d.%d: file %s parsed correctly",testNum,subTest,fileName);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: did not correctly parse a valid file - created object does not match the reference object",testNum,subTest);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

static testRec* _tValidFileTestGeneric(int testNum, char fileName[], Calendar* refObj, int weight){
    const int numSubs = 1;  //doesn't need to be a variable but its a handy place to keep it
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (%d%%): Testing createCalendar. Creating vCard object from a valid file (%s)", testNum, weight, fileName);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTestWithFileAndObj(testNum, subTest, rec, fileName, refObj, &_tCreateCalTestGeneric);
    return rec;
}

testRec* _tValidFileTest1(int testNum){

    return _tValidFileTestGeneric(testNum, "testFiles/validCalendar/testCalSimpleNoUTC.ics", _tSimpleCalendar(), 3);
}

testRec* _tValidFileTest2(int testNum){

    return _tValidFileTestGeneric(testNum, "testFiles/validCalendar/testCalSimpleUTC.ics", _tSimpleCalendarUTC(), 3);
}

testRec* _tValidFileTest3(int testNum){

    return _tValidFileTestGeneric(testNum, "testFiles/validCalendar/testCalSimpleUTCComments.ics", _tSimpleCalendarUTC(), 3);
}

testRec* _tValidFileTest4(int testNum){
    return _tValidFileTestGeneric(testNum, "testFiles/validCalendar/testCalEvtProp.ics", _tEvtPropCalendar(), 3);
}

testRec* _tValidFileTest5(int testNum){
    return _tValidFileTestGeneric(testNum, "testFiles/validCalendar/testCalProp.ics", _tSimpleCalendarProps(), 3);
}

testRec* _tValidFileTest6(int testNum){
    return _tValidFileTestGeneric(testNum, "testFiles/validCalendar/testCalEvts.ics", _tMultiEventCalendar(), 3);
}

testRec* _tValidFileTest7(int testNum){
    return _tValidFileTestGeneric(testNum, "testFiles/validCalendar/testCalEvtPropAlm.ics", _tAlmPropCalendar(), 3);
}

testRec* _tValidFileTest8(int testNum){
    return _tValidFileTestGeneric(testNum, "testFiles/validCalendar/mLineProp1.ics", _tFoldedCalendar1(), 3);
}

testRec* _tValidFileTest9(int testNum){
    return _tValidFileTestGeneric(testNum, "testFiles/validCalendar/mLinePropTab1.ics", _tFoldedCalendar1(), 4);
}

testRec* _tValidFileTest10(int testNum){
    return _tValidFileTestGeneric(testNum, "testFiles/validCalendar/testCalEvtPropAlm3.ics", _tFoldedCalendar3(), 4);
}

testRec* _tValidFileTest11(int testNum){
    return _tValidFileTestGeneric(testNum, "testFiles/validCalendar/mLineTab1.ics", _tFoldedCalendar2(), 4);
}

testRec* _tValidFileTest12(int testNum){
    return _tValidFileTestGeneric(testNum, "testFiles/validCalendar/megaCal1.ics", _tMegaCal(), 5);
}

testRec* _tValidFileTest13(int testNum){
    return _tValidFileTestGeneric(testNum, "testFiles/validCalendar/megaCalFolded1.ics", _tMegaLineFolding(), 5);
}

//********************* Test printCalendar ***********************
//Printing creation - testCalSimpleUTCComments.ics
static SubTestRec _tPrintCalTest1(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    char fileName[] = "testFiles/validCalendar/testCalEvtPropAlm1.ics";

    Calendar* testCal;

    ICalErrorCode err = createCalendar(fileName, &testCal);

    if (err != OK){
        sprintf(feedback, "Subtest %d.%d: Unable to test ptrintCalendar due to failure of createCalendar to parse a valid file (%s).",testNum,subTest, fileName);
        result = createSubResult(FAIL, feedback);
        return result;
    }

    char* calStr = printCalendar(testCal);
    //fprintf(stderr, "%s\n", calStr);
    if(calStr != NULL && strlen(calStr) > 0)
    {
        sprintf(feedback, "Subtest %d.%d: Printed calendar.",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
    else
    {
        sprintf(feedback, "Subtest %d.%d: printCalendar returned null or empty string for a Calendar object created by createCalendar() from a valid file (%s)",testNum,subTest,fileName);
        result = createSubResult(FAIL, feedback);
        return result;
    }
    free(calStr);

}

static SubTestRec _tPrintCalTest2(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];

    Calendar* testObj = _tSimpleCalendarProps();
    
    char* calStr = printCalendar(testObj);
  //  fprintf(stderr, "%s\n", calStr);
    if(calStr != NULL && strlen(calStr) > 0)
    {
        sprintf(feedback, "Subtest %d.%d: Printed a vallid non-NULL reference Calendar object.",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
    else
    {
        sprintf(feedback, "Subtest %d.%d: printCalendar returned null or empty string for a valid non-NULL reference Calendar object",testNum,subTest);
        result = createSubResult(FAIL, feedback);
        return result;
    }
    free(calStr);
    
}

static SubTestRec _tPrintCalTest3(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];

    char* calStr = printCalendar(NULL);

    if(calStr == NULL || calStr != NULL )
    {
        sprintf(feedback, "Subtest %d.%d: NULL calendar handled correctly.",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
    else
    {
        sprintf(feedback, "Subtest %d.%d: printCalendar did not handle empty calendar correctly",testNum,subTest);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

testRec* _tPrintCalTest(int testNum){
    const int numSubs = 3;  //doesn't need to be a variable but its a handy place to keep it
    int subTest = 1;
    char feedback[300];

    sprintf(feedback, "Test %d (7%%): Printing calendar", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);

    runSubTest(testNum, subTest, rec, &_tPrintCalTest1);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tPrintCalTest2);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tPrintCalTest3);
    
    return rec;
}
//***************************************************************




//********************* Test deleteCalendar **********************
static SubTestRec _tDeleteCalTest1(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    char fileName[] = "testFiles/validCalendar/testCalSimpleUTC.ics";

    Calendar* testCal;
    ICalErrorCode err = createCalendar(fileName, &testCal);

    if (err != OK){
        sprintf(feedback, "Subtest %d.%d: Unable to test deleteCalendar due to failure of createCalendar to open a valid file (%s).",testNum,subTest, fileName);
        result = createSubResult(FAIL, feedback);
        return result;
    }

    deleteCalendar(testCal);

    sprintf(feedback, "Subtest %d.%d: simple calendar deleted with no crashes",testNum,subTest);
    result = createSubResult(SUCCESS, feedback);
    return result;
}

static SubTestRec _tDeleteCalTest2(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    char fileName[] = "testFiles/validCalendar/testCalEvtProp.ics";


    Calendar* testCal;
    ICalErrorCode err = createCalendar(fileName, &testCal);

    if (err != OK){
        sprintf(feedback, "Subtest %d.%d: Unable to test deleteCalendar due to failure of createCalendar to open a valid file (%s).",testNum,subTest, fileName);
        result = createSubResult(FAIL, feedback);
        return result;
    }

    deleteCalendar(testCal);

    sprintf(feedback, "Subtest %d.%d: calendar with event properties deleted with no crashes",testNum,subTest);
    result = createSubResult(SUCCESS, feedback);
    return result;
}

static SubTestRec _tDeleteCalTest3(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    

    Calendar* testCal = _tSimpleCalendar();

    deleteCalendar(testCal);

    sprintf(feedback, "Subtest %d.%d: Reference card object deleted with no crashes",testNum,subTest);
    result = createSubResult(SUCCESS, feedback);
    return result;
}

static SubTestRec _tDeleteCalTest4(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    

    Calendar* testCal = _tAlmPropCalendar();

    deleteCalendar(testCal);

    sprintf(feedback, "Subtest %d.%d: Reference card object deleted with no crashes",testNum,subTest);
    result = createSubResult(SUCCESS, feedback);
    return result;
}

testRec* _tDeleteCalTest(int testNum){
    const int numSubs = 4;  //doesn't need to be a variable but its a handy place to keep it
    int subTest = 1;
    char feedback[300];

    sprintf(feedback, "Test %d (8%%): Calendar deletion.  NOTE: see valgrind output for deletion memory leak report", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);

    runSubTest(testNum, subTest, rec, &_tDeleteCalTest1);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tDeleteCalTest2);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tDeleteCalTest3);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tDeleteCalTest4);
    return rec;
}
//***************************************************************


//********************** Test printError ************************

static SubTestRec _tPrintErrorTest1(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];

    for (int i = 0; i < 11; i++){
        char* errStr = (void*) printError(i);
        //printf("String %s\n", errStr);
        if (errStr == NULL){
            sprintf(feedback, "Subtest %d.%d: printError returns NULL for error code %s",testNum,subTest,_tPrintError(i));
            result = createSubResult(FAIL, feedback);
            return result;
        }

        if (strlen(errStr) == 0){
            sprintf(feedback, "Subtest %d.%d: printError returns an empty string for error code %s",testNum,subTest,_tPrintError(i));
            result = createSubResult(FAIL, feedback);
            return result;
        }
    }

    sprintf(feedback, "Subtest %d.%d: printError successfully created strings for all error codes ",testNum,subTest);
    result = createSubResult(SUCCESS, feedback);
    return result;
}

testRec* _tPrintErrTest(int testNum){
    const int numSubs = 1;  //doesn't need to be a variable but its a handy place to keep it
    int subTest = 1;
    char feedback[300];

    sprintf(feedback, "Test %d (5%%): Testing printError", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);

    runSubTest(testNum, subTest, rec, &_tPrintErrorTest1);
    return rec;
}

//***************************************************************

//*********** Error handling - invalid file ***********

//Non-existent file
static SubTestRec _tInvFileTest1(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    Calendar* testCal;
    char fileName[] = "testFiles/iDoNotExist.ics";

    ICalErrorCode err = createCalendar(fileName, &testCal);

    if (err == INV_FILE){
        sprintf(feedback, "Subtest %d.%d: Reading non-existent file (%s) .",testNum,subTest, fileName);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: incorrect error code for non-existent file (%s)",testNum,subTest, fileName);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

//Incorrect extension
static SubTestRec _tInvFileTest2(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    Calendar* testCal;
    char fileName[] = "testFiles/validCalendar/testCalSimpleUTC.foo";

    ICalErrorCode err = createCalendar(fileName, &testCal);

    if (err == INV_FILE){
        sprintf(feedback, "Subtest %d.%d: incorrect file extension (%s).",testNum,subTest, fileName);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: incorrect error code for file with incorrect extesnion(%s)",testNum,subTest, fileName);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

//Invalid line endings
static SubTestRec _tInvFileTest3(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    Calendar* testCal;
    char fileName[] = "testFiles/invCalendar/invLineEnding.ics";

    ICalErrorCode err = createCalendar(fileName, &testCal);

    if (err == INV_FILE || err == INV_CAL){
        sprintf(feedback, "Subtest %d.%d: file with invalid line endings.",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: incorrect error code (%s) for file with invalid line endings.",testNum,subTest, _tPrintError(err));
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

//Null name
static SubTestRec _tInvFileTest4(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    Calendar* testCal;

    ICalErrorCode err = createCalendar(NULL, &testCal);

    if (err == INV_FILE){
        sprintf(feedback, "Subtest %d.%d: NULL file name.",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: incorrect error code for NULL file name",testNum,subTest);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

testRec* _tInvFileTest(int testNum){
    const int numSubs = 4;  //doesn't need to be a variable but its a handy place to keep it
    int subTest = 1;
    char feedback[300];

    sprintf(feedback, "Test %d (4%%): Creating a calendar object from an invalid file", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);

    runSubTest(testNum, subTest, rec, &_tInvFileTest1);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tInvFileTest2);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tInvFileTest3);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tInvFileTest4);
    return rec;
}
//***************************************************************

//*********** Error handling - invalid calendar ***********
static SubTestRec _tInvCalTest1(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    Calendar* testCal;
    char fileName[] = "testFiles/invCalendar/invCalObject.ics";

    ICalErrorCode err = createCalendar(fileName, &testCal);

    if (err == INV_CAL){
        sprintf(feedback, "Subtest %d.%d: correctly handled invalid calendar object (non-iCal contents).",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: incorrect error %s code for invalid calendar object",testNum,subTest,_tPrintError(err));
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

static SubTestRec _tInvCalTest2(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    Calendar* testCal;
    char fileName[] = "testFiles/invCalendar/missingEndCal.ics";

    ICalErrorCode err = createCalendar(fileName, &testCal);

    if (err == INV_CAL){
        sprintf(feedback, "Subtest %d.%d: correctly handled invalid calendar object (missing END:VCALENDAR).",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: incorrect error code (%s) for invalid calendar object (missing END:VCALENDAR)",testNum,subTest, _tPrintError(err));
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

static SubTestRec _tInvCalTest3(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    Calendar* testCal;
    char fileName[] = "testFiles/invCalendar/missingProdID.ics";

    ICalErrorCode err = createCalendar(fileName, &testCal);

    if (err == INV_CAL){
        sprintf(feedback, "Subtest %d.%d: correctly handled invalid calendar object (missing PRODID).",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: incorrect error code (%s) for invalid calendar object (missing PRODID)",testNum,subTest, _tPrintError(err));
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

static SubTestRec _tInvCalTest4(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    Calendar* testCal;
    char fileName[] = "testFiles/invCalendar/missingVER.ics";

    ICalErrorCode err = createCalendar(fileName, &testCal);

    if (err == INV_CAL){
        sprintf(feedback, "Subtest %d.%d: correctly handled invalid calendar object (missing VER).",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: incorrect error code (%s) for invalid calendar object (missing VER)",testNum,subTest, _tPrintError(err));
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

static SubTestRec _tInvCalTest5(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    Calendar* testCal;
    char fileName[] = "testFiles/invCalendar/dupPRODID.ics";

    ICalErrorCode err = createCalendar(fileName, &testCal);

    if (err == DUP_PRODID){
        sprintf(feedback, "Subtest %d.%d: correctly handled invalid calendar object (duplicate PRODID).",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: incorrect error code (%s) for invalid calendar object (duplicate PRODID)",testNum,subTest,_tPrintError(err));
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

static SubTestRec _tInvCalTest6(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    Calendar* testCal;
    char fileName[] = "testFiles/invCalendar/dupVER.ics";

    ICalErrorCode err = createCalendar(fileName, &testCal);

    if (err == DUP_VER){
        sprintf(feedback, "Subtest %d.%d: correctly handled invalid calendar object (duplicate VERSION).",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: incorrect error code (%s) for invalid calendar object (duplicate VERSION)",testNum,subTest,_tPrintError(err));
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

static SubTestRec _tInvCalTest7(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    Calendar* testCal;
    char fileName[] = "testFiles/invCalendar/malfPRODID.ics";

    ICalErrorCode err = createCalendar(fileName, &testCal);

    if (err == INV_PRODID){
        sprintf(feedback, "Subtest %d.%d: correctly handled invalid calendar object (invalid PRODID).",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: incorrect error code (%s) for invalid calendar object (invalid PRODID)",testNum,subTest,_tPrintError(err));
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

static SubTestRec _tInvCalTest8(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    Calendar* testCal;
    char fileName[] = "testFiles/invCalendar/malfVER.ics";

    ICalErrorCode err = createCalendar(fileName, &testCal);

    if (err == INV_VER){
        sprintf(feedback, "Subtest %d.%d: correctly handled invalid calendar object (invalid VERSION).",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: incorrect error code (%s) for invalid calendar object (invalid VERSION)",testNum,subTest, _tPrintError(err));
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

static SubTestRec _tInvCalTest9(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    Calendar* testCal;
    char fileName[] = "testFiles/invCalendar/noEVT.ics";

    ICalErrorCode err = createCalendar(fileName, &testCal);

    if (err == INV_CAL){
        sprintf(feedback, "Subtest %d.%d: correctly handled invalid calendar object (missing EVENT).",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: incorrect error code (%s) for invalid calendar object (missing EVENT)",testNum,subTest, _tPrintError(err));
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

testRec* _tInvCalTest(int testNum){
    const int numSubs = 5;  //doesn't need to be a variable but its a handy place to keep it
    int subTest = 1;
    char feedback[300];

    sprintf(feedback, "Test %d (5%%): Creating a Calendar object from files with invalid caldendars (expecting INV_CAL) ", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);

    runSubTest(testNum, subTest, rec, &_tInvCalTest1);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tInvCalTest2);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tInvCalTest3);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tInvCalTest4);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tInvCalTest9);
    return rec;
}

testRec* _tInvProdIDTest(int testNum){
    const int numSubs = 2;
    int subTest = 1;
    char feedback[300];

    sprintf(feedback, "Test %d (2%%): Creating a Calendar object from files with invalid caldendars (expecting DUP_PRODID and INV_PRODID)", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);

    runSubTest(testNum, subTest, rec, &_tInvCalTest5);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tInvCalTest7);
    
    return rec;
}

testRec* _tInvVerTest(int testNum){
    const int numSubs = 2;
    int subTest = 1;
    char feedback[300];

    sprintf(feedback, "Test %d (2%%): Creating a Calendar object from files with invalid caldendars (expecting DUP_VER and INV_VER)", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);

    runSubTest(testNum, subTest, rec, &_tInvCalTest6);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tInvCalTest8);
    
    return rec;
}

//*********** Error handling - invalid event ***********
static SubTestRec _tInvEvtTest1(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    Calendar* testCal;
    char fileName[] = "testFiles/invEvent/missingUID.ics";

    ICalErrorCode err = createCalendar(fileName, &testCal);

    if (err == INV_EVENT){
        sprintf(feedback, "Subtest %d.%d: correctly handled invalid event (missing UID).",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: incorrect error code (%s) for invalid event (missing UID).",testNum,subTest,_tPrintError(err));
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

static SubTestRec _tInvEvtTest2(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    Calendar* testCal;
    char fileName[] = "testFiles/invEvent/missingDTSTAMP.ics";

    ICalErrorCode err = createCalendar(fileName, &testCal);

    if (err == INV_EVENT){
        sprintf(feedback, "Subtest %d.%d: correctly handled invalid event (missing DTSTAMP).",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: incorrect error code (%s) for invalid event (missing DTSTAMP).",testNum,subTest,_tPrintError(err));
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

static SubTestRec _tInvEvtTest3(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    Calendar* testCal;
    char fileName[] = "testFiles/invEvent/invDT1.ics";

    ICalErrorCode err = createCalendar(fileName, &testCal);

    if (err == INV_DT){
        sprintf(feedback, "Subtest %d.%d: correctly handled malformed DTSTAMP (inv. date).",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: incorrect error code (%s) for malformed DTSTAMP (inv. date).",testNum,subTest,_tPrintError(err));
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

static SubTestRec _tInvEvtTest4(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    Calendar* testCal;
    char fileName[] = "testFiles/invEvent/invDT2.ics";

    ICalErrorCode err = createCalendar(fileName, &testCal);

    if (err == INV_DT){
        sprintf(feedback, "Subtest %d.%d: correctly handled malformed DTSTAMP (missing T separator).",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: incorrect error code (%s) for malformed DTSTAMP (missing T separator).",testNum,subTest,_tPrintError(err));
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

static SubTestRec _tInvEvtTest5(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    Calendar* testCal;
    char fileName[] = "testFiles/invEvent/invEvtProp1.ics";

    ICalErrorCode err = createCalendar(fileName, &testCal);

    if (err == INV_EVENT){
        sprintf(feedback, "Subtest %d.%d: correctly handled malformed event property (missing name).",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: incorrect error code (%s) for malformed event property (missing name).",testNum,subTest,_tPrintError(err));
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

static SubTestRec _tInvEvtTest6(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    Calendar* testCal;
    char fileName[] = "testFiles/invEvent/invEvtProp2.ics";

    ICalErrorCode err = createCalendar(fileName, &testCal);

    if (err == INV_EVENT){
        sprintf(feedback, "Subtest %d.%d: correctly handled malformed event property (missing descr).",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: incorrect error code (%s) for malformed event property (missing descr).",testNum,subTest,_tPrintError(err));
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

static SubTestRec _tInvEvtTest7(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    Calendar* testCal;
    char fileName[] = "testFiles/invEvent/randomBegin.ics";

    ICalErrorCode err = createCalendar(fileName, &testCal);

    if (err == INV_EVENT){
        sprintf(feedback, "Subtest %d.%d: correctly handled malformed event (stray BEGIN:EVENT tag inside event).",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: incorrect error code (%s) for malformed event property (missing descr).",testNum,subTest,_tPrintError(err));
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

testRec* _tInvEvtTest(int testNum){
    const int numSubs = 5;  //doesn't need to be a variable but its a handy place to keep it
    int subTest = 1;
    char feedback[300];

    sprintf(feedback, "Test %d (5%%): Parsing a file with an invalid event (misc errors, expecting INV_EVENT)", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);

    runSubTest(testNum, subTest, rec, &_tInvEvtTest1);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tInvEvtTest2);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tInvEvtTest5);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tInvEvtTest6);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tInvEvtTest7);

    return rec;
}

testRec* _tInvDTTest(int testNum){
    const int numSubs = 2;  //doesn't need to be a variable but its a handy place to keep it
    int subTest = 1;
    char feedback[300];

    sprintf(feedback, "Test %d (2%%): Parsing a file with an invalid date-time (expecting INV_DT)", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);

    runSubTest(testNum, subTest, rec, &_tInvEvtTest3);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tInvEvtTest4);
    subTest++;
    
    return rec;
}

//***************************************************************


//*********** Error handling - invalid alarm ***********
static SubTestRec _tInvAlmTest1(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    Calendar* testCal;
    char fileName[] = "testFiles/invAlarm/invAmlNoAction.ics";

    ICalErrorCode err = createCalendar(fileName, &testCal);

    if (err == INV_ALARM){
        sprintf(feedback, "Subtest %d.%d: correctly handled malformed alarm (missing action).",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: incorrect error code (%s) for malformed malformed alarm (missing action).",testNum,subTest,_tPrintError(err));
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

static SubTestRec _tInvAlmTest2(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    Calendar* testCal;
    char fileName[] = "testFiles/invAlarm/invAmlNoTrigger.ics";

    ICalErrorCode err = createCalendar(fileName, &testCal);

    if (err == INV_ALARM){
        sprintf(feedback, "Subtest %d.%d: correctly handled malformed alarm (missing trigger).",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: incorrect error code (%s) for malformed malformed alarm (missing trigger).",testNum,subTest,_tPrintError(err));
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

static SubTestRec _tInvAlmTest3(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    Calendar* testCal;
    char fileName[] = "testFiles/invAlarm/invAlmProp1.ics";

    ICalErrorCode err = createCalendar(fileName, &testCal);

    if (err == INV_ALARM){
        sprintf(feedback, "Subtest %d.%d: correctly handled malformed alarm property (missing name).",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: incorrect error code (%s) for malformed alarm property property (missing name).",testNum,subTest,_tPrintError(err));
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

static SubTestRec _tInvAlmTest4(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    Calendar* testCal;
    char fileName[] = "testFiles/invAlarm/invAlmProp2.ics";

    ICalErrorCode err = createCalendar(fileName, &testCal);

    if (err == INV_ALARM){
        sprintf(feedback, "Subtest %d.%d: correctly handled malformed alarm property (missing descr).",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: incorrect error code (%s) for malformed alarm property (missing descr).",testNum,subTest,_tPrintError(err));
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

testRec* _tInvAlmTest(int testNum){
    const int numSubs = 4;  //doesn't need to be a variable but its a handy place to keep it
    int subTest = 1;
    char feedback[300];

    sprintf(feedback, "Test %d (4%%): Parsing a file with an invalid alarm (expecting INV_ALARM)", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);

    runSubTest(testNum, subTest, rec, &_tInvAlmTest1);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tInvAlmTest2);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tInvAlmTest3);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tInvAlmTest4);

    return rec;
}

