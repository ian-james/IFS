const { Model } = require('objection');

class AnnouncementExposure extends Model {
  /* Name getter */
  static get tableName() {
    return 'announcement_exposure';
  }
};

/* Upsert function for announcement views - patches viewDate on recurring views
 * 
 * 
 * 
 */ 
const addExposure = async (userId, announcementId) => {
  let exposure = await AnnouncementExposure.query()
    .where('userId', userId)
    .andWhere('announcementId', announcementId)
    .first();
  if (!exposure) {
    exposure = await AnnouncementExposure.query()
      .insert({
        userId,
        announcementId
      });
  } else {
    await AnnouncementExposure.query()
    .patch({
      viewDate: new Date()
    })
    .where('id', exposure.id);
  }
}


module.exports.AnnouncementExposure = AnnouncementExposure;
module.exports.addExposure = addExposure;