import "dotenv/config";
import { Client, Partials } from "discord.js";
import loadDirectoryList from "./utils/loadDirectoryList";
import path from "node:path";
import type ModuleBuilder from "./utils/module/ModuleBuilder";

const client = new Client({
  intents: ["GuildMembers", "GuildPresences", "Guilds"],
  partials: [Partials.GuildMember, Partials.Channel, Partials.User],
});

(async () => {
  const modulesPath = path.join(process.cwd(), "modules");
  const modules = await loadDirectoryList(modulesPath, modulesPath);

  for (let key in modules) {
    for (let path of modules[key]!) {
      await import(path);
    }
  }

  await client.login(process.env.TOKEN);
})();
