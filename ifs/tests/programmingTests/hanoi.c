//tower_of_hanoi.c
//Keefer Rourke
//
//Problem: solve the minimum number of moves required to solve the tower of hanoi
//for a set of 3 towers where the number of discs is defined by the user

#include <stdio.h>


void tower(int num, int sourceTower, int destinationTower, int storageTower);

int main()
{
    int numDiscs;

    do {
        printf("Enter the number of discs: ");
        scanf("%d", &numDiscs);
		getchar();

        if (numDiscs <= 0)
            fprintf(stderr, "Error.\n");
    } while (numDiscs <= 0);

    tower(numDiscs, 1, 2, 3);

    return 0;
}


void tower(int num, int sourceTower, int destinationTower, int storageTower)
{
    if (num > 0)
    {
        tower(num-1, sourceTower, storageTower, destinationTower);
        printf("Moved top disk from %d to %d.\n", sourceTower, destinationTower);
        tower(num-1, storageTower, destinationTower, sourceTower);
    }
}
