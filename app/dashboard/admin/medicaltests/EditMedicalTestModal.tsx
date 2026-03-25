"use client";

import { useState, useRef, useEffect } from "react";
import { X, GripHorizontal } from "lucide-react";
import { MedicalTest } from "./actions";
import { Uom } from "../uom/actions";
import { TestCategory } from "../testcategories/actions";

interface EditMedicalTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (
    id: number,
    name: string,
    description: string,
    iduom: number,
    idcategory: number,
    normalmin: number,
    normalmax: number,
  ) => Promise<void>;
  medicalTest: MedicalTest | null;
  uoms: Uom[];
  testCategories: TestCategory[];
}

export default function EditMedicalTestModal({
  isOpen,
  onClose,
  onEdit,
  medicalTest,
  uoms,
  testCategories,
}: EditMedicalTestModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [iduom, setIduom] = useState<number>(0);
  const [idcategory, setIdcategory] = useState<number>(0);
  const [normalmin, setNormalmin] = useState<number>(0);
  const [normalmax, setNormalmax] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCapsLock, setIsCapsLock] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  // Draggable state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const currentTranslate = useRef({ x: 0, y: 0 });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && medicalTest) {
      setName(medicalTest.name);
      setDescription(medicalTest.description);
      setIduom(medicalTest.iduom);
      setIdcategory(medicalTest.idcategory);
      setNormalmin(medicalTest.normalmin);
      setNormalmax(medicalTest.normalmax);
      setIsCapsLock(false);
      // Center the modal initially or reset position
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, medicalTest]);

  const checkCaps = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (e.getModifierState) {
      setIsCapsLock(e.getModifierState("CapsLock"));
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicalTest || !name.trim() || iduom === 0 || idcategory === 0) return;

    setIsSubmitting(true);
    try {
      await onEdit(
        medicalTest.id,
        name,
        description,
        iduom,
        idcategory,
        normalmin,
        normalmax,
      );
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
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
          className="bg-amber-500 px-4 py-3 border-b flex items-center justify-between cursor-move select-none"
          onMouseDown={onMouseDown}
        >
          <div className="flex items-center gap-2 text-white font-semibold">
            <GripHorizontal size={20} className="text-white/70" />
            <span>Edit Medical Test</span>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-1 rounded hover:bg-amber-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input
              ref={nameRef}
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
              placeholder="e.g. Fasting Blood Glucose"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyUp={checkCaps}
              onKeyDown={(e) => {
                checkCaps(e);
                if (e.key === "Enter") {
                  e.preventDefault();
                  submitBtnRef.current?.focus();
                }
              }}
              onClick={checkCaps}
              autoFocus
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all resize-none h-24"
              placeholder="Describe the medical test..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyUp={checkCaps}
              onKeyDown={(e) => {
                checkCaps(e);
                if (e.key === "Enter") {
                  e.preventDefault();
                  submitBtnRef.current?.focus();
                }
              }}
              onClick={checkCaps}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Unit of Measure
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
              value={iduom}
              onChange={(e) => setIduom(Number(e.target.value))}
              required
            >
              {uoms.map((uom) => (
                <option key={uom.id} value={uom.id}>
                  {uom.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Test Category
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
              value={idcategory}
              onChange={(e) => setIdcategory(Number(e.target.value))}
              required
            >
              {testCategories.map((tc) => (
                <option key={tc.id} value={tc.id}>
                  {tc.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Normal Min
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                value={normalmin}
                onChange={(e) => setNormalmin(Number(e.target.value))}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Normal Max
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                value={normalmax}
                onChange={(e) => setNormalmax(Number(e.target.value))}
                required
              />
            </div>
          </div>

          {/* Caps Lock Indicator */}
          <div className="h-6 flex items-center justify-center text-[10px] font-bold">
            {isCapsLock ? (
              <div className="flex items-center gap-2 text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200 animate-pulse">
                ⚠️ CAPS LOCK IS ON
              </div>
            ) : (
              <span className="text-gray-300 font-normal uppercase tracking-wider">
                CAPSLOCK Detection Active
              </span>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              ref={submitBtnRef}
              type="submit"
              disabled={
                isSubmitting || !name.trim() || iduom === 0 || idcategory === 0
              }
              className="px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
