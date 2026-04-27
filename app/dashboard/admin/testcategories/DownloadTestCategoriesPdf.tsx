"use client";

import React from "react";
import { TestCategory } from "./actions";
import TestCategoriesPdfDocument from "./TestCategoriesPdfDocument";
import ConfirmModal from "@/components/ConfirmModal";
import { usePdfDownload } from "@/hooks/usePdfDownload";

interface DownloadTestCategoriesPdfProps {
  categories: TestCategory[];
  searchQuery: string;
}

const DownloadTestCategoriesPdf: React.FC<DownloadTestCategoriesPdfProps> = ({
  categories,
  searchQuery,
}) => {
  const { download, isGenerating } = usePdfDownload({
    fileName: "TestCategories.pdf",
    confirmMessage: "Download Test Categories to PDF?",
    confirm: ConfirmModal,
    confirmOptions: {
      okText: "Yes, Download",
      cancelText: "Cancel",
      okColor: "bg-purple-600 hover:bg-purple-700",
    },
  });

  const handleDownload = () => {
    download(
      <TestCategoriesPdfDocument
        categories={categories}
        totalCount={categories.length}
        searchQuery={searchQuery}
      />,
    );
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className="rounded-md bg-purple-600 px-5 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition-colors shadow-sm whitespace-nowrap"
    >
      {isGenerating ? "Preparing PDF..." : "Download PDF"}
    </button>
  );
};

export default DownloadTestCategoriesPdf;
