import { ROUTES } from "@/modules/shared/constants/routes";

import type { SeoCategory, SeoCategoryKey } from "../types/seo";

/**
 * Contenido SEO del catálogo: el banner naranja sobre el listado y el acordeón "+" debajo, por
 * categoría de vehículo. Textos del sitio anterior (`docs/SEO_CATALOGO_COMPRA_TU_CARRO.md` §6),
 * con las correcciones de §6.7: sin paneles vacíos, sin el párrafo duplicado de "platón", sin la
 * mención a tucarro.com, "Suzuki" bien escrito, `alt` en todas las imágenes y los "Compra tu…" /
 * "aquí" convertidos en enlaces internos.
 *
 * TODO(seo): los textos mencionan garantía de 6 meses, pico y placa y "a la fecha de esta
 * publicación"; confirmar con marketing que siguen vigentes.
 */

export const SEO_IMAGES_BASE = "/assets/catalogo/seo";

const HYBRID_HREF = `${ROUTES.buyCar}?typeOfFuels=hibrido`;
const SUV_HREF = `${ROUTES.buyCar}/camionetas-usadas?type_vehicle=${encodeURIComponent("Camioneta - SUV")}`;
const HATCHBACK_HREF = `${ROUTES.buyCar}/hatchback-colombia?type_vehicle=Hatchback`;
const SEDAN_HREF = `${ROUTES.buyCar}/carros-sedan-usados?type_vehicle=Sedan`;

const CAMIONETAS: SeoCategory = {
  key: "camionetas",
  bannerTitle: "Camionetas usadas",
  left: [
    {
      title: "Camionetas Usadas Colombia",
      paragraphs: [
        "En wcar entendemos que la elección de una camioneta usada de calidad es una decisión importante para nuestros clientes en Colombia. Es por eso que nos enorgullece ofrecer una amplia gama de camionetas de todos los matices, cómodas, de lujo, con platón, híbridas, exclusivas, comerciales que cumplen con los más altos estándares de calidad y confiabilidad. Nuestra selección incluye marcas reconocidas como Chevrolet, Renault, Mercedes Benz, BMW y Toyota entre otras, garantizando que nuestros clientes encuentren la camioneta de sus sueños.",
      ],
      link: { label: "Compra tu Camioneta", href: SUV_HREF },
      image: { file: "camionetas-usadas-colombia.webp", alt: "Camionetas usadas Colombia" },
    },
    {
      title: "Camionetas SUV Usadas",
      paragraphs: [
        "Las camionetas SUV usadas son la elección perfecta para quienes buscan combinar estilo, espacio y potencia sin sacrificar la economía. En WCAR, entendemos que cada conductor tiene necesidades únicas, por eso ofrecemos una selección de SUV que destacan por su confiabilidad y rendimiento, garantizando una compra segura y transparente. Navega entre nuestras opciones y encuentra la camioneta SUV que mejor se adapte a tu estilo de vida y necesidades, todo con la tranquilidad de contar con el respaldo de nuestra filosofía de Transparencia Brutal.",
      ],
      image: { file: "camioneta-suv.webp", alt: "Camionetas SUV usadas" },
    },
    {
      title: "Camioneta Chevrolet y Toyota Colombia: Las mejores opciones en camionetas usadas en Colombia",
      paragraphs: [
        "En wcar, sabemos que Chevrolet y Toyota son dos de las marcas más populares y confiables en el mercado de camionetas usadas en Colombia. Nuestra colección de camionetas Chevrolet ofrece modelos emblemáticos como la Chevrolet Montana, conocida por su versatilidad y rendimiento excepcional. También contamos con una amplia selección de camionetas Toyota, que son reconocidas por su durabilidad y capacidad todo terreno. Además, ofrecemos modelos 4×4 para aquellos que buscan aventuras fuera de la carretera.",
      ],
      image: { file: "toyota-colombia.webp", alt: "Camionetas Toyota en Colombia" },
    },
    {
      title: "Chevrolet Montana",
      paragraphs: [
        "Una de las camionetas con más crecimiento en ventas en el 2023, una pickup con un diseño y estilo único que enamora a los usuarios clásicos de Chevrolet y cumple a cabalidad con su función utilitaria y más la Chevrolet Montana llega con toda al país.",
      ],
      image: { file: "chevrolet-montana.webp", alt: "Chevrolet Montana" },
    },
    {
      title: "Ford en Colombia: Calidad y rendimiento garantizados",
      paragraphs: [
        "Ford es otra marca de renombre en el mercado de camionetas usadas en Colombia, y en wcar nos aseguramos de ofrecer una variedad de modelos de alta calidad de esta reconocida marca. Si estás buscando una camioneta potente y resistente, las camionetas Ford, incluyendo la popular Ford Raptor, son una opción excelente. Estos vehículos están diseñados para soportar condiciones difíciles y ofrecen un rendimiento excepcional en cualquier terreno.",
      ],
      image: { file: "ford-en-colombia.webp", alt: "Camionetas Ford en Colombia" },
    },
  ],
  right: [
    {
      title: "Camionetas con platón: Espacio y versatilidad",
      paragraphs: [
        "Entendemos que algunos clientes necesitan una camioneta con espacio adicional para transportar carga. En wcar, contamos con una selección de camionetas con platón que ofrecen la combinación perfecta de capacidad de carga y confort. Estos vehículos son ideales para aquellos que necesitan transportar mercancías o equipos, brindando la versatilidad necesaria para enfrentar cualquier desafío.",
      ],
      image: { file: "camioneta-con-platon.webp", alt: "Camioneta con platón" },
    },
    {
      title: "Camionetas chinas: Calidad a precios accesibles",
      paragraphs: [
        "Además de las marcas reconocidas, también ofrecemos camionetas chinas de alta calidad a precios accesibles. Estos vehículos ofrecen una excelente relación calidad-precio y son una opción popular entre aquellos que buscan una opción económica sin comprometer la calidad y el rendimiento. Nuestro equipo de expertos en WCar selecciona cuidadosamente las camionetas chinas disponibles para asegurarse de ofrecer a nuestros clientes solo productos confiables y duraderos.",
      ],
      image: { file: "camioneta-china.webp", alt: "Camioneta china" },
    },
    {
      title: "Camionetas usadas Bogotá, encuentra la perfecta para ti",
      paragraphs: [
        "No importa dónde te encuentres en Colombia, en WCar estamos comprometidos a ayudarte a encontrar la camioneta usada perfecta. Nuestro servicio de ventas abarca todo el país, y si te encuentras en Bogotá, ofrecemos una amplia variedad de camionetas usadas disponibles en la capital. Nuestra página web fácil de usar te permite buscar por ubicación, marca, modelo y más, para que encuentres la camioneta adecuada de manera rápida y sencilla.",
      ],
      image: { file: "camionetas-usadas-bogota.webp", alt: "Camionetas usadas en Bogotá" },
    },
    {
      title: "Experiencia y compromiso en la venta de camionetas usadas",
      paragraphs: [
        "En wcar, contamos con años de experiencia en la venta de camionetas usadas en Colombia. Nuestro equipo de profesionales está dedicado a brindar un servicio excepcional y asesoramiento experto a nuestros clientes. Nos esforzamos por ofrecer transparencia en cada paso del proceso de compra, desde la selección hasta la entrega. Tu satisfacción es nuestra máxima prioridad.",
      ],
      image: { file: "experiencia-compromiso.webp", alt: "Experiencia y compromiso en la venta de camionetas" },
    },
    {
      title: "¡Descubre la mejor selección de Camionetas Usadas en Colombia en WCar!",
      paragraphs: [
        "No pierdas la oportunidad de adquirir la camioneta usada de tus sueños en WCar. Explora nuestra amplia selección de camionetas de lujo, incluyendo marcas como Chevrolet, Toyota y Ford. También tenemos opciones de camionetas con platón y modelos chinos de calidad. Visita nuestra página web y encuentra la camioneta perfecta para ti en Bogotá o en cualquier parte de Colombia. ¡Te esperamos en WCar!",
      ],
      image: { file: "camioneta-chevrolet.webp", alt: "Camioneta Chevrolet" },
    },
  ],
};

const COUPE: SeoCategory = {
  key: "coupe",
  bannerTitle: "Carros Coupe Usados",
  left: [
    {
      title: "¿Por qué elegir un coupe usado?",
      paragraphs: [
        "Optar por un coupe usado es elegir un vehículo que combina elegancia y rendimiento. Los carros tipo coupe tienen un diseño distintivo que los hace destacar en cualquier carretera. Su estructura compacta y aerodinámica permite una conducción ágil, ideal para quienes tienen un estilo más deportivo. Al adquirir un coupe usado en wcar, estás obteniendo un vehículo de alto desempeño, con la tranquilidad de saber que ha sido inspeccionado y que todo lo que necesitas saber sobre su historial está a tu disposición. Este enfoque, de transparencia brutal, nos permite ofrecer autos que son tan atractivos como confiables, haciendo que tu inversión sea segura y duradera. En wcar, valoramos tu confianza, por eso siempre ponemos por delante la transparencia brutal.",
      ],
      image: { file: "foto-coupe-1.webp", alt: "¿Por qué elegir un coupe usado?" },
    },
    {
      title: "Autos coupe en venta con garantía",
      paragraphs: [
        "La compra de un auto coupe usado no tiene por qué ser arriesgada ni complicada. En wcar, nos aseguramos de que todos los autos coupe en venta cuenten con un historial transparente y una garantía que respalde su calidad. Cada coupe usado disponible en wcar viene con la tranquilidad de una garantía de seis meses que cubre más de 3,000 piezas del vehículo, con la opción de extenderla hasta por dos años. Sabemos que una de las principales preocupaciones al comprar un carro usado es la posibilidad de encontrar defectos ocultos. Con nuestra política de transparencia brutal, te mostramos todo lo que necesitas saber sobre el estado real del auto, incluyendo el historial de mantenimiento y cualquier detalle relevante para tu decisión.",
      ],
      image: { file: "foto-coupe-2.webp", alt: "Autos coupe con garantía" },
    },
    {
      title: "Encuentra carros coupe baratos",
      paragraphs: [
        "En wcar creemos que, en la actualidad, no tienes que sacrificar calidad por encontrar carros coupe baratos. En nuestra plataforma podrás encontrar modelos que combinan precio asequible con un buen rendimiento, lo que significa que puedes tener lo mejor de ambos mundos: un auto elegante y deportivo a un precio que se ajuste a tu presupuesto.",
      ],
      image: { file: "foto-coupe-3.webp", alt: "Carros coupe baratos" },
    },
    {
      title: "Tu coupe usado, una compra segura",
      paragraphs: [
        "Si estás buscando un auto coupe usado, es esencial que hagas una compra inteligente y bien informada. En wcar, ofrecemos vehículos que destacan tanto por su diseño como por su seguridad y buen funcionamiento, garantizados mediante revisiones exhaustivas. Con nuestra garantía de seis meses, además de la opción de extenderla, te brindamos toda la información necesaria para que tomes una decisión con plena confianza, siempre respaldados por nuestra transparencia brutal.",
      ],
      image: { file: "foto-coupe-4.webp", alt: "Compra segura de coupe usado" },
    },
  ],
  right: [
    {
      title: "¿Qué tipo de garantía ofrecen los carros coupe usados en wcar?",
      paragraphs: [
        "En wcar, ofrecemos una garantía inicial de seis meses que cubre más de 3,000 piezas del vehículo, con la opción de extenderla hasta dos años.",
      ],
      image: { file: "foto-coupe-5.webp", alt: "Garantía para carros coupe" },
    },
    {
      title: "¿Cómo puedo verificar el historial de un carro coupe usado antes de comprarlo?",
      paragraphs: [
        "Te proporcionamos acceso completo al historial del vehículo, incluyendo su mantenimiento y cualquier accidente previo.",
      ],
      image: { file: "foto-coupe-6.webp", alt: "Verificar el historial de un carro coupe" },
    },
    {
      title: "¿Cuáles son las ventajas de comprar un coupe usado en wcar?",
      paragraphs: [
        "En wcar garantizamos que todos los carros han pasado por una revisión exhaustiva y ofrecemos total transparencia en el estado del vehículo.",
      ],
      image: { file: "foto-coupe-7.webp", alt: "Ventajas de comprar un coupe usado" },
    },
    {
      title: "¿Es posible financiar la compra de un carro coupe usado?",
      paragraphs: ["Sí, contamos con opciones de financiamiento flexibles que se adaptan a tu presupuesto."],
      image: { file: "foto-coupe-8.webp", alt: "Financiamiento para un carro coupe" },
    },
  ],
};

const HIBRIDOS: SeoCategory = {
  key: "hibridos",
  bannerTitle: "Carros Híbridos Colombia",
  left: [
    {
      title: "Carros Híbridos Colombia",
      paragraphs: [
        "En wcar, somos expertos en el sector transaccional automotriz y estamos comprometidos con la promoción de tecnologías limpias en Colombia. Conoce nuestra amplia gama de carros híbridos que combinan lo mejor de la eficiencia y el rendimiento. Sin contar que en Colombia a la fecha de esta publicación se cuentan con beneficios como la excepción de pico y placa en varias ciudades a vehículos con tecnologías limpias.",
      ],
      link: { label: "Compra tu Híbrido", href: HYBRID_HREF },
      image: { file: "carros-hibridos-colombia.webp", alt: "Carros híbridos Colombia" },
    },
    {
      title: "Qué es un Híbrido",
      paragraphs: [
        "Los carros híbridos son vehículos que utilizan dos fuentes de energía para impulsarse: un motor de combustión interna y un motor eléctrico. Esta combinación permite un mayor ahorro de combustible y una reducción significativa en las emisiones de CO2.",
      ],
      image: { file: "tecnologias-limpias-a.webp", alt: "Tecnologías limpias" },
    },
    {
      title: "Tecnologías Vehiculares Limpias",
      paragraphs: [
        "En un mundo cada vez más consciente del medio ambiente, las tecnologías limpias se han convertido en una prioridad. Los carros híbridos representan una solución sostenible al combinar un motor de combustión interna con un motor eléctrico, reduciendo así las emisiones de gases contaminantes.",
      ],
      image: { file: "tecnologias-limpias-b.webp", alt: "Tecnologías vehiculares limpias" },
    },
    {
      title: "Carros híbridos",
      paragraphs: [
        "En wcar, ofrecemos una amplia selección de carros híbridos de alta calidad. Nuestra variedad de modelos te permitirá encontrar el carro híbrido perfecto que se adapte a tus necesidades y estilo de vida.",
      ],
    },
    {
      title: "Vehículos Híbridos más populares",
      paragraphs: [
        "En nuestro concesionario, destacamos los vehículos híbridos más populares en Colombia. Estos modelos han sido aclamados por su rendimiento, eficiencia y tecnología innovadora. ¡Descubre cuál es el adecuado para ti!",
      ],
      link: { label: "Míralos aquí", href: HYBRID_HREF },
      image: { file: "vehiculos-hibridos-mas-populares-1.webp", alt: "Vehículos híbridos más populares" },
    },
  ],
  right: [
    {
      title: "Hyundai Híbrido",
      paragraphs: [
        "Los carros híbridos de Hyundai combinan elegancia, tecnología y eficiencia en un solo vehículo. Con características impresionantes y sistemas avanzados, los modelos híbridos de Hyundai ofrecen una experiencia de conducción excepcional.",
      ],
      image: { file: "hyundai-hibrido.webp", alt: "Hyundai híbrido" },
    },
    {
      title: "Toyota Híbrido",
      paragraphs: [
        "Toyota es un referente mundial en carros híbridos y en wcar te ofrecemos una amplia selección de sus modelos más populares. Estos vehículos son reconocidos por su calidad, confiabilidad y tecnología avanzada, lo que los convierte en una elección inteligente para aquellos que buscan un carro híbrido en Colombia.",
      ],
      image: { file: "toyota-hibrido-2.webp", alt: "Toyota híbrido" },
    },
    {
      title: "Suzuki Híbrido",
      paragraphs: [
        "Suzuki ha incursionado en el mundo de los carros híbridos con propuestas innovadoras y llenas de estilo. Sus modelos híbridos destacan por su diseño moderno, economía de combustible y rendimiento confiable en las carreteras colombianas.",
      ],
      image: { file: "suzuki-hibrido.webp", alt: "Suzuki híbrido" },
    },
    {
      title: "Mazda Híbrido",
      paragraphs: [
        "Los carros híbridos de Mazda combinan diseño elegante, confort y eficiencia. Con su enfoque en la experiencia de conducción, Mazda ha logrado crear vehículos híbridos que ofrecen un rendimiento excepcional y una alta eficiencia energética.",
      ],
      image: { file: "mazda-hibrido.webp", alt: "Mazda híbrido" },
    },
    {
      title: "En wcar le apuntamos a las nuevas tecnologías de energía limpia",
      paragraphs: [
        "En wcar, estamos comprometidos con brindarte información transparente y veraz sobre los carros híbridos en Colombia. Visítanos y descubre cómo la tecnología híbrida puede transformar tu forma de conducir de manera sostenible. ¡Te esperamos en nuestro concesionario!",
      ],
    },
  ],
};

const SEDAN: SeoCategory = {
  key: "sedan",
  bannerTitle: "Carros Sedan Usados",
  left: [
    {
      title: "¿Estás buscando un carro sedan usado confiable y a un precio accesible?",
      paragraphs: [
        "En wcar, entendemos tus necesidades y estamos aquí para ayudarte a encontrar el vehículo ideal que se ajuste a tus gustos y presupuesto. Con nuestra amplia experiencia en el mercado de carros usados, nos hemos consolidado como el concesionario líder en el país, ofreciendo una amplia selección de carros sedan Colombia usados de alta calidad.",
      ],
      image: { file: "carros-sedan-usados.webp", alt: "Carros sedan usados" },
    },
    {
      title: "Compra tu Sedan",
      paragraphs: [
        "Cuando se trata de carros sedan Colombia usados, sabemos que la confianza y la transparencia son fundamentales. En wcar, nos comprometemos a brindarte la mejor experiencia de compra posible. Todos nuestros carros sedan usados han pasado por rigurosas inspecciones y pruebas para garantizar su calidad y confiabilidad.",
      ],
      link: { label: "Ver carros sedan usados", href: SEDAN_HREF },
      image: { file: "compra-tu-sedan.webp", alt: "Compra tu sedan" },
    },
    {
      title: "Carros Sedan Colombia",
      paragraphs: [
        "Además, te proporcionamos un informe detallado del historial del vehículo, que incluye información sobre accidentes anteriores, reparaciones y mantenimiento realizado.",
        "Puedes visitar nuestro concesionario en cualquier momento para explorar nuestra selección de carros sedan usados y recibir asesoramiento personalizado de nuestro equipo de especialistas. También puedes visitar nuestro sitio web para ver el inventario en línea y solicitar más información.",
      ],
      image: { file: "carros-sedan-colombia.webp", alt: "Carros sedan en Colombia" },
    },
    {
      title: "¿Qué es un Sedan?",
      paragraphs: [
        "Un carro sedan es un tipo de vehículo de cuatro puertas, diseñado para ofrecer comodidad, espacio y versatilidad. Se caracteriza por tener un compartimento de carga separado y una carrocería más larga que otros tipos de carros.",
        "Los carros sedan son ideales para familias y personas que buscan un equilibrio entre estilo, funcionalidad y rendimiento. Ofrecen asientos cómodos tanto para el conductor como para los pasajeros, y su diseño aerodinámico brinda una conducción suave y eficiente. Además, los carros sedan suelen ser conocidos por su elegancia y sofisticación, lo que los convierte en una opción popular en el mercado automotriz.",
      ],
      image: { file: "que-es-un-sedan.webp", alt: "Qué es un sedan" },
    },
    {
      title: "Compra Sedan Usado",
      paragraphs: [
        "El mercado de carros usados ofrece una amplia variedad de opciones para aquellos que buscan un vehículo confiable y asequible. Si estás considerando comprar un carro sedan usado, hay varios aspectos importantes que debes tener en cuenta antes de tomar una decisión.",
        "En wcar, exploraremos las ventajas para que realices la compra sedan usado, las consideraciones clave antes de realizar la compra, cómo evaluar y elegir el carro adecuado, consejos para negociar el precio, financiamiento y seguro, y el mantenimiento necesario para mantener tu nuevo vehículo en buen estado.",
      ],
      image: { file: "compra-sedan-usado.webp", alt: "Compra de un sedan usado" },
    },
  ],
  right: [
    {
      title: "Conoce el Auto Sedan más popular",
      paragraphs: [
        "En nuestro concesionario, destacamos los vehículos Sedan más populares en Colombia. Estos modelos han sido aclamados por su rendimiento, eficiencia y tecnología innovadora. ¡Descubre cuál es el adecuado para ti! Como el Mazda 2 Sedan, Chevrolet es popular con el Joy Sedan, el Aveo Sedan el Onix Sedan, el Kia Rio Sedan no se queda atrás y exponemos algunas de sus grandes características.",
      ],
      image: {
        file: "estas-buscando-un-carro-sedan-usado-confiable.webp",
        alt: "Los carros sedan más populares en Colombia",
      },
    },
    {
      title: "Mazda 2 Sedan",
      paragraphs: [
        "El Mazda 2 Sedán es un automóvil compacto que combina estilo y desempeño de manera excepcional. Con un diseño elegante y aerodinámico, este vehículo ofrece líneas suaves y dinámicas que le dan una apariencia moderna y sofisticada. Su tamaño compacto lo hace ideal para maniobrar en espacios reducidos, mientras que su amplio interior brinda comodidad y espacio suficiente para los ocupantes.",
      ],
      image: { file: "masda-sedan.webp", alt: "Mazda 2 Sedan" },
    },
    {
      title: "Kia Rio Sedan",
      paragraphs: [
        "El Kia Rio Sedán es un automóvil compacto que destaca por su diseño moderno y atractivo, combinado con un rendimiento sólido y características avanzadas. Con líneas dinámicas y detalles estilizados, este sedán ofrece una apariencia elegante y sofisticada.",
        "Su amplio interior proporciona comodidad y espacio para los ocupantes, mientras que su maletero generoso permite llevar carga adicional.",
      ],
    },
    {
      title: "Chevrolet Joy Sedan",
      paragraphs: [
        "El Chevrolet Joy Sedán es un vehículo versátil y confiable que se destaca por su diseño atractivo y su eficiencia en el consumo de combustible. Con líneas elegantes y modernas, este sedán compacto ofrece un amplio espacio interior y un maletero generoso, lo que lo convierte en una opción ideal para aquellos que buscan comodidad y practicidad.",
      ],
      image: { file: "chevrolet-joy-sedan.webp", alt: "Chevrolet Joy Sedan" },
    },
    {
      title: "Chevrolet Onix Sedan",
      paragraphs: [
        "El Chevrolet Onix Sedán es un automóvil compacto que combina estilo, eficiencia y tecnología de manera excepcional. Con un diseño moderno y aerodinámico, este sedán destaca por sus líneas elegantes y detalles sofisticados. Su amplio interior brinda comodidad y espacio suficiente para los ocupantes, mientras que su maletero espacioso permite transportar carga adicional.",
      ],
      image: { file: "chevrolet-onix-sedan.webp", alt: "Chevrolet Onix Sedan" },
    },
    {
      title: "Conoce nuestros Carros Usados Sedan disponibles",
      paragraphs: [
        "En wcar, estamos comprometidos con brindarte información brutalmente transparente y veraz sobre los carros Sedan en Colombia. Visítanos y descubre cómo puede cambiar tu vida un vehículo familiar diseñado para suplir tus necesidades. ¡Te esperamos en nuestro concesionario!",
      ],
    },
  ],
};

const HATCHBACK: SeoCategory = {
  key: "hatchback",
  bannerTitle: "Hatchback Colombia",
  left: [
    {
      title: "Hatchback Colombia",
      image: { file: "hatchback-colombia.webp", alt: "Hatchback Colombia" },
    },
    {
      title: "Carros Hatchback Usados Colombia",
      paragraphs: [
        "En wcar tenemos claro que una de las razones por la que los Colombianos y Latinos eligen su vehículo, es por su estilo, comodidad y versatilidad. Nada como un Carro Hatchback.",
        "Conoce nuestra amplia gama de carros hatchback usados Colombia que brindan una versatilidad, espacio y diseño.",
        "Sin contar que en Colombia a la fecha de esta publicación se cuentan con beneficios como la excepción de pico y placa en varias ciudades a vehículos con tecnologías limpias.",
      ],
      link: { label: "Compra tu Hatchback", href: HATCHBACK_HREF },
      image: { file: "carros-hatchback-usados-colombia.webp", alt: "Carros hatchback usados Colombia" },
    },
    {
      title: "Hatchback usados",
      image: { file: "hatchback-usados.webp", alt: "Carros hatchback usados" },
    },
    {
      title: "Un Hatchback la mejor opción en Bogotá",
      paragraphs: [
        "Si buscas un auto práctico en Bogotá, considera un hatchback usado. Son ideales para la ciudad como la nuestra, ofrecen buen consumo de combustible y son fáciles de estacionar. Encuentra una gran variedad de opciones asequibles y confiables en el mercado local.",
        "Los carros hatchback usados son una opción popular y atractiva para quienes buscan un vehículo práctico y versátil. Estos automóviles compactos se caracterizan por su diseño de carrocería que incluye una puerta trasera levadiza, lo que facilita el acceso al espacioso compartimento de carga.",
        "Su tamaño más reducido los convierte en una elección ideal para la conducción en entornos urbanos, ya que permiten una mejor maniobrabilidad y estacionamiento en espacios reducidos. Además, suelen ofrecer un rendimiento eficiente en cuanto a consumo de combustible, lo que resulta atractivo para aquellos que buscan economizar en gastos de combustible.",
        "Con una amplia variedad de modelos y marcas disponibles en el mercado de autos usados, los hatchbacks ofrecen una opción asequible y confiable para aquellos que desean un automóvil con estilo y funcionalidad en un paquete compacto.",
      ],
      image: { file: "un-hatchback-la-mejor-opcion-en-bogota.webp", alt: "Un hatchback, la mejor opción en Bogotá" },
    },
    {
      title: "Los Mejores Hatchback en Colombia",
      paragraphs: [
        "En wcar, ofrecemos una amplia selección de carros hatchback de alta calidad con nuestra garantía light o la plus. Nuestra variedad de modelos te permitirá encontrar los mejores hatchback en Colombia, llegando al carro perfecto que se adapte a tu style, a continuación te mostramos los Hatchback más populares entre la audiencia.",
      ],
      image: { file: "los-mejores-hatchback-en-colombia.webp", alt: "Los mejores hatchback en Colombia" },
    },
  ],
  right: [
    {
      title: "Hatchback Colombia en wcar",
      image: { file: "hatchback-colombia.webp", alt: "Hatchback Colombia en wcar" },
    },
    {
      title: "Hatchback Carros versátiles para la ciudad",
      paragraphs: [
        "En nuestro concesionario, destacamos los vehículos hatchback carros versátiles y más populares en Colombia. Estos modelos han sido aclamados por su rendimiento, eficiencia y Diseño. ¡Descubre cuál es el adecuado para ti!",
      ],
      link: { label: "Míralos aquí", href: HATCHBACK_HREF },
    },
    {
      title: "Kia Rio Hatchback",
      paragraphs: [
        "El Kia Rio Hatchback es un automóvil compacto que combina estilo y funcionalidad. Con un diseño moderno y atractivo, ofrece una experiencia de conducción cómoda y ágil, perfecta para la vida urbana.",
        "Su tamaño compacto lo hace ideal para maniobrar en espacios reducidos y encontrar estacionamiento fácilmente en áreas concurridas como Bogotá. Además, cuenta con un espacioso interior que ofrece comodidad para los pasajeros y un generoso espacio de carga en su maletero.",
        "El Kia Rio Hatchback está equipado con tecnología avanzada, características de seguridad sólidas y un rendimiento eficiente en cuanto a consumo de combustible, convirtiéndolo en una excelente opción para aquellos que buscan un hatchback versátil y confiable en la ciudad.",
      ],
    },
    {
      title: "Chevrolet Onix Hatchback",
      paragraphs: [
        "El Chevrolet Onix Hatchback es un vehículo compacto y dinámico que combina estilo y practicidad. Con un diseño moderno y audaz, destaca en el camino y llama la atención.",
        "Su interior espacioso y bien diseñado ofrece comodidad para todos los ocupantes, junto con un generoso espacio de carga en el maletero. Perfecto para la vida urbana, el Chevrolet Onix Hatchback se desliza ágilmente por las calles estrechas y congestas de la ciudad.",
        "Además, cuenta con tecnología avanzada que mejora la conectividad y la seguridad, brindando una experiencia de conducción más placentera y segura. Con un eficiente consumo de combustible y un rendimiento confiable, el Chevrolet Onix Hatchback es una opción atractiva para aquellos que buscan un automóvil versátil y asequible para sus desplazamientos diarios en Bogotá.",
      ],
    },
    {
      title: "Hyundai Accent Hatchback",
      paragraphs: [
        "El Hyundai Accent Hatchback es un automóvil compacto que destaca por su estilo moderno y elegante. Su diseño aerodinámico y líneas bien definidas le otorgan una presencia atractiva en la carretera.",
        "Además de su aspecto llamativo, ofrece un interior espacioso y confortable, con asientos cómodos y una buena cantidad de espacio para los pasajeros y el equipaje. Su tamaño compacto lo hace ideal para la conducción en entornos urbanos, permitiendo maniobrar con facilidad y encontrar estacionamiento sin problemas.",
        "El Hyundai Accent Hatchback también cuenta con una variedad de características tecnológicas y de seguridad, proporcionando una experiencia de conducción segura y conectada.",
        "Con un rendimiento eficiente en cuanto a consumo de combustible, este hatchback es una opción atractiva para aquellos que buscan un automóvil fiable y versátil para sus desplazamientos diarios.",
      ],
    },
    {
      title: "Mazda 3 Hatchback",
      paragraphs: [
        "El Mazda 3 Hatchback es un automóvil compacto que se destaca por su elegante diseño y su enfoque en la experiencia de conducción. Con líneas fluidas y una apariencia sofisticada, este hatchback cautiva con su estilo moderno y distintivo.",
        "El interior del Mazda 3 Hatchback ofrece un ambiente refinado y bien construido, con materiales de alta calidad y asientos cómodos que brindan una sensación de lujo. Su conducción ágil y precisa, junto con su suspensión bien ajustada, hacen que cada viaje sea placentero y emocionante.",
        "Además de su rendimiento dinámico, este automóvil también viene equipado con tecnología avanzada, características de seguridad destacadas y una conectividad intuitiva, brindando una experiencia de conducción completa y satisfactoria. Si buscas un hatchback que combine estilo, desempeño y comodidad, el Mazda 3 Hatchback es una opción a considerar en Bogotá.",
      ],
    },
  ],
};

const MOTOS: SeoCategory = {
  key: "motos",
  left: [
    {
      title: "Compra tu moto usada con total transparencia en wcar",
      paragraphs: [
        "En wcar creemos que comprar una moto usada no debería ser una apuesta a ciegas. Por eso te acompañamos en todo el proceso para que elijas una motocicleta de segunda en buen estado mecánico, con información clara, precios justos y opciones reales de financiación. Aquí no vendemos ilusiones, vendemos motos revisadas y decisiones bien tomadas.",
      ],
    },
    {
      title: "Motocicleta de segunda y motos de segunda mano verificadas",
      paragraphs: [
        "Comprar una motocicleta de segunda o una de las tantas motos de segunda mano del mercado puede ser un dolor de cabeza si no sabes qué revisar. En wcar hacemos el trabajo pesado por ti: revisión técnica, validación legal y análisis real del estado de la moto.",
        'Nada de "está como nueva" cuando no lo está. Te decimos lo bueno, lo regular y lo que debes tener en cuenta antes de comprar.',
      ],
    },
    {
      title: "Concesionario de motos usadas y de segunda en Colombia",
      paragraphs: [
        "wcar es un concesionario de motos usadas pensado para quienes valoran la información clara. No somos un lote improvisado ni un intermediario oscuro.",
        "Como concesionario de motos de segunda, te mostramos el historial, el estado real y el precio lógico de cada moto. Aquí compras con criterio, no con afán.",
      ],
    },
    {
      title: "Compra de motos usadas y opciones para vender tu moto usada",
      paragraphs: [
        "Nos especializamos en la compra de motos usadas, tanto para quienes buscan su próxima moto como para quienes necesitan vender su moto usada sin vueltas ni promesas falsas.",
        "Si vas a comprar, te asesoramos para que no pagues de más.",
        "Si vas a vender, te decimos cuánto vale realmente tu moto hoy en el mercado colombiano, sin inflarla para después bajarte el precio.",
      ],
    },
    {
      title: "Motos usadas a crédito y motos de segunda financiadas",
      paragraphs: [
        "Sí, en wcar también encuentras motos usadas a crédito, motos de segunda a crédito y motos de segunda financiadas.",
        "Te explicamos las condiciones sin enredos: cuotas, plazos, tasas y lo que realmente vas a pagar. Nada de letras pequeñas ni cuotas imposibles.",
        "Si una financiación no te conviene, te lo decimos de frente. Transparencia brutal, así de simple.",
      ],
    },
    {
      title: "Motos deportivas económicas y motos buenas, bonitas y baratas",
      paragraphs: [
        "No todo el mundo busca una moto nueva de vitrina. Muchos quieren motos deportivas económicas o una moto buena, bonita y barata para el día a día.",
        "En wcar te ayudamos a encontrar opciones que valgan la pena por precio, rendimiento y estado mecánico. No vendemos gangas milagrosas, vendemos motos que cumplen lo que prometen.",
      ],
    },
    {
      title: "Motoneta usada barata y motos urbanas para el día a día",
      paragraphs: [
        "Si lo que necesitas es movilidad práctica, una motoneta usada barata puede ser la mejor decisión.",
        "Te asesoramos para elegir motos urbanas que no te dejen botado, que consuman poco y que realmente se adapten a tu presupuesto. Ideal para trabajo, estudio o moverte por la ciudad sin complicarte.",
      ],
    },
    {
      title: "Motos Usadas con Peritaje Colserautos",
      paragraphs: [
        'En wcar, además de nuestra revisión técnica interna, todas las motos pasan por Colserautos, una empresa especializada en peritajes en Colombia. Esto nos permite validar de manera independiente el estado estructural, mecánico y legal de cada moto usada. El resultado es simple: información clara, sin conflictos de interés y decisiones de compra con respaldo real. No confiamos solo en "lo que parece estar bien", lo comprobamos.',
      ],
    },
  ],
  right: [
    {
      title: "¿Qué es una motocicleta de segunda?",
      paragraphs: [
        "Una motocicleta de segunda es una moto que ya tuvo uso previo. En wcar no solo verificamos su funcionamiento, sino que además la enviamos a peritaje con Colserautos, para confirmar su estado real antes de ofrecerla al público. Así evitas sorpresas después de la compra.",
      ],
    },
    {
      title: "¿Es seguro comprar motos de segunda mano en Colombia?",
      paragraphs: [
        "Sí, siempre que exista revisión y respaldo. En wcar combinamos nuestra evaluación técnica con un peritaje independiente de Colserautos, lo que permite confirmar estado mecánico, estructural y legal. Comprar motos de segunda mano sin peritaje es asumir un riesgo innecesario.",
      ],
    },
    {
      title: "¿Qué ventaja tiene comprar en un concesionario de motos usadas como wcar?",
      paragraphs: [
        "Un concesionario de motos usadas debe ofrecer más que vitrinas bonitas. En wcar entregamos información verificada, revisión técnica y peritaje Colserautos, para que compres con datos reales y no con promesas.",
      ],
    },
    {
      title: "¿Qué revisa wcar antes de vender una moto usada?",
      paragraphs: ["Antes de vender una moto:"],
      bullets: [
        "Hacemos revisión técnica interna",
        "Validamos documentación y antecedentes",
        "Enviamos la moto a peritaje con Colserautos. Este proceso nos permite identificar desgastes, golpes estructurales o inconsistencias que no siempre se ven a simple vista.",
      ],
    },
    {
      title: "¿Qué es un peritaje de motos y por qué es importante?",
      paragraphs: [
        "Un peritaje es una evaluación técnica especializada. El peritaje Colserautos revisa estructura, motor, chasis y antecedentes, entregando un informe objetivo. En wcar usamos este peritaje para respaldar cada decisión de compra y venta.",
      ],
    },
    {
      title: "¿Puedo comprar motos usadas a crédito con peritaje incluido?",
      paragraphs: [
        "Sí. Todas nuestras motos usadas a crédito y motos de segunda financiadas pasan primero por peritaje. Así sabes exactamente qué estás financiando y en qué estado real se encuentra la moto.",
      ],
    },
    {
      title: "¿El peritaje Colserautos tiene costo adicional para el comprador?",
      paragraphs: [
        "No. El peritaje hace parte del proceso de validación de wcar. Preferimos asumir ese costo antes que vender una moto sin información completa. Transparencia brutal, incluso cuando implica más trabajo para nosotros.",
      ],
    },
    {
      title: "¿Puedo vender mi moto usada a wcar aunque no tenga peritaje?",
      paragraphs: [
        "Sí. Si deseas vender tu moto usada, en wcar evaluamos el vehículo y, si es viable, lo enviamos a peritaje con Colserautos para definir su estado real y su precio de mercado. Eso evita sobrevalorar o subvalorar la moto.",
      ],
    },
    {
      title: "¿El peritaje aplica también para motonetas usadas y motos económicas?",
      paragraphs: [
        "Sí. Tanto una motoneta usada barata como una moto deportiva o urbana pasa por el mismo proceso. No hacemos excepciones según el precio; todas las motos deben cumplir estándares mínimos.",
      ],
    },
    {
      title: "¿Por qué wcar usa un peritaje externo y no solo revisión interna?",
      paragraphs: [
        "Porque un tercero especializado como Colserautos elimina sesgos y genera confianza. En wcar creemos que la información debe ser verificable y objetiva, no solo una opinión del vendedor.",
      ],
    },
    {
      title: "¿Qué gana el comprador con este proceso?",
      paragraphs: [
        "Gana tranquilidad. Comprar una moto usada con revisión interna + peritaje Colserautos reduce riesgos, evita gastos inesperados y permite tomar una decisión informada desde el día uno.",
      ],
    },
  ],
};

export const SEO_CATEGORIES: Record<SeoCategoryKey, SeoCategory> = {
  camionetas: CAMIONETAS,
  coupe: COUPE,
  hibridos: HIBRIDOS,
  sedan: SEDAN,
  hatchback: HATCHBACK,
  motos: MOTOS,
};
