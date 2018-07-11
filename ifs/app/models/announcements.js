const { Model } = require('objection');

class Announcement extends Model {
  /* Name getter */
  static get tableName() {
    return 'announcements';
  }
  /* Relationships */
  static get relationMappings() {
    /* Require this here to avoid circular require loops */
    const { AnnouncementExposure } = require('./announcementExposure');
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
  const count = await Announcement.query()
    .leftOuterJoin('announcement_exposure','announcements.id', 'announcement_exposure.announcementId')
    .where('announcement_exposure.userId', userId)
    .count({ unseen: 'announcements.id' })
    .first();
  return count;
};

module.exports.Announcement = Announcement;
module.exports.getFreshAnnouncementCount = getFreshAnnouncementCount;