const _ = require('lodash');

module.exports = {
  /* Given an array of survey response objects,reduce them to a count of answer values (1-5) */
  getResponseCountArray: (responses) => {
    /* Reduce the reponses to a count */
    const countObj = _.countBy(responses, 'questionAnswer');
    /* Add 0 count for missing keys */
    for (i = 1; i <= 5; i++) {
      if (countObj[i] == null) {
        countObj[i] = 0;
      }
    }
    Object.keys(countObj).sort();
    const dataArray = _.values(countObj);
  },
};