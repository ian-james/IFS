#include "CalendarParser.h"
#include <stdlib.h>

int main(int argc, char* argv[])
{
    Calendar *cal;
    char* files[] = {"testFiles/validCalendar/testCalSimpleNoUTC.ics", "testFiles/validCalendar/testCalSimpleUTC.ics", "testFiles/validCalendar/testCalEvtProp.ics", "testFiles/validCalendar/testCalEvtPropAlm.ics"};
    
    if (argc != 2){
        fprintf(stderr, "usage: calMemTest fileNum, where filenum is a number between 1 and 4\n");
        exit(0);
    }
    
    int fileNum = atoi(argv[1]);
    
    if (fileNum < 1 || fileNum > 4){
        fprintf(stderr, "usage: calMemTest fileNum, where filenum is a number between 1 and 4\n");
        exit(0);
    }
    
    fileNum -= 1;
    
    createCalendar(files[fileNum], &cal);
    deleteCalendar(cal);
    
    return 0;
    
}



