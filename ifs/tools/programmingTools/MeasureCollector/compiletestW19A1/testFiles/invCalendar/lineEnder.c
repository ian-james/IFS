#include <stdio.h>
#include <string.h>

int main(int argc, char* argv[]){
	
	FILE* file = fopen(argv[1], "r");
	FILE* outFile;
	char tmpBuf[100];
	
    if (argc == 3 || argc == 4){
		outFile = fopen(argv[2], "w");
	}

	
	
	while ( fgets(tmpBuf, sizeof tmpBuf, file) ){
		
		if (argc == 3){
			if (strstr(tmpBuf, "\r\n") == NULL){
                int endChar = strlen(tmpBuf);
                tmpBuf[endChar-1] = '\r';
                tmpBuf[endChar] = '\n';
                tmpBuf[endChar+1] = '\0';
			}
			fprintf(outFile, "%s", tmpBuf);
        }else if (argc == 4){
            
            if (strstr(tmpBuf, "\r\n") != NULL){
                int endChar = strlen(tmpBuf);
                tmpBuf[endChar-2] = '\n';
                tmpBuf[endChar-1] = '\0';
            }
            fprintf(outFile, "%s", tmpBuf);
        }
			
		char outputBuf[200];
		int len = strlen(tmpBuf);
		int cnt = 0;
		
		for (int i = 0; i < len; i++){
			if (tmpBuf[i] == '\r'){
				outputBuf[cnt] = '\\';
				cnt += 1;
				outputBuf[cnt] = 'r';
			}else if(tmpBuf[i] == '\n'){
				outputBuf[cnt] = '\\';
				cnt += 1;
				outputBuf[cnt] = 'n';				
			}else{
				outputBuf[cnt] = tmpBuf[i];
			}
			cnt += 1;
		}
		outputBuf[cnt] = '\0';
		
		
		
		
		printf("%s\n", outputBuf);
	}
	fclose(file);
	if (argc == 3){
		fclose(outFile);
	}
	return 0;
}
