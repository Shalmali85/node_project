/* eslint-disable no-param-reassign */

const JefNode = require('json-easy-filter').JefNode;
const moment = require('moment');
let finalCsv = '';

function writeToCsv(key, level, value) {
  let str = '';
  let csvValue = '';
  if (!level && !value) {
    csvValue = key ? `\n${key}\n` : '\n';
  }
  if (level) {
    for (let i = 0; i < level; i += 1) {
      str += ',';
    }
    if (!value) {
      csvValue = `${str}${key}`;
    }
    if (value !== null && value !== undefined && typeof (value) === 'number') {
      csvValue = `${str}${key},,\t${parseInt(value, 10)}`;
    } if (value !== null && value !== undefined && typeof (value) === 'string') {
      value = moment(value, 'YYYY-MM-DDTHH:mm:ss', true).isValid() ? moment.utc(value).format('DD MMM YY') : value;
      csvValue = `${str}${key},,\t${value}`;
    }
    csvValue = `${csvValue}\n`;
  }
  finalCsv += csvValue;
}

function parseJsonArray(value, level) {
  /* eslint-disable-next-line */
  for (const key in value) {
    /* eslint-disable-next-line */
    if (value.hasOwnProperty(key)) {
      const val = value[key];
      if (typeof (val) === 'number' || typeof (val) === 'string') {
        writeToCsv(key, level, val);
      }
      if (typeof (val) === 'object' && !(val instanceof Array)) {
        /* eslint-disable-next-line */
        isNaN(key) ? writeToCsv(`,,${key}`) : writeToCsv('');
        parseJsonArray(val, level + 1);
      }
      if (val instanceof Array) {
        writeToCsv(`,,,${key}`);
        parseJsonArray(val, level);
      }
    }
  }
}
function parseJson(value, level) {
  /* eslint-disable-next-line */
  for (const key in value) {
    /* eslint-disable-next-line */
    if (value.hasOwnProperty(key)) {
      const val = value[key];
      if (typeof (val) === 'number' || typeof (val) === 'string') {
        writeToCsv(key, level, val);
      }
      if (typeof (val) === 'object' && !(val instanceof Array)) {
        writeToCsv(`,${key}`);
        parseJson(val, level += 1);
      }
      if (val instanceof Array) {
        writeToCsv(`,${key}`);
        parseJsonArray(val, level);
      }
    }
  }
}

module.exports = function exportToCsvTree(data, fields) {
  console.log(fields);
  new JefNode(data).filter((node) => {
    if (node.type() === 'object' && node.level === 1) {
      const value = (node.value);
      writeToCsv(node.key);
      parseJson(value, 1);
    }
  });
  return finalCsv;
};

