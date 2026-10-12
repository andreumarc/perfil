// Fichero generado por scripts/generate-content-index.mjs — no editar a mano.
import type { LocalAreaContent } from "@/content/types";
import { zone as m0_anoia } from "./anoia";
import { zone as m1_barcelona } from "./barcelona";
import { zone as m2_cataluna } from "./cataluna";
import { zone as m3_espana } from "./espana";
import { zone as m4_igualada } from "./igualada";

const ALL_ZONES: LocalAreaContent[] = [m0_anoia, m1_barcelona, m2_cataluna, m3_espana, m4_igualada];

export const LOCAL_AREAS: LocalAreaContent[] = [...ALL_ZONES].sort((a, b) => a.order - b.order);
