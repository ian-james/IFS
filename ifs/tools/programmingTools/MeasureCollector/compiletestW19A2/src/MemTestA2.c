#include "CalendarParser.h"
#include <stdlib.h>

static DateTime _tCreateTestDateTime(char* date, char* time, bool UTC){
    DateTime tempDT;

    tempDT.UTC = UTC;
    strcpy(tempDT.date, date);
    strcpy(tempDT.time, time);
    
    return tempDT;
}

int main(int argc, char* argv[])
{
    DateTime dt;
    
    dt = _tCreateTestDateTime("19540203","123012",true);
    char* dtStr = dtToJSON(dt);
    printf("%s\n",dtStr);
    free(dtStr);
    
    return 0;
    
}



