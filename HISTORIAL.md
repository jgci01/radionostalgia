# Historial de Conversación y Resumen del Proyecto

**Proyecto:** Radio Nostalgia Digital
**Fecha de finalización de esta etapa:** 21 de mayo de 2026

Este documento sirve como un registro y bitácora de todas las decisiones, códigos y componentes que hemos construido en nuestras sesiones de programación en pareja entre el desarrollador experto (Asistente de IA) y el creador de la radio.

---

## 1. Arquitectura y Base del Proyecto
Iniciamos la aplicación utilizando tecnologías de vanguardia para asegurar el máximo rendimiento y la mejor experiencia de usuario:
* **Framework:** Next.js 15 (React 19) con App Router.
* **Estilos:** Tailwind CSS con un estricto diseño *Premium Dark Mode* (colores cian, esmeralda y fondos oscuros).
* **Lenguaje:** TypeScript para evitar errores de ejecución.

## 2. Componentes Construidos (Dashboard Principal)

El panel principal (Landing Page) fue diseñado para mostrar toda la información en tiempo real, manteniendo una estética minimalista:

1. **Reloj Dinámico:** Construido del lado del cliente, protegido contra problemas de hidratación, muestra la hora local al segundo.
2. **Widget del Clima:** Conectado a la API abierta de *Open-Meteo*, detecta automáticamente el clima de Mendoza, Argentina, y muestra iconos (Lucide-react) según el estado del cielo y la temperatura.
3. **Reproductor en Vivo (Player):** 
   * Integramos el widget oficial de transmisión de **Caster.fm (Shoutcast)**.
   * Ajustamos rigurosamente el código para incluir los enlaces de validación obligatorios ("Powered by") para que el script no bloqueara la reproducción.
   * Añadimos botones alternativos estilizados hacia *Twitch* y *Web Player Externo* justo debajo del reproductor.
4. **Agregador de Noticias Inteligente (RSS):**
   * El sistema inicial leía noticias de La Nación. Luego lo reprogramamos para que leyera **5 fuentes al mismo tiempo**: MDZ Online, La Nación, Infobae, El Nacional y Radio Bío Bío.
   * Ante los bloqueos de seguridad y errores `404` de algunos diarios, implementamos un sistema *Anti-bot bypass* (User-Agent falso) y una rutina de **respaldo (fallback)**.
   * El sistema extrae exactamente 1 noticia de cada fuente exitosa y rellena los huecos vacíos con el archivo de respaldo para garantizar que el panel siempre luzca perfecto con sus 5 renglones etiquetados.

## 3. Sección "Quiénes Somos"
* Creamos una página secundaria (`/quienes-somos`) con botón de regreso.
* Diseñamos el texto de identidad de la marca (Curación, Pasión, Calidad).
* Añadimos un apartado final, hermosamente maquetado con *glassmorphism*, centrado y dinámico para mostrar la **foto del Locutor y Creador** (`locutor.png`).

## 4. Estrategia de Rendimiento (ISR)
Para evitar los altísimos costos de tener un servidor prendido las 24 horas y al mismo tiempo mantener las noticias frescas:
* Configuramos **ISR (Incremental Static Regeneration)** con un intervalo de `21600` segundos (6 horas).
* El servidor oculto de Next.js lee automáticamente los RSS en segundo plano y reconstruye la página 4 veces al día sin que nadie tenga que presionar ningún botón.

## 5. Control de Versiones y Despliegue
* Modificamos el logotipo original a uno mucho más vibrante y retro proporcionado por el creador (`logo.png`), así como el icono del navegador (`favicon.ico`).
* Incluimos un crédito a **TepuyFactory** en el pie de página.
* Subimos todo el código fuente al repositorio oficial en GitHub (`jgci01/radionostalgia`).

### Opciones de Alojamiento Estudiadas:
Discutimos qué hacer tras alcanzar los límites de créditos en Netlify:
1. **Cloudflare Pages:** La mejor opción para este proyecto. Soporte nativo para Next.js en el *Edge* sin costos mensuales (Configuración con `npx @cloudflare/next-on-pages@1`).
2. **Vercel:** Plataforma nativa de Next.js, excelente nivel gratuito.
3. **Firebase Hosting:** Funciona bien, pero requiere activar el plan pago *Blaze* (aunque no cobre nada) para que sus *Cloud Functions* puedan leer los RSS.
4. **GitHub Actions + GitHub Pages:** Truco avanzado para exportar el sitio estáticamente si no se desea usar servidores externos en absoluto.

---
*Este documento queda resguardado en el repositorio como respaldo histórico de nuestro trabajo juntos.*
