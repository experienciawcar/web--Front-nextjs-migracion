"use client";

import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";

import diagBodywork from "../assets/expertise/diag-carroceria.svg";
import diagFluids from "../assets/expertise/diag-fluidos.svg";
import diagPaint from "../assets/expertise/diag-pintura.svg";
import diagStructure from "../assets/expertise/diag-estructura.svg";
import logoAutomas from "../assets/expertise/logo-automas.webp";
import logoWcar from "../assets/expertise/logo-wcar-horizontal.svg";
import vehicleTypeIcon from "../assets/expertise/tipo-automovil.svg";
import "../styles/expertise-report.css";

import type { ExpertiseCategory, ExpertiseReport } from "../types/expertise";
import {
  paginateExpertise,
  type ExpertisePiece,
  type NoveltyPart,
} from "../utils/expertise-pages";

const SHEET_WIDTH = 794;

const CATEGORY_ICONS: Record<ExpertiseCategory["icon"], typeof diagBodywork> = {
  structure: diagStructure,
  bodywork: diagBodywork,
  paint: diagPaint,
  fluids: diagFluids,
};

const DIAGNOSIS_TITLE = "DIAGNÓSTICO DE INSPECCIÓN";
const DIAGNOSIS_DESCRIPTION =
  "Evaluación integral la cual especifica el estado de las partes del vehículo";

function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`pa-tarjeta ${className}`}>
      <div className="pa-tarjeta__cuerpo">{children}</div>
    </div>
  );
}

function CardBar({ children }: { children: React.ReactNode }) {
  return <h2 className="pa-tarjeta__titulo pa-tarjeta__titulo--barra">{children}</h2>;
}

function Photo({ src, alt }: { src: string | undefined; alt: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <figure className="pa-foto">
      <div className="pa-foto__marco">
        {!src || failed ? (
          <span className="pa-foto__vacia">Sin fotografía</span>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
        )}
      </div>
    </figure>
  );
}

function SheetHeader({ report }: { report: ExpertiseReport }) {
  return (
    <header className="pa-cabecera">
      <Image src={logoAutomas} alt="Automás" className="pa-cabecera__logo" />
      <span className="pa-cabecera__sep" />
      <Image src={logoWcar} alt="Wcar" className="pa-cabecera__wcar" />
      <span className="pa-cabecera__punto" aria-hidden>
        ·
      </span>
      <p className="pa-cabecera__sello">Peritaje oficial</p>
      <div className="pa-cabecera__acta">
        <p>
          Acta No. <b>{report.record}</b>
        </p>
        <span>{report.date}</span>
      </div>
    </header>
  );
}

function Legend() {
  return (
    <ul className="pa-leyenda">
      <li>
        <span className="pa-leyenda__punto pa-leyenda__punto--good" />
        Sin novedades
      </li>
      <li aria-hidden className="pa-leyenda__bullet">
        •
      </li>
      <li>
        <span className="pa-leyenda__punto pa-leyenda__punto--fair" />
        Leves
      </li>
      <li aria-hidden className="pa-leyenda__bullet">
        •
      </li>
      <li>
        <span className="pa-leyenda__punto pa-leyenda__punto--bad" />
        Requiere atención
      </li>
    </ul>
  );
}

function SectionTitle({ withIcon }: { withIcon?: boolean }) {
  return (
    <div className="pa-seccion">
      {withIcon && (
        <Image src={diagBodywork} alt="" aria-hidden className="pa-seccion__icono" />
      )}
      <div className="pa-seccion__texto">
        <h2>{DIAGNOSIS_TITLE}</h2>
        <p>{DIAGNOSIS_DESCRIPTION}</p>
      </div>
    </div>
  );
}

function Cover({ report }: { report: ExpertiseReport }) {
  return (
    <div>
      <div className="pa-resumen">
        <div className="pa-resumen__placa">
          <span>PLACA</span>
          <b>{report.plate}</b>
        </div>
        <h1 className="pa-resumen__titulo">{report.title}</h1>
        <div className="pa-resumen__sellos">
          {report.insurable !== "unknown" && (
            <p className={`pa-badge pa-badge--${report.insurable === "yes" ? "ok" : "alerta"}`}>
              Asegurable: <b>{report.insurable === "yes" ? "Sí" : "No"}</b>
            </p>
          )}
        </div>
        <span className="pa-resumen__tipo">
          <Image src={vehicleTypeIcon} alt="" aria-hidden />
        </span>
        <div className="pa-resumen__detalle">
          {report.summary.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <div className="pa-resumen__servicio">
          {report.service.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>

      <div className="pa-galeria">
        {[0, 1, 2].map((index) => (
          <Photo
            key={index}
            src={report.photos[index]}
            alt={`Fotografía ${index + 1} del peritaje`}
          />
        ))}
      </div>

      <Card className="pa-tarjeta--diagnostico">
        <div className="pa-tarjeta__encabezado">
          <SectionTitle withIcon />
          <Legend />
        </div>
        <ul className="pa-diagnostico">
          {report.categories.map((category) => (
            <li key={category.label} className="pa-diag">
              <span className="pa-diag__icono">
                <Image src={CATEGORY_ICONS[category.icon]} alt="" aria-hidden />
              </span>
              <div className="pa-diag__texto">
                <h3>{category.label}</h3>
                <p>{category.detail}</p>
              </div>
              <b className={`pa-score pa-diag__score pa-score--${category.tone}`}>
                {category.summary}
              </b>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function NoveltyGroup({ group }: { group: NoveltyPart }) {
  return (
    <section className="pa-novedades__grupo">
      <h3>
        {group.title}
        {group.continued && <span> (cont.)</span>}
      </h3>
      <ul>
        {group.items.map((item, index) => (
          <li key={`${item.part}-${index}`}>
            <span>{item.part}</span>
            <b className={`pa-novedades__estado pa-novedades__estado--${item.tone}`}>
              {item.state}
            </b>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Piece({ piece, report }: { piece: ExpertisePiece; report: ExpertiseReport }) {
  switch (piece.kind) {
    case "novelties":
      return (
        <Card className="pa-tarjeta--novedades">
          <CardBar>
            NOVEDADES ENCONTRADAS{" "}
            <span>
              {`${report.totalNovelties} en total${piece.continued ? " · continuación" : ""}`}
            </span>
          </CardBar>
          <div className="pa-novedades">
            {piece.columns.map((column, index) => (
              <div key={index} className="pa-novedades__columna">
                {column.map((group) => (
                  <NoveltyGroup key={group.title} group={group} />
                ))}
              </div>
            ))}
          </div>
        </Card>
      );
    case "notes":
      return (
        <Card className="pa-tarjeta--notas">
          <div className="pa-tarjeta__encabezado">
            <SectionTitle withIcon />
          </div>
          <div className="pa-notas">
            <article>
              <h3>Observaciones</h3>
              <p>{report.observations || "Sin observaciones registradas en este peritaje."}</p>
            </article>
          </div>
        </Card>
      );
    case "columns":
      return (
        <div className="pa-columnas">
          <Card className="pa-tarjeta--accesorios">
            <CardBar>ACCESORIOS</CardBar>
            {report.accessories.length > 0 ? (
              <table className="pa-accesorios">
                <thead>
                  <tr>
                    <th scope="col">CANT</th>
                    <th scope="col">DESCRIPCIÓN</th>
                    <th scope="col">MARCA</th>
                    <th scope="col">VALOR</th>
                  </tr>
                </thead>
                <tbody>
                  {report.accessories.map((accessory, index) => (
                    <tr key={`${accessory.description}-${index}`}>
                      <td className="pa-accesorios__cant">{accessory.quantity}</td>
                      <td>{accessory.description}</td>
                      <td className="pa-accesorios__marca">
                        {accessory.brand ?? <span className="pa-guion" />}
                      </td>
                      <td className="pa-accesorios__valor">{accessory.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="pa-sin-datos">Este peritaje no registra accesorios.</p>
            )}
          </Card>
          <Card className="pa-tarjeta--valores">
            <CardBar>VALORES</CardBar>
            <ul className="pa-valores">
              {report.values.map((value) => (
                <li key={value.title}>
                  <div>
                    <b>{value.title}</b>
                    <span>{value.subtitle}</span>
                  </div>
                  <strong>{value.value}</strong>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      );
    case "details":
      return (
        <Card className="pa-tarjeta--detalles">
          <CardBar>
            DETALLES DEL VEHÍCULO {piece.continued && <span>continuación</span>}
          </CardBar>
          {piece.withType && (
            <div className="pa-campo pa-campo--ancho">
              <span>TIPO</span>
              <b>{report.type}</b>
            </div>
          )}
          <dl className="pa-detalles">
            {piece.rows.flat().map((field) => (
              <div key={field.label} className="pa-campo">
                <dt>{field.label}</dt>
                <dd>{field.value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      );
    case "annex":
      return (
        <Card className="pa-tarjeta--anexo">
          <CardBar>
            ANEXO FOTOGRÁFICO <span>{`${piece.number} de ${piece.total}`}</span>
          </CardBar>
          <div className="pa-anexo">
            {piece.photos.map((photo, index) => (
              <Photo key={photo} src={photo} alt={`Fotografía ${index + 1} del anexo ${piece.number}`} />
            ))}
          </div>
        </Card>
      );
  }
}

/**
 * El certificado de Automás: hojas A4 de 794 px (cabecera con logos y acta, portada con placa,
 * fotos y diagnóstico, novedades, observaciones, accesorios, valores, detalles y anexo
 * fotográfico) bajo una barra azul con el título y el cierre. Es el certificado del sitio de
 * referencia (`docs/VER_PERITAJE.md` §5.3-5.4) con sus mismas medidas (`styles/expertise-report.css`);
 * el reparto en hojas está en `utils/expertise-pages.ts`. Si el visor es más angosto que la hoja,
 * las hojas se reducen a su ancho con `zoom`.
 */
export default function ExpertiseReportComponent({
  report,
  onClose,
}: {
  report: ExpertiseReport;
  onClose: () => void;
}) {
  const sheets = useMemo(() => paginateExpertise(report), [report]);
  const [scale, setScale] = useState(1);
  const observer = useRef<ResizeObserver | null>(null);

  const bodyRef = useCallback((element: HTMLDivElement | null) => {
    observer.current?.disconnect();
    if (!element) return;
    const update = () => {
      const style = getComputedStyle(element);
      const width =
        element.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      setScale(Math.min(1, width / SHEET_WIDTH));
    };
    update();
    observer.current = new ResizeObserver(update);
    observer.current.observe(element);
  }, []);

  return (
    <>
      <div className="pa-toolbar">
        <div className="pa-toolbar__title">
          Certificado de peritaje
          <span className="pa-toolbar__sub">Placa {report.plate}</span>
        </div>
        <div className="pa-toolbar__actions">
          <button type="button" aria-label="Cerrar" onClick={onClose} className="cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
              <path d="M2 2L14 14M14 2L2 14" />
            </svg>
          </button>
        </div>
      </div>
      <div ref={bodyRef} className="pa-overlay__body">
        <div className="pa-doc">
          {sheets.map((sheet, index) => (
            <section
              key={index}
              className="pa-hoja"
              style={scale < 1 ? { zoom: scale } : undefined}
            >
              <SheetHeader report={report} />
              {index === 0 ? (
                <div className="pa-flujo pa-flujo--portada">
                  <Cover report={report} />
                  {sheet.map((piece, position) => (
                    <Piece key={position} piece={piece} report={report} />
                  ))}
                </div>
              ) : (
                <div className="pa-flujo">
                  {sheet.map((piece, position) => (
                    <Piece key={position} piece={piece} report={report} />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
