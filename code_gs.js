function doGet(e) {
  try {
    var params = e.parameter;
    var sheet = params.sheet || params.sheetName;
    if (sheet && (params.action === 'fetch' || params.action === 'getData')) {
      return fetchSheetData(sheet, params.sheetId);
    } else if (sheet) {
      return fetchSheetData(sheet, params.sheetId);
    }
    return ContentService.createTextOutput(JSON.stringify({
      status: "ready",
      message: "Google Apps Script is running"
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error("Error in doGet:", error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function fetchSheetData(sheetName, sheetId) {
  try {
    var ss = sheetId ? SpreadsheetApp.openById(sheetId) : SpreadsheetApp.openById("1hA6J-3UNuvz82EJLDJFmtTRwRT9oGa4SsLpw2o3TvAo");
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) throw new Error("Sheet \"" + sheetName + "\" not found.");
    
    var dataRange = sheet.getDataRange();
    var data = dataRange.getDisplayValues(); // Preserves headers & formatting!
    var headers = data[0]; 
    var timeColumns = [];
    for (var i = 0; i < headers.length; i++) {
      var header = headers[i].toString().toLowerCase();
      if (header.includes('time') || header.includes('in') || header.includes('out')) {
        timeColumns.push(i);
      }
    }
    for (var row = 1; row < data.length; row++) {
      for (var col of timeColumns) {
        if (data[row][col] && data[row][col] !== '') {
          var cell = sheet.getRange(row + 1, col + 1);
          var displayValue = cell.getDisplayValue(); 
          data[row][col] = displayValue;
        }
      }
    }
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      data: data
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error("Error fetching sheet data:", error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    // Robustly parse parameters from both Query Params and Request Body
    var params = e.parameter || {};
    if (e.postData && e.postData.contents) {
      try {
        if (e.postData.type === "application/json" || e.postData.mimeType === "application/json") {
          var body = JSON.parse(e.postData.contents);
          params = { ...params, ...body };
        } else {
          const parts = e.postData.contents.split('&');
          for (var i = 0; i < parts.length; i++) {
            var pair = parts[i].split('=');
            if (pair.length === 2) {
              params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
            }
          }
        }
      } catch (err) {
        console.error("Error parsing postData contents in doPost:", err);
      }
    }

    var action = params.action || 'insert';
    console.log('Action received:', action);

    if (action === 'shareViaEmail') {
      return handleEmailShare(params);
    }

    if (action === 'uploadFile') {
      return handleFileUpload(e);
    }
    
    var sheetName = params.sheetName;
    var sheetId = params.sheetId || params.sheet;
    var ss = sheetId ? SpreadsheetApp.openById(sheetId) : SpreadsheetApp.openById("1hA6J-3UNuvz82EJLDJFmtTRwRT9oGa4SsLpw2o3TvAo");
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      throw new Error("Sheet \"" + sheetName + "\" not found.");
    }
    
    if (action === 'insert') {
      var rowDataStr = params.rowData || params.payload;
      var rowData = JSON.parse(rowDataStr);
      
      // Convert timestamp safely
      if (rowData[0] && typeof rowData[0] === 'string') {
        var timestampStr = rowData[0];
        if (timestampStr.includes(' ')) {
          var parts = timestampStr.split(' ');
          var dateParts = parts[0].split('/');
          var timeParts = parts[1].split(':');
          if (dateParts.length === 3 && timeParts.length === 3) {
            var dateObj = new Date(
              parseInt(dateParts[2]),
              parseInt(dateParts[1]) - 1,
              parseInt(dateParts[0]),
              parseInt(timeParts[0]),
              parseInt(timeParts[1]),
              parseInt(timeParts[2])
            );
            rowData[0] = dateObj;
          }
        }
      }
      
      // Convert completion date (index 6) to proper date object
      if (rowData[6] && typeof rowData[6] === 'string') {
        var completionParts = rowData[6].split('/');
        if (completionParts.length === 3) {
          var completionDate = new Date(
            parseInt(completionParts[2]),
            parseInt(completionParts[0]) - 1,
            parseInt(completionParts[1])
          );
          rowData[6] = completionDate;
        }
      }
      
      // Append the row
      sheet.appendRow(rowData);
      
      var lastRow = sheet.getLastRow();
      sheet.getRange(lastRow, 6).setNumberFormat('0');
      
      return ContentService.createTextOutput(JSON.stringify({ 
        success: true,
        message: "Data inserted successfully"
      })).setMimeType(ContentService.MimeType.JSON);
    } 
    else if (action === 'update') {
      var rowIndex = parseInt(params.rowIndex);
      var rowData = JSON.parse(params.rowData);
      if (isNaN(rowIndex) || rowIndex < 2) {
        throw new Error("Invalid row index for update");
      }
      for (var i = 0; i < rowData.length; i++) {
        if (i === 1) continue;
        if (rowData[i] !== '') {
          sheet.getRange(rowIndex, i + 1).setValue(rowData[i]);
          if (i === 5) {
            sheet.getRange(rowIndex, i + 1).setNumberFormat('0');
          }
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ 
        success: true,
        message: "Data updated successfully (Column B skipped)"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    else if (action === 'updateCell') {
      var rowIndex = parseInt(params.rowIndex);
      var columnIndex = parseInt(params.columnIndex);
      var value = params.value;

      if (isNaN(rowIndex) || rowIndex < 1 || isNaN(columnIndex) || columnIndex < 1) {
        throw new Error("Invalid row or column index for update");
      }

      var headerRow = 6;
      var headers = sheet.getRange(headerRow, 1, 1, sheet.getLastColumn()).getValues()[0];
      var columnName = headers[columnIndex - 1];

      if (columnName && columnName.toString().trim() === "Actual 2") {
        sheet.getRange(rowIndex, columnIndex).setValue(new Date(value));
      } else {
        sheet.getRange(rowIndex, columnIndex).setValue(value);
        if (columnIndex === 6) {
          sheet.getRange(rowIndex, columnIndex).setNumberFormat('0');
        }
      }

      return ContentService.createTextOutput(JSON.stringify({ 
        success: true,
        message: "Cell updated successfully" 
      })).setMimeType(ContentService.MimeType.JSON);
    }
    else if (action === 'delete') {
      var rowIndex = parseInt(params.rowIndex);
      if (isNaN(rowIndex) || rowIndex < 2) {
        throw new Error("Invalid row index for delete");
      }
      sheet.deleteRow(rowIndex);
      return ContentService.createTextOutput(JSON.stringify({ 
        success: true,
        message: "Row deleted successfully"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    else if (action === 'markDeleted') {
      var rowIndex = parseInt(params.rowIndex);
      var columnIndex = parseInt(params.columnIndex);
      var value = params.value || 'Yes';
      
      if (isNaN(rowIndex) || rowIndex < 2) {
        throw new Error("Invalid row index for marking as deleted");
      }
      if (isNaN(columnIndex) || columnIndex < 1) {
        throw new Error("Invalid column index for marking as deleted");
      }
      sheet.getRange(rowIndex, columnIndex).setValue(value);
      
      return ContentService.createTextOutput(JSON.stringify({ 
        success: true,
        message: "Row marked as deleted successfully" 
      })).setMimeType(ContentService.MimeType.JSON);
    }
    else if (action === 'updateEnquiryColumn') {
      var enquiryNo = params.enquiryNo;
      var timestamp = params.timestamp;
      
      if (!enquiryNo || !timestamp) {
        throw new Error("Missing enquiry number or timestamp for update");
      }
      
      var dataRange = sheet.getDataRange();
      var data = dataRange.getValues();
      
      var headers = data[5];
      var enquiryNoColumnIndex = -1;
      
      for (var i = 0; i < headers.length; i++) {
        if (headers[i] === 'Candidate Enquiry Number') {
          enquiryNoColumnIndex = i;
          break;
        }
      }
      
      if (enquiryNoColumnIndex === -1) {
        throw new Error("Candidate Enquiry Number column not found");
      }
      
      var targetRowIndex = -1;
      for (var row = 6; row < data.length; row++) {
        if (data[row][enquiryNoColumnIndex] === enquiryNo) {
          targetRowIndex = row + 1;
          break;
        }
      }
      
      if (targetRowIndex === -1) {
        throw new Error("Enquiry number not found: " + enquiryNo);
      }
      
      sheet.getRange(targetRowIndex, 28).setValue(timestamp);
      
      return ContentService.createTextOutput(JSON.stringify({ 
        success: true,
        message: "Enquiry sheet updated successfully",
        updatedRow: targetRowIndex
      })).setMimeType(ContentService.MimeType.JSON);
    } else {
      throw new Error("Unknown action: " + action);
    }
  } catch (error) {
    console.error("Error in doPost:", error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleEmailShare(params) {
  try {
    console.log("Handling email share with params:", JSON.stringify(params));
    if (!params.recipientEmail || !params.subject || !params.message || !params.documents) {
      throw new Error("Missing required email parameters: " + JSON.stringify(params));
    }
    var documents = JSON.parse(params.documents);
    var emailSubject = "HR Department - SBH Hospital - " + params.subject;
    var emailBody = params.message + "\n\n\nThis email was sent via Joining Management System.";
    
    MailApp.sendEmail({
      to: params.recipientEmail,
      subject: emailSubject,
      body: emailBody
    });
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "Email sent successfully to " + params.recipientEmail
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error("Error sending email:", error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: "Failed to send email: " + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleFileUpload(e) {
  try {
    console.log('handleFileUpload called');
    var params = e.parameter;
    if (!params.base64Data || !params.fileName || !params.mimeType || !params.folderId) {
      throw new Error("Missing required parameters for file upload.");
    }
    var fileUrl = uploadFileToDrive(params.base64Data, params.fileName, params.mimeType, params.folderId);
    if (!fileUrl) {
      throw new Error("Failed to upload file to Google Drive");
    }
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      fileUrl: fileUrl,
      message: "File uploaded successfully"
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error("Error in handleFileUpload:", error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function uploadFileToDrive(base64Data, fileName, mimeType, folderId) {
  try {
    let fileData = base64Data;
    if (base64Data.indexOf('base64,') !== -1) {
      fileData = base64Data.split('base64,')[1];
    }
    const decoded = Utilities.base64Decode(fileData);
    const blob = Utilities.newBlob(decoded, mimeType, fileName);
    const folder = DriveApp.getFolderById(folderId);
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    const fileUrl = "https://drive.google.com/uc?export=view&id=" + file.getId();
    return fileUrl;
  } catch (error) {
    console.error("Error in uploadFileToDrive:", error);
    return null;
  }
}