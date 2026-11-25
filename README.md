# Ale Gil · Asesoría de tesis

Landing estática para la asesoría de tesis de bachillerato, licenciatura, maestría y doctorado (Arequipa y online).

## Vista previa

Abre `index.html` en el navegador, o sirve la carpeta con un servidor local:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

El sitio es HTML, CSS y JavaScript sin dependencias. Está publicado en **Cloudflare Pages**: <https://alegil-asesoria-tesis.pages.dev/>

## Estructura

| Archivo / carpeta | Contenido |
| --- | --- |
| `index.html` | Contenido, metadatos SEO, datos estructurados (JSON-LD) y enlaces de contacto |
| `css/styles.css` | Paleta, tipografía, diseño adaptable y animaciones |
| `js/script.js` | Formulario → WhatsApp, menú móvil, carrusel de logos y animaciones de scroll |
| `assets/images/` | Fotografías (originales y versiones WebP) |
| `assets/logos/` | Logotipos de instituciones |
| `assets/seo/` | Imagen para redes sociales (1200×630) e íconos |
| `sitemap.xml`, `robots.txt` | Configuración para buscadores |
| `site.webmanifest`, `favicon.png` | Ícono del sitio |
| `404.html` | Página de error |
| `_headers` | Caché y cabeceras de seguridad para Cloudflare Pages |

## Dominio del sitio (importante)

Todas las URL absolutas usan por defecto:

```
https://alegil-asesoria-tesis.pages.dev/
```

Si más adelante se usa un dominio propio (por ejemplo `https://www.alegil.pe/`), reemplaza esa URL en **todos** estos archivos:

- `index.html` → `canonical`, `hreflang`, `og:url`, `og:image`, `twitter:image` y el bloque JSON-LD
- `sitemap.xml`
- `robots.txt`

Búsqueda rápida: `grep -rn "alegil-asesoria-tesis.pages.dev" .`

## Publicar cambios en Cloudflare Pages

Proyecto de Cloudflare Pages: `alegil-asesoria-tesis` (despliegue directo, sin conexión a Git).

```bash
# desde la carpeta del proyecto, después de hacer commit
rm -rf /tmp/alegil-deploy && mkdir /tmp/alegil-deploy
git archive main | tar -x -C /tmp/alegil-deploy
rm -f /tmp/alegil-deploy/README.md /tmp/alegil-deploy/.gitignore /tmp/alegil-deploy/.nojekyll
npx wrangler pages deploy /tmp/alegil-deploy --project-name alegil-asesoria-tesis --branch main
```

Para que cada `git push` se publique solo, conecta el repositorio desde el panel de Cloudflare: **Workers & Pages → alegil-asesoria-tesis → Settings → Builds & deployments**.

## Google Search Console

1. Entra a <https://search.google.com/search-console> y agrega una propiedad de tipo **Prefijo de URL** con la URL del sitio.
2. Elige el método **Etiqueta HTML**. Copia el código del atributo `content` y pégalo en `index.html`, en la línea comentada:
   ```html
   <meta name="google-site-verification" content="TU_CODIGO_AQUI">
   ```
   Quita los `<!-- -->`, sube el cambio y pulsa **Verificar**.
3. En **Sitemaps**, envía `sitemap.xml`.
4. En **Inspección de URLs**, inspecciona la página principal y pulsa **Solicitar indexación**.
5. Opcional: valida los datos estructurados en <https://search.google.com/test/rich-results>.

Cada vez que cambies contenido importante, actualiza `<lastmod>` en `sitemap.xml` y `dateModified` en el JSON-LD.

## SEO incluido

- Título y descripción orientados a: *asesoría de tesis*, *Arequipa*, *online*, *bachillerato*, *licenciatura*, *maestría*, *doctorado*, *metodología*, *análisis de datos*, *redacción*, *sustentación*.
- Encabezados con palabras clave («Tesis de licenciatura», «Tesis de maestría»…).
- Canonical, `hreflang es-PE`, Open Graph y Twitter Card con imagen 1200×630.
- Datos estructurados: `ProfessionalService` (servicio local en Arequipa con catálogo por nivel), `Person`, `WebSite`, `WebPage` y `FAQPage` (generado a partir de las preguntas frecuentes).
- Sitemap con imágenes y `robots.txt` que apunta al sitemap.
- Imágenes con texto alternativo, dimensiones declaradas, WebP y carga diferida.

## Edición frecuente

- **WhatsApp:** si cambia el número, actualiza los enlaces `wa.me`, la acción del formulario, el número visible y el `telephone` del JSON-LD en `index.html`.
- **Preguntas frecuentes:** si agregas o cambias una pregunta, actualiza también el bloque `FAQPage` del JSON-LD.
- **Animaciones:** se desactivan automáticamente si el visitante tiene activada la opción «reducir movimiento».
