import type { Headquarters } from "../types/headquarters";

/**
 * Marca en naranja + nombre en negro de una sede, sin fijar tamaño ni peso (los
 * pone el título que lo contiene: el de 22px de la tarjeta o el de 36px del
 * modal). Con `inlineBrand` van en el mismo párrafo ("wcar Caribe compra o
 * vende tu auto"); si no, la marca va sola en su línea y el nombre debajo.
 *
 * TODO: confirmar con diseño la marca "wcoffe" (la marca real es "wcoffee") y el
 * espacio antes de los dos puntos de "wcoffe Morato : Un café…".
 */
export default function HeadquartersNameComponent({
  brand,
  name,
  inlineBrand,
}: Pick<Headquarters, "brand" | "name" | "inlineBrand">) {
  if (inlineBrand) {
    return (
      <>
        <span className="text-orange">{brand}</span> {name}
      </>
    );
  }

  return (
    <>
      <span className="block text-orange">{brand}</span>
      {name}
    </>
  );
}
