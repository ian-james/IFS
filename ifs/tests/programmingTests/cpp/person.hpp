#ifndef PERSON_H
#define PERSON_H

/** 
 Testing programs only, not validated in any way.
 Jamey
 */

 #include<string>

class Person {
	public:
		Person();
		Person( const std::string& name, int age );

		void setData( void * bad);

		int getAge() const;

	protected:
		std::string m_name;
		int age;
};

#endif

