<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useTerminal } from '../composables/useTerminal';

const { lines, currentInput, handleKeyDown } = useTerminal();

const terminalRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

function focusInput(): void {
  nextTick(() => {
    inputRef.value?.focus();
  });
}

function handleTerminalClick(): void {
  focusInput();
}

onMounted(() => {
  focusInput();
});
</script>

<template>
  <div class="terminal-app" @click="handleTerminalClick">
    <div class="terminal-content" ref="terminalRef">
      <div class="terminal-output">
        <div
          v-for="(line, index) in lines"
          :key="index"
          class="terminal-line"
          :class="line.type"
        >
          {{ line.content }}
        </div>
      </div>
      <div class="terminal-input-line">
        <span class="prompt">$</span>
        <input
          ref="inputRef"
          v-model="currentInput"
          type="text"
          class="terminal-input"
          @keydown="handleKeyDown"
          autocomplete="off"
          spellcheck="false"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.terminal-app {
  width: 100%;
  height: 100%;
  background: #000000;
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  color: #32D74B;
  padding: 12px;
  box-sizing: border-box;
  cursor: text;
}

.terminal-content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.terminal-output {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.terminal-line {
  line-height: 1.5;
  margin: 0;
  padding: 0;
}

.terminal-line.input {
  color: #32D74B;
}

.terminal-line.output {
  color: #32D74B;
}

.terminal-line.error {
  color: #FF453A;
}

.terminal-input-line {
  display: flex;
  align-items: center;
  gap: 8px;
}

.prompt {
  color: #32D74B;
  font-weight: bold;
}

.terminal-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #32D74B;
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  padding: 0;
  margin: 0;
}

.terminal-input::placeholder {
  color: #32D74B;
  opacity: 0.5;
}

.terminal-content::-webkit-scrollbar {
  width: 8px;
}

.terminal-content::-webkit-scrollbar-track {
  background: #1a1a1a;
}

.terminal-content::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 4px;
}

.terminal-content::-webkit-scrollbar-thumb:hover {
  background: #444;
}
</style>
