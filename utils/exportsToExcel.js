// // mainfolder/utils/exportsToExcel.js

import { generateExcelFile } from './createExcelFile';
import { fetchTimesheetSummary, fetchTimesheetData } from './timesheetUtils';

export async function exportToExcel(type) {
  let data = [];

  if (type === 'summary') {
    data = await fetchTimesheetSummary();
  } else if (type === 'detailed') {
    data = await fetchTimesheetData();
  }

  // Debugging: Log data before passing to Excel generation
  console.log(`Data for Excel (${type}):`, data);

  return await generateExcelFile(data, type);
}
