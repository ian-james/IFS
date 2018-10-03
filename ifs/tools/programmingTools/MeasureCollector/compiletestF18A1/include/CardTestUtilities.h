#ifndef VCARD_TEST_UTILITIES_H
#define VCARD_TEST_UTILITIES_H

#include <string.h>
#include <signal.h>
#include <stdlib.h>
#include <stdio.h>
#include <assert.h>

#include <unistd.h>
#include <sys/types.h>
#include <errno.h>
#include <sys/wait.h>

#include "LinkedListAPI.h"
#include "VCardParser.h"
#include "TestHarness.h"

//******************************** HELPER FUNCTIONS ********************************

//******************************** LIST FUNCTIONS ********************************
void _tDummyDelete(void* toBeDeleted);
char* _tDummyPrint(void* toBePrinted);
int _tDummyCompare(const void* first,const void* second);

List* _tInitializeList(char* (*printFunction)(void* toBePrinted),void (*deleteFunction)(void* toBeDeleted),int (*compareFunction)(const void* first,const void* second));
Node* _tInitializeNode(void* data);
void _tInsertBack(List* list, void* toBeAdded);

bool _tListEqual(List* testList, List* refList, bool (*isEqual)(const void* test, const void* ref));
bool _tContains(List* list, const void* value, bool (*isEqual)(const void* test, const void* ref));
void _tPrintList(char* message, List* list);

//******************************** CONSTRUCTOR FUNCTIONS ********************************

void _tInitStr(char** str, const char* val);
void _tAddPropValue(Property* prop, char* val);
void _tAddPropParam(Property* prop, char* pName, char* pVal);
Parameter* _tCreateTestParam(char* parName, char* parDescr);
Property* _tCreateTestProp(char* propName, char* propGroup);

//******************************** COMPARISON FUNCTIONS ********************************

bool _tPtrCmp(const void* str1, const void* str2);
bool _tStrEqual(const void* str1, const void* str2);
bool _tValueEqual(const void *first, const void *second);
bool _tParamEqual(const void* param1, const void* param2);
bool _tPropEqual(const void* prop1, const void* prop2);
bool _tObjEqual(const Card* card1, const Card* card2);


void _tPrintObj(char* message, Card* obj);

#endif
