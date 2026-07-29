import { describe, expect, it } from 'vitest';
import ExcelJS from 'exceljs';
import {
  createUniqueWorksheetName,
  mergeWorkbooks,
} from '@/utils/xlsxMergeEngine';

const WORKBOOK_MIME =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

async function workbookFile(
  name: string,
  sheets: Array<{ name: string; marker: string }>
): Promise<File> {
  const workbook = new ExcelJS.Workbook();
  for (const sheet of sheets) {
    const worksheet = workbook.addWorksheet(sheet.name);
    worksheet.getCell('A1').value = sheet.marker;
    worksheet.getCell('B1').value = 12.5;
    worksheet.getCell('B1').numFmt = '0.00';
    worksheet.getColumn(1).width = 24;
    worksheet.getRow(1).height = 21;
  }

  const bytes = new Uint8Array(await workbook.xlsx.writeBuffer());
  return {
    name,
    type: WORKBOOK_MIME,
    size: bytes.byteLength,
    arrayBuffer: async () => bytes.slice().buffer,
  } as unknown as File;
}

describe('createUniqueWorksheetName', () => {
  it('keeps the original name when it is available', () => {
    expect(createUniqueWorksheetName('Summary', 'first.xlsx', [])).toBe('Summary');
  });

  it('uses a sanitized file name when a sheet name collides', () => {
    expect(createUniqueWorksheetName('Summary', 'Q1/report.xlsx', ['summary'])).toBe(
      'Summary (Q1_report)'
    );
  });

  it('enforces the 31-character limit and adds a numeric suffix when needed', () => {
    const used = [
      'A worksheet name that is too lo',
      'A workshee (second workbook)',
    ];
    const name = createUniqueWorksheetName(
      'A worksheet name that is too long',
      'second workbook.xlsx',
      used
    );
    expect(name.length).toBeLessThanOrEqual(31);
    expect(name).not.toBe(used[0]);
    expect(name).not.toBe(used[1]);
  });
});

describe('mergeWorkbooks', () => {
  it('copies worksheets in file order and resolves duplicate names', async () => {
    const first = await workbookFile('first.xlsx', [
      { name: 'Summary', marker: 'first-summary' },
      { name: 'January', marker: 'first-january' },
    ]);
    const second = await workbookFile('second.xlsx', [
      { name: 'Summary', marker: 'second-summary' },
    ]);

    const result = await mergeWorkbooks([first, second]);
    const output = new ExcelJS.Workbook();
    await output.xlsx.load(await result.blob.arrayBuffer());

    expect(result.fileCount).toBe(2);
    expect(result.sheetCount).toBe(3);
    expect(output.worksheets.map((sheet) => sheet.name)).toEqual([
      'Summary',
      'January',
      'Summary (second)',
    ]);
    expect(output.worksheets.map((sheet) => sheet.getCell('A1').value)).toEqual([
      'first-summary',
      'first-january',
      'second-summary',
    ]);
    expect(output.worksheets[0].getCell('B1').numFmt).toBe('0.00');
    expect(output.worksheets[0].getColumn(1).width).toBe(24);
    expect(output.worksheets[0].getRow(1).height).toBe(21);
  });
});
