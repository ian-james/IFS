#include "VCardParser.h"
#include <stdlib.h>

int main(int argc, char* argv[])
{
    Card *card;
    char* file = {"testFiles/valid/testCardProps-Params.vcf"};
    
    VCardErrorCode retVal = createCard(file, &card);
    if (retVal == OK){
        char* str = printCard(card);
        fprintf(stderr, "%s\n", str);
        free(str);
        deleteCard(card);
    }
    
    return 0;
    
}



