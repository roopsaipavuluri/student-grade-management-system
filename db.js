const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, 'data.json');

function defaultData() {
  return { nextStudentId: 1, nextSubjectId: 1, nextResultId: 1, students: [], subjects: [], results: [] };
}

function readData() {
  try {
    return { ...defaultData(), ...JSON.parse(fs.readFileSync(dataFile, 'utf8')) };
  } catch {
    return defaultData();
  }
}

function saveData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

module.exports = { readData, saveData };
