import { TestCategory } from "./actions";
import { exportExcel } from "@/lib/excel";

export const downloadTestCategoriesExcel = async (
  categories: TestCategory[],
) => {
  await exportExcel<TestCategory>({
    fileName: "TestCategories.xlsx",
    sheetName: "TestCategories",
    data: categories,
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
    ],
  });
};
