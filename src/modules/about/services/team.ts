import { apiUrl } from "@/modules/shared/services/api";

import type { AdvisorDto, SedeDto, Team, TeamMember } from "../types/team";

/** Cargo por defecto cuando el backend no trae `job_title`. */
const DEFAULT_ROLE = "Asesor de ventas";

/**
 * Cada cuánto se vuelve a pedir el equipo. Las URLs de las fotos son firmadas y
 * caducan a las 24 h (X-Goog-Expires=86400), y la página con esas URLs queda
 * cacheada, así que esto tiene que ser bastante menor: con una hora hay margen.
 * Ojo: si la página se queda sin visitas más de 24 h, la primera visita todavía
 * recibe la versión vieja (con las fotos caducadas) mientras se regenera.
 */
const REVALIDATE_SECONDS = 60 * 60;

async function fetchList<T>(path: string): Promise<T[]> {
  const url = apiUrl(path);
  const response = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!response.ok) {
    throw new Error(`GET ${url} respondió ${response.status}`);
  }
  return response.json();
}

function toTeamMember(advisor: AdvisorDto): TeamMember {
  return {
    id: advisor.id,
    name: advisor.name_full.trim().replace(/\s+/g, " "),
    role: advisor.job_title?.trim() || DEFAULT_ROLE,
    description: advisor.description?.trim() ?? "",
    photoUrl: advisor.image || null,
    sedeId: advisor.sede ?? null,
  };
}

/**
 * Equipo para la sección "Nuestro Equipo": los asesores de GET /api/advisors/
 * y, para las pestañas, las sedes de GET /api/sedes/.
 *
 * Las pestañas solo existen si los asesores dicen a qué sede pertenecen (campo
 * `sede`, que el backend todavía no manda: ver `AdvisorDto`). Sin eso se
 * devuelven todos los asesores y ninguna sede, y `/sedes/` ni se pide. Con eso:
 *   - solo cuentan las sedes activas que tienen al menos un asesor;
 *   - un asesor sin sede o con una sede que no aparece no sale en ninguna
 *     pestaña, y se avisa en el log.
 *
 * Si el backend falla no se cae la página: sin asesores devuelve el equipo
 * vacío (y la sección no se pinta), y sin sedes devuelve los asesores sin
 * pestañas. El error queda en el log del servidor.
 */
export async function getTeam(): Promise<Team> {
  let members: TeamMember[];
  try {
    members = (await fetchList<AdvisorDto>("/advisors/")).map(toTeamMember);
  } catch (error) {
    console.error("No se pudo cargar el equipo:", error);
    return { sedes: [], members: [] };
  }

  if (!members.some((member) => member.sedeId !== null)) {
    return { sedes: [], members };
  }

  try {
    const sedes = (await fetchList<SedeDto>("/sedes/"))
      .filter((sede) => sede.active && members.some((member) => member.sedeId === sede.id))
      .map(({ id, name }) => ({ id, name: name.trim() }));

    const sinPestana = members.filter(
      (member) => !sedes.some((sede) => sede.id === member.sedeId),
    );
    if (sinPestana.length > 0) {
      console.warn(
        `Asesores que no salen en ninguna pestaña por no tener sede activa: ${sinPestana
          .map((member) => member.name)
          .join(", ")}`,
      );
    }

    return { sedes, members };
  } catch (error) {
    console.error("No se pudieron cargar las sedes; el equipo va sin pestañas:", error);
    return { sedes: [], members };
  }
}
