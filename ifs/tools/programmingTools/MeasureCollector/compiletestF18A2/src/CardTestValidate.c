#include "CardTestUtilities.h"

//******************************** TEST DATA ********************************

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

//******************************** vCard creation ********************************

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

testRec* _tValidateTest1(int testNum){
    const int numSubs = 3;  //doesn't need to be a variable but its a handy place to keep it
    int subTest = 1;
    char feedback[300];
    
    sprintf(feedback, "Test %d (%d%%): Testing validateCard: NULL card, NULL fn, NULL otherProperties", testNum, 4);
    testRec * rec = initRec(testNum, numSubs, feedback);
    
    runSubTestWithFileAndObj(testNum, subTest, rec, "INV_CARD", NULL, &_tValidateCardSubTestGeneric);
    subTest++;
    runSubTestWithFileAndObj(testNum, subTest, rec, "INV_CARD", _tInvFN(), &_tValidateCardSubTestGeneric);
    subTest++;
    runSubTestWithFileAndObj(testNum, subTest, rec, "INV_CARD", _tInvList(), &_tValidateCardSubTestGeneric);
    
    return rec;
}

// static testRec* _tValidFileTestGeneric(int testNum, char errName[], Card* refObj, int weight){
//     const int numSubs = 1;  //doesn't need to be a variable but its a handy place to keep it
//     int subTest = 1;
//     char feedback[300];
    
//     //char fileName[] = "testFiles/valid/testCardMin.vcf";
//     sprintf(feedback, "Test %d (%d%%): Testing createCard. Creating vCard object from a valid file (%s)", testNum, weight, fileName);
//     testRec * rec = initRec(testNum, numSubs, feedback);
    
//     runSubTestWithFileAndObj(testNum, subTest, rec, errName, refObj, &_tValidateCardSubTestGeneric);
//     return rec;
// }

// testRec* _tValidFileTest1(int testNum){

//     return _tValidFileTestGeneric(testNum, "testFiles/valid/testCardMin.vcf", minValid(), 2);
// }
