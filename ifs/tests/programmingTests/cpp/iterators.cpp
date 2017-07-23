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

using namespace std;
int main( int argc, char ** argv )
{

	string str = "";
	istream_iterator< string > in(cin);
	copy(in, istream_iterator<string> (), ostream_iterator< string > ( cout ) );
}

