export const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw6xeabQpVzEnNMhLWfMAwLJ0hFZxA2L89aX17-p4b-caM4SdpsETrtq5GT4Lwk84qL/exec";
export const SHEET_ID = "162o34BXqnJvmJjjtIoQpcBGo8orn2ZO5Jf0p8MgoUCs";

/**
 * Fetches sheet data with optional fallback sheet name if the primary sheet name is not found.
 */
export async function fetchScorecardSheetData(primarySheetName, fallbackSheetName = null) {
  try {
    let url = `${SCRIPT_URL}?sheetId=${encodeURIComponent(SHEET_ID)}&sheetName=${encodeURIComponent(primarySheetName)}&action=getData`;
    let response = await fetch(url);
    
    if (!response.ok && fallbackSheetName) {
      url = `${SCRIPT_URL}?sheetId=${encodeURIComponent(SHEET_ID)}&sheetName=${encodeURIComponent(fallbackSheetName)}&action=getData`;
      response = await fetch(url);
    }
    
    if (!response.ok) return { success: false, data: [] };
    
    const result = await response.json();
    if (!result.success && fallbackSheetName) {
      url = `${SCRIPT_URL}?sheetId=${encodeURIComponent(SHEET_ID)}&sheetName=${encodeURIComponent(fallbackSheetName)}&action=getData`;
      const fallbackRes = await fetch(url);
      if (fallbackRes.ok) {
        const fallbackResult = await fallbackRes.json();
        if (fallbackResult.success) return fallbackResult;
      }
    }
    return result;
  } catch (err) {
    console.error(`Error fetching scorecard for ${primarySheetName}:`, err);
    if (fallbackSheetName) {
      try {
        const fallbackUrl = `${SCRIPT_URL}?sheetId=${encodeURIComponent(SHEET_ID)}&sheetName=${encodeURIComponent(fallbackSheetName)}&action=getData`;
        const res = await fetch(fallbackUrl);
        if (res.ok) return await res.json();
      } catch (fallbackErr) {
        console.error(`Fallback failed for ${fallbackSheetName}:`, fallbackErr);
      }
    }
    return { success: false, data: [] };
  }
}

/**
 * Extracts data rows after the timestamp header.
 */
export function extractDataRows(sheetData) {
  if (!sheetData || !Array.isArray(sheetData) || sheetData.length === 0) return [];
  
  let headerRowIdx = 3;
  for (let i = 0; i < Math.min(sheetData.length, 10); i++) {
    if (sheetData[i] && sheetData[i][0] && sheetData[i][0].toString().toLowerCase().trim() === 'timestamp') {
      headerRowIdx = i;
      break;
    }
  }

  return sheetData.slice(headerRowIdx + 1).filter(r => r && r[0] && r[1]);
}

/**
 * Returns current month string in "Month Year" format (e.g., "September 2026").
 */
export function getCurrentMonthString() {
  const currentDate = new Date();
  return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
}

/**
 * Extracts all unique months from user submissions and includes a rolling 12-month calendar
 * so users can select and fill for current or any past/upcoming month.
 */
export function extractAvailableMonths(dataRows = []) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonthIdx = currentDate.getMonth();

  // Generate 18-month rolling window (next 1 month + current + past 16 months)
  const standardMonths = [];
  for (let i = 1; i >= -16; i--) {
    const d = new Date(currentYear, currentMonthIdx + i, 1);
    const mStr = d.toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!standardMonths.includes(mStr)) {
      standardMonths.push(mStr);
    }
  }

  // Also collect any custom months that exist in the sheet data
  const sheetMonths = [];
  if (Array.isArray(dataRows)) {
    dataRows.forEach(r => {
      const m = r && r[1] ? r[1].toString().trim() : '';
      if (m && !sheetMonths.includes(m)) {
        sheetMonths.push(m);
      }
    });
  }

  // Merge standardMonths and sheetMonths
  const allMonths = [...standardMonths];
  sheetMonths.forEach(m => {
    if (!allMonths.some(existing => existing.toLowerCase() === m.toLowerCase())) {
      allMonths.push(m);
    }
  });

  // Sort months chronologically descending (latest first)
  allMonths.sort((a, b) => {
    const timeA = new Date(Date.parse(`01 ${a}`)).getTime() || 0;
    const timeB = new Date(Date.parse(`01 ${b}`)).getTime() || 0;
    return timeB - timeA;
  });

  return allMonths;
}

/**
 * Determines the default selected month when opening the scorecard.
 * Defaults to the Current Month so user sees current month's status (or fresh blank form if not filled yet).
 */
export function getDefaultSelectedMonth(dataRows = [], months = []) {
  const currentMonthStr = getCurrentMonthString();
  if (months && months.includes(currentMonthStr)) {
    return currentMonthStr;
  }
  return months && months.length > 0 ? months[0] : currentMonthStr;
}

/**
 * Finds the latest user submission for a given month or overall.
 */
export function findUserSubmission(dataRows, targetMonth = null) {
  const userRows = dataRows.filter(row => {
    if (row[2] !== "User") return false;
    if (!targetMonth) return true;
    return row[1] && row[1].toString().trim().toLowerCase() === targetMonth.toString().trim().toLowerCase();
  });

  if (userRows.length === 0) return null;

  return userRows.reduce((latest, current) => {
    const latestTimestamp = new Date(latest[0]);
    const currentTimestamp = new Date(current[0]);
    return currentTimestamp > latestTimestamp ? current : latest;
  });
}

/**
 * Finds the latest COO evaluation for a given month.
 */
export function findCooEvaluation(dataRows, targetMonth) {
  const cooRows = dataRows.filter(row => {
    if (row[2] === "User") return false;
    if (!targetMonth) return true;
    return row[1] && row[1].toString().trim().toLowerCase() === targetMonth.toString().trim().toLowerCase();
  });

  if (cooRows.length === 0) return null;

  return cooRows.reduce((latest, current) => {
    const latestTimestamp = new Date(latest[0]);
    const currentTimestamp = new Date(current[0]);
    return currentTimestamp > latestTimestamp ? current : latest;
  });
}
