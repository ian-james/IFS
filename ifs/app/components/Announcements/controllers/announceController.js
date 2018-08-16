const path = require ('path');
const moment = require('moment');
const viewPath = path.join(__components + "/Announcements/views/");
const Errors = require(__components + "Errors/errors");
const Format = require('./../helpers/formatAnnounces');
const { Announcement, getFreshAnnouncementCount, getUnexpiredAnnouncements } = require('../../../models/announcements');
const { addExposure } = require('../../../models/announcementExposure');


const getNewAnnouncementCount = async (req, res) => {
  const count = await getFreshAnnouncementCount(req.user.id);
  res.send(count[0]);
};

const createAnnounce = async (req, res) => {
  const title = req.body.title;
  const body = req.body.body;
  let expiryDate = req.body.expiryDate;
  expiryDate = moment(expiryDate).format('YYYY-MM-DD'); // for mysql

  const announce = await Announcement.query()
    .insert ({
        title: title,
        body: body,
        expiryDate: expiryDate
    });
  res.send(announce);
};

const manageAnnounce = async (req, res) => {
  res.render(viewPath + 'announceManage');
};

const listAnnounces = async (req, res) => {
  const announces = await Announcement.query()
    .orderBy('updated_at', 'DESC');
  Format.formatDateFields(announces, ['created_at', 'updated_at', 'expiryDate']);
  res.send(announces);
};

const deleteAnnounce = async (req, res) => {
  const id = req.params.id;
  const announce = await Announcement.query()
    .delete()
    .where('id', id);
  if (announce) {
    const announces = await Announcement.query()
    Format.formatDateFields(announces, ['created_at', 'updated_at', 'expiryDate']);
    res.send(announces);
  } else {
    res.status(500).send({message: 'Unable to delete announcement with id ' + id});
  }
};

const getAnnounce = async (req, res) => {
  const id = req.params.id;

  const announce = await getUnexpiredAnnouncements(id);

  if (announce) {
    await addExposure(req.user.id, id);
    Format.formatDateFields([announce], ['created_at', 'updated_at']);
  }
  
  res.render(viewPath + 'announcement', { 
    announcement: announce
  });
};

const getAnnounces = async (req, res) => {
  
  const announces = await getUnexpiredAnnouncements();
  
  Format.formatDateFields(announces, ['created_at', 'updated_at']);
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
module.exports.getNewAnnouncementCount = getNewAnnouncementCount;
module.exports.manageAnnounce = manageAnnounce;
module.exports.listAnnounces = listAnnounces;
module.exports.deleteAnnounce = deleteAnnounce;