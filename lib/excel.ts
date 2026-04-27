import ExcelJS from "exceljs";

export type ExcelColumn<T> = {
  header: string;
  key: keyof T | string;
  width?: number;
  value?: (row: T, index: number) => any;
  autoSize?: boolean;
};

interface ExportExcelOptions<T> {
  fileName: string;
  sheetName: string;
  columns: ExcelColumn<T>[];
  data: T[];
}

export async function exportExcel<T>({
  fileName,
  sheetName,
  columns,
  data,
}: ExportExcelOptions<T>) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  // Define columns
  worksheet.columns = columns.map((col) => ({
    header: col.header,
    key: col.key as string,
    width: col.width ?? 20,
  }));

  // Add rows
  data.forEach((row, index) => {
    const formattedRow: Record<string, any> = {};

    columns.forEach((col) => {
      formattedRow[col.key as string] = col.value
        ? col.value(row, index)
        : (row as any)[col.key];
    });

    worksheet.addRow(formattedRow);
  });

  // Bold header
  worksheet.getRow(1).font = { bold: true };

  // Auto-size logic (optional columns)
  columns.forEach((col) => {
    if (!col.autoSize) return;

    const colLetter = worksheet.getColumn(col.key as string);

    const maxLen = Math.max(
      col.header.length,
      ...data.map((row, i) => {
        const val = col.value ? col.value(row, i) : (row as any)[col.key];
        return String(val ?? "").length;
      }),
    );

    colLetter.width = Math.max(col.width ?? 15, maxLen + 5);
  });

  // Export
  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = fileName;

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
