import { h, signal } from "@prestonarnold/fuse";
import { defineApp, Input, listApps } from "../../pmod";
import { createAppOpener } from "../../utils/opener";
import { Container, Output, InputLine, Prompt } from "./terminal.styles";

defineApp({
  name: "Terminal",
  icon: "Terminal",
  width: 600,
  height: 400,
  content() {
    const lines = signal<string[]>(['Type "help" for commands\n']);
    const input = signal("");
    const appOpener = createAppOpener(window.mobileOpenApp);

    const commands: Record<string, (args: string[]) => string> = {
      help: () => "Commands: help, clear, echo, date, ls, open",
      open: (args) => {
        if (args.length === 0) {
          const apps = listApps()
            .filter((app) => app.showInDock !== false)
            .map((app) => app.name.toLowerCase());
          return `Usage: open [app_name]\n\nAvailable apps:\n${apps.join(
            "\n"
          )}`;
        }

        const appName = args[0];
        const appExists = listApps().some(
          (app) => app.name.toLowerCase() === appName.toLowerCase()
        );

        if (!appExists) {
          return `App not found: ${appName.toLowerCase()}`;
        }

        const app = listApps().find(
          (app) => app.name.toLowerCase() === appName.toLowerCase()
        );
        if (app) {
          appOpener.open(
            app.name,
            args.length > 1 ? { args: args.slice(1) } : undefined
          );
          return `Opening "${app.name.toLowerCase()}"`;
        }

        return `Failed to open app: ${appName.toLowerCase()}`;
      },
      clear: () => {
        lines.set([]);
        return "";
      },
      echo: (args) => args.join(" "),
      date: () => new Date().toString(),
      ls: () => "Documents  Downloads  Projects",
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        const cmd = input.get().trim();
        if (cmd) {
          const parts = cmd.split(/\s+/);
          const command = parts[0];
          const args = parts.slice(1);

          const output = commands[command]
            ? commands[command](args)
            : `Command not found: ${command}`;

          lines.set([...lines.get(), `$ ${cmd}`, output + "\n"]);
        }
        input.set("");
      }
    };

    return (
      <Container>
        <Output>{() => lines.get().join("\n")}</Output>
        <InputLine>
          <Prompt>$</Prompt>
          <Input
            value={input}
            onInput={(e: Event) =>
              input.set((e.target as HTMLInputElement).value)
            }
            onKeyDown={handleKeyDown}
            autofocus
          />
        </InputLine>
      </Container>
    );
  },
});
