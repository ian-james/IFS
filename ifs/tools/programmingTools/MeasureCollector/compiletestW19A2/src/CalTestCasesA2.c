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

/* ****************************** writeCalendar() - invalid args ****************************** */

static SubTestRec _tWInvTest1(int testNum, int subTest) {
    SubTestRec result;
     char feedback[6000];
    char filename[] = "testFiles/validCalendar/testCalSimpleUTC.ics";   

    ICalErrorCode err = writeCalendar(filename, NULL);
    
    if (err != WRITE_ERROR) {
        sprintf(feedback, "Subtest %d.%d: Did not return WRITE_ERROR (returned %s) when trying to save a NULL Calendar with a valid file name (%s).", testNum, subTest, _tPrintError(err),  filename);
        result = createSubResult(FAIL, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: correctly handled a NULL Calendar with a valid file name",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
}

static SubTestRec _tWInvTest2(int testNum, int subTest) {
    SubTestRec result;
     char feedback[6000];
    Calendar* testCal = _tSimpleCalendar();

    ICalErrorCode err = writeCalendar(NULL, testCal);
    
    if (err != WRITE_ERROR) {
        sprintf(feedback, "Subtest %d.%d: Did not return WRITE_ERROR (returned %s) when trying to save a valid Calendar with a NULL file name.", testNum, subTest, _tPrintError(err));
        result = createSubResult(FAIL, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: correctly handled a valid Calendar with a NULL file name",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
}

static SubTestRec _tWInvTest3(int testNum, int subTest) {
    SubTestRec result;
     char feedback[6000];

    ICalErrorCode err = writeCalendar(NULL, NULL);
    
    if (err != WRITE_ERROR) {
        sprintf(feedback, "Subtest %d.%d: Did not return WRITE_ERROR (returned %s) when trying to save a NULL Calendar with a NULL file name.", testNum, subTest, _tPrintError(err));
        result = createSubResult(FAIL, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: correctly handled a NULL Calendar with a NULL file name",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
}

testRec* _tWriteTestInvArgs(int testNum) {
    const int numSubs = 3;
    int subTest = 1;
    char feedback[3000];

    sprintf(feedback, "Test %d (3%%): Testing writeCalendar() with invalid arguments", testNum);
    testRec* rec = initRec(testNum, numSubs, feedback);


    runSubTest(testNum, subTest, rec, &_tWInvTest1);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tWInvTest2);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tWInvTest3);

    return rec;
}

/* ****************************** writeCalendar() - valid args ****************************** */
static SubTestRec _tWriteCalendarTestGeneric(int testNum, int subTest, char* outName, void* obj) {
    SubTestRec result;
     char feedback[6000];
    char* filename = outName;

    Calendar* refObj = (Calendar*)obj;
    Calendar* testObj;

    ICalErrorCode err = writeCalendar(filename, refObj);

    if (err != OK){
        sprintf(feedback, "Subtest %d.%d: Did not return OK when writing a valid Calendar to file (returned %s).", testNum, subTest, _tPrintError(err));
        result = createSubResult(FAIL, feedback);
        return result;
    }

    err = createCalendar(filename, &testObj);

    if (err != OK) {
        sprintf(feedback, "Subtest %d.%d: Did not return OK (returned %s) when parsing a file created by writeCalendar() from a valid reference object.", testNum, subTest, _tPrintError(err));
        result = createSubResult(FAIL, feedback);
        return result;
    }

    if (_tCalEqual(testObj, refObj)) {
        sprintf(feedback, "Subtest %d.%d: correctly saved a valid Calendar object",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: did not correctly save a valid calendar - object created from saved file does not match the reference object",testNum,subTest);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

static testRec* _tValidWriteTestGeneric(int testNum, Calendar* refObj, int weight, char* textStr, char* fileName){
    const int numSubs = 1;
    int subTest = 1;
     char feedback[6000];
    
    sprintf(feedback, "Test %d (%d%%): Testing writeCalencar. Creating an .ics file from a valid reference (%s)", testNum, weight, textStr);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTestWithFileAndObj(testNum, subTest, rec, fileName, refObj, &_tWriteCalendarTestGeneric);
    return rec;
}

testRec* _tValidWriteTest1(int testNum){
    return _tValidWriteTestGeneric  (testNum, _tSimpleCalendarUTC(), 4, "minimum valid Calendar object (UTC)","studentOutput/outFile1.ics");
}

testRec* _tValidWriteTest2(int testNum){
    return _tValidWriteTestGeneric  (testNum, _tSimpleCalendar(), 4, "minimum valid Calendar object (non-UTC)","studentOutput/outFile2.ics");
}

testRec* _tValidWriteTest3(int testNum){
    return _tValidWriteTestGeneric  (testNum, _tSimpleCalendarProps(), 4, "Calendar w. 1 Event and optional Properties","studentOutput/outFile3.ics");
}

testRec* _tValidWriteTest4(int testNum){
    return _tValidWriteTestGeneric  (testNum, _tMultiEventCalendar(), 4, "Calendar with multiple Events","studentOutput/outFile4.ics");
}

testRec* _tValidWriteTest5(int testNum){
    return _tValidWriteTestGeneric  (testNum, _tEvtPropCalendar2(), 4, "Calendar with an Event with Properties","studentOutput/outFile5.ics");
}

testRec* _tValidWriteTest6(int testNum){
    return _tValidWriteTestGeneric  (testNum, _tAlmPropCalendar(), 4, "Calendar with Event Properties and Alarms","studentOutput/outFile6.ics");
}

testRec* _tValidWriteTest7(int testNum){
    return _tValidWriteTestGeneric  (testNum, _tMegaCal(), 5, "Large Calendar with multiple Events, Properties, and Alarms","studentOutput/outFile7.ics");
}


/* ******************************* validateCalendar() - invalid args ******************************* */
static SubTestRec _tInvValArgs1(int testNum, int subTest) {
    SubTestRec result;
     char feedback[6000];   
    
    ICalErrorCode err = validateCalendar(NULL);

    if (err == INV_CAL) {
        sprintf(feedback, "Subtest %d.%d: NULL argument successfully detected", testNum, subTest);
        result = createSubResult(SUCCESS, feedback);
    } else {
        sprintf(feedback, "Subtest %d.%d: NULL argument NOT detected (returned %s)", testNum, subTest, _tPrintError(err));
        result = createSubResult(FAIL, feedback);
    }

    return result;
}

testRec* _tValidateTestInvArgs(int testNum) {
    const int numSubs = 1;
    int subTest = 1;
     char feedback[6000];

    sprintf(feedback, "Test %d (1%%): Testing validateCalendar - NULL arg", testNum);
    testRec* rec = initRec(testNum, numSubs, feedback);

    runSubTest(testNum, subTest, rec, &_tInvValArgs1);

    return rec;
}


static SubTestRec _tValidateCalendarSubTestHelper(int testNum, int subTest, char* errName, void* obj){
    SubTestRec result;
     char feedback[6000];
    
    Calendar* refObj = (Calendar*)obj;
    ICalErrorCode refErr;

    if (strcmp(errName, "OK") == 0){
        refErr = OK;
    }else if (strcmp(errName, "INV_CAL") == 0){
        refErr = INV_CAL;
    }else if (strcmp(errName, "INV_EVENT") == 0){
        refErr = INV_EVENT;
    }else if (strcmp(errName, "INV_ALARM") == 0){
        refErr = INV_ALARM;
    }else{ 
        refErr = OTHER_ERROR;
    }
    
    ICalErrorCode err = validateCalendar(refObj);
    
    if (err == refErr){
        sprintf(feedback, "Subtest %d.%d: successfuly validated",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: incorrect error code: expected %s, received %s",testNum,subTest, _tPrintError(refErr), _tPrintError(err));
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

static testRec* _tValidateCalendarGeneric(int testNum, Calendar* refObj, int weight, char* textStr, char* fileName){
    const int numSubs = 1;
    int subTest = 1;
     char feedback[6000];
    
    sprintf(feedback, "Test %d (%d%%): Testing validateCalendar (%s)", testNum, weight, textStr);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTestWithFileAndObj(testNum, subTest, rec, fileName, refObj, &_tValidateCalendarSubTestHelper);
    return rec;
}

testRec* _tValidateObjTest01(int testNum){
    return _tValidateCalendarGeneric(testNum, _tSimpleCalendarUTC(), 3, "Simple valid calendar ","OK");
}

testRec* _tValidateObjTest02(int testNum){
    return _tValidateCalendarGeneric(testNum, _tSimpleCalendar2Props2Events(), 3, "Valid calendar with a events and properties","OK");
}

testRec* _tValidateObjTest1(int testNum){
    return _tValidateCalendarGeneric(testNum, _tInvalidCalNullList1(), 1, "Calendar with NULL properties list","INV_CAL");
}

testRec* _tValidateObjTest2(int testNum){
    return _tValidateCalendarGeneric(testNum, _tInvalidCalNullList2(), 1, "Calendar with NULL events list","INV_CAL");
}

testRec* _tValidateObjTest3(int testNum){
    return _tValidateCalendarGeneric(testNum, _tInvalidEventNullList1(), 1, "Event with NULL properties list","INV_EVENT");
}

testRec* _tValidateObjTest4(int testNum){
    return _tValidateCalendarGeneric(testNum, _tInvalidEventNullList2(), 1, "Event with NULL alarms list","INV_EVENT");
}

testRec* _tValidateObjTest5(int testNum){
    return _tValidateCalendarGeneric(testNum, _tInvalidEventShortDate(), 1, "Event with a date that's too short","INV_EVENT");
}

testRec* _tValidateObjTest6(int testNum){
    return _tValidateCalendarGeneric(testNum, _tInvalidAlmNullTrigger(), 1, "Alarm with a NULL trugger","INV_ALARM");
}

testRec* _tValidateObjTest7(int testNum){
    return _tValidateCalendarGeneric(testNum, _tInvalidAlmNullList(), 1, "Alarm with a NULL properties list","INV_ALARM");
}



testRec* _tValidateTest1(int testNum){
    return _tValidateCalendarGeneric(testNum, _tInvalidCalDupVal(), 3, "Calendar with 2 PRODID's - one in properties list","INV_CAL");
}

testRec* _tValidateTest2(int testNum){
    return _tValidateCalendarGeneric(testNum, _tInvalidNonCalProp(), 3, "Calendar with an invalid property - TRIGGER in properties list","INV_CAL");
}

testRec* _tValidateTest7(int testNum){
    return _tValidateCalendarGeneric(testNum, _tInvalidCalEmptyPropVal(), 3, "Calendar with an invalid property - CALSCALE has an empty string as value","INV_CAL");
}




testRec* _tValidateTest3(int testNum){
    return _tValidateCalendarGeneric(testNum, _tInvalidEventDupProp(), 3, "Event with a duplicate DTSTART - one in properties list","INV_EVENT");
}

testRec* _tValidateTest4(int testNum){
    return _tValidateCalendarGeneric(testNum, _tInvalidEventNonEvProp(), 3, "Event with an invalid property - CALSCALE in properties list","INV_EVENT");
}



testRec* _tValidateTest5(int testNum){
    return _tValidateCalendarGeneric(testNum, _tInvalidAlarmDupProp(), 3, "Alarm with a duplicate TRIGGER - one in properties list","INV_ALARM");
}

testRec* _tValidateTest6(int testNum){
    return _tValidateCalendarGeneric(testNum, _tInvalidAlarmNonAlmProp(), 3, "Alarm with an invalid property - DTSTART in properties list","INV_ALARM");
}

// static SubTestRec _tInvalidEventCalendarValidate(int testNum, int subTest) {
//     SubTestRec result;
//      char feedback[6000];
//     // char sourceParamsCal[] = "testFiles/validCalendar/sourceCal1.ics";
//     // Calendar *paramsCal = NULL;

//     // ICalErrorCode sourceErr = createCalendar(sourceParamsCal, &paramsCal);
//     // if (sourceErr != OK) {
//     //     sprintf(feedback, "Subtest %d.%d: Did not parse valid source Calendar (returned %s)", testNum, subTest, printError(sourceErr));
//     //     result = createSubResult(FAIL, feedback);
//     //     return result;
//     // }

//     Calendar* calendar = _tInvalidEventCalendar();
    
//     ICalErrorCode err = validateCalendar(calendar);

//     if (err == INV_EVENT) {
//         sprintf(feedback, "Subtest %d.%d: invalid event successfully detected!", testNum, subTest);
//         result = createSubResult(SUCCESS, feedback);
//     } else {
//         sprintf(feedback, "Subtest %d.%d: invalid event NOT detected (returned %s)!", testNum, subTest, printError(err));
//         result = createSubResult(FAIL, feedback);
//     }

//     return result;

// }

// static SubTestRec _tInvalidMultiCompValidate(int testNum, int subTest) {
//     SubTestRec result;
//      char feedback[6000];
//     // char sourceParamsCal[] = "testFiles/validCalendar/sourceCal1.ics";
//     // Calendar *paramsCal = NULL;

//     // ICalErrorCode sourceErr = createCalendar(sourceParamsCal, &paramsCal);
//     // if (sourceErr != OK) {
//     //     sprintf(feedback, "Subtest %d.%d: Did not parse valid source Calendar (returned %s)", testNum, subTest, printError(sourceErr));
//     //     result = createSubResult(FAIL, feedback);
//     //     return result;
//     // }

//     // fprintf(stderr, "invalidMultiCompValidate\n");
//     Calendar *calendar = _tInvalidMultiComp();
    
//     ICalErrorCode err = validateCalendar(calendar);
    
//     //Resole the issue - can be only one alid error code
//     if (err == DUP_PRODID || err == INV_CAL) {
//         sprintf(feedback, "Subtest %d.%d: invalid calendar detected!", testNum, subTest);
//         result = createSubResult(SUCCESS, feedback);
//     } else {
//         sprintf(feedback, "Subtest %d.%d: DUP_PRODID not detected! (returned %s)", testNum, subTest, printError(err));
//         result = createSubResult(FAIL, feedback);
//     }

//     return result;
// }

// static SubTestRec _tInvalidDurationTest(int testNum, int subTest) {
//     SubTestRec result;
//      char feedback[6000];
//     // char sourceParamsCal[] = "testFiles/validCalendar/sourceCal1.ics";
//     // Calendar *paramsCal = NULL;

//     // ICalErrorCode sourceErr = createCalendar(sourceParamsCal, &paramsCal);
//     // if (sourceErr != OK) {
//     //     sprintf(feedback, "Subtest %d.%d: Did not parse valid source Calendar (returned %s)", testNum, subTest, printError(sourceErr));
//     //     result = createSubResult(FAIL, feedback);
//     //     return result;
//     // }
   
//     Calendar* cal = _tInvalidDuration();
//     ICalErrorCode err = validateCalendar(cal);

//     if (err == INV_EVENT) {
//         sprintf(feedback, "Subtest %d.%d: invalid event detected!", testNum, subTest);
//         result = createSubResult(SUCCESS, feedback);
//     } else {
//         sprintf(feedback, "Subtest %d.%d: invalid event not detected! (returned %s)", testNum, subTest, printError(err));
//         result = createSubResult(FAIL, feedback);
//     }

//     return result;
// }

// static SubTestRec _tInvalidAttachTest(int testNum, int subTest) {
//     SubTestRec result;
//      char feedback[6000];
//     // char sourceParamsCal[] = "testFiles/validCalendar/sourceCal1.ics";

//     // Calendar *paramsCal = NULL;


//     // ICalErrorCode sourceErr = createCalendar(sourceParamsCal, &paramsCal);
//     // if (sourceErr != OK) {
//     //     sprintf(feedback, "Subtest %d.%d: Did not parse valid source Calendar (returned %s)", testNum, subTest, printError(sourceErr));
//     //     result = createSubResult(FAIL, feedback);
//     //     return result;
//     // }

//     Calendar* cal = _tInvalidAttach();
//     ICalErrorCode err = validateCalendar(cal);

//     if (err == INV_ALARM) {
//         sprintf(feedback, "Subtest %d.%d: invalid alarm detected!", testNum, subTest);
//         result = createSubResult(SUCCESS, feedback);
//     } else {
//         sprintf(feedback, "Subtest %d.%d: invalid alarm not detected! (returned %s)", testNum, subTest, printError(err));
//         result = createSubResult(FAIL, feedback);
//     }

//     return result;
// }

// static SubTestRec _tInvalidCalScaleTest(int testNum, int subTest) {
//     SubTestRec result;
//      char feedback[6000];
//     // char sourceParamsCal[] = "testFiles/validCalendar/sourceCal1.ics";

//     // Calendar *paramsCal = NULL;

//     // ICalErrorCode sourceErr = createCalendar(sourceParamsCal, &paramsCal);
//     // if (sourceErr != OK) {
//     //     sprintf(feedback, "Subtest %d.%d: Did not parse valid source Calendar (returned %s)", testNum, subTest, printError(sourceErr));
//     //     result = createSubResult(FAIL, feedback);
//     //     return result;
//     // }

//     Calendar* cal = _tInvalidCalScale();
//     ICalErrorCode err = validateCalendar(cal);

//     if (err == INV_CAL) {
//         sprintf(feedback, "Subtest %d.%d invalid calendar detected", testNum, subTest);
//         result = createSubResult(SUCCESS, feedback);
//     } else {
//         sprintf(feedback, "Subtest %d.%d: invalid alarm not detected! (returned %s)", testNum, subTest, printError(err));
//         result = createSubResult(FAIL, feedback);
//     }

//     return result;
// }

// testRec* validateTest(int testNum) {
//     const int numSubs = 5;
//     int subTest = 1;
//      char feedback[6000];

//     sprintf(feedback, "Test %d: Testing Invalid Calendar Objects using validate() (15%%)", testNum);
//     testRec* rec = initRec(testNum, numSubs, feedback);


//     runSubTest(testNum, subTest, rec, &_tInvalidEventCalendarValidate);
//     subTest++;

//     runSubTest(testNum, subTest, rec, &_tInvalidMultiCompValidate);
//     subTest++;

//     runSubTest(testNum, subTest, rec, &_tInvalidDurationTest);
//     subTest++;

//     runSubTest(testNum, subTest, rec, &_tInvalidAttachTest);
//     subTest++;

//     runSubTest(testNum, subTest, rec, &_tInvalidCalScaleTest);

//     return rec;
// }

SubTestRec megaCalWrite(int testNum, int subTest) {
    SubTestRec result;
     char feedback[6000];
    char filename[] = "studentOutput/megaCal.ics";
    Calendar *testCal = _tMegaCal();
    Calendar *refCal;

    writeCalendar(filename, testCal);
    ICalErrorCode err = createCalendar(filename, &refCal);
    //printf("Error code: %d", err);
    if (err != OK) {
        sprintf(feedback, "Subtest %d.%d: Did not return OK when parsing a valid file (%s), returned (%d).", testNum, subTest, filename, err);
        result = createSubResult(FAIL, feedback);
        return result;
    }

    if (_tCalEqual(testCal, refCal)) {
        sprintf(feedback, "Subtest %d.%d: file %s parsed correctly",testNum,subTest,filename);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: did not correctly parse a valid file (%s)",testNum,subTest, filename);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

SubTestRec megaCalFoldingWrite(int testNum, int subTest) {
    SubTestRec result;
     char feedback[6000];
    char filename[] = "studentOutput/megaCalFolded.ics";
    Calendar *testCal = _tMegaLineFolding();
    Calendar *refCal = NULL;

    writeCalendar(filename, testCal);
    ICalErrorCode err = createCalendar(filename, &refCal);
    //printf("Error code: %d", err);
    if (err != OK) {
        sprintf(feedback, "Subtest %d.%d: Did not return OK when parsing a valid file (%s), returned (%d).", testNum, subTest, filename, err);
        result = createSubResult(FAIL, feedback);
        return result;
    }

    if (_tCalEqual(testCal, refCal)) {
        sprintf(feedback, "Subtest %d.%d: file %s parsed correctly",testNum,subTest,filename);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: did not correctly parse a valid file (%s)",testNum,subTest, filename);
        result = createSubResult(FAIL, feedback);
        return result;
    }

}

// testRec* megaCalTestWrite(int testNum) {
//     const int numSubs = 2;
//     int subTest = 1;
//      char feedback[6000];

//     sprintf(feedback, "Test %d: Mega Calendar Test - writing (5%%)", testNum);
//     testRec* rec = initRec(testNum, numSubs, feedback);

//     runSubTest(testNum, subTest, rec, &megaCalWrite);
//     subTest++;
//     runSubTest(testNum, subTest, rec, &megaCalFoldingWrite);

//     return rec;
// }


//******************************** TEST CASES ********************************



// static SubTestRec _tInvalidParams(int testNum, int subTest) {
//     SubTestRec result;
//      char feedback[6000];
//     char filename[] = "testFiles/invalidA2/XParams1.ics";

//     Calendar* calendar;

//     ICalErrorCode err = createCalendar(filename, &calendar);
//     if (err == INV_CAL) {

//         sprintf(feedback, "Subtest %d.%d: file %s error found",testNum,subTest,filename);
//         result = createSubResult(SUCCESS, feedback);
//         return result;
//     } else {

//         sprintf(feedback, "Subtest %d.%d: Did not return Invalid Event when parsing an invalid file (%s).", testNum, subTest, filename);
//         result = createSubResult(FAIL, feedback);
//         return result;
//     }

// }

// static SubTestRec _tInvalidAlarm(int testNum, int subTest) {
//     SubTestRec result;
//      char feedback[6000];
//     char filename[] = "testFiles/invalidA2/invAlarm1.ics";

//     Calendar *calendar;

//     ICalErrorCode err = createCalendar(filename, &calendar);

//     if (err == INV_ALARM) {

//         sprintf(feedback, "Subtest %d.%d: file %s error found",testNum,subTest,filename);
//         result = createSubResult(SUCCESS, feedback);
//         return result;
//     } else {

//         sprintf(feedback, "Subtest %d.%d: Did not return Invalid Alarm when parsing an invalid file (%s) Returned (%d).", testNum, subTest, filename, err);
//         result = createSubResult(FAIL, feedback);
//         return result;
//     }

// }

// static SubTestRec _tInvalidAlarmDup(int testNum, int subTest) {
//     SubTestRec result;
//      char feedback[6000];
//     char filename[] = "testFiles/invalidA2/invAlarmDupProps1.ics";

//     Calendar *calendar;

//     ICalErrorCode err = createCalendar(filename, &calendar);

//     if (err == INV_ALARM) {
//         sprintf(feedback, "Subtest %d.%d: file %s Duplicate Alarm property found", testNum, subTest, filename);
//         result = createSubResult(SUCCESS, feedback);
//         return result;
//     } else {
//         sprintf(feedback, "Subtest %d.%d: Did not return Invalid Alarm when parsing an invalid file (%s) Returned (%d).", testNum, subTest, filename, err);
//         result = createSubResult(FAIL, feedback);
//         return result;
//     }
// }

// static SubTestRec _tInvalidDupProdID(int testNum, int subTest) {
//     SubTestRec result;
//      char feedback[6000];
//     char filename[] = "testFiles/invCalendar/dupPRODID.ics";

//     Calendar *calendar;

//     ICalErrorCode err = createCalendar(filename, &calendar);

//     if (err == DUP_PRODID) {

//         sprintf(feedback, "Subtest %d.%d: file %s duplicate PRODID found",testNum,subTest,filename);
//         result = createSubResult(SUCCESS, feedback);
//         return result;
//     } else {
//         sprintf(feedback, "Subtest %d.%d: Did not return DUP_PRODID when parsing an invalid file (%s).", testNum, subTest, filename);
//         result = createSubResult(FAIL, feedback);
//         return result;
//     }

// }

// static SubTestRec _tInvalidRandomBegin(int testNum, int subTest) {
//     SubTestRec result;
//      char feedback[6000];
//     char filename[] = "testFiles/invalidA2/randomBegin1.ics";

//     Calendar *calendar;

//     ICalErrorCode err = createCalendar(filename, &calendar);

//     if (err == INV_EVENT) {
//         sprintf(feedback, "Subtest %d.%d: file %s invalid Event found",testNum,subTest,filename);
//         result = createSubResult(SUCCESS, feedback);
//         return result;
//     } else {
//         sprintf(feedback, "Subtest %d.%d: Did not return INV_EVENT when parsing an invalid file (%s) returned (%s).", testNum, subTest, filename, printError(err));
//         result = createSubResult(FAIL, feedback);
//         return result;
//     }
// }

// static SubTestRec _tDuplicateCalScale(int testNum, int subTest) {
//     SubTestRec result;
//      char feedback[6000];
//     char filename[] = "testFiles/invalidA2/doubleCalScale1.ics";

//     Calendar *calendar;

//     ICalErrorCode err = createCalendar(filename, &calendar);

//     if (err == INV_CAL) {
//         sprintf(feedback, "Subtest %d.%d: file %s invalid Calscale found",testNum,subTest,filename);
//         result = createSubResult(SUCCESS, feedback);
//         return result;
//     } else {
//         sprintf(feedback, "Subtest %d.%d: Did not return INV_CAL when parsing an invalid file (%s).", testNum, subTest, filename);
//         result = createSubResult(FAIL, feedback);
//         return result;
//     }

// }

// static SubTestRec _tInvalidDurationEnd(int testNum, int subTest) {
//     SubTestRec result;
//      char feedback[6000];
//     char filename[] = "testFiles/invalidA2/dtendduration1.ics";

//     Calendar *calendar;

//     ICalErrorCode err = createCalendar(filename, &calendar);

//     if (err == INV_EVENT) {
//         sprintf(feedback, "Subtest %d.%d: file %s invalid Calscale found",testNum,subTest,filename);
//         result = createSubResult(SUCCESS, feedback);
//         return result;
//     } else {
//         sprintf(feedback, "Subtest %d.%d: Did not return INV_EVENT when parsing an invalid file (%s) returned (%s).", testNum, subTest, filename, printError(err));
//         result = createSubResult(FAIL, feedback);
//         return result;
//     }
// }

/*
testRec* paramsTest(int testNum) {
    const int numSubs = 1;
    int subTest = 1;
     char feedback[6000];

    sprintf(feedback, "Test %d: Testing invalid Calendar Params (15%%)", testNum);
    testRec* rec = initRec(testNum, numSubs, feedback);


    //X-params - Can be caught by alidate()
    // runSubTest(testNum, subTest, rec, &_tInvalidParams);
    // subTest++;

    //Missing action
    // runSubTest(testNum, subTest, rec, &_tInvalidAlarm);
    // subTest++;

    //Identical to an A1 test
    // runSubTest(testNum, subTest, rec, &_tInvalidDupProdID);
    // subTest++;

    //Missing action.  What's duplicated?
    //runSubTest(testNum, subTest, rec, &_tInvalidAlarmDup);
    //subTest++;

    //begin:eent inside eent
    // runSubTest(testNum, subTest, rec, &_tInvalidRandomBegin);
    // subTest++;

    //Dup calscale - Can be caught by alidate()
    // runSubTest(testNum, subTest, rec, &_tDuplicateCalScale);
    // subTest++;

    //Inalid duration (NaN) - can be caught by alidate()
    // runSubTest(testNum, subTest, rec, &_tInvalidDurationEnd);

    return rec;

}
*/