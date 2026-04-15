/**
 * Terminal command logic composable
 * Handles all command parsing and execution for the Terminal app
 */

import { ref, nextTick } from 'vue';

export interface TerminalOutput {
  type: 'command' | 'result' | 'error';
  content: string;
}

export function useTerminal() {
  const history = ref<TerminalOutput[]>([]);
  const input = ref('');
  const commandHistory = ref<string[]>([]);
  const historyIndex = ref(-1);

  const mockFiles = [
    'Documents/',
    'Downloads/',
    'Pictures/',
    'Movies/',
    'Music/',
    'Desktop/',
    'Applications/',
    'README.md',
    '.zshrc',
    '.bash_profile'
  ];

  const helpText = `
Built-in commands:
  help        Show this help message
  date        Show current date and time
  echo <text> Print text to the terminal
  clear       Clear the terminal screen
  ls          List directory contents

For more information, see documentation.
`;

  const executeCommand = (cmd: string) => {
    history.value.push({ type: 'command', content: cmd });
    commandHistory.value.push(cmd);
    historyIndex.value = commandHistory.value.length;

    const trimmedCmd = cmd.trim();
    const [command, ...args] = trimmedCmd.split(' ');

    switch (command.toLowerCase()) {
      case 'help':
        history.value.push({ type: 'result', content: helpText });
        break;

      case 'date':
        history.value.push({ type: 'result', content: new Date().toString() });
        break;

      case 'echo':
        history.value.push({ type: 'result', content: args.join(' ') });
        break;

      case 'clear':
        history.value = [];
        break;

      case 'ls':
        history.value.push({ type: 'result', content: mockFiles.join('  ') });
        break;

      case '':
        break;

      default:
        history.value.push({
          type: 'error',
          content: `zsh: command not found: ${command}`
        });
        break;
    }

    input.value = '';
    nextTick(scrollToBottom);
  };

  const scrollToBottom = () => {
    const terminalElement = document.querySelector('.terminal-output');
    if (terminalElement) {
      terminalElement.scrollTop = terminalElement.scrollHeight;
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(input.value);
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      if (historyIndex.value > 0) {
        historyIndex.value--;
        input.value = commandHistory.value[historyIndex.value] || '';
        e.preventDefault();
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex.value < commandHistory.value.length - 1) {
        historyIndex.value++;
        input.value = commandHistory.value[historyIndex.value] || '';
      } else {
        historyIndex.value = commandHistory.value.length;
        input.value = '';
      }
      e.preventDefault();
    }
  };

  return {
    history,
    input,
    executeCommand,
    handleKeyDown,
    scrollToBottom
  };
}
