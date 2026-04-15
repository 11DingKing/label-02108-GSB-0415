<script setup lang="ts">
/**
 * Desktop Component
 * 
 * Main desktop area that displays:
 * - Desktop background wallpaper
 * - Desktop icons in a grid layout
 * - Application windows
 * 
 * Requirements satisfied:
 * - 3.4: Desktop icons arranged in grid layout
 * - 5.1: Display default macOS-style wallpaper as background
 * - 5.2: Wallpaper covers entire viewport
 * - 5.3: Support responsive scaling of wallpaper
 */

import { ref, computed, reactive } from 'vue';
import DesktopIcon from './DesktopIcon.vue';
import AppWindow from './AppWindow.vue';
import { windowStore } from '../stores/windowStore';
import { appStore } from '../stores/appStore';
import type { DesktopIconData, Position } from '../types';

// Props definition
const props = withDefaults(defineProps<{
  wallpaper?: string;
}>(), {
  wallpaper: '/wallpaper.svg',
});

// Desktop icon state management
const selectedIconId = ref<string | null>(null);

// Initial desktop icons - arranged in grid layout (Requirement 3.4)
const desktopIcons = reactive<DesktopIconData[]>([
  {
    id: 'icon-finder',
    name: 'Finder',
    icon: '/icons/finder.svg',
    appId: 'finder',
    position: { x: 20, y: 20 },
  },
  {
    id: 'icon-settings',
    name: 'System Preferences',
    icon: '/icons/settings.svg',
    appId: 'settings',
    position: { x: 20, y: 120 },
  },
  {
    id: 'icon-notes',
    name: 'Notes',
    icon: '/icons/notes.svg',
    appId: 'notes',
    position: { x: 20, y: 220 },
  },
]);

// Computed style for desktop background
// Requirements 5.1, 5.2, 5.3: Wallpaper covers entire viewport with responsive scaling
const desktopStyle = computed(() => ({
  backgroundImage: `url(${props.wallpaper})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
}));

// Get all windows from the store
const windows = computed(() => windowStore.getAllWindows());

/**
 * Handles icon selection
 * Validates: Requirements 3.3
 * @param iconId - The ID of the selected icon
 */
function handleIconSelect(iconId: string): void {
  selectedIconId.value = iconId;
}

/**
 * Handles icon double-click to open application
 * Validates: Requirements 3.2
 * @param appId - The ID of the application to open
 */
function handleIconOpen(appId: string): void {
  const appDefinition = appStore.getApp(appId);
  if (appDefinition) {
    windowStore.openWindow(appId, appDefinition);
    appStore.setAppRunning(appId, true);
  }
}

/**
 * Handles icon move/reposition
 * Validates: Requirements 3.5
 * @param iconId - The ID of the icon being moved
 * @param position - The new position
 */
function handleIconMove(iconId: string, position: Position): void {
  const icon = desktopIcons.find(i => i.id === iconId);
  if (icon) {
    icon.position = { ...position };
  }
}

/**
 * Handles click on desktop background to deselect icons
 * @param event - The mouse event
 */
function handleDesktopClick(event: MouseEvent): void {
  // Only deselect if clicking directly on the desktop (not on an icon)
  const target = event.target as HTMLElement;
  if (target.classList.contains('desktop') || target.classList.contains('desktop-icons-container')) {
    selectedIconId.value = null;
  }
}

// Window event handlers

/**
 * Handles window close event
 * Validates: Requirements 4.5
 * @param windowId - The ID of the window to close
 */
function handleWindowClose(windowId: string): void {
  const win = windowStore.getWindow(windowId);
  if (win) {
    windowStore.closeWindow(windowId);
    // Update running state if no more windows for this app
    if (!windowStore.hasOpenWindows(win.appId)) {
      appStore.setAppRunning(win.appId, false);
    }
  }
}

/**
 * Handles window minimize event
 * Validates: Requirements 4.6
 * @param windowId - The ID of the window to minimize
 */
function handleWindowMinimize(windowId: string): void {
  windowStore.minimizeWindow(windowId);
}

/**
 * Handles window maximize event
 * Validates: Requirements 4.7
 * @param windowId - The ID of the window to maximize/restore
 */
function handleWindowMaximize(windowId: string): void {
  windowStore.maximizeWindow(windowId);
}

/**
 * Handles window focus event
 * Validates: Requirements 4.8
 * @param windowId - The ID of the window to focus
 */
function handleWindowFocus(windowId: string): void {
  windowStore.focusWindow(windowId);
  // Deselect any selected desktop icon when focusing a window
  selectedIconId.value = null;
}

/**
 * Handles window position update
 * @param windowId - The ID of the window
 * @param x - New x coordinate
 * @param y - New y coordinate
 */
function handleWindowUpdatePosition(windowId: string, x: number, y: number): void {
  windowStore.updateWindowPosition(windowId, x, y);
}

/**
 * Handles window size update
 * @param windowId - The ID of the window
 * @param width - New width
 * @param height - New height
 */
function handleWindowUpdateSize(windowId: string, width: number, height: number): void {
  windowStore.updateWindowSize(windowId, width, height);
}

/**
 * Gets the app component for a given app ID
 * @param appId - The ID of the application
 * @returns The app component or undefined
 */
function getAppComponent(appId: string) {
  const app = appStore.getApp(appId);
  return app?.component;
}
</script>

<template>
  <div 
    class="desktop" 
    :style="desktopStyle"
    @mousedown="handleDesktopClick"
  >
    <!-- Desktop Icons Container (Requirement 3.4: Grid layout) -->
    <div class="desktop-icons-container">
      <DesktopIcon
        v-for="icon in desktopIcons"
        :key="icon.id"
        :icon="icon"
        :is-selected="selectedIconId === icon.id"
        @select="handleIconSelect"
        @open="handleIconOpen"
        @move="handleIconMove"
      />
    </div>

    <!-- Windows Container -->
    <div class="windows-container">
      <AppWindow
        v-for="win in windows"
        :key="win.id"
        :window="win"
        @close="handleWindowClose"
        @minimize="handleWindowMinimize"
        @maximize="handleWindowMaximize"
        @focus="handleWindowFocus"
        @update-position="handleWindowUpdatePosition"
        @update-size="handleWindowUpdateSize"
      >
        <!-- Render actual app component if available, otherwise show placeholder -->
        <component 
          v-if="getAppComponent(win.appId)"
          :is="getAppComponent(win.appId)"
        />
        <div v-else class="window-content-placeholder">
          <p>{{ win.title }}</p>
        </div>
      </AppWindow>
    </div>
  </div>
</template>

<style scoped>
/**
 * Desktop Styles
 * Requirements: 5.1, 5.2, 5.3
 */
.desktop {
  position: absolute;
  top: var(--menu-bar-height, 24px);
  left: 0;
  right: 0;
  bottom: 0;
  z-index: var(--z-desktop, 1);
  overflow: hidden;
}

/* Desktop Icons Container */
.desktop-icons-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

/* Allow pointer events on individual icons */
.desktop-icons-container :deep(.desktop-icon) {
  pointer-events: auto;
}

/* Windows Container */
.windows-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

/* Allow pointer events on individual windows */
.windows-container :deep(.app-window) {
  pointer-events: auto;
}

/* Window content placeholder styling */
.window-content-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-secondary, #86868b);
  font-size: 14px;
}
</style>
