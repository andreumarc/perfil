import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel de administración",
  robots: { index: false, follow: false },
};

/** Layout raíz del área privada: fondo neutro; el root layout ya incluye banner y analítica (desactivada en /admin). */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-dvh flex-1 flex-col bg-gray-100">{children}</div>;
}
