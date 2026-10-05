import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface ConfigItem {
  name: string;
  /** Variable(s) de entorno implicadas. Nunca su valor. */
  envVar: string;
  configured: boolean;
  /** Valor público o enmascarado que sí se puede mostrar. */
  detail?: string;
  /** Qué pasa si falta. */
  hint?: string;
}

/** Enmascara un email: "marc@dominio.com" → "m***@dominio.com". */
export function maskEmail(email: string): string {
  const at = email.indexOf("@");
  if (at <= 0) return "***";
  return `${email.charAt(0)}***${email.slice(at)}`;
}

/** Tabla de estado de integraciones: Configurado / No configurado, sin exponer secretos. */
export function ConfigStatusTable({ items }: { items: ConfigItem[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Integración</TableHead>
          <TableHead>Variable</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Detalle</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.name}>
            <TableCell className="font-medium text-navy-900">{item.name}</TableCell>
            <TableCell className="font-mono text-xs text-gray-600">{item.envVar}</TableCell>
            <TableCell>
              {item.configured ? (
                <Badge variant="success">Configurado</Badge>
              ) : (
                <Badge variant="muted">No configurado</Badge>
              )}
            </TableCell>
            <TableCell className="max-w-[360px] whitespace-normal text-xs text-gray-600">
              {item.configured && item.detail ? (
                <span className="break-all font-mono text-navy-900">{item.detail}</span>
              ) : item.configured ? (
                <span className="text-gray-400">—</span>
              ) : (
                item.hint ?? <span className="text-gray-400">—</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
