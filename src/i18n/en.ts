import type { ToolContent } from './types';

export const en: ToolContent = {
  htmlLang: 'en',

  meta: {
    title: 'Merge Excel Workbooks — All Sheets, No Upload | runlocally',
    description:
      'Merge multiple XLSX or XLSM workbooks into one XLSX file in your browser. Sheets keep file order, and duplicate sheet names are renamed.',
    ogTitle: 'Merge Excel Workbooks in Your Browser',
    ogDescription:
      'Collect every worksheet from multiple XLSX or XLSM workbooks in one XLSX file without uploading the source files.',
  },

  hero: {
    h1: 'Merge Excel Workbooks',
    tagline:
      'Collect all worksheets from multiple XLSX or XLSM files in one workbook. Processing stays in your browser.',
  },

  intro: {
    h2: 'One workbook containing all selected sheets',
    paras: [
      'This tool opens each selected Excel workbook and copies its worksheets into a new file named merged.xlsx. Worksheets follow the order of the input files, and their order within each source workbook is retained.',
      'It combines whole worksheets; it does not append rows from similar tables or reconcile columns. If two worksheets have the same name, the later one receives a suffix based on its source file name while remaining within Excel’s 31-character sheet-name limit.',
    ],
  },

  privacy: {
    h2: 'Workbook processing stays on your device',
    lead:
      'The browser reads the selected files and creates the merged workbook locally. The tool has no upload step:',
    points: [
      'Your workbook data is processed by code running in the page.',
      'The merged file is created in browser memory and downloaded from the same page.',
      'The static page does not send the selected files to a conversion service.',
      'The source code is available under the MIT license for inspection.',
    ],
    note:
      'You can inspect the browser Network panel during a merge to verify that no request contains your workbook data.',
    sourceLinkText: 'View the source.',
  },

  howto: {
    h2: 'How to merge workbooks',
    steps: [
      {
        h3: 'Select at least two workbooks',
        p: 'Choose .xlsx or .xlsm files together, or drop multiple files onto the page. Arrange them in the order you want before selecting them.',
      },
      {
        h3: 'Wait while worksheets are copied',
        p: 'The page opens each workbook in sequence, assigns unique worksheet names where needed, and writes a new XLSX workbook.',
      },
      {
        h3: 'Save merged.xlsx',
        p: 'The download starts after the new workbook is written. The result panel shows the number of source files and worksheets and provides another download button.',
      },
    ],
  },

  faqHeading: 'FAQ',
  faq: [
    {
      q: 'Are my Excel files uploaded?',
      a: 'No. Reading, copying, and writing take place in your browser. The selected workbooks are not sent to a conversion server.',
    },
    {
      q: 'What does the tool copy?',
      a: 'It copies cell values and formulas, number formats, column widths, and row heights. Worksheet order is retained. Formulas are copied as written, so references are not rewritten when a duplicate worksheet name has to change.',
    },
    {
      q: 'What is not transferred to the merged workbook?',
      a: 'Charts, embedded images, macros, conditional formatting, named ranges, and other workbook-level features are not transferred. Use Excel or another spreadsheet editor when those features must be retained.',
    },
    {
      q: 'What happens when worksheet names match?',
      a: 'The first worksheet keeps its name. A later collision receives a suffix based on the source file name, followed by a number if needed. Invalid characters are replaced and names are limited to 31 characters.',
    },
    {
      q: 'Does this combine rows from matching tables?',
      a: 'No. Each source worksheet remains a separate worksheet in the result. The tool does not append rows, match columns, deduplicate records, or calculate totals across files.',
    },
    {
      q: 'Can I merge .xls or password-protected workbooks?',
      a: 'The older .xls format is not supported. A password-protected workbook cannot be opened by this tool; remove the password in a spreadsheet editor before merging.',
    },
    {
      q: 'Are macros from .xlsm files retained?',
      a: 'No. .xlsm files are accepted as sources so their worksheet cells can be read, but the output is merged.xlsx and VBA macros are not copied.',
    },
    {
      q: 'Is there a file-size limit?',
      a: 'The tool does not set a fixed byte limit. All selected workbooks and the output use browser memory, so the practical limit depends on the device, browser, and workbook contents.',
    },
  ],

  footer: {
    openSourceLabel: 'Open source (MIT)',
    partOf: 'part of',
    brandTail: '— small tools that run locally on your device.',
    colophon:
      "Built and maintained by Geppetto. AI assistance is used for parts of the code and copy; the maintainer reviews the result.",
    securityText: 'Security',
  },
};
