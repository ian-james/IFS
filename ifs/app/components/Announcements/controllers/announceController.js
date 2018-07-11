const path = require ('path');
var viewPath = path.join(__components + "/Announcements/views/");
const Announcements = require('./../models/announcements');
const Errors = require(__components + "Errors/errors");
const Format = require('./../helpers/formatAnnounces');

const createAnnounce = (req, res) => {
  const title = req.body.title;
  const body = req.body.body;
  const expiry = req.body.expiry;
  console.log(req.body);
  Announcements.createAnnouncement([title, body, expiry], (err, results) => {
    res.send([]);
  });
  /* Validate input + permissions */
  
  /* Save to databsae */

  /* Alert user (redirect to announcement view?) */
};

const updateAnnounce = (req, res) => {
  /* Validate Input */

  /* update database based on Id (check ownership?)*/

  /* Alert user (redirect to announcement view?) */
};

const deleteAnnounce = (req, res) => {
  /* Check ownership of announcement */
  /* Delete */
};

const getAnnounce = (req, res) => {
  const id = req.params.id;
  Announcements.getAnnouncement(id, (err, announce) => {
    if (err) {
      Error.logErr(err);
      res.render(viewPath + 'announcement', []);
      return;
    }
    const announcement = Format.formatDateFields(announce, ['createdAt', 'updatedAt']);
    console.log(announcement);
    res.render(viewPath + 'announcement', 
      { 'announcement': announcement[0] });
  });
};

const getAnnounces = (req, res) => {
  Announcements.getAnnouncements((err, announces) => {
    if (err) {
      Error.logErr(err);
      res.render(viewPath + 'announcements', []);
      return;
    }
    const announcements = Format.formatDateFields(announces, ['createdAt', 'updatedAt']);
    Format.generateBlurbs(announces, 'body');
    res.render(viewPath + 'announcements', 
      { 'announcements': announcements });
  });
};

const adminCreate = (req, res) => {
  res.render(viewPath + 'announceForm', {});
};

module.exports.getAnnounces = getAnnounces;
module.exports.getAnnounce = getAnnounce;
module.exports.adminAnnounceCreate = adminCreate;
module.exports.createAnnounce = createAnnounce;