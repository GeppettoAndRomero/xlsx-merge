import type {
  CellValue,
  Row,
  Worksheet,
  Workbook,
} from 'exceljs';
import { AppError } from './appError';

const MAX_WORKSHEET_NAME_LENGTH = 31;
const INVALID_WORKSHEET_NAME_CHARACTERS = /[*?:/\\[\]]/g;

type ExcelJsApi = typeof import('exceljs');

export type MergePhase = 'loading' | 'copying' | 'writing';

export interface MergeProgress {
  phase: MergePhase;
  currentFile: number;
  totalFiles: number;
  fileName?: string;
  sheetCount: number;
}

export interface MergeResult {
  blob: Blob;
  fileCount: number;
  sheetCount: number;
}

export type MergeProgressCallback = (progress: MergeProgress) => void;

async function loadExcelJs(): Promise<ExcelJsApi> {
  const imported = await import('exceljs');
  const withDefault = imported as unknown as { default?: ExcelJsApi };
  return withDefault.default ?? imported;
}

function sanitizeWorksheetName(name: string, fallback: string): string {
  const sanitized = name
    .replace(INVALID_WORKSHEET_NAME_CHARACTERS, '_')
    .replace(/^'+|'+$/g, '')
    .trim();
  return (sanitized || fallback).slice(0, MAX_WORKSHEET_NAME_LENGTH);
}

function fileStem(fileName: string): string {
  const withoutExtension = fileName.replace(/\.(xlsx|xlsm)$/i, '');
  return sanitizeWorksheetName(withoutExtension, 'workbook').slice(0, 20);
}

function appendSuffix(base: string, suffix: string): string {
  const availableLength = MAX_WORKSHEET_NAME_LENGTH - suffix.length;
  return `${base.slice(0, Math.max(1, availableLength))}${suffix}`;
}

/**
 * Produces an Excel-compatible, case-insensitively unique worksheet name.
 * The original name is kept when possible. Collisions first use the source
 * workbook's file name and then a numeric suffix.
 */
export function createUniqueWorksheetName(
  sourceName: string,
  sourceFileName: string,
  usedNames: Iterable<string>
): string {
  const used = new Set(Array.from(usedNames, (name) => name.toLowerCase()));
  const base = sanitizeWorksheetName(sourceName, 'Sheet');

  if (!used.has(base.toLowerCase())) {
    return base;
  }

  const stem = fileStem(sourceFileName);
  const fileCandidate = appendSuffix(base, ` (${stem})`);
  if (!used.has(fileCandidate.toLowerCase())) {
    return fileCandidate;
  }

  for (let index = 2; ; index += 1) {
    const candidate = appendSuffix(base, ` (${stem} ${index})`);
    if (!used.has(candidate.toLowerCase())) {
      return candidate;
    }
  }
}

function copyCellValues(source: Worksheet, target: Worksheet): void {
  source.columns.forEach((column, index) => {
    if (column.width !== undefined) {
      target.getColumn(index + 1).width = column.width;
    }
  });

  source.eachRow({ includeEmpty: true }, (sourceRow: Row, rowNumber: number) => {
    const targetRow = target.getRow(rowNumber);
    if (sourceRow.height !== undefined) {
      targetRow.height = sourceRow.height;
    }

    sourceRow.eachCell({ includeEmpty: true }, (sourceCell, columnNumber) => {
      const targetCell = targetRow.getCell(columnNumber);
      targetCell.value = sourceCell.value as CellValue;
      targetCell.numFmt = sourceCell.numFmt;
    });
  });
}

async function loadWorkbook(
  WorkbookConstructor: typeof Workbook,
  file: File
): Promise<Workbook> {
  const workbook = new WorkbookConstructor();

  try {
    await workbook.xlsx.load(await file.arrayBuffer());
    return workbook;
  } catch {
    throw new AppError('errCannotOpenWorkbook', { name: file.name });
  }
}

/**
 * Merges every worksheet from the supplied workbooks into a new .xlsx file.
 *
 * Cell values, formulas, number formats, column widths, and row heights are
 * copied. Workbook-level features and drawing objects are intentionally not
 * transferred.
 */
export async function mergeWorkbooks(
  files: File[],
  onProgress?: MergeProgressCallback
): Promise<MergeResult> {
  if (files.length < 2) {
    throw new AppError('errNeedMultipleFiles');
  }

  const ExcelJS = await loadExcelJs();
  const output = new ExcelJS.Workbook();
  const usedNames = new Set<string>();
  let sheetCount = 0;

  for (const [fileIndex, file] of files.entries()) {
    onProgress?.({
      phase: 'loading',
      currentFile: fileIndex + 1,
      totalFiles: files.length,
      fileName: file.name,
      sheetCount,
    });

    const input = await loadWorkbook(ExcelJS.Workbook, file);

    onProgress?.({
      phase: 'copying',
      currentFile: fileIndex + 1,
      totalFiles: files.length,
      fileName: file.name,
      sheetCount,
    });

    for (const sourceSheet of input.worksheets) {
      const targetName = createUniqueWorksheetName(sourceSheet.name, file.name, usedNames);
      const targetSheet = output.addWorksheet(targetName);
      copyCellValues(sourceSheet, targetSheet);
      usedNames.add(targetName);
      sheetCount += 1;
    }
  }

  if (sheetCount === 0) {
    throw new AppError('errNoWorksheets');
  }

  onProgress?.({
    phase: 'writing',
    currentFile: files.length,
    totalFiles: files.length,
    sheetCount,
  });

  try {
    const buffer = await output.xlsx.writeBuffer();
    const bytes = new Uint8Array(buffer);
    return {
      blob: new Blob([bytes], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }),
      fileCount: files.length,
      sheetCount,
    };
  } catch {
    throw new AppError('errConversionFailed');
  }
}
