import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Genera .next/standalone (servidor mínimo) para la imagen de Docker / Cloud Run.
  output: "standalone",
  images: {
    remotePatterns: [
      // Fotos de los asesores (GET /api/advisors/). El backend las entrega
      // como URLs firmadas de Google Cloud Storage, así que el query string
      // (X-Goog-Signature, etc.) cambia en cada respuesta y no se puede fijar
      // con `search`. Lo que sí se restringe es el bucket y la carpeta.
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/wcar-images/advisors/**",
      },
      // Íconos de los tipos de vehículo del navbar (GET /api/type-cars/). Mismo
      // bucket y mismas URLs firmadas. Ojo: la carpeta se llama "images-tpyes"
      // en el bucket (con el typo); no es un error de esta configuración.
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/wcar-images/images-tpyes/**",
      },
      // Logos de las marcas (GET /api/v2/brands/, filtro "Marca y modelo"). Mismo
      // bucket y mismas URLs firmadas.
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/wcar-images/images-brands/**",
      },
      // Logos de los aliados (GET /api/partners/). Mismo bucket y mismas URLs
      // firmadas.
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/wcar-images/partners/**",
      },
      // Fotos de los artículos del blog (GET /api/post/). Mismo bucket y mismas
      // URLs firmadas.
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/wcar-images/post_file/**",
      },
    ],
  },
};

export default nextConfig;
