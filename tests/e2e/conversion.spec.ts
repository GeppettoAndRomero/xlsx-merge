import { readFileSync } from 'node:fs';
import ExcelJS from 'exceljs';
import { expect, test } from '@playwright/test';
import { convert, waitReady } from './_helpers';

test.describe('Excel workbook merge', () => {
  test('merges all worksheets in file order without an upload', async ({ page }) => {
    const externalRequests: string[] = [];
    page.on('request', (request) => {
      const url = request.url();
      if (
        !url.startsWith('http://localhost:4321') &&
        !url.startsWith('data:') &&
        !url.startsWith('blob:')
      ) {
        externalRequests.push(url);
      }
    });

    await page.goto('/xlsx-merge/');
    await waitReady(page);
    const download = await convert(page);

    expect(download.suggestedFilename()).toBe('merged.xlsx');
    const downloadedPath = await download.path();
    expect(downloadedPath).toBeTruthy();
    const bytes = readFileSync(downloadedPath as string);
    expect(Array.from(bytes.subarray(0, 2))).toEqual([0x50, 0x4b]);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(bytes);
    expect(workbook.worksheets.map((sheet) => sheet.name)).toEqual([
      'Summary',
      'January',
      'Summary (second)',
      'Details',
      'Summary (third)',
    ]);
    expect(workbook.worksheets.map((sheet) => sheet.getCell('A2').value)).toEqual([
      'First workbook',
      'Alpha',
      'Second workbook',
      'B-1',
      'Third workbook',
    ]);
    expect(workbook.getWorksheet('Summary')?.getCell('B2').numFmt).toBe('0.00');

    await expect(page.locator('[data-testid="merge-result"]')).toHaveAttribute(
      'data-file-count',
      '3'
    );
    await expect(page.locator('[data-testid="merge-result"]')).toHaveAttribute(
      'data-sheet-count',
      '5'
    );
    expect(
      externalRequests,
      `unexpected cross-origin requests: ${externalRequests.join(', ')}`
    ).toHaveLength(0);
  });

  test('asks for at least two workbooks', async ({ page }) => {
    await page.goto('/xlsx-merge/');
    await waitReady(page);
    await page.evaluate(() => {
      window.dispatchEvent(
        new CustomEvent('filesDropped', {
          detail: [new File(['one'], 'one.xlsx')],
        })
      );
    });

    await expect(page.getByRole('alert')).toContainText('at least two');
  });

  test('explains that legacy .xls files are outside the supported scope', async ({ page }) => {
    await page.goto('/xlsx-merge/');
    await waitReady(page);
    await page.evaluate(() => {
      window.dispatchEvent(
        new CustomEvent('filesDropped', {
          detail: [
            new File(['legacy'], 'legacy.xls', { type: 'application/vnd.ms-excel' }),
            new File(['placeholder'], 'second.xlsx'),
          ],
        })
      );
    });

    await expect(page.getByRole('alert')).toContainText('older .xls format is not supported');
  });
});
