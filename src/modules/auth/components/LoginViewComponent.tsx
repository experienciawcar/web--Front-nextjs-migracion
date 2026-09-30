import Image from "next/image";

import LoginFormComponent from "./LoginFormComponent";

/**
 * Vista "Inicie sesión" (`ROUTES.signIn`).
 *
 * Diseño: captura del desktop (1920) del login del sitio anterior; no hay Figma
 * ni diseño mobile. Medidas de la captura: título de 36px, columna del
 * formulario de 416px, foto de 628x419 (3:2) a la derecha con ~138px entre
 * ambas. La foto es `bg_sign_in.jpeg` del sitio anterior (4096x2731, 5,9 MB),
 * pasada a WebP de 1256px (2x).
 * Mobile (estimado): una columna, sin foto (`hidden xl:block`: así el
 * navegador no la descarga).
 * El botón es el del sistema (48px de alto); el del sitio anterior medía 56.
 */
export default function LoginViewComponent({ next, redirectTo }: { next?: string; redirectTo: string }) {
  return (
    <section aria-labelledby="login-title" className="container-wcar py-10 xl:py-6">
      <div className="mx-auto grid max-w-[1182px] items-start gap-10 xl:grid-cols-[416px_628px] xl:justify-between xl:gap-0">
        <div className="reveal">
          <h1 id="login-title" className="mb-4 text-heading-1 font-bold text-dark-gray xl:mt-2 xl:text-subheadline-1 xl:leading-11">
            Inicie sesión
          </h1>
          <LoginFormComponent next={next} redirectTo={redirectTo} />
        </div>
        <div className="reveal reveal-fade relative hidden aspect-3/2 xl:block">
          <Image
            src="/assets/auth/interior-carro-login.webp"
            alt="Interior de un carro con luces ambientales cian y naranja"
            fill
            sizes="628px"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
