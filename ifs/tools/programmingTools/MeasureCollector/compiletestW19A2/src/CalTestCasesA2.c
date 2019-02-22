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



// static SubTestRec _tInvalidParams(int testNum, int subTest) {
//     SubTestRec result;
//     char feedback[300];
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
//     char feedback[300];
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
//     char feedback[300];
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
//     char feedback[300];
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
//     char feedback[300];
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
//     char feedback[300];
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
//     char feedback[300];
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
    char feedback[300];

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
/* ******************************* validatreCalendar() - invalid args ******************************* */
static SubTestRec _tInvValArgs1(int testNum, int subTest) {
    SubTestRec result;
    char feedback[300];   
    
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
    char feedback[300];

    sprintf(feedback, "Test %d: Testing validate() - NULL arg (1%%)", testNum);
    testRec* rec = initRec(testNum, numSubs, feedback);

    runSubTest(testNum, subTest, rec, &_tInvValArgs1);

    return rec;
}

static SubTestRec _tInvalidEventCalendarValidate(int testNum, int subTest) {
    SubTestRec result;
    char feedback[300];
    // char sourceParamsCal[] = "testFiles/validCalendar/sourceCal1.ics";
    // Calendar *paramsCal = NULL;

    // ICalErrorCode sourceErr = createCalendar(sourceParamsCal, &paramsCal);
    // if (sourceErr != OK) {
    //     sprintf(feedback, "Subtest %d.%d: Did not parse valid source Calendar (returned %s)", testNum, subTest, printError(sourceErr));
    //     result = createSubResult(FAIL, feedback);
    //     return result;
    // }

    Calendar* calendar = _tInvalidEventCalendar();
    
    ICalErrorCode err = validateCalendar(calendar);

    if (err == INV_EVENT) {
        sprintf(feedback, "Subtest %d.%d: invalid event successfully detected!", testNum, subTest);
        result = createSubResult(SUCCESS, feedback);
    } else {
        sprintf(feedback, "Subtest %d.%d: invalid event NOT detected (returned %s)!", testNum, subTest, printError(err));
        result = createSubResult(FAIL, feedback);
    }

    return result;

}

static SubTestRec _tInvalidMultiCompValidate(int testNum, int subTest) {
    SubTestRec result;
    char feedback[300];
    // char sourceParamsCal[] = "testFiles/validCalendar/sourceCal1.ics";
    // Calendar *paramsCal = NULL;

    // ICalErrorCode sourceErr = createCalendar(sourceParamsCal, &paramsCal);
    // if (sourceErr != OK) {
    //     sprintf(feedback, "Subtest %d.%d: Did not parse valid source Calendar (returned %s)", testNum, subTest, printError(sourceErr));
    //     result = createSubResult(FAIL, feedback);
    //     return result;
    // }

    // fprintf(stderr, "invalidMultiCompValidate\n");
    Calendar *calendar = _tInvalidMultiComp();
    
    ICalErrorCode err = validateCalendar(calendar);
    
    //Resole the issue - can be only one alid error code
    if (err == DUP_PRODID || err == INV_CAL) {
        sprintf(feedback, "Subtest %d.%d: invalid calendar detected!", testNum, subTest);
        result = createSubResult(SUCCESS, feedback);
    } else {
        sprintf(feedback, "Subtest %d.%d: DUP_PRODID not detected! (returned %s)", testNum, subTest, printError(err));
        result = createSubResult(FAIL, feedback);
    }

    return result;
}

static SubTestRec _tInvalidDurationTest(int testNum, int subTest) {
    SubTestRec result;
    char feedback[300];
    // char sourceParamsCal[] = "testFiles/validCalendar/sourceCal1.ics";
    // Calendar *paramsCal = NULL;

    // ICalErrorCode sourceErr = createCalendar(sourceParamsCal, &paramsCal);
    // if (sourceErr != OK) {
    //     sprintf(feedback, "Subtest %d.%d: Did not parse valid source Calendar (returned %s)", testNum, subTest, printError(sourceErr));
    //     result = createSubResult(FAIL, feedback);
    //     return result;
    // }
   
    Calendar* cal = _tInvalidDuration();
    ICalErrorCode err = validateCalendar(cal);

    if (err == INV_EVENT) {
        sprintf(feedback, "Subtest %d.%d: invalid event detected!", testNum, subTest);
        result = createSubResult(SUCCESS, feedback);
    } else {
        sprintf(feedback, "Subtest %d.%d: invalid event not detected! (returned %s)", testNum, subTest, printError(err));
        result = createSubResult(FAIL, feedback);
    }

    return result;
}

static SubTestRec _tInvalidAttachTest(int testNum, int subTest) {
    SubTestRec result;
    char feedback[300];
    // char sourceParamsCal[] = "testFiles/validCalendar/sourceCal1.ics";

    // Calendar *paramsCal = NULL;


    // ICalErrorCode sourceErr = createCalendar(sourceParamsCal, &paramsCal);
    // if (sourceErr != OK) {
    //     sprintf(feedback, "Subtest %d.%d: Did not parse valid source Calendar (returned %s)", testNum, subTest, printError(sourceErr));
    //     result = createSubResult(FAIL, feedback);
    //     return result;
    // }

    Calendar* cal = _tInvalidAttach();
    ICalErrorCode err = validateCalendar(cal);

    if (err == INV_ALARM) {
        sprintf(feedback, "Subtest %d.%d: invalid alarm detected!", testNum, subTest);
        result = createSubResult(SUCCESS, feedback);
    } else {
        sprintf(feedback, "Subtest %d.%d: invalid alarm not detected! (returned %s)", testNum, subTest, printError(err));
        result = createSubResult(FAIL, feedback);
    }

    return result;
}

static SubTestRec _tInvalidCalScaleTest(int testNum, int subTest) {
    SubTestRec result;
    char feedback[300];
    // char sourceParamsCal[] = "testFiles/validCalendar/sourceCal1.ics";

    // Calendar *paramsCal = NULL;

    // ICalErrorCode sourceErr = createCalendar(sourceParamsCal, &paramsCal);
    // if (sourceErr != OK) {
    //     sprintf(feedback, "Subtest %d.%d: Did not parse valid source Calendar (returned %s)", testNum, subTest, printError(sourceErr));
    //     result = createSubResult(FAIL, feedback);
    //     return result;
    // }

    Calendar* cal = _tInvalidCalScale();
    ICalErrorCode err = validateCalendar(cal);

    if (err == INV_CAL) {
        sprintf(feedback, "Subtest %d.%d invalid calendar detected", testNum, subTest);
        result = createSubResult(SUCCESS, feedback);
    } else {
        sprintf(feedback, "Subtest %d.%d: invalid alarm not detected! (returned %s)", testNum, subTest, printError(err));
        result = createSubResult(FAIL, feedback);
    }

    return result;
}

testRec* validateTest(int testNum) {
    const int numSubs = 5;
    int subTest = 1;
    char feedback[300];

    sprintf(feedback, "Test %d: Testing Invalid Calendar Objects using validate() (15%%)", testNum);
    testRec* rec = initRec(testNum, numSubs, feedback);


    runSubTest(testNum, subTest, rec, &_tInvalidEventCalendarValidate);
    subTest++;

    runSubTest(testNum, subTest, rec, &_tInvalidMultiCompValidate);
    subTest++;

    runSubTest(testNum, subTest, rec, &_tInvalidDurationTest);
    subTest++;

    runSubTest(testNum, subTest, rec, &_tInvalidAttachTest);
    subTest++;

    runSubTest(testNum, subTest, rec, &_tInvalidCalScaleTest);

    return rec;
}


SubTestRec outputTest1(int testNum, int subTest) {
    SubTestRec result;
    char feedback[300];
    char filename[] = "studentOutput/foldedCalendar1.ics";
    Calendar *testCal = _tFoldedCalendar1();

    writeCalendar(filename, testCal);
    Calendar *refCal;
    ICalErrorCode err = createCalendar("studentOutput/foldedCalendar1.ics", &refCal);

    if (err != OK) {
        sprintf(feedback, "Subtest %d.%d: Did not return OK (returned %d) when parsing a valid file (%s).", testNum, subTest, err,  filename);
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

SubTestRec outputTest2(int testNum, int subTest) {
    SubTestRec result;
    char feedback[300];
    char filename[] = "studentOutput/foldedCalendar2.ics";
    Calendar *testCal = _tFoldedCalendar2();
    Calendar *refCal;

    writeCalendar(filename, testCal);

    ICalErrorCode err = createCalendar(filename, &refCal);

    if (err != OK) {
        sprintf(feedback, "Subtest %d.%d: Did not return OK when parsing a valid file (%s %s).", testNum, subTest, printError(err), filename);
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

SubTestRec outputTest3(int testNum, int subTest) {
    SubTestRec result;
    char feedback[300];
    char filename[] = "studentOutput/foldedCalendar3.ics";
    Calendar *testCal = _tFoldedCalendar3();
    Calendar *refCal;

    writeCalendar(filename, testCal);
    ICalErrorCode err = createCalendar(filename, &refCal);

    if (err != OK) {
        sprintf(feedback, "Subtest %d.%d: Did not return OK when parsing a valid file (%s).", testNum, subTest, filename);
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


testRec* outputTest(int testNum) {
    const int numSubs = 3;
    int subTest = 1;
    char feedback[300];

    sprintf(feedback, "Test %d: Testing Output of Calendar Objects using writeCalendar() (15%%)", testNum);
    testRec* rec = initRec(testNum, numSubs, feedback);


    runSubTest(testNum, subTest, rec, &outputTest1);
    subTest++;

    runSubTest(testNum, subTest, rec, &outputTest2);

    subTest++;
    runSubTest(testNum, subTest, rec, &outputTest3);



    return rec;
}

SubTestRec megaCalWrite(int testNum, int subTest) {
    SubTestRec result;
    char feedback[300];
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
    char feedback[300];
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

testRec* megaCalTestWrite(int testNum) {
    const int numSubs = 2;
    int subTest = 1;
    char feedback[300];

    sprintf(feedback, "Test %d: Mega Calendar Test - writing (5%%)", testNum);
    testRec* rec = initRec(testNum, numSubs, feedback);

    runSubTest(testNum, subTest, rec, &megaCalWrite);
    subTest++;
    runSubTest(testNum, subTest, rec, &megaCalFoldingWrite);

    return rec;
}
