const { Model } = require('objection');
const { AnnouncementExposure } = require('./announcementExposure');

class Announcement extends Model {
  /* Name getter */
  static get tableName() {
    return 'announcements';
  }
  /* Relationships */
  static get relationMappings() {
    /* Require this here to avoid circular require loops */
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
    .count({ unseen: 'id' })
    .whereNotExists( () => {
      return AnnouncementExposure.query().select('*')
        .where('userId', userId)
        .andWhere('announcementId', 'announcements.id')
        .first();
    })
    .first();
  return count;
};

module.exports.Announcement = Announcement;
module.exports.getFreshAnnouncementCount = getFreshAnnouncementCount;