import { apiUrl } from "@/modules/shared/services/api";

import type { City, CityDto, Department, DepartmentDto } from "../types/department";

const REVALIDATE_SECONDS = 60 * 60;

/** Departamentos para el select "¿En qué departamento está matriculado el carro?" (GET /departaments/). */
export async function getDepartments(): Promise<Department[]> {
  const url = apiUrl("/departaments/");

  try {
    const response = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!response.ok) throw new Error(`GET ${url} respondió ${response.status}`);
    const departments: DepartmentDto[] = await response.json();

    return departments
      .map((dto) => ({ id: String(dto.id), name: dto.name?.trim() ?? "" }))
      .filter((department) => department.name)
      .sort((a, b) => a.name.localeCompare(b.name, "es"));
  } catch (error) {
    console.error("No se pudieron cargar los departamentos:", error);
    return [];
  }
}

/**
 * Ciudades de un departamento (GET /departaments/:id/), para el select "¿En
 * qué ciudad está matriculado el carro?", que se pide de nuevo cada vez que
 * cambia el departamento elegido.
 */
export async function getCitiesByDepartment(departmentId: string): Promise<City[]> {
  const url = apiUrl(`/departaments/${departmentId}/`);

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`GET ${url} respondió ${response.status}`);
    const cities: CityDto[] = await response.json();

    return cities
      .map((dto) => ({ id: String(dto.id), name: dto.city?.trim() ?? "" }))
      .filter((city) => city.name)
      .sort((a, b) => a.name.localeCompare(b.name, "es"));
  } catch (error) {
    console.error("No se pudieron cargar las ciudades:", error);
    return [];
  }
}
