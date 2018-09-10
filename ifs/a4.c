#include <stdio.h>
#include <stdlib.h>
//#include <omp.h>
#include <time.h>
#include <string.h>
#include <stdbool.h>
#include "hello/test.h"

#ifdef __APPLE__
#include <OpenCL/opencl.h>
#else
#include <CL/cl.h>
#endif


cl_device_id device_id();

cl_program build_program(cl_context ctx, cl_device_id dev, const char* filename);

/**
 * This function will multiply the given vector and matrix together, and placing the result
 * in a new result vector. This will be done in parallel with OpenMP, using threads number
 * of threads to complete the task.
 * @param result  The result vector to store the multiplication data
 * @param vector  the vector to multiply with
 * @param matrix  the matrix to multiply with
 * @param size    the size of the matrix and vectors
 * @param threads the number of threads to create
 */
void multiply(float * result, float * vector, float * matrix, int size, int threads);

/**
 * This function will create the matrix and vector based on the size parameter, and initialize
 * them with random values. It will also calculate the time it takes to successfully multiply
 * the matrix and vector.
 * @param  size    the size of the vector and matrix
 * @param  threads the number of threads to create
 * @return         the time the multiplication took to complete
 */
double matrixMultiply(int size, int threads);

/**
 * This function will print out the require time table with its test cases.
 */
void table();

/**
 * This function returns the proper matrix index for a given nested for loop iteration
 * @param  x    the value of the first loop iterator
 * @param  y    the value of the second loop iterator
 * @param  size the size of the matrix
 * @return      the index of the matrix
 */
int arrIndex(int x, int y, int size);

int main(int argc, char* argv[])
{

	int threads;
	int size;
	float timeTaken;

	//too few or too many arguments
	if(argc < 2 || argc > 3)
	{
		printf("Not enough arguments. Exiting\n");
		return 1;
	}
	if(argc == 2)
	{
		//if only 1 argument is present, check if it is a -g for the table
		if(strcmp(argv[1],"-g") == 0)
		{
			table();
			return 0;
		}
		else
		{
			printf("Incorrect Argument. Exiting\n");
			return 1;
		}
	}

	threads = strtol(argv[1], NULL, 10);
	size = strtol(argv[2], NULL, 10);

	timeTaken = matrixMultiply(size, threads);

	if(timeTaken == -1)
	{
		return 1;
	}

	printf("Time to complete: %lf seconds\n", timeTaken);

	return 0;
}

void table()
{
	printf("Size\tThreads\n");
	printf("\t1\t\t2\t\t4\n");
	printf("100\t%f\t%f\t%f\n", matrixMultiply(100, 1), matrixMultiply(100, 2), matrixMultiply(100, 4));
	printf("1000\t%f\t%f\t%f\n", matrixMultiply(1000, 1), matrixMultiply(1000, 2), matrixMultiply(1000, 4));
	printf("10000\t%f\t%f\t%f\n", matrixMultiply(10000, 1), matrixMultiply(10000, 2), matrixMultiply(10000, 4));
	printf("30000\t%f\t%f\t%f\n", matrixMultiply(30000, 1), matrixMultiply(30000, 2), matrixMultiply(30000, 4));
}

cl_device_id device_id()
{
	cl_platform_id platform;
	cl_device_id id;	
	int err;

	err = clGetPlatformIDs(1, &platform, NULL);
	if(err < 0)
	{
		perror("couldn't identify the platform.\n");
		exit(1);
	}

	err = clGetDeviceIDs(platform, CL_DEVICE_TYPE_GPU, 1, &id, NULL);
	if(err == CL_DEVICE_NOT_FOUND)
	{
		err = clGetDeviceIDs(platform, CL_DEVICE_TYPE_CPU, 1, &id, NULL);
	}

	if(err < 0)
	{
		perror("Couldn't identify an devices.\n");
		exit(1);
	}

	return id;

}

/* Create program from a file and compile it */
cl_program build_program(cl_context context, cl_device_id dev, const char* filename) 
{

	cl_program program;
	FILE *program_handle;
	char *source;
	size_t program_size;
	int err;

	   /* Read program file and place content into buffer */
	program_handle = fopen(filename, "r");
	if(program_handle == NULL) 
	{
		perror("Couldn't find the program file");
		exit(1);
	}
	fseek(program_handle, 0, SEEK_END);
	program_size = ftell(program_handle);
	rewind(program_handle);
	source = (char*)malloc(program_size + 1);
	source[program_size] = '\0';
	fread(source, sizeof(char), program_size, program_handle);
	fclose(program_handle);

	program = clCreateProgramWithSource(context, 1, (const char **)&source, NULL, &err);
	if (!program)
	{
		printf("cannot create the program\n");
		exit(1);
	}

	err = clBuildProgram(program, 0, NULL, NULL, NULL, NULL);
	if(err != CL_SUCCESS)
	{
		size_t len;
		char buffer[2048];
		printf("Error: Failed to build program executable!\n");
		clGetProgramBuildInfo(program, dev, CL_PROGRAM_BUILD_LOG, sizeof(buffer), 
			buffer, &len);

		printf("%s\n", buffer);
		exit(1);
	}


	return program;
}

double matrixMultiply(int size, int threads)
{
	float * vector;
	float * result;
	float * matrix;
	double taskTime;
	int total = size*size;
	//double start, end;
	srand(time(NULL));

	

	cl_device_id device;
	cl_context context;
	cl_program program;
	cl_kernel kernel;
	cl_command_queue queue;
	cl_int err;
	cl_event event;
	cl_ulong start, end;

	cl_mem gpuMatrix, gpuVector, gpuResult;

	char fileName[] = "./a4.cl";

	//allocate result vector
	result = malloc(sizeof(float) * size);
	if(result == NULL)
	{
		printf("could not allocate result vector. Exiting\n");
		return -1;
	}

	//allocate main vector
	vector = malloc(sizeof(float) * size);
	if(vector == NULL)
	{
		printf("could not allocate main vector. Exiting\n");
		free(result);
		return -1;
	}

	//allocate matrix
	matrix = malloc(sizeof(float) * size * size);
	if(matrix == NULL)
	{
		printf("could not allocate matrix vector. Exiting\n");
		free(result);
		free(vector);
		return -1;
	}


	//randomize numbers for the matrix and main vector
	for(int i = 0; i < size; i++)
	{
		//randomize a float number between 0 and 10, and assign it to each vector element
		vector[i] = (float)rand()/(float)(RAND_MAX/10);
		for(int j = 0; j < size; j++)
		{
			//randomize a float number between 0 and 10, and assign it to each matrix element
			matrix[arrIndex(i,j,size)] = (float)rand()/(float)(RAND_MAX/10);
		}
	}

	//get the device id
	device = device_id();

	//create context
	context = clCreateContext(0, 1, &device, NULL, NULL, &err);
	if(err < 0)
	{
		printf("error in creating context\n");
		exit(1);
	}


	//create command queue
	queue = clCreateCommandQueue(context, device, CL_QUEUE_PROFILING_ENABLE, &err);
	if(err < 0)
	{
		printf("error in creating command queue\n");
		exit(1);
	}



	//setup the buffers for the matrices and vectors
	gpuVector = clCreateBuffer(context, CL_MEM_READ_ONLY | CL_MEM_COPY_HOST_PTR, sizeof(float) * size, vector, &err);
	gpuMatrix = clCreateBuffer(context, CL_MEM_READ_ONLY | CL_MEM_COPY_HOST_PTR, sizeof(float) * total, matrix, &err);
	gpuResult = clCreateBuffer(context, CL_MEM_READ_ONLY | CL_MEM_COPY_HOST_PTR, sizeof(float) * size, result, &err);


	//build program and create the kernel
	program = build_program(context, device, fileName);
	kernel = clCreateKernel(program, "matrix_multiply", &err);
	if(err < 0)
	{
		printf("could not create kernel.\n");
		exit(1);
	}

	int i = size;
	int j = size;


	//set up the kernel arguments with their values
	err = clSetKernelArg(kernel, 0, sizeof(cl_mem), &gpuVector);
	err = clSetKernelArg(kernel, 1, sizeof(cl_mem), &gpuMatrix);
	err = clSetKernelArg(kernel, 2, sizeof(cl_mem), &gpuResult);
	err = clSetKernelArg(kernel, 3, sizeof(int), &size);
	err = clSetKernelArg(kernel, 4, sizeof(int), &i);
	err = clSetKernelArg(kernel, 5, sizeof(int), &j);
	if(err < 0)
	{
		printf("could not set kernel arguments.\n");
		exit(1);
	}

	int localSize = threads;
	while(size % localSize != 0)
	{
		if(localSize < size)
		{
			localSize++;
		}
		else
		{
			localSize--;
		}
		
	}

	const size_t local[1] = {localSize};
	const size_t global[1] = {i};

	//run the kernel
	//start = omp_get_wtime();
	err = clEnqueueNDRangeKernel(queue, kernel, 1, NULL, global, local, 0, NULL, &event);
	if(err < 0)
	{
		printf("could not run the kernel commands.\n");
		exit(1);
	}
	


	//finish the queue
	err = clFinish(queue);
	if(err < 0)
	{
		printf("kernel could not finish.\n");
		exit(1);
	}
	//end = omp_get_wtime();
	//
	clWaitForEvents(1, &event);

	clGetEventProfilingInfo(event, CL_PROFILING_COMMAND_START, sizeof(start), &start, NULL);
	clGetEventProfilingInfo(event, CL_PROFILING_COMMAND_END, sizeof(end), &end, NULL);


	//read results
	err = clEnqueueReadBuffer(queue, gpuResult, CL_TRUE, 0, sizeof(float) * size, result, 0, NULL, NULL);

	//time the multiplication process


	
	// start = omp_get_wtime();
	// multiply(result, vector, matrix, size, threads);
	// end = omp_get_wtime();
	

	taskTime = (end - start)/1000000.0;

	//free the allocated memory of opencl and heap
	free(vector);
    free(matrix);
    free(result);
    clReleaseMemObject(gpuVector);
    clReleaseMemObject(gpuMatrix);
    clReleaseMemObject(gpuResult);
    clReleaseProgram(program);
    clReleaseKernel(kernel);
    clReleaseCommandQueue(queue);
    clReleaseContext(context);

	return taskTime;

}


void multiply(float * result, float * vector, float * matrix, int size, int threads)
{

	//create threads to divide the matrix multiplication
	for(int i = 0; i < size; i++)
	{
		for(int j = 0; j < size; j++)
		{
			//do the matrix multiplication of the vector * matrix, and store the result in the result vector
			result[i] += vector[i] * matrix[arrIndex(i,j,size)];
		}
	}

}

int arrIndex(int x, int y, int size)
{
	return x * size + y;
}
