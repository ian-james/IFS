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
Calendar* _tAlmPropCalendar(void);
Calendar* _tFoldedCalendar1(void);
Calendar* _tFoldedCalendar2(void);
Calendar* _tFoldedCalendar3(void);
Calendar* _tMegaCal(void);
Calendar* _tMegaLineFolding(void);


//A2
// MARK: A2 TEST CASES
Calendar* _tInvalidEventCalendar(void);
Calendar* _tInvalidMultiComp(void);
Calendar* _tInvalidDuration(void);
Calendar* _tInvalidCalScale(void);
Calendar* _tInvalidAttach(void);

#endif