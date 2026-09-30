import Image from "next/image";

import type { BlogArticle } from "../types/blog";
import { getYoutubeEmbedUrl, prepareBlogHtml } from "../utils/content";

/**
 * Detalle de un artículo: título (el `<h1>`, 36/44 bold), fecha, portada y los párrafos en
 * orden, todo en una columna de 1056 centrada. Cada párrafo trae un título opcional (`<h2>`, o
 * `<h3>` si el backoffice lo marca), una foto o un video adjunto y el HTML del editor
 * (`.blog-content` en globals.css).
 *
 * Diseño: captura del desktop 1920 (sin Figma ni mobile): título en y=130, portada de 1056 x 462
 * con esquinas de 10 en y=221, título del primer párrafo (bold) 70 bajo la portada, texto de 16/24 en
 * `gray-dark`. No lleva enlace "Volver al blog": el diseño no lo trae.
 * TODO: pedir el diseño mobile.
 *
 * La foto de cada párrafo no trae medidas: se reserva 16:9 y `h-auto` la ajusta al cargar.
 * El `alt` es el título del párrafo (o el del artículo).
 */
export default function BlogArticleComponent({ article }: { article: BlogArticle }) {
  const { post, paragraphs } = article;

  return (
    <article className="bg-white">
      <div className="mx-auto w-full max-w-[calc(1056px+2rem)] px-4 pt-8 pb-12 md:px-4 md:pt-9">
        <header>
          <h1 className="reveal text-[28px] leading-9 font-bold text-dark-gray md:text-subheadline-1">{post.title}</h1>
          <p className="reveal mt-5 flex items-center gap-2 pl-3 text-small font-medium text-gray">
            <span aria-hidden className="size-1 bg-gray" />
            <time dateTime={post.dateIso}>{post.dateLongLabel}</time>
          </p>
        </header>

        {post.photoUrl && (
          <div className="reveal reveal-fade relative mt-[27px] aspect-[1056/462] w-full overflow-hidden rounded-[10px] bg-gray-light">
            <Image
              src={post.photoUrl}
              alt={post.title}
              fill
              preload
              sizes="(min-width: 1120px) 1056px, 100vw"
              className="object-cover"
            />
          </div>
        )}

        <div className="mt-[75px]">
          {paragraphs.map((paragraph) => {
            const Title = paragraph.titleLevel === 3 ? "h3" : "h2";
            const videoEmbed = paragraph.file?.isVideo ? getYoutubeEmbedUrl(paragraph.file.url) : null;
            return (
              <section key={paragraph.id} className="reveal mb-8">
                {paragraph.title && (
                  <Title
                    className={
                      paragraph.titleLevel === 3
                        ? "mb-4 text-heading-1 font-bold text-dark-gray"
                        : "mb-6 text-[28px] leading-9 font-bold text-dark-gray md:text-subheadline-1"
                    }
                  >
                    {paragraph.title}
                  </Title>
                )}
                {paragraph.file &&
                  (paragraph.file.isVideo ? (
                    videoEmbed ? (
                      <div className="mb-4 aspect-video w-full">
                        <iframe
                          src={videoEmbed}
                          title={paragraph.title ?? post.title}
                          loading="lazy"
                          allowFullScreen
                          className="size-full border-0"
                        />
                      </div>
                    ) : (
                      <video controls preload="metadata" src={paragraph.file.url} className="mb-4 w-full" />
                    )
                  ) : (
                    <Image
                      src={paragraph.file.url}
                      alt={paragraph.title ?? post.title}
                      width={1056}
                      height={594}
                      sizes="(min-width: 1120px) 1056px, 100vw"
                      className="mb-4 h-auto w-full"
                    />
                  ))}
                {paragraph.html && (
                  <div className="blog-content" dangerouslySetInnerHTML={{ __html: prepareBlogHtml(paragraph.html, paragraph.title ? paragraph.titleLevel : 1) }} />
                )}
              </section>
            );
          })}
        </div>
      </div>
    </article>
  );
}
