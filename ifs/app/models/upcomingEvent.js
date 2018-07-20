const { Model } = require('objection');

class UpcomingEvent extends Model {
  /* Name getter */
  static get tableName() {
    return 'upcoming_event';
  }
  /* Relationships */
  static get relationMappings() {
    const { Course } = require('./course');

    return {
      class: {
        relation: Model.BelongsToOneRelation,
        modelClass: Course,
        join: {
          from: 'upcoming_event.classId',
          to: 'class.id'
        },
      },
    };
  };
};

module.exports = UpcomingEvent;