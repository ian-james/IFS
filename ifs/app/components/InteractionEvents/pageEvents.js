/* Page events Helper functions */

module.exports = {
    //************************************************/
    getPageViews: function( userId){
        return {
            'name': "pageViews",
            'data':[userId,"view","page"],
            'request': "select userId,eventType,name,data,COUNT(*) as value from user_interactions WHERE userId = ? and eventType = ? and name = ? GROUP by data"
        };
    },

    getFavPage: function( userId){
        return {
            'name': "favPage",
            'data':[userId,"view","page"],
            'request': "select a.page as value from (select data as page, COUNT(*) as count from user_interactions WHERE userID = ? and eventType= ? and name= ? GROUP by data) a ORDER BY a.count desc LIMIT 1"
        };
    },
     //************************************************/
};