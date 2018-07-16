const path = require('path');
const componentPath = path.join(__components,"Announcements");
const Announce = require(path.join(componentPath, '/controllers/announceController.js'));

module.exports = (app, iosocket) => {

 app.get('/announcements', Announce.getAnnounces);
 
 app.get('/announcements/newCount', Announce.getNewAnnouncementCount);
 
 app.get('/announcements/list', Announce.listAnnounces);

 app.get('/announcements/:id', Announce.getAnnounce);

 app.post('/announcements/create', Announce.createAnnounce);

};
