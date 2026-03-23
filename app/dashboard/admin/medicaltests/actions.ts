"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface MedicalTest {
  id: number;
  name: string;
  description: string | null;
  iduom: number;
  idcategory: number;
  normalmin: number | null;
  normalmax: number | null;
  uom_name: string | null;
  category_name: string | null;
}

export async function getMedicalTests(): Promise<MedicalTest[]> {
  const { rows } = await query<MedicalTest>(
    `SELECT m.id, m.name, m.description, m.iduom, m.idcategory, m.normalmin, m.normalmax,
      u.name AS uom_name, c.name AS category_name
     FROM public.medicaltests m
     LEFT JOIN public.uom u ON m.iduom = u.id
     LEFT JOIN public.testcategories c ON m.idcategory = c.id
     ORDER BY m.id ASC`,
  );
  return rows;
}

export async function addMedicalTest(data: {
  name: string;
  description: string;
  iduom: number;
  idcategory: number;
  normalmin: number | null;
  normalmax: number | null;
}): Promise<void> {
  await query(
    `INSERT INTO public.medicaltests (name, description, iduom, idcategory, normalmin, normalmax)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      data.name,
      data.description || null,
      data.iduom,
      data.idcategory,
      data.normalmin || null,
      data.normalmax || null,
    ],
  );
  revalidatePath("/medical/medicaltests");
}

export async function updateMedicalTest(data: {
  id: number;
  name: string;
  description: string;
  iduom: number;
  idcategory: number;
  normalmin: number | null;
  normalmax: number | null;
}): Promise<void> {
  await query(
    `UPDATE public.medicaltests SET
       name = $2,
       description = $3,
       iduom = $4,
       idcategory = $5,
       normalmin = $6,
       normalmax = $7
     WHERE id = $1`,
    [
      data.id,
      data.name,
      data.description || null,
      data.iduom,
      data.idcategory,
      data.normalmin || null,
      data.normalmax || null,
    ],
  );
  revalidatePath("/medical/medicaltests");
}

export async function deleteMedicalTest(id: number): Promise<void> {
  await query("DELETE FROM public.medicaltests WHERE id = $1", [id]);
  revalidatePath("/medical/medicaltests");
}

export async function getUoms(): Promise<{ id: number; name: string }[]> {
  const { rows } = await query<{ id: number; name: string }>(
    "SELECT id, name FROM public.uom ORDER BY name ASC",
  );
  return rows;
}

export async function getCategories(): Promise<{ id: number; name: string }[]> {
  const { rows } = await query<{ id: number; name: string }>(
    "SELECT id, name FROM public.testcategories ORDER BY name ASC",
  );
  return rows;
}
