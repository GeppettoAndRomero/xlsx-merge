# xlsx-merge

Merge every worksheet from multiple XLSX or XLSM workbooks into one XLSX file in
your browser. Files are processed on the device and are not uploaded.

Part of [runlocally](https://runlocally.app) — small tools that run locally on your device.

## How it works

[ExcelJS](https://github.com/exceljs/exceljs) is loaded after files are selected.
Each source workbook is opened in order, and its worksheets are copied into a new
workbook named `merged.xlsx`. Duplicate worksheet names receive a suffix based on
the source file name.

The merge copies cell values and formulas, number formats, column widths, and row
heights. It does not transfer charts, images, macros, conditional formatting, named
ranges, or other workbook-level features.

## Scope

- Input: two or more `.xlsx` or `.xlsm` workbooks
- Output: one `merged.xlsx` workbook
- Worksheet order follows input file order
- Same-name worksheets are renamed within Excel's 31-character limit
- Rows from separate worksheets are not appended or reconciled

## Develop

```bash
npm run dev
npm run type-check
npm run lint
npm run test:unit
npm run build
```

The stack is Astro, Preact, TypeScript, and ExcelJS.

## License

[MIT](./LICENSE). Built and maintained by Geppetto. AI assistance is used for
parts of the code and copy; the maintainer reviews the result.
