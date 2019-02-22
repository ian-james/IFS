#include "TestHarness.h"

SubTestRec getSubDataFromChild(int* pipefd){
    
    SubTestRec tmpRec;
    int passed;
    int len;
    
    close(pipefd[1]); // close the write-end of the pipe, I'm not going to use it
    read(pipefd[0], &passed, sizeof(int));
    read(pipefd[0], &len, sizeof(int));
    
    if (passed < 0 || passed > 1 ||
        len <= 0 || len > 2000){
        tmpRec.passed = -1;
        return tmpRec;
    }
    
    tmpRec.passed = passed;
    char* tmp = malloc(len);
    read(pipefd[0],tmp, len);
    tmpRec.feedback = tmp;
    
    
    return tmpRec;
}

void sendSubDataToParent(int* pipefd, SubTestRec* tmpRec){
    close(pipefd[0]); // close the read-end of the pipe, I'm not going to use it
    //Send result
    write(pipefd[1], &tmpRec->passed, sizeof(testResult));
    
    //Send feedback
    int tmpLen = strlen(tmpRec->feedback)+1;
    write(pipefd[1], (const char*)&tmpLen, sizeof(int));
    write(pipefd[1], tmpRec->feedback, tmpLen);
    close(pipefd[1]);
}

void runSubTestWithFileAndObj(int testNum, int subTest, testRec* rec, char* fileName, void* obj, SubTestRec (*testFunc)(int, int, char*fileName, void* obj)){
    int pipefd[2];
    pid_t childPID;
    
    pipe(pipefd); // create the pipe
    childPID = fork();
    if(childPID >= 0){ // fork was successful
        if (childPID == 0){
            signal(SIGSEGV, SIG_DFL);
            
            SubTestRec tmpRec = testFunc(testNum, subTest, fileName, obj);
            
            sendSubDataToParent(pipefd, &tmpRec);
            free(tmpRec.feedback);
            exit(EXIT_SUCCESS);
        }else{
            SubTestRec tmpRes = getSubDataFromChild(pipefd);
            
            int status;
            wait(&status);
            
            if (WIFSIGNALED(status)){
                char tmpBuf[1000];
                switch (WTERMSIG(status)){
                    case SIGSEGV:
                        sprintf(tmpBuf, "Test %d.%d encountered a segmentation fault and crashed", testNum, subTest);
                        break;
                    case SIGBUS:
                        sprintf(tmpBuf, "Test %d.%d encountered a bus error and crashed", testNum, subTest);
                        break;
                    default:
                        sprintf(tmpBuf, "Test %d.%d crashed - killed by a signal %d", testNum, subTest, WTERMSIG(status));
                        break;
                }
                tmpRes = createSubResult(FAIL, tmpBuf);
            }
            
            addResult(rec, tmpRes.passed, tmpRes.feedback);
            free(tmpRes.feedback);
            if (tmpRes.passed == SUCCESS){
                rec->subsPassed++;
            }
        }
    }
}

void runSubTestWithFile(int testNum, int subTest, testRec* rec, char* fileName, SubTestRec (*testFunc)(int, int, char*fileName)){
    int pipefd[2];
    pid_t childPID;
    
    pipe(pipefd); // create the pipe
    childPID = fork();
    if(childPID >= 0){ // fork was successful
        if (childPID == 0){
            signal(SIGSEGV, SIG_DFL);
            
            SubTestRec tmpRec = testFunc(testNum, subTest, fileName);
            
            sendSubDataToParent(pipefd, &tmpRec);
            free(tmpRec.feedback);
            exit(EXIT_SUCCESS);
        }else{
            SubTestRec tmpRes = getSubDataFromChild(pipefd);
            
            int status;
            wait(&status);
            
            if (WIFSIGNALED(status)){
                char tmpBuf[1000];
                switch (WTERMSIG(status)){
                    case SIGSEGV:
                        sprintf(tmpBuf, "Test %d.%d encountered a segmentation fault and crashed", testNum, subTest);
                        break;
                    case SIGBUS:
                        sprintf(tmpBuf, "Test %d.%d encountered a bus error and crashed", testNum, subTest);
                        break;
                    default:
                        sprintf(tmpBuf, "Test %d.%d crashed - killed by a signal %d", testNum, subTest, WTERMSIG(status));
                        break;
                }
                tmpRes = createSubResult(FAIL, tmpBuf);
            }
            
            addResult(rec, tmpRes.passed, tmpRes.feedback);
            free(tmpRes.feedback);
            if (tmpRes.passed == SUCCESS){
                rec->subsPassed++;
            }
        }
    }
}

void runSubTest(int testNum, int subTest, testRec* rec, SubTestRec (*testFunc)(int, int)){
    int pipefd[2];
    pid_t childPID;
    
    pipe(pipefd); // create the pipe
    childPID = fork();
    if(childPID >= 0){ // fork was successful
        if (childPID == 0){
            signal(SIGSEGV, SIG_DFL);
            
            SubTestRec tmpRec = testFunc(testNum, subTest);
            
            sendSubDataToParent(pipefd, &tmpRec);
            free(tmpRec.feedback);
            exit(EXIT_SUCCESS);
        }else{
            SubTestRec tmpRes = getSubDataFromChild(pipefd);
            
            int status;
            wait(&status);
            
            if (WIFSIGNALED(status)){
                char tmpBuf[1000];
                switch (WTERMSIG(status)){
                    case SIGSEGV:
                        sprintf(tmpBuf, "Test %d.%d encountered a segmentation fault and crashed", testNum, subTest);
                        break;
                    case SIGBUS:
                        sprintf(tmpBuf, "Test %d.%d encountered a bus error and crashed", testNum, subTest);
                        break;
                    default:
                        sprintf(tmpBuf, "Test %d.%d crashed - killed by a signal %d", testNum, subTest, WTERMSIG(status));
                        break;
                }
                tmpRes = createSubResult(FAIL, tmpBuf);
            }
            
            addResult(rec, tmpRes.passed, tmpRes.feedback);
            free(tmpRes.feedback);
            if (tmpRes.passed == SUCCESS){
                rec->subsPassed++;
            }
        }
    }
}

void destroyRecords(testRec ** testRecords, int size)
{
    int i = 0;

    for(i = 0; i < size; i++)
    {
        destroyRecord(testRecords[i]);
    }
}

void destroyRecord(testRec * tmp)
{
    int j = 0;

    if(tmp != NULL)
    {
        for(j = 0; j < tmp->feedbackLen; j++)
        {
            if(tmp->feedback[j] != NULL)
            {
                free(tmp->feedback[j]);
            }
        }

        free(tmp->feedback);
        free(tmp);
    }
}

testRec * initRec(int testNum, int numSubs, char * header)
{
	testRec * newRec = malloc(sizeof(testRec));
	newRec->numSubs = numSubs;
	newRec->feedback = malloc(sizeof(char *)*(numSubs+10)); //10 extra lines for output
	newRec->feedback[0] = malloc(sizeof(char)*(strlen(header)+1));
	strcpy(newRec->feedback[0], header);
	newRec->feedbackLen=1;
	newRec->testNum = testNum;
	newRec->subsPassed = 0;


	return newRec;
}

SubTestRec createSubResult(testResult res, char* feedback){
    SubTestRec result;
    
    result.passed = res;
    result.feedback = malloc(sizeof(char)*(strlen(feedback)+1));
    strcpy(result.feedback, feedback);
    
    return result;
}

void addResult( testRec * rec, testResult res, char * add)
{

	rec->feedback[rec->feedbackLen] = malloc(sizeof(char)*(strlen(add)+20));

	if (res == SUCCESS)
	{
		strcpy(rec->feedback[rec->feedbackLen], GRN"SUCCESS: ");
	}
	else
	{
		strcpy(rec->feedback[rec->feedbackLen], RED"FAIL: ");
	}

	strcat(rec->feedback[rec->feedbackLen],add);
	strcat(rec->feedback[rec->feedbackLen],RESET);
	rec->feedbackLen++;
}


void printRecord (testRec * rec)
{
	int i;

	//printf("subs passed %d, subs total %d",rec->subsPassed, rec->numSubs);
	printf("\n");
	if(rec->subsPassed == rec->numSubs)
	{
		printf(GRN"%s: PASSED %d/%d tests\n"RESET,rec->feedback[0],rec->subsPassed, rec->numSubs); //header for test is always at position 0
	}
	else
	{
		printf(RED"%s: FAILED %d/%d tests\n"RESET,rec->feedback[0],rec->numSubs-rec->subsPassed, rec->numSubs); //header for test is always at position 0

	}
//printf("\n");
	for(i=1; i<rec->feedbackLen; i++)
	{
		printf("    %s\n", rec->feedback[i]);
	}

}

int getScore(testRec * rec)
{
	if(rec->subsPassed == rec->numSubs) return 1;
	else return 0;
}
