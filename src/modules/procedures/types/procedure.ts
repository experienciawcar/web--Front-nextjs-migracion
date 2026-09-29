/** Un trámite de tránsito que WCAR gestiona: su nombre y en qué consiste. */
export type Procedure = {
  id: string;
  /** Lo que se lee en la cabecera del acordeón. */
  title: string;
  /** El texto que se despliega. */
  description: string;
};
