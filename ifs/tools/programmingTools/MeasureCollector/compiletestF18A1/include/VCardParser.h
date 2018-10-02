#ifndef _CARDPARSER_H
#define _CARDPARSER_H

#include <stdbool.h>
#include <string.h>
#include <stdio.h>
#include <stdlib.h>

#include "LinkedListAPI.h"

typedef enum ers {OK, INV_FILE, INV_CARD, INV_PROP, WRITE_ERROR, OTHER_ERROR } VCardErrorCode;

/*	Represents vCard Date-time, needed for date-related properties, i.e. birthday and anniversary
	We assume that the type of date-related parameters is either unspecified or is "date-and-or-time"
*/
typedef struct dt {
	//indicates whether this is UTC time
	bool	UTC;  

	//Indicates whether the date is a text value, e.g. "circa 1800"
	bool	isText;  

	//YYYYMMDD.
	//Must be an empty string if DateTime is text, 
	//or if the date portion of the date-and-or-time is unspecificed
	char 	date[9]; 

	//HHMMSS.
	//Must be an empty string if DateTime is text, 
	//or if the time portion of the date-and-or-time is unspecificed
	char 	time[7]; 
	
	//Text value for the DateTime. Must be an empty string if DateTime is not text
	//We use a C99 flexible array member, which we will discuss in class.
	char 	text[]; 

} DateTime;


//Represents a generic vCard parameter
typedef struct param {
	//Parameter name.  We will assume that the parameter name, even if malformed, does not exceed 200 bytes
	char 	name[200]; 

	//Property description.  
	char	value[]; 

} Parameter;


//Represents a generic vCard property
typedef struct prop {
	//Property name.  Must not be empty string.  Must not be NULL.
	char* 		name; 

	//Group name.  Groups are optional, so this may be an empty string.  Must not be NULL.
	char* 		group;

	/* 	List of property parameters.  All objects in the list will be of type Parameter.
		List may be empty if property parameters are absent.  List must never be NULL.  
    */
    List*		parameters;

	/*	Property value(s).  All objects in the list will be of type char* (string).
		Every preoperty hgas at least one value, but some might have multiple values.
		List of values must have at least one value in it.  List must never be NULL.
	*/
	List*		values; 

} Property;


//Represents an vCard object
typedef struct vCard {
	//We assume that version is always 4.0, so we don't need to include a field for it	
    
    /*
    vCard must contain at least one FN property, so we give it its own field
    	
    This will be the first FN property encountered in the vCard.  If any additional FN properties 
    exist in the file, they go into the optionalProperties list.  
	
	This property must not be NULL.
    */
	Property*	fn;

	/* List of additional vCard properties. All objects in the list will be of type Property. 
       List may be empty if optional properties are absent.  List must never be NULL.  
    */
    List* 		optionalProperties;

	//Individual's birthday.  Must be NULL if the birthday is not specified in vCard file
	DateTime*	birthday;

	/*	Individual's marriage, or equivalent, anniversary.  
		Must be NULL if the anniversary is not specified in vCard file
	*/
	DateTime* 	anniversary;


} Card;

// ************* Card parser fucntions - MUST be implemented ***************
VCardErrorCode createCard(char* fileName, Card** newCardObject);
void deleteCard(Card* obj);
char* printCard(const Card* obj);
char* printError(VCardErrorCode err);
// *************************************************************************

// ************* List helper functions - MUST be implemented *************** 
void deleteProperty(void* toBeDeleted);
int compareProperties(const void* first,const void* second);
char* printProperty(void* toBePrinted);

void deleteParameter(void* toBeDeleted);
int compareParameters(const void* first,const void* second);
char* printParameter(void* toBePrinted);

void deleteValue(void* toBeDeleted);
int compareValues(const void* first,const void* second);
char* printValue(void* toBePrinted);

void deleteDate(void* toBeDeleted);
int compareDates(const void* first,const void* second);
char* printDate(void* toBePrinted);
// **************************************************************************

#endif	
