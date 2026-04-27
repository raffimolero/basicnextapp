import React from "react";
import TablePdfDocument, { Column } from "@/components/TablePdfDocument";
import { TestCategory } from "./actions";

interface TestCategoriesPdfDocumentProps {
  categories: TestCategory[];
  totalCount: number;
  searchQuery?: string;
}

const TestCategoriesPdfDocument: React.FC<TestCategoriesPdfDocumentProps> = ({
  categories,
  totalCount,
  searchQuery,
}) => {
  const columns: Column<TestCategory>[] = [
    {
      key: "id",
      label: "ID",
      render: (c) => c.id,
    },
    {
      key: "name",
      label: "Name",
      render: (c) => c.name,
    },
    {
      key: "description",
      label: "Description",
      render: (c) => c.description,
    },
  ];

  return (
    <TablePdfDocument
      title="Test Categories"
      data={categories}
      totalCount={totalCount}
      columns={columns}
      searchQuery={searchQuery}
    />
  );
};

export default TestCategoriesPdfDocument;
