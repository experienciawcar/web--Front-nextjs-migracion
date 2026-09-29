/**
 * El "+" y la "×" del acordeón (glifos de 24 de Figma "I / Math / plus" y "I / Gaming /
 * xmark", los mismos de Financiación), pintados a 25 px como en el sitio anterior.
 *
 * Van en línea y no como `<Image>`: uno de los dos siempre está oculto, y con
 * `next/image` el oculto no se pediría hasta mostrarse (la "×" tardaría en aparecer al
 * abrir) o, con `loading="eager"`, saldrían dos `<link rel=preload>` en el `<head>` que
 * compiten con la foto del hero. En línea no hay petición ni precarga, y el color sigue
 * al del texto (`currentColor`).
 *
 * Deben ir dentro de un elemento con la clase `group` que sea un `<details>`: el `+` se
 * oculta y la `×` se muestra con `group-open:`.
 */
export default function AccordionIconComponent() {
  return (
    <>
      <svg viewBox="0 0 24 24" aria-hidden className="mr-4 size-[25px] shrink-0 fill-current group-open:hidden">
        <path d="M6.54571 12.5665H11.1411V17.1619C11.1411 17.629 11.5253 18.0207 11.9999 18.0207C12.4746 18.0207 12.8588 17.629 12.8588 17.1619V12.5665H17.4542C17.9213 12.5665 18.313 12.1823 18.313 11.7077C18.313 11.2331 17.9213 10.8489 17.4542 10.8489H12.8588V6.25344C12.8588 5.78636 12.4746 5.39462 11.9999 5.39462C11.5253 5.39462 11.1411 5.78636 11.1411 6.25344V10.8489H6.54571C6.07863 10.8489 5.68689 11.2331 5.68689 11.7077C5.68689 12.1823 6.07863 12.5665 6.54571 12.5665Z" />
      </svg>
      <svg viewBox="0 0 24 24" aria-hidden className="mr-4 hidden size-[25px] shrink-0 fill-current group-open:block">
        <path d="M6.16158 16.3302C5.84517 16.6466 5.8301 17.2117 6.16911 17.5431C6.50058 17.8746 7.06559 17.8671 7.382 17.5507L11.9925 12.9326L16.6105 17.5507C16.9345 17.8746 17.4919 17.8746 17.8234 17.5431C18.1473 17.2041 18.1549 16.6542 17.8234 16.3302L13.2129 11.7122L17.8234 7.10173C18.1549 6.77779 18.1549 6.22031 17.8234 5.88884C17.4844 5.5649 16.9345 5.55736 16.6105 5.8813L11.9925 10.4993L7.382 5.8813C7.06559 5.5649 6.49305 5.54983 6.16911 5.88884C5.83764 6.22031 5.84517 6.78532 6.16158 7.10173L10.7796 11.7122L6.16158 16.3302Z" />
      </svg>
    </>
  );
}
