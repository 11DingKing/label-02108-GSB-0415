<template>
  <div class="dock-container">
    <div class="dock frosted-glass">
      <div class="dock-apps">
        <div
          v-for="app in apps"
          :key="app.id"
          class="dock-item"
          @click="handleAppClick(app.id)"
          @mouseenter="hoveredAppId = app.id"
          @mouseleave="hoveredAppId = null"
        >
          <!-- App Icon -->
          <div class="dock-icon-wrapper">
            <img
              :src="app.icon"
              :alt="app.name"
              class="dock-icon"
              :class="{ 'dock-icon-hovered': hoveredAppId === app.id }"
            />
          </div>
          
          <!-- Running Indicator Dot -->
          <div
            v-if="app.isRunning"
            class="running-indicator"
          ></div>
          
          <!-- Tooltip -->
          <Transition name="tooltip">
            <div
              v-if="hoveredAppId === app.id"
              class="dock-tooltip"
            >
              {{ app.name }}
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Dock Component
 * 
 * macOS-style application dock positioned at the bottom center of the screen.
 * Features:
 * - Horizontal list of application icons
 * - Magnification effect on hover (CSS transform: scale)
 * - Running indicator dot below icons of running apps
 * - Tooltip showing app name on hover
 * - Semi-transparent frosted glass effect
 * 
 * Requirements satisfied:
 * - 2.1: Positioned at bottom center of screen
 * - 2.2: Magnification effect on hover
 * - 2.3: Click opens application window (via emit)
 * - 2.4: Running indicator dot below icon
 * - 2.5: Semi-transparent frosted glass effect
 * - 2.6: Tooltip shows app name on hover
 */

import { ref } from 'vue';
import type { DockApp } from '../types';

// Props definition
interface Props {
  apps: DockApp[];
}

defineProps<Props>();

// Emits definition
const emit = defineEmits<{
  (e: 'app-click', appId: string): void;
}>();

// Track which app is being hovered
const hoveredAppId = ref<string | null>(null);

/**
 * Handles click on a dock app icon
 * Emits 'app-click' event with the app ID
 * @param appId - The ID of the clicked application
 */
function handleAppClick(appId: string): void {
  emit('app-click', appId);
}
</script>

<style scoped>
/**
 * Dock Container - Positions dock at bottom center
 * Validates: Requirement 2.1
 */
.dock-container {
  position: fixed;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  z-index: var(--z-dock);
  display: flex;
  justify-content: center;
  padding: 0 20px;
}

/**
 * Dock - Main dock bar with frosted glass effect
 * Validates: Requirement 2.5
 */
.dock {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  background-color: var(--dock-bg);
  border: 1px solid var(--dock-border);
  border-radius: 16px;
  box-shadow: 
    0 0 0 0.5px rgba(0, 0, 0, 0.1),
    0 4px 20px rgba(0, 0, 0, 0.15);
}

/**
 * Dock Apps Container - Horizontal layout for app icons
 */
.dock-apps {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  padding: 2px;
}

/**
 * Dock Item - Individual app container
 */
.dock-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 4px;
  transition: transform 0.2s ease;
}

/**
 * Dock Icon Wrapper - Contains the app icon
 */
.dock-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
}

/**
 * Dock Icon - App icon image
 * Validates: Requirement 2.2 (magnification effect)
 */
.dock-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  transition: transform 0.2s ease, filter 0.2s ease;
  object-fit: contain;
}

/**
 * Dock Icon Hovered State - Magnification effect
 * Validates: Requirement 2.2
 */
.dock-icon-hovered {
  transform: scale(1.3) translateY(-8px);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

/**
 * Running Indicator - Small dot below running apps
 * Validates: Requirement 2.4
 */
.running-indicator {
  width: 4px;
  height: 4px;
  background-color: var(--text-primary);
  border-radius: 50%;
  margin-top: 2px;
  opacity: 0.6;
}

/**
 * Dock Tooltip - Shows app name on hover
 * Validates: Requirement 2.6
 */
.dock-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 24px;
  padding: 6px 12px;
  background-color: rgba(30, 30, 30, 0.9);
  color: var(--text-light);
  font-size: 12px;
  font-weight: 500;
  border-radius: 6px;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/**
 * Tooltip Arrow
 */
.dock-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: rgba(30, 30, 30, 0.9);
}

/**
 * Tooltip Transition Animations
 */
.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(4px);
}

.tooltip-enter-to,
.tooltip-leave-from {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/**
 * Adjacent icon magnification effect
 * When hovering, adjacent icons also scale slightly
 */
.dock-item:hover + .dock-item .dock-icon,
.dock-item:has(+ .dock-item:hover) .dock-icon {
  transform: scale(1.1) translateY(-4px);
}
</style>
