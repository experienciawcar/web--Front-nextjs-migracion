/** Departamento tal como lo entrega GET /departaments/. */
export type DepartmentDto = {
  id: number;
  name: string;
};

export type Department = { id: string; name: string };

/** Ciudad tal como la entrega GET /departaments/:id/. */
export type CityDto = {
  id: number;
  city: string;
  departament: number;
};

export type City = { id: string; name: string };
