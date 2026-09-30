import Image from "next/image";

import arrowCircle from "@/modules/shared/assets/icons/arrow-circle.svg";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import DiagonalLinesComponent from "@/modules/shared/components/DiagonalLinesComponent";
import SideLabelComponent from "@/modules/shared/components/SideLabelComponent";
import ZigZagComponent from "@/modules/shared/components/ZigZagComponent";
import { ROUTES } from "@/modules/shared/constants/routes";

import iconGuarantee from "../assets/specs/icon-garantia.svg";
import iconClaimsHelp from "../assets/features/icon-reclamaciones-ayuda.svg";
import iconClaimsAmount from "../assets/features/icon-reclamaciones-monto.svg";
import iconClaimsReported from "../assets/features/icon-reclamaciones-reportadas.svg";
import logoChatGpt from "../assets/features/logo-chatgpt.webp";
import iconPlate from "../assets/features/generico.webp";
import type { VehicleDetail, VehicleFeature } from "../types/vehicle-detail";

import VehicleAiDescriptionComponent from "./VehicleAiDescriptionComponent";
import VehicleEvaluationComponent from "./VehicleEvaluationComponent";

/** Color de las líneas del acordeón: el azul grisáceo del borde de la tarjeta de evaluación (Figma 89:4826). */
const LINE = "border-[#c2d3ed]";

const CLAIMS_EXPLANATION = [
  "En nuestro compromiso con la transparencia, proporcionamos detalles sobre las reclamaciones o accidentes reportados por las aseguradoras.",
  "¿Qué es una reclamación de menor cuantía o pérdida parcial? Una reclamación de menor cuantía ocurre cuando el costo de reparar o reemplazar partes del vehículo no excede el 75% del valor asegurado.",
  "Una pérdida total se produce cuando las reparaciones de los daños de un vehículo superan el 75% de su valor asegurable.",
  "Un auto recuperado es aquel que previamente estaba asegurado, fue robado y el propietario recibió una indemnización por parte de la aseguradora. Sin embargo, posteriormente el vehículo fue recuperado por la aseguradora, lo que resulta en un reporte de recuperación asociado al automóvil. Este evento puede afectar el valor comercial del vehículo.",
];

/** Una fila del acordeón. `<details name>` los agrupa: solo uno abierto a la vez, sin JavaScript. */
function AccordionItem({
  title,
  open,
  children,
}: {
  title: React.ReactNode;
  open: boolean;
  children: React.ReactNode;
}) {
  return (
    <details name="vehicle-features" open={open} className="group">
      <summary
        className={`flex cursor-pointer list-none items-center justify-between gap-4 border-b py-[17px] text-[20px] leading-[22px] font-bold text-gray-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange [&::-webkit-details-marker]:hidden ${LINE}`}
      >
        <span className="flex items-center gap-4">{title}</span>
        {/* El "+" gira 45° al abrir y queda como "×" (así lo muestra el diseño). */}
        <svg
          aria-hidden
          viewBox="0 0 13 13"
          className="mr-1 size-[13px] shrink-0 text-dark-gray transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        >
          <path d="M6.5 0.8v11.4M0.8 6.5h11.4" />
        </svg>
      </summary>
      <div className={`border-b pt-8 pb-10 ${LINE}`}>{children}</div>
    </details>
  );
}

function FeatureRow({ feature }: { feature: VehicleFeature }) {
  return (
    <li className="flex items-center gap-3">
      <Image
        src={feature.icon}
        alt=""
        aria-hidden
        className="size-8 shrink-0 object-contain"
      />
      <div className="min-w-0 text-small leading-6 font-medium text-gray-dark">
        <p>{feature.label}</p>
        <p className="font-bold text-dark-gray">{feature.value}</p>
      </div>
    </li>
  );
}

function FeatureGrid({ features }: { features: VehicleFeature[] }) {
  return (
    <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
      {features.map((feature) => (
        <FeatureRow key={feature.label} feature={feature} />
      ))}
    </ul>
  );
}

function WarrantyColumn({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <div className="flex items-center gap-[19px]">
        <Image
          src={iconGuarantee}
          alt=""
          aria-hidden
          className="h-11 w-11 shrink-0 object-contain"
        />
        <div>
          <p className="text-body leading-6 font-medium text-dark-gray">
            {title}
          </p>
          {/* TODO: en el diseño es un enlace a los términos y condiciones; el sitio anterior apuntaba a páginas del CMS (`/Términosycondiciones-garantia-vehículos-usados/65`) que aquí no existen. */}
          <p className="text-small leading-7 font-bold text-orange">
            Aplica términos y condiciones
          </p>
        </div>
      </div>
      <p className="mt-[13px] max-w-[382px] text-body leading-6 font-medium text-gray-dark">
        {text}
      </p>
    </div>
  );
}

/**
 * "Características del vehículo": el bloque oscuro de la izquierda (título, "Quiero conocerlo",
 * rayado y zigzag), el acordeón de datos y la tarjeta "Evaluación del vehículo".
 *
 * Figma 89:4207, en px del lienzo de 1440 con y=1241 en el borde superior de la sección: la barra
 * `dark-gray` de 428 de ancho sangra a la izquierda (baja hasta y=3339, detrás del panel de
 * "Financia tu Vehículo"); el rayado de 13 px en x=0 (49 x 355); la raya turquesa en y=1305, el
 * título de 36/44 en dos renglones ("Características / del vehículo") en y=1333 y el botón
 * "QUIERO CONOCERLO" en y=1453; el zigzag en x=323, acabando en y=2172. El acordeón ocupa x=502 a
 * 1285 (783): títulos de 20/22 Bold `gray-dark`, filas de 56 con una línea de 1 px debajo, el "+"
 * de 13 px a la derecha (el abierto se ve como "×"). Empieza 34 px bajo el borde de la sección y
 * la tarjeta de evaluación 64 px después de la última línea; la sección acaba 70 px más abajo.
 *
 * Contenido (`docs/DETALLE_VEHICULO.md` §2.3): Garantías, Historial (documentación y llaves),
 * Reclamaciones, Características, Seguridad, Accesorios y equipamiento, Comentarios adicionales y
 * la descripción por IA. Solo salen las que tienen datos; abre la primera. Los datos salen del
 * `description_list` de `GET /cars/{id}/`.
 *
 * TODO: erratas del diseño reproducidas: "Garantias" y "Decripción GPT" (sin tilde / sin "s");
 * el texto de "Garantía de felicidad" ("LLeva… cambirlo…, 7  días") es el del sitio anterior. Sin
 * tilde en "Garantias" ni en "Decripción" el `<summary>` no es un título de página (no afecta SEO).
 * TODO(reclamaciones): el diseño trae una fila "Reporte de Colserauto" desplegable; consultaba el
 * informe por PLACA desde el navegador (`POST /v2/colserauto/inspeccion/`): sin la placa en el
 * cliente no se puede, falta un Route Handler. Tampoco se dibujó el "$" del ícono de monto (se
 * exportó a mano del Figma). La fila "Reclamaciones reportadas y tipo" trae su chevron en el
 * diseño, pero solo abre la misma explicación que "¿Qué es una reclamación?": aquí no lo lleva.
 * Mobile (89:4840): sin barra oscura; el título va sobre el gris y el acordeón debajo.
 */
export default function VehicleFeaturesComponent({
  vehicle,
}: {
  vehicle: VehicleDetail;
}) {
  const hasWarranty = Boolean(vehicle.warranty) || vehicle.happinessWarranty;
  const hasHistory = vehicle.history.length > 0 || vehicle.plateEnd !== null;
  const historyItems: VehicleFeature[] = [
    ...vehicle.history.slice(0, 3),
    ...(vehicle.plateEnd
      ? [{ label: "Placa", value: `*****${vehicle.plateEnd}`, icon: iconPlate }]
      : []),
    ...vehicle.history.slice(3),
  ];

  const sections: {
    key: string;
    title: React.ReactNode;
    body: React.ReactNode;
  }[] = [];

  if (hasWarranty) {
    sections.push({
      key: "garantias",
      title: "Garantias",
      body: (
        <div className="grid gap-x-8 gap-y-8 xl:grid-cols-2 xl:gap-x-[100px]">
          {vehicle.happinessWarranty && (
            <WarrantyColumn
              title="Garantía de felicidad"
              text="LLeva tu vehículo y si no estas satisfecho puedes cambirlo, tienes hasta 7  días o 300 km para hacerlo"
            />
          )}
          {vehicle.warranty && (
            <WarrantyColumn
              title={vehicle.warranty.title}
              text="Aplica solo para compras y reservas realizadas en la web."
            />
          )}
        </div>
      ),
    });
  }

  if (hasHistory) {
    sections.push({
      key: "historial",
      title: "Historial, documentación y llaves",
      body: <FeatureGrid features={historyItems} />,
    });
  }

  const claimsType =
    vehicle.claims.types.length > 0 ? vehicle.claims.types.join(", ") : null;
  sections.push({
    key: "reclamaciones",
    title: "Reclamaciones",
    body: (
      <ul className="flex flex-col gap-8">
        <li className="flex items-center gap-3">
          <Image
            src={iconClaimsReported}
            alt=""
            aria-hidden
            className="h-auto w-8 shrink-0"
          />
          <div className="text-small leading-6 font-medium text-gray-dark">
            <p>Reclamaciones reportadas y tipo</p>
            <p className="flex items-center gap-1 font-bold">
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="size-[18px] shrink-0 text-orange"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              >
                <circle cx="12" cy="12" r="9.5" />
                <path d="M12 11v5.5M12 7.6v.01" />
              </svg>
              {vehicle.claims.reported}
              {claimsType && <> / {claimsType}</>}
            </p>
          </div>
        </li>
        {vehicle.claims.amount && (
          <li className="flex items-center gap-3">
            <Image
              src={iconClaimsAmount}
              alt=""
              aria-hidden
              className="h-auto w-8 shrink-0"
            />
            <div className="text-small leading-6 font-medium text-gray-dark">
              <p>Monto de reclamaciones</p>
              <p className="font-bold text-dark-gray">
                {vehicle.claims.amount}
              </p>
            </div>
          </li>
        )}
        <li>
          <details className="group/help">
            <summary className="flex cursor-pointer list-none items-center gap-3 text-small leading-6 font-medium text-gray-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange [&::-webkit-details-marker]:hidden">
              <Image
                src={iconClaimsHelp}
                alt=""
                aria-hidden
                className="h-auto w-[26px] shrink-0"
              />
              ¿Qué es una reclamación?
              <svg
                aria-hidden
                viewBox="0 0 12 12"
                className="size-3 transition-transform group-open/help:rotate-180"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m2.5 4.5 3.5 3.5 3.5-3.5" />
              </svg>
            </summary>
            <div className="mt-4 flex max-w-[600px] flex-col gap-3 text-small leading-6 font-medium text-gray-dark">
              {CLAIMS_EXPLANATION.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
          </details>
        </li>
      </ul>
    ),
  });

  if (vehicle.characteristics.length > 0) {
    sections.push({
      key: "caracteristicas",
      title: "Características",
      body: <FeatureGrid features={vehicle.characteristics} />,
    });
  }
  if (vehicle.safety.length > 0) {
    sections.push({
      key: "seguridad",
      title: "Seguridad",
      body: <FeatureGrid features={vehicle.safety} />,
    });
  }
  if (vehicle.equipment.length > 0) {
    sections.push({
      key: "accesorios",
      title: "Accesorios y equipamiento",
      body: <FeatureGrid features={vehicle.equipment} />,
    });
  }
  if (vehicle.comments) {
    sections.push({
      key: "comentarios",
      title: "Comentarios adicionales",
      body: (
        <p className="max-w-[640px] text-body leading-6 font-medium whitespace-pre-line text-gray-dark">
          {vehicle.comments}
        </p>
      ),
    });
  }
  if (vehicle.aiDescription) {
    sections.push({
      key: "gpt",
      title: (
        <>
          <Image
            src={logoChatGpt}
            alt=""
            aria-hidden
            className="size-8 shrink-0"
          />
          Decripción GPT
        </>
      ),
      body: <VehicleAiDescriptionComponent text={vehicle.aiDescription} />,
    });
  }

  return (
    <section
      aria-labelledby="caracteristicas-title"
      className="relative overflow-x-clip bg-gray-light xl:bg-white"
    >
      <div className="relative mx-auto xl:max-w-[1440px]">
        {/* Barra oscura: 428 de ancho en el lienzo y sangra a la izquierda. */}
        <div
          aria-hidden
          className="absolute inset-y-0 hidden bg-dark-gray xl:left-[calc(50%-50vw)] xl:block xl:w-[calc(428px+50vw-50%)]"
        />
        <DiagonalLinesComponent className="absolute top-0 hidden h-[355px] w-[49px] xl:left-[calc(50%-50vw)] xl:block" />
        <div className="absolute top-[819px] left-[323px] hidden xl:block">
          <ZigZagComponent tone="light" />
        </div>

        <div className="container-wcar relative py-16 xl:grid xl:grid-cols-[378px_783px] xl:py-0 xl:pb-[70px]">
          <div className="reveal xl:pt-16">
            <SideLabel />
            <div className="mt-8 xl:-ml-1">
              <ButtonComponent href={ROUTES.contact} icon={arrowCircle}>
                Quiero conocerlo
              </ButtonComponent>
            </div>
          </div>

          <div className="mt-10 xl:mt-0 xl:pt-[17px]">
            <div className="reveal">
              {sections.map((section, index) => (
                <AccordionItem
                  key={section.key}
                  title={section.title}
                  open={index === 0}
                >
                  {section.body}
                </AccordionItem>
              ))}
            </div>
            <div className="reveal mt-16">
              <VehicleEvaluationComponent
                vehicleId={vehicle.id}
                expertise={vehicle.expertise}
                vehicleName={vehicle.name}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** El título partido de la sección. `SideLabelComponent` ya trae el h2; aquí le damos el id que enlaza la sección. */
function SideLabel() {
  return (
    <div id="caracteristicas-title">
      <SideLabelComponent regular="Características" italic="del vehículo" />
    </div>
  );
}
