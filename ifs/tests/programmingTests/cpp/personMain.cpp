/** 
 Testing programs only, not validated in any way.
 Jamey
 */


 #include<iostream>
 #include<string>
 #include<vector>
 #include<algorithm>
 #include<cmath>
 #include<functional>
 #include<iterator>
 #include<ostream>

 #include "person.h"

using namespace std;
int main( int argc, char ** argv )
{
	Person * p = new Person();

	p->setData( NULL );

	
	p->age = 10;
	
	cout << p << "\n";



}

