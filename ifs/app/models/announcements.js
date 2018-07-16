const { Model } = require('objection');
const { AnnouncementExposure } = require('./announcementExposure');
const moment = require('moment');

class Announcement extends Model {
  /* Name getter */
  static get tableName() {
    return 'announcements';
  }
  /* Relationships */
  static get relationMappings() {
    return {
      exposures: {
        relation: Model.HasManyRelation,
        modelClass: AnnouncementExposure,
        join: {
          from: 'announcements.id',
          to: 'announcement_exposure.announcementId'
        },
      },
    };
  };
};

/* Returns count of all announcements which haven't been viewed by a particular user
 *
 *
 */
getFreshAnnouncementCount = async (userId) => {
  const curDate = moment().format('YYYY-MM-DD');
  const count = await Announcement.query()
    .count({ unseen: 'id' })
    .whereNotIn('id', (builder) => {
      builder.select('announcementId')
        .from('announcement_exposure')
        .where('userId', userId);
    })
    .andWhere('expiryDate', '>', curDate);
  return count;
};

getUnexpiredAnnouncements = async (id = null) => {
  let announces = [];
  const curDate = moment().format('YYYY-MM-DD');

  if (id != null) {
    announces = await Announcement.query()
      .where('expiryDate', '>', curDate)
      .andWhere('id', id)
      .first()
  } else {
    announces = await Announcement.query()
      .where('expiryDate', '>', curDate)
      .orderBy('updated_at', 'DESC');
  }
  return announces;
};

module.exports.Announcement = Announcement;
module.exports.getFreshAnnouncementCount = getFreshAnnouncementCount;
module.exports.getUnexpiredAnnouncements = getUnexpiredAnnouncements;