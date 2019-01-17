#include "CardTestUtilities.h"

static Card* _tCardFnN(void)
{
    Card* card = malloc(sizeof(Card));
    
    //Set FN property
   // printf("cardFnN start\n");
    card->fn = _tCreateTestProp("FN",NULL);
    _tAddPropValue(card->fn, "Simon Perreault");

    card->optionalProperties = _tInitializeList(&printProperty, &deleteProperty, &compareProperties);


    Property* prop = _tCreateTestProp("N",NULL);
    _tAddPropValue(prop, "Perreault");
    _tAddPropValue(prop, "Simon");
    _tAddPropValue(prop, "");
    _tAddPropValue(prop, "");
    _tAddPropValue(prop, "ing. jr,M.Sc.");

    _tInsertBack(card->optionalProperties, prop);

    card->birthday = NULL;
    card->anniversary = NULL;
  //  printf("cardFnN end\n");
    return card;
}

static Card* _tTestCardFromRFC(void)
{
    Card* card = malloc(sizeof(Card));
    
    //Set FN property
    card->fn = _tCreateTestProp("FN",NULL);
    _tAddPropValue(card->fn, "Simon Perreault");

    card->optionalProperties = _tInitializeList(&printProperty, &deleteProperty, &compareProperties);
    card->birthday = _tCreateTestDateTime("--0203","",false,false,NULL);
    card->anniversary = _tCreateTestDateTime("20090808","143000",false,false,NULL);
  
    Property* prop = _tCreateTestProp("N",NULL);
    _tAddPropValue(prop, "Perreault");
    _tAddPropValue(prop, "Simon");
    _tAddPropValue(prop, "");
    _tAddPropValue(prop, "");
    _tAddPropValue(prop, "ing. jr,M.Sc.");
    _tInsertBack(card->optionalProperties, prop);


    prop = _tCreateTestProp("GENDER",NULL);
    _tAddPropValue(prop, "M");
    _tInsertBack(card->optionalProperties, prop);


    prop = _tCreateTestProp("LANG",NULL);
    _tAddPropParam(prop, "PREF","1");
    _tAddPropValue(prop, "fr");
    _tInsertBack(card->optionalProperties, prop);


    prop = _tCreateTestProp("LANG",NULL);
    _tAddPropParam(prop, "PREF","2");
    _tAddPropValue(prop, "en");
    _tInsertBack(card->optionalProperties, prop);

    
    prop = _tCreateTestProp("ORG",NULL);
    _tAddPropParam(prop, "TYPE","work");
    _tAddPropValue(prop, "Viagenie");
    _tInsertBack(card->optionalProperties, prop);


    prop = _tCreateTestProp("ADR",NULL);
    _tAddPropParam(prop, "TYPE","work");
    _tAddPropValue(prop, "");
    _tAddPropValue(prop, "Suite D2-630");
    _tAddPropValue(prop, "2875 Laurier");
    _tAddPropValue(prop, "Quebec");
    _tAddPropValue(prop, "QC");
    _tAddPropValue(prop, "G1V 2M2");
    _tAddPropValue(prop, "Canada");
    _tInsertBack(card->optionalProperties, prop);


    prop = _tCreateTestProp("TEL",NULL);
    _tAddPropParam(prop, "VALUE","uri");
    _tAddPropParam(prop, "TYPE","\"work,cell,voice,video,text\"");
    _tAddPropValue(prop, "tel:+1-418-262-6501");
    _tInsertBack(card->optionalProperties, prop);

    prop = _tCreateTestProp("URL",NULL);
    _tAddPropParam(prop, "TYPE","home");
    _tAddPropValue(prop, "http://nomis80.org");
    _tInsertBack(card->optionalProperties, prop);


    prop = _tCreateTestProp("TEL",NULL);
    _tAddPropParam(prop, "VALUE","uri");
    _tAddPropParam(prop, "TYPE","\"work,voice\"");
    _tAddPropParam(prop, "PREF","1");

    _tAddPropValue(prop, "tel:+1-418-656-9254");
    _tAddPropValue(prop, "ext=102");

    _tInsertBack(card->optionalProperties, prop);
    
    
    prop = _tCreateTestProp("EMAIL",NULL);
    _tAddPropParam(prop, "TYPE","work");
    _tAddPropValue(prop, "simon.perreault@viagenie.ca");
    _tInsertBack(card->optionalProperties, prop);


    prop = _tCreateTestProp("GEO",NULL);
    _tAddPropParam(prop, "TYPE","work");
    _tAddPropValue(prop, "geo:46.772673,-71.282945");
    _tInsertBack(card->optionalProperties, prop);


    prop = _tCreateTestProp("KEY",NULL);
    _tAddPropParam(prop, "TYPE","work");
    _tAddPropParam(prop, "VALUE","uri");
    _tAddPropValue(prop, "http://www.viagenie.ca/simon.perreault/simon.asc");
    _tInsertBack(card->optionalProperties, prop);


    prop = _tCreateTestProp("TZ",NULL);
    _tAddPropValue(prop, "-0500");
    _tInsertBack(card->optionalProperties, prop);

    return card;
}

//********************* Test printCard ***********************

static SubTestRec _tPrintCardTest1(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    char fileName[] = "testFiles/valid/testCardN-compVal.vcf";
    
    Card* testObj;
    
    VCardErrorCode err = createCard(fileName, &testObj);
    if (err != OK){
        sprintf(feedback, "Subtest %d.%d: Unable to test trintCard due to failure of createCard to open a valid file (%s).",testNum,subTest, fileName);
        result = createSubResult(FAIL, feedback);
        return result;
    }
    
    char* calStr = printCard(testObj);
   // fprintf(stderr, "%s\n", calStr);
    if(calStr != NULL && strlen(calStr) > 0)
    {
        sprintf(feedback, "Subtest %d.%d: Printed Card object created by createCard() from a valid file (%s).",testNum,subTest,fileName);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
    else
    {
        sprintf(feedback, "Subtest %d.%d: printCard returned null or empty string for a Card object created by createCard() from a valid file (%s)",testNum,subTest,fileName);
        result = createSubResult(FAIL, feedback);
        return result;
    }
    free(calStr);
    
}

static SubTestRec _tPrintCardTest2(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];

    Card* testObj = _tCardFnN();
    
    char* calStr = printCard(testObj);
  //  fprintf(stderr, "%s\n", calStr);
    if(calStr != NULL && strlen(calStr) > 0)
    {
        sprintf(feedback, "Subtest %d.%d: Printed a vallid non-NULL reference Card object.",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
    else
    {
        sprintf(feedback, "Subtest %d.%d: printCard returned null or empty string for a valid non-NULL reference Card object",testNum,subTest);
        result = createSubResult(FAIL, feedback);
        return result;
    }
    free(calStr);
    
}

static SubTestRec _tPrintCardTest3(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    
    char* calStr = printCard(NULL);
    
    if(calStr == NULL || calStr != NULL )
    {
        sprintf(feedback, "Subtest %d.%d: printCard handled NULL Card object correctly.",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
    else
    {
        sprintf(feedback, "Subtest %d.%d: printCard did not handle NULL Card object correctly",testNum,subTest);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

static SubTestRec _tPrintCardTest4(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    
    Card* testObj = _tTestCardFromRFC();
    
    char* calStr = printCard(testObj);
   // fprintf(stderr, "%s\n", calStr);
    if(calStr != NULL && strlen(calStr) > 0)
    {
        sprintf(feedback, "Subtest %d.%d: Printed a reference Card object.",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
    else
    {
        sprintf(feedback, "Subtest %d.%d: printCard returned null or empty string for a reference Card object",testNum,subTest);
        result = createSubResult(FAIL, feedback);
        return result;
    }
    free(calStr);
    
}

testRec* _tPrintCardTests(int testNum){
    const int numSubs = 4;  //doesn't need to be a variable but its a handy place to keep it
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (5%%): Testing printCard", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tPrintCardTest1);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tPrintCardTest2);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tPrintCardTest3);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tPrintCardTest4);
    return rec;
}
//***************************************************************

//********************** Test printError ************************

static char * errVals[] = {
    "OK", "INV_FILE", "INV_CARD", "INV_PROP", "WRITE_ERROR", "OTHER_ERROR", "Invalid error code"};

static char* _tPrintError(VCardErrorCode err){
    if (err <= 5)
        return errVals[err];
    else
        return errVals[6];
}

static SubTestRec _tPrintErrorTest1(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    
    for (int i = 0; i < 6; i++){
        char* errStr = (void*) printError(i);
        if (errStr == NULL){
            sprintf(feedback, "Subtest %d.%d: printError returns NULL for error code %d (%s)",testNum,subTest,i, _tPrintError(i));
            result = createSubResult(FAIL, feedback);
            return result;
        }
        
        if (strlen(errStr) == 0){
            sprintf(feedback, "Subtest %d.%d: printError returns an empty string for error code %d (%s)",testNum,subTest,i, _tPrintError(i));
            result = createSubResult(FAIL, feedback);
            return result;
        }
    }
    
    sprintf(feedback, "Subtest %d.%d: printError test",testNum,subTest);
    result = createSubResult(SUCCESS, feedback);
    return result;
}

testRec* _tPrintCardErrorTest(int testNum){
    const int numSubs = 1;  //doesn't need to be a variable but its a handy place to keep it
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (5%%): Testing printError", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tPrintErrorTest1);
    return rec;
}


//********************* Test deleteClandar **********************
//Calendar deletion - testCalSimpleUTC.ics
static SubTestRec _tDeleteCalTest1(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    char fileName[] = "testFiles/valid/testCardMin.vcf";
    
    Card* testObj = NULL;

    VCardErrorCode err = createCard(fileName, &testObj);

    if (err != OK){
        sprintf(feedback, "Subtest %d.%d: Unable to test deleteCard due to failure of createCard to open a valid file (%s).",testNum,subTest, fileName);
        result = createSubResult(FAIL, feedback);
        return result;
    }
    
    deleteCard(testObj);
    
    sprintf(feedback, "Subtest %d.%d: Card object created from file %s deleted with no crashes",testNum,subTest, fileName);
    result = createSubResult(SUCCESS, feedback);
    return result;
}

static SubTestRec _tDeleteCalTest2(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    char fileName[] = "testFiles/valid/testCard.vcf";
    
    Card* testObj = NULL;

    VCardErrorCode err = createCard(fileName, &testObj);

    if (err != OK){
        sprintf(feedback, "Subtest %d.%d: Unable to test deleteCard due to failure of createCard to open a valid file (%s).",testNum,subTest, fileName);
        result = createSubResult(FAIL, feedback);
        return result;
    }
    
    deleteCard(testObj);
    
    sprintf(feedback, "Subtest %d.%d: Card object created from file %s deleted with no crashes",testNum,subTest, fileName);
    result = createSubResult(SUCCESS, feedback);
    return result;
}

static SubTestRec _tDeleteCalTest3(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    
    Card* testObj = _tCardFnN();

    deleteCard(testObj);
    
    sprintf(feedback, "Subtest %d.%d: Reference card object deleted with no crashes",testNum,subTest);
    result = createSubResult(SUCCESS, feedback);
    return result;
}

static SubTestRec _tDeleteCalTest4(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    
    Card* testObj = _tTestCardFromRFC();

    deleteCard(testObj);
    
    sprintf(feedback, "Subtest %d.%d: Reference card object deleted with no crashes",testNum,subTest);
    result = createSubResult(SUCCESS, feedback);
    return result;
}

testRec* _tDeleteCardTests(int testNum){
    const int numSubs = 4;  //doesn't need to be a variable but its a handy place to keep it
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (5%%): Testing deleteCard on objects created from valid files.  NOTE: see valgrind output for deletion memory leak report", testNum);
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