'use client';

import React from 'react';
import { Uom } from './actions';
import UomsPdfDocument from './UomsPdfDocument';
import ConfirmModal from '@/components/ConfirmModal';
import { usePdfDownload } from '@/hooks/usePdfDownload';

interface DownloadUomsPdfProps {
    uoms: Uom[];
    searchQuery: string;
}

const DownloadUomsPdf: React.FC<DownloadUomsPdfProps> = ({
    uoms,
    searchQuery,
}) => {
    const { download, isGenerating } = usePdfDownload({
        fileName: 'UOMs.pdf',
        confirmMessage: 'Download Units of Measure to PDF?',
        confirm: ConfirmModal,
        confirmOptions: {
            okText: 'Yes, Download',
            cancelText: 'Cancel',
            okColor: 'bg-purple-600 hover:bg-purple-700',
        },
    });

    const handleDownload = () => {
        download(
            <UomsPdfDocument
                uoms={uoms}
                totalCount={uoms.length}
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
            {isGenerating ? 'Preparing PDF...' : 'Download PDF'}
        </button>
    );
};

export default DownloadUomsPdf;
