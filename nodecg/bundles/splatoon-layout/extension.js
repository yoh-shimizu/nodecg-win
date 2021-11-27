const { google } = require('googleapis');
const {zipObject, cloneDeep, isEqual} = require('lodash');


module.exports = function(nodecg) {



	const spreadsheetRep = nodecg.Replicant('spreadsheet', {
		defaultValue: {},
	});

  if(!nodecg.bundleConfig.googleApi){
    spreadsheetRep.value = false;
    return;
  }

if(!nodecg.bundleConfig.googleApi.spreadsheetId || !nodecg.bundleConfig.googleApi.apikey){
  spreadsheetRep.value = false;
return;
}

const spreadsheetId = nodecg.bundleConfig.googleApi.spreadsheetId; 
const APIKey = nodecg.bundleConfig.googleApi.apikey;
const sheetsApi = google.sheets({version: "v4", auth: APIKey});


const fetchSpreadsheet = async () => {

  const res = await sheetsApi.spreadsheets.values.batchGet({
    spreadsheetId,
    ranges: ["team"],
  });
  const sheetValues = res.data.valueRanges;
  if (!sheetValues) {
    logger.error("Couldn't get values from spreadsheet");
    return;
  }
  const labelledValues = sheetValues.map((sheet) => {
    if (!sheet.values) {
      return;
    }
    const [labels, ...contents] = sheet.values;
    return contents.map((content) => zipObject(labels, content));
  });
  const newSpreadsheet = {
    team: labelledValues[0],
  };
  if (isEqual(spreadsheetRep.value, newSpreadsheet)) {

    return;
  }
  spreadsheetRep.value = newSpreadsheet;

};




fetchSpreadsheet();



  };