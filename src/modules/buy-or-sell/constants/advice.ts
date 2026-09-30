/** Un consejo del acordeón: título numerado y el párrafo que se despliega. */
export type AdviceItem = { title: string; text: string };

/** Enlace del perfil de WCAR en tucarro.com (el del sitio anterior). */
export const TUCARRO_URL = "https://listado.tucarro.com.co/wcar";

/**
 * Consejos del acordeón "Consejos para comprar / vender carros usados en
 * Colombia". Texto tomado tal cual del sitio anterior (wcar.co/compra-o-vende-tu-carro-en-colombia),
 * que trae el párrafo de cada uno oculto hasta abrirlo.
 */
export const BUY_ADVICE: AdviceItem[] = [
  {
    title: "1. Haz tu tarea antes de comprar",
    text: "Antes de comprar un auto usado, es importante hacer una investigación exhaustiva. Asegúrate de conocer el modelo y marca del auto, su precio promedio en el mercado, los problemas comunes que podría tener y cuánto puede costar su mantenimiento. De esta manera, estarás mejor preparado para negociar y tomar una decisión informada.",
  },
  {
    title: "2. Busca en diferentes lugares",
    text: "No te limites a buscar autos usados en una sola plataforma o lugar. Busca en diferentes lugares, como concesionarios de autos usados, sitios web de anuncios clasificados y grupos de redes sociales. Esto te dará una idea más amplia de las opciones disponibles y te permitirá comparar precios y condiciones.",
  },
  {
    title: "3. Inspecciona cuidadosamente el auto",
    text: "Antes de comprar un auto usado, es fundamental que lo inspecciones en persona y a fondo. Si no tienes experiencia en mecánica, considera llevar a un mecánico de confianza contigo para que revise el auto. Verifica el estado de la carrocería, el motor, la transmisión y los sistemas eléctricos.",
  },
  {
    title: "4. Negocia el precio",
    text: "Una vez que hayas seleccionado el auto que deseas comprar, es hora de negociar el precio. No te conformes con el precio inicial y busca obtener un descuento justo. Usa la información que hayas recolectado sobre el auto y su precio promedio en el mercado para apoyar tus argumentos.",
  },
  {
    title: "5. Verifica la documentación",
    text: "Antes de cerrar la compra, asegúrate de revisar la documentación del auto, incluyendo la tarjeta de propiedad, el impuesto de vehículos y la revisión técnico-mecánica. Asegúrate de que todo esté en regla y que el vendedor sea el propietario legal del vehículo.",
  },
];

export const SELL_ADVICE: AdviceItem[] = [
  {
    title: "1. Limpia y arregla el auto",
    text: "Para obtener el mejor precio posible, es importante que el auto se vea lo mejor posible. Limpia el interior y exterior del auto y haz las reparaciones necesarias. Considera también darle un mantenimiento básico antes de ponerlo en venta.",
  },
  {
    title: "2. Anuncia en los lugares correctos",
    text: "Asegúrate de anunciar el auto en los lugares correctos, como sitios web de anuncios clasificados, grupos de redes sociales y concesionarios de autos usados. Esto aumentará tus posibilidades de encontrar compradores interesados.",
  },
  {
    title: "3. Pon un precio justo",
    text: "Investiga el precio promedio de tu auto en el mercado y pon un precio justo y razonable. No intentes venderlo por más de lo que vale, ya que esto alejará a los compradores interesados.",
  },
  {
    title: "4. Ofrece información detallada",
    text: "Cuando publiques el anuncio, asegúrate de proporcionar información detallada sobre el auto, incluyendo el modelo, la marca, el año de fabricación, el kilometraje y cualquier otro dato relevante para generar confianza en la venta del carro.",
  },
  {
    title: "5. Sé honesto sobre el estado del auto",
    text: "Es importante ser honesto sobre el estado del auto. Si hay algún problema o defecto, asegúrate de mencionarlo en el anuncio. De esta manera, los compradores estarán mejor informados y tendrán una idea más clara de lo que están comprando.",
  },
];
