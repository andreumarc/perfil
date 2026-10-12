import type { Metadata } from "next";

import { DataRequestForm } from "@/components/forms/data-request-form";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { getSettings } from "@/lib/cms/settings";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return pageMetadata({
    title: "Ejercer tus derechos de protección de datos",
    description: "Solicita el acceso, la rectificación o la supresión de tus datos personales, u otra petición relacionada con la protección de datos.",
    path: "/privacidad/solicitud",
    siteName: s.company.name,
    noIndex: true,
  });
}

export default async function DataRequestPage() {
  const settings = await getSettings();
  const email = settings.legal.email && !settings.legal.email.includes("[POR CONFIRMAR") ? settings.legal.email : settings.company.email;

  return (
    <>
      <section className="border-b border-gray-200 bg-white">
        <Container size="narrow" className="py-10 md:py-14">
          <Breadcrumbs items={[{ name: "Política de privacidad", path: "/politica-privacidad" }, { name: "Ejercer derechos", path: "/privacidad/solicitud" }]} />
          <p className="eyebrow mt-6">Protección de datos</p>
          <h1 className="font-display mt-3 text-3xl text-ink-900 sm:text-4xl">Ejerce tus derechos sobre tus datos</h1>
          <p className="mt-5 text-base text-gray-600 md:text-lg">
            Puedes solicitar el acceso a tus datos, su rectificación o supresión, la limitación u oposición al tratamiento y la portabilidad. Respondemos en el plazo legal de un mes.
            {email ? (
              <>
                {" "}
                También puedes escribirnos a <a href={`mailto:${email}`} className="underline underline-offset-4">{email}</a>.
              </>
            ) : null}
          </p>
        </Container>
      </section>
      <Container size="narrow" className="py-10 md:py-14">
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-[0_8px_30px_rgba(23,25,29,0.05)] md:p-8">
          <DataRequestForm />
        </div>
      </Container>
    </>
  );
}
