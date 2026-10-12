"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, UserPlusIcon } from "lucide-react";

import { createUserAction, updateUserAction } from "@/actions/admin-users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { USER_ROLES, USER_ROLE_LABELS, type UserRole } from "@/types/lead";

export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLoginLabel: string | null;
}

export function UserManager({ users, currentUserId }: { users: UserRow[]; currentUserId: string }) {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<UserRole>("editor");
  const [password, setPassword] = React.useState("");
  const [message, setMessage] = React.useState<{ ok: boolean; text: string } | null>(null);
  const [isPending, startTransition] = React.useTransition();
  const [resetFor, setResetFor] = React.useState<string | null>(null);
  const [resetPassword, setResetPassword] = React.useState("");

  function create() {
    setMessage(null);
    startTransition(async () => {
      const res = await createUserAction({ name, email, role, password });
      if (res.ok) {
        setName(""); setEmail(""); setPassword(""); setRole("editor");
        setMessage({ ok: true, text: "Usuario creado." });
        router.refresh();
      } else setMessage({ ok: false, text: res.message });
    });
  }

  function patch(userId: string, data: { role?: UserRole; isActive?: boolean; password?: string }) {
    setMessage(null);
    startTransition(async () => {
      const res = await updateUserAction({ userId, ...data });
      if (res.ok) {
        setMessage({ ok: true, text: "Guardado." });
        setResetFor(null); setResetPassword("");
        router.refresh();
      } else setMessage({ ok: false, text: res.message });
    });
  }

  return (
    <div className="space-y-6">
      {message ? <p className={`text-sm ${message.ok ? "text-emerald-700" : "text-red-700"}`} role="status">{message.text}</p> : null}
      <div className="rounded-lg border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Usuario</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Último acceso</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => {
              const me = u.id === currentUserId;
              return (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="font-medium text-ink-900">{u.name}{me ? <span className="ml-2 text-xs text-gray-500">(tú)</span> : null}</div>
                    <div className="text-xs text-gray-500">{u.email}</div>
                  </TableCell>
                  <TableCell>
                    <Select value={u.role} onValueChange={(v) => patch(u.id, { role: v as UserRole })} disabled={isPending || me}>
                      <SelectTrigger size="sm" className="w-40" aria-label={`Rol de ${u.name}`}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {USER_ROLES.map((r) => (
                          <SelectItem key={r} value={r}>{USER_ROLE_LABELS[r]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{u.isActive ? <Badge variant="success">Activo</Badge> : <Badge variant="muted">Desactivado</Badge>}</TableCell>
                  <TableCell className="tabular text-gray-600">{u.lastLoginLabel ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      {resetFor === u.id ? (
                        <form className="flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); patch(u.id, { password: resetPassword }); }}>
                          <Input type="password" value={resetPassword} onChange={(e) => setResetPassword(e.target.value)} placeholder="Nueva contraseña" minLength={12} className="h-9 w-44" aria-label="Nueva contraseña" autoComplete="new-password" />
                          <Button type="submit" size="sm" variant="dark" disabled={isPending}>Guardar</Button>
                          <Button type="button" size="sm" variant="ghost" onClick={() => setResetFor(null)}>Cancelar</Button>
                        </form>
                      ) : (
                        <Button type="button" size="sm" variant="outline" onClick={() => setResetFor(u.id)} disabled={isPending}>Cambiar contraseña</Button>
                      )}
                      {!me ? (
                        <Button type="button" size="sm" variant="ghost" onClick={() => patch(u.id, { isActive: !u.isActive })} disabled={isPending}>{u.isActive ? "Desactivar" : "Reactivar"}</Button>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nuevo usuario</CardTitle>
          <CardDescription>Los editores gestionan contenido y solicitudes; los administradores además ajustes, usuarios, exportaciones y RGPD.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); create(); }}>
            <div className="space-y-1.5"><Label htmlFor="nu-name">Nombre</Label><Input id="nu-name" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} /></div>
            <div className="space-y-1.5"><Label htmlFor="nu-email">Email</Label><Input id="nu-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="off" /></div>
            <div className="space-y-1.5">
              <Label htmlFor="nu-role">Rol</Label>
              <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                <SelectTrigger id="nu-role" className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {USER_ROLES.map((r) => (
                    <SelectItem key={r} value={r}>{USER_ROLE_LABELS[r]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label htmlFor="nu-password">Contraseña inicial (mín. 12)</Label><Input id="nu-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={12} autoComplete="new-password" /></div>
            <div className="sm:col-span-2">
              <Button type="submit" variant="dark" disabled={isPending}>
                {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <UserPlusIcon aria-hidden />}
                Crear usuario
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
