// // //mainfolder / utils / createExcelFile.js;

import ExcelJS from 'exceljs';

export async function generateExcelFile(data, type) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(
    type === 'summary' ? 'Summary' : 'Detailed Report'
  );

  // Add columns based on type
  if (type === 'summary') {
    worksheet.columns = [
      { header: 'Username', key: 'username', width: 20 },
      { header: 'Total Hours', key: 'totalHours', width: 15 },
      // Dynamically add columns for each week
      ...Object.keys(data[0])
        .filter((key) => key !== 'username' && key !== 'totalHours')
        .map((key) => ({
          header: key,
          key,
          width: 20,
        })),
    ];
  } else {
    worksheet.columns = [
      { header: 'Username', key: 'username', width: 20 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Start', key: 'start', width: 10 },
      { header: 'End', key: 'end', width: 10 },
      { header: 'Hours Worked', key: 'hoursWorked', width: 15 },
    ];
  }

  // Add data rows
  data.forEach((item) => {
    worksheet.addRow(item);
  });

  // Generate buffer instead of writing to file
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}
