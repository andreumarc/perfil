import { PageTransition } from "@/components/motion/page-transition";

/** Se vuelve a montar en cada navegación: fundido suave entre páginas públicas. */
export default function MarketingTemplate({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
