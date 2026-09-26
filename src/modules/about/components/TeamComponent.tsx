import SectionEyebrowComponent from "@/modules/shared/components/SectionEyebrowComponent";

import { getTeam } from "../services/team";
import TeamCarouselComponent from "./TeamCarouselComponent";

/**
 * Sección "Nuestro Equipo": las personas de GET /api/advisors/, con pestañas
 * por sede y carrusel. La parte interactiva vive en TeamCarouselComponent; aquí
 * queda el encabezado y la carga de datos, que es lo que se resuelve en el
 * servidor.
 *
 * Las pestañas por sede dependen de que el backend diga a qué sede pertenece
 * cada asesor, y hoy no lo dice (ver `AdvisorDto`). Mientras tanto la sección
 * sale sin pestañas, con todos los asesores.
 *
 * Diseño en Figma: los mismos frames de Sobre Nosotros. Se maquetó desde
 * capturas, sin acceso a Figma, así que hay que compararlo:
 * TODO: confirmar medidas y tipografía de la tarjeta y de los controles, y el
 * diseño mobile.
 *
 * Si no hay asesores, la sección no se pinta.
 */
export default async function TeamComponent() {
  const { sedes, members } = await getTeam();

  if (members.length === 0) return null;

  return (
    // El `overflow-x-clip` recoge lo que sangra a la derecha (las rayas de
    // adorno del carrusel): 100vw incluye la barra de scroll de la ventana.
    <section aria-labelledby="team-title" className="overflow-x-clip">
      <div className="container-wcar py-16 xl:py-24">
        <div className="flex flex-col gap-6 xl:gap-3">
          {/* Texto de relleno: en Figma sigue con lorem ipsum, el mismo de
              Misión & visión.
              TODO: falta el copy real. */}
          <SectionEyebrowComponent>Nibh quisque suscipit fermentum</SectionEyebrowComponent>
          <h2 id="team-title" className="text-subheadline-1 font-bold text-dark-gray">
            Nuestro Equipo
          </h2>
        </div>

        <TeamCarouselComponent sedes={sedes} members={members} />
      </div>
    </section>
  );
}
