import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { AppButton } from './AppButton';
import { AppCard } from './AppCard';
import { ErrorToast } from './ErrorToast';
import { AppError, resolveErrorMessage } from '@/utils/appError';
import { validateFile } from '@/utils/fileValidation';
import {
  mergeWorkbooks,
  type MergeProgress,
  type MergeResult,
} from '@/utils/xlsxMergeEngine';

interface ErrorToastItem {
  id: string;
  message: string;
}

interface MergeViewResult extends MergeResult {
  downloadName: string;
}

interface InteractiveCopy {
  uploadHeading: string;
  uploadSubtitle: string;
  dropClick: string;
  dropOr: string;
  dropSupported: string;
  limitation: string;
  starting: string;
  loading: string;
  copying: string;
  writing: string;
  result: string;
  downloadAgain: string;
  notificationsAria: string;
  errUnsupported: string;
  errLegacyXls: string;
  errUnsupportedMime: string;
  errNeedMultipleFiles: string;
  errBusy: string;
  errCannotOpenWorkbook: string;
  errNoWorksheets: string;
  errConversionFailed: string;
  errDownloadFailed: string;
}

const copy: Record<string, InteractiveCopy> = {
  en: {
    uploadHeading: 'Merge Excel workbooks',
    uploadSubtitle: 'Choose two or more .xlsx or .xlsm files. Workbook order sets worksheet order.',
    dropClick: 'Choose Excel workbooks',
    dropOr: 'or drop multiple files anywhere on the page',
    dropSupported: 'Supported: .xlsx and .xlsm',
    limitation:
      'Cell values, formulas, number formats, column widths, and row heights are copied. Charts, images, macros, conditional formatting, and named ranges are not transferred.',
    starting: 'Preparing the workbooks…',
    loading: 'Opening workbook {current} of {total}: {name}',
    copying: 'Copying worksheets from workbook {current} of {total}: {name}',
    writing: 'Creating merged.xlsx with {sheets} worksheets…',
    result:
      'Merged {files} workbooks into {sheets} worksheets. The merged.xlsx download has started.',
    downloadAgain: 'Download merged.xlsx again',
    notificationsAria: 'Notifications',
    errUnsupported: '{name} is not supported. Choose .xlsx or .xlsm files.',
    errLegacyXls: 'The older .xls format is not supported. Choose .xlsx or .xlsm files.',
    errUnsupportedMime: 'The browser reported an unsupported file type for {name}.',
    errNeedMultipleFiles: 'Choose at least two .xlsx or .xlsm workbooks to merge.',
    errBusy: 'A merge is already in progress. Wait for it to finish before choosing more files.',
    errCannotOpenWorkbook:
      '{name} could not be opened. It may be password-protected or not a valid Excel workbook.',
    errNoWorksheets: 'No worksheets were found in the selected workbooks.',
    errConversionFailed: 'The workbooks could not be merged.',
    errDownloadFailed: 'merged.xlsx could not be downloaded.',
  },
  ja: {
    uploadHeading: 'Excel ブックを統合',
    uploadSubtitle:
      '.xlsx または .xlsm ファイルを 2 件以上選んでください。選択したブックの順にシートを並べます。',
    dropClick: 'Excel ブックを選ぶ',
    dropOr: 'またはページ上に複数ファイルをドロップ',
    dropSupported: '対応形式: .xlsx、.xlsm',
    limitation:
      'セルの値・数式・表示形式、列幅、行高をコピーします。グラフ、画像、マクロ、条件付き書式、名前付き範囲は移しません。',
    starting: 'ブックを準備しています…',
    loading: 'ブックを開いています（{current}/{total}）: {name}',
    copying: 'シートをコピーしています（{current}/{total}）: {name}',
    writing: '{sheets} シートを merged.xlsx に書き出しています…',
    result:
      '{files} 件のブック、合計 {sheets} シートを統合しました。merged.xlsx のダウンロードを開始しました。',
    downloadAgain: 'merged.xlsx をもう一度ダウンロード',
    notificationsAria: '通知',
    errUnsupported: '{name} は対応していません。.xlsx または .xlsm ファイルを選んでください。',
    errLegacyXls: '旧形式の .xls には対応していません。.xlsx または .xlsm を選んでください。',
    errUnsupportedMime: '{name} はブラウザから対応外のファイル形式として報告されました。',
    errNeedMultipleFiles: '統合する .xlsx または .xlsm ブックを 2 件以上選んでください。',
    errBusy: 'ブックを統合中です。処理が終わってから次のファイルを選んでください。',
    errCannotOpenWorkbook:
      '{name} を開けませんでした。パスワード保護されているか、有効な Excel ブックではない可能性があります。',
    errNoWorksheets: '選択したブックにシートが見つかりませんでした。',
    errConversionFailed: 'ブックを統合できませんでした。',
    errDownloadFailed: 'merged.xlsx をダウンロードできませんでした。',
  },
  zh: {
    uploadHeading: '合并 Excel 工作簿',
    uploadSubtitle: '请选择至少两个 .xlsx 或 .xlsm 文件，工作表将按所选文件的顺序排列。',
    dropClick: '选择 Excel 工作簿',
    dropOr: '或将多个文件拖放到页面任意位置',
    dropSupported: '支持格式：.xlsx、.xlsm',
    limitation:
      '会复制单元格值、公式、数字格式、列宽和行高。图表、图片、宏、条件格式和命名区域不会转移。',
    starting: '正在准备工作簿…',
    loading: '正在打开第 {current}/{total} 个工作簿：{name}',
    copying: '正在复制第 {current}/{total} 个工作簿的工作表：{name}',
    writing: '正在将 {sheets} 个工作表写入 merged.xlsx…',
    result: '已将 {files} 个工作簿合并为 {sheets} 个工作表，并开始下载 merged.xlsx。',
    downloadAgain: '再次下载 merged.xlsx',
    notificationsAria: '通知',
    errUnsupported: '不支持 {name}。请选择 .xlsx 或 .xlsm 文件。',
    errLegacyXls: '不支持旧版 .xls 格式。请选择 .xlsx 或 .xlsm 文件。',
    errUnsupportedMime: '浏览器将 {name} 识别为不受支持的文件类型。',
    errNeedMultipleFiles: '请至少选择两个 .xlsx 或 .xlsm 工作簿进行合并。',
    errBusy: '工作簿正在合并，请等待处理结束后再选择文件。',
    errCannotOpenWorkbook:
      '无法打开 {name}。该文件可能受密码保护，或不是有效的 Excel 工作簿。',
    errNoWorksheets: '所选工作簿中没有找到工作表。',
    errConversionFailed: '无法合并这些工作簿。',
    errDownloadFailed: '无法下载 merged.xlsx。',
  },
  de: {
    uploadHeading: 'Excel-Arbeitsmappen zusammenführen',
    uploadSubtitle:
      'Wähle mindestens zwei .xlsx- oder .xlsm-Dateien. Die Reihenfolge der Dateien bestimmt die Reihenfolge der Tabellenblätter.',
    dropClick: 'Excel-Arbeitsmappen auswählen',
    dropOr: 'oder mehrere Dateien auf der Seite ablegen',
    dropSupported: 'Unterstützt: .xlsx und .xlsm',
    limitation:
      'Zellwerte, Formeln, Zahlenformate, Spaltenbreiten und Zeilenhöhen werden kopiert. Diagramme, Bilder, Makros, bedingte Formatierungen und benannte Bereiche werden nicht übertragen.',
    starting: 'Arbeitsmappen werden vorbereitet…',
    loading: 'Arbeitsmappe {current} von {total} wird geöffnet: {name}',
    copying: 'Tabellenblätter aus Arbeitsmappe {current} von {total} werden kopiert: {name}',
    writing: 'merged.xlsx mit {sheets} Tabellenblättern wird erstellt…',
    result:
      '{files} Arbeitsmappen mit insgesamt {sheets} Tabellenblättern wurden zusammengeführt. Der Download von merged.xlsx wurde gestartet.',
    downloadAgain: 'merged.xlsx erneut herunterladen',
    notificationsAria: 'Benachrichtigungen',
    errUnsupported: '{name} wird nicht unterstützt. Wähle .xlsx- oder .xlsm-Dateien.',
    errLegacyXls: 'Das ältere .xls-Format wird nicht unterstützt. Wähle .xlsx oder .xlsm.',
    errUnsupportedMime: 'Der Browser hat für {name} einen nicht unterstützten Dateityp gemeldet.',
    errNeedMultipleFiles:
      'Wähle mindestens zwei .xlsx- oder .xlsm-Arbeitsmappen zum Zusammenführen.',
    errBusy:
      'Eine Zusammenführung läuft bereits. Warte, bis sie beendet ist, bevor du weitere Dateien auswählst.',
    errCannotOpenWorkbook:
      '{name} konnte nicht geöffnet werden. Die Datei ist möglicherweise passwortgeschützt oder keine gültige Excel-Arbeitsmappe.',
    errNoWorksheets: 'In den ausgewählten Arbeitsmappen wurden keine Tabellenblätter gefunden.',
    errConversionFailed: 'Die Arbeitsmappen konnten nicht zusammengeführt werden.',
    errDownloadFailed: 'merged.xlsx konnte nicht heruntergeladen werden.',
  },
  es: {
    uploadHeading: 'Combinar libros de Excel',
    uploadSubtitle:
      'Elige al menos dos archivos .xlsx o .xlsm. Las hojas se ordenarán según el orden de los libros seleccionados.',
    dropClick: 'Elegir libros de Excel',
    dropOr: 'o suelta varios archivos en cualquier parte de la página',
    dropSupported: 'Formatos admitidos: .xlsx y .xlsm',
    limitation:
      'Se copian los valores, las fórmulas, los formatos numéricos, el ancho de las columnas y el alto de las filas. No se transfieren gráficos, imágenes, macros, formatos condicionales ni rangos con nombre.',
    starting: 'Preparando los libros…',
    loading: 'Abriendo el libro {current} de {total}: {name}',
    copying: 'Copiando las hojas del libro {current} de {total}: {name}',
    writing: 'Creando merged.xlsx con {sheets} hojas…',
    result:
      'Se han combinado {files} libros con un total de {sheets} hojas. Ha comenzado la descarga de merged.xlsx.',
    downloadAgain: 'Volver a descargar merged.xlsx',
    notificationsAria: 'Notificaciones',
    errUnsupported: '{name} no es compatible. Elige archivos .xlsx o .xlsm.',
    errLegacyXls: 'El formato antiguo .xls no es compatible. Elige .xlsx o .xlsm.',
    errUnsupportedMime: 'El navegador ha identificado {name} como un tipo de archivo no compatible.',
    errNeedMultipleFiles: 'Elige al menos dos libros .xlsx o .xlsm para combinarlos.',
    errBusy: 'Ya hay una combinación en curso. Espera a que termine antes de elegir más archivos.',
    errCannotOpenWorkbook:
      'No se pudo abrir {name}. Puede estar protegido con contraseña o no ser un libro de Excel válido.',
    errNoWorksheets: 'No se encontraron hojas en los libros seleccionados.',
    errConversionFailed: 'No se pudieron combinar los libros.',
    errDownloadFailed: 'No se pudo descargar merged.xlsx.',
  },
};

interface ConversionManagerProps {
  locale?: string;
}

function fill(template: string, params: Record<string, string | number>): string {
  return Object.entries(params).reduce(
    (text, [key, value]) => text.split(`{${key}}`).join(String(value)),
    template
  );
}

function startDownload(blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'merged.xlsx';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function progressMessage(
  progress: MergeProgress | null,
  t: InteractiveCopy
): string {
  if (!progress) return t.starting;

  if (progress.phase === 'writing') {
    return fill(t.writing, { sheets: progress.sheetCount });
  }

  const template = progress.phase === 'loading' ? t.loading : t.copying;
  return fill(template, {
    current: progress.currentFile,
    total: progress.totalFiles,
    name: progress.fileName ?? '',
  });
}

export function ConversionManager({ locale = 'en' }: ConversionManagerProps) {
  const t = copy[locale] ?? copy.en;
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const [progress, setProgress] = useState<MergeProgress | null>(null);
  const [result, setResult] = useState<MergeViewResult | null>(null);
  const [errorToasts, setErrorToasts] = useState<ErrorToastItem[]>([]);

  const showErrorToast = useCallback((message: string) => {
    const id = `error-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    setErrorToasts((previous) => [...previous, { id, message }]);
  }, []);

  const removeErrorToast = useCallback((id: string) => {
    setErrorToasts((previous) => previous.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    (globalThis as Record<string, unknown>).__toolReady = true;
  }, []);

  const processFiles = useCallback(
    async (files: File[]) => {
      if (busyRef.current) {
        showErrorToast(t.errBusy);
        return;
      }

      if (files.length < 2) {
        showErrorToast(t.errNeedMultipleFiles);
        return;
      }

      for (const file of files) {
        const validation = validateFile(file);
        if (!validation.valid) {
          showErrorToast(
            resolveErrorMessage(
              new AppError(validation.error ?? 'errConversionFailed', { name: file.name }),
              t as unknown as Record<string, string>
            )
          );
          return;
        }
      }

      busyRef.current = true;
      setBusy(true);
      setProgress(null);
      setResult(null);

      try {
        const merged = await mergeWorkbooks(files, setProgress);
        const nextResult: MergeViewResult = {
          ...merged,
          downloadName: 'merged.xlsx',
        };
        setResult(nextResult);
        startDownload(merged.blob);
      } catch (error) {
        showErrorToast(resolveErrorMessage(error, t as unknown as Record<string, string>));
      } finally {
        busyRef.current = false;
        setBusy(false);
        setProgress(null);
      }
    },
    [showErrorToast, t]
  );

  const handleFiles = useCallback(
    async (files: File[]) => {
      try {
        await processFiles(files);
      } finally {
        window.dispatchEvent(new CustomEvent('filesProcessed'));
      }
    },
    [processFiles]
  );

  useEffect(() => {
    const handler = (event: Event) => {
      void handleFiles((event as CustomEvent<File[]>).detail);
    };
    window.addEventListener('filesDropped', handler);
    return () => window.removeEventListener('filesDropped', handler);
  }, [handleFiles]);

  const downloadAgain = useCallback(() => {
    if (!result) return;
    try {
      startDownload(result.blob);
    } catch {
      showErrorToast(t.errDownloadFailed);
    }
  }, [result, showErrorToast, t]);

  return (
    <div>
      <AppCard>
        <div style="margin-bottom: var(--space-4);">
          <h3 style="margin: 0 0 var(--space-1) 0; font-size: var(--fs-4); font-weight: 600;">
            {t.uploadHeading}
          </h3>
          <p style="margin: 0; font-size: var(--fs-2); color: var(--color-subtle);">
            {t.uploadSubtitle}
          </p>
        </div>

        <button
          type="button"
          disabled={busy}
          onClick={() => document.getElementById('file-input')?.click()}
          style={{
            width: '100%',
            padding: 'var(--space-6)',
            border: '2px dashed var(--color-border)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            textAlign: 'center',
            marginBottom: 'var(--space-4)',
            cursor: busy ? 'wait' : 'pointer',
          }}
        >
          <span style="display: block; font-size: 3rem; margin-bottom: var(--space-2);" aria-hidden="true">
            📚
          </span>
          <span style="display: block; font-size: var(--fs-3); font-weight: 600; margin-bottom: var(--space-2);">
            {t.dropClick}
          </span>
          <span style="display: block; font-size: var(--fs-1); color: var(--color-subtle);">
            {t.dropOr}
          </span>
          <span style="display: block; font-size: var(--fs-1); color: var(--color-subtle); margin-top: var(--space-1);">
            {t.dropSupported}
          </span>
        </button>

        <input
          id="file-input"
          type="file"
          accept=".xlsx,.xlsm,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel.sheet.macroEnabled.12"
          multiple
          onChange={(event) => {
            void handleFiles(Array.from(event.currentTarget.files || []));
            event.currentTarget.value = '';
          }}
          style="display: none;"
        />

        <p style="margin: 0; font-size: var(--fs-1); color: var(--color-subtle);">
          {t.limitation}
        </p>

        {busy && (
          <div
            role="status"
            aria-live="polite"
            style="margin-top: var(--space-4); color: var(--color-subtle);"
          >
            {progressMessage(progress, t)}
          </div>
        )}

        {result && (
          <div
            data-testid="merge-result"
            data-file-count={result.fileCount}
            data-sheet-count={result.sheetCount}
            role="status"
            style="margin-top: var(--space-4); padding: var(--space-4); background: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius-sm);"
          >
            <strong>{result.downloadName}</strong>
            <p style="margin: var(--space-2) 0 0 0; font-size: var(--fs-2); color: var(--color-subtle);">
              {fill(t.result, { files: result.fileCount, sheets: result.sheetCount })}
            </p>
            <div style="margin-top: var(--space-3);">
              <AppButton variant="secondary" onClick={downloadAgain}>
                {t.downloadAgain}
              </AppButton>
            </div>
          </div>
        )}
      </AppCard>

      {errorToasts.length > 0 && (
        <div className="error-toast-container" aria-label={t.notificationsAria}>
          {errorToasts.map((toast) => (
            <ErrorToast
              key={toast.id}
              id={toast.id}
              message={toast.message}
              onClose={removeErrorToast}
              locale={locale}
            />
          ))}
        </div>
      )}
    </div>
  );
}
