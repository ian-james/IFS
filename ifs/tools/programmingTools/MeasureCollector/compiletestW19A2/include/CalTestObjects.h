#ifndef CAL_TEST_OBJECTS_H
#define CAL_TEST_OBJECTS_H

#include "CalendarParser.h"
#include "CalTestUtilities.h"

//A1
Calendar* _tSimpleCalendar(void);
Calendar* _tSimpleCalendarUTC(void);
Calendar* _tSimpleCalendarProps(void);
Calendar* _tMultiEventCalendar(void);
Calendar* _tEvtPropCalendar(void);
Calendar* _tEvtPropCalendar2(void);
Calendar* _tAlmPropCalendar(void);
Calendar* _tFoldedCalendar1(void);
Calendar* _tFoldedCalendar2(void);
Calendar* _tFoldedCalendar3(void);
Calendar* _tMegaCal(void);
Calendar* _tMegaLineFolding(void);


//A2
// MARK: A2 TEST CASES

Calendar* _tSimpleCalendar2Props2Events(void);

Calendar* _tInvalidCalNullList1(void);
Calendar* _tInvalidCalNullList2(void);
Calendar* _tInvalidCalDupVal(void);
Calendar* _tInvalidNonCalProp(void);
Calendar* _tInvalidCalEmptyPropVal(void);

Calendar* _tInvalidEventNullList1(void);
Calendar* _tInvalidEventNullList2(void);
Calendar* _tInvalidEventShortDate(void);
Calendar* _tInvalidEventDupProp(void);
Calendar* _tInvalidEventNonEvProp(void);

Calendar* _tInvalidAlmNullTrigger(void);
Calendar* _tInvalidAlmNullList(void);
Calendar* _tInvalidAlarmDupProp(void);
Calendar* _tInvalidAlarmNonAlmProp(void);



#endif