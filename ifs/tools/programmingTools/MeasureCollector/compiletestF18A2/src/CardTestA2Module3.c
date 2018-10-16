#include "CardTestUtilities.h"


//******************************** Test 1 ********************************
static List* _tEmptyVList(void){
    List* l = _tInitializeList(&printValue, &deleteValue, &compareValues);
    return l;
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
    
    sprintf(feedback, "Test %d: strListToJSON (NULL list and empty list)", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tVListToJInv1);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tVListToJInv2);
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
    
    sprintf(feedback, "Test %d: JSONtoStrList (NULL string)", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tJtoVListInv1);
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
    
    sprintf(feedback, "Test %d: propToJSON (NULL Property)", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tPtoJInv1);
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
    
    sprintf(feedback, "Test %d: JSONtoProp (NULL string)", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tJtoPInv1);
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
    
    sprintf(feedback, "Test %d: dtToJSON (NULL DateTime)", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tDTtoJInv1);
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
    
    sprintf(feedback, "Test %d: JSONtoDT (NULL string)", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tJtoDTInv1);
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
    
    sprintf(feedback, "Test %d: JSONtoCard (NULL string)", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tJtoCInv1);
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
    
    sprintf(feedback, "Test %d: addProperty (NULL args)", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tAddPropInv1);
    return rec;
}

