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
    _tAddPropParam(prop, "TYPE","\"work,voice\"");
    _tAddPropParam(prop, "PREF","1");
    _tAddPropValue(prop, "tel:+1-418-656-9254");
    _tAddPropValue(prop, "ext=102");
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

static Card* testCardFromRFC(void)
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

static Card* testCardWithGropus(void)
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


    prop = _tCreateTestProp("LANG","LangPrefs");
    _tAddPropParam(prop, "PREF","1");
    _tAddPropValue(prop, "fr");
    _tInsertBack(card->optionalProperties, prop);


    prop = _tCreateTestProp("LANG","LangPrefs");
    _tAddPropParam(prop, "PREF","2");
    _tAddPropValue(prop, "en");
    _tInsertBack(card->optionalProperties, prop);

    prop = _tCreateTestProp("TEL","Phone");
    _tAddPropParam(prop, "VALUE","uri");
    _tAddPropParam(prop, "TYPE","\"work,cell,voice,video,text\"");
    _tAddPropValue(prop, "tel:+1-418-262-6501");
    _tInsertBack(card->optionalProperties, prop);

    prop = _tCreateTestProp("TEL","Phone");
    _tAddPropParam(prop, "VALUE","uri");
    _tAddPropParam(prop, "TYPE","\"work,voice\"");
    _tAddPropParam(prop, "PREF","1");
    _tAddPropValue(prop, "tel:+1-418-656-9254");
    _tAddPropValue(prop, "ext=102");
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

static Card* testCardPropSimpleDT(void)
{
    Card* card = malloc(sizeof(Card));
    
    //Set FN property
    card->fn = _tCreateTestProp("FN",NULL);
    _tAddPropValue(card->fn, "Simon Perreault");

    card->optionalProperties = _tInitializeList(&printProperty, &deleteProperty, &compareProperties);
    card->birthday = NULL;
    card->anniversary = _tCreateTestDateTime("20090808","143000",false,false,NULL);
  
    return card;
}

static Card* testCardPropSimpleDTUTC(void)
{
    Card* card = malloc(sizeof(Card));
    
    //Set FN property
    card->fn = _tCreateTestProp("FN",NULL);
    _tAddPropValue(card->fn, "Simon Perreault");

    card->optionalProperties = _tInitializeList(&printProperty, &deleteProperty, &compareProperties);
    card->birthday = NULL;
    card->anniversary = _tCreateTestDateTime("20090808","143000",true,false,NULL);
  
    return card;
}

static Card* testCardPropBothDT(void)
{
    Card* card = malloc(sizeof(Card));
    
    //Set FN property
    card->fn = _tCreateTestProp("FN",NULL);
    _tAddPropValue(card->fn, "Simon Perreault");

    card->optionalProperties = _tInitializeList(&printProperty, &deleteProperty, &compareProperties);
    card->birthday = _tCreateTestDateTime("19540203","123012",false,false,NULL);
    card->anniversary = _tCreateTestDateTime("20090808","143000",false,false,NULL);
  
    return card;
}

static Card* testCardPropOnlyDate(void)
{
    Card* card = malloc(sizeof(Card));
    
    //Set FN property
    card->fn = _tCreateTestProp("FN",NULL);
    _tAddPropValue(card->fn, "Simon Perreault");

    card->optionalProperties = _tInitializeList(&printProperty, &deleteProperty, &compareProperties);
    card->birthday = _tCreateTestDateTime("--0203","",false,false,NULL);
    card->anniversary = NULL;
  
    return card;
}

static Card* testCardPropOnlyTime(void)
{
    Card* card = malloc(sizeof(Card));
    
    //Set FN property
    card->fn = _tCreateTestProp("FN",NULL);
    _tAddPropValue(card->fn, "Simon Perreault");

    card->optionalProperties = _tInitializeList(&printProperty, &deleteProperty, &compareProperties);
    card->birthday = _tCreateTestDateTime("","143000",false,false,NULL);
    card->anniversary = NULL;
  
    return card;
}

static Card* testCardPropTextTime(void)
{
    Card* card = malloc(sizeof(Card));
    
    //Set FN property
    card->fn = _tCreateTestProp("FN",NULL);
    _tAddPropValue(card->fn, "Simon Perreault");

    card->optionalProperties = _tInitializeList(&printProperty, &deleteProperty, &compareProperties);
    card->birthday = _tCreateTestDateTime("","",false,true,"circa 1960");
    card->anniversary = NULL;
  
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
  //  printf("%s\n", printCard(refObj));
  //  printf("%s\n", printCard(testObj));

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

static testRec* _tValidFileTestGeneric(int testNum, char fileName[], Card* refObj, int weight){
    const int numSubs = 1;  //doesn't need to be a variable but its a handy place to keep it
    int subTest = 1;
    char feedback[300];
    
    //char fileName[] = "testFiles/valid/testCardMin.vcf";
    sprintf(feedback, "Test %d (%d%%): Testing createCard. Creating vCard object from a valid file (%s)", testNum, weight, fileName);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTestWithFileAndObj(testNum, subTest, rec, fileName, refObj, &_tCreateCardTestGeneric);
    return rec;
}

testRec* _tValidFileTest1(int testNum){

    return _tValidFileTestGeneric(testNum, "testFiles/valid/testCardMin.vcf", minValid(), 2);
}

testRec* _tValidFileTest2(int testNum){

    return _tValidFileTestGeneric(testNum, "testFiles/valid/testCardProp-simpleVal.vcf", testCardPropSimpleVal(), 2);
}

testRec* _tValidFileTest3(int testNum){

    return _tValidFileTestGeneric(testNum, "testFiles/valid/testCardProps-simpleVal.vcf", testCardPropsSimpleVal(), 2);
}

testRec* _tValidFileTest4(int testNum){

    return _tValidFileTestGeneric(testNum, "testFiles/valid/testCardN-compVal.vcf", cardFnN(), 2);
}

testRec* _tValidFileTest5(int testNum){

    return _tValidFileTestGeneric(testNum, "testFiles/valid/testCardProps-compVal.vcf", cardPropsVals(), 3);
}

testRec* _tValidFileTest6(int testNum){

    return _tValidFileTestGeneric(testNum, "testFiles/valid/testCardProp-Param.vcf", testCardPropParam(), 2);
}

testRec* _tValidFileTest7(int testNum){

    return _tValidFileTestGeneric(testNum, "testFiles/valid/testCardProps-Params.vcf", testCardPropsParams(), 3);
}

testRec* _tValidFileTest8(int testNum){

    return _tValidFileTestGeneric(testNum, "testFiles/valid/testCardProp-ParamsVals.vcf", testCardPropParamsVals(), 3);
}

testRec* _tValidFileTest9(int testNum){

    return _tValidFileTestGeneric(testNum, "testFiles/valid/testCardProps-ParamsVals.vcf", testCardPropsParamsVals(), 3);
    //return _tValidFileTestGeneric(testNum, "testFiles/valid/testCardMin.vcf", cardFnN());
}

testRec* _tValidFileTest10(int testNum){

    return _tValidFileTestGeneric(testNum, "testFiles/valid/testCard-SimpleFold1.vcf", minValid(), 3);
}

testRec* _tValidFileTest11(int testNum){

    return _tValidFileTestGeneric(testNum, "testFiles/valid/testCard-SimpleFold2.vcf", minValid(), 3);
}

testRec* _tValidFileTest12(int testNum){

    return _tValidFileTestGeneric(testNum, "testFiles/valid/testCard-MoreFold.vcf", testCardMoreFold(), 3);
}

//DT tests

testRec* _tValidFileTest13(int testNum){

    return _tValidFileTestGeneric(testNum, "testFiles/valid/testCard-Ann.vcf", testCardPropSimpleDT(), 2);
}

testRec* _tValidFileTest14(int testNum){

    return _tValidFileTestGeneric(testNum, "testFiles/valid/testCard-TruncBday.vcf", testCardPropOnlyDate(), 2);
}

testRec* _tValidFileTest15(int testNum){

    return _tValidFileTestGeneric(testNum, "testFiles/valid/testCard-BdayTime.vcf", testCardPropOnlyTime(), 2);
}

testRec* _tValidFileTest16(int testNum){

    return _tValidFileTestGeneric(testNum, "testFiles/valid/testCard-bothDT.vcf", testCardPropBothDT(), 2);
}

testRec* _tValidFileTest17(int testNum){

    return _tValidFileTestGeneric(testNum, "testFiles/valid/testCard-BdayText.vcf", testCardPropTextTime(), 2);
}

testRec* _tValidFileTest18(int testNum){

    return _tValidFileTestGeneric(testNum, "testFiles/valid/testCard-AnnUTC.vcf", testCardPropSimpleDTUTC(), 2);
}

//RFC

testRec* _tValidFileTest19(int testNum){

    return _tValidFileTestGeneric(testNum, "testFiles/valid/testCard.vcf", testCardFromRFC(), 4);
}

//Group

testRec* _tValidFileTest20(int testNum){

    return _tValidFileTestGeneric(testNum, "testFiles/valid/testCardProps-Groups.vcf", testCardWithGropus(), 3);
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
        sprintf(feedback, "Subtest %d.%d: incorrect error code for non-existent file (%s)\n\tExpected %d, received  %d",testNum,subTest, fileName, INV_FILE, err);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

//Non-existent file
static SubTestRec _tInvFileTest2(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    Card* testObj;
    
    VCardErrorCode err = createCard(NULL, &testObj);
    
    if (err == INV_FILE){
        sprintf(feedback, "Subtest %d.%d: Reading a NULL file name.",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: incorrect error code for NULL file name\n\tExpected %d, received  %d",testNum,subTest, INV_FILE, err);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

testRec* _tInvalidFileTests(int testNum){
    const int numSubs = 2;
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (5%%): Creating a vCard object from invalid files", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tInvFileTest1);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tInvFileTest2);
    return rec;
}

//*********** Error handling - invalid Card ***********


static SubTestRec _tInvCardTest1(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    Card* testObj;
    char fileName[] = "testFiles/invCard/testCardInvEndings.vcf";
    
    VCardErrorCode err = createCard(fileName, &testObj);
    
    if (err == INV_CARD || err == INV_PROP){
        sprintf(feedback, "Subtest %d.%d: Reading a file with non-CRLF line endings (%s)",testNum,subTest, fileName);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: incorrect error code for a file with non-CRLF line endings (%s).\n\tExpected %d, received  %d",testNum,subTest, fileName, INV_CARD, err);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

static SubTestRec _tInvCardTest2(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    Card* testObj;
    char fileName[] = "testFiles/invCard/testCardNoEnd.vcf";
    
    VCardErrorCode err = createCard(fileName, &testObj);
    
    if (err == INV_CARD){
        sprintf(feedback, "Subtest %d.%d: Reading a file with a missing END tag (%s)",testNum,subTest, fileName);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: incorrect error code for a file with a missing END tag (%s).\n\tExpected %d, received  %d",testNum,subTest, fileName, INV_CARD, err);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

static SubTestRec _tInvCardTest3(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    Card* testObj;
    char fileName[] = "testFiles/invCard/testCardNoVersion.vcf";
    
    VCardErrorCode err = createCard(fileName, &testObj);
    
    if (err == INV_CARD){
        sprintf(feedback, "Subtest %d.%d: Reading a file with no VERSION property (%s)",testNum,subTest, fileName);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: incorrect error code for a file with no VERSION property (%s).\n\tExpected %d, received  %d",testNum,subTest, fileName, INV_CARD, err);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

testRec* _tInvalidCardTests(int testNum){
    const int numSubs = 3;
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (10%%): Creating a vCard object from files with invalid Cards", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tInvCardTest1);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tInvCardTest2);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tInvCardTest3);
    return rec;
}

//*********** Error handling - invalid Properties ***********
static SubTestRec _tInvPropTest1(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    Card* testObj;
    char fileName[] = "testFiles/invProp/testCardNoPropValue.vcf";
    
    VCardErrorCode err = createCard(fileName, &testObj);
    
    if (err == INV_PROP){
        sprintf(feedback, "Subtest %d.%d: Reading a file with a missing property value (%s)",testNum,subTest, fileName);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: incorrect error code for a file with a missing property value (%s).\n\tExpected %d, received  %d",testNum,subTest, fileName, INV_PROP, err);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

static SubTestRec _tInvPropTest2(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    Card* testObj;
    char fileName[] = "testFiles/invProp/testCardNoPropName.vcf";
    
    VCardErrorCode err = createCard(fileName, &testObj);
    
    if (err == INV_PROP){
        sprintf(feedback, "Subtest %d.%d: Reading a file with a missing property name (%s)",testNum,subTest, fileName);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: incorrect error code for a file with a missing property name (%s).\n\tExpected %d, received  %d",testNum,subTest, fileName, INV_PROP, err);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}


static SubTestRec _tInvPropTest3(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    Card* testObj;
    char fileName[] = "testFiles/invProp/testCardPropInvParam1.vcf";
    
    VCardErrorCode err = createCard(fileName, &testObj);
    
    if (err == INV_PROP){
        sprintf(feedback, "Subtest %d.%d: Reading a file with an invalid parameter value (%s)",testNum,subTest, fileName);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: incorrect error code for a file with an invalid parameter value (%s).\n\tExpected %d, received  %d",testNum,subTest, fileName, INV_PROP, err);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

static SubTestRec _tInvPropTest4(int testNum, int subTest){
    SubTestRec result;
    char feedback[300];
    Card* testObj;
    char fileName[] = "testFiles/invProp/testCardPropInvParam2.vcf";
    
    VCardErrorCode err = createCard(fileName, &testObj);
    
    if (err == INV_PROP){
        sprintf(feedback, "Subtest %d.%d: Reading a file with an invalid parameter (%s)",testNum,subTest, fileName);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: incorrect error code for a file with an invalid parameter (%s).\n\tExpected %d, received  %d",testNum,subTest, fileName, INV_PROP, err);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

testRec* _tInvalidPropTests(int testNum){
    const int numSubs = 4;
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (10%%): Creating a vCard object from files with invalid Properties", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tInvPropTest1);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tInvPropTest2);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tInvPropTest3);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tInvPropTest4);
    
    return rec;
}