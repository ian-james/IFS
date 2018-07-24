const moment = require('moment');

const formatDate = (date) => {
  const fDate = moment(date).format('MMMM Do YYYY, h:mm:ss a');
  return fDate;
};

const formatDateFields = (objectsArr = [], fields = []) => {
  for (let object of objectsArr) {
    for (let field of fields) {
      const newDate = formatDate(object[field]).toString();
      object[field] = newDate;
    }
  } 
  return objectsArr;
};

const generateBlurbs = (objectsArr = [], field, limit = 250) => {
  for (let object of objectsArr) {
    if (object[field].length > limit) {
      object.blurb = object[field].substring(0, limit) + '...';
    };
  }
}

module.exports.formatDate = formatDate;
module.exports.formatDateFields = formatDateFields;
module.exports.generateBlurbs = generateBlurbs;