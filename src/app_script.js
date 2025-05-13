const DATA_ENTRY_SHEET_NAME = "Journal";
const SETTINGS_ENTRY_SHEET_NAME = "Settings";

function doPost(request = {}) {
    const { postData: { contents, type } = {} } = request;
    var data = parseFormData(contents);
    appendToJournal(data);
    return ContentService.createTextOutput(contents).setMimeType(ContentService.MimeType.JSON);
};

function doGet(request = {}) {
    const { postData: { contents, type } = {} } = request;
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SETTINGS_ENTRY_SHEET_NAME);
    var data = getTable(sheet);
    var json = JSON.stringify(data);
    return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function getTable(sheet) {
    var data = [];
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var settings = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
    for (var i = 0; i < settings.length; i++) {
        var row = {};
        for (var j = 0; j < headers.length; j++) {
            row[headers[j]] = settings[i][j];
        }
        data.push(row);
    }
    return data;
}

function parseFormData(postData) {
    var data = [];
    var parameters = postData.split('&');
    for (var i = 0; i < parameters.length; i++) {
        var keyValue = parameters[i].split('=');
        data[keyValue[0]] = decodeURIComponent(keyValue[1]);
    }
    return data;
}

function appendToJournal(data) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(DATA_ENTRY_SHEET_NAME);
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var rowData = headers.map(headerFld => data[headerFld]);
    sheet.appendRow(rowData);
}