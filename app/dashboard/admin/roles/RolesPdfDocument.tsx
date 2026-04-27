import React from "react";
import TablePdfDocument, { Column } from "@/components/TablePdfDocument";
import { Role } from "./actions";

interface RolesPdfDocumentProps {
  roles: Role[];
  totalCount: number;
  searchQuery?: string;
}

const RolesPdfDocument: React.FC<RolesPdfDocumentProps> = ({
  roles,
  totalCount,
  searchQuery,
}) => {
  const columns: Column<Role>[] = [
    {
      key: "rowNumber",
      label: "Row No.",
      render: (_role, index) => index + 1,
    },
    {
      key: "name",
      label: "Role ID",
      render: (role) => role.id,
    },
    {
      key: "description",
      label: "Description",
      render: (role) => role.description,
    },
  ];

  return (
    <TablePdfDocument
      title="Roles"
      data={roles}
      totalCount={totalCount}
      columns={columns}
      searchQuery={searchQuery}
    />
  );
};

export default RolesPdfDocument;
