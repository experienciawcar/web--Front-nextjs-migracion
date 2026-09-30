/**
 * Esqueleto de la ficha mientras llega. Con él, al tocar una tarjeta del catálogo la pantalla
 * cambia al instante (Next precarga este fallback) en vez de quedarse quieta esperando al servidor.
 * Imita la parte de arriba de `VehicleTopComponent`: galería a la izquierda y tarjeta de resumen.
 */
export default function VehicleLoading() {
  return (
    <main className="flex-1" aria-busy="true" aria-label="Cargando el vehículo">
      <section className="bg-gray-light pb-8 xl:pb-[33px]">
        <div className="mx-auto w-full max-w-[1368px] px-8 pt-10 max-xl:px-4 xl:pt-4">
          <div className="flex min-h-[38px] items-center xl:h-[54px]">
            <div className="h-5 w-20 animate-pulse rounded bg-gray/20" />
          </div>
          <div className="mt-2 grid grid-cols-[minmax(0,1fr)] gap-6 xl:mt-0 xl:grid-cols-[minmax(0,1fr)_440px] xl:gap-4">
            <div className="aspect-[787/510] animate-pulse rounded-2xl bg-gray/20" />
            <div className="h-[420px] animate-pulse rounded-2xl bg-white max-xl:-mx-4 max-xl:rounded-none xl:h-full" />
          </div>
        </div>
      </section>
    </main>
  );
}
