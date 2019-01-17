#include "CardTestUtilities.h"

//******************************** INV_CARD cases ********************************

//Minimal valid vCard
static Card* _tInvFN(void)
{
    Card* card = malloc(sizeof(Card));
    
    //Set FN property
    card->fn = NULL;

    card->optionalProperties = _tInitializeList(&printProperty, &deleteProperty, &compareProperties);
    card->birthday = NULL;
    card->anniversary = NULL;
    
    return card;
}

static Card* _tInvList(void)
{
    Card* card = malloc(sizeof(Card));
    
    //Set FN property
    card->fn = _tCreateTestProp("FN",NULL);
    _tAddPropValue(card->fn, "Simon Perreault");

    card->optionalProperties = NULL;
    card->birthday = NULL;
    card->anniversary = NULL;
    
    return card;
}

static Card* _tInvVersion(void)
{
    Card* card = malloc(sizeof(Card));
    
    //Set FN property
    card->fn = _tCreateTestProp("FN",NULL);
    _tAddPropValue(card->fn, "Simon Perreault");

    card->optionalProperties =  _tInitializeList(&printProperty, &deleteProperty, &compareProperties);
    card->birthday = NULL;
    card->anniversary = NULL;

    Property* prop = _tCreateTestProp("VERSION",NULL);
    _tAddPropValue(prop, "4.0");
    _tInsertBack(card->optionalProperties, prop);
    
    return card;
}

//******************************** INV_PROP cases ********************************

static Card* _tInvPropName(void)
{
    Card* card = malloc(sizeof(Card));
    
    //Set FN property
    card->fn = _tCreateTestProp("FN",NULL);
    _tAddPropValue(card->fn, "Simon Perreault");

    card->optionalProperties =  _tInitializeList(&printProperty, &deleteProperty, &compareProperties);
    card->birthday = NULL;
    card->anniversary = NULL;

    Property* prop = _tCreateInvTestProp(NULL,"",true,true);
    _tAddPropValue(prop, "stuff");
    _tInsertBack(card->optionalProperties, prop);
    
    return card;
}

static Card* _tInvPropGrp(void)
{
    Card* card = malloc(sizeof(Card));
    
    //Set FN property
    card->fn = _tCreateTestProp("FN",NULL);
    _tAddPropValue(card->fn, "Simon Perreault");

    card->optionalProperties =  _tInitializeList(&printProperty, &deleteProperty, &compareProperties);
    card->birthday = NULL;
    card->anniversary = NULL;

    Property* prop = _tCreateInvTestProp("TEL",NULL,true,true);
    _tAddPropValue(prop, "stuff");
    _tInsertBack(card->optionalProperties, prop);
    
    return card;
}

static Card* _tInvPropParams(void)
{
    Card* card = malloc(sizeof(Card));
    
    //Set FN property
    card->fn = _tCreateTestProp("FN",NULL);
    _tAddPropValue(card->fn, "Simon Perreault");

    card->optionalProperties =  _tInitializeList(&printProperty, &deleteProperty, &compareProperties);
    card->birthday = NULL;
    card->anniversary = NULL;

    Property* prop = _tCreateInvTestProp("TEL","",false,true);
    _tAddPropValue(prop, "stuff");
    _tInsertBack(card->optionalProperties, prop);
    
    return card;
}

static Card* _tInvPropVals(void)
{
    Card* card = malloc(sizeof(Card));
    
    //Set FN property
    card->fn = _tCreateTestProp("FN",NULL);
    _tAddPropValue(card->fn, "Simon Perreault");

    card->optionalProperties =  _tInitializeList(&printProperty, &deleteProperty, &compareProperties);
    card->birthday = NULL;
    card->anniversary = NULL;

    Property* prop = _tCreateInvTestProp("TEL","",true,false);
    _tAddPropValue(prop, "stuff");
    _tInsertBack(card->optionalProperties, prop);
    
    return card;
}

static Card* _tInvPropVal_Missing(void)
{
    Card* card = malloc(sizeof(Card));
    
    //Set FN property
    card->fn = _tCreateTestProp("FN",NULL);
    _tAddPropValue(card->fn, "Simon Perreault");

    card->optionalProperties =  _tInitializeList(&printProperty, &deleteProperty, &compareProperties);
    card->birthday = NULL;
    card->anniversary = NULL;

    Property* prop = _tCreateTestProp("TEL",NULL);
    _tInsertBack(card->optionalProperties, prop);
    
    return card;
}

static Card* _tInvProp_InvName(void)
{
    Card* card = malloc(sizeof(Card));
    
    //Set FN property
    card->fn = _tCreateTestProp("FN",NULL);
    _tAddPropValue(card->fn, "Simon Perreault");

    card->optionalProperties =  _tInitializeList(&printProperty, &deleteProperty, &compareProperties);
    card->birthday = NULL;
    card->anniversary = NULL;

    Property* prop = _tCreateTestProp("Jibberish",NULL);
    _tAddPropValue(prop, "stuff");
    _tInsertBack(card->optionalProperties, prop);
    
    return card;
}

static Card* _tInvProp_DupProp(void)
{
    Card* card = malloc(sizeof(Card));
    
    //Set FN property
    card->fn = _tCreateTestProp("FN",NULL);
    _tAddPropValue(card->fn, "Simon Perreault");

    card->optionalProperties =  _tInitializeList(&printProperty, &deleteProperty, &compareProperties);
    card->birthday = NULL;
    card->anniversary = NULL;

    Property* prop = _tCreateTestProp("KIND",NULL);
    _tAddPropValue(prop, "stuff1");
    _tInsertBack(card->optionalProperties, prop);

    prop = _tCreateTestProp("KIND",NULL);
    _tAddPropValue(prop, "stuff2");
    _tInsertBack(card->optionalProperties, prop);
    
    return card;
}

static Card* _tInvProp_InvValCardinality(void)
{
    Card* card = malloc(sizeof(Card));
    
    //Set FN property
    card->fn = _tCreateTestProp("FN",NULL);
    _tAddPropValue(card->fn, "Simon Perreault");

    card->optionalProperties =  _tInitializeList(&printProperty, &deleteProperty, &compareProperties);
    card->birthday = NULL;
    card->anniversary = NULL;

    Property* prop = _tCreateTestProp("N",NULL);
    _tAddPropValue(prop, "stuff1");
    _tInsertBack(card->optionalProperties, prop);

    
    return card;
}

// **************************** DateTime tests ****************************

static Card* _tInvDT_textUTC(void)
{
    Card* card = malloc(sizeof(Card));
    
    //Set FN property
    card->fn = _tCreateTestProp("FN",NULL);
    _tAddPropValue(card->fn, "Simon Perreault");

    card->optionalProperties =  _tInitializeList(&printProperty, &deleteProperty, &compareProperties);
    card->birthday = NULL;
    card->anniversary = NULL;

    DateTime* dt = _tCreateInvDT("","",true,true,"stuff");
    card->birthday = dt;

    return card;
}

static Card* _tInvDT_textDate(void)
{
    Card* card = malloc(sizeof(Card));
    
    //Set FN property
    card->fn = _tCreateTestProp("FN",NULL);
    _tAddPropValue(card->fn, "Simon Perreault");

    card->optionalProperties =  _tInitializeList(&printProperty, &deleteProperty, &compareProperties);
    card->birthday = NULL;
    card->anniversary = NULL;

    DateTime* dt = _tCreateInvDT("20181010","",false,true,"Circa 1960");
    card->birthday = dt;

    return card;
}

static Card* _tInvDT_textTime(void)
{
    Card* card = malloc(sizeof(Card));
    
    //Set FN property
    card->fn = _tCreateTestProp("FN",NULL);
    _tAddPropValue(card->fn, "Simon Perreault");

    card->optionalProperties =  _tInitializeList(&printProperty, &deleteProperty, &compareProperties);
    card->birthday = NULL;
    card->anniversary = NULL;

    DateTime* dt = _tCreateInvDT("","143000",false,true,"Circa 1960");
    card->birthday = dt;

    return card;
}

static Card* _tInvDT_nonTextwText(void)
{
    Card* card = malloc(sizeof(Card));
    
    //Set FN property
    card->fn = _tCreateTestProp("FN",NULL);
    _tAddPropValue(card->fn, "Simon Perreault");

    card->optionalProperties =  _tInitializeList(&printProperty, &deleteProperty, &compareProperties);
    card->birthday = NULL;
    card->anniversary = NULL;

    DateTime* dt = _tCreateInvDT("20181010","143000",false,false,"Circa 1960");
    card->birthday = dt;

    return card;
}

static Card* _tInvDT_dupBday(void)
{
    Card* card = malloc(sizeof(Card));
    
    //Set FN property
    card->fn = _tCreateTestProp("FN",NULL);
    _tAddPropValue(card->fn, "Simon Perreault");

    card->optionalProperties =  _tInitializeList(&printProperty, &deleteProperty, &compareProperties);
    card->birthday = NULL;
    card->anniversary = NULL;

    DateTime* dt = _tCreateInvDT("20181010","143000",false,false,"Circa 1960");
    card->birthday = dt;

    Property* prop = _tCreateTestProp("BDAY",NULL);
    _tAddPropValue(prop, "stuff1");
    _tInsertBack(card->optionalProperties, prop);

    return card;
}

static Card* _tInvDT_dupAnn(void)
{
    Card* card = malloc(sizeof(Card));
    
    //Set FN property
    card->fn = _tCreateTestProp("FN",NULL);
    _tAddPropValue(card->fn, "Simon Perreault");

    card->optionalProperties =  _tInitializeList(&printProperty, &deleteProperty, &compareProperties);
    card->birthday = NULL;
    card->anniversary = NULL;

    DateTime* dt = _tCreateInvDT("20181010","143000",false,false,"Circa 1960");
    card->anniversary = dt;

    Property* prop = _tCreateTestProp("ANNIVERSARY",NULL);
    _tAddPropValue(prop, "stuff1");
    _tInsertBack(card->optionalProperties, prop);

    return card;
}

//******************************** Valid cards ********************************

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


//******************************** Test 1 ********************************


SubTestRec _tValidateCardSubTestGeneric(int testNum, int subTest, char* errName, void* obj){
    SubTestRec result;
    char feedback[300];
    
    Card* refObj = (Card*)obj;
    VCardErrorCode refErr;

    if (strcmp(errName, "OK") == 0){
        refErr = OK;
    }else if (strcmp(errName, "INV_CARD") == 0){
        refErr = INV_CARD;
    }else if (strcmp(errName, "INV_PROP") == 0){
        refErr = INV_PROP;
    }else if (strcmp(errName, "INV_DT") == 0){
        refErr = INV_DT;
    }else{ 
        refErr = OTHER_ERROR;
    }
    
    
    VCardErrorCode err = validateCard(refObj);
    
    if (err == refErr){
        sprintf(feedback, "Subtest %d.%d: successfuly validated",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: incorrect error code: expected %d, received %d",testNum,subTest, refErr, err);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

SubTestRec _tValidateCardSubTestGenValid(int testNum, int subTest, char* fileName, void* obj){
    SubTestRec result;
    char feedback[300];
    
    Card* refObj = (Card*)obj;

    VCardErrorCode err = validateCard(refObj);
    
    if (err == OK){
        sprintf(feedback, "Subtest %d.%d: object successfuly validated",testNum,subTest);
        result = createSubResult(SUCCESS, feedback);
        return result;
    }else{
        sprintf(feedback, "Subtest %d.%d: incorrect error code for valid object (expected OK (0), received %d)",testNum,subTest, err);
        result = createSubResult(FAIL, feedback);
        return result;
    }
}

testRec* _tValidateTest1(int testNum){
    const int numSubs = 4;  //doesn't need to be a variable but its a handy place to keep it
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (%d%%): Testing validateCard (expected INV_CARD): NULL card, NULL fn, NULL otherProperties, VERSION property in otherProperties", testNum, 4);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTestWithFileAndObj(testNum, subTest, rec, "INV_CARD", NULL, &_tValidateCardSubTestGeneric);
    subTest++;
    runSubTestWithFileAndObj(testNum, subTest, rec, "INV_CARD", _tInvFN(), &_tValidateCardSubTestGeneric);
    subTest++;
    runSubTestWithFileAndObj(testNum, subTest, rec, "INV_CARD", _tInvList(), &_tValidateCardSubTestGeneric);
    subTest++;
    runSubTestWithFileAndObj(testNum, subTest, rec, "INV_CARD", _tInvVersion(), &_tValidateCardSubTestGeneric);
    
    return rec;
}

testRec* _tValidateTest2(int testNum){
    const int numSubs = 4;  //doesn't need to be a variable but its a handy place to keep it
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (%d%%): Testing validateCard (expected INV_PROP): NULL prop name, NULL prop group, NULL values list, NULL parameters list", testNum, -1);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTestWithFileAndObj(testNum, subTest, rec, "INV_PROP", _tInvPropName(), &_tValidateCardSubTestGeneric);
    subTest++;
    runSubTestWithFileAndObj(testNum, subTest, rec, "INV_PROP", _tInvPropGrp(), &_tValidateCardSubTestGeneric);
    subTest++;
    runSubTestWithFileAndObj(testNum, subTest, rec, "INV_PROP", _tInvPropParams(), &_tValidateCardSubTestGeneric);
    subTest++;
    runSubTestWithFileAndObj(testNum, subTest, rec, "INV_PROP", _tInvPropVals(), &_tValidateCardSubTestGeneric);
    
    return rec;
}

testRec* _tValidateTest31(int testNum){
    const int numSubs = 1;  //doesn't need to be a variable but its a handy place to keep it
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (%d%%): Testing validateCard (expected INV_PROP) on object with a missing property value", testNum, 2);
    testRec * rec = initRec(testNum, numSubs, feedback);

    runSubTestWithFileAndObj(testNum, subTest, rec, "INV_PROP", _tInvPropVal_Missing(), &_tValidateCardSubTestGeneric);
    
    return rec;
}

testRec* _tValidateTest32(int testNum){
    const int numSubs = 1;  //doesn't need to be a variable but its a handy place to keep it
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (%d%%): Testing validateCard (expected INV_PROP) on object with an invalid property name", testNum, 2);
    testRec * rec = initRec(testNum, numSubs, feedback);

    runSubTestWithFileAndObj(testNum, subTest, rec, "INV_PROP", _tInvProp_InvName(), &_tValidateCardSubTestGeneric);
    
    return rec;
}

testRec* _tValidateTest33(int testNum){
    const int numSubs = 1;  //doesn't need to be a variable but its a handy place to keep it
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (%d%%): Testing validateCard (expected INV_PROP) on object where KIND property appears twice (cardinality violation)", testNum, 2);
    testRec * rec = initRec(testNum, numSubs, feedback);

    runSubTestWithFileAndObj(testNum, subTest, rec, "INV_PROP", _tInvProp_DupProp(), &_tValidateCardSubTestGeneric);
    return rec;
}

testRec* _tValidateTest34(int testNum){
    const int numSubs = 1;  //doesn't need to be a variable but its a handy place to keep it
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (%d%%): Testing validateCard (expected INV_PROP) on object where N property has only one value (cardinality violation)", testNum, 2);
    testRec * rec = initRec(testNum, numSubs, feedback);

    runSubTestWithFileAndObj(testNum, subTest, rec, "INV_PROP", _tInvProp_InvValCardinality(), &_tValidateCardSubTestGeneric);
    return rec;
}

testRec* _tValidateTest4(int testNum){
    const int numSubs = 4;  //doesn't need to be a variable but its a handy place to keep it
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (%d%%): Testing validateCard: NULL prop name, NULL prop group, NULL values list, NULL parameters list", testNum, 4);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTestWithFileAndObj(testNum, subTest, rec, "INV_DT", _tInvDT_textUTC(), &_tValidateCardSubTestGeneric);
    subTest++;
    runSubTestWithFileAndObj(testNum, subTest, rec, "INV_DT", _tInvDT_textDate(), &_tValidateCardSubTestGeneric);
    subTest++;
    runSubTestWithFileAndObj(testNum, subTest, rec, "INV_DT", _tInvDT_textTime(), &_tValidateCardSubTestGeneric);
    subTest++;
    runSubTestWithFileAndObj(testNum, subTest, rec, "INV_DT", _tInvDT_nonTextwText(), &_tValidateCardSubTestGeneric);
    subTest++;
    

    
    return rec;
}

testRec* _tValidateTest5(int testNum){
    const int numSubs = 2;  //doesn't need to be a variable but its a handy place to keep it
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (%d%%): Testing validateCard: BDAY and ANNIVERSARY in otherProperties", testNum, 2);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTestWithFileAndObj(testNum, subTest, rec, "INV_DT", _tInvDT_dupBday(), &_tValidateCardSubTestGeneric);
    subTest++;
    runSubTestWithFileAndObj(testNum, subTest, rec, "INV_DT", _tInvDT_dupAnn(), &_tValidateCardSubTestGeneric);
    
    return rec;
}

testRec* _tValidateTest6(int testNum){
    const int numSubs = 4;  //doesn't need to be a variable but its a handy place to keep it
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (%d%%): Testing validateCard on valid objects without DateTime properties", testNum, 4);
    testRec * rec = initRec(testNum, numSubs, feedback);

    runSubTestWithFileAndObj(testNum, subTest, rec, "OK", minValid(), &_tValidateCardSubTestGenValid);
    subTest++;
    runSubTestWithFileAndObj(testNum, subTest, rec, "OK", cardPropsVals(), &_tValidateCardSubTestGenValid);
    subTest++;
    runSubTestWithFileAndObj(testNum, subTest, rec, "OK", testCardPropsParams(), &_tValidateCardSubTestGenValid);
    subTest++;
    runSubTestWithFileAndObj(testNum, subTest, rec, "OK", testCardWithGroups(), &_tValidateCardSubTestGenValid);
    return rec;
}

testRec* _tValidateTest7(int testNum){
    const int numSubs = 4;  //doesn't need to be a variable but its a handy place to keep it
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (%d%%): Testing validateCard on valid objects containing DateTime properties", testNum, 4);
    testRec * rec = initRec(testNum, numSubs, feedback);

    runSubTestWithFileAndObj(testNum, subTest, rec, "OK", testCardPropTextTime(), &_tValidateCardSubTestGenValid);
    subTest++;
    runSubTestWithFileAndObj(testNum, subTest, rec, "OK", testCardPropBothDT(), &_tValidateCardSubTestGenValid);
    subTest++;
    runSubTestWithFileAndObj(testNum, subTest, rec, "OK", testCardPropOnlyTime(), &_tValidateCardSubTestGenValid);
    subTest++;
    runSubTestWithFileAndObj(testNum, subTest, rec, "OK", testCardPropSimpleDTUTC(), &_tValidateCardSubTestGenValid);
    return rec;
}