const J2CParser = require('json2csv').Parser;

/* Passed an array of objects and an optional array of fields, return a CSV representation
 * @param data Array of objects
 * @param fields Array of string fields to pluck from the data
 **/
const getCSVObject = (data = [], fields = []) => {
  try {
    const options = (fields.length > 0) ? {fields} : {};
    const parser = new J2CParser(options);
    const csv = parser.parse(data);
    return csv;
  } catch (err) {
    console.log('Unable to parse CSV from results: ' + err);
  }
  return null;
};

/* Passed an array of data, optional array of fields, and res, return a downloadable CSV file
 * @param res - Express response
 * @param data Array of objects
 * @param fields Array of string fieldnames to pluck from the data
 * @param filename Optional filename - default: data.csv
 */
const getCSVDownload =  (res, data = [], fields = [], filename = 'data.csv') => {
  const csv = getCSVObject(data, fields);
  if (csv) {
    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.set('Content-Type', 'text/csv');
    res.status(200).send(csv);
  } else {
    res.status(500).send();
  }
};

/* Passed an array of objects and optional array of fields, return a XLS representation
 * @param res - Express response
 * @param data Array of objects
 * @param fields Array of string fieldnames to pluck from the data
 * @param filename Optional filename - default: data.xlsx
 */
const getXLSDownload = (res, data = [], fields = [], filename = 'data.xlsx') => {
  const options = (fields.length > 0) ? {fields: fields} : {};
  res.xls(filename, data, options);
};

module.exports.getCSVObject = getCSVObject;
module.exports.getCSVDownload = getCSVDownload;
module.exports.getXLSDownload = getXLSDownload;