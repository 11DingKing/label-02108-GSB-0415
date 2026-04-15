<script setup lang="ts">
/**
 * AppWindow.vue
 * macOS 风格应用窗口组件
 * 
 * 使用 vue-draggable-resizable 实现窗口拖拽和缩放功能
 * 
 * Requirements: 4.2, 4.3, 4.4
 * - 4.2: Window dragging by title bar
 * - 4.3: Window resizing from edges and corners
 * - 4.4: Traffic light buttons in top-left corner
 */

import { computed, ref } from 'vue';
import VueDraggableResizable from 'vue-draggable-resizable';
import 'vue-draggable-resizable/style.css';
import TrafficLightButtons from './TrafficLightButtons.vue';
import type { WindowState } from '../types';

// Props definition
const props = defineProps<{
  window: WindowState;
}>();

// Emits definition
const emit = defineEmits<{
  (e: 'close', windowId: string): void;
  (e: 'minimize', windowId: string): void;
  (e: 'maximize', windowId: string): void;
  (e: 'focus', windowId: string): void;
  (e: 'update-position', windowId: string, x: number, y: number): void;
  (e: 'update-size', windowId: string, width: number, height: number): void;
}>();

// Reference to the title bar for drag handle
const titleBarRef = ref<HTMLElement | null>(null);

// Computed styles for the window
const windowStyle = computed(() => ({
  display: props.window.isMinimized ? 'none' : 'block',
}));

// Handle traffic light button events
const handleClose = () => {
  emit('close', props.window.id);
};

const handleMinimize = () => {
  emit('minimize', props.window.id);
};

const handleMaximize = () => {
  emit('maximize', props.window.id);
};

// Handle window focus when clicked
const handleFocus = () => {
  emit('focus', props.window.id);
};

// Handle drag events - update position
// vue-draggable-resizable emits 'left' and 'top' parameters
const handleDragging = (left: number, top: number) => {
  emit('update-position', props.window.id, left, top);
};

// Handle resize events - update size
// vue-draggable-resizable emits 'left', 'top', 'width', 'height' parameters
const handleResizing = (left: number, top: number, width: number, height: number) => {
  emit('update-position', props.window.id, left, top);
  emit('update-size', props.window.id, width, height);
};

// Minimum window dimensions
const minWidth = 200;
const minHeight = 150;
</script>

<template>
  <VueDraggableResizable
    :x="window.x"
    :y="window.y"
    :w="window.width"
    :h="window.height"
    :z="window.zIndex"
    :min-width="minWidth"
    :min-height="minHeight"
    :resizable="!window.isMaximized"
    :draggable="!window.isMaximized"
    :parent="false"
    drag-handle=".window-title-bar"
    class="app-window"
    :style="windowStyle"
    @dragging="handleDragging"
    @resizing="handleResizing"
    @mousedown="handleFocus"
  >
    <div class="window-container">
      <!-- Window Title Bar -->
      <div 
        ref="titleBarRef"
        class="window-title-bar"
        @dblclick="handleMaximize"
      >
        <!-- Traffic Light Buttons -->
        <div class="title-bar-left">
          <TrafficLightButtons
            @close="handleClose"
            @minimize="handleMinimize"
            @maximize="handleMaximize"
          />
        </div>
        
        <!-- Window Title (centered) -->
        <div class="title-bar-center">
          <img 
            v-if="window.icon" 
            :src="window.icon" 
            :alt="window.title"
            class="window-icon"
          />
          <span class="window-title">{{ window.title }}</span>
        </div>
        
        <!-- Right side spacer for centering -->
        <div class="title-bar-right"></div>
      </div>
      
      <!-- Window Content Area -->
      <div class="window-content">
        <slot></slot>
      </div>
    </div>
  </VueDraggableResizable>
</template>

<style scoped>
.app-window {
  position: absolute;
  border-radius: var(--window-border-radius);
  box-shadow: var(--window-shadow);
  overflow: hidden;
  background: var(--window-bg);
}

.window-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-radius: var(--window-border-radius);
  overflow: hidden;
}

/* Window Title Bar */
.window-title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 38px;
  min-height: 38px;
  padding: 0 12px;
  background: var(--window-title-bar);
  border-bottom: 1px solid var(--window-border);
  cursor: default;
  user-select: none;
}

.title-bar-left {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
}

.title-bar-center {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  overflow: hidden;
}

.title-bar-right {
  flex: 0 0 auto;
  width: 52px; /* Match the width of traffic light buttons for centering */
}

.window-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.window-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Window Content Area */
.window-content {
  flex: 1 1 auto;
  overflow: auto;
  background: var(--window-bg);
}

/* Override vue-draggable-resizable default styles */
:deep(.vdr) {
  border: none !important;
}

:deep(.handle) {
  background: transparent !important;
  border: none !important;
}

/* Resize handles - make them more visible on hover */
:deep(.handle-tl),
:deep(.handle-tr),
:deep(.handle-bl),
:deep(.handle-br) {
  width: 10px !important;
  height: 10px !important;
}

:deep(.handle-tm),
:deep(.handle-bm) {
  height: 6px !important;
}

:deep(.handle-ml),
:deep(.handle-mr) {
  width: 6px !important;
}
</style>
