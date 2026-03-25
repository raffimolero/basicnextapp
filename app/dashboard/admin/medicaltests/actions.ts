"use server";

import { query } from "@/lib/db";

export interface MedicalTest {
  id: number;
  name: string;
  description: string;
  uomName: string;
  categoryName: string;
  normalmin: number;
  normalmax: number;
  iduom: number;
  idcategory: number;
}

export async function getMedicalTests(): Promise<MedicalTest[]> {
  const { rows } = await query<MedicalTest>(`
    SELECT 
      mt.id, 
      mt.name, 
      mt.description, 
      u.name as "uomName",
      tc.name as "categoryName",
      mt.normalmin,
      mt.normalmax,
      mt.iduom,
      mt.idcategory
    FROM public.medicaltests mt
    LEFT JOIN public.uom u ON mt.iduom = u.id
    LEFT JOIN public.testcategories tc ON mt.idcategory = tc.id
    ORDER BY mt.name ASC
  `);
  return rows;
}

export async function addMedicalTest(
  name: string,
  description: string,
  iduom: number,
  idcategory: number,
  normalmin: number,
  normalmax: number,
): Promise<void> {
  await query(
    "INSERT INTO public.medicaltests (name, description, iduom, idcategory, normalmin, normalmax) VALUES ($1, $2, $3, $4, $5, $6)",
    [name, description, iduom, idcategory, normalmin, normalmax],
  );
}

export async function deleteMedicalTest(id: number): Promise<void> {
  await query("DELETE FROM public.medicaltests WHERE id = $1", [id]);
}

export async function updateMedicalTest(
  id: number,
  name: string,
  description: string,
  iduom: number,
  idcategory: number,
  normalmin: number,
  normalmax: number,
): Promise<void> {
  await query(
    "UPDATE public.medicaltests SET name = $2, description = $3, iduom = $4, idcategory = $5, normalmin = $6, normalmax = $7 WHERE id = $1",
    [id, name, description, iduom, idcategory, normalmin, normalmax],
  );
}
