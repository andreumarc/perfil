import Link from "next/link";

import { Section, SectionHeading } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AEPD,
  FORM_DATA,
  formatLegalDate,
  LEGAL_IDENTITY,
  legalValue,
  PENDING_LABEL,
  PROCESSORS,
  PURPOSES,
  RETENTION,
  RIGHTS,
  TECHNICAL_DATA,
} from "@/content/legal";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const PATH = "/politica-privacidad";

export const metadata = pageMetadata({
  title: "Política de privacidad",
  description:
    "Cómo trata Marc Andreu Guerao los datos personales recogidos en este sitio: responsable, finalidades, bases jurídicas, plazos de conservación, encargados, derechos y seguridad (RGPD y LOPDGDD).",
  path: PATH,
});

function Value({ value }: { value: string }) {
  const text = legalValue(value);
  return text === PENDING_LABEL ? <span className="text-gray-500 italic">{text}</span> : <>{text}</>;
}

const CELL = "whitespace-normal align-top text-sm leading-relaxed";

export default function PoliticaPrivacidadPage() {
  const email = LEGAL_IDENTITY.email;
  const emailNode = email ? <a href={`mailto:${email}`}>{email}</a> : <Value value="" />;

  return (
    <>
      <Section size="compact" className="border-b border-gray-200 pb-10 md:pb-12">
        <Breadcrumbs items={[{ name: "Política de privacidad", path: PATH }]} />
        <SectionHeading
          as="h1"
          eyebrow="Legal"
          title="Política de privacidad"
          description="Información sobre el tratamiento de datos personales en este sitio web, conforme al Reglamento (UE) 2016/679 (RGPD) y a la Ley Orgánica 3/2018, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD)."
          className="mt-8"
        />
        <p className="mt-6 text-sm text-gray-500">
          Última actualización: {formatLegalDate(LEGAL_IDENTITY.lastUpdated)}
        </p>
      </Section>

      <Section containerSize="narrow">
        <div className="rounded-lg border border-navy-100 bg-navy-50 p-6 md:p-7">
          <p className="eyebrow">En una frase</p>
          <p className="mt-3 text-base leading-relaxed text-navy-900 md:text-lg">
            Tus datos sirven para responderte, enviarte tu diagnóstico y, si lo autorizas, hacer un seguimiento
            comercial. No se venden ni se ceden a terceros fuera de los encargados del tratamiento que se listan
            más abajo, y puedes pedir que se eliminen en cualquier momento.
          </p>
        </div>

        <div className="prose-executive mt-12 [&>h2:first-child]:mt-0">
          <h2>1. Responsable del tratamiento</h2>
          <ul>
            <li>
              <strong>Identidad:</strong> {LEGAL_IDENTITY.name}
            </li>
            <li>
              <strong>NIF:</strong> <Value value={LEGAL_IDENTITY.nif} />
            </li>
            <li>
              <strong>Domicilio:</strong> <Value value={LEGAL_IDENTITY.address} /> ({LEGAL_IDENTITY.city},{" "}
              {LEGAL_IDENTITY.country})
            </li>
            <li>
              <strong>Email de contacto para protección de datos:</strong> {emailNode}
            </li>
            <li>
              <strong>Sitio web:</strong> {site.url}
            </li>
          </ul>
          <p>
            Por la naturaleza y el volumen de la actividad no existe obligación de designar un Delegado de
            Protección de Datos (art. 37 RGPD). Cualquier consulta sobre esta política se atiende en el email
            indicado.
          </p>

          <h2>2. Datos que tratamos</h2>
          <p>
            Solo se tratan los datos necesarios para cada finalidad. No se recogen categorías especiales de datos
            (art. 9 RGPD) y los formularios están pensados para datos profesionales de contacto.
          </p>
          <h3>2.1. Datos que facilitas en los formularios</h3>
          <ul>
            {FORM_DATA.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h3>2.2. Datos técnicos recogidos automáticamente</h3>
          <ul>
            {TECHNICAL_DATA.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            La dirección IP se transforma en el servidor mediante una función hash con sal antes de almacenarse,
            de modo que el valor guardado no permite recuperar la IP original. Se utiliza únicamente para limitar
            el número de envíos por origen y detectar abusos.
          </p>

          <h2>3. Finalidades y base jurídica</h2>
          <p>
            Cada tratamiento tiene una finalidad concreta y una base jurídica del artículo 6.1 del RGPD. El
            consentimiento se recoge mediante una casilla no premarcada en cada formulario; el interés legítimo se
            ha ponderado teniendo en cuenta que los destinatarios son directivos e inversores que han mostrado
            interés en los servicios.
          </p>
        </div>

        <div className="my-8 rounded-lg border border-gray-200 bg-white">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Finalidad</TableHead>
                <TableHead>Qué implica</TableHead>
                <TableHead>Base jurídica</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PURPOSES.map((purpose) => (
                <TableRow key={purpose.title}>
                  <TableCell className={`${CELL} font-medium text-navy-900`}>{purpose.title}</TableCell>
                  <TableCell className={`${CELL} text-gray-700`}>{purpose.description}</TableCell>
                  <TableCell className={`${CELL} text-gray-700`}>
                    <span className="tabular font-semibold text-navy-900">Art. {purpose.legalBasisArticle} RGPD.</span>{" "}
                    {purpose.legalBasis}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="prose-executive">
          <p>
            Puedes retirar el consentimiento en cualquier momento sin que ello afecte a la licitud del tratamiento
            anterior, y oponerte al seguimiento comercial con una simple respuesta al email que recibas o
            escribiendo al responsable. El seguimiento se realiza siempre en relación con la solicitud que has
            hecho: no se envían boletines ni secuencias automatizadas.
          </p>

          <h2>4. Plazos de conservación</h2>
          <ul>
            <li>
              <strong>Solicitudes de contacto, diagnóstico y calculadora:</strong> {RETENTION.leadsMonths} meses
              desde el último contacto. Transcurrido ese plazo, los datos se suprimen o se anonimizan, salvo que se
              haya iniciado una relación profesional, en cuyo caso se conservan durante su vigencia y los plazos
              de prescripción legal aplicables.
            </li>
            <li>
              <strong>Eventos de navegación y del embudo:</strong> {RETENTION.eventsMonths} meses. Los eventos se
              almacenan asociados a un identificador anónimo, nunca al nombre o al email salvo que hayas enviado
              un formulario.
            </li>
            <li>
              <strong>Prueba del consentimiento:</strong> fecha, hora y versión del texto aceptado se conservan
              junto con la solicitud mientras exista el registro, para poder acreditar el consentimiento (art. 7.1
              RGPD).
            </li>
            <li>
              <strong>Cookies y almacenamiento local:</strong> los plazos de cada cookie se detallan en la{" "}
              <Link href="/cookies">política de cookies</Link>.
            </li>
          </ul>

          <h2>5. Destinatarios y encargados del tratamiento</h2>
          <p>
            No se venden ni se ceden datos a terceros. Para prestar el servicio se utilizan proveedores que actúan
            como encargados del tratamiento (art. 28 RGPD) con contratos que garantizan la confidencialidad y el
            uso de los datos exclusivamente según las instrucciones del responsable. Los proveedores de analítica
            y marketing solo se activan si has aceptado las cookies correspondientes.
          </p>
        </div>

        <div className="my-8 rounded-lg border border-gray-200 bg-white">
          <Table className="min-w-[720px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Proveedor</TableHead>
                <TableHead>Servicio</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Requiere consentimiento</TableHead>
                <TableHead>Transferencia internacional</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PROCESSORS.map((processor) => (
                <TableRow key={processor.name}>
                  <TableCell className={`${CELL} font-medium text-navy-900`}>{processor.name}</TableCell>
                  <TableCell className={`${CELL} text-gray-700`}>{processor.role}</TableCell>
                  <TableCell className={`${CELL} text-gray-700`}>{processor.location}</TableCell>
                  <TableCell className={`${CELL} text-gray-700`}>{processor.requiresConsent ? "Sí" : "No"}</TableCell>
                  <TableCell className={`${CELL} text-gray-700`}>{processor.internationalTransfer}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="prose-executive">
          <h3>Transferencias internacionales</h3>
          <p>
            Algunos encargados tienen su sede o parte de su infraestructura en Estados Unidos. Las transferencias
            se amparan en las Cláusulas Contractuales Tipo aprobadas por la Comisión Europea (Decisión 2021/914)
            y, cuando el proveedor está certificado, en la decisión de adecuación del EU-US Data Privacy
            Framework. Puedes solicitar al responsable una copia de las garantías aplicables.
          </p>
          <p>
            Además, los datos podrán comunicarse a las administraciones públicas y a los órganos judiciales cuando
            una obligación legal así lo exija.
          </p>

          <h2>6. Tus derechos</h2>
          <p>Como titular de los datos puedes ejercer en cualquier momento los siguientes derechos:</p>
          <ul>
            {RIGHTS.map((right) => (
              <li key={right.name}>
                <strong>{right.name}:</strong> {right.description}
              </li>
            ))}
          </ul>
          <p>
            También puedes retirar el consentimiento prestado y oponerte a recibir comunicaciones comerciales.
            Para ejercer cualquiera de estos derechos escribe a {emailNode} indicando el derecho que ejerces y una
            dirección a efectos de notificación. Si existe una duda razonable sobre tu identidad, se te podrá pedir
            una copia de un documento identificativo, que se eliminará una vez verificada. La solicitud se
            responde en el plazo máximo de un mes, ampliable dos meses más en casos complejos, informándote de ello.
          </p>
          <p>
            Si consideras que el tratamiento no se ajusta a la normativa, tienes derecho a presentar una
            reclamación ante la{" "}
            <a href={AEPD.url} target="_blank" rel="noopener noreferrer">
              {AEPD.name}
            </a>{" "}
            (C/ Jorge Juan 6, 28001 Madrid), autoridad de control competente en España.
          </p>

          <h2>7. Seguridad</h2>
          <p>
            Se aplican medidas técnicas y organizativas proporcionadas al riesgo (art. 32 RGPD), entre ellas:
            cifrado de las comunicaciones mediante TLS; anonimización de la dirección IP mediante hash con sal
            antes de su almacenamiento; validación en servidor de todos los datos recibidos; limitación del número
            de envíos por origen y filtros anti-spam; acceso al registro de solicitudes restringido al responsable
            mediante credenciales y sesión firmada con caducidad; principio de minimización (solo se piden los
            datos necesarios); y encargados del tratamiento seleccionados por sus garantías de seguridad y
            cumplimiento.
          </p>

          <h2>8. Menores de edad</h2>
          <p>
            Este sitio se dirige a directivos, propietarios e inversores de empresas, y no está destinado a
            menores de 18 años. No se recogen conscientemente datos de menores; si tienes conocimiento de que un
            menor ha facilitado datos a través del sitio, comunícalo al responsable para proceder a su supresión.
          </p>

          <h2>9. Decisiones automatizadas y perfilado</h2>
          <p>
            Para priorizar la respuesta a las solicitudes se asigna internamente una puntuación (lead scoring) a
            partir de los datos profesionales facilitados: número de centros, cargo, facturación aproximada, sector
            y prioridad indicada. Esta puntuación solo determina el orden y la forma en que el responsable revisa
            y responde personalmente a cada solicitud; no produce efectos jurídicos ni te afecta de modo
            significativo, por lo que no constituye una decisión automatizada en el sentido del artículo 22 RGPD.
            Puedes solicitar información sobre la puntuación asignada ejerciendo tu derecho de acceso.
          </p>

          <h2>10. Cambios en esta política</h2>
          <p>
            Esta política puede actualizarse para reflejar cambios normativos, nuevos proveedores o nuevas
            funcionalidades del sitio. La versión vigente es siempre la publicada en esta página, con su fecha de
            última actualización. Si un cambio afecta de forma sustancial a las finalidades o a las bases jurídicas
            del tratamiento, se informará de forma destacada y, cuando proceda, se solicitará de nuevo el
            consentimiento.
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
