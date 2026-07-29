import ExcelJS from 'exceljs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const fixtureDirectory = dirname(fileURLToPath(import.meta.url));

const fixtureDefinitions = [
  {
    fileName: 'first.xlsx',
    sheets: [
      {
        name: 'Summary',
        rows: [
          ['Source', 'Amount'],
          ['First workbook', 12.5],
        ],
      },
      {
        name: 'January',
        rows: [
          ['Item', 'Count'],
          ['Alpha', 2],
        ],
      },
    ],
  },
  {
    fileName: 'second.xlsx',
    sheets: [
      {
        name: 'Summary',
        rows: [
          ['Source', 'Amount'],
          ['Second workbook', 24],
        ],
      },
      {
        name: 'Details',
        rows: [
          ['Code', 'Active'],
          ['B-1', true],
        ],
      },
    ],
  },
  {
    fileName: 'third.xlsx',
    sheets: [
      {
        name: 'Summary',
        rows: [
          ['Source', 'Amount'],
          ['Third workbook', 7.25],
        ],
      },
    ],
  },
];

for (const definition of fixtureDefinitions) {
  const workbook = new ExcelJS.Workbook();

  for (const sheet of definition.sheets) {
    const worksheet = workbook.addWorksheet(sheet.name);
    worksheet.addRows(sheet.rows);
    worksheet.getRow(1).height = 20;
    worksheet.getColumn(1).width = 18;
    worksheet.getColumn(2).width = 12;
    worksheet.getColumn(2).numFmt = '0.00';
  }

  await workbook.xlsx.writeFile(join(fixtureDirectory, definition.fileName));
}
