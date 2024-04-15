const jsforce = require('jsforce')
const express = require('express')
require('dotenv').config()
const fs = require('fs');
const app = express()
const PORT = 3001

const { SF_LOGINURL, SF_USERNAME, SF_PASSWORD, SF_TOKEN } = process.env

const fileName = './output.txt';
const PASSWORD_TOKEN = SF_PASSWORD+SF_TOKEN


const conn = new jsforce.Connection({
  loginUrl: SF_LOGINURL,
  version: '60.0'
})

conn.login(SF_USERNAME, PASSWORD_TOKEN, (err, userInfo) => {
  if (err) {
    console.log(err);
  } else {
    console.log("User Id:" + userInfo.id);
    console.log("Org Id:" + userInfo.organizationId)
    console.log(`open localhost:${PORT} to fetch report`)
  }
})

// const recordsList = [
//   '00O5Y00000DvWzzUAF',
//   '00O5Y00000E4ctbUAB'
// ];

function getReportIdList() {
 const data = fs.readFileSync('./input.txt', { encoding: 'utf8', flag: 'r' });
 return data.trim().split(',');
}

async function getReportTypes(recordsList) {
  const metaData = [];
  let count = 1;
  for (const reportId of recordsList) {
    try {
      const report = await conn.analytics.report(reportId).describe();
      metaData.push(report.reportMetadata.reportType.type);
      console.log(report.reportMetadata.reportType.type);
      console.log(count++, ' completed');
    } catch (error) {
      console.error(`Error for report ${reportId}:`, error);
      metaData.push(count++,' error Id ', reportId,);
    }
  }
  return metaData;
}


async function writeToFile(data, fileName) {
  try {
    const content = data.join('\n') + '\n'; // Join data with newlines and add a final newline
    fs.writeFileSync(fileName, content, (err) => err && console.error('file write err'));
    console.log('Data appended to file successfully!');
  } catch (error) {
    console.error('Error appending to file:', error);
  }
}

app.get('/', async (req, res) => {
  try {
    const reportIdList = await getReportIdList();
    const metaData = await getReportTypes(reportIdList);
    console.log('completed');
    await writeToFile(metaData, fileName);
    console.log("File written successfully!");
    res.send(metaData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})



