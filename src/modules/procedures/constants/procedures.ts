import type { Procedure } from "../types/procedure";

/**
 * Los seis trámites, en el orden del diseño. No vienen de ningún endpoint (el
 * backend no tiene uno de trámites: `/procedures/` y `/tramites/` dan 404) sino
 * de una lista fija, igual que en el sitio anterior, de donde salen los textos
 * tal cual (`getProcedures` de wcar.co no llamaba a la API).
 *
 * TODO: confirmar con diseño el copy. Se conserva sin corregir:
 * - "Levantamiento de Prenda" repite casi entero el párrafo de "Inscripción de
 *   Prenda" (cambia "registra" por "cancela"), incluida la frase de las improntas.
 * - "Liquidación de Impuestos y Comparendos" solo habla del impuesto del
 *   vehículo, no de los comparendos, y nombra "WCAR Trámites" en mayúsculas
 *   mientras el resto del sitio escribe "wcar".
 */
export const PROCEDURES: Procedure[] = [
  {
    id: "cambio-propietario",
    title: "Traspasos",
    description:
      "Mediante este trámite se realiza el cambio de propietario de un vehículo usado. Los costos de tramitador y traspaso dependen del organismo de tránsito donde esté registrado el vehículo. El valor de las toma de improntas estará incluido en el valor que se indique y podrán ser tomadas a domicilio en la ciudad de Bogotá sin ningún costo adicional.",
  },
  {
    id: "inscripcion-prenda",
    title: "Inscripción de Prenda",
    description:
      "Mediante este trámite se registra un contrato de prenda por parte de un banco, financiera, persona jurídica o persona natural. Los valores se liquidarán específicamente cuando se reciban y revisen los documentos, pues depende del organismo de tránsito en donde se deba registrar la prenda. El valor de la toma de improntas estará incluido en el valor que se indique y podrán ser tomadas a domicilio en la ciudad de Bogotá sin ningún costo adicional.",
  },
  {
    id: "levantamiento-prenda",
    title: "Levantamiento de Prenda",
    description:
      "Mediante este trámite se cancela un contrato de prenda por parte de un banco, financiera, persona jurídica o persona natural. Los valores se liquidarán específicamente cuando se reciban y revisen los documentos, pues depende del organismo de tránsito en donde se deba registrar la prenda. El valor de la toma de improntas estará incluido en el valor que se indique y podrán ser tomadas a domicilio en la ciudad de Bogotá sin ningún costo adicional.",
  },
  {
    id: "liquidacion-impuestos",
    title: "Liquidación de Impuestos y Comparendos",
    description:
      "El impuesto del vehículo es el valor anual que se debe pagar al territorio en donde se tiene registrado el vehículo. Dicho pago debe ser realizado por el propietario. En WCAR Trámites, te ayudamos a liquidar dichos impuestos para que los puedas pagar de forma ágil y sencilla.",
  },
  {
    id: "traslado-radicacion-cuenta",
    title: "Traslado y Radicación de Cuenta",
    description:
      "Consiste en trasladar la matrícula de un vehículo desde el organismo de tránsito donde se encuentra radicado, a la ciudad que desees.",
  },
  {
    id: "juicios-sucesion",
    title: "Juicios de Sucesión",
    description:
      "Cuando un vehículo se encuentra a nombre de una persona que tristemente ha fallecido, los herederos deben resolver el traslado de propiedad. Dicho proceso es complejo y requiere la asesoría de abogados expertos en la materia. En WCAR te ayudamos, para que ese duro momento de tu vida sea un poco más llevadero.",
  },
];
