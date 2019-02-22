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

//******************************** dtToJSON ********************************

static SubTestRec _tDTtoJ1(int testNum, int subTest){
    char feedback[300];
    SubTestRec result;
    DateTime refDT = _tCreateTestDateTime("19970714","170000",false);
    char refStr[] = "{\"date\":\"19970714\",\"time\":\"170000\",\"isUTC\":false}";

    char* testStr = dtToJSON(refDT);
    
    if (testStr != NULL && strcmp(testStr, refStr) == 0){
        sprintf(feedback, "Subtest %d.%d: Successfully converted a valid DateTime into a JSON string.",testNum, subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
    else
    {
        sprintf(feedback, "Subtest %d.%d: Failed to converte a valid DateTime into a JSON string.",testNum, subTest);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

static SubTestRec _tDTtoJ2(int testNum, int subTest){
    char feedback[300];
    SubTestRec result;
    DateTime refDT = _tCreateTestDateTime("19970714","170000",true);
    char refStr[] = "{\"date\":\"19970714\",\"time\":\"170000\",\"isUTC\":true}";

    char* testStr = dtToJSON(refDT);
    
    if (testStr != NULL && strcmp(testStr, refStr) == 0){
        sprintf(feedback, "Subtest %d.%d: Successfully converted a valid DateTime into a JSON string.",testNum, subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
    else
    {
        sprintf(feedback, "Subtest %d.%d: Failed to converte a valid DateTime into a JSON string.",testNum, subTest);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

testRec* _tTestDTtoJSON(int testNum){
    const int numSubs = 2;
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (2%%): dtToJSON", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tDTtoJ1);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tDTtoJ2);

    return rec;
}

//******************************** JSONtoCalendar - invalid args ********************************
static SubTestRec _tJtoCInv1(int testNum, int subTest){
    char feedback[300];
    SubTestRec result;
    Calendar* cal;
    
    cal = JSONtoCalendar(NULL);
    
    if (cal == NULL){
        sprintf(feedback, "Subtest %d.%d: Successfully handled NULL argument.",testNum, subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
    else
    {
        sprintf(feedback, "Subtest %d.%d: Failed to handle a NULL argument.",testNum, subTest);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

testRec* _tTestJSONtoCalInv(int testNum){
    const int numSubs = 1;
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (1%%): JSONtoCalendar (NULL arg)", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tJtoCInv1);
    return rec;
}




//******************************** JSONtoCalendar ********************************
// static SubTestRec _tJtoC1(int testNum, int subTest){
//     char feedback[300];
//     SubTestRec result;

//     Calendar* refCal = _tSimpleCalendarUTC();
//     char refStr[300] = "{\"version\":2,\"prodID\":\"-//hacksw/handcal//NONSGML v1.0//EN\"}";
//     Calendar* testCal; 

//     testCal = JSONtoCalendar(refStr);

//     if (testCal != NULL && _tObjEqual(refCal, testCal)){
//         sprintf(feedback, "Subtest %d.%d: correctly created a Card from JSON string %s",testNum, subTest, refStr);
//         result = createSubResult(SUCCESS, feedback);
//         return result;
//     }else{
//         sprintf(feedback, "Subtest %d.%d: failed to correctly create a Card from JSON string %s",testNum, subTest, refStr);
//         result = createSubResult(FAIL, feedback);
//         return result;
//     }
// }

// testRec* _tTestJSONtoCalendar(int testNum){
//     const int numSubs = 1;
//     int subTest = 1;
//     char feedback[300];
    
//     sprintf(feedback, "Test %d (2%%): JSONtoCalendar", testNum);
//     testRec * rec = initRec(testNum, numSubs, feedback);
    
//     runSubTest(testNum, subTest, rec, &_tJtoC1);
//     return rec;
// }

//******************************** JSONtoEvent - invalid args ********************************
static SubTestRec _tJtoEInv1(int testNum, int subTest){
    char feedback[300];
    SubTestRec result;
    Event* evt;
    
    evt = JSONtoEvent(NULL);
    
    if (evt == NULL){
        sprintf(feedback, "Subtest %d.%d: Successfully handled NULL argument.",testNum, subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
    else
    {
        sprintf(feedback, "Subtest %d.%d: Failed to handle a NULL argument.",testNum, subTest);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

testRec* _tTestJSONtoEvtInv(int testNum){
    const int numSubs = 1;
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (1%%): JSONtoEvent (NULL arg)", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tJtoEInv1);
    return rec;
}

//******************************** eventToJSON - invalid args ********************************
static SubTestRec _tEtoJInv1(int testNum, int subTest){
    char feedback[300];
    SubTestRec result;
    char* str;
    
    str = eventToJSON(NULL);
    
    if (strcmp(str, "{}") == 0){
        sprintf(feedback, "Subtest %d.%d: Successfully handled NULL argument.",testNum, subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
    else
    {
        sprintf(feedback, "Subtest %d.%d: Failed to handle a NULL argument.",testNum, subTest);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

testRec* _tTestEvtToJSONInv(int testNum){
    const int numSubs = 1;
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (1%%): eventToJSON (NULL arg)", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tEtoJInv1);
    return rec;
}

//******************************** eventToJSON - valid args ********************************
static SubTestRec _tEtoJ1(int testNum, int subTest){
    char feedback[300];
    SubTestRec result;
    char refStr[] = "{\"startDT\":{\"date\":\"19540203\",\"time\":\"123012\",\"isUTC\":true},\"numProps\":3,\"numAlarms\":0,\"summary\":\"\"}";

    char* testStr;

    DateTime dtStamp = _tCreateTestDateTime("19540203","123012",true);
    DateTime dtStart = _tCreateTestDateTime("19540203","123012",true);
    
    Event* event = _tCreateTestEvent("1234",dtStamp,dtStart);
    
    testStr = eventToJSON(event);
    
    if (strcmp(testStr, refStr) == 0){
        sprintf(feedback, "Subtest %d.%d: Successfully converted Event with no alarms and optional props into a JSON string.",testNum, subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
    else
    {
        sprintf(feedback, "Subtest %d.%d: Failed to convert Event with no alarms and optional props into a JSON string.",testNum, subTest);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

static SubTestRec _tEtoJ2(int testNum, int subTest){
    char feedback[300];
    SubTestRec result;
    char refStr[] = "{\"startDT\":{\"date\":\"19540203\",\"time\":\"123012\",\"isUTC\":true},\"numProps\":4,\"numAlarms\":2,\"summary\":\"Do taxes\"}";

    char* testStr;

    DateTime dtStamp = _tCreateTestDateTime("19540203","123012",true);
    DateTime dtStart = _tCreateTestDateTime("19540203","123012",true);
    
    Event* event = _tCreateTestEvent("1234",dtStamp,dtStart);
    Alarm* testAlm = _tCreateTestAlarm("AUDIO","VALUE=DATE-TIME:19970317T133000Z");
    _tInsertBack(event->alarms, testAlm);
    testAlm = _tCreateTestAlarm("AUDIO","VALUE=DATE-TIME:19970317T133000Z");
    _tInsertBack(event->alarms, testAlm);
     Property* prop = _tCreateTestProp("SUMMARY", "Do taxes");
    _tInsertBack(event->properties, prop);

    
    testStr = eventToJSON(event);
    
    if (strcmp(testStr, refStr) == 0){
        sprintf(feedback, "Subtest %d.%d: Successfully converted Event with 2 alarms and 1 optional SUMMARY prop into a JSON string.",testNum, subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
    else
    {
        sprintf(feedback, "Subtest %d.%d: Failed to convert Event with 2 alarms and 1 optional SUMMARY prop into a JSON string.",testNum, subTest);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

testRec* _tTestEvtToJSON(int testNum){
    const int numSubs = 2;
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (3%%): eventToJSON", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tEtoJ1);
    testNum++;
    runSubTest(testNum, subTest, rec, &_tEtoJ2);

    return rec;
}

//******************************** eventListToJSON - invalid args ********************************
static SubTestRec _tELtoJInv1(int testNum, int subTest){
    char feedback[300];
    SubTestRec result;
    char* str;
    
    str = eventListToJSON(NULL);
    
    if (strcmp(str, "[]") == 0){
        sprintf(feedback, "Subtest %d.%d: Successfully handled NULL argument.",testNum, subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
    else
    {
        sprintf(feedback, "Subtest %d.%d: Failed to handle a NULL argument.",testNum, subTest);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

testRec* _tTestEvtListToJSONInv(int testNum){
    const int numSubs = 1;
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (1%%): eventListToJSON (NULL arg)", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tELtoJInv1);
    return rec;
}

//******************************** eventListToJSON - invalid args ********************************
static SubTestRec _tCtoJInv1(int testNum, int subTest){
    char feedback[300];
    SubTestRec result;
    char* str;
    
    str = calendarToJSON(NULL);
    
    if (strcmp(str, "{}") == 0){
        sprintf(feedback, "Subtest %d.%d: Successfully handled NULL argument.",testNum, subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
    else
    {
        sprintf(feedback, "Subtest %d.%d: Failed to handle a NULL argument.",testNum, subTest);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

testRec* _tTestCalToJSONInv(int testNum){
    const int numSubs = 1;
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (1%%): calendarToJSON (NULL arg)", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tCtoJInv1);
    return rec;
}

//******************************** addEvent ********************************
static SubTestRec _tAddEvt1(int testNum, int subTest){
    char feedback[300];
    SubTestRec result;

    DateTime dtStamp = _tCreateTestDateTime("19970714","170000",false);
    DateTime dtStart = _tCreateTestDateTime("19970714","170000",false);

    Event* event = _tCreateTestEvent("uid1@example.com", dtStamp, dtStart);

    addEvent(NULL, event);
    
    sprintf(feedback, "Subtest %d.%d: correctly handled a NULL calendar.",testNum, subTest);
    result = createSubResult(SUCCESS, feedback);
    return result;
}

static SubTestRec _tAddEvt2(int testNum, int subTest){
    char feedback[300];
    SubTestRec result;

    Calendar* refCalendar = _tSimpleCalendar();

    addEvent(refCalendar, NULL);
    
    sprintf(feedback, "Subtest %d.%d: correctly handled a NULL event.",testNum, subTest);
    result = createSubResult(SUCCESS, feedback);
    return result;
}

static SubTestRec _tAddEvt3(int testNum, int subTest){
    char feedback[300];
    SubTestRec result;

    Calendar* refCalendar = _tSimpleCalendar();
    Calendar* testCalendar = _tSimpleCalendar();

    DateTime dtStamp = _tCreateTestDateTime("19970714","170000",false);
    DateTime dtStart = _tCreateTestDateTime("19970714","170000",false);

    Event* event = _tCreateTestEvent("uid1@example.com", dtStamp, dtStart);

    _tInsertBack(refCalendar->events, event);
    addEvent(testCalendar, event);
    
    if (testCalendar !=NULL && _tCalEqual(testCalendar, refCalendar)){
        sprintf(feedback, "Subtest %d.%d: correctly added a reference event to a reference calendar.",testNum, subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: did not correctly add a reference event to a reference calendar.",testNum, subTest);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

testRec* _tTestAddEvt(int testNum){
    const int numSubs = 3;
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (3%%): Testing addEvent() function", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tAddEvt1);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tAddEvt2);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tAddEvt3);
    return rec;
}