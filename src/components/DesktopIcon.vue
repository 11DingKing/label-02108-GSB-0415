<script setup lang="ts">
/**
 * DesktopIcon Component
 * 
 * Displays a desktop icon with label that supports:
 * - Single-click selection with highlight effect
 * - Double-click to open application
 * - Drag to reposition within desktop
 * 
 * Requirements satisfied:
 * - 3.1: Display icon image and label below it
 * - 3.2: Double-click opens application window
 * - 3.3: Single-click selects icon with highlight
 * - 3.5: Drag to reposition within desktop area
 */

import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { DesktopIconData, Position } from '../types';

// Props definition
const props = defineProps<{
  icon: DesktopIconData;
  isSelected: boolean;
}>();

// Emits definition
const emit = defineEmits<{
  (e: 'select', iconId: string): void;
  (e: 'open', appId: string): void;
  (e: 'move', iconId: string, position: Position): void;
}>();

// Drag state
const isDragging = ref(false);
const dragStartPos = ref<Position>({ x: 0, y: 0 });
const iconStartPos = ref<Position>({ x: 0, y: 0 });
const currentPos = ref<Position>({ x: props.icon.position.x, y: props.icon.position.y });

// Double-click detection
const clickTimeout = ref<number | null>(null);
const clickCount = ref(0);
const DOUBLE_CLICK_DELAY = 300; // ms

// Computed style for positioning
const iconStyle = computed(() => ({
  left: `${currentPos.value.x}px`,
  top: `${currentPos.value.y}px`,
}));

/**
 * Handles mouse down event to start drag or detect clicks
 * Validates: Requirements 3.3, 3.5
 */
function handleMouseDown(event: MouseEvent) {
  // Prevent default to avoid text selection during drag
  event.preventDefault();
  
  // Select the icon on mouse down
  emit('select', props.icon.id);
  
  // Store initial positions for drag calculation
  dragStartPos.value = { x: event.clientX, y: event.clientY };
  iconStartPos.value = { x: currentPos.value.x, y: currentPos.value.y };
  
  // Add global mouse event listeners for drag
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
}

/**
 * Handles mouse move event during drag
 * Validates: Requirements 3.5
 */
function handleMouseMove(event: MouseEvent) {
  const deltaX = event.clientX - dragStartPos.value.x;
  const deltaY = event.clientY - dragStartPos.value.y;
  
  // Only start dragging if moved more than 5 pixels (to distinguish from click)
  if (!isDragging.value && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
    isDragging.value = true;
  }
  
  if (isDragging.value) {
    // Calculate new position
    const newX = iconStartPos.value.x + deltaX;
    const newY = iconStartPos.value.y + deltaY;
    
    // Update current position (constrain to positive values)
    currentPos.value = {
      x: Math.max(0, newX),
      y: Math.max(0, newY),
    };
  }
}

/**
 * Handles mouse up event to end drag
 * Validates: Requirements 3.5
 */
function handleMouseUp(_event: MouseEvent) {
  // Remove global event listeners
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
  
  if (isDragging.value) {
    // Emit move event with final position
    emit('move', props.icon.id, { ...currentPos.value });
    isDragging.value = false;
  } else {
    // Handle click (not a drag)
    handleClick();
  }
}

/**
 * Handles click detection for single/double click
 * Validates: Requirements 3.2, 3.3
 */
function handleClick() {
  clickCount.value++;
  
  if (clickCount.value === 1) {
    // First click - start timer for double-click detection
    clickTimeout.value = window.setTimeout(() => {
      // Single click - already selected on mouse down
      clickCount.value = 0;
      clickTimeout.value = null;
    }, DOUBLE_CLICK_DELAY);
  } else if (clickCount.value === 2) {
    // Double click - open the application
    if (clickTimeout.value) {
      clearTimeout(clickTimeout.value);
      clickTimeout.value = null;
    }
    clickCount.value = 0;
    emit('open', props.icon.appId);
  }
}

// Note: We use manual double-click detection in handleClick() instead of native dblclick
// to properly distinguish between click and drag operations

// Update current position when prop changes (e.g., from external state)
function syncPosition() {
  if (!isDragging.value) {
    currentPos.value = { x: props.icon.position.x, y: props.icon.position.y };
  }
}

// Watch for prop changes
onMounted(() => {
  syncPosition();
});

// Cleanup on unmount
onUnmounted(() => {
  if (clickTimeout.value) {
    clearTimeout(clickTimeout.value);
  }
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
});
</script>

<template>
  <div
    class="desktop-icon"
    :class="{ 
      'is-selected': isSelected, 
      'is-dragging': isDragging 
    }"
    :style="iconStyle"
    @mousedown="handleMouseDown"
  >
    <!-- Icon Image (64x64 as per design spec) -->
    <div class="icon-image-container">
      <img 
        :src="icon.icon" 
        :alt="icon.name"
        class="icon-image"
        draggable="false"
      />
    </div>
    
    <!-- Icon Label -->
    <span class="icon-label">{{ icon.name }}</span>
  </div>
</template>

<style scoped>
.desktop-icon {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
  padding: 8px;
  border-radius: 6px;
  cursor: default;
  user-select: none;
  transition: background-color 0.15s ease;
}

.desktop-icon:hover:not(.is-dragging) {
  background-color: var(--icon-hover);
}

.desktop-icon.is-selected {
  background-color: var(--icon-selected);
}

.desktop-icon.is-dragging {
  opacity: 0.8;
  cursor: grabbing;
  z-index: 1000;
}

.icon-image-container {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.icon-image {
  max-width: 64px;
  max-height: 64px;
  width: auto;
  height: auto;
  object-fit: contain;
  pointer-events: none;
}

.icon-label {
  font-size: 12px;
  color: var(--text-light);
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
  line-height: 1.3;
  /* Limit to 2 lines with ellipsis */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
