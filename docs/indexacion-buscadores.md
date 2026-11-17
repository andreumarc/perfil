# Indexación en buscadores

Qué hace la web sola y qué hay que hacer una vez con las cuentas de la empresa. Dominio canónico: https://reformasmardari.com (mientras no esté conectado, https://reformas-ten.vercel.app).

## Lo que ya es automático

- `sitemap.xml` con todas las páginas públicas (servicios, sectores, proyectos, calculadoras, zonas, blog, legales) y `robots.txt` que lo referencia. Ambos se regeneran con el contenido.
- **IndexNow** (Bing, Yandex, Seznam, Naver y DuckDuckGo a través de Bing): la clave pública está en `public/<clave>.txt`. Se envía el sitemap completo en tres momentos: al publicar o cambiar contenido desde el panel, en cada despliegue (job `indexnow` de la CI, que espera dos minutos a Vercel y lee el sitemap publicado) y con el botón «Avisar a los buscadores ahora» de `/admin/ajustes`. Cuando cambie el dominio, define la variable de repositorio `SITE_URL` en GitHub (Settings → Secrets and variables → Actions → Variables) con `https://reformasmardari.com`.
- Datos estructurados (empresa, web, artículos, FAQ, servicios) y etiquetas Open Graph en todas las páginas.

Google no participa en IndexNow: solo indexa lo que descubre rastreando y lo que se le envía desde Search Console.

## Google Search Console (una vez, 10 minutos)

1. Entra en https://search.google.com/search-console con la cuenta de Google de la empresa y añade una propiedad de tipo «Prefijo de URL» con `https://reformasmardari.com`.
2. Elige el método «Etiqueta HTML». Copia solo el valor de `content` de la etiqueta (una cadena de letras y números) y pégalo en `/admin/ajustes` → Integraciones → «Verificación de Search Console». Guarda.
3. Vuelve a Search Console y pulsa «Verificar». La etiqueta se publica en todas las páginas al instante.
4. En «Sitemaps», envía `https://reformasmardari.com/sitemap.xml`.
5. En «Inspección de URL», pega la portada y pulsa «Solicitar indexación». Repite con `/servicios/reformas-integrales-viviendas`, `/servicios/reformas-cocinas`, `/servicios/reformas-banos`, `/presupuesto` y los tres artículos más importantes. Google limita las solicitudes diarias; el resto llegará por el sitemap.
6. Enlaza Search Console con Google Analytics 4 y con la ficha de Google Business Profile: los enlaces desde la ficha y desde los perfiles de Habitissimo, Cronoshare y redes aceleran el descubrimiento.

Si en unos días aparecen avisos de «páginas no indexadas» por «descubierta, actualmente sin indexar», es normal en dominios nuevos: la solución es tiempo, enlaces externos y contenido actualizado, no reenviar el sitemap cada día.

## Bing Webmaster Tools (una vez, 5 minutos)

1. Entra en https://www.bing.com/webmasters y añade `https://reformasmardari.com`. Si ya tienes Search Console verificado, usa «Importar desde Google Search Console» y no hay que hacer nada más.
2. Si prefieres verificar a mano, elige «Etiqueta meta», copia el valor de `content` y pégalo en `/admin/ajustes` → Integraciones → «Verificación de Bing Webmaster Tools». Guarda y verifica.
3. Envía el sitemap en «Sitemaps». IndexNow ya aparecerá en el informe «IndexNow» con los envíos automáticos.

## Otros buscadores

- **DuckDuckGo** y la búsqueda de **Ecosia** usan el índice de Bing: quedan cubiertos con lo anterior.
- **Yandex**, **Seznam** y **Naver** reciben los avisos de IndexNow directamente.
- **Brave Search** y **Apple** no admiten envíos: rastrean la web por su cuenta y se apoyan en enlaces externos.
- **Google Maps** se alimenta de Google Business Profile, no del sitemap.

## Comprobaciones

- `https://reformasmardari.com/robots.txt`, `/sitemap.xml` y `/baf88c4cfc9b76ed02819eb949f01de5.txt` deben responder con 200.
- En Search Console → «Páginas» se ve cuántas URLs están indexadas; en Bing Webmaster Tools → «IndexNow», los envíos recibidos.
- Tras cambiar de dominio: redeploy en Vercel, nueva propiedad en Search Console y Bing, variable `SITE_URL` en GitHub y un envío manual desde `/admin/ajustes`.
