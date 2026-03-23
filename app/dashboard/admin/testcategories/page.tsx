"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { showMessage } from "@/components/MessageModal";
import {
  getTestCategories,
  addTestCategory,
  updateTestCategory,
  deleteTestCategory,
  TestCategory,
} from "./actions";
import PageGuardWrapper from "@/components/PageGuardWrapper";
import ButtonGuardWrapper from "@/components/ButtonGuardWrapper";

export default function Page() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<TestCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editing, setEditing] = useState<TestCategory | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const fetchCategories = useCallback(() => {
    getTestCategories()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!isPending && !session) router.push("/");
  }, [session, isPending, router]);

  useEffect(() => {
    if (session) fetchCategories();
  }, [session, fetchCategories]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditing(null);
    setIsAddOpen(false);
  };

  const openEdit = (item: TestCategory) => {
    setEditing(item);
    setName(item.name);
    setDescription(item.description || "");
  };

  const handleSubmit = async () => {
    try {
      if (!name.trim()) {
        await showMessage("Name is required.");
        return;
      }
      if (editing) {
        await updateTestCategory(editing.id, name.trim(), description.trim());
        await showMessage("Category updated.");
      } else {
        await addTestCategory(name.trim(), description.trim());
        await showMessage("Category added.");
      }
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error(error);
      await showMessage("Failed to save category.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTestCategory(id);
      await showMessage("Category deleted.");
      fetchCategories();
    } catch (error) {
      console.error(error);
      await showMessage("Failed to delete category.");
    }
  };

  if (isPending || !session) return <div className="p-6">Loading...</div>;

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()),
  );

  return (
    <PageGuardWrapper requiredRoles={["ADMINISTRATOR"]}>
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h1 className="text-xl font-bold">Medical Test Categories</h1>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="rounded border px-3 py-2 text-sm"
            />
            <button
              onClick={() => setSearchQuery("")}
              className="text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>

            <ButtonGuardWrapper requiredRoles={["ADMINISTRATOR"]}>
              <button
                onClick={() => {
                  resetForm();
                  setIsAddOpen(true);
                }}
                className="rounded bg-blue-600 px-4 py-2 text-white"
              >
                + Add Category
              </button>
            </ButtonGuardWrapper>
          </div>
        </div>

        {(isAddOpen || editing) && (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h2 className="font-semibold mb-2">
              {editing ? "Edit Category" : "Add Category"}
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="rounded border px-3 py-2"
              />
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="rounded border px-3 py-2"
              />
            </div>
            <div className="mt-3 space-x-2">
              <button
                onClick={handleSubmit}
                className="rounded bg-green-600 px-4 py-2 text-white"
              >
                Save
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setIsAddOpen(false);
                }}
                className="rounded bg-gray-200 px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="max-h-[calc(100vh-270px)] overflow-auto rounded border bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase">
                  #
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase">
                  Description
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((item, index) => (
                <tr key={item.id}>
                  <td className="px-4 py-2 text-sm">{index + 1}</td>
                  <td className="px-4 py-2 text-sm">{item.name}</td>
                  <td className="px-4 py-2 text-sm">
                    {item.description || "-"}
                  </td>
                  <td className="px-4 py-2 text-sm space-x-2">
                    <button
                      onClick={() => openEdit(item)}
                      className="rounded bg-amber-500 px-2 py-1 text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="rounded bg-red-500 px-2 py-1 text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="text-sm text-gray-700">
          Showing {filtered.length} of {categories.length} categories
        </div>
      </div>
    </PageGuardWrapper>
  );
}
