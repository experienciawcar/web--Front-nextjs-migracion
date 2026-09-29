import type { Headquarters } from "../types/headquarters";

const PHOTOS = "/assets/nuestras-sedes/sedes";

/** Horarios que trae el diseño. Se dejan tal cual, con "6p.m." y "5:30p.m." sin espacio. */
const SCHEDULE_WEEK = "Lunes a Sábado de 9 a.m. - 6p.m.";
const SCHEDULE_FULL_WEEK = "Lunes a Domingo de 8:30 a.m. - 5:30p.m.";

/**
 * Las sedes de las tarjetas de "Nuestras Sedes", en el orden del diseño.
 *
 * Por qué están aquí y no vienen del API: `GET /sedes/` hoy devuelve 3 filas de
 * prueba (Bogotá, Cajicá, Barranquilla) con la MISMA dirección, coordenadas de
 * Estados Unidos y la misma foto, y sin horario ni marca. No sirven para pintar
 * 8 tarjetas. Al ser datos que no salen del backend no llevan DTO ni servicio.
 * TODO: cuando el backend traiga las sedes (con horario y foto propia), pasarlas
 * a un `HeadquartersDto` + `services/headquarters.ts` y borrar este archivo.
 *
 * Direcciones: el diseño trae direcciones de relleno repetidas o cruzadas (La
 * Felicidad, Taller, Cajicá y Vitrina llevan la de Morato; Caribe lleva la de
 * Puente Aranda; a Puente Aranda le sobra una en la fila del horario). Se usó
 * la dirección de cada sede en el sitio anterior (wcar.co/nuestras-sedes), y la
 * del diseño solo cuando coincide con ella:
 *
 * | Sede                | Diseño                       | Aquí (sitio anterior)                 |
 * |---------------------|------------------------------|---------------------------------------|
 * | Punto de Venta Morato | Cl. 98a #69b 35, Bogotá, Colombia | igual                            |
 * | Vitrina de ventas W4  | (la de Morato)               | Calle 98A 69 55, Bogotá, Colombia     |
 * | Caribe                | Carrera. 50 #15-55           | Av. Circunvalar, Cl. 110 #43c91, Barranquilla, local A2-1 |
 * | Taller Morato         | (la de Morato)               | Cr 69b #98-28, Bogotá, Colombia       |
 * | Cajicá - Chía         | (la de Morato)               | Cra 5 #9-26 sur Cajicá. Torre 3 - Local 3 |
 * | La Felicidad          | Cl. 98a #69b 35              | Cl. 17 #80A-30, Bogotá, Colombia      |
 * | wcoffe Morato         | Cl. 98a #69b 35, Bogotá, Colombia | igual (el sitio anterior trae #69b-12 en la página y #69B-35 en el pie) |
 * | Puente Aranda         | Cl. 17 #80A-30, Bogotá + "Ak. 50 #15-55, Puente Aranda" en el horario | Ak. 50 #15-55, Puente Aranda |
 *
 * TODO: confirmar las direcciones con quien lleva las sedes, y el horario de
 * Puente Aranda (el diseño no trae uno: se omite la fila).
 *
 * Fotos: son las del sitio anterior (wcar.co/assets/headquaters/), convertidas
 * a WebP (≤800px de ancho). Dos no son las del diseño y hay que pedirlas:
 * - Vitrina de ventas W4: el diseño tiene una foto con sol; aquí va la de la
 *   fachada con cielo nublado que tiene el sitio anterior.
 * - La Felicidad: el diseño muestra un rótulo "wcar Compramos tu auto usado"
 *   sobre un muro blanco; aquí va la foto de La Felicidad del sitio anterior.
 * `photoPosition` sale de registrar cada foto contra su miniatura del diseño
 * (`registrar_foto.py`); en las dos sustitutas es una estimación.
 *
 * Coordenadas (`coordinates`): salen de geocodificar cada dirección con el
 * buscador de Google Maps (el mismo que usa el mapa del modal), no de un GPS ni
 * del API (las de `/sedes/` son de prueba y caen en EE. UU.). Las de Morato y
 * Cajicá coinciden a ~30 m con los marcadores del mapa del sitio anterior. Son
 * aproximadas: a la sede más cercana no le afecta una diferencia de unas cuadras,
 * salvo entre las de Morato, que están a 100 m unas de otras.
 * TODO: verificarlas poniendo el pin en Google Maps (clic derecho → coordenadas)
 * y, cuando el backend traiga latitud y longitud reales, leerlas de ahí.
 * `isDealership: false` (taller y café) las saca de "la sede más cercana": el
 * banner dice "Encuentra el concesionario de wcar más cerca de ti".
 * TODO: confirmar con el negocio esa regla.
 *
 * Textos del modal (`description`): son los del sitio anterior (los mismos que
 * trae el diseño para Punto de Venta Morato), un párrafo por sede salvo Caribe,
 * que tiene dos. A Puente Aranda se le quitó el "Teléfono: +57 324 4001212" que
 * traía pegado al final: el modal no tiene fila de teléfono.
 * Galería: solo Punto de Venta Morato tiene más de una foto (la fachada de
 * frente y la de la calle); las demás sedes tienen una.
 * TODO: pedir las fotos de la galería de cada sede (el diseño trae 6 de Morato:
 * fachada, sala de espera y showroom).
 *
 * Textos tal cual del diseño (con `TODO: confirmar con diseño`): "wcoffe" (la
 * marca es "wcoffee": en el sitio anterior y en la foto), el espacio antes de
 * los dos puntos en "wcoffe Morato : Un café…" y "Carrera. 50".
 */
export const HEADQUARTERS: Headquarters[] = [
  {
    id: "punto-de-venta-morato",
    brand: "wcar",
    name: "Punto de Venta Morato",
    inlineBrand: false,
    address: "Cl. 98a #69b 35, Bogotá, Colombia",
    coordinates: { lat: 4.69161, lng: -74.07487 },
    schedule: SCHEDULE_WEEK,
    description: [
      "¿Buscas un concesionario cerca de mí en Bogotá? Nuestro Punto de Venta Morato es la parada obligada. Una vitrina de carros usados revisados, certificados y listos para rodar. Y lo mejor, en una ubicación privilegiada sobre la Av. Suba, con fácil acceso desde cualquier punto de la ciudad.",
    ],
    photo: `${PHOTOS}/punto-de-venta-morato.webp`,
    gallery: [`${PHOTOS}/punto-de-venta-morato.webp`, `${PHOTOS}/punto-de-venta-morato-calle.webp`],
    photoPosition: "50% 95%",
  },
  {
    id: "vitrina-ventas-w4",
    brand: "wcar",
    name: "Vitrina de ventas W4",
    inlineBrand: false,
    address: "Calle 98A 69 55, Bogotá, Colombia",
    coordinates: { lat: 4.691468, lng: -74.075703 },
    schedule: SCHEDULE_WEEK,
    description: [
      "WCAR anuncia la apertura de su nueva sede en Morato, un espacio que ofrece una experiencia de servicio superior con la mejor eficiencia y la transparencia. Le invitamos a visitarnos para obtener una valoración técnica precisa de su vehículo en menos de 30 minutos, garantizándole una oferta seria con desembolso inmediato, Y lo mejor, asesoría de verdad y facilidades de financiación sin letras pequeñas.",
    ],
    photo: `${PHOTOS}/vitrina-ventas-w4.webp`,
    photoPosition: "50% 50%",
  },
  {
    id: "caribe-compra-o-vende-tu-auto",
    brand: "wcar",
    name: "Caribe compra o vende tu auto",
    inlineBrand: true,
    balanceTitle: true,
    address: "Av. Circunvalar, Cl. 110 #43c91, Barranquilla, local A2-1",
    coordinates: { lat: 11.0154346, lng: -74.83754915 },
    schedule: SCHEDULE_FULL_WEEK,
    description: [
      "¡WCAR aterriza en Barranquilla! WCAR anuncia con orgullo la apertura de su nueva sede en Barranquilla, un espacio diseñado para revolucionar la compra y venta de vehículos en la Costa Atlántica con eficiencia, transparencia y la mejor actitud.",
      "Te invitamos a visitarnos para vivir una experiencia de servicio superior: obtén una valoración técnica precisa de tu vehículo en menos de 30 minutos, con la garantía de una oferta seria y desembolso inmediato. En WCAR llegamos para cumplir: aquí encontrarás asesoría de verdad y facilidades de financiación claras, sin enredos ni letras pequeñas.",
    ],
    photo: `${PHOTOS}/wcar-caribe-barranquilla.webp`,
    photoPosition: "50% 64%",
  },
  {
    id: "taller-morato",
    brand: "wcar",
    name: "Taller Morato",
    inlineBrand: false,
    address: "Cr 69b #98-28, Bogotá, Colombia",
    coordinates: { lat: 4.6912855, lng: -74.075955 },
    isDealership: false,
    schedule: SCHEDULE_WEEK,
    description: [
      "Tener un taller automotriz cerca de mí de confianza es casi un milagro... por eso abrimos nuestro Taller Morato: diagnósticos reales, mantenimientos serios y un equipo de técnicos que no te maquilla problemas, sino que los soluciona de frente.",
    ],
    photo: `${PHOTOS}/taller-morato.webp`,
    photoPosition: "54% 50%",
  },
  {
    id: "cajica-chia",
    brand: "wcar",
    name: "Cajicá - Chía",
    inlineBrand: false,
    address: "Cra 5 #9-26 sur Cajicá. Torre 3 - Local 3",
    coordinates: { lat: 4.9017724, lng: -74.0303913 },
    schedule: SCHEDULE_FULL_WEEK,
    description: [
      "Si vives en la Sabana y quieres un concesionario cerca de mí, nuestra sede de Cajicá - Chía es para vos. Aquí también aplicamos nuestra receta de éxito: carros usados revisados, atención de calidad y todo en un espacio cómodo, lejos del tráfico bogotano.",
    ],
    photo: `${PHOTOS}/sede-cajica-chia.webp`,
    photoPosition: "50% 25%",
  },
  {
    id: "la-felicidad",
    brand: "wcar",
    name: "La Felicidad",
    inlineBrand: false,
    address: "Cl. 17 #80A-30, Bogotá, Colombia",
    coordinates: { lat: 4.679818, lng: -74.1514061 },
    schedule: SCHEDULE_WEEK,
    description: [
      "En el barrio La Felicidad tenemos otro de nuestros puntos fuertes. Un concesionario cerca de mí para quienes buscan carros usados de calidad, asesoría de verdad y facilidades de financiación sin letras pequeñas. Llegar es fácil, por la Av. Boyacá o la Calle 13.",
    ],
    photo: `${PHOTOS}/sede-la-felicidad.webp`,
    photoPosition: "50% 90%",
  },
  {
    id: "wcoffee-morato",
    brand: "wcoffe Morato",
    name: ": Un café con aroma a transparencia",
    inlineBrand: true,
    address: "Cl. 98a #69b 35, Bogotá, Colombia",
    coordinates: { lat: 4.6917002, lng: -74.0756522 },
    isDealership: false,
    schedule: SCHEDULE_WEEK,
    description: [
      "Y como no todo es negocio, creamos WCoffee en Morato: un espacio brutal para que te tomés un café premium mientras decidís tu próxima compra o esperás tu evaluación. Porque los mejores negocios se cierran con un buen café... y mejor aún si es colombiano.",
    ],
    photo: `${PHOTOS}/wcoffee-morato.webp`,
    photoPosition: "85% 50%",
  },
  {
    id: "puente-aranda",
    brand: "wcar",
    name: "Puente Aranda",
    inlineBrand: false,
    address: "Ak. 50 #15-55, Puente Aranda",
    coordinates: { lat: 4.6295216, lng: -74.1057852 },
    mapQuery: "Ak. 50 #15-55, Puente Aranda, Bogotá, Colombia",
    schedule: null,
    description: [
      "¿Andas buscando concesionario en Bogotá? ¡No busques más! Nuestro Punto de Puente Aranda es la parada obligada. Te espera una vitrina de carros usados que ya están revisados, certificados y listos para arrancar. Y lo mejor de todo: estamos en una ubicación en la Carrera 50 # 15-55, con acceso facilísimo desde cualquier zona de la ciudad.",
    ],
    photo: `${PHOTOS}/sede-puente-aranda.webp`,
    photoPosition: "60% 56%",
  },
];
