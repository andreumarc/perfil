import "server-only";

import { SignJWT, jwtVerify } from "jose";

import { serverEnv } from "@/lib/env";

import { secretKey } from "./token";

const TTL = "20m";

/** Token efímero que autoriza adjuntar ficheros a una solicitud recién creada (solo quien la envió lo recibe). */
export async function signAttachmentToken(leadId: string): Promise<string | null> {
  const key = secretKey(serverEnv().authSecret);
  if (!key) return null;
  return new SignJWT({ purpose: "attach" }).setProtectedHeader({ alg: "HS256" }).setSubject(leadId).setIssuedAt().setExpirationTime(TTL).sign(key);
}

export async function verifyAttachmentToken(token: string): Promise<string | null> {
  const key = secretKey(serverEnv().authSecret);
  if (!key) return null;
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    return payload.purpose === "attach" && typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}
