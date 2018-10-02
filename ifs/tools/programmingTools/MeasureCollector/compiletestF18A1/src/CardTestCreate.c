#include "CardTestUtilities.h"

//******************************** TEST DATA ********************************

//Minimal valid vCard
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

static Card* testCardPropsSimpleVal(void)
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

    prop = _tCreateTestProp("ORG",NULL);
    _tAddPropValue(prop, "Viagenie");
    _tInsertBack(card->optionalProperties, prop);
    
    return card;
}

static Card* cardFnN(void)
{
    Card* card = malloc(sizeof(Card));
    
    //Set FN property
    printf("cardFnN start\n");
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
    printf("cardFnN end\n");
    return card;
}

static Card* cardPropsVals(void)
{
    Card* card = malloc(sizeof(Card));
        
    //Set FN property
    card->fn = _tCreateTestProp("FN",NULL);
    _tAddPropValue(card->fn, "Simon Perreault");

    card->optionalProperties = _tInitializeList(&printProperty, &deleteProperty, &compareProperties);
    card->birthday = NULL;
    card->anniversary = NULL;

    Property* prop = _tCreateTestProp("N",NULL);
    _tAddPropValue(prop, "Perreault");
    _tAddPropValue(prop, "Simon");
    _tAddPropValue(prop, "");
    _tAddPropValue(prop, "");
    _tAddPropValue(prop, "ing. jr,M.Sc.");

    _tInsertBack(card->optionalProperties, prop);

    prop = _tCreateTestProp("ADR",NULL);
    _tAddPropValue(prop, "");
    _tAddPropValue(prop, "Suite D2-630");
    _tAddPropValue(prop, "2875 Laurier");
    _tAddPropValue(prop, "Quebec");
    _tAddPropValue(prop, "QC");
    _tAddPropValue(prop, "G1V 2M2");
    _tAddPropValue(prop, "Canada");

    _tInsertBack(card->optionalProperties, prop);

    prop = _tCreateTestProp("GEO",NULL);
    _tAddPropValue(prop, "geo:46.772673,-71.282945");
    
    _tInsertBack(card->optionalProperties, prop);

    return card;
}

static Card* testCardPropParam(void)
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

    prop = _tCreateTestProp("LANG",NULL);
    _tAddPropValue(prop, "fr");
    _tAddPropParam(prop, "PREF","1");
    _tInsertBack(card->optionalProperties, prop);
    
    return card;
}

static Card* testCardPropsParams(void)
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

    prop = _tCreateTestProp("LANG",NULL);
    _tAddPropParam(prop, "PREF","1");
    _tAddPropValue(prop, "fr");
    _tInsertBack(card->optionalProperties, prop);

    prop = _tCreateTestProp("LANG",NULL);
    _tAddPropParam(prop, "PREF","2");
    _tAddPropValue(prop, "en");
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
    
    return card;
}

static Card* testCardPropParamsVals(void)
{
    Card* card = malloc(sizeof(Card));
    
    //Set FN property
    card->fn = _tCreateTestProp("FN",NULL);
    _tAddPropValue(card->fn, "Simon Perreault");

    card->optionalProperties = _tInitializeList(&printProperty, &deleteProperty, &compareProperties);
    card->birthday = NULL;
    card->anniversary = NULL;

    Property* prop = _tCreateTestProp("TEL",NULL);
    _tAddPropParam(prop, "VALUE","uri");
    _tAddPropParam(prop, "TYPE","\"work,voice\"");
    _tAddPropParam(prop, "PREF","1");

    _tAddPropValue(prop, "tel:+1-418-656-9254");
    _tAddPropValue(prop, "ext=102");

    _tInsertBack(card->optionalProperties, prop);
    
    return card;
}

static Card* testCardPropsParamsVals(void)
{
    Card* card = malloc(sizeof(Card));
    
    //Set FN property
    card->fn = _tCreateTestProp("FN",NULL);
    _tAddPropValue(card->fn, "Simon Perreault");

    card->optionalProperties = _tInitializeList(&printProperty, &deleteProperty, &compareProperties);
    card->birthday = NULL;
    card->anniversary = NULL;

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


    prop = _tCreateTestProp("URL",NULL);
    _tAddPropParam(prop, "TYPE","home");
    _tAddPropValue(prop, "http://nomis80.org");
    _tInsertBack(card->optionalProperties, prop);


    return card;
}

static Card* testCardMoreFold(void)
{
    Card* card = malloc(sizeof(Card));
    
    //Set FN property
    card->fn = _tCreateTestProp("FN",NULL);
    _tAddPropValue(card->fn, "Simon Perreault");

    card->optionalProperties = _tInitializeList(&printProperty, &deleteProperty, &compareProperties);
    card->birthday = NULL;
    card->anniversary = NULL;

    Property* prop = _tCreateTestProp("ADR",NULL);
    _tAddPropParam(prop, "TYPE","work");
    _tAddPropValue(prop, "");
    _tAddPropValue(prop, "Suite D2-630");
    _tAddPropValue(prop, "2875 Laurier");
    _tAddPropValue(prop, "Quebec");
    _tAddPropValue(prop, "QC");
    _tAddPropValue(prop, "G1V 2M2");
    _tAddPropValue(prop, "Canada");
    _tInsertBack(card->optionalProperties, prop);

    prop = _tCreateTestProp("KEY",NULL);
    _tAddPropParam(prop, "TYPE","work");
    _tAddPropParam(prop, "VALUE","uri");
    _tAddPropValue(prop, "http://www.viagenie.ca/simon.perreault/simon.asc");
    _tInsertBack(card->optionalProperties, prop);

    return card;
}

//******************************** TEST CASES ********************************

/*
 - min: just FN X
 - Fn + 1 prop with simple value
 - Fn + multiple props with simple values
 - Fn + 1 prop with compound value X
 - Fn + multiple props with compound values
 - Fn + 1 prop with parameters
 - Fn + multiple props with parameters
 - Fn + 1 prop with paramaters and values
 - Fn + multiple props with parameters and values
 - Fn + 1 date
 - Fn + 2 dates
 - Fn + 2 dates and multiple complex properties
 - A few folded lines

 - ~4 invalids

 - ~4 deletes

 - ~a couple of prints and print error
*/

//******************************** vCard creation ********************************

//******************************** Test 1 ********************************


SubTestRec _tCreateCardTestGeneric(int testNum, int subTest, char* fileName, void* obj){
    SubTestRec result;
    char feedback[300];
    
    Card* testObj;
    Card* refObj = (Card*)obj;

    
    VCardErrorCode err = createCard(fileName, &testObj);
    printf("%s\n", printCard(refObj));
    printf("%s\n", printCard(testObj));

    // _tPrintObj("Test card: ", testObj);
    // _tPrintObj("Reference card: ", refObj);
    
    if (err != OK){
        sprintf(feedback, "Subtest %d.%d: Did not return OK (returned %d) when parsing a valid file (%s).",testNum,subTest, err, fileName);
        result = createSubResult(FAIL, feedback);
        return result;
    }
    
    if (_tObjEqual(testObj, refObj)){
        sprintf(feedback, "Subtest %d.%d: file %s parsed correctly",testNum,subTest, fileName);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: did not correctly parse a valid file - created object does not match the reference object",testNum,subTest);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

static testRec* _tValidFileTestGeneric(int testNum, char fileName[], Card* refObj){
    const int numSubs = 1;  //doesn't need to be a variable but its a handy place to keep it
    int subTest = 1;
    char feedback[300];
    
    //char fileName[] = "testFiles/valid/testCardMin.vcf";
    sprintf(feedback, "Test %d: Testing createCard. Creating vCard object from a valid file (%s)", testNum, fileName);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTestWithFileAndObj(testNum, subTest, rec, fileName, refObj, &_tCreateCardTestGeneric);
    return rec;
}

testRec* _tValidFileTest1(int testNum){

    return _tValidFileTestGeneric(testNum, "testFiles/valid/testCardMin.vcf", minValid());
}

testRec* _tValidFileTest2(int testNum){

    return _tValidFileTestGeneric(testNum, "testFiles/valid/testCardProp-simpleVal.vcf", testCardPropSimpleVal());
}

testRec* _tValidFileTest3(int testNum){

    return _tValidFileTestGeneric(testNum, "testFiles/valid/testCardProps-simpleVal.vcf", testCardPropsSimpleVal());
}

testRec* _tValidFileTest4(int testNum){

    return _tValidFileTestGeneric(testNum, "testFiles/valid/testCardN-compVal.vcf", cardFnN());
}

testRec* _tValidFileTest5(int testNum){

    return _tValidFileTestGeneric(testNum, "testFiles/valid/testCardProps-compVal.vcf", cardPropsVals());
}

testRec* _tValidFileTest6(int testNum){

    return _tValidFileTestGeneric(testNum, "testFiles/valid/testCardProp-Param.vcf", testCardPropParam());
}

testRec* _tValidFileTest7(int testNum){

    return _tValidFileTestGeneric(testNum, "testFiles/valid/testCardProps-Params.vcf", testCardPropsParams());
}

testRec* _tValidFileTest8(int testNum){

    return _tValidFileTestGeneric(testNum, "testFiles/valid/testCardProp-ParamsVals.vcf", testCardPropParamsVals());
}

testRec* _tValidFileTest9(int testNum){

    return _tValidFileTestGeneric(testNum, "testFiles/valid/testCardProps-ParamsVals.vcf", testCardPropsParamsVals());
}

testRec* _tValidFileTest10(int testNum){

    return _tValidFileTestGeneric(testNum, "testFiles/valid/testCard-SimpleFold1.vcf", minValid());
}

testRec* _tValidFileTest11(int testNum){

    return _tValidFileTestGeneric(testNum, "testFiles/valid/testCard-SimpleFold2.vcf", minValid());
}

testRec* _tValidFileTest12(int testNum){

    return _tValidFileTestGeneric(testNum, "testFiles/valid/testCard-MoreFold.vcf", testCardMoreFold());
}



//*********** Error handling - invalid file ***********

//Non-existent file
static SubTestRec _tInvFileTest1(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    Card* testObj;
    char fileName[] = "testFiles/iDoNotExist.vcf";
    
    VCardErrorCode err = createCard(fileName, &testObj);
    
    if (err == INV_FILE){
        sprintf(feedback, "Subtest %d.%d: Reading a non-existent file (%s) .",testNum,subTest, fileName);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: incorrect error code for non-existent file (%s)",testNum,subTest, fileName);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

testRec* _tInvalidFileTests(int testNum){
    const int numSubs = 1;
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d: Creating a vCard object from invalid files", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tInvFileTest1);
    return rec;
}
//***************************************************************