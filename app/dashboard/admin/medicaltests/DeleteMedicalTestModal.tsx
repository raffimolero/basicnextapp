"use client";

import { useState, useRef, useEffect } from "react";
import { X, GripHorizontal } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";
import { MedicalTest } from "./actions";

interface DeleteMedicalTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: number) => Promise<void>;
  medicalTest: MedicalTest | null;
}

export default function DeleteMedicalTestModal({
  isOpen,
  onClose,
  onDelete,
  medicalTest,
}: DeleteMedicalTestModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  // Draggable state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const currentTranslate = useRef({ x: 0, y: 0 });

  // Reset modal when opened
  useEffect(() => {
    if (isOpen) {
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  // Handle Dragging
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    const newX = currentTranslate.current.x + dx;
    const newY = currentTranslate.current.y + dy;
    setPosition({ x: newX, y: newY });
  };

  const onMouseUp = (e: MouseEvent) => {
    if (isDragging.current) {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      currentTranslate.current = {
        x: currentTranslate.current.x + dx,
        y: currentTranslate.current.y + dy,
      };
      isDragging.current = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }
  };

  const handleDelete = async () => {
    if (!medicalTest) return;

    const confirmed = await ConfirmModal(
      `Are you sure you want to delete medical test "${medicalTest.name}"?`,
      {
        okText: "Yes, Delete",
        cancelText: "Cancel",
        okColor: "bg-red-600 hover:bg-red-700",
      },
    );

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await onDelete(medicalTest.id);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen || !medicalTest) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        ref={modalRef}
        className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col"
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      >
        {/* Header - Draggable Area */}
        <div
          className="bg-red-500 px-4 py-3 border-b flex items-center justify-between cursor-move select-none"
          onMouseDown={onMouseDown}
        >
          <div className="flex items-center gap-2 text-white font-semibold">
            <GripHorizontal size={20} className="text-white/70" />
            <span>Delete Medical Test</span>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-1 rounded hover:bg-red-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-500 outline-none cursor-not-allowed"
              value={medicalTest.name}
              disabled
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-500 outline-none resize-none h-24 cursor-not-allowed"
              value={medicalTest.description}
              disabled
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Unit of Measure
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-500 outline-none cursor-not-allowed"
              value={medicalTest.uomName}
              disabled
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Test Category
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-500 outline-none cursor-not-allowed"
              value={medicalTest.categoryName}
              disabled
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Normal Min
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-500 outline-none cursor-not-allowed"
                value={medicalTest.normalmin}
                disabled
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Normal Max
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-500 outline-none cursor-not-allowed"
                value={medicalTest.normalmax}
                disabled
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
