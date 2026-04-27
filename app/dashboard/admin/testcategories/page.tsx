"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { showMessage } from "@/components/MessageModal";
import {
  getTestCategories,
  addTestCategory,
  deleteTestCategory,
  updateTestCategory,
  TestCategory,
} from "./actions";
import AddTestCategoryModal from "./AddTestCategoryModal";
import DeleteTestCategoryModal from "./DeleteTestCategoryModal";
import EditTestCategoryModal from "./EditTestCategoryModal";
import PageGuardWrapper from "@/components/PageGuardWrapper";
import ButtonGuardWrapper from "@/components/ButtonGuardWrapper";
import DownloadTestCategoriesPdf from "./DownloadTestCategoriesPdf";
import ConfirmModal from "@/components/ConfirmModal";
import { downloadTestCategoriesExcel } from "./DownloadTestCategories";

export default function Page() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [testCategories, setTestCategories] = useState<TestCategory[]>([]);
  const [loadingTestCategories, setLoadingTestCategories] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [testCategoryToDelete, setTestCategoryToDelete] =
    useState<TestCategory | null>(null);
  const [testCategoryToEdit, setTestCategoryToEdit] =
    useState<TestCategory | null>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/");
    }
  }, [session, isPending, router]);

  const fetchTestCategories = useCallback(() => {
    getTestCategories()
      .then(setTestCategories)
      .catch(console.error)
      .finally(() => setLoadingTestCategories(false));
  }, []);

  useEffect(() => {
    if (session) {
      fetchTestCategories();
    }
  }, [session, fetchTestCategories]);

  const handleAddTestCategory = async (name: string, description: string) => {
    try {
      await addTestCategory(name, description);
      await showMessage("Test category added successfully!");
      fetchTestCategories();
    } catch (error) {
      console.error(error);
      await showMessage("Failed to add test category.");
    }
  };

  const handleDeleteTestCategory = async (id: number) => {
    try {
      await deleteTestCategory(id);
      await showMessage("Test category deleted successfully!");
      fetchTestCategories();
    } catch (error) {
      console.error(error);
      await showMessage("Failed to delete test category.");
    }
  };

  const handleEditTestCategory = async (
    id: number,
    name: string,
    description: string,
  ) => {
    try {
      await updateTestCategory(id, name, description);
      await showMessage("Test category updated successfully!");
      fetchTestCategories();
    } catch (error) {
      console.error(error);
      await showMessage("Failed to update test category.");
    }
  };

  if (isPending || !session) {
    return <div className="p-6">Loading...</div>;
  }

  const filteredTestCategories = testCategories.filter(
    (tc) =>
      tc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tc.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDownloadExcel = async () => {
    const confirmed = await ConfirmModal("Download Test Categories to Excel?", {
      okText: "Yes, Download",
      cancelText: "Cancel",
      okColor: "bg-green-600 hover:bg-green-700",
    });

    if (!confirmed) return;

    const filtered = testCategories.filter(
      (category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    downloadTestCategoriesExcel(filtered);
  };

  return (
    <PageGuardWrapper requiredRoles={["ADMINISTRATOR"]}>
      <div className="space-y-4">
        {/* Header & Controls */}
        <div className="flex items-center justify-between gap-x-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h1 className="text-xl font-bold text-gray-900 whitespace-nowrap">
            Test Category Management
          </h1>

          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search test categories..."
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

          <div className="flex gap-2">
            <ButtonGuardWrapper
              requiredRoles={[
                "ADMINISTRATOR",
                "USERS_CANDOWNLOADROLES",
                "ROLES_CANDOWNLOADEXCEL",
              ]}
            >
              <button
                onClick={handleDownloadExcel}
                className="rounded-md bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors shadow-sm whitespace-nowrap"
              >
                Download Excel
              </button>
            </ButtonGuardWrapper>
            <ButtonGuardWrapper
              requiredRoles={[
                "ADMINISTRATOR",
                "USERS_CANPRINTROLES",
                "ROLES_CANDOWNLOADPDF",
              ]}
            >
              <DownloadTestCategoriesPdf
                categories={filteredTestCategories}
                searchQuery={searchQuery}
              />
            </ButtonGuardWrapper>
          </div>

          <ButtonGuardWrapper requiredRoles={["ADMINISTRATOR"]}>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
            >
              + Add Test Category
            </button>
          </ButtonGuardWrapper>
        </div>

        <ButtonGuardWrapper requiredRoles={["ADMINISTRATOR"]}>
          <AddTestCategoryModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAdd={handleAddTestCategory}
          />
        </ButtonGuardWrapper>

        <ButtonGuardWrapper requiredRoles={["ADMINISTRATOR"]}>
          <DeleteTestCategoryModal
            isOpen={!!testCategoryToDelete}
            onClose={() => setTestCategoryToDelete(null)}
            onDelete={handleDeleteTestCategory}
            testCategory={testCategoryToDelete}
          />
        </ButtonGuardWrapper>

        <ButtonGuardWrapper requiredRoles={["ADMINISTRATOR"]}>
          <EditTestCategoryModal
            isOpen={!!testCategoryToEdit}
            onClose={() => setTestCategoryToEdit(null)}
            onEdit={handleEditTestCategory}
            testCategory={testCategoryToEdit}
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
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 print:hidden">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTestCategories.map((tc, index) => (
                <tr
                  key={tc.id}
                  className="even:bg-gray-50/80 hover:bg-blue-50/50 transition-colors"
                >
                  <td className="px-4 py-2 text-sm">{index + 1}</td>
                  <td className="px-4 py-2 text-sm">{tc.name}</td>
                  <td className="px-4 py-2 text-sm">{tc.description}</td>
                  <td className="px-6 py-2 text-sm space-x-4 print:hidden">
                    <ButtonGuardWrapper requiredRoles={["ADMINISTRATOR"]}>
                      <button
                        onClick={() => setTestCategoryToEdit(tc)}
                        className="rounded bg-amber-500 px-3 py-1 text-white hover:bg-amber-600 disabled:opacity-50"
                      >
                        Edit
                      </button>
                    </ButtonGuardWrapper>

                    <ButtonGuardWrapper requiredRoles={["ADMINISTRATOR"]}>
                      <button
                        onClick={() => setTestCategoryToDelete(tc)}
                        className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </ButtonGuardWrapper>
                  </td>
                </tr>
              ))}
              {!loadingTestCategories &&
                filteredTestCategories.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-4 text-center text-gray-500"
                    >
                      No test categories found.
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>

        <div className="mt-2 text-sm text-gray-700">
          Showing {filteredTestCategories.length} of {testCategories.length}{" "}
          test categories
        </div>
      </div>
    </PageGuardWrapper>
  );
}
