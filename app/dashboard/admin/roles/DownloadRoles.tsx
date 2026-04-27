import { Role } from "./actions";
import { exportExcel } from "@/lib/excel";

export const downloadRolesExcel = async (roles: Role[]) => {
  await exportExcel<Role>({
    fileName: "Roles.xlsx",
    sheetName: "Roles",
    data: roles,
    columns: [
      {
        header: "Row Number",
        key: "rowNumber",
        value: (_role, index) => index + 1, // 👈 preserves row numbering
      },
      {
        header: "Role Name",
        key: "roleName",
        value: (role) => role.id,
        autoSize: true,
      },
      {
        header: "Description",
        key: "description",
        value: (role) => role.description || "",
      },
    ],
  });
};
