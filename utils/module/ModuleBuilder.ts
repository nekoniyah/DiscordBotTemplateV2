import type { Client, ClientEvents, SlashCommandBuilder } from "discord.js";
import { type TemplateEventListener } from "../typers";
import { addSlashCommand } from "./registers";
import client from "../../client";
import path from "path";
import { existsSync } from "fs";
import loadDirectoryList from "../loadDirectoryList";

export default abstract class ModuleBuilder {
  constructor() {
    const eventsFolder = path.join(__dirname, "events");

    if (existsSync(eventsFolder)) {
      (async () => {
        const files = await loadDirectoryList(eventsFolder, eventsFolder);

        for (let key in files) {
          for (let path of files[key]!) {
            const { default: exec } = await import(path);
            client.on(key, exec);
          }
        }
      })();
    }
  }
}

export function SlashCommand(name: string, description: string) {
  return (
    _1: any,
    _2: string,
    descriptor: TypedPropertyDescriptor<
      (...args: any[]) => SlashCommandBuilder
    >,
  ) => {
    const val = descriptor.value!;
    addSlashCommand(val().setName(name).setDescription(description));
    return descriptor;
  };
}

export function Event<E extends keyof ClientEvents>(event: E) {
  return (
    _1: any,
    _2: string,
    descriptor: TypedPropertyDescriptor<TemplateEventListener<E>>,
  ) => {
    const val = descriptor.value!;
    client.on(event, val);
    return descriptor;
  };
}
