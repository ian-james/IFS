//
//  GEDCOMTestUtilities.c
//  
//
//  Created by Denis Nikitenko on 2018-02-02.
//

#include <stdio.h>
#include "CardTestUtilities.h"

//******************************** HELPER FUNCTIONS ********************************


//******************************** LIST FUNCTIONS ********************************
void _tDummyDelete(void* toBeDeleted){}
char* _tDummyPrint(void* toBePrinted){ return NULL;}
int _tDummyCompare(const void* first,const void* second){return 0;}

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

Node* _tInitializeNode(void* data){
	Node* tmpNode = (Node*)malloc(sizeof(Node));
	
	if (tmpNode == NULL){
		return NULL;
	}
	
	tmpNode->data = data;
	tmpNode->previous = NULL;
	tmpNode->next = NULL;
	
	return tmpNode;
}

/**Inserts a Node at the front of a linked list.  List metadata is updated
 * so that head and tail pointers are correct.
 *@pre 'List' type must exist and be used in order to keep track of the linked list.
 *@param list pointer to the _tDummy head of the list
 *@param toBeAdded a pointer to data that is to be added to the linked list
 **/
void _tInsertBack(List* list, void* toBeAdded){
    if (list == NULL || toBeAdded == NULL){
        return;
    }
    
    Node* newNode = _tInitializeNode(toBeAdded);
    list->length += 1;
    if (list->head == NULL && list->tail == NULL){
        list->head = newNode;
        list->tail = list->head;
    }else{
        newNode->previous = list->tail;
        list->tail->next = newNode;
        list->tail = newNode;
    }
    
}

bool _tListEqual(List* testList, List* refList, bool (*isEqual)(const void* test, const void* ref)){
    
    if (refList->head == NULL && testList->head == NULL && refList->tail == NULL && testList->tail == NULL){
        return true;
    }

    //For every reference object, see if the test list contains it
    //int i = 0;
    for (Node* ptr = refList->head; ptr != NULL; ptr = ptr->next){
        //    printf("i = %d\n", i);
        if (!_tContains(testList, ptr->data, isEqual)){
            return false;
        }
        //      printf("Found %dth element of test list\n", i++);
    }
    //    printf("Found references in test list!\n");
    
    
    //For every test object, see if the reference list contains it
    for (Node* ptr = testList->head; ptr != NULL; ptr = ptr->next){
        if (!_tContains(refList, ptr->data, isEqual)){
            return false;
        }
    }
    
    return true;
}

bool _tContains(List* list, const void* value, bool (*isEqual)(const void* test, const void* ref)){
    
    for (Node* ptr = list->head; ptr != NULL; ptr = ptr->next){
        if (isEqual(value, ptr->data)){
            //           printf("Contains!\n");
            return true;
        }
    }
    return false;
}

void _tPrintList(char* message, List* list){
    char* listStr = toString(list);
    printf("%s %s\n", message, listStr);
    free(listStr);
}


void _tPrintObj(char* message, Card* obj){
    char* str = printCard(obj);
    printf("%s %s\n", message, str);
    free(str);
}

//******************************** STRUCT CREATION FUNCTIONS ********************************

void _tInitStr(char** str, const char* val){
    *str = malloc(strlen(val)+1);
    strcpy(*str, val);
}

Parameter* _tCreateTestParam(char* parName, char* parValue){
    Parameter* param;
    
    param = malloc(sizeof(Parameter) + (sizeof(char)*(strlen(parValue)+1)) );
    strcpy(param->name, parName);
    strcpy(param->value, parValue);
    
    return param;
}

void _tAddPropValue(Property* prop, char* val){
    char* insertVal;
    if (val == NULL){
        return;
    }
    _tInitStr(&insertVal, val);
    _tInsertBack(prop->values, insertVal);
}

void _tAddPropParam(Property* prop, char* pName, char* pVal){

    Parameter* tmpParam = _tCreateTestParam(pName, pVal);
    
    _tInsertBack(prop->parameters, tmpParam);
}


Property* _tCreateTestProp(char* propName, char* propGroup){
	Property* tmpProp;
    
    tmpProp = (Property*)malloc(sizeof(Property));
    tmpProp->parameters = initializeList(&printParameter, &deleteParameter, &compareParameters);
	tmpProp->values = initializeList(&printValue, &deleteValue, &compareValues);

    _tInitStr(&tmpProp->name, propName);
    if (propGroup != NULL) {
        _tInitStr(&tmpProp->group, propGroup);
    }else{
        tmpProp->group = NULL;
    }

    return tmpProp;
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

//Check for equality if strings, checking the pointers
bool _tStrEqual(const void* str1, const void* str2){
    
    if (_tPtrEqual(str1, str2)){
        return true;
    } 
    
    if (strcmp(str1, str2) == 0){
        return true;
    }else{
        return false;
    }
}

bool _tValueEqual(const void *first, const void *second){
	return _tStrEqual(first, second);
}

bool _tParamEqual(const void* param1, const void* param2){
    if (param1 == NULL || param2 == NULL){
        return false;
    }

    Parameter* tmpParam1;
	Parameter* tmpParam2;
	
	if (param1 == NULL || param2 == NULL){
		return 0;
	}
	
	tmpParam1 = (Parameter*)param1;
	tmpParam2 = (Parameter*)param2;
    
    if (!_tStrEqual(tmpParam1->name, tmpParam2->name)){
        return false;
    }

    if (!_tStrEqual(tmpParam1->value, tmpParam2->value)){
        return false;
    }
    
    return true;
}

bool _tPropEqual(const void* prop1, const void* prop2){

    Property* tmpProp1;
	Property* tmpProp2;
	
	if (prop1 == NULL || prop2 == NULL){
		return 0;
	}
	
	tmpProp1 = (Property*)prop1;
	tmpProp2 = (Property*)prop2;

    //Check prop names
    
    if (!_tStrEqual(tmpProp1->name, tmpProp2->name)){
        //printf("Prop names %s and %s are NOT equal\n", tmpProp1->name, tmpProp2->name);
        return false;
    }
    // else{
    //     printf("Prop names %s and %s are equal\n", tmpProp1->name, tmpProp2->name);
    // }

    //Check prop groups
    if (!_tStrEqual(tmpProp1->group, tmpProp2->group)) {
        return false;
    }


    //Check prop parameter lists   
    if (!_tListEqual(tmpProp1->parameters, tmpProp2->parameters, &_tParamEqual)){
        return false;
    }

    // printf("%s\n", tmpProp1->name);
    // _tPrintList("Refe prop value list: ",tmpProp1->values);
    // printf("%s\n", tmpProp2->name);
    // _tPrintList("Test prop value list: ",tmpProp2->values);


    //Check prop value lists
    if (!_tListEqual(tmpProp1->values, tmpProp2->values, &_tValueEqual)){
        return false;
    }

    
    return true;
}

bool _tObjEqual(const Card* card1, const Card* card2){
    if (card1 == NULL || card2 == NULL){
        return false;
    }

    //Check fn
    if (!_tPropEqual(card1->fn, card2->fn)){
        return false;
    }

    //Check birthday

    //Check anniversary

    //Check optional properties
    
    if (!_tListEqual(card1->optionalProperties, card2->optionalProperties, &_tPropEqual)){
        return false;
    }
    

    return true;
}

