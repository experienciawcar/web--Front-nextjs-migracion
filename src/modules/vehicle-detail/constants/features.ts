import type { StaticImageData } from "next/image";

import iconAirbags from "../assets/features/airbags.webp";
import iconAireAcondicionado from "../assets/features/aire-acondicionado.webp";
import iconAlarma from "../assets/features/alarma.webp";
import iconAnticolision from "../assets/features/anticolision.webp";
import iconBaulAutomatico from "../assets/features/baul-automatico.webp";
import iconBluetooth from "../assets/features/bluetooth.webp";
import iconCalefaccionSillas from "../assets/features/calefaccion-sillas.webp";
import iconCalificacionSeguridad from "../assets/features/calificacion-seguridad.webp";
import iconCamara360 from "../assets/features/camara-360.webp";
import iconCamaraTrasera from "../assets/features/camara-trasera.webp";
import iconCilindraje from "../assets/features/cilindraje.webp";
import iconCaja from "../assets/features/caja.webp";
import iconCombustible from "../assets/features/combustible.webp";
import iconDireccion from "../assets/features/direccion.webp";
import iconEntretenimiento from "../assets/features/entretenimiento.webp";
import iconEspejosElectricos from "../assets/features/espejos-electricos.webp";
import iconExploradoras from "../assets/features/exploradoras.webp";
import iconFrenosAbs from "../assets/features/frenos-abs.webp";
import iconGenerico from "../assets/features/generico.webp";
import iconKitCarretera from "../assets/features/kit-carretera.webp";
import iconLlantaRepuesto from "../assets/features/llanta-repuesto.webp";
import iconLlaves from "../assets/features/llaves.webp";
import iconPedales from "../assets/features/pedales.webp";
import iconPuestos from "../assets/features/puestos.webp";
import iconRines from "../assets/features/rines.webp";
import iconSensorLluvia from "../assets/features/sensor-lluvia.webp";
import iconSensorLuz from "../assets/features/sensor-luz.webp";
import iconSensoresReversa from "../assets/features/sensores-reversa.webp";
import iconSillasElectricas from "../assets/features/sillas-electricas.webp";
import iconSillas from "../assets/features/sillas.webp";
import iconSunroof from "../assets/features/sunroof.webp";
import iconTimonAjustable from "../assets/features/timon-ajustable.webp";
import iconTipoVehiculo from "../assets/features/tipo-vehiculo.webp";
import iconTraccion from "../assets/features/traccion.webp";
import iconTurbo from "../assets/features/turbo.webp";
import iconUsb from "../assets/features/usb.webp";

export type FeatureDefinition = {
  label: string;
  icon: StaticImageData;
  kind?: "date";
};

/**
 * Qué es cada fila de `description_list` (`item`): su etiqueta y su ícono. Los
 * números y los nombres son los del sitio anterior (wcar.co, `featureList`),
 * leídos de su bundle. Los íconos son los mismos que usa el diseño (sitio
 * anterior, `assets/icons/featureList`), pasados a WebP de 64 px.
 *
 * Diferencia con el sitio anterior: allí los ítems 24, 25 y 26 (USB, sensor de
 * lluvia, sensor de luz) mostraban el valor de los ítems 22, 23 y 24 por un
 * copia-y-pega (`docs/DETALLE_VEHICULO.md` §7.9); aquí cada uno muestra el suyo.
 */

/** Grupo 1, "Historial, documentación y llaves". */
export const HISTORY_ITEMS: Record<number, FeatureDefinition> = {
  42: { label: "Número de llaves", icon: iconLlaves },
  4: { label: "Fecha de vencimiento SOAT", icon: iconGenerico, kind: "date" },
  5: {
    label: "Fecha de vencimiento revisión tecnicomecánica",
    icon: iconGenerico,
    kind: "date",
  },
  3: { label: "Ciudad de matrícula", icon: iconGenerico },
  1: { label: "Número de propietarios anteriores", icon: iconGenerico },
};

/** Orden en que se listan los datos del historial. */
export const HISTORY_ORDER = [42, 4, 5, 3, 1];

/** Extras de "Características" que salen de `description_list` (el resto sale del vehículo). */
export const CHARACTERISTIC_ITEMS: Record<number, FeatureDefinition> = {
  8: { label: "Número de puestos", icon: iconPuestos },
  7: { label: "Turbo", icon: iconTurbo },
  43: { label: "Cilindraje", icon: iconCilindraje },
  44: { label: "Tipo de combustible", icon: iconCombustible },
  45: { label: "Tipo de caja", icon: iconCaja },
};

/** Grupo 3, "Seguridad". */
export const SAFETY_ITEMS: Record<number, FeatureDefinition> = {
  9: { label: "Airbags", icon: iconAirbags },
  10: { label: "Frenos ABS", icon: iconFrenosAbs },
  11: { label: "Calificación seguridad", icon: iconCalificacionSeguridad },
};
export const SAFETY_ORDER = [9, 10, 11];

/** Grupo 4, "Accesorios y equipamiento". */
export const EQUIPMENT_ITEMS: Record<number, FeatureDefinition> = {
  12: { label: "Sillas", icon: iconSillas },
  13: { label: "Tipo de radio", icon: iconGenerico },
  14: { label: "Entretenimiento", icon: iconEntretenimiento },
  15: { label: "Sunroof", icon: iconSunroof },
  16: { label: "Rines de lujo", icon: iconRines },
  17: { label: "Sensores de reversa", icon: iconSensoresReversa },
  18: { label: "Cámara trasera", icon: iconCamaraTrasera },
  19: { label: "Cámara 360°", icon: iconCamara360 },
  20: { label: "Alarma", icon: iconAlarma },
  21: { label: "Asistente anti colisión", icon: iconAnticolision },
  22: { label: "Exploradoras", icon: iconExploradoras },
  23: { label: "Bluetooth", icon: iconBluetooth },
  24: { label: "USB", icon: iconUsb },
  25: { label: "Sensor de lluvia", icon: iconSensorLluvia },
  26: { label: "Sensor de luz", icon: iconSensorLuz },
  27: { label: "Vidrios eléctricos", icon: iconGenerico },
  28: { label: "Espejos eléctricos", icon: iconEspejosElectricos },
  29: { label: "Sillas eléctricas", icon: iconSillasElectricas },
  30: { label: "Llanta de repuesto", icon: iconLlantaRepuesto },
  31: { label: "Apertura automática de baúl", icon: iconBaulAutomatico },
  32: { label: "Calefacción en las sillas", icon: iconCalefaccionSillas },
  33: { label: "Timón ajustable", icon: iconTimonAjustable },
  34: { label: "Pedales ajustables", icon: iconPedales },
  35: { label: "Aire acondicionado", icon: iconAireAcondicionado },
  36: { label: "Tipo de dirección", icon: iconDireccion },
  37: { label: "Comandos en el timón", icon: iconTimonAjustable },
  38: { label: "Kit de carretera", icon: iconKitCarretera },
};
export const EQUIPMENT_ORDER = Object.keys(EQUIPMENT_ITEMS).map(Number);

/** Íconos de la lista de "Características" que salen del vehículo mismo. */
export const CHARACTERISTIC_ICONS = {
  engine: iconCilindraje,
  fuel: iconCombustible,
  transmission: iconCaja,
  bodyType: iconTipoVehiculo,
  traction: iconTraccion,
} as const;

/** `traction` del backend → texto (mapa del sitio anterior). */
export const TRACTION_LABELS: Record<number, string> = {
  0: "Trasera",
  1: "4 x 4",
  2: "Delantera",
  3: "4 x 2",
};
