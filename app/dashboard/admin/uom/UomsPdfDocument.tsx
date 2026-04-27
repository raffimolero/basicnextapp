import React from "react";
import TablePdfDocument, { Column } from "@/components/TablePdfDocument";
import { Uom } from "./actions";

interface UomsPdfDocumentProps {
  uoms: Uom[];
  totalCount: number;
  searchQuery?: string;
}

const UomsPdfDocument: React.FC<UomsPdfDocumentProps> = ({
  uoms,
  totalCount,
  searchQuery,
}) => {
  const columns: Column<Uom>[] = [
    {
      key: "id",
      label: "ID",
      render: (uom) => uom.id,
    },
    {
      key: "name",
      label: "Name",
      render: (uom) => uom.name,
    },
    {
      key: "description",
      label: "Description",
      render: (uom) => uom.description,
    },
  ];

  return (
    <TablePdfDocument
      title="Units of Measure"
      data={uoms}
      totalCount={totalCount}
      columns={columns}
      searchQuery={searchQuery}
    />
  );
};

export default UomsPdfDocument;
