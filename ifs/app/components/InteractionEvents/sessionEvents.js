/* Helper functions to retrieve  session information from interaction database. */

module.exports = {
      /************************ Session Event *******************************************/

    getSessionStart: function( userId ) {
        return    {
            'name': "startSession",
            'data':[userId, "Authorized", "connection"],
            'request': "select date as value from user_interactions where userId = ? and name =  ? and eventType  = ? ORDER BY date desc Limit 1"
        };
    },

    getLastSession: function( userId, sessionId ){
        return {
            // Last Session
            'name': "lastSession",
            'data':[userId, "Authorized", "disconnection",sessionId],
            'request': "select date as value from user_interactions where userId = ? and name =  ? and eventType  = ? and sessionId < ? ORDER BY date desc Limit 1"
        };
    },
    
    
    getSessionLength:  function( userId, sessionId ) {
        return    {
            'name': "sessionLength",
            'data':[userId,sessionId],
            'request': "select TIMEDIFF(MAX(a.date),MIN(a.date)) as value FROM user_interactions a WHERE userId=? and sessionId=?"
        };
    },

    getSessionsThisWeek: function(userId ){
        return {
                // Count Sessions this week.
            'name': "sessionsThisWeek",
            'data':[userId],
            'request': "select COUNT(DISTINCT sessionId) as value from user_interactions where userId = ? and date >= Date(NOW()) - INTERVAL 7 DAY"
        };
    },

    //************************************************/

    getDaysLoggedIn: function( userId ) {
        return  {
            'name': "daysLoggedIn",
            'data': [userId],
            'request': "select DISTINCT DATE(date) as days  from user_interactions where userId = ?  GROUP BY Date( date ) )"
        };
    },

    getTotalDaysLoggedIn: function( userId ) {
        return  {
            'name': "totalDaysLoggedIn",
            'data': [userId],
            'request': "select SUM(a.days) as value from ( select COUNT(DISTINCT DATE(date)) as days  from user_interactions where userId = ?  and date >= DATE(NOW()) - INTERVAL ? Day GROUP BY Date( date ) ) a"
        };
    },
    
    getCountDaysLoggedInThisWeek: function(userId ){
        return this.getCountDaysLoggedBeforeToday(userId,7);
    },

    getCountDaysLoggedBeforeToday: function(userId, ndays = 3 ){
        return {
            // Session this week
            'name': "daysLoggedInWeek",
            'data':[userId,ndays],
            'request': "select SUM(a.days) as value from ( select COUNT(DISTINCT DATE(date)) as days  from user_interactions where userId = ?  and date >= DATE(NOW()) - INTERVAL ? Day GROUP BY Date( date ) ) a"
        };
    },

    getTotalSessions: function( userId ) {
        return {
            'name': "totalSessions",
            'data':[userId],
            'request': "select COUNT(DISTINCT sessionId) as value from user_interactions where userId = ?"
        };
    },

    // Test this function more with how to provide targetDate param.
    getCountDaysLoggedAroundDate: function(userId, targetDate, ndays = 3 ){
        return {
            // Session this week
            'name': "sessionAroundDate",
            'data':[userId,targetDate,ndays, targetDate, ndays],
            'request': "select SUM(a.days) as value from ( select COUNT(DISTINCT DATE(date)) as days  from user_interactions where userId = ? and date BETWEEN (?) - INTERVAL ? Day and  Date(?) + INTERVAL ? Day GROUP BY Date( date ) ) a"
        };
    },

    getMaxSessionsPerDay: function( userId ){
        return {
            'name': "maxDailySession",
            'data':[userId],
            'request': "select MAX(a.totalCount) as value from (select COUNT(DISTINCT sessionId) totalCount FROM user_interactions where userId = ? GROUP BY Date(date)) a"
        }; 
    },

    getMaxSessionsToday: function( userId ){
        return {
            'name': "dailySessions",
            'data':[userId],
            'request': "select MAX(a.totalCount) as value from (select COUNT(DISTINCT sessionId) totalCount FROM user_interactions where userId = ? and Date(date) = Date(NOW()) GROUP BY Date(date)) a"
        }; 
    },

    //************************************************/


    /*
    getConsecutiveDays: function( userId ) {
        return {
                // Session this week
                'data':[userId],
                'request':""
        };
    },


    getLongestSession: function( userId ){
        return {
            'data':[userId],
            'request': "select Date(a.date) as datetime, MAX(a.date) as max_datetime, MIN(a.date) as min_datetime FROM user_interactions a WHERE userId=? and sessionId=? GROUP BY DATE( a.date)"
        };
    },

    getAverageSession: function( userId ){
        return {
            'data':[userId],
            'request': ""
        };
    },
    */

       /*************>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

};