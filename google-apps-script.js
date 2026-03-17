// ================================================
// Google Apps Script — RSVP Logger
// ================================================
// SETUP INSTRUCTIONS:
//
// 1. Go to https://script.google.com and create a new project
// 2. Paste this entire file into the editor (replace any existing code)
// 3. Click "Deploy" → "New deployment"
// 4. Choose type: "Web app"
// 5. Set "Execute as": Me
// 6. Set "Who has access": Anyone
// 7. Click "Deploy" and copy the Web App URL
// 8. Paste the URL into EVENT_CONFIG.googleSheetURL in js/main.js
//
// A Google Sheet named "Birthday RSVPs" will be auto-created
// in your Google Drive when the first RSVP comes in.
// ================================================

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var name = data.name || 'Unknown';
    var timestamp = data.timestamp || new Date().toISOString();

    var sheetName = 'Birthday RSVPs';
    var ss = getOrCreateSheet(sheetName);
    var sheet = ss.getSheets()[0];

    sheet.appendRow([name, timestamp, new Date()]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet(name) {
  var files = DriveApp.getFilesByName(name);
  if (files.hasNext()) {
    return SpreadsheetApp.open(files.next());
  }
  var ss = SpreadsheetApp.create(name);
  var sheet = ss.getSheets()[0];
  sheet.appendRow(['Name', 'RSVP Time', 'Logged At']);
  sheet.getRange('1:1').setFontWeight('bold');
  sheet.setColumnWidth(1, 200);
  sheet.setColumnWidth(2, 200);
  sheet.setColumnWidth(3, 200);
  return ss;
}

// Test function — run this to verify the script works
function testDoPost() {
  var e = {
    postData: {
      contents: JSON.stringify({ name: 'Test User', timestamp: new Date().toISOString() })
    }
  };
  var result = doPost(e);
  Logger.log(result.getContent());
}
