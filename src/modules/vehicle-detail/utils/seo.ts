import type { Metadata } from "next";

import { ROUTES } from "@/modules/shared/constants/routes";
import {
  SITE_NAME,
  SITE_URL,
  buildPageMetadata,
} from "@/modules/shared/utils/seo";

import type { VehicleDetail } from "../types/vehicle-detail";

/** El `<title>` mide entre 25 y 60 caracteres (guía §16): si el nombre es largo se recorta por palabras. */
const MAX_TITLE = 60;
const TITLE_SUFFIX = " | WCAR";

function buildTitle(vehicle: VehicleDetail): string {
  const year = vehicle.year ? ` ${vehicle.year}` : "";
  const base = `${vehicle.name}${year}`;
  const room = MAX_TITLE - TITLE_SUFFIX.length;
  if (base.length <= room) return `${base}${TITLE_SUFFIX}`;

  const words = base.split(" ");
  while (words.length > 1 && words.join(" ").length > room) words.pop();
  return `${words.join(" ")}${TITLE_SUFFIX}`;
}

/**
 * Título, descripción, canonical y Open Graph de la ficha, con lo que trae el vehículo (nombre,
 * año, kilometraje, transmisión, sede y precio). La foto principal es la imagen al compartir el
 * enlace. El canonical es el enlace con el tipo y el nombre en la URL, aunque se llegue con
 * otro texto: solo el id cuenta.
 * TODO(seo): confirmar con marketing la plantilla del título y la descripción.
 */
export function buildVehicleMetadata(vehicle: VehicleDetail): Metadata {
  const details = [
    vehicle.year && `modelo ${vehicle.year}`,
    vehicle.mileage,
    vehicle.transmission.toLowerCase(),
  ].filter(Boolean);
  const description = `${vehicle.name} ${details.join(", ")} en ${vehicle.city}. Precio ${vehicle.price}${
    vehicle.warranty ? `, con ${vehicle.warranty.title.toLowerCase()}` : ""
  }. Compra o financia tu vehículo con WCAR.`;

  const metadata = buildPageMetadata({
    title: buildTitle(vehicle),
    description,
    path: vehicle.href,
  });
  const photo = vehicle.images[0]?.srcSet
    ? (vehicle.images[0].srcSet
        .split(", ")
        .map((entry) => entry.split(" "))
        .at(-1)?.[0] ?? vehicle.images[0].src)
    : vehicle.images[0]?.src;
  if (!photo) return metadata;

  const images = [{ url: photo, alt: vehicle.name }];
  return {
    ...metadata,
    openGraph: { ...metadata.openGraph, images },
    twitter: { ...metadata.twitter, images: [photo] },
  };
}

/**
 * Datos estructurados de la ficha (`Car` con su oferta y las migas de pan), solo con datos
 * reales del vehículo. Se serializa con `<` escapado para que ningún texto del backend pueda
 * cerrar la etiqueta `<script>`.
 */
export function buildVehicleJsonLd(vehicle: VehicleDetail): string {
  const url = `${SITE_URL}${vehicle.href}`;
  const car: Record<string, unknown> = {
    "@type": "Car",
    name: vehicle.name,
    url,
    image: vehicle.images.slice(0, 5).map((image) => image.src),
    itemCondition: "https://schema.org/UsedCondition",
    vehicleTransmission: vehicle.transmission,
    offers: {
      "@type": "Offer",
      url,
      price: vehicle.priceValue,
      priceCurrency: "COP",
      availability:
        vehicle.tag?.name === "Reservado" || vehicle.tag?.name === "Vendido"
          ? "https://schema.org/SoldOut"
          : "https://schema.org/InStock",
      seller: { "@type": "AutoDealer", name: SITE_NAME, url: SITE_URL },
    },
  };
  if (vehicle.brand) car.brand = { "@type": "Brand", name: vehicle.brand };
  if (vehicle.year) car.vehicleModelDate = String(vehicle.year);
  if (vehicle.bodyType) car.bodyType = vehicle.bodyType;
  if (vehicle.mileageValue != null) {
    car.mileageFromOdometer = {
      "@type": "QuantitativeValue",
      value: vehicle.mileageValue,
      unitCode: "KMT",
    };
  }

  const breadcrumbs = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: `${SITE_URL}${ROUTES.home}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Compra tu carro",
        item: `${SITE_URL}${ROUTES.buyCar}`,
      },
      { "@type": "ListItem", position: 3, name: vehicle.name, item: url },
    ],
  };

  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [car, breadcrumbs],
  }).replace(/</g, "\\u003c");
}
