import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { type Download, type Page } from '@playwright/test';

const WORKBOOK_MIME =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export const WORKBOOK_FIXTURES = ['first.xlsx', 'second.xlsx', 'third.xlsx'].map(
  (name) => ({
    name,
    base64: readFileSync(
      fileURLToPath(new URL(`../fixtures/${name}`, import.meta.url))
    ).toString('base64'),
  })
);

export async function waitReady(page: Page): Promise<void> {
  await page.waitForFunction(() => (window as Record<string, unknown>).__toolReady === true);
}

export async function dispatchWorkbooks(
  page: Page,
  fixtures = WORKBOOK_FIXTURES
): Promise<void> {
  await page.evaluate(
    ({ workbookFixtures, mimeType }) => {
      const files = workbookFixtures.map(({ name, base64 }) => {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let index = 0; index < binary.length; index += 1) {
          bytes[index] = binary.charCodeAt(index);
        }
        return new File([bytes], name, { type: mimeType });
      });

      window.dispatchEvent(new CustomEvent('filesDropped', { detail: files }));
    },
    { workbookFixtures: fixtures, mimeType: WORKBOOK_MIME }
  );
}

export async function convert(page: Page): Promise<Download> {
  const downloadPromise = page.waitForEvent('download', { timeout: 30_000 });
  await dispatchWorkbooks(page);
  return downloadPromise;
}
