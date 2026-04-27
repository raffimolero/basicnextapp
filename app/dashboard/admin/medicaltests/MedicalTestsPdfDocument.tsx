import React from "react";
import TablePdfDocument, { Column } from "@/components/TablePdfDocument";
import { MedicalTest } from "./actions";

interface MedicalTestsPdfDocumentProps {
  tests: MedicalTest[];
  totalCount: number;
  searchQuery?: string;
}

const MedicalTestsPdfDocument: React.FC<MedicalTestsPdfDocumentProps> = ({
  tests,
  totalCount,
  searchQuery,
}) => {
  const columns: Column<MedicalTest>[] = [
    { key: "id", label: "ID", render: (t) => t.id },
    { key: "name", label: "Name", render: (t) => t.name },
    { key: "description", label: "Description", render: (t) => t.description },
    { key: "uomName", label: "UOM", render: (t) => t.uomName },
    { key: "categoryName", label: "Category", render: (t) => t.categoryName },
    { key: "normalmin", label: "Min", render: (t) => t.normalmin },
    { key: "normalmax", label: "Max", render: (t) => t.normalmax },
  ];

  return (
    <TablePdfDocument
      title="Medical Tests"
      data={tests}
      totalCount={totalCount}
      columns={columns}
      searchQuery={searchQuery}
    />
  );
};

export default MedicalTestsPdfDocument;
