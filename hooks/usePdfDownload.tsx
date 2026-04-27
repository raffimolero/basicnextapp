'use client';

import { useState } from 'react';
import { pdf, DocumentProps } from '@react-pdf/renderer';
import React from 'react';

interface UsePdfDownloadOptions {
    fileName: string;
    confirmMessage: string;
    confirmOptions?: {
        okText?: string;
        cancelText?: string;
        okColor?: string;
    };
    confirm: (message: string, options?: any) => Promise<boolean>;
}

export function usePdfDownload({
    fileName,
    confirmMessage,
    confirmOptions,
    confirm,
}: UsePdfDownloadOptions) {
    const [isGenerating, setIsGenerating] = useState(false);

    const download = async (pdfDoc: React.ReactElement<DocumentProps>) => {
        const confirmed = await confirm(confirmMessage, confirmOptions);
        if (!confirmed) return;

        setIsGenerating(true);

        try {
            const blob = await pdf(pdfDoc).toBlob();

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');

            a.href = url;
            a.download = fileName;

            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } finally {
            setIsGenerating(false);
        }
    };

    return { download, isGenerating };
}
