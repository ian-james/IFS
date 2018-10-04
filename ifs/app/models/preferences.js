const { Model } = require('objection');

class Preference extends Model {
  /* Name getter */
  static get tableName() {
    return 'preferences';
  }
  /* Relationships */
  static get relationMappings() {
    const { User } = require('./user');

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'preferences.userId',
          to: 'users.id'
        },
      },
    };
  };
};

/* Upsert function to set or create a new preference for a user */
const setSurveyPref = async (userId, status = 'on') => {
  const pref = await Preference.query()
    .where('toolName', 'pref-surveysAllowed')
    .andWhere('toolType', 'option');
  if (!pref) {
    await Preference.query()
      .insert({
        userId: userId,
        toolType: 'option',
        toolName: 'pref-surveysAllowed',
        toolValue: status
      });
  } else {
    await Preference.query()
      .patch({
        toolValue: status
      })
      .where('userId', userId)
      .andWhere('toolName', 'pref-surveysAllowed');
  }
};

/* Predicate function that determines if a user can view surveys */
const optedIn = async (userId) => {
  const status = await Preference.query()
    .select(['toolValue'])
    .where('userId', userId)
    .andWhere('toolType', 'option')
    .andWhere('toolName', 'pref-surveysAllowed')
  if (!status || status.toolValue == 'off') {
    return false;
  }
  return true;
};

module.exports.Preference = Preference;
module.exports.setSurveyPref = setSurveyPref;
module.exports.optedIn = optedIn;
