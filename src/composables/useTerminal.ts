import { ref } from 'vue';

export interface TerminalLine {
  type: 'input' | 'output' | 'error';
  content: string;
}

export function useTerminal() {
  const lines = ref<TerminalLine[]>([]);
  const currentInput = ref('');
  const commandHistory = ref<string[]>([]);
  const historyIndex = ref(-1);

  const mockFiles = [
    'Desktop',
    'Documents',
    'Downloads',
    'Pictures',
    'Music',
    'Movies',
    'Applications',
    'README.md',
    '.bash_profile',
    '.zshrc'
  ];

  function executeCommand(command: string): void {
    lines.value.push({ type: 'input', content: `$ ${command}` });
    commandHistory.value.push(command);
    historyIndex.value = commandHistory.value.length;

    const trimmedCommand = command.trim();
    const args = trimmedCommand.split(' ');
    const cmd = args[0].toLowerCase();

    switch (cmd) {
      case 'help':
        lines.value.push({
          type: 'output',
          content: `Available commands:
  help    - Show this help message
  date    - Show current date and time
  echo    - Echo a message
  clear   - Clear the terminal
  ls      - List files and directories

Type a command and press Enter to execute.`
        });
        break;

      case 'date':
        lines.value.push({
          type: 'output',
          content: new Date().toString()
        });
        break;

      case 'echo':
        lines.value.push({
          type: 'output',
          content: args.slice(1).join(' ')
        });
        break;

      case 'clear':
        lines.value = [];
        break;

      case 'ls':
        lines.value.push({
          type: 'output',
          content: mockFiles.join('  ')
        });
        break;

      case '':
        break;

      default:
        lines.value.push({
          type: 'error',
          content: `bash: ${cmd}: command not found`
        });
        break;
    }
  }

  function handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      executeCommand(currentInput.value);
      currentInput.value = '';
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (historyIndex.value > 0) {
        historyIndex.value--;
        currentInput.value = commandHistory.value[historyIndex.value];
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (historyIndex.value < commandHistory.value.length - 1) {
        historyIndex.value++;
        currentInput.value = commandHistory.value[historyIndex.value];
      } else {
        historyIndex.value = commandHistory.value.length;
        currentInput.value = '';
      }
    }
  }

  return {
    lines,
    currentInput,
    commandHistory,
    executeCommand,
    handleKeyDown
  };
}
