"use client";

import Image from "next/image";
import { useState } from "react";

import googleMapsIcon from "../assets/footer/google-maps-icon.png";
import wazeIcon from "../assets/footer/waze-icon.png";
import { FOOTER_SEDES, type FooterSede } from "../constants/footer-sedes";

const CITIES = Array.from(new Set(FOOTER_SEDES.map((sede) => sede.city)));

const TAB =
  "h-[39px] cursor-pointer rounded-lg bg-gray-light px-[22px] text-body font-bold whitespace-nowrap text-gray-dark";
const TAB_ACTIVE = "bg-orange! text-white!";

const queryOf = (sede: FooterSede) =>
  sede.coords ?? encodeURIComponent(`${sede.address}, Colombia`);

function Iframe({ sede }: { sede: FooterSede }) {
  return (
    <iframe
      key={sede.address}
      title={`Mapa ${sede.title}`}
      src={`https://maps.google.com/maps?q=${queryOf(sede)}&z=16&output=embed`}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="absolute inset-0 size-full border-0"
    />
  );
}

function MapButtons({ sede, className }: { sede: FooterSede; className: string }) {
  const query = queryOf(sede);
  const btn =
    "flex h-[42px] items-center justify-center gap-2 rounded-[0_30px_0_30px] text-small font-bold text-[#0c0c0d]";
  return (
    <div className={className}>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${query}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${btn} border-2 border-orange bg-white`}
      >
        <Image src={googleMapsIcon} alt="" width={16} height={20} />
        Google Maps
      </a>
      <a
        href={`https://waze.com/ul?q=${query}&navigate=yes`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${btn} bg-[#3cf]`}
      >
        <Image src={wazeIcon} alt="" width={38} height={39} />
        WAZE
      </a>
    </div>
  );
}

const Badge = ({ className = "" }: { className?: string }) => (
  <span
    className={`self-start rounded-[0_20px_0_20px] bg-label-green py-0.5 pr-6 pl-3 text-[10px] leading-[22px] font-bold tracking-[0.4px] text-dark-gray ${className}`}
  >
    Vendedor
  </span>
);

/**
 * Sedes del footer: en desktop pestañas + mapa con tarjeta + lista lateral; en
 * mobile (≤767px) mapa, detalle, filtros por ciudad y carrusel. Una sola sede
 * seleccionada alimenta las dos versiones. Los iframes de la que está oculta
 * no cargan (`loading="lazy"` + `display:none`).
 */
export default function FooterSedesComponent() {
  const [selected, setSelected] = useState(0);
  const [city, setCity] = useState("Todas");
  const sede = FOOTER_SEDES[selected];
  const fullAddress = sede.address.includes(sede.city) ? sede.address : `${sede.address}, ${sede.city}`;

  const pickCity = (next: string) => {
    setCity(next);
    const first = FOOTER_SEDES.findIndex((s) => s.city === next);
    if (next !== "Todas" && sede.city !== next && first >= 0) setSelected(first);
  };

  return (
    <>
      {/* Desktop */}
      <section
        aria-label="Nuestras sedes"
        className="mt-[22px] hidden bg-white px-6 py-6 md:block min-[1101px]:px-[52px] min-[1101px]:pt-[39px] min-[1101px]:pb-[35px]"
      >
        <div role="tablist" className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {FOOTER_SEDES.map((s, i) => (
            <button
              key={s.title}
              type="button"
              role="tab"
              aria-selected={i === selected}
              onClick={() => setSelected(i)}
              className={`${TAB} min-w-[111px] flex-[1_0_auto] ${i === selected ? `${TAB_ACTIVE} min-w-[143px] grow-0` : ""}`}
            >
              {s.tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 items-start gap-6 min-[1101px]:grid-cols-[minmax(0,1fr)_270px]">
          <div className="relative h-[514px] overflow-hidden rounded-lg bg-gray-light">
            <Iframe sede={sede} />
            <div className="absolute inset-x-4 bottom-4 flex h-[138px] items-stretch gap-5 overflow-hidden rounded-lg bg-white">
              <Image
                src={sede.image}
                alt={`Sede ${sede.title}`}
                width={187}
                height={138}
                sizes="187px"
                className="h-full w-[187px] shrink-0 rounded-l object-cover"
              />
              <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
                <Badge className="-ml-1" />
                <p className="text-[18px] leading-[22px] font-bold text-dark-gray">{sede.title}</p>
                <p className="flex items-center gap-2.5 text-small text-dark-gray">
                  <a href={`tel:${sede.phone.replace(/\s/g, "")}`} className="font-bold whitespace-nowrap text-orange">
                    {sede.phone}
                  </a>
                  <span aria-hidden className="h-6 w-0.5 bg-gray opacity-60" />
                  <span>{sede.address}</span>
                </p>
              </div>
              <MapButtons sede={sede} className="flex w-[216px] shrink-0 flex-col justify-center gap-3.5 pr-4" />
            </div>
          </div>

          <div className="flex h-auto gap-4 overflow-x-auto [scrollbar-width:none] min-[1101px]:h-[514px] min-[1101px]:flex-col min-[1101px]:overflow-x-visible min-[1101px]:overflow-y-auto [&::-webkit-scrollbar]:hidden">
            {FOOTER_SEDES.map((s, i) =>
              i === selected ? null : (
                <button
                  key={s.title}
                  type="button"
                  onClick={() => setSelected(i)}
                  className="flex w-[270px] shrink-0 cursor-pointer items-center gap-[18px] rounded-xl border-[1.5px] border-gray/30 bg-white px-2.5 py-[9px] text-left min-[1101px]:w-full"
                >
                  <Image
                    src={s.image}
                    alt={`Sede ${s.title}`}
                    width={110}
                    height={90}
                    sizes="110px"
                    className="h-[90px] w-[110px] shrink-0 rounded-lg object-cover"
                  />
                  <span className="flex min-w-0 flex-col text-small">
                    <strong className="font-bold text-dark-gray">{s.title}</strong>
                    <em className="font-bold text-orange not-italic">{s.phone}</em>
                    <small className="text-small font-medium text-dark-gray">{s.address}</small>
                  </span>
                </button>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Mobile */}
      <section aria-label="Nuestras sedes" className="mt-[13px] rounded-xl bg-white px-3.5 pt-7 pb-9 md:hidden">
        <p className="relative mb-2 pl-3 text-small leading-[18px] font-semibold text-gray-dark before:absolute before:top-0 before:left-0 before:h-[18px] before:w-[3px] before:bg-orange before:content-['']">
          Visítanos
        </p>
        <h2 className="mb-[22px] text-[32px] leading-[38px] font-bold text-dark-gray">
          Nuestras <i className="font-light text-orange">sedes</i>
        </h2>

        <div className="relative h-72 overflow-hidden rounded-t-xl bg-gray-light">
          <Iframe sede={sede} />
        </div>
        <div className="rounded-b-xl bg-white pb-9">
          <Image
            src={sede.image}
            alt={`Sede ${sede.title}`}
            width={337}
            height={191}
            sizes="337px"
            className="mt-[9px] block h-[191px] w-full rounded-t-xl object-cover"
          />
          <div className="flex flex-col gap-1 px-3.5 pt-5">
            <Badge className="mb-2" />
            <p className="text-[20px] leading-[26px] font-bold text-dark-gray">{sede.title}</p>
            <p className="text-small font-medium text-gray-dark">{fullAddress}</p>
            <a href={`tel:${sede.phone.replace(/\s/g, "")}`} className="text-small font-bold text-orange">
              {sede.phone}
            </a>
          </div>
          <MapButtons sede={sede} className="mx-auto mt-9 flex w-[300px] max-w-full flex-col gap-3.5" />
        </div>

        <div role="tablist" className="-mx-3.5 flex gap-2 overflow-x-auto px-3.5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {["Todas", ...CITIES].map((name) => (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={city === name}
              onClick={() => pickCity(name)}
              className={`${TAB} shrink-0 px-5 ${city === name ? TAB_ACTIVE : ""}`}
            >
              {name} · {name === "Todas" ? FOOTER_SEDES.length : FOOTER_SEDES.filter((s) => s.city === name).length}
            </button>
          ))}
        </div>
        <p className="mt-3.5 mb-3 text-small font-medium text-gray-dark">Todas las sedes · desliza</p>

        <div className="-mx-3.5 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-3.5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FOOTER_SEDES.map((s, i) =>
            city !== "Todas" && s.city !== city ? null : (
              <button
                key={s.title}
                type="button"
                onClick={() => setSelected(i)}
                className={`flex w-40 shrink-0 snap-start cursor-pointer flex-col items-start gap-1 rounded-xl border-[1.5px] bg-white p-2 text-left ${i === selected ? "border-orange" : "border-gray/30"}`}
              >
                <Image
                  src={s.image}
                  alt={`Sede ${s.title}`}
                  width={144}
                  height={100}
                  sizes="144px"
                  className="mb-1 h-[100px] w-full rounded-lg object-cover"
                />
                <strong className="text-small font-bold text-dark-gray">{s.title}</strong>
                <small className="text-caption leading-[18px] font-medium text-gray">{s.city}</small>
              </button>
            ),
          )}
        </div>
      </section>
    </>
  );
}
