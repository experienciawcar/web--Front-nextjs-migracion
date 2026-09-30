import type { ExpertiseFinding, ExpertiseReport } from "../types/expertise";

const TONES: Record<ExpertiseFinding["tone"], string> = {
  good: "bg-[#e3f7c8] text-[#3c6a0b]",
  fair: "bg-[#fff1c9] text-[#8a5a00]",
  bad: "bg-[#fde0dc] text-[#a3261a]",
};

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("es-CO", {
        timeZone: "UTC",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h3 className="border-b border-[#c2d3ed] pb-2 text-body font-bold text-dark-gray uppercase">
        {title}
      </h3>
      {children}
    </section>
  );
}

function FieldGrid({ fields }: { fields: { label: string; value: string }[] }) {
  return (
    <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-4">
      {fields.map((field) => (
        <div key={field.label} className="min-w-0">
          <dt className="text-caption font-medium text-gray">{field.label}</dt>
          <dd className="text-small font-bold text-dark-gray">{field.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * El certificado de Automás en la ficha: cabecera (acta, fecha, centro y placa enmascarada),
 * datos del vehículo, valores, inspección visual con un color por estado, accesorios,
 * observaciones y las fotos. Es una versión sencilla del certificado A4 paginado del sitio
 * anterior (`docs/VER_PERITAJE.md` §5.3-5.4): el contenido es el mismo, sin la paginación.
 */
export default function ExpertiseReportComponent({
  report,
  vehicleName,
}: {
  report: ExpertiseReport;
  vehicleName: string;
}) {
  const date = formatDate(report.date);
  const meta = [
    `Acta ${report.inspectionNumber}`,
    date,
    report.center,
    `Placa ${report.plate}`,
  ].filter(Boolean);

  return (
    <article className="px-6 pt-6 pb-10">
      <p className="text-caption font-bold tracking-wide text-orange uppercase">
        Certificado de peritaje · Automás
      </p>
      <h3 className="mt-1 text-heading-1 font-bold text-dark-gray">
        {report.title}
      </h3>
      <p className="mt-1 text-small font-medium text-gray-dark">
        {meta.join(" · ")}
      </p>

      {report.details.length > 0 && (
        <Section title="Datos del vehículo">
          <FieldGrid fields={report.details} />
        </Section>
      )}

      {report.values.length > 0 && (
        <Section title="Valores">
          <FieldGrid fields={report.values} />
        </Section>
      )}

      {report.findings.length > 0 && (
        <Section title="Inspección visual">
          <ul className="mt-4 grid gap-2 md:grid-cols-2">
            {report.findings.map((finding, index) => (
              <li
                key={`${finding.item}-${index}`}
                className="flex items-center justify-between gap-3 rounded-lg bg-gray-light px-4 py-2"
              >
                <span className="min-w-0 text-small font-medium text-dark-gray">
                  {finding.item}
                  {finding.note && (
                    <span className="block text-caption text-gray-dark">
                      {finding.note}
                    </span>
                  )}
                </span>
                <span
                  className={`shrink-0 rounded-full px-3 text-caption font-bold ${TONES[finding.tone]}`}
                >
                  {finding.state}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {report.observations.length > 0 && (
        <Section title="Observaciones">
          <ul className="mt-4 list-disc space-y-1 pl-5 text-small font-medium text-gray-dark">
            {report.observations.map((observation, index) => (
              <li key={index}>{observation}</li>
            ))}
          </ul>
        </Section>
      )}

      {report.accessories.length > 0 && (
        <Section title="Accesorios">
          <ul className="mt-4 list-disc space-y-1 pl-5 text-small font-medium text-gray-dark">
            {report.accessories.map((accessory, index) => (
              <li key={index}>{accessory}</li>
            ))}
          </ul>
        </Section>
      )}

      {report.photos.length > 0 && (
        <Section title="Anexo fotográfico">
          <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
            {report.photos.map((photo, index) => (
              <li key={photo}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo}
                  alt={`Foto ${index + 1} del peritaje de ${vehicleName}`}
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-lg object-cover"
                />
              </li>
            ))}
          </ul>
        </Section>
      )}
    </article>
  );
}
