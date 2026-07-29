export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export const ALLOWED_EXTENSIONS = ['.xlsx', '.xlsm'] as const;
export const ALLOWED_MIME_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel.sheet.macroenabled.12',
  'application/zip',
  'application/octet-stream',
] as const;

function extensionOf(fileName: string): string {
  const dot = fileName.lastIndexOf('.');
  return dot >= 0 ? fileName.slice(dot).toLowerCase() : '';
}

export function validateFileExtension(fileName: string): ValidationResult {
  const extension = extensionOf(fileName);

  if (extension === '.xls') {
    return { valid: false, error: 'errLegacyXls' };
  }

  if (!(ALLOWED_EXTENSIONS as readonly string[]).includes(extension)) {
    return { valid: false, error: 'errUnsupported' };
  }

  return { valid: true };
}

export function validateFileMimeType(file: File): ValidationResult {
  const mimeType = file.type.toLowerCase();
  if (mimeType && !(ALLOWED_MIME_TYPES as readonly string[]).includes(mimeType)) {
    return { valid: false, error: 'errUnsupportedMime' };
  }

  return { valid: true };
}

export function validateFile(file: File): ValidationResult {
  const extensionResult = validateFileExtension(file.name);
  if (!extensionResult.valid) {
    return extensionResult;
  }

  const mimeResult = validateFileMimeType(file);
  if (!mimeResult.valid) {
    return mimeResult;
  }

  return { valid: true };
}

/**
 * The merge tool has no fixed byte limit. This function remains for the frozen
 * FileUpload widget, while actual capacity depends on available browser memory.
 */
export function validateTotalSize(_files: File[]): ValidationResult {
  return { valid: true };
}

export function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[/\\?%*:|"<>]/g, '_');
}
