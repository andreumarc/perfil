# Rendimiento (PageSpeed / Core Web Vitals)

Qué está optimizado y qué hay que respetar al añadir contenido o código. Medición de referencia: Lighthouse móvil (Moto G, 4G lenta) sobre un build de producción, `npx lighthouse <url> --form-factor=mobile`.

## Resultado de referencia (Lighthouse móvil, build de producción en local, 18-11-2026)

| Página | Antes | Después |
| --- | --- | --- |
| Portada | 67 (LCP 5,3 s, TBT 480 ms) | 95 (LCP 2,7 s, TBT 90 ms) |
| Servicio (reformas de cocinas) | — | 94 |
| Blog | — | 93 |
| Presupuesto (formulario completo en servidor) | — | 83 |

Accesibilidad, buenas prácticas y SEO: 100 en las cuatro. JavaScript inicial de la portada: de 417 KB a 230 KB comprimidos.

## Lo que ya hace la web

- **Nada se oculta en el HTML inicial.** La transición entre páginas (`PageTransition`) y las animaciones de entrada (`Reveal*`) se renderizan visibles en servidor; solo lo que queda bajo la pantalla se oculta tras hidratar y se revela con CSS al entrar en el viewport. Antes la página entera llegaba con opacidad 0 hasta que cargaba el JavaScript, y el LCP se iba a los 5 s.
- **Banner de cookies en el primer pintado.** Va en el HTML; un script de una línea en `<head>` lo oculta antes de pintar si ya hay consentimiento. Así no aparece tarde y no se convierte en el elemento LCP.
- **Hero (LCP)**: la imagen se precarga con `fetchpriority="high"` y, si existe un recorte vertical con el mismo nombre y sufijo `-movil` (`hero-villa-piscina-movil.webp` junto a `hero-villa-piscina.webp`), el móvil recibe ese recorte en vez de la foto apaisada. Si cambias la imagen del hero desde el panel, sube también su versión `-movil` (3:4, unos 700 x 940 px) a `public/images/...` o el móvil cargará la apaisada completa.
- **Imágenes**: todas pasan por `next/image` (AVIF/WebP, tamaños por `sizes`). Las de tarjeta usan calidad 60 (`lib/images.ts`); la calidad permitida se declara en `images.qualities` de `next.config.ts`. Ninguna imagen bajo el pliegue lleva `priority`. El favicon (`app/icon.png`) es de 64 px; los iconos grandes del manifiesto están en `public/icons/`.
- **Formularios**: `QuoteFormLazy` (todas las páginas y el popup) descarga el código del formulario (react-hook-form, Zod, selects, Turnstile) solo cuando el bloque se acerca al viewport o se abre el popup. `QuoteForm` (servidor, HTML completo) solo en `/presupuesto` y `/contacto`. No importes `lead-form` desde un componente que se use en el resto de páginas: su chunk volvería a la carga inicial.
- **Zod**: siempre `import * as z from "@/lib/validation/zod"`, nunca `import { z } from "zod"`. La importación por objeto arrastra los 40 idiomas de Zod al navegador (unos 60 KB comprimidos) y la configuración `jitless` evita un aviso de CSP (`new Function`).
- **Motion** solo queda en las calculadoras; contadores y reveals son CSS/IntersectionObserver.
- **Fuentes**: Inter y Manrope locales, variables, con `display: swap` y precarga.
- **Scripts de terceros**: ninguno antes del consentimiento de cookies.

Lo que queda y por qué no se toca: react-dom y el enrutador de Next (unos 110 KB), las dos fuentes (74 KB) y el formulario completo en `/presupuesto`, que debe llegar renderizado desde el servidor.

## Al añadir contenido

- Fotos de obra: máximo 1.600 px de lado y en WebP (o JPG de calidad 80). `next/image` genera los tamaños, pero el original pesa en el repositorio y en Blob.
- No pongas `priority` en imágenes que no estén en la primera pantalla.
- Un bloque nuevo con animación de entrada debe usar `Reveal` o `RevealGroup` (Motion ya está cargado); no añadas otras librerías de animación.

## Comprobaciones

```
npm run build && PORT=3100 npm start
npx lighthouse http://localhost:3100/ --form-factor=mobile --screenEmulation.mobile --only-categories=performance,accessibility,best-practices,seo --view
```

En producción, PageSpeed Insights (https://pagespeed.web.dev) sobre https://reformasmardari.com. La primera visita a cada imagen tras un despliegue es más lenta (Vercel la optimiza y la cachea); repite la medición antes de sacar conclusiones.
