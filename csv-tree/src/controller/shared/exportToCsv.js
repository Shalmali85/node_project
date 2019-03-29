/* eslint-disable consistent-return */
const csvParser = require('json2csv');

module.exports = function exportToCsv(data, fields) {
  const Json2csvParser = csvParser.Parser;
  const opts = { fields };
  try {
    const parser = new Json2csvParser(opts);
    const csv = parser.parse(data);
    return csv;
  } catch (err) {
    return err;
  }
};
