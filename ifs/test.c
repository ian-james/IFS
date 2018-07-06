#include <stdio.h>
#include <omp.h>
#include <string.h>


int main(int argc, char * argv[])
{

    printf("there are %d arguments found\n", argc);

    for(int i = 0; i < argc; i++)
    {
        printf("%s\n", argv[i]);
    }

	char strArr[1][1000] = {'\0'};


	// char arr[1][255] = {"./tools/programmingTools/c_tools/programmingParser.py -t gcc -s c99  -f -Wall  -f -Wextra -f -pedantic -f -pedantic-errors -d users/1/unzipped",
	// 					};

	// #pragma omp parallel for
	// for(int k = 0; k < 1; k++)
	// {

	// 	char str[255] = {'\0'};
	// 	char temp[1000] = {'\0'};

	// 	FILE * fp;

	// 	fp = popen(arr[k], "r");

	// 	while(fgets(str, sizeof(str)-1, fp) != NULL)
	// 	{
	// 		strcat(temp, str);
	// 	}

	// 	pclose(fp);

	// 	strcpy(strArr[k], temp);

	// }

	// for(int i = 0; i < 1; i++)
	// {
	// 	printf("%s\n", strArr[i]);
	// }


}
