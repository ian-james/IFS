#include "person.hpp"

Person::Person() : m_name("Jamey")
{
	// BAD
	age = "What";

}
	
Person::Person( const std::string& name, int age )
{
	m_name = name;
	this->age = age;
}

void Person::setData( void * bad ) 
{
	// Bad
	cout << *(static_cast<int*>(bad)) << std::endl;
}

int Person::getAge() const
{
	return age;
}

