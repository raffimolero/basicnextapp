"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { showMessage } from "@/components/MessageModal";
import {
  getMedicalTests,
  addMedicalTest,
  updateMedicalTest,
  deleteMedicalTest,
  getUoms,
  getCategories,
  MedicalTest,
} from "./actions";
import PageGuardWrapper from "@/components/PageGuardWrapper";
import ButtonGuardWrapper from "@/components/ButtonGuardWrapper";

export default function Page() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [tests, setTests] = useState<MedicalTest[]>([]);
  const [uoms, setUoms] = useState<{ id: number; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editing, setEditing] = useState<MedicalTest | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [iduom, setIduom] = useState<number | null>(null);
  const [idcategory, setIdcategory] = useState<number | null>(null);
  const [normalmin, setNormalmin] = useState<string>("");
  const [normalmax, setNormalmax] = useState<string>("");

  const fetchAll = useCallback(() => {
    Promise.all([getMedicalTests(), getUoms(), getCategories()])
      .then(([testsData, uomData, catData]) => {
        setTests(testsData);
        setUoms(uomData);
        setCategories(catData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!isPending && !session) router.push("/");
  }, [session, isPending, router]);

  useEffect(() => {
    if (session) fetchAll();
  }, [session, fetchAll]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setIduom(null);
    setIdcategory(null);
    setNormalmin("");
    setNormalmax("");
    setEditing(null);
    setIsAddOpen(false);
  };

  const openEdit = (item: MedicalTest) => {
    setEditing(item);
    setName(item.name);
    setDescription(item.description || "");
    setIduom(item.iduom);
    setIdcategory(item.idcategory);
    setNormalmin(item.normalmin?.toString() || "");
    setNormalmax(item.normalmax?.toString() || "");
    setIsAddOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (!name.trim()) {
        await showMessage("Name is required.");
        return;
      }
      if (iduom === null || idcategory === null) {
        await showMessage("UOM and category are required.");
        return;
      }
      const payload = {
        name: name.trim(),
        description: description.trim(),
        iduom,
        idcategory,
        normalmin: normalmin ? Number(normalmin) : null,
        normalmax: normalmax ? Number(normalmax) : null,
      };

      if (editing) {
        await updateMedicalTest({ id: editing.id, ...payload });
        await showMessage("Medical test updated.");
      } else {
        await addMedicalTest(payload as any);
        await showMessage("Medical test added.");
      }
      resetForm();
      fetchAll();
    } catch (error) {
      console.error(error);
      await showMessage("Failed to save medical test.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMedicalTest(id);
      await showMessage("Medical test deleted.");
      fetchAll();
    } catch (error) {
      console.error(error);
      await showMessage("Failed to delete medical test.");
    }
  };

  if (isPending || !session) return <div className="p-6">Loading...</div>;

  const filtered = tests.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description?.toLowerCase() ?? "").includes(
        searchQuery.toLowerCase(),
      ) ||
      (t.uom_name?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()) ||
      (t.category_name?.toLowerCase() ?? "").includes(
        searchQuery.toLowerCase(),
      ),
  );

  return (
    <PageGuardWrapper requiredRoles={["ADMINISTRATOR"]}>
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h1 className="text-xl font-bold">Medical Tests</h1>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tests..."
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
                + Add Test
              </button>
            </ButtonGuardWrapper>
          </div>
        </div>

        {isAddOpen && (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h2 className="font-semibold mb-2">
              {editing ? "Edit Medical Test" : "Add Medical Test"}
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

              <select
                value={iduom ?? ""}
                onChange={(e) => setIduom(Number(e.target.value))}
                className="rounded border px-3 py-2"
              >
                <option value="">Select UOM</option>
                {uoms.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>

              <select
                value={idcategory ?? ""}
                onChange={(e) => setIdcategory(Number(e.target.value))}
                className="rounded border px-3 py-2"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={normalmin}
                onChange={(e) => setNormalmin(e.target.value)}
                placeholder="Normal Min"
                className="rounded border px-3 py-2"
              />
              <input
                type="number"
                value={normalmax}
                onChange={(e) => setNormalmax(e.target.value)}
                placeholder="Normal Max"
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
                onClick={resetForm}
                className="rounded bg-gray-200 px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="max-h-[calc(100vh-280px)] overflow-auto rounded border bg-white shadow">
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
                  Category
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase">
                  UOM
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase">
                  Normal Range
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
                  <td className="px-4 py-2 text-sm">
                    {item.category_name || "-"}
                  </td>
                  <td className="px-4 py-2 text-sm">{item.uom_name || "-"}</td>
                  <td className="px-4 py-2 text-sm">
                    {item.normalmin ?? "-"} - {item.normalmax ?? "-"}
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

        <div className="text-sm text-gray-700">
          Showing {filtered.length} of {tests.length} medical tests
        </div>
      </div>
    </PageGuardWrapper>
  );
}
