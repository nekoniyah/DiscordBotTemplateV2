import type { ClientEvents } from "discord.js";

export type TemplateEvent<Name extends keyof ClientEvents> = (
  listener: (...args: ClientEvents[Name]) => void | Promise<void>,
) => void | Promise<void>;

export function TemplateEvent<Name extends keyof ClientEvents>(
  listener: (...args: ClientEvents[Name]) => void | Promise<void>,
) {
  return listener;
}
