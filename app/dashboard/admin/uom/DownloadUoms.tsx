import ExcelJS from 'exceljs';
import { Uom } from './actions';

export const downloadUomsExcel = async (uoms: Uom[]) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('UnitsOfMeasure');
    worksheet.columns = [
        { header: 'Unit ID', key: 'uomId', width: 12 },
        { header: 'Unit Name', key: 'uomName', width: 15 },
        { header: 'Description', key: 'description', width: 20 },
    ];
    uoms.forEach((uom, index) => {
        worksheet.addRow({
            uomId: uom.id,
            uomName: uom.name,
            description: uom.description || '',
        });
    });
    const maxUomNameLen = uoms.length
        ? Math.max(...uoms.map(r => (r.name || '').length))
        : 0;
    const uomNameCol = worksheet.getColumn('uomName');
    uomNameCol.width = Math.max(uomNameCol.width ?? 20, maxUomNameLen + 8, 28);
    worksheet.getRow(1).font = { bold: true };
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'UOMs.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};
