#include "TestHarness.h"

// testRec* simpleCalTest(int testNum);
// testRec* medCalTest(int testNum);
// testRec* largeCalTest(int testNum);
// testRec* foldedCalTest(int testNum);
// testRec* megaCalTestRead(int testNum);

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

testRec* _tInvFileTest(int testNum);

testRec* _tInvCalTest(int testNum);
testRec* _tInvProdIDTest(int testNum);
testRec* _tInvVerTest(int testNum);

testRec* _tInvEvtTest(int testNum);

testRec* _tInvDTTest(int testNum);

testRec* _tInvAlmTest(int testNum);

testRec* _tPrintCalTest(int testNum);

testRec* _tDeleteCalTest(int testNum);

testRec* _tPrintErrTest(int testNum);

//A2
//Module 1
testRec* _tWriteTestInvArgs(int testNum);
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


testRec* megaCalTestWrite(int testNum);

//Module 2
//testRec* paramsTest(int testNum);
//testRec* validateTest(int testNum);
testRec* _tValidateTestInvArgs(int testNum);

testRec* _tValidateObjTest01(int testNum);
testRec* _tValidateObjTest02(int testNum);
testRec* _tValidateObjTest1(int testNum);
testRec* _tValidateObjTest2(int testNum);
testRec* _tValidateObjTest3(int testNum);
testRec* _tValidateObjTest4(int testNum);
testRec* _tValidateObjTest5(int testNum);
testRec* _tValidateObjTest6(int testNum);
testRec* _tValidateObjTest7(int testNum);
testRec* _tValidateObjTest8(int testNum);
testRec* _tValidateObjTest9(int testNum);
testRec* _tValidateObjTest10(int testNum);


testRec* _tValidateTest1(int testNum);
testRec* _tValidateTest2(int testNum);
testRec* _tValidateTest3(int testNum);
testRec* _tValidateTest4(int testNum);
testRec* _tValidateTest5(int testNum);
testRec* _tValidateTest6(int testNum);
testRec* _tValidateTest7(int testNum);



//Module 3
testRec* _tTestDTtoJSON(int testNum);

testRec* _tTestEvtToJSONInv(int testNum);
testRec* _tTestEvtToJSON(int testNum);

testRec* _tTestEvtListToJSONInv(int testNum);
testRec* _tTestEvtListToJSON(int testNum);

testRec* _tTestCalToJSONInv(int testNum);
testRec* _tTestCalToJSON(int testNum);

testRec* _tTestJSONtoCalInv(int testNum);
testRec* _tTestJSONtoCalendar(int testNum);

testRec* _tTestJSONtoEvtInv(int testNum);
testRec* _tTestJSONtoEvt(int testNum);

testRec* _tTestAddEvt(int testNum);

