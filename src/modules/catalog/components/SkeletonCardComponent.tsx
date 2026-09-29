/**
 * Placeholder de una tarjeta mientras `searchVehicles` resuelve: copia la estructura de
 * `VehicleCardComponent` (foto, pastilla, nombre, tipo, datos, precio y botón) con bloques de
 * gris azulado lo bastante oscuros para notarse sobre el fondo gris de la grilla.
 */
export default function SkeletonCardComponent() {
  return (
    <div
      aria-hidden
      className="flex animate-pulse flex-col overflow-hidden rounded-lg bg-white shadow-[0_7px_14px_rgba(211,218,226,0.4)]"
    >
      <div className="aspect-[3/2] bg-gray/25" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-[26px] w-36 rounded-full bg-gray/25" />
        <div className="h-5 w-4/5 rounded bg-gray/30" />
        <div className="h-5 w-3/5 rounded bg-gray/30" />
        <div className="h-4 w-1/3 rounded bg-gray/25" />
        <div className="flex gap-6">
          <div className="h-4 w-20 rounded bg-gray/25" />
          <div className="h-4 w-24 rounded bg-gray/25" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="h-7 w-32 rounded bg-gray/35" />
          <div className="h-10 w-[91px] rounded-bl-[30px] rounded-tr-[30px] bg-gray/35" />
        </div>
      </div>
    </div>
  );
}
