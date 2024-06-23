const jsforce = require('jsforce');
const express = require('express');
require('dotenv').config();
const fs = require('fs');
const app = express();
const PORT = 3001;

const { SF_LOGINURL, SF_USERNAME, SF_PASSWORD, SF_TOKEN } = process.env;

const fileName = './output.txt';
const PASSWORD_TOKEN = SF_PASSWORD + SF_TOKEN;

const conn = new jsforce.Connection({
  loginUrl: SF_LOGINURL,
  version: '60.0'
});

conn.login(SF_USERNAME, PASSWORD_TOKEN, (err, userInfo) => {
  if (err) {
    return console.error('Login Error:', err);
  }
  console.log(`User Id: ${userInfo.id}`);
  console.log(`Org Id: ${userInfo.organizationId}`);
  console.log(`Open http://localhost:${PORT} to fetch report`);
});

function getReportIdList() {
  try {
    const data = fs.readFileSync('./input.txt', 'utf8');
    return data.trim().split(',');
  } catch (err) {
    console.error('Error reading input file:', err);
    return [];
  }
}

async function getReportTypes(recordsList) {
  const metaData = [];
  let count = 1;
  for (const reportId of recordsList) {
    try {
      const report = await conn.analytics.report(reportId).describe();
      metaData.push(report.reportMetadata.reportType.type);
      console.log(`${count++} completed: ${report.reportMetadata.reportType.type}`);
    } catch (error) {
      console.error(`Error for report ${reportId}:`, error);
      metaData.push(`${count++} error Id ${reportId}`);
    }
  }
  return metaData;
}

async function writeToFile(data, fileName) {
  try {
    const content = data.join('\n') + '\n';
    fs.writeFileSync(fileName, content);
    console.log('Data written to file successfully!');
  } catch (error) {
    console.error('Error writing to file:', error);
  }
}

app.get('/', async (req, res) => {
  try {
    const reportIdList = getReportIdList();
    if (reportIdList.length === 0) {
      throw new Error('No report IDs found');
    }
    const metaData = await getReportTypes(reportIdList);
    await writeToFile(metaData, fileName);
    res.send(metaData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
