import type { Metadata } from "next";

import { LegalPage, legalMetadata } from "@/components/content/legal-page";

export function generateMetadata(): Promise<Metadata> {
  return legalMetadata("privacidad");
}

export default function Page() {
  return <LegalPage docKey="privacidad" />;
}
