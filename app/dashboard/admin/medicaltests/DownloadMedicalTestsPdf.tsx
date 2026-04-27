"use client";

import React from "react";
import { MedicalTest } from "./actions";
import MedicalTestsPdfDocument from "./MedicalTestsPdfDocument";
import ConfirmModal from "@/components/ConfirmModal";
import { usePdfDownload } from "@/hooks/usePdfDownload";

interface DownloadMedicalTestsPdfProps {
  tests: MedicalTest[];
  searchQuery: string;
}

const DownloadMedicalTestsPdf: React.FC<DownloadMedicalTestsPdfProps> = ({
  tests,
  searchQuery,
}) => {
  const { download, isGenerating } = usePdfDownload({
    fileName: "MedicalTests.pdf",
    confirmMessage: "Download Medical Tests to PDF?",
    confirm: ConfirmModal,
    confirmOptions: {
      okText: "Yes, Download",
      cancelText: "Cancel",
      okColor: "bg-purple-600 hover:bg-purple-700",
    },
  });

  const handleDownload = () => {
    const filtered = tests.filter(
      (t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    download(
      <MedicalTestsPdfDocument
        tests={filtered}
        totalCount={filtered.length}
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

export default DownloadMedicalTestsPdf;
