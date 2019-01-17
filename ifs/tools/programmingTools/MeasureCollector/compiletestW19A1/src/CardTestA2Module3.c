#include "CardTestUtilities.h"


//******************************** Test 1 ********************************
static List* _tEmptyVList(void){
    List* l = _tInitializeList(&printValue, &deleteValue, &compareValues);
    return l;
}

static Card* minValid(void)

{
    Card* card = malloc(sizeof(Card));
    
    //Set FN property
    card->fn = _tCreateTestProp("FN",NULL);
    _tAddPropValue(card->fn, "Simon Perreault");

    card->optionalProperties = _tInitializeList(&printProperty, &deleteProperty, &compareProperties);
    card->birthday = NULL;
    card->anniversary = NULL;
    
    return card;
}

static Card* testCardPropSimpleVal(void)
{
    Card* card = malloc(sizeof(Card));
    
    //Set FN property
    card->fn = _tCreateTestProp("FN",NULL);
    _tAddPropValue(card->fn, "Simon Perreault");

    card->optionalProperties = _tInitializeList(&printProperty, &deleteProperty, &compareProperties);
    card->birthday = NULL;
    card->anniversary = NULL;

    Property* prop = _tCreateTestProp("GENDER",NULL);
    _tAddPropValue(prop, "M");
    _tInsertBack(card->optionalProperties, prop);
    
    return card;
}

//******************************** strListToJSON - boundary/invalid args ********************************

static SubTestRec _tVListToJInv1(int testNum, int subTest){
    char feedback[300];
    SubTestRec result;
    char* json;
    
    json = strListToJSON(NULL);
    
    if (json == NULL){
        sprintf(feedback, "Subtest %d.%d: Successfully handled NULL list.",testNum, subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
    else
    {
        sprintf(feedback, "Subtest %d.%d: Failed to handle a NULL list.",testNum, subTest);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

static SubTestRec _tVListToJInv2(int testNum, int subTest){
    char feedback[300];
    SubTestRec result;
    char* json;
    
    json = strListToJSON(_tEmptyVList());
    
    if (strcmp(json, "[]") == 0){
        sprintf(feedback, "Subtest %d.%d: Successfully handled empty list.",testNum, subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
    else
    {
        sprintf(feedback, "Subtest %d.%d: Failed to handle empty list.",testNum, subTest);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

testRec* _tTestStrListToJSONInv(int testNum){
    const int numSubs = 2;
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (2%%): strListToJSON (NULL list and empty list)", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tVListToJInv1);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tVListToJInv2);
    return rec;
}

//******************************** strListToJSON ********************************

static SubTestRec _tVListToJ1(int testNum, int subTest){
    char feedback[300];
    SubTestRec result;

    List* testList = _tInitializeList(&printValue,&deleteValue,&compareValues);
    _tInsertBack(testList, "Foo");

    char refStr[] = "[\"Foo\"]";    
    char* testStr = strListToJSON(testList);
    
    if (strcmp(testStr, refStr) == 0){
        sprintf(feedback, "Subtest %d.%d: Successfully created JSON string from list with 1 element",testNum, subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
    else
    {
        sprintf(feedback, "Subtest %d.%d: Incorrect JSON string created from list with 1 element",testNum, subTest);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

static SubTestRec _tVListToJ2(int testNum, int subTest){
    char feedback[300];
    SubTestRec result;

    List* testList = _tInitializeList(&printValue,&deleteValue,&compareValues);
    _tInsertBack(testList, "Perreault");
    _tInsertBack(testList, "Simon");
    

    char refStr[] = "[\"Perreault\",\"Simon\"]";
    char* testStr = strListToJSON(testList);

    
    if (strcmp(testStr, refStr) == 0){
        sprintf(feedback, "Subtest %d.%d: Successfully created JSON string from list with 2 elements",testNum, subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
    else
    {
        sprintf(feedback, "Subtest %d.%d: Incorrect JSON string created from list with 2 elements",testNum, subTest);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

testRec* _tTestStrListToJSON(int testNum){
    const int numSubs = 2;
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (3%%): strListToJSON (valid arguments)", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tVListToJ1);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tVListToJ2);
    return rec;
}

//******************************** JSONtoStrList - invalid args ********************************

static SubTestRec _tJtoVListInv1(int testNum, int subTest){
    char feedback[300];
    SubTestRec result;
    List* list;
    
    list = JSONtoStrList(NULL);
    
    if (list == NULL){
        sprintf(feedback, "Subtest %d.%d: Successfully handled NULL string.",testNum, subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
    else
    {
        sprintf(feedback, "Subtest %d.%d: Failed to handle a NULL string.",testNum, subTest);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

testRec* _tTestJSONToStrListInv(int testNum){
    const int numSubs = 1;
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (1%%): JSONtoStrList (NULL string)", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tJtoVListInv1);
    return rec;
}

//******************************** JSONtoStrList ********************************

static SubTestRec _tJtoVList1(int testNum, int subTest){
    char feedback[300];
    SubTestRec result;
    char refStr[] = "[\"Foo\"]";
    List* testList = JSONtoStrList(refStr);
    List* refList = _tInitializeList(&printValue,&deleteValue,&compareValues);
    _tInsertBack(refList, "Foo");
    
    if (_tListEqual(testList, refList, &_tValueEqual)){
        sprintf(feedback, "Subtest %d.%d: Successfully created list from JSON string %s.",testNum, subTest, refStr);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
    else
    {
        sprintf(feedback, "Subtest %d.%d: Incorrect list created from JSON string %s.",testNum, subTest, refStr);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

static SubTestRec _tJtoVList2(int testNum, int subTest){
    char feedback[300];
    SubTestRec result;
    char refStr[] = "[\"Perreault\",\"Simon\"]";
    List* testList = JSONtoStrList(refStr);
    List* refList = _tInitializeList(&printValue,&deleteValue,&compareValues);
    _tInsertBack(refList, "Perreault");
    _tInsertBack(refList, "Simon");
    
    if (_tListEqual(testList, refList, &_tValueEqual)){
        sprintf(feedback, "Subtest %d.%d: Successfully created list from JSON string %s.",testNum, subTest, refStr);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
    else
    {
        sprintf(feedback, "Subtest %d.%d: Incorrect list created from JSON string %s.",testNum, subTest, refStr);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

testRec* _tTestJSONToStrList(int testNum){
    const int numSubs = 2;
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (4%%): JSONtoStrList (valid arguments)", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tJtoVList1);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tJtoVList2);
    return rec;
}

//******************************** propToJSON - invalid args ********************************

static SubTestRec _tPtoJInv1(int testNum, int subTest){
    char feedback[300];
    SubTestRec result;
    char* str;
    
    str = propToJSON(NULL);
    
    if (str == NULL){
        sprintf(feedback, "Subtest %d.%d: Successfully handled NULL Property.",testNum, subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
    else
    {
        sprintf(feedback, "Subtest %d.%d: Failed to handle a NULL Property.",testNum, subTest);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

testRec* _tTestPropToJSONInv(int testNum){
    const int numSubs = 1;
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (1%%): propToJSON (NULL Property)", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tPtoJInv1);
    return rec;
}

//******************************** propToJSON ********************************

static SubTestRec _tPtoJ1(int testNum, int subTest){
    char feedback[300];
    SubTestRec result;
    char refStr[] = "{\"group\":\"\",\"name\":\"FN\",\"values\":[\"Simon Perreault\"]}";
    Property* refProp =  _tCreateTestProp("FN",NULL);
    _tAddPropValue(refProp, "Simon Perreault");
    
    char* testStr = propToJSON(refProp);
    
    if (testStr != NULL && strcmp(testStr, refStr) == 0){
        sprintf(feedback, "Subtest %d.%d: Successfully converted Property with 1 value into a JSON string.",testNum, subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
    else
    {
        sprintf(feedback, "Subtest %d.%d: Failed to convert a Property with 1 value into a JSON string.",testNum, subTest);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

static SubTestRec _tPtoJ2(int testNum, int subTest){
    char feedback[300];
    SubTestRec result;
    char refStr[] = "{\"group\":\"\",\"name\":\"N\",\"values\":[\"Perreault\",\"Simon\",\"\",\"\",\"ing. jr,M.Sc.\"]}";
    Property* refProp = _tCreateTestProp("N",NULL);
    _tAddPropValue(refProp, "Perreault");
    _tAddPropValue(refProp, "Simon");
    _tAddPropValue(refProp, "");
    _tAddPropValue(refProp, "");
    _tAddPropValue(refProp, "ing. jr,M.Sc.");
    
    char* testStr = propToJSON(refProp);
    
    if (testStr != NULL && strcmp(testStr, refStr) == 0){
        sprintf(feedback, "Subtest %d.%d: Successfully converted Property with 5 values into a JSON string.",testNum, subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
    else
    {
        sprintf(feedback, "Subtest %d.%d: Failed to convert a Property with 5 values into a JSON string.",testNum, subTest);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

testRec* _tTestPropToJSON(int testNum){
    const int numSubs = 2;
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (2%%): propToJSON", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tPtoJ1);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tPtoJ2);
    return rec;
}


//******************************** JSONToProp - invalid args ********************************

static SubTestRec _tJtoPInv1(int testNum, int subTest){
    char feedback[300];
    SubTestRec result;
    Property* prop;
    
    prop = JSONtoProp(NULL);
    
    if (prop == NULL){
        sprintf(feedback, "Subtest %d.%d: Successfully handled NULL string.",testNum, subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
    else
    {
        sprintf(feedback, "Subtest %d.%d: Failed to handle a NULL string.",testNum, subTest);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

testRec* _tTestJSONToPropInv(int testNum){
    const int numSubs = 1;
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (1%%): JSONtoProp (NULL string)", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tJtoPInv1);
    return rec;
}


//******************************** JSONToProp ********************************

static SubTestRec _tJtoP1(int testNum, int subTest){
    char feedback[300];
    SubTestRec result;
    Property* testProp;
    char refStr[300] = "{\"group\":\"\",\"name\":\"FN\",\"values\":[\"Simon Perreault\"]}";
    
    Property* refProp =  _tCreateTestProp("FN",NULL);
    _tAddPropValue(refProp, "Simon Perreault");

    testProp = JSONtoProp(refStr);
    
    if (_tPropEqual(refProp, testProp)){
        sprintf(feedback, "Subtest %d.%d: Successfully created a Property from JSON string %s",testNum, subTest, refStr);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
    else
    {
        sprintf(feedback, "Subtest %d.%d: did not correctly create a Property from JSON string %s",testNum, subTest, refStr);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

static SubTestRec _tJtoP2(int testNum, int subTest){
    char feedback[300];
    SubTestRec result;
    Property* testProp;
    char refStr[] = "{\"group\":\"\",\"name\":\"TEL\",\"values\":[\"+1-418-656-9254\",\"ext=102\"]}";
    Property* refProp = _tCreateTestProp("TEL",NULL);
    _tAddPropValue(refProp, "+1-418-656-9254");
    _tAddPropValue(refProp, "ext=102");

    testProp = JSONtoProp(refStr);
    
    if (_tPropEqual(refProp, testProp)){
        sprintf(feedback, "Subtest %d.%d: Successfully created a Property from JSON string %s",testNum, subTest, refStr);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
    else
    {
        sprintf(feedback, "Subtest %d.%d: did not correctly create a Property from JSON string %s",testNum, subTest, refStr);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

testRec* _tTestJSONToProp(int testNum){
    const int numSubs = 2;
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (4%%): JSONtoProp", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tJtoP1);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tJtoP2);
    return rec;
}

//******************************** dtToJSON - invalid args ********************************

static SubTestRec _tDTtoJInv1(int testNum, int subTest){
    char feedback[300];
    SubTestRec result;
    char* str;
    
    str = dtToJSON(NULL);
    
    if (str == NULL){
        sprintf(feedback, "Subtest %d.%d: Successfully handled NULL DateTime.",testNum, subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
    else
    {
        sprintf(feedback, "Subtest %d.%d: Failed to handle a NULL DateTime.",testNum, subTest);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

testRec* _tTestDTtoJSONInv(int testNum){
    const int numSubs = 1;
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (1%%): dtToJSON (NULL DateTime)", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tDTtoJInv1);
    return rec;
}


//******************************** dtToJSON ********************************

static SubTestRec _tDTtoJ1(int testNum, int subTest){
    char feedback[300];
    SubTestRec result;
    DateTime* refDT = _tCreateTestDateTime("","",false,true,"circa 1960");
    char refStr[] = "{\"isText\":true,\"date\":\"\",\"time\":\"\",\"text\":\"circa 1960\",\"isUTC\":false}";

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
    DateTime* refDT = _tCreateTestDateTime("19540203","123012",true,false,"");
    char refStr[] = "{\"isText\":false,\"date\":\"19540203\",\"time\":\"123012\",\"text\":\"\",\"isUTC\":true}";

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
    
    sprintf(feedback, "Test %d (3%%): dtToJSON", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tDTtoJ1);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tDTtoJ2);

    return rec;
}

//******************************** JSONtoDT - invalid args ********************************

static SubTestRec _tJtoDTInv1(int testNum, int subTest){
    char feedback[300];
    SubTestRec result;
    DateTime* dt;
    
    dt = JSONtoDT(NULL);
    
    if (dt == NULL){
        sprintf(feedback, "Subtest %d.%d: Successfully handled NULL string.",testNum, subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
    else
    {
        sprintf(feedback, "Subtest %d.%d: Failed to handle a NULL string.",testNum, subTest);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

testRec* _tTestJSONtoDTInv(int testNum){
    const int numSubs = 1;
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (1%%): JSONtoDT (NULL string)", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tJtoDTInv1);
    return rec;
}


//******************************** JSONtoDT ********************************

static SubTestRec _tJtoDT1(int testNum, int subTest){
    char feedback[300];
    SubTestRec result;
    DateTime* testDT;
    DateTime* refDT = _tCreateTestDateTime("","",false,true,"circa 1960");
    char refStr[] = "{\"isText\":true,\"date\":\"\",\"time\":\"\",\"text\":\"circa 1960\",\"isUTC\":false}";
    
    testDT = JSONtoDT(refStr);
    
    if (testDT != NULL && _tDateTimeEqual(testDT, refDT)){
        sprintf(feedback, "Subtest %d.%d: corectly created a DateDtime from JSON string %s.",testNum, subTest, refStr);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
    else
    {
        sprintf(feedback, "Subtest %d.%d: Failed to correctly create a DateDtime from JSON string %s",testNum, subTest, refStr);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

static SubTestRec _tJtoDT2(int testNum, int subTest){
    char feedback[300];
    SubTestRec result;
    DateTime* testDT;
    DateTime* refDT = _tCreateTestDateTime("19540203","123012",true,false,"");
    char refStr[] = "{\"isText\":false,\"date\":\"19540203\",\"time\":\"123012\",\"text\":\"\",\"isUTC\":true}";
    
    testDT = JSONtoDT(refStr);
    
    if (testDT != NULL && _tDateTimeEqual(testDT, refDT)){
        sprintf(feedback, "Subtest %d.%d: corectly created a DateDtime from JSON string %s.",testNum, subTest, refStr);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
    else
    {
        sprintf(feedback, "Subtest %d.%d: Failed to correctly create a DateDtime from JSON string %s",testNum, subTest, refStr);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

testRec* _tTestJSONtoDT(int testNum){
    const int numSubs = 2;
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (4%%): JSONtoDT ", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tJtoDT1);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tJtoDT2);
    return rec;
}

//******************************** JSONtoCard - invalid args ********************************
static SubTestRec _tJtoCInv1(int testNum, int subTest){
    char feedback[300];
    SubTestRec result;
    DateTime* dt;
    
    dt = JSONtoDT(NULL);
    
    if (dt == NULL){
        sprintf(feedback, "Subtest %d.%d: Successfully handled NULL string.",testNum, subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
    else
    {
        sprintf(feedback, "Subtest %d.%d: Failed to handle a NULL string.",testNum, subTest);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

testRec* _tTestJSONtoCardInv(int testNum){
    const int numSubs = 1;
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (1%%): JSONtoCard (NULL string)", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tJtoCInv1);
    return rec;
}


//******************************** JSONtoCard ********************************
static SubTestRec _tJtoC1(int testNum, int subTest){
    char feedback[300];
    SubTestRec result;

    Card* refCard = minValid();
    char refStr[300] = "{\"FN\":\"Simon Perreault\"}";
    Card* testCard; 

    testCard = JSONtoCard(refStr);


    if (testCard != NULL && _tObjEqual(refCard, testCard)){
        sprintf(feedback, "Subtest %d.%d: correctly created a Card from JSON string %s",testNum, subTest, refStr);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: failed to correctly create a Card from JSON string %s",testNum, subTest, refStr);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

testRec* _tTestJSONtoCard(int testNum){
    const int numSubs = 1;
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (2%%): JSONtoCard", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tJtoC1);
    return rec;
}


//******************************** addProperty - invalid args ********************************
static SubTestRec _tAddPropInv1(int testNum, int subTest){
    char feedback[300];
    SubTestRec result;
        
    addProperty(NULL, NULL);
    
    sprintf(feedback, "Subtest %d.%d: Successfully handled NULL Card and NULL property.",testNum, subTest);
    result = createSubResult(SUCCESS, feedback);
    return result;
}

testRec* _tTestAddPropInv(int testNum){
    const int numSubs = 1;
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (1%%): addProperty (NULL args)", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tAddPropInv1);
    return rec;
}


//******************************** addProperty ********************************
static SubTestRec _tAddProp1(int testNum, int subTest){
    char feedback[300];
    SubTestRec result;

    Card* refCard = testCardPropSimpleVal();
    Card* card = minValid();

    Property* prop = _tCreateTestProp("GENDER",NULL);
    _tAddPropValue(prop, "M");
        
    addProperty(card, prop);

    if (card!=NULL && _tObjEqual(refCard, card)){
        sprintf(feedback, "Subtest %d.%d: correctly added a reference property to a reference card.",testNum, subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: did not correctly add a reference property to a reference card.",testNum, subTest);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

testRec* _tTestAddProp(int testNum){
    const int numSubs = 1;
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (2%%): addProperty", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tAddProp1);
    return rec;
}