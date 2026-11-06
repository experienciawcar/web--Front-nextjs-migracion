export type FooterSede = {
  title: string;
  city: string;
  /** Texto corto de la pestaña. */
  tab: string;
  phone: string;
  address: string;
  image: string;
  /** "lat,lng" cuando buscar por dirección no cae en el sitio. */
  coords?: string;
};

/**
 * Sedes del footer, con los mismos datos y orden del sitio anterior (wcar.co).
 * Fotos en public/assets/shared/footer/sedes/.
 * TODO: si cambian seguido, moverlas al backend (hoy el sitio anterior también
 * las tenía escritas a mano).
 */
export const FOOTER_SEDES: FooterSede[] = [
  {
    title: "Wcar Vitrina Ventas W4",
    city: "Bogotá",
    tab: "Vitrina W4",
    phone: "+57 324 8264550",
    address: "Calle 98A 69 55",
    image: "/assets/shared/footer/sedes/wcar-vitrina.webp",
  },
  {
    title: "Compramos tu Auto Usado Morato",
    city: "Bogotá",
    tab: "Compramos tu Auto",
    phone: "+57 324 4001212",
    address: "Calle 98a # 69 - 45",
    image: "/assets/shared/footer/sedes/sede-compra-tu-carro-morato.webp",
  },
  {
    title: "Wcar Caribe - Compra o Vende tu Auto",
    city: "Barranquilla",
    tab: "Barranquilla",
    phone: "+57 324 4001212",
    address: "Av. Circunvalar, Cl. 110 #43c91, Barranquilla, local A2-1",
    image: "/assets/shared/footer/sedes/barranquilla.webp",
    coords: "11.0009614,-74.8417441",
  },
  {
    title: "Taller",
    city: "Bogotá",
    tab: "Taller",
    phone: "+57 324 8264550",
    address: "Cr 69b #98-28",
    image: "/assets/shared/footer/sedes/sede-taller.webp",
  },
  {
    title: "Wcar Cajicá - Chía",
    city: "Cajicá",
    tab: "Cajicá - Chía",
    phone: "+57 324 4001212",
    address: "Cra 5 #9-26 sur Cajicá. Torre 3 - Local 3",
    image: "/assets/shared/footer/sedes/sede-cajica-chia.webp",
  },
  {
    title: "Wcar Puente Aranda",
    city: "Bogotá",
    tab: "Puente Aranda",
    phone: "+57 324 4001212",
    address: "Carrera. 50 #15-55 Bogotá",
    image: "/assets/shared/footer/sedes/sede-puente-aranda.webp",
  },
  {
    title: "Wcoffee Morato",
    city: "Bogotá",
    tab: "Wcoffee",
    phone: "+57 324 4001212",
    address: "Cll 98a #69B-35",
    image: "/assets/shared/footer/sedes/sede-wcoffe.webp",
  },
  {
    title: "Wcar La Felicidad",
    city: "Bogotá",
    tab: "La Felicidad",
    phone: "+57 324 4001212",
    address: "Cl. 17 #80A-30, Bogotá, Colombia",
    image: "/assets/shared/footer/sedes/sede-la-felicidad.webp",
  },
  {
    title: "Punto de Venta Morato",
    city: "Bogotá",
    tab: "Morato",
    phone: "+57 324 4001212",
    address: "Cll 98a #69B-35",
    image: "/assets/shared/footer/sedes/sede-morato-footer.webp",
  },
];
