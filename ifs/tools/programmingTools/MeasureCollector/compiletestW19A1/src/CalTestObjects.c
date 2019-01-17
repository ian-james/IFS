#include "CalendarParser.h"
#include "CalTestUtilities.h"
#include "CalTestObjects.h"


//************************************ A1 ************************************
Calendar* _tSimpleCalendar(void)
{
    Calendar* calendar = _tCreateTestCalendar("-//hacksw/handcal//NONSGML v1.0//EN", 2);

    DateTime dtStamp = _tCreateTestDateTime("19970714","170000",false);
    DateTime dtStart = _tCreateTestDateTime("19970714","170000",false);
    Event *event = _tCreateTestEvent("uid1@example.com", dtStamp, dtStart);

    _tInsertBack(calendar->events, event);

    return calendar;
}


//Calendar with one Event (no Alarms or Properties), UTC
Calendar* _tSimpleCalendarUTC(void)
{
    Calendar* calendar = _tCreateTestCalendar("-//hacksw/handcal//NONSGML v1.0//EN", 2);

    DateTime dtStamp = _tCreateTestDateTime("19970714","170000",true);
    DateTime dtStart = _tCreateTestDateTime("19970714","170000",true);
    Event *event = _tCreateTestEvent("uid1@example.com", dtStamp, dtStart);

    _tInsertBack(calendar->events, event);

    return calendar;
}

Calendar* _tSimpleCalendarProps(void)
{
    Calendar* calendar = _tCreateTestCalendar("-//hacksw/handcal//NONSGML v1.0//EN", 2);
    Property* prop;

    prop = _tCreateTestProp("CALSCALE", "GREGORIAN");
    _tInsertBack(calendar->properties, prop);
    prop = _tCreateTestProp("METHOD", "REQUEST");
    _tInsertBack(calendar->properties, prop);

    DateTime dtStamp = _tCreateTestDateTime("19970714","170000",false);
    DateTime dtStart = _tCreateTestDateTime("19970714","170000",false);
    Event *event = _tCreateTestEvent("uid1@example.com", dtStamp, dtStart);

    _tInsertBack(calendar->events, event);

    return calendar;
}


Calendar* _tMultiEventCalendar(void) {

    Calendar* calendar = _tCreateTestCalendar("-//hacksw/handcal//NONSGML v1.0//EN", 2);

    DateTime dtStamp = _tCreateTestDateTime("19970714","170000",false);
    DateTime dtStart = _tCreateTestDateTime("19970714","170000",false);

    Event* event = _tCreateTestEvent("uid1@example.com", dtStamp, dtStart);
    _tInsertBack(calendar->events, event);
    
    dtStamp = _tCreateTestDateTime("20190101","170000",true);
    dtStart = _tCreateTestDateTime("20190108","210000",true);

    event = _tCreateTestEvent("uid2@example.com", dtStamp, dtStart);
    _tInsertBack(calendar->events, event);
    
    return calendar;
}

//Calendar with Event Properties and no Alarms
Calendar* _tEvtPropCalendar(void)
{
    Calendar* calendar = _tCreateTestCalendar("-//hacksw/handcal//NONSGML v1.0//EN", 2);

    DateTime dtStamp = _tCreateTestDateTime("19970714","170000",true);
    DateTime dtStart = _tCreateTestDateTime("19970714","170000",true);
    Event *event = _tCreateTestEvent("uid1@example.com", dtStamp, dtStart);

    _tInsertBack(calendar->events, event);

    Property* prop = _tCreateTestProp("ORGANIZER", "CN=John Doe:MAILTO:john.doe@example.com");
    _tInsertBack(event->properties, (void*)prop);
    prop = _tCreateTestProp("DTEND", "19970715T035959Z");
    _tInsertBack(event->properties, (void*)prop);
    prop = _tCreateTestProp("CLASS", "PUBLIC");
    _tInsertBack(event->properties, (void*)prop);
    prop = _tCreateTestProp("SUMMARY", "Bastille Day Party");
    _tInsertBack(event->properties, (void*)prop);

    return calendar;
}


//Calendar with Event Properties and Alarms
Calendar* _tAlmPropCalendar(void)
{
    Calendar* calendar = _tCreateTestCalendar("-//Mozilla.org/NONSGML Mozilla Calendar V1.1//EN", 2);

    DateTime dtStamp = _tCreateTestDateTime("20160106","145812",true);
    DateTime dtStart = _tCreateTestDateTime("20151002","100000",true);
    Event *event = _tCreateTestEvent("332414a0-54a1-408b-9cb1-2c9d1ad3696d", dtStamp, dtStart);

    _tInsertBack(calendar->events, event);

    //Add properties
    Property* prop = _tCreateTestProp("CREATED", "20160106T145812Z");
    _tInsertBack(event->properties, (void*)prop);
    prop = _tCreateTestProp("LAST-MODIFIED", "20160106T145812Z");
    _tInsertBack(event->properties, (void*)prop);
    prop = _tCreateTestProp("SUMMARY", "Han Solo @ Naboo");
    _tInsertBack(event->properties, (void*)prop);
    prop = _tCreateTestProp("STATUS", "CONFIRMED");
    _tInsertBack(event->properties, (void*)prop);
    prop = _tCreateTestProp("ORGANIZER", "CN=Obi-Wan Kenobi;mailto:laowaion@padawan.com");
    _tInsertBack(event->properties, (void*)prop);
    prop = _tCreateTestProp("DTEND", "20151002T110000");
    _tInsertBack(event->properties, (void*)prop);

    //Add alarms
    
    //Alarm 1
    Alarm* testAlm = _tCreateTestAlarm("AUDIO","VALUE=DATE-TIME:19970317T133000Z");

    prop = _tCreateTestProp("REPEAT", "4");
    _tInsertBack(testAlm->properties, (void*)prop);
    prop = _tCreateTestProp("DURATION", "PT15M");
    _tInsertBack(testAlm->properties, (void*)prop);
    prop = _tCreateTestProp("ATTACH", "FMTTYPE=audio/basic:ftp://example.com/pub/sounds/bell-01.aud");
    _tInsertBack(testAlm->properties, (void*)prop);

    _tInsertBack(event->alarms, testAlm);

    //Alarm 2
    testAlm = _tCreateTestAlarm("AUDIO","VALUE=DATE-TIME:19970317T173000Z");

    prop = _tCreateTestProp("REPEAT", "4");
    _tInsertBack(testAlm->properties, (void*)prop);
    prop = _tCreateTestProp("DURATION", "PT25M");
    _tInsertBack(testAlm->properties, (void*)prop);
    prop = _tCreateTestProp("ATTACH", "FMTTYPE=audio/basic:ftp://example.com/pub/sounds/bell-02.aud");
    _tInsertBack(testAlm->properties, (void*)prop);

    _tInsertBack(event->alarms, testAlm);

    return calendar;
}

Calendar* _tFoldedCalendar1(void) {

    Calendar* calendar = _tCreateTestCalendar("-//hacksw/handcal//NONSGML v1.0//EN", 2);

    DateTime dtStamp = _tCreateTestDateTime("19970714","170000",true);
    DateTime dtStart = _tCreateTestDateTime("19970714","170000",true);
    Event *event = _tCreateTestEvent("uid1@example.com", dtStamp, dtStart);

    _tInsertBack(calendar->events, event);

    Property *prop = _tCreateTestProp("ORGANIZER", "CN=Jimmy Johnson:MAILTO:john.doe@example.com");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("DTEND", "19970715T035959Z");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("CLASS", "PUBLIC");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("SUMMARY", "Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
    _tInsertBack(event->properties, prop);
    
    return calendar;
}

Calendar* _tFoldedCalendar2(void) {

    Calendar* calendar = _tCreateTestCalendar("-//hacksw/handcal//NONSGML v1.0//EN", 2);

    DateTime dtStamp = _tCreateTestDateTime("19970714","170000",true);
    DateTime dtStart = _tCreateTestDateTime("19970714","170000",true);
    Event *event = _tCreateTestEvent("uid1@example.com", dtStamp, dtStart);

    _tInsertBack(calendar->events, event);

    Property *prop = _tCreateTestProp("ORGANIZER", "CN=Jimmy Johnson:MAILTO:john.doe@example.com");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("DTEND", "19970715T035959Z");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("CLASS", "PUBLIC");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("SUMMARY", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
    _tInsertBack(event->properties, prop);

    return calendar;
}


Calendar* _tFoldedCalendar3(void) {

    Calendar* calendar = _tCreateTestCalendar("-//Mozilla.org/NONSGML Mozilla Calendar V1.1//EN", 2);

    Property* prop = _tCreateTestProp("METHOD", "xyz");
    _tInsertBack(calendar->properties, prop);
    prop = _tCreateTestProp("CALSCALE", "GREGORIAN");
    _tInsertBack(calendar->properties, prop);

    DateTime dtStamp = _tCreateTestDateTime("20160106","145812",true);
    DateTime dtStart = _tCreateTestDateTime("20151002","100000",true);
    Event *firstEvent = _tCreateTestEvent("332414a0-54a1-408b-9cb1-2c9d1ad3696d", dtStamp, dtStart);

    _tInsertBack(calendar->events, firstEvent);
    
    prop = _tCreateTestProp("LAST-MODIFIED", "20160106T145812Z");
    _tInsertBack(firstEvent->properties, prop);
    prop = _tCreateTestProp("ORGANIZER", "CN=Obi-Wan Kenobi;mailto:laowaion@padawan.com");
    _tInsertBack(firstEvent->properties, prop);
    prop = _tCreateTestProp("CREATED", "20160106T145812Z");
    _tInsertBack(firstEvent->properties, prop);
    prop = _tCreateTestProp("SUMMARY", "Han Solo @ Naboo");
    _tInsertBack(firstEvent->properties, prop);
    prop = _tCreateTestProp("STATUS", "CONFIRMED");
    _tInsertBack(firstEvent->properties, prop);
    prop = _tCreateTestProp("DTEND", "20151002T110000");
    _tInsertBack(firstEvent->properties, prop);

    Alarm *alarmOne = _tCreateTestAlarm("AUDIO","VALUE=DATE-TIME:19970317T133000Z");
     _tInsertBack(firstEvent->alarms, alarmOne);
    
    prop = _tCreateTestProp("REPEAT", "4");
    _tInsertBack(alarmOne->properties, prop);
    prop = _tCreateTestProp("DURATION", "PT15M");
    _tInsertBack(alarmOne->properties, prop);
    prop = _tCreateTestProp("ATTACH", "FMTTYPE=audio/basic:ftp://example.com/pub/sounds/bell-01.aud");
    _tInsertBack(alarmOne->properties, prop);


    Alarm *alarmTwo = _tCreateTestAlarm("AUDIO","-PT30M");
    _tInsertBack(firstEvent->alarms, alarmTwo);
    
    prop = _tCreateTestProp("DURATION", "PT15M");
    _tInsertBack(alarmTwo->properties, prop);
    prop = _tCreateTestProp("REPEAT", "2");
    _tInsertBack(alarmTwo->properties, prop);


    // Second event
    dtStamp = _tCreateTestDateTime("19970714","170000",true);
    dtStart = _tCreateTestDateTime("19970714","170000",true);
    Event *secondEvent = _tCreateTestEvent("uid1@example.com", dtStamp, dtStart);
    _tInsertBack(calendar->events, secondEvent);
    
    prop = _tCreateTestProp("ORGANIZER", "CN=John Doe:MAILTO:john.doe@example.com");
    _tInsertBack(secondEvent->properties, prop);
    prop = _tCreateTestProp("DTEND", "19970715T035959Z");
    _tInsertBack(secondEvent->properties, prop);
    prop = _tCreateTestProp("CLASS", "PUBLIC");
    _tInsertBack(secondEvent->properties, prop);
    prop = _tCreateTestProp("SUMMARY", "Bastille Day Party");
    _tInsertBack(secondEvent->properties, prop);

    _tInsertBack(secondEvent->alarms, alarmOne);
    _tInsertBack(secondEvent->alarms, alarmTwo);

    return calendar;
}


Calendar* _tMegaCal(void) {

    Property *prop = NULL;
    Calendar* calendar = _tCreateTestCalendar("-//hacksw/handcal//NONSGML v1.0//EN", 2);
    DateTime dtStamp;
    DateTime dtStart;

    prop = _tCreateTestProp("CALSCALE", "GREGORIAN");
    _tInsertBack(calendar->properties, prop);

    // first event
    
    dtStamp = _tCreateTestDateTime("19970714","170000",true);
    dtStart = _tCreateTestDateTime("19970714","170000",true);
    Event* event = _tCreateTestEvent("uid1@example.com", dtStamp, dtStart);
    _tInsertBack(calendar->events, event);

    prop = _tCreateTestProp("ORGANIZER", "CN=Jimmy Johnson:MAILTO:john.doe@example.com");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("DTEND", "19970715T035959Z");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("CLASS", "PUBLIC");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("SUMMARY", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
    _tInsertBack(event->properties, prop);
    
    
    Alarm* alarm1 = _tCreateTestAlarm("AUDIO","VALUE=DATE-TIME:19970317T133000Z");
    
    prop = _tCreateTestProp("REPEAT", "5");
    _tInsertBack(alarm1->properties, prop);
    prop = _tCreateTestProp("DURATION", "PT55M");
    _tInsertBack(alarm1->properties, prop);
    prop = _tCreateTestProp("ATTACH", "FMTYPE=audio/basic:ftp://example.com/pub/sounds/really-longfile.aud");
    _tInsertBack(alarm1->properties, prop);

    _tInsertBack(event->alarms, alarm1);

    alarm1 = _tCreateTestAlarm("AUDIO","VALUE=DATE-TIME:19970317T133000Z");
    
    prop = _tCreateTestProp("REPEAT", "5");
    _tInsertBack(alarm1->properties, prop);
    prop = _tCreateTestProp("DURATION", "PT55M");
    _tInsertBack(alarm1->properties, prop);
    prop = _tCreateTestProp("ATTACH", "FMTYPE=audio/basic:ftp://example.com/pub/sounds/test.aud");
    _tInsertBack(alarm1->properties, prop);

    // 2 of the same alarms
    _tInsertBack(event->alarms, alarm1);
    _tInsertBack(event->alarms, alarm1); 

    // second event
    dtStamp = _tCreateTestDateTime("19970714","170000",true);
    dtStart = _tCreateTestDateTime("19970714","170000",true);
    event = _tCreateTestEvent("uid2@example.com", dtStamp, dtStart);

    prop = _tCreateTestProp("ORGANIZER", "CN=Cornelius Samuelson III:MAILTO:corneliussamsuelsoniii@gmail.com");
    _tInsertBack(event->properties, prop);
    
    prop = _tCreateTestProp("DTEND", "19970715T035959Z");
    _tInsertBack(event->properties, prop);
    
    prop = _tCreateTestProp("CLASS", "PUBLIC");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("SUMMARY", "Lunch (Slop) at 12:30pm with the proletariat where Cornelius will discuss wage cuts.");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("DESCRIPTION", "The wages are much too high and Cornelius requires an addition on his mansion to host parties. Such cost will be covered through extensive wage reductions.");
    _tInsertBack(event->properties, prop);

    _tInsertBack(calendar->events, event);

    //THIRD EVENT
    dtStamp = _tCreateTestDateTime("19970714","170000",true);
    dtStart = _tCreateTestDateTime("19970714","170000",true);
    event = _tCreateTestEvent("uid3@example.com", dtStamp, dtStart);

    prop = _tCreateTestProp("ORGANIZER", "CN=Jimmy Johnson:MAILTO:john.doe@example.com");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("DTEND", "19970715T035959Z");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("CLASS", "PUBLIC");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("PRIORITY", "7");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("LOCATION", "SOMEWHEREVILLE");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("GEO", "0.1241154;-122.08324");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("STATUS", "CONFUSED");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("TRANSP", "OPAQUE");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("RESOURCES", "Things that are necessary");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("SUMMARY", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("DESCRIPTION", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque porta accumsan ante, nec auctor risus fermentum in. Sed vestibulum pretium mi, vitae vestibulum mi auctor eu. Fusce mattis porta erat, non convallis nisi fringilla malesuada. Nulla odio massa, venenatis in est at, varius tempus ipsum. Vivamus molestie efficitur urna id ultricies. Aenean placerat pellentesque nunc sed iaculis. Suspendisse consequat lorem ligula, quis sagittis massa vestibulum ac. Cras dictum pretium enim, sit amet sollicitudin augue. Suspendisse nec neque auctor lectus sollicitudin vulputate. Integer non eleifend turpis. Maecenas at tellus feugiat, convallis enim a, pretium lorem. Ut vel enim sed magna porta pulvinar eu eu mi. Sed laoreet nibh arcu, eget tempus ex dapibus id. Aliquam interdum feugiat sapien vel tincidunt. Quisque elit sapien, malesuada at ultrices eget, tempus a erat. Nulla tristique tincidunt odio, et cursus ante gravida nec. Curabitur varius consequat nisi, eu varius turpis sagittis in. Vestibulum velit nisl, semper consectetur risus nec, ullamcorper volutpat est. Maecenas elementum euismod est pretium aliquam. Praesent feugiat sem mi, a viverra leo fermentum in. Fusce iaculis dictum eleifend. Maecenas sit amet ultricies augue. Vivamus sed mauris in orci bibendum egestas. Donec elementum a dolor in aliquet. Duis arcu augue, malesuada a odio a, bibendum pellentesque purus. Suspendisse urna magna, tristique vitae ipsum a, pellentesque pulvinar ante. Ut ut finibus turpis, eget eleifend odio.");
    _tInsertBack(event->properties, prop);

    alarm1 = _tCreateTestAlarm("AUDIO","VALUE=DATE-TIME:19970317T133000Z");
    prop = _tCreateTestProp("REPEAT", "5");
    _tInsertBack(alarm1->properties, prop);
    prop = _tCreateTestProp("DURATION", "PT55M");
    _tInsertBack(alarm1->properties, prop);
    prop = _tCreateTestProp("ATTACH", "FMTYPE=audio/basic:ftp://example.com/pub/sounds/really-longfile.aud");
    _tInsertBack(alarm1->properties, prop);

    _tInsertBack(event->alarms, alarm1);

    _tInsertBack(calendar->events, event);

    return calendar;

}


Calendar* _tMegaLineFolding(void) {

    Property *prop = NULL;
    Calendar* cal = _tCreateTestCalendar("-/SOME/PROD/ID", 2);
    DateTime dtStamp;
    DateTime dtStart;
    
    prop = _tCreateTestProp("CALSCALE", "GREGORIAN");
    _tInsertBack(cal->properties, prop);
    prop = _tCreateTestProp("METHOD", "REQUEST");
    _tInsertBack(cal->properties, prop);

    // FIRST Event
    dtStamp = _tCreateTestDateTime("19970815","170000",true);
    dtStart = _tCreateTestDateTime("19970815","170000",true);
    Event* event = _tCreateTestEvent("SOMEUID1@EXAMPLE.COM", dtStamp, dtStart);

    prop = _tCreateTestProp("CLASS", "SOMECLASS");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("DESCRIPTION", "Event description for a very big and exciting event.");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("GEO", "-0.12451,17.017471");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("LOCATION", "GUELPH");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("ORGANIZER", "JDAWG@GMAIL.COM");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("PRIORITY", "1000");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("SEQUENCE", "1");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("STATUS", "NEEDS-ACTION");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("SUMMARY", "This event is not optional and you must attend.");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("CATEGORIES", "BUSINESS,LEISURE,EVERYTHING");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("TRANSP", "TRANSPARENT");
    _tInsertBack(event->properties, prop);

    // Add the event to calendar
    _tInsertBack(cal->events, event);

    Alarm* alarm = _tCreateTestAlarm("AUDIO","VALUE=DATE-TIME:19970317T133000Z");
    
    prop = _tCreateTestProp("ATTACH", "FMTYPE=someaudio.aud");
    _tInsertBack(alarm->properties, prop);
    prop = _tCreateTestProp("DURATION", "50M");
    _tInsertBack(alarm->properties, prop);
    prop = _tCreateTestProp("REPEAT", "117");
    _tInsertBack(alarm->properties, prop);

    _tInsertBack(event->alarms, alarm);

    alarm =  _tCreateTestAlarm("AUDIO","VALUE=DATE-TIME:19970317T133000Z");

    prop = _tCreateTestProp("ATTACH", "FMTYPE=longest/audiofile/nameever/to/test/youcan/handlethelinefoldings.aud");
    _tInsertBack(alarm->properties, prop);
    prop = _tCreateTestProp("DURATION", "50M");
    _tInsertBack(alarm->properties, prop);
    prop = _tCreateTestProp("REPEAT", "117");
    _tInsertBack(alarm->properties, prop);

    _tInsertBack(event->alarms, alarm);



    // Second Event
    dtStamp = _tCreateTestDateTime("19970815","170000",true);
    dtStart = _tCreateTestDateTime("19970815","170000",true);
    event = _tCreateTestEvent("SOMEUID2@EXAMPLE.COM", dtStamp, dtStart);

    prop = _tCreateTestProp("CLASS", "SOMECLASS");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("DESCRIPTION", "Event description for a very big and exciting event.");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("GEO", "-0.12451,17.017471");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("LOCATION", "GUELPH");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("ORGANIZER", "JDAWG@GMAIL.COM");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("PRIORITY", "1000");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("SEQUENCE", "1");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("STATUS", "NEEDS-ACTION");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("SUMMARY", "The summary with tons of line folding you should  be able to handle this   though.");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("CATEGORIES", "BUSINESS,LEISURE,EVERYTHING");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("TRANSP", "TRANSPARENT");
    _tInsertBack(event->properties, prop);

    // Add the Calendar
    _tInsertBack(cal->events, event);

    alarm = _tCreateTestAlarm("AUDIO","VALUE=DATE-TIME:19970317T133000Z");
    
    prop = _tCreateTestProp("ATTACH", "FMTYPE=someaudio.aud");
    _tInsertBack(alarm->properties, prop);
    prop = _tCreateTestProp("DURATION", "50M");
    _tInsertBack(alarm->properties, prop);
    prop = _tCreateTestProp("REPEAT", "117");
    _tInsertBack(alarm->properties, prop);

    _tInsertBack(event->alarms, alarm);

    alarm = _tCreateTestAlarm("AUDIO","VALUE=DATE-TIME:19970317T133000Z");
    
    prop = _tCreateTestProp("ATTACH", "FMTYPE=longest/audiofile/nameever/to/test/youcan/handlethelinefoldings.aud");
    _tInsertBack(alarm->properties, prop);
    prop = _tCreateTestProp("DURATION", "50M");
    _tInsertBack(alarm->properties, prop);
    prop = _tCreateTestProp("REPEAT", "117");
    _tInsertBack(alarm->properties, prop);

    _tInsertBack(event->alarms, alarm);

    // Third Event
    dtStamp = _tCreateTestDateTime("19970815","170000",true);
    dtStart = _tCreateTestDateTime("19970815","170000",true);
    event = _tCreateTestEvent("SOMEUID3@EXAMPLE.COM", dtStamp, dtStart);

    prop = _tCreateTestProp("CLASS", "megacal3");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("DESCRIPTION", "Event description.");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("GEO", "-0.12451,17.017471");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("LOCATION", "GUELPH");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("ORGANIZER", "JDAWG@GMAIL.COM");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("PRIORITY", "1000");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("SEQUENCE", "1");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("STATUS", "NEEDS-ACTION");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("SUMMARY", "This event is not optional.");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("CATEGORIES", "BUSINESS,LEISURE,EVERYTHING");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("TRANSP", "TRANSPARENT");
    _tInsertBack(event->properties, prop);

    _tInsertBack(cal->events, event);

    return cal;

}

//************************************ A1 ************************************

/**
 * Include two DTSTART properties
 * @return
 */
Calendar* _tInvalidEventCalendar(void) {

    Property *prop = NULL;
    Calendar* cal = _tCreateTestCalendar("-/SOME/PROD/ID", 2);
    DateTime dtStamp;
    DateTime dtStart;
    
    dtStamp = _tCreateTestDateTime("19970815","170000",true);
    dtStart = _tCreateTestDateTime("19970815","170000",true);
    Event* event = _tCreateTestEvent("SOMEUID1@EXAMPLE.COM", dtStamp, dtStart);
    _tInsertBack(cal->events, event);

    prop = _tCreateTestProp("DTSTART", "19970815T170000Z");
    _tInsertBack(event->properties, prop);

    return cal;
}

/**
 * Includes two PRODIDs and two DTSTARTs but should call INV_CAL
 * @return
 */
Calendar* _tInvalidMultiComp(void) {

    Property *prop = NULL;
    Calendar* cal = _tCreateTestCalendar("-/SOME/PROD/ID", 2);
    DateTime dtStamp;
    DateTime dtStart;
    
    prop = _tCreateTestProp("PRODID", "ONLY/BE/ONE/OF/ME");
    _tInsertBack(cal->properties, prop);
    

    dtStamp = _tCreateTestDateTime("19970815","170000",true);
    dtStart = _tCreateTestDateTime("19970815","170000",true);

    Event* event = _tCreateTestEvent("SOMEUID1@EXAMPLE.COM", dtStamp, dtStart);
    _tInsertBack(cal->events, event);

    prop = _tCreateTestProp("ORGANIZER", "CN=Jimmy Johnson:MAILTO:john.doe@example.com");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("DTSTART", "19970714T170000Z");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("DTEND", "19970715T035959Z");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("DTSTART", "19970714T170000Z");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("CLASS", "PUBLIC");
    _tInsertBack(event->properties, prop);
    prop = _tCreateTestProp("SUMMARY", "Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
    _tInsertBack(event->properties, prop);

    return cal;

}

//Inalid eent - has duration property
Calendar* _tInvalidDuration(void)
{
    Calendar* calendar = _tCreateTestCalendar("-//hacksw/handcal//NONSGML v1.0//EN", 2);
    Property* prop;

    prop = _tCreateTestProp("CALSCALE", "GREGORIAN");
    _tInsertBack(calendar->properties, prop);
    prop = _tCreateTestProp("METHOD", "REQUEST");
    _tInsertBack(calendar->properties, prop);

    DateTime dtStamp = _tCreateTestDateTime("19970714","170000",false);
    DateTime dtStart = _tCreateTestDateTime("19970714","170000",false);
    Event *event = _tCreateTestEvent("uid1@example.com", dtStamp, dtStart);

    _tInsertBack(calendar->events, event);

    // should not have duration
    prop = _tCreateTestProp("DURATION", "60M");
    _tInsertBack(event->properties, prop);
    

    return calendar;
}

//Dup calscale
Calendar* _tInvalidCalScale(void) {
    Calendar* calendar = _tCreateTestCalendar("-//hacksw/handcal//NONSGML v1.0//EN", 2);
    Property* prop;

    prop = _tCreateTestProp("CALSCALE", "GREGORIAN");
    _tInsertBack(calendar->properties, prop);
    prop = _tCreateTestProp("CALSCALE", "GREGORIAN");
    _tInsertBack(calendar->properties, prop);
    prop = _tCreateTestProp("METHOD", "REQUEST");
    _tInsertBack(calendar->properties, prop);

    DateTime dtStamp = _tCreateTestDateTime("19970714","170000",false);
    DateTime dtStart = _tCreateTestDateTime("19970714","170000",false);
    Event *event = _tCreateTestEvent("uid1@example.com", dtStamp, dtStart);

    _tInsertBack(calendar->events, event);

    return calendar;
}

//Two triggers
Calendar* _tInvalidAttach(void) {
    
    Calendar* calendar = _tCreateTestCalendar("-//Mozilla.org/NONSGML Mozilla Calendar V1.1//EN", 2);

    DateTime dtStamp = _tCreateTestDateTime("20160106","145812",true);
    DateTime dtStart = _tCreateTestDateTime("20151002","100000",true);
    Event *event = _tCreateTestEvent("332414a0-54a1-408b-9cb1-2c9d1ad3696d", dtStamp, dtStart);

    _tInsertBack(calendar->events, event);

    //Add properties
    Property* prop = _tCreateTestProp("CREATED", "20160106T145812Z");
    _tInsertBack(event->properties, (void*)prop);
    prop = _tCreateTestProp("LAST-MODIFIED", "20160106T145812Z");
    _tInsertBack(event->properties, (void*)prop);
    prop = _tCreateTestProp("SUMMARY", "Han Solo @ Naboo");
    _tInsertBack(event->properties, (void*)prop);
    prop = _tCreateTestProp("STATUS", "CONFIRMED");
    _tInsertBack(event->properties, (void*)prop);
    prop = _tCreateTestProp("ORGANIZER", "CN=Obi-Wan Kenobi;mailto:laowaion@padawan.com");
    _tInsertBack(event->properties, (void*)prop);
    prop = _tCreateTestProp("DTEND", "20151002T110000");
    _tInsertBack(event->properties, (void*)prop);

    //Add alarms
    
    //Alarm 1
    Alarm* testAlm = _tCreateTestAlarm("AUDIO","VALUE=DATE-TIME:19970317T133000Z");

    prop = _tCreateTestProp("REPEAT", "4");
    _tInsertBack(testAlm->properties, (void*)prop);
    prop = _tCreateTestProp("DURATION", "PT15M");
    _tInsertBack(testAlm->properties, (void*)prop);
    prop = _tCreateTestProp("ATTACH", "FMTTYPE=audio/basic:ftp://example.com/pub/sounds/bell-01.aud");
    _tInsertBack(testAlm->properties, (void*)prop);

    //Dup trigger
    prop = _tCreateTestProp("TRIGGER", "VALUE=DATE-TIME:19970317T133000Z");
    _tInsertBack(testAlm->properties, (void*)prop);

    _tInsertBack(event->alarms, testAlm);


    return calendar;
}