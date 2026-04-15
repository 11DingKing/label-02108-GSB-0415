/**
 * useTerminal.ts
 * Terminal command parser composable
 *
 * Provides terminal command parsing and execution logic.
 */

import { ref } from "vue";

export interface TerminalLine {
  type: "input" | "output" | "error";
  content: string;
}

const mockFiles = [
  "Documents",
  "Downloads",
  "Desktop",
  "Applications",
  "Pictures",
  "Music",
  "Movies",
  "readme.txt",
];

export function useTerminal() {
  const history = ref<TerminalLine[]>([]);
  const commandHistory = ref<string[]>([]);
  const historyIndex = ref(-1);

  function addLine(type: TerminalLine["type"], content: string) {
    history.value.push({ type, content });
  }

  function executeCommand(input: string): void {
    const trimmedInput = input.trim();

    addLine("input", `$ ${trimmedInput}`);

    if (trimmedInput) {
      commandHistory.value.push(trimmedInput);
      historyIndex.value = commandHistory.value.length;
    }

    const [command, ...args] = trimmedInput.split(" ");

    switch (command.toLowerCase()) {
      case "help":
        addLine("output", "Available commands:");
        addLine("output", "  help   - Display this help message");
        addLine("output", "  date   - Display current date and time");
        addLine("output", "  echo   - Echo the arguments");
        addLine("output", "  clear  - Clear the terminal screen");
        addLine("output", "  ls     - List directory contents");
        break;

      case "date":
        addLine("output", new Date().toString());
        break;

      case "echo":
        addLine("output", args.join(" "));
        break;

      case "clear":
        history.value = [];
        break;

      case "ls":
        addLine("output", mockFiles.join("  "));
        break;

      case "":
        break;

      default:
        addLine("error", `bash: ${command}: command not found`);
        break;
    }
  }

  function getPreviousCommand(): string {
    if (commandHistory.value.length === 0) return "";
    if (historyIndex.value > 0) {
      historyIndex.value--;
      return commandHistory.value[historyIndex.value];
    }
    return commandHistory.value[0] || "";
  }

  function getNextCommand(): string {
    if (commandHistory.value.length === 0) return "";
    if (historyIndex.value < commandHistory.value.length - 1) {
      historyIndex.value++;
      return commandHistory.value[historyIndex.value];
    }
    historyIndex.value = commandHistory.value.length;
    return "";
  }

  function resetHistoryIndex() {
    historyIndex.value = commandHistory.value.length;
  }

  return {
    history,
    commandHistory,
    executeCommand,
    getPreviousCommand,
    getNextCommand,
    resetHistoryIndex,
  };
}
