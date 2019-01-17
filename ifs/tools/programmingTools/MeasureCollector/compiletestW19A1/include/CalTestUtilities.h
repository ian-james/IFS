#ifndef CAL_TEST_UTILITIES_H
#define CAL_TEST_UTILITIES_H

#include <string.h>
#include <signal.h>
#include <stdlib.h>
#include <stdio.h>
#include <assert.h>
#include <ctype.h>

#include <unistd.h>
#include <sys/types.h>
#include <errno.h>
#include <sys/wait.h>

#include "LinkedListAPI.h"
#include "CalendarParser.h"
#include "TestHarness.h"


//******************************** LIST FUNCTIONS ********************************
Node* _tInitializeNode(void* data);
List* _tInitializeList(char* (*printFunction)(void* toBePrinted),void (*deleteFunction)(void* toBeDeleted),int (*compareFunction)(const void* first,const void* second));
void _tInsertBack(List* list, void* toBeAdded);

//******************************** COMPARISON FUNCTIONS ********************************

bool _tPtrEqual(const void* p1, const void* p2);
bool _tStrEqualIgnCase(const void* str1, const void* str2);
bool _tStrEqual(const void* str1, const void* str2);
bool _tPropEqual(const Property* prop1, const Property* prop2);
bool _tContainsProp(List* list, const Property* prop);

bool _tDTEqual(DateTime testDT, DateTime refDT);
bool _tPropListEqual(List* testList, List* refList);
bool _tAlarmEqual(const Alarm* testAlarm, const Alarm* refAlarm);
bool _tContainsAlarm(List* list, const Alarm* alarm);
bool _tAlarmListEqual(List* testList, List* refList);
bool _tEventEqual(const Event* testEvent, const Event* refEvent);
bool _tContainsEvent(List* list, const Event* event);
bool _tEventListEqual(List* testList, List* refList);
bool _tCalEqual(const Calendar* testCal, const Calendar* refCal);

//******************************** CONSTRUCTOR FUNCTIONS ********************************
Property* _tCreateTestProp(char* propName, char* propDescr);
Alarm* _tCreateTestAlarm(char* action, char* trigger);
Event* _tCreateTestEvent(char* UID, DateTime dtStamp, DateTime dtStart);
Calendar* _tCreateTestCalendar(char* prodID, float version);
DateTime _tCreateTestDateTime(char* date, char* time, bool UTC);
List* _tInitWithExisting(List* lst);

#endif