<script setup lang="ts">
/**
 * TerminalApp.vue
 * macOS Terminal style application
 */

import { useTerminal } from "../composables/useTerminal";
import AppWindow from "../components/AppWindow.vue";

const { history, input, handleKeyDown, scrollToBottom } = useTerminal();
</script>

<template>
  <div class="terminal-app">
    <div
      class="terminal-output"
      @click="() => document.querySelector('.terminal-input')?.focus()"
    >
      <div v-for="(item, index) in history" :key="index" class="terminal-line">
        <span v-if="item.type === 'command'" class="command-prompt"
          >user@mac ~ %
        </span>
        <span v-if="item.type === 'command'" class="command-text">{{
          item.content
        }}</span>
        <span v-if="item.type === 'result'" class="result-text">{{
          item.content
        }}</span>
        <span v-if="item.type === 'error'" class="error-text">{{
          item.content
        }}</span>
      </div>
      <div class="input-line">
        <span class="command-prompt">user@mac ~ % </span>
        <input
          v-model="input"
          class="terminal-input"
          @keydown="handleKeyDown"
          autocomplete="off"
          spellcheck="false"
          autofocus
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.terminal-app {
  width: 100%;
  height: 100%;
  background: #000;
  font-family: "Menlo", "Monaco", "Courier New", monospace;
  font-size: 13px;
  line-height: 1.5;
  padding: 8px;
  box-sizing: border-box;
  overflow: hidden;
}

.terminal-output {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  color: #39ff14;
}

.terminal-line {
  margin-bottom: 2px;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.command-prompt {
  color: #39ff14;
  font-weight: 500;
}

.command-text {
  color: #39ff14;
  margin-left: 4px;
}

.result-text {
  color: #39ff14;
  display: block;
  padding-left: 0;
}

.error-text {
  color: #ff4444;
  display: block;
}

.input-line {
  display: flex;
  align-items: center;
}

.terminal-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #39ff14;
  font-family: "Menlo", "Monaco", "Courier New", monospace;
  font-size: 13px;
  padding: 0;
  margin-left: 4px;
  caret-color: #39ff14;
}

.terminal-output::-webkit-scrollbar {
  width: 8px;
}

.terminal-output::-webkit-scrollbar-track {
  background: #1a1a1a;
}

.terminal-output::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 4px;
}

.terminal-output::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
