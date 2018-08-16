const { Model } = require('objection');

class IFSTips extends Model {
  /* Name getter */
  static get tableName() {
    return 'ifs_tips';
  }
};

module.exports = IFSTips;