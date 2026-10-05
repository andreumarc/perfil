import Link from "next/link";

import { OpenCookieSettingsButton } from "@/components/analytics/cookie-banner";
import { Section, SectionHeading } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  BROWSER_COOKIE_HELP,
  COOKIES,
  formatLegalDate,
  LEGAL_IDENTITY,
  RETENTION,
  type CookieCategory,
} from "@/content/legal";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

const PATH = "/cookies";

export const metadata = pageMetadata({
  title: "Política de cookies",
  description:
    "Qué cookies y tecnologías similares utiliza este sitio, con qué finalidad, cuánto duran y cómo aceptar, rechazar o configurar tu consentimiento en cualquier momento.",
  path: PATH,
});

const CATEGORIES: { name: CookieCategory; description: string }[] = [
  {
    name: "Necesaria",
    description:
      "Imprescindibles para que el sitio funcione y para recordar tu decisión sobre cookies. No requieren consentimiento (art. 22.2 LSSI-CE) y no se pueden desactivar desde el panel de configuración.",
  },
  {
    name: "Técnica de sesión",
    description:
      "Almacenamiento temporal en el navegador (sessionStorage) que se borra al cerrar la pestaña. Sirve para atribuir el origen de una solicitud (campaña, referrer) dentro de la misma visita. No identifica a la persona ni se comparte con terceros.",
  },
  {
    name: "Analítica",
    description:
      "Permiten medir cuántas personas visitan el sitio, qué páginas ven y en qué paso del diagnóstico abandonan. Solo se activan si las aceptas. Incluyen el identificador propio de visitante y Google Analytics 4 con IP anonimizada.",
  },
  {
    name: "Marketing",
    description:
      "Miden la conversión de las campañas publicadas en Meta y LinkedIn para saber qué anuncios generan solicitudes. Solo se activan si las aceptas y solo cuando hay campañas configuradas.",
  },
];

const CELL = "whitespace-normal align-top text-sm leading-relaxed";

export default function CookiesPage() {
  return (
    <>
      <Section size="compact" className="border-b border-gray-200 pb-10 md:pb-12">
        <Breadcrumbs items={[{ name: "Política de cookies", path: PATH }]} />
        <SectionHeading
          as="h1"
          eyebrow="Legal"
          title="Política de cookies"
          description="Información sobre las cookies y tecnologías similares que utiliza este sitio, conforme al artículo 22.2 de la LSSI-CE, al RGPD y a la guía sobre el uso de cookies de la Agencia Española de Protección de Datos."
          className="mt-8"
        />
        <p className="mt-6 text-sm text-gray-500">
          Última actualización: {formatLegalDate(LEGAL_IDENTITY.lastUpdated)}
        </p>
      </Section>

      <Section containerSize="narrow">
        <div className="prose-executive [&>h2:first-child]:mt-0">
          <h2>1. Qué son las cookies y tecnologías similares</h2>
          <p>
            Una cookie es un pequeño archivo de texto que el sitio web guarda en tu navegador para reconocerlo en
            visitas posteriores o durante la misma sesión. Junto a las cookies existen otras tecnologías de
            almacenamiento en el dispositivo con funciones equivalentes, como <em>localStorage</em> (persiste
            entre sesiones) y <em>sessionStorage</em> (se borra al cerrar la pestaña). Esta política cubre todas
            ellas.
          </p>
          <p>
            Según quién las gestiona, las cookies pueden ser <strong>propias</strong> (las instala este sitio) o{" "}
            <strong>de terceros</strong> (las instala otro proveedor, como Google, Meta o LinkedIn). Según su
            duración, pueden ser <strong>de sesión</strong> (desaparecen al cerrar el navegador) o{" "}
            <strong>persistentes</strong> (permanecen el tiempo indicado en la tabla).
          </p>

          <h2>2. Tipos de cookies que utiliza este sitio</h2>
          <ul>
            {CATEGORIES.map((category) => (
              <li key={category.name}>
                <strong>{category.name}:</strong> {category.description}
              </li>
            ))}
          </ul>
          <p>
            Este sitio no utiliza cookies de publicidad comportamental ni comparte datos con redes publicitarias
            para construir perfiles. Las cookies de marketing se limitan a medir la conversión de campañas
            propias.
          </p>

          <h2>3. Cookies y almacenamiento utilizados</h2>
          <p>
            La tabla recoge todas las cookies y elementos de almacenamiento que puede utilizar el sitio. Las de
            terceros solo se instalan si has aceptado la categoría correspondiente y si el proveedor está
            configurado; si no hay campañas activas, no se cargan.
          </p>
        </div>

        <div className="my-8 rounded-lg border border-gray-200 bg-white">
          <Table className="min-w-[840px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Nombre</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Finalidad</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead>Consentimiento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {COOKIES.map((cookie) => (
                <TableRow key={cookie.name}>
                  <TableCell className={`${CELL} font-mono text-xs font-medium text-navy-900`}>{cookie.name}</TableCell>
                  <TableCell className={`${CELL} text-gray-700`}>{cookie.provider}</TableCell>
                  <TableCell className={`${CELL} text-gray-700`}>{cookie.category}</TableCell>
                  <TableCell className={`${CELL} text-gray-700`}>{cookie.purpose}</TableCell>
                  <TableCell className={`${CELL} text-gray-700`}>{cookie.duration}</TableCell>
                  <TableCell className={`${CELL} text-gray-700`}>
                    {cookie.requiresConsent ? "Sí, requiere aceptación" : "No (exenta)"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="prose-executive">
          <p>
            <strong>Nota sobre Vercel Analytics:</strong> la medición de audiencia del proveedor de alojamiento
            funciona sin cookies ni identificadores persistentes; agrega las visitas por página, país y tipo de
            dispositivo sin reconocer al visitante entre sesiones. Por eso no requiere consentimiento y no aparece
            en el panel de configuración.
          </p>

          <h2>4. Cómo configurar tu consentimiento</h2>
          <p>
            La primera vez que visitas el sitio se muestra un aviso con tres opciones al mismo nivel:{" "}
            <strong>Aceptar todas</strong>, <strong>Rechazar</strong> (solo se mantienen las necesarias) y{" "}
            <strong>Configurar</strong>, que permite activar por separado la analítica y el marketing. Tu decisión
            se guarda en la cookie <em>mg_consent</em> durante {RETENTION.consentCookieMonths} meses; pasado ese
            plazo, o si cambia esta política de forma relevante, se te volverá a preguntar.
          </p>
          <p>
            Puedes cambiar o retirar tu consentimiento en cualquier momento desde este botón. Si retiras el
            consentimiento, las cookies de analítica y marketing dejan de utilizarse en adelante; las ya
            instaladas por terceros puedes eliminarlas desde tu navegador tal como se explica en el punto 5.
          </p>
        </div>

        <div className="my-8">
          <OpenCookieSettingsButton className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")} />
        </div>

        <div className="prose-executive">
          <h2>5. Cómo desactivar las cookies en tu navegador</h2>
          <p>
            Todos los navegadores permiten bloquear o eliminar las cookies, tanto de forma general como para un
            sitio concreto, y borrar el almacenamiento local. Estas son las páginas de ayuda oficiales de los
            principales navegadores:
          </p>
          <ul>
            {BROWSER_COOKIE_HELP.map((browser) => (
              <li key={browser.name}>
                <a href={browser.url} target="_blank" rel="noopener noreferrer">
                  {browser.name}
                </a>
              </li>
            ))}
          </ul>
          <p>
            Para Google Analytics existe además un{" "}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
              complemento oficial de inhabilitación
            </a>{" "}
            que impide el envío de datos a Google desde cualquier sitio web.
          </p>

          <h2>6. Consecuencias de desactivar las cookies</h2>
          <p>
            Si bloqueas las cookies necesarias, el sitio seguirá siendo accesible pero no podrá recordar tu
            decisión sobre cookies y volverá a mostrarte el aviso en cada visita. Si rechazas las de analítica y
            marketing, podrás navegar, hacer el diagnóstico, usar la calculadora y enviar el formulario de contacto
            con normalidad: el único efecto es que tu visita no se contabiliza en las métricas de uso ni en la
            medición de campañas.
          </p>

          <h2>7. Actualizaciones de esta política</h2>
          <p>
            Esta política se revisa cuando se incorporan o retiran proveedores, cambia la duración de alguna cookie
            o se modifica la normativa aplicable. La versión vigente es la publicada en esta página, con su fecha de
            última actualización. Los cambios que amplíen el uso de cookies no exentas requerirán un nuevo
            consentimiento. Para saber cómo se tratan los datos que las cookies puedan recoger, consulta la{" "}
            <Link href="/politica-privacidad">política de privacidad</Link>.
          </p>
        </div>

        <nav aria-label="Otras páginas legales" className="mt-14 border-t border-gray-200 pt-8">
          <p className="text-xs font-semibold tracking-[0.14em] text-gray-500 uppercase">Documentos relacionados</p>
          <ul className="mt-4 flex flex-col gap-3 text-base sm:flex-row sm:flex-wrap sm:gap-x-8">
            <li>
              <Link href="/legal" className="font-medium text-navy-900 underline-offset-4 hover:underline">
                Aviso legal
              </Link>
            </li>
            <li>
              <Link href="/politica-privacidad" className="font-medium text-navy-900 underline-offset-4 hover:underline">
                Política de privacidad
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="font-medium text-navy-900 underline-offset-4 hover:underline">
                Contacto
              </Link>
            </li>
          </ul>
        </nav>
      </Section>
    </>
  );
}
