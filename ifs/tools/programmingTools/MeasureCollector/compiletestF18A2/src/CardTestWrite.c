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


static Card* testCardWithGroups(void)
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

//******************************** TEST CASES ********************************

//NULL

//******************************** Write NULL ********************************

static SubTestRec _tWriteSubTest1(int testNum, int subTest){
	char feedback[300];
    SubTestRec result;
	Card* obj = minValid();
    
    VCardErrorCode err = writeCard(NULL, obj);
    
    if (err == WRITE_ERROR){
        sprintf(feedback, "Subtest %d.%d: Successfully handled NULL file name.",testNum, subTest);
		result = createSubResult(SUCCESS, feedback);
		return result;
	}
	else
	{
		sprintf(feedback, "Subtest %d.%d: Failed to handle NULL file name.",testNum, subTest);
		result = createSubResult(FAIL, feedback);
		return result;
	}
}

static SubTestRec _tWriteSubTest2(int testNum, int subTest){
    char feedback[300];
    char* fileName = "testFiles/output/someFile.ged";
    SubTestRec result;
    
     VCardErrorCode err = writeCard(fileName, NULL);
    
    if (err == WRITE_ERROR){
        sprintf(feedback, "Subtest %d.%d: Successfully handled NULL GEDCOMobject.",testNum, subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }
    else
    {
        sprintf(feedback, "Subtest %d.%d: Failed to handle NULL GEDCOMobject.",testNum, subTest);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

testRec* _tWriteTestNull(int testNum){
    const int numSubs = 2;
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d: writeGEDCOM (NULL arguments)", testNum);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTest(testNum, subTest, rec, &_tWriteSubTest1);
    subTest++;
    runSubTest(testNum, subTest, rec, &_tWriteSubTest2);
    return rec;
}


//***************************************************************

SubTestRec _tWriteCardTestGeneric(int testNum, int subTest, char* refName, void* obj){
    SubTestRec result;
    char feedback[300];
    char fileName[] = "studentOutput/testCard.vcf";
    
    Card* testObj;
    Card* refObj = (Card*)obj;

    VCardErrorCode err = writeCard(fileName, refObj);

    if (err != OK){
        sprintf(feedback, "Subtest %d.%d: Did not return OK when writing a valid Card to file (returned %d).", testNum, subTest, err);
        result = createSubResult(FAIL, feedback);
        return result;
    }

    
    err = createCard(fileName, &testObj);
  //  printf("%s\n", printCard(refObj));
  //  printf("%s\n", printCard(testObj));

    // _tPrintObj("Test card: ", testObj);
    // _tPrintObj("Reference card: ", refObj);
    
    if (err != OK){
        sprintf(feedback, "Subtest %d.%d: Did not return OK (returned %d) when parsing a file created from a valid reference object.",testNum,subTest, err);
        result = createSubResult(FAIL, feedback);
        return result;
    }
    
    if (_tObjEqual(testObj, refObj)){
        sprintf(feedback, "Subtest %d.%d: correctly saved valid Card object",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: did not correctly save a valid card - object created from saved file does not match the reference object",testNum,subTest);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

static testRec* _tValidWriteTestGeneric(int testNum, Card* refObj, int weight, char* textStr){
    const int numSubs = 1;  //doesn't need to be a variable but its a handy place to keep it
    int subTest = 1;
    char feedback[300];
    
    //char fileName[] = "testFiles/valid/testCardMin.vcf";
    sprintf(feedback, "Test %d (%d%%): Testing writeCard. Creating a .vcf file from a valid reference (%s)", testNum, weight, textStr);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTestWithFileAndObj(testNum, subTest, rec, "dummyVal", refObj, &_tWriteCardTestGeneric);
    return rec;
}


testRec* _tValidWriteTest1(int testNum){
    return _tValidWriteTestGeneric  (testNum, minValid(), 2, "Minimum valid Card object");
}

testRec* _tValidWriteTest2(int testNum){
    return _tValidWriteTestGeneric  (testNum, cardPropsVals(), 3, "Valid Card object with multiple properties and multiple property values");
}

testRec* _tValidWriteTest3(int testNum){
    return _tValidWriteTestGeneric  (testNum, testCardPropsParams(), 3, "Valid Card object with multiple properties and parameters");
}

testRec* _tValidWriteTest4(int testNum){
    return _tValidWriteTestGeneric  (testNum, testCardWithGroups(), 4, "Valid Card object with multiple properties, parameters, and groups");
}

testRec* _tValidWriteTest5(int testNum){
    return _tValidWriteTestGeneric  (testNum, testCardPropTextTime(), 3, "Minimum valid Card object with a text birthday");
}

testRec* _tValidWriteTest6(int testNum){
    return _tValidWriteTestGeneric  (testNum, testCardPropBothDT(), 3, "Minimum valid Card object with full birthday and anniersary date/time");
}

testRec* _tValidWriteTest7(int testNum){
    return _tValidWriteTestGeneric  (testNum, testCardPropOnlyDate(), 3, "Minimum valid Card object with a date-only birthday");
}

testRec* _tValidWriteTest8(int testNum){
    return _tValidWriteTestGeneric  (testNum, testCardPropOnlyTime(), 3, "Minimum valid Card object with a time-only birthday");
}

testRec* _tValidWriteTest9(int testNum){
    return _tValidWriteTestGeneric  (testNum, testCardPropSimpleDTUTC(), 3, "Minimum valid Card object with a UTC date-time");
}

testRec* _tValidWriteTest10(int testNum){
    return _tValidWriteTestGeneric  (testNum, testCardFromRFC(), 5, "Valid Card based on the sample Card from the vCard spec");
}


