/** Lo que el sitio anterior cambiaba en el texto de la IA, que a veces habla del vehículo como nuevo (`featureList`). */
const REPLACEMENTS: [string, string][] = [
  ["**condición de nuevo**", "**condición de usado**"],
  ["condición de nuevo", "condición de usado"],
  ["condición nueva", "condición usada"],
  ["estado nuevo", "condición usado"],
  [
    "lo que significa que está listo para ofrecer una experiencia de conducción excepcional desde el primer momento.",
    "",
  ],
];

/** `**negrita**` dentro de una línea, sin más Markdown (el texto de la IA solo trae eso y viñetas). */
function renderInline(line: string): React.ReactNode[] {
  return line
    .split(/(\*\*[^*]+\*\*)/g)
    .map((part, index) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={index}>{part.slice(2, -2)}</strong>
      ) : (
        part
      ),
    );
}

/**
 * Descripción del vehículo generada por IA (`description_ai`). Entra como texto y se pinta como
 * React (nunca como HTML): párrafos separados por línea en blanco, viñetas (`- `/`* `) y
 * negritas (`**`). Aplica los mismos reemplazos que el sitio anterior ("condición de nuevo" →
 * "condición de usado") y avisa, como en él, que la escribió una IA y puede tener errores.
 */
export default function VehicleAiDescriptionComponent({
  text,
}: {
  text: string;
}) {
  let cleaned = text;
  for (const [from, to] of REPLACEMENTS) cleaned = cleaned.replace(from, to);

  const blocks = cleaned
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="flex max-w-[680px] flex-col gap-4 text-body leading-6 font-medium text-gray-dark">
      {blocks.map((block, index) => {
        const lines = block
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        const isList = lines.every((line) => /^[-*]\s+/.test(line));
        return isList ? (
          <ul key={index} className="list-disc pl-6">
            {lines.map((line) => (
              <li key={line}>{renderInline(line.replace(/^[-*]\s+/, ""))}</li>
            ))}
          </ul>
        ) : (
          <p key={index}>
            {lines.flatMap((line, i) =>
              i === 0
                ? renderInline(line)
                : [<br key={`br-${i}`} />, ...renderInline(line)],
            )}
          </p>
        );
      })}
      <p className="text-caption text-gray">
        Esta descripción ha sido generada por inteligencia artificial y puede
        contener errores.
      </p>
    </div>
  );
}
