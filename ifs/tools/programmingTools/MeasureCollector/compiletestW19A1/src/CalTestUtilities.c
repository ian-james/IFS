#include "CalTestUtilities.h"

Node* _tInitializeNode(void* data){
    Node* tmpNode;
    
    tmpNode = (Node*)malloc(sizeof(Node));
    
    if (tmpNode == NULL){
        return NULL;
    }
    
    tmpNode->data = data;
    tmpNode->previous = NULL;
    tmpNode->next = NULL;
    
    return tmpNode;
}

List* _tInitializeList(char* (*printFunction)(void* toBePrinted),void (*deleteFunction)(void* toBeDeleted),int (*compareFunction)(const void* first,const void* second)){

    List* tmpList = malloc(sizeof(List));
	
	tmpList->head = NULL;
	tmpList->tail = NULL;

	tmpList->length = 0;

	tmpList->deleteData = deleteFunction;
	tmpList->compare = compareFunction;
	tmpList->printData = printFunction;
	
	return tmpList;
}

/**Inserts a Node at the back of a linked list.  List metadata is updated
 * so that head and tail pointers are correct.
 *@pre 'List' type must exist and be used in order to keep track of the linked list.
 *@param list pointer to the dummy head of the list
 *@param toBeAdded a pointer to data that is to be added to the linked list
 **/
void _tInsertBack(List* list, void* toBeAdded){
	if (list == NULL || toBeAdded == NULL){
		return;
	}
	
	(list->length)++;

	Node* newNode = _tInitializeNode(toBeAdded);
	
    if (list->head == NULL && list->tail == NULL){
        list->head = newNode;
        list->tail = list->head;
    }else{
		newNode->previous = list->tail;
        list->tail->next = newNode;
    	list->tail = newNode;
    }
}

//******************************** COMPARISON FUNCTIONS ********************************

bool _tPtrEqual(const void* p1, const void* p2){
    if (p1 == p2){
        return true;
    }
    
    if (p1 == NULL && p2 != NULL){
        return false;
    }
    
    if (p1 != NULL && p2 == NULL){
        return false;
    }

    if (p1 == p2){
        return true;
    }else{
        return false;
    }
}

//Check for equality if strings, checking the pointers and ignoring the case
bool _tStrEqualIgnCase(const void* str1, const void* str2){
    
    if (_tPtrEqual(str1, str2)){
        return true;
    } 

    if (str1 == NULL || str2 == NULL){
        return false;
    }

    int len1 = strlen((const char*)str1);
    int len2 = strlen((const char*)str2);

    if (len1 != len2){
        return false;
    }

    int i = 0;
    const char* s1 = str1;
    const char* s2 = str2;

    for (; i < len1; i++){
        if (tolower(s1[i]) != tolower(s2[i])) {
            return false;
        }
    }
    return true;
}

bool _tStrEqual(const void* str1, const void* str2){
    
    if (_tPtrEqual(str1, str2)){
        return true;
    } 

    if (str1 == NULL || str2 == NULL){
        return false;
    }

    if (strcmp(str1, str2) == 0){
        return true;
    }else{
        return false;
    }
}

bool _tPropEqual(const Property* prop1, const Property* prop2){
    if (prop1 == NULL || prop2 == NULL){
        return false;
    }
    
    //Property names are case insensitive
    if (!_tStrEqualIgnCase(prop1->propName, prop2->propName)){
        return false;
    }

    if (!_tStrEqual(prop1->propDescr, prop2->propDescr)){
        return false;
    }

    return true;

    /*
    if ((strcmp(prop1->propName, prop2->propName) == 0) && (strcmp(prop1->propDescr, prop2->propDescr) == 0)){
        return true;
    }else{
        return false;
    }*/
}

bool _tContainsProp(List* list, const Property* prop){
    Node* ptr = list->head;
    
    while(ptr != NULL){
        Property* currProp = (Property*)ptr->data;
        if (_tPropEqual(prop, currProp)){
            return true;
        }
        ptr = ptr->next;
    }
    return false;
}

Property* _tCreateTestProp(char* propName, char* propDescr){
    Property* prop;
    
    prop = malloc(sizeof(Property) + (sizeof(char)*(strlen(propDescr)+1)) );
    strcpy(prop->propName, propName);
    strcpy(prop->propDescr, propDescr);
    
    return prop;
}

Alarm* _tCreateTestAlarm(char* action, char* trigger){
    Alarm* alarm;
    
    //Init alarm
    alarm = malloc(sizeof(Alarm));
    strcpy(alarm->action, action);

    //Init trigger
    alarm->trigger = malloc(sizeof(char) * (strlen(trigger) + 1));
    strcpy(alarm->trigger, trigger);
    
    //Init prop list
    alarm->properties = _tInitializeList(printProperty, deleteProperty, compareProperties);
    
    return alarm;
}

Event* _tCreateTestEvent(char* UID, DateTime dtStamp, DateTime dtStart){
    Event* event;
    
    //Init alarm
    event = malloc(sizeof(Event));
    strcpy(event->UID, UID);

    event->creationDateTime = dtStamp;
    event->startDateTime = dtStart;

    //Init prop and alarm lists
    event->properties = _tInitializeList(printProperty, deleteProperty, compareProperties);
    event->alarms = _tInitializeList(printAlarm, deleteAlarm, compareAlarms);
    
    return event;
}

Calendar* _tCreateTestCalendar(char* prodID, float version){
    Calendar* cal = malloc(sizeof(Calendar));
    cal->version = version;
    strcpy(cal->prodID, prodID);
    cal->events = _tInitializeList(printEvent, deleteEvent, compareEvents);
    cal->properties = _tInitializeList(printProperty, deleteProperty, compareProperties);

    return cal;
}

DateTime _tCreateTestDateTime(char* date, char* time, bool UTC){
    DateTime tempDT;

    tempDT.UTC = UTC;
    strcpy(tempDT.date, date);
    strcpy(tempDT.time, time);
    
    return tempDT;
}


bool _tDTEqual(DateTime testDT, DateTime refDT){
    //printf("Dates: %s %s\n", testDT.date, refDT.date);
    //printf("Times: %s %s\n", testDT.time, refDT.time);
    if (strcmp(testDT.date, refDT.date) == 0 &&
        strcmp(testDT.time, refDT.time) == 0 &&
        testDT.UTC == refDT.UTC){
        return true;
    }else{
        return false;
    }
    
}

bool _tPropListEqual(List* testList, List* refList){
    
    Node* ptr = refList->head;
    while(ptr != NULL){
        //For every reference property, see if the test prop list contains it
        Property* currRefProp = (Property*)ptr->data;
        if (!_tContainsProp(testList, currRefProp)){
           //printf("TEST LIST PROPS not equal %s:%s\n", currRefProp->propName, currRefProp->propDescr);
            return false;
        }
        ptr = ptr->next;
    }
    
    ptr = testList->head;
    while(ptr != NULL){
        //For every test property, see if the reference prop list contains it
        Property* currTestProp = (Property*)ptr->data;
        if (!_tContainsProp(refList, currTestProp)){
            //printf("REF LIST PROPS not equal %s:%s\n", currTestProp->propName, currTestProp->propDescr);
            return false;
        }
        ptr = ptr->next;
    }
    
    return true;
}

bool _tAlarmEqual(const Alarm* testAlarm, const Alarm* refAlarm){
    if (testAlarm == NULL || refAlarm == NULL){
        return false;
    }
    
    //Compare action
    if (!_tStrEqualIgnCase(testAlarm->action, refAlarm->action)){
        //printf("ALARM action not equal %s : %s\n", testAlarm->action, refAlarm->action);
        return false;
    }
    
    //Compare trigger
    if (testAlarm->trigger == NULL || refAlarm->trigger == NULL || !_tStrEqualIgnCase(testAlarm->action, refAlarm->action)){
        //printf("ALARM trigger not equal %s %s\n", testAlarm->trigger, refAlarm->trigger);
        return false;
    }
    
    //Compare properties
    if (!_tPropListEqual(testAlarm->properties, refAlarm->properties)){
        //printf("ALARM: Properties not equal\n");
        return false;
    }
    
    return true;
}

bool _tContainsAlarm(List* list, const Alarm* alarm){
    Node* ptr = list->head;
    
    while(ptr != NULL){
        Alarm* currAlarm = (Alarm*)ptr->data;
        if (_tAlarmEqual(alarm, currAlarm)){
            return true;
        }
        ptr = ptr->next;
    }
    return false;
}

bool _tAlarmListEqual(List* testList, List* refList){
    
    Node* ptr = refList->head;
    while(ptr != NULL){
        //For every reference alarm, see if the test alarm list contains it
        Alarm* currRefAlarm = (Alarm*)ptr->data;
        if (!_tContainsAlarm(testList, currRefAlarm)){
            return false;
        }
        ptr = ptr->next;
    }
    
    ptr = testList->head;
    while(ptr != NULL){
        //For every test alarm, see if the test alarm list contains it
        Alarm* currTestAlarm = (Alarm*)ptr->data;
        if (!_tContainsAlarm(refList, currTestAlarm)){
            return false;
        }
        ptr = ptr->next;
    }
    
    
    return true;
}

bool _tEventEqual(const Event* testEvent, const Event* refEvent){
    if (testEvent == NULL || refEvent == NULL){
        return false;
    }
    
    //Compare UID
    if (!_tStrEqual(testEvent->UID, refEvent->UID)){
        return false;
    }
    //Compare creationDateTime
    if (!_tDTEqual(testEvent->creationDateTime, refEvent->creationDateTime)){

        return false;
    }
    
    //Compare property lists
    if (!_tPropListEqual(testEvent->properties, refEvent->properties)){

        return false;
    }
    
    //Compare alarm lists
    if (!_tAlarmListEqual(testEvent->alarms, refEvent->alarms)){

        return false;
    }
    
    return true;
}

bool _tContainsEvent(List* list, const Event* event) {
    Node *ptr = list->head;

    while(ptr != NULL) {

        Event* evnt = (Event*)ptr->data;
        if (_tEventEqual(evnt, event)) {
            return true;
        }
        ptr = ptr->next;
    }
    return false;
}

bool _tEventListEqual(List* testList, List* refList) {

    if (testList->length != refList->length) {
        return false;
    }

    Node* ptr = refList->head;
    while(ptr != NULL) {
        Event* evnt = (Event*)ptr->data;
        if (!_tContainsEvent(testList, evnt)){
            //printf("Event Not Contained!\n");
            return false;
        }
        ptr = ptr->next;
    }

    ptr = testList->head;
    while(ptr != NULL) {
        Event* evnt = (Event*)ptr->data;
        if (!_tContainsEvent(refList, evnt)){
            return false;
        }
        ptr = ptr->next;
    }

    return true;
}

bool _tCalEqual(const Calendar* testCal, const Calendar* refCal){
    
    if (testCal == refCal && testCal == NULL){
        return true;
    }
    
    if (testCal == NULL || refCal == NULL){
        return false;
    }

    //Compare version
    if (testCal->version != refCal->version){
        printf("Incorrect Version\n");
        return false;
    }

    //Compare prodID
    if (strcmp(testCal->prodID, refCal->prodID) != 0){
        printf("Incorrect prodID\n");
        return false;
    }

    //Compare events
    if (!_tEventListEqual(testCal->events, refCal->events)){
        printf("Incorrect Events!\n");
        return false;
    }

    return true;
}

List* _tInitWithExisting(List* lst) {
    List* list;

    list = malloc(sizeof(List));
    list->deleteData = lst->deleteData;
    list->printData = lst->printData;
    list->compare = lst->compare;
    list->head = NULL;
    list->tail = NULL;
    list->length = 0;
    return list;
}
