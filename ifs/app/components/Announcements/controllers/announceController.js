const path = require ('path');
const moment = require('moment');
const viewPath = path.join(__components + "/Announcements/views/");
const AnnouncementsO = require('./../models/announcements');
const Errors = require(__components + "Errors/errors");
const Format = require('./../helpers/formatAnnounces');
const { Announcement, getFreshAnnouncementCount } = require('../../../models/announcements');
const { addExposure } = require('../../../models/announcementExposure');


const getNewAnnouncementCount = async (req, res) => {
  const count = await getFreshAnnouncementCount(req.user.id);
  res.send(count);
};

const createAnnounce = async (req, res) => {
  const title = req.body.title;
  const body = req.body.body;
  let expiryDate = req.body.expiryDate;
  console.log('EXPIRY: ' + expiryDate);
  //expiryDate = moment(expiryDate).toString();
  //console.log('MOMENT: ' + expiryDate);

  /* TODO: Validation */
  const announce = await Announcement.query()
    .insert ({
        title: title,
        body: body,
        expiryDate: expiryDate
    });
  res.redirect('/announcements/' + announce.id);
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

const getAnnounce = async (req, res) => {
  const id = req.params.id;

  const announce = await Announcement.query()
    .where('id', id)
    .first();
  
  if (announce) {
    await addExposure(req.user.id, id);
    Format.formatDateFields([announce], ['createdAt', 'updatedAt']);
  }
  
  res.render(viewPath + 'announcement', { 
    announcement: announce
  });
};

const getAnnounces = async (req, res) => {
  
  const announces = await Announcement.query()
    .orderBy('updatedAt', 'DESC');
  
  Format.formatDateFields(announces, ['createdAt', 'updatedAt']);
  Format.generateBlurbs(announces, 'body');

  res.render(viewPath + 'announcements', {
    announcements: announces
  });
};

const adminCreate = (req, res) => {
  res.render(viewPath + 'announceForm', {});
};

module.exports.getAnnounces = getAnnounces;
module.exports.getAnnounce = getAnnounce;
module.exports.adminAnnounceCreate = adminCreate;
module.exports.createAnnounce = createAnnounce;
module.exports.getNewAnnouncementCount = getNewAnnouncementCount