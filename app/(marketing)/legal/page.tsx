import Link from "next/link";

import { Section, SectionHeading } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { formatLegalDate, LEGAL_IDENTITY, legalValue, PENDING_LABEL } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const PATH = "/legal";

export const metadata = pageMetadata({
  title: "Aviso legal",
  description:
    "Aviso legal del sitio web de Marc Andreu Guerao: titular, condiciones de uso, propiedad intelectual, exclusión de responsabilidad y legislación aplicable conforme a la LSSI-CE.",
  path: PATH,
});

function Value({ value }: { value: string }) {
  const text = legalValue(value);
  return text === PENDING_LABEL ? <span className="text-gray-500 italic">{text}</span> : <>{text}</>;
}

export default function AvisoLegalPage() {
  const email = LEGAL_IDENTITY.email;
  const identityRows: { label: string; value: React.ReactNode }[] = [
    { label: "Titular", value: LEGAL_IDENTITY.name },
    { label: "NIF", value: <Value value={LEGAL_IDENTITY.nif} /> },
    { label: "Domicilio", value: <Value value={LEGAL_IDENTITY.address} /> },
    { label: "Localidad", value: `${LEGAL_IDENTITY.city}, ${LEGAL_IDENTITY.country}` },
    {
      label: "Email",
      value: email ? <a href={`mailto:${email}`}>{email}</a> : <Value value="" />,
    },
    { label: "Actividad", value: LEGAL_IDENTITY.activity },
    { label: "Sitio web", value: site.url },
  ];

  return (
    <>
      <Section size="compact" className="border-b border-gray-200 pb-10 md:pb-12">
        <Breadcrumbs items={[{ name: "Aviso legal", path: PATH }]} />
        <SectionHeading
          as="h1"
          eyebrow="Legal"
          title="Aviso legal"
          description="Información general y condiciones de uso de este sitio web conforme a la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE)."
          className="mt-8"
        />
        <p className="mt-6 text-sm text-gray-500">
          Última actualización: {formatLegalDate(LEGAL_IDENTITY.lastUpdated)}
        </p>
      </Section>

      <Section containerSize="narrow">
        <div className="prose-executive [&>h2:first-child]:mt-0">
          <h2>1. Titular del sitio web</h2>
          <p>
            En cumplimiento del artículo 10 de la LSSI-CE, se informa de que el titular de este sitio web y
            responsable de los servicios que se ofrecen a través de él es:
          </p>
          <dl className="my-6 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
            {identityRows.map((row) => (
              <div key={row.label} className="grid gap-1 px-5 py-4 sm:grid-cols-[160px_1fr] sm:gap-6">
                <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase sm:pt-1">{row.label}</dt>
                <dd className="text-base text-navy-900">{row.value}</dd>
              </div>
            ))}
          </dl>
          <p>
            Puedes dirigirte al titular para cualquier cuestión relacionada con este sitio a través del email
            indicado o del{" "}
            <Link href="/contacto">formulario de contacto</Link>.
          </p>

          <h2>2. Objeto y ámbito de aplicación</h2>
          <p>
            Este aviso legal regula el acceso, la navegación y el uso del sitio web {site.url} (en adelante, «el
            Sitio»), a través del cual el titular presenta sus servicios profesionales de dirección y consultoría
            de operaciones para empresas multicentro, publica contenidos de carácter informativo (artículos,
            ejemplos de intervención, diagnóstico y calculadora) y pone a disposición de los visitantes formularios
            para solicitar información o una reunión.
          </p>
          <p>
            El acceso al Sitio es gratuito y atribuye a quien lo realiza la condición de usuario, lo que implica la
            aceptación plena de las condiciones recogidas en este aviso legal, en la{" "}
            <Link href="/politica-privacidad">política de privacidad</Link> y en la{" "}
            <Link href="/cookies">política de cookies</Link> vigentes en cada momento. Si no estás de acuerdo con
            ellas, debes abstenerte de utilizar el Sitio.
          </p>

          <h2>3. Condiciones de uso</h2>
          <p>El usuario se compromete a hacer un uso diligente del Sitio y, en particular, a:</p>
          <ul>
            <li>
              Utilizar los contenidos y servicios de forma lícita, sin contravenir la legislación vigente, la
              buena fe, el orden público ni los derechos de terceros.
            </li>
            <li>
              Facilitar datos veraces, exactos y actualizados en los formularios, respondiendo de los daños que
              pudiera causar la comunicación de datos falsos o de datos de terceros sin su autorización.
            </li>
            <li>
              No introducir ni difundir virus, código malicioso o cualquier otro elemento que pueda dañar o
              alterar el Sitio, sus sistemas o los equipos de otros usuarios.
            </li>
            <li>
              No realizar extracción automatizada de contenidos (scraping), envíos masivos a través de los
              formularios ni intentos de acceso a áreas privadas o a los sistemas que soportan el Sitio.
            </li>
            <li>
              No suplantar la identidad de otra persona o empresa ni utilizar el Sitio para enviar comunicaciones
              comerciales no solicitadas.
            </li>
          </ul>
          <p>
            El titular se reserva el derecho a limitar o impedir el acceso al Sitio a quien incumpla estas
            condiciones, así como a aplicar medidas técnicas (limitación de envíos, filtros anti-spam) para
            proteger su integridad.
          </p>

          <h2>4. Propiedad intelectual e industrial</h2>
          <p>
            Todos los contenidos del Sitio (textos, metodología, estructura, diseño, código fuente, gráficos,
            herramientas de diagnóstico y cálculo, y la denominación «{site.brand}») son titularidad de{" "}
            {LEGAL_IDENTITY.name} o se utilizan con la autorización de sus titulares, y están protegidos por la
            normativa española e internacional de propiedad intelectual e industrial.
          </p>
          <p>
            Se autoriza la visualización, impresión y descarga de los contenidos exclusivamente para uso personal
            o profesional interno del usuario, citando la fuente. Queda prohibida su reproducción, distribución,
            comunicación pública, transformación o cualquier otra forma de explotación con fines comerciales sin
            autorización previa y por escrito del titular.
          </p>
          <p>
            Los «ejemplos de intervención» publicados son casos hipotéticos construidos con fines ilustrativos:
            no describen clientes reales ni resultados económicos obtenidos, y las cifras que contienen no deben
            interpretarse como garantía ni como referencia de resultados.
          </p>

          <h2>5. Enlaces</h2>
          <p>
            El Sitio puede incluir enlaces a páginas de terceros (por ejemplo, la herramienta de reserva de
            reuniones o el perfil profesional del titular en LinkedIn). El titular no controla esos sitios ni se
            responsabiliza de sus contenidos, disponibilidad o políticas de privacidad; el acceso a ellos se
            realiza bajo la exclusiva responsabilidad del usuario.
          </p>
          <p>
            Se permite establecer enlaces al Sitio siempre que se haga a la página de inicio o a una página
            interior sin reproducir su contenido, sin crear un marco (framing) sobre él y sin dar a entender que
            existe una relación con el titular o su aprobación de los contenidos de la página que enlaza.
          </p>

          <h2>6. Exclusión de responsabilidad</h2>
          <p>
            El titular trabaja para que el Sitio esté disponible de forma continuada, pero no garantiza la
            ausencia de interrupciones o errores derivados del mantenimiento, de la infraestructura de terceros o
            de causas ajenas a su control, ni responde de los daños que pudieran derivarse de ellas.
          </p>
          <p>
            Los contenidos del Sitio tienen carácter informativo y orientativo. En particular, el Diagnóstico
            Multisite y la Calculadora EBITDA son herramientas de autoevaluación basadas en los datos que
            introduce el usuario y en rangos de referencia de gestión: sus resultados no constituyen
            asesoramiento profesional vinculante, ni una auditoría, ni una previsión o garantía de resultados
            económicos. Cualquier decisión empresarial tomada a partir de ellos es responsabilidad exclusiva de
            quien la adopta.
          </p>
          <p>
            La prestación de servicios profesionales se rige por la propuesta y el contrato que, en su caso, se
            formalicen por escrito entre el titular y el cliente, y no por los contenidos de este Sitio.
          </p>

          <h2>7. Protección de datos y cookies</h2>
          <p>
            El tratamiento de los datos personales que se recogen a través del Sitio se describe en la{" "}
            <Link href="/politica-privacidad">política de privacidad</Link>. El uso de cookies y tecnologías
            similares, así como la forma de aceptarlas, rechazarlas o configurarlas, se describe en la{" "}
            <Link href="/cookies">política de cookies</Link>.
          </p>

          <h2>8. Legislación aplicable y jurisdicción</h2>
          <p>
            Este aviso legal se rige por la legislación española. Para la resolución de cualquier controversia
            derivada del acceso o uso del Sitio, el titular y el usuario se someten a los juzgados y tribunales de
            la ciudad de {LEGAL_IDENTITY.city}, salvo que la normativa aplicable establezca con carácter
            imperativo un fuero distinto, en particular cuando el usuario tenga la condición de consumidor.
          </p>

          <h2>9. Modificaciones</h2>
          <p>
            El titular puede modificar este aviso legal en cualquier momento para adaptarlo a cambios normativos,
            técnicos o de los servicios ofrecidos. La versión vigente será siempre la publicada en esta página, con
            indicación de la fecha de su última actualización.
          </p>
        </div>

        <nav aria-label="Otras páginas legales" className="mt-14 border-t border-gray-200 pt-8">
          <p className="text-xs font-semibold tracking-[0.14em] text-gray-500 uppercase">Documentos relacionados</p>
          <ul className="mt-4 flex flex-col gap-3 text-base sm:flex-row sm:flex-wrap sm:gap-x-8">
            <li>
              <Link href="/politica-privacidad" className="font-medium text-navy-900 underline-offset-4 hover:underline">
                Política de privacidad
              </Link>
            </li>
            <li>
              <Link href="/cookies" className="font-medium text-navy-900 underline-offset-4 hover:underline">
                Política de cookies
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
