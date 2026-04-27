import { MedicalTest } from "./actions";
import { exportExcel } from "@/lib/excel";

export const downloadMedicalTestsExcel = async (
  tests: MedicalTest[]
) => {
  await exportExcel<MedicalTest>({
    fileName: "MedicalTests.xlsx",
    sheetName: "MedicalTests",
    data: tests,
    columns: [
      {
        header: "ID",
        key: "id",
      },
      {
        header: "Name",
        key: "name",
        autoSize: true,
      },
      {
        header: "Description",
        key: "description",
      },
      {
        header: "UOM",
        key: "uomName",
      },
      {
        header: "Category",
        key: "categoryName",
      },
      {
        header: "Normal Min",
        key: "normalmin",
      },
      {
        header: "Normal Max",
        key: "normalmax",
      },
    ],
  });
};