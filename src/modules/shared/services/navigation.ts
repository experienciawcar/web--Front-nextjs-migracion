import { ROUTES } from "../constants/routes";
import type { NavLink } from "../types/navigation";
import { getVehicleTypes } from "./vehicle-types";

/**
 * Árbol de navegación del navbar (escritorio y mobile leen el mismo).
 *
 * Es asíncrono porque el submenú "Compra tu carro" sale del backend (ver
 * `getVehicleTypes`); el resto es fijo, igual que en el sitio anterior.
 *
 * El orden y los textos son los del sitio anterior. Las rutas viven en
 * `constants/routes`.
 */
export async function getNavItems(): Promise<NavLink[]> {
  const vehicleTypes = await getVehicleTypes();

  // Sin tipos (backend caído) "Compra tu carro" queda como enlace simple: un
  // submenú vacío sería peor que ninguno.
  const buyCar: NavLink =
    vehicleTypes.length > 0
      ? {
          label: "Compra tu carro",
          href: ROUTES.buyCar,
          children: vehicleTypes.map((type) => ({
            label: type.name,
            href: type.href,
            count: type.count,
            ...(type.imageUrl ? { iconUrl: type.imageUrl } : {}),
          })),
        }
      : { label: "Compra tu carro", href: ROUTES.buyCar };

  return [
    {
      label: "Sobre Nosotros",
      href: ROUTES.aboutUs,
      children: [
        { label: "Nuestra empresa", href: ROUTES.aboutUs },
        { label: "Nuestras sedes", href: ROUTES.headquarters },
      ],
    },
    {
      label: "Compra o Vende",
      href: ROUTES.buyOrSell,
      children: [
        buyCar,
        { label: "Compra tu moto", href: ROUTES.buyMotorcycle },
        { label: "Compra tu camión", href: ROUTES.buyTruck },
        { label: "Vende tu carro", href: ROUTES.sellCar },
        { label: "Compra tu van", href: ROUTES.buyVan },
      ],
    },
    {
      // Sin `href`: "Servicios" no tiene página, solo agrupa. Antes enlazaba a
      // Financiación como parche mientras no existía el desplegable.
      label: "Servicios",
      children: [
        { label: "Financiación", href: ROUTES.financing },
        { label: "Seguros", href: ROUTES.insurance },
        { label: "Trámites", href: ROUTES.procedures },
        { label: "Taller", href: ROUTES.workshop },
      ],
    },
    { label: "Blog", href: ROUTES.blog },
    { label: "Contacto", href: ROUTES.contact },
  ];
}
