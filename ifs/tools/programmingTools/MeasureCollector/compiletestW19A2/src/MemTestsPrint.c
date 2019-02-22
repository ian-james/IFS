#include "CalendarParser.h"
#include <stdlib.h>

int main(int argc, char* argv[])
{
    Calendar *cal;
    char* files[] = {"testFiles/validCalendar/testCalSimpleUTC.ics", "testFiles/validCalendar/testCalEvtProp.ics", "testFiles/validCalendar/testCalEvtPropAlm.ics", "testFiles/validA2/megaCal1.ics"};
    
    if (argc != 2){
        fprintf(stderr, "usage: %s fileNum, where filenum is a number between 1 and 4\n", argv[0]);
        exit(0);
    }
    
    int fileNum = atoi(argv[1]);
    
    if (fileNum < 1 || fileNum > 4){
        fprintf(stderr, "usage: %s fileNum, where filenum is a number between 1 and 4\n", argv[0]);
        exit(0);
    }
    
    fileNum -= 1;
    
    printf("Testing create/print/detete for leaks using file %d %s\n", fileNum, files[fileNum]);
    ICalErrorCode err = createCalendar(files[fileNum], &cal);

    if (err == OK){
        char* str = printCalendar(cal);
        free(str);
        deleteCalendar(cal);
    }

    return 0;
    
}



