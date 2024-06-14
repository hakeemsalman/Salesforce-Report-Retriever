# Salesforce-Report-Retriever

It Helps to retrieve the reports easliy from Salesforce Org

## Installation

1. Copy the URL or Download latest version of code.
2. Paste into `git` cli

```git
$ git clone COPIED_URL
$ cd SALESFORCE-REPORT-RETRIEVER
$ npm i
```
## Add the Credentials

1. Create a `.env` file in current folder.
2. Add the credentials information in the file

```bash
SF_LOGINURL = https://*.sandbox.my.salesforce.com/
SF_USERNAME = YOUR_USERNAME
SF_PASSWORD = YOUR_PASSWORD
SF_TOKEN = YOUR_TOKEN
```

## Run the file

1. Add Report Id in `input.txt` file with seperated commas.
2. Run `node index.js`
3. Report file type will be attached to `output.txt` file.



