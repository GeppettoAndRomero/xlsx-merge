import { describe, expect, it } from 'vitest';
import {
  sanitizeFileName,
  validateFile,
  validateFileExtension,
  validateFileMimeType,
  validateTotalSize,
} from '@/utils/fileValidation';

const fileStub = (name: string, type = '', size = 1): File =>
  ({ name, type, size }) as unknown as File;

describe('validateFileExtension', () => {
  it('accepts .xlsx and .xlsm regardless of case', () => {
    expect(validateFileExtension('first.XLSX').valid).toBe(true);
    expect(validateFileExtension('macros.XLSM').valid).toBe(true);
  });

  it('returns a specific error for legacy .xls files', () => {
    expect(validateFileExtension('legacy.xls')).toEqual({
      valid: false,
      error: 'errLegacyXls',
    });
  });

  it('rejects unrelated file extensions', () => {
    expect(validateFileExtension('table.csv').valid).toBe(false);
  });
});

describe('validateFileMimeType', () => {
  it('accepts the standard workbook MIME types', () => {
    expect(
      validateFileMimeType(
        fileStub(
          'first.xlsx',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
      ).valid
    ).toBe(true);
    expect(
      validateFileMimeType(
        fileStub('macros.xlsm', 'application/vnd.ms-excel.sheet.macroEnabled.12')
      ).valid
    ).toBe(true);
  });

  it('accepts an empty MIME type and relies on the extension', () => {
    expect(validateFileMimeType(fileStub('first.xlsx')).valid).toBe(true);
  });

  it('rejects a MIME type that is not a workbook container', () => {
    expect(validateFileMimeType(fileStub('first.xlsx', 'text/csv')).valid).toBe(false);
  });
});

describe('validateFile', () => {
  it('accepts valid .xlsx and .xlsm files', () => {
    expect(validateFile(fileStub('first.xlsx')).valid).toBe(true);
    expect(validateFile(fileStub('macros.xlsm')).valid).toBe(true);
  });

  it('rejects a file with an unsupported extension', () => {
    expect(validateFile(fileStub('table.csv', 'text/csv')).valid).toBe(false);
  });
});

describe('validateTotalSize', () => {
  it('does not impose an invented fixed byte limit', () => {
    expect(
      validateTotalSize([
        fileStub('first.xlsx', '', 2 * 1024 * 1024 * 1024),
        fileStub('second.xlsx', '', 1),
      ]).valid
    ).toBe(true);
  });
});

describe('sanitizeFileName', () => {
  it('replaces path and reserved characters with underscores', () => {
    expect(sanitizeFileName('a/b\\c:d*e?.xlsx')).toBe('a_b_c_d_e_.xlsx');
  });
});
