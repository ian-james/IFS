#include "VCardParser.h"
#include <stdlib.h>

int main(int argc, char* argv[])
{
    Card *card;
    char* files[] = {"testFiles/valid/testCardMin.vcf", "testFiles/valid/testCardN-compVal.vcf", "testFiles/valid/testCardProps-Groups.vcf", "testFiles/valid/testCard.vcf"};
    
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
    VCardErrorCode err = createCard(files[fileNum], &card);

    if (err == OK){
        char* str = printCard(card);
        free(str);
        deleteCard(card);
    }

    return 0;
    
}



