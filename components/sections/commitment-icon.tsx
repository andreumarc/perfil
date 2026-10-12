import {
  CalendarCheckIcon,
  ClipboardListIcon,
  DraftingCompassIcon,
  MessageSquareTextIcon,
  ShieldCheckIcon,
  UsersIcon,
  WrenchIcon,
  type LucideIcon,
} from "lucide-react";

import type { CommitmentIcon as CommitmentIconName } from "@/lib/validation/settings";

const ICONS: Record<CommitmentIconName, LucideIcon> = {
  advice: MessageSquareTextIcon,
  management: ClipboardListIcon,
  deadline: CalendarCheckIcon,
  quality: ShieldCheckIcon,
  team: UsersIcon,
  installations: WrenchIcon,
  shield: ShieldCheckIcon,
  design: DraftingCompassIcon,
};

export function CommitmentIcon({ name, className }: { name: CommitmentIconName; className?: string }) {
  const Icon = ICONS[name] ?? ShieldCheckIcon;
  return <Icon className={className} aria-hidden />;
}
