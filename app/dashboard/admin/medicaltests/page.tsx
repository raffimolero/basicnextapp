"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { showMessage } from "@/components/MessageModal";
import {
  getMedicalTests,
  addMedicalTest,
  deleteMedicalTest,
  updateMedicalTest,
  MedicalTest,
} from "./actions";
import { getUoms, Uom } from "../uom/actions";
import { getTestCategories, TestCategory } from "../testcategories/actions";
import AddMedicalTestModal from "./AddMedicalTestModal";
import DeleteMedicalTestModal from "./DeleteMedicalTestModal";
import EditMedicalTestModal from "./EditMedicalTestModal";
import PageGuardWrapper from "@/components/PageGuardWrapper";
import ButtonGuardWrapper from "@/components/ButtonGuardWrapper";

export default function Page() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [medicalTests, setMedicalTests] = useState<MedicalTest[]>([]);
  const [loadingMedicalTests, setLoadingMedicalTests] = useState(true);
  const [uoms, setUoms] = useState<Uom[]>([]);
  const [testCategories, setTestCategories] = useState<TestCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [medicalTestToDelete, setMedicalTestToDelete] =
    useState<MedicalTest | null>(null);
  const [medicalTestToEdit, setMedicalTestToEdit] =
    useState<MedicalTest | null>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/");
    }
  }, [session, isPending, router]);

  const fetchMedicalTests = useCallback(() => {
    getMedicalTests()
      .then(setMedicalTests)
      .catch(console.error)
      .finally(() => setLoadingMedicalTests(false));
  }, []);

  const fetchUoms = useCallback(() => {
    getUoms().then(setUoms).catch(console.error);
  }, []);

  const fetchTestCategories = useCallback(() => {
    getTestCategories().then(setTestCategories).catch(console.error);
  }, []);

  useEffect(() => {
    if (session) {
      fetchMedicalTests();
      fetchUoms();
      fetchTestCategories();
    }
  }, [session, fetchMedicalTests, fetchUoms, fetchTestCategories]);

  const handleAddMedicalTest = async (
    name: string,
    description: string,
    iduom: number,
    idcategory: number,
    normalmin: number,
    normalmax: number,
  ) => {
    try {
      await addMedicalTest(
        name,
        description,
        iduom,
        idcategory,
        normalmin,
        normalmax,
      );
      await showMessage("Medical test added successfully!");
      fetchMedicalTests();
    } catch (error) {
      console.error(error);
      await showMessage("Failed to add medical test.");
    }
  };

  const handleDeleteMedicalTest = async (id: number) => {
    try {
      await deleteMedicalTest(id);
      await showMessage("Medical test deleted successfully!");
      fetchMedicalTests();
    } catch (error) {
      console.error(error);
      await showMessage("Failed to delete medical test.");
    }
  };

  const handleEditMedicalTest = async (
    id: number,
    name: string,
    description: string,
    iduom: number,
    idcategory: number,
    normalmin: number,
    normalmax: number,
  ) => {
    try {
      await updateMedicalTest(
        id,
        name,
        description,
        iduom,
        idcategory,
        normalmin,
        normalmax,
      );
      await showMessage("Medical test updated successfully!");
      fetchMedicalTests();
    } catch (error) {
      console.error(error);
      await showMessage("Failed to update medical test.");
    }
  };

  if (isPending || !session) {
    return <div className="p-6">Loading...</div>;
  }

  const filteredMedicalTests = medicalTests.filter(
    (mt) =>
      mt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mt.uomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mt.categoryName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <PageGuardWrapper requiredRoles={["ADMINISTRATOR"]}>
      <div className="space-y-4">
        {/* Header & Controls */}
        <div className="flex items-center justify-between gap-x-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h1 className="text-xl font-bold text-gray-900 whitespace-nowrap">
            Medical Test Management
          </h1>

          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search medical tests..."
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold"
              onClick={() => setSearchQuery("")}
            >
              Clear
            </button>
          </div>

          <ButtonGuardWrapper requiredRoles={["ADMINISTRATOR"]}>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
            >
              + Add Medical Test
            </button>
          </ButtonGuardWrapper>
        </div>

        <ButtonGuardWrapper requiredRoles={["ADMINISTRATOR"]}>
          <AddMedicalTestModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAdd={handleAddMedicalTest}
            uoms={uoms}
            testCategories={testCategories}
          />
        </ButtonGuardWrapper>

        <ButtonGuardWrapper requiredRoles={["ADMINISTRATOR"]}>
          <DeleteMedicalTestModal
            isOpen={!!medicalTestToDelete}
            onClose={() => setMedicalTestToDelete(null)}
            onDelete={handleDeleteMedicalTest}
            medicalTest={medicalTestToDelete}
          />
        </ButtonGuardWrapper>

        <ButtonGuardWrapper requiredRoles={["ADMINISTRATOR"]}>
          <EditMedicalTestModal
            isOpen={!!medicalTestToEdit}
            onClose={() => setMedicalTestToEdit(null)}
            onEdit={handleEditMedicalTest}
            medicalTest={medicalTestToEdit}
            uoms={uoms}
            testCategories={testCategories}
          />
        </ButtonGuardWrapper>

        {/* Table */}
        <div className="max-h-[calc(100vh-260px)] overflow-auto rounded border bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Row #
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  UOM
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Normal Range
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 print:hidden">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMedicalTests.map((mt, index) => (
                <tr
                  key={mt.id}
                  className="even:bg-gray-50/80 hover:bg-blue-50/50 transition-colors"
                >
                  <td className="px-4 py-2 text-sm">{index + 1}</td>
                  <td className="px-4 py-2 text-sm">{mt.name}</td>
                  <td className="px-4 py-2 text-sm">{mt.description}</td>
                  <td className="px-4 py-2 text-sm">{mt.uomName}</td>
                  <td className="px-4 py-2 text-sm">{mt.categoryName}</td>
                  <td className="px-4 py-2 text-sm">
                    {mt.normalmin} - {mt.normalmax}
                  </td>
                  <td className="px-6 py-2 text-sm space-x-4 print:hidden">
                    <ButtonGuardWrapper requiredRoles={["ADMINISTRATOR"]}>
                      <button
                        onClick={() => setMedicalTestToEdit(mt)}
                        className="rounded bg-amber-500 px-3 py-1 text-white hover:bg-amber-600 disabled:opacity-50"
                      >
                        Edit
                      </button>
                    </ButtonGuardWrapper>

                    <ButtonGuardWrapper requiredRoles={["ADMINISTRATOR"]}>
                      <button
                        onClick={() => setMedicalTestToDelete(mt)}
                        className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </ButtonGuardWrapper>
                  </td>
                </tr>
              ))}
              {!loadingMedicalTests && filteredMedicalTests.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    No medical tests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-2 text-sm text-gray-700">
          Showing {filteredMedicalTests.length} of {medicalTests.length} medical
          tests
        </div>
      </div>
    </PageGuardWrapper>
  );
}
