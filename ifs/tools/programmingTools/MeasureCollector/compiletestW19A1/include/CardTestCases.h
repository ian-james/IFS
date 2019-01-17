#ifndef VCARD_TEST_CASES_H
#define VCARD_TEST_CASES_H

#include "TestHarness.h"

testRec* _tValidFileTest1(int testNum);
testRec* _tValidFileTest2(int testNum);
testRec* _tValidFileTest3(int testNum);
testRec* _tValidFileTest4(int testNum);
testRec* _tValidFileTest5(int testNum);
testRec* _tValidFileTest6(int testNum);
testRec* _tValidFileTest7(int testNum);
testRec* _tValidFileTest8(int testNum);
testRec* _tValidFileTest9(int testNum);
testRec* _tValidFileTest10(int testNum);
testRec* _tValidFileTest11(int testNum);
testRec* _tValidFileTest12(int testNum);
testRec* _tValidFileTest13(int testNum);
testRec* _tValidFileTest14(int testNum);
testRec* _tValidFileTest15(int testNum);
testRec* _tValidFileTest16(int testNum);
testRec* _tValidFileTest17(int testNum);
testRec* _tValidFileTest18(int testNum);
testRec* _tValidFileTest19(int testNum);
testRec* _tValidFileTest20(int testNum);

testRec* _tInvalidFileTests(int testNum);
testRec* _tInvalidCardTests(int testNum);
testRec* _tInvalidPropTests(int testNum);

testRec* _tDeleteCardTests(int testNum);

testRec* _tPrintCardTests(int testNum);

testRec* _tPrintCardErrorTest(int testNum);

//****************** Assignment 2 ******************

testRec* _tWriteTestNull(int testNum);
testRec* _tValidWriteTest1(int testNum);
testRec* _tValidWriteTest2(int testNum);
testRec* _tValidWriteTest3(int testNum);
testRec* _tValidWriteTest4(int testNum);
testRec* _tValidWriteTest5(int testNum);
testRec* _tValidWriteTest6(int testNum);
testRec* _tValidWriteTest7(int testNum);
testRec* _tValidWriteTest8(int testNum);
testRec* _tValidWriteTest9(int testNum);
testRec* _tValidWriteTest10(int testNum);

testRec* _tValidateTest1(int testNum);
testRec* _tValidateTest2(int testNum);
testRec* _tValidateTest31(int testNum);
testRec* _tValidateTest32(int testNum);
testRec* _tValidateTest33(int testNum);
testRec* _tValidateTest34(int testNum);
testRec* _tValidateTest4(int testNum);
testRec* _tValidateTest5(int testNum);
testRec* _tValidateTest6(int testNum);
testRec* _tValidateTest7(int testNum);

testRec* _tTestStrListToJSONInv(int testNum);
testRec* _tTestStrListToJSON(int testNum);

testRec* _tTestJSONToStrListInv(int testNum);
testRec* _tTestJSONToStrList(int testNum);

testRec* _tTestPropToJSONInv(int testNum);
testRec* _tTestPropToJSON(int testNum);

testRec* _tTestJSONToPropInv(int testNum);
testRec* _tTestJSONToProp(int testNum);

testRec* _tTestDTtoJSONInv(int testNum);
testRec* _tTestDTtoJSON(int testNum);

testRec* _tTestJSONtoDTInv(int testNum);
testRec* _tTestJSONtoDT(int testNum);

testRec* _tTestJSONtoCardInv(int testNum);
testRec* _tTestJSONtoCard(int testNum);

testRec* _tTestAddPropInv(int testNum);
testRec* _tTestAddProp(int testNum);


#endif
