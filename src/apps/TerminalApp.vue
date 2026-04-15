<script setup lang="ts">
/**
 * TerminalApp.vue
 * macOS Terminal 风格终端应用
 */

import { ref, nextTick, onMounted } from "vue";
import { useTerminal } from "../composables/useTerminal";

const { history, executeCommand, getPreviousCommand, getNextCommand } =
  useTerminal();

const inputRef = ref<HTMLInputElement | null>(null);
const terminalRef = ref<HTMLDivElement | null>(null);
const currentInput = ref("");

function handleInput() {
  if (inputRef.value) {
    currentInput.value = inputRef.value.value;
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Enter") {
    executeCommand(currentInput.value);
    currentInput.value = "";
    if (inputRef.value) {
      inputRef.value.value = "";
    }
    nextTick(scrollToBottom);
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    currentInput.value = getPreviousCommand();
    if (inputRef.value) {
      inputRef.value.value = currentInput.value;
    }
  } else if (event.key === "ArrowDown") {
    event.preventDefault();
    currentInput.value = getNextCommand();
    if (inputRef.value) {
      inputRef.value.value = currentInput.value;
    }
  }
}

function focusInput() {
  if (inputRef.value) {
    inputRef.value.focus();
  }
}

function scrollToBottom() {
  if (terminalRef.value) {
    terminalRef.value.scrollTop = terminalRef.value.scrollHeight;
  }
}

onMounted(() => {
  focusInput();
});
</script>

<template>
  <div class="terminal-app" @click="focusInput">
    <div ref="terminalRef" class="terminal-container">
      <div class="terminal-output">
        <div
          v-for="(line, index) in history"
          :key="index"
          class="terminal-line"
          :class="`terminal-line-${line.type}`"
        >
          {{ line.content }}
        </div>
      </div>
      <div class="terminal-input-line">
        <span class="terminal-prompt">$</span>
        <input
          ref="inputRef"
          type="text"
          class="terminal-input"
          @input="handleInput"
          @keydown="handleKeydown"
          autocomplete="off"
          spellcheck="false"
        />
        <span class="terminal-cursor" v-if="!currentInput"></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.terminal-app {
  width: 100%;
  height: 100%;
  background: #000000;
  font-family: "Menlo", "Monaco", "Courier New", monospace;
  font-size: 14px;
  color: #39ff14;
}

.terminal-container {
  width: 100%;
  height: 100%;
  padding: 12px;
  box-sizing: border-box;
  overflow-y: auto;
}

.terminal-output {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.terminal-line {
  line-height: 1.5;
  white-space: pre-wrap;
}

.terminal-line-input {
  color: #39ff14;
}

.terminal-line-output {
  color: #39ff14;
}

.terminal-line-error {
  color: #ff4444;
}

.terminal-input-line {
  display: flex;
  align-items: center;
  line-height: 1.5;
}

.terminal-prompt {
  color: #39ff14;
  margin-right: 8px;
}

.terminal-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #39ff14;
  font-family: inherit;
  font-size: inherit;
  caret-color: #39ff14;
}

.terminal-cursor {
  display: inline-block;
  width: 8px;
  height: 14px;
  background: #39ff14;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.terminal-container::-webkit-scrollbar {
  width: 8px;
}

.terminal-container::-webkit-scrollbar-track {
  background: #1a1a1a;
}

.terminal-container::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 4px;
}

.terminal-container::-webkit-scrollbar-thumb:hover {
  background: #444;
}
</style>
