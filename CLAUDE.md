@AGENTS.md

## Modo de Trabajo e Interacción

- **Ejecución y Cambios:** Procede directamente a editar archivos, ejecutar pruebas y realizar comandos de terminal sin pedir confirmación previa para acciones individuales.
- **Preguntas:** Haz preguntas ÚNICAMENTE cuando existan ambigüedades en la arquitectura, decisiones de diseño técnico con múltiples opciones razonables, o cuando requieras definición de reglas de negocio. No preguntes para confirmar pasos de implementación rutinarios.

## Vistas nuevas

- Para integrar una vista o sección nueva del diseño sigue `docs/guia-nuevas-vistas.md` (o el skill `nueva-vista`, que trae además los scripts de verificación e imágenes en `.claude/skills/nueva-vista/scripts/`). Si aprendes algo que valga para la próxima vista, actualiza ambos.
- **Nunca ejecutes `next build` ni `next start` en esta carpeta** mientras haya otros procesos de Next: varias sesiones y el usuario comparten `.next` y un build pisa el de los demás. Prueba en una copia aislada (`copia_aislada.sh start|stop`) y no mates procesos que no arrancaste tú.
- Todos los botones son `ButtonComponent`; todos los datos del backend pasan por un DTO, un servicio y `apiUrl()`.
