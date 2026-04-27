import { Uom } from "./actions";
import { exportExcel } from "@/lib/excel";

export const downloadUomsExcel = async (uoms: Uom[]) => {
  await exportExcel<Uom>({
    fileName: "UOMs.xlsx",
    sheetName: "UnitsOfMeasure",
    data: uoms,
    columns: [
      {
        header: "Unit ID",
        key: "id",
      },
      {
        header: "Unit Name",
        key: "name",
        autoSize: true,
      },
      {
        header: "Description",
        key: "description",
      },
    ],
  });
};
