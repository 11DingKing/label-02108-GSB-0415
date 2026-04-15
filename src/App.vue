<script setup lang="ts">
/**
 * App.vue - Main Application Component
 * 
 * Root component that integrates all major UI components:
 * - MenuBar (fixed top, z-index: 9999)
 * - Desktop (main area with icons and windows)
 * - Dock (fixed bottom, z-index: 50)
 * 
 * Responsibilities:
 * - Orchestrate component communication
 * - Connect state management (windowStore, appStore)
 * - Pass active app name to MenuBar based on active window
 * - Pass dock apps with running state to Dock
 * - Handle dock app clicks to open windows
 * 
 * Requirements satisfied:
 * - 1.6: Menu bar shows active application name
 * - 2.3: Dock icon click opens application window
 * - 2.4: Running indicator on dock for apps with open windows
 * - 3.2: Desktop icon double-click opens application
 */

import { computed } from 'vue';
import MenuBar from './components/MenuBar.vue';
import Desktop from './components/Desktop.vue';
import Dock from './components/Dock.vue';
import { windowStore } from './stores/windowStore';
import { appStore } from './stores/appStore';
import type { MenuItem, DockApp } from './types';

/**
 * Computed: Active application name for MenuBar
 * Validates: Requirements 1.6 - Menu bar shows active application name
 * 
 * Returns the name of the currently active window's application,
 * or 'Finder' as the default when no window is active.
 */
const activeAppName = computed<string>(() => {
  const activeWindow = windowStore.getActiveWindow();
  if (activeWindow) {
    const app = appStore.getApp(activeWindow.appId);
    return app?.name || activeWindow.title;
  }
  // Default to 'Finder' when no window is active (macOS behavior)
  return 'Finder';
});

/**
 * Computed: Dock apps with running state
 * Validates: Requirements 2.4 - Running indicator on dock for apps with open windows
 * 
 * Maps all registered apps to DockApp format with isRunning state
 * based on whether the app has any open windows.
 */
const dockApps = computed<DockApp[]>(() => {
  return appStore.getAllApps().map(app => ({
    id: app.id,
    name: app.name,
    icon: app.icon,
    isRunning: appStore.isAppRunning(app.id),
  }));
});

/**
 * Menu items for the MenuBar
 * Standard macOS-style menu structure
 */
const menuItems = computed<MenuItem[]>(() => [
  {
    id: 'file',
    label: 'File',
    children: [
      { id: 'new-window', label: 'New Window' },
      { id: 'new-tab', label: 'New Tab' },
      { id: 'divider-1', label: '-' },
      { id: 'close-window', label: 'Close Window', action: handleCloseActiveWindow },
    ],
  },
  {
    id: 'edit',
    label: 'Edit',
    children: [
      { id: 'undo', label: 'Undo' },
      { id: 'redo', label: 'Redo' },
      { id: 'divider-2', label: '-' },
      { id: 'cut', label: 'Cut' },
      { id: 'copy', label: 'Copy' },
      { id: 'paste', label: 'Paste' },
      { id: 'select-all', label: 'Select All' },
    ],
  },
  {
    id: 'view',
    label: 'View',
    children: [
      { id: 'as-icons', label: 'as Icons' },
      { id: 'as-list', label: 'as List' },
      { id: 'as-columns', label: 'as Columns' },
      { id: 'divider-3', label: '-' },
      { id: 'show-toolbar', label: 'Show Toolbar' },
      { id: 'show-sidebar', label: 'Show Sidebar' },
    ],
  },
  {
    id: 'window',
    label: 'Window',
    children: [
      { id: 'minimize', label: 'Minimize', action: handleMinimizeActiveWindow },
      { id: 'zoom', label: 'Zoom', action: handleMaximizeActiveWindow },
      { id: 'divider-4', label: '-' },
      { id: 'bring-all-to-front', label: 'Bring All to Front' },
    ],
  },
  {
    id: 'help',
    label: 'Help',
    children: [
      { id: 'search', label: 'Search' },
      { id: 'divider-5', label: '-' },
      { id: 'macos-help', label: 'macOS Help' },
    ],
  },
]);

/**
 * Handles dock app icon click
 * Validates: Requirements 2.3 - Dock icon click opens application window
 * 
 * When a dock icon is clicked:
 * 1. If the app has existing windows, focus the most recent one
 * 2. If no windows exist, open a new window for the app
 * 
 * @param appId - The ID of the clicked application
 */
function handleDockAppClick(appId: string): void {
  const appDefinition = appStore.getApp(appId);
  if (!appDefinition) {
    return;
  }

  // Check if app has any existing windows
  const existingWindows = windowStore.getWindowsByApp(appId);
  
  if (existingWindows.length > 0) {
    // Find the window with highest z-index (most recently focused)
    const topWindow = existingWindows.reduce((prev, current) => 
      current.zIndex > prev.zIndex ? current : prev
    );
    
    // If window is minimized, restore it; otherwise just focus
    if (topWindow.isMinimized) {
      windowStore.restoreWindow(topWindow.id);
    } else {
      windowStore.focusWindow(topWindow.id);
    }
  } else {
    // Open a new window for the app
    windowStore.openWindow(appId, appDefinition);
    appStore.setAppRunning(appId, true);
  }
}

/**
 * Handles menu action events from MenuBar
 * @param menuId - The ID of the menu action triggered
 */
function handleMenuAction(menuId: string): void {
  // Handle specific menu actions
  switch (menuId) {
    case 'close-window':
      handleCloseActiveWindow();
      break;
    case 'minimize':
      handleMinimizeActiveWindow();
      break;
    case 'zoom':
      handleMaximizeActiveWindow();
      break;
    default:
      // Other menu actions can be handled here
      console.log('Menu action:', menuId);
  }
}

/**
 * Closes the currently active window
 */
function handleCloseActiveWindow(): void {
  const activeWindow = windowStore.getActiveWindow();
  if (activeWindow) {
    windowStore.closeWindow(activeWindow.id);
    // Update running state if no more windows for this app
    if (!windowStore.hasOpenWindows(activeWindow.appId)) {
      appStore.setAppRunning(activeWindow.appId, false);
    }
  }
}

/**
 * Minimizes the currently active window
 */
function handleMinimizeActiveWindow(): void {
  const activeWindow = windowStore.getActiveWindow();
  if (activeWindow) {
    windowStore.minimizeWindow(activeWindow.id);
  }
}

/**
 * Maximizes/restores the currently active window
 */
function handleMaximizeActiveWindow(): void {
  const activeWindow = windowStore.getActiveWindow();
  if (activeWindow) {
    windowStore.maximizeWindow(activeWindow.id);
  }
}
</script>

<template>
  <div class="desktop-system">
    <!-- MenuBar: Fixed at top with z-index 9999 -->
    <!-- Validates: Requirements 1.6 - Shows active application name -->
    <MenuBar
      :active-app-name="activeAppName"
      :menu-items="menuItems"
      @menu-action="handleMenuAction"
    />

    <!-- Desktop: Main area containing icons and windows -->
    <!-- Validates: Requirements 3.2 - Desktop icon double-click opens application -->
    <Desktop />

    <!-- Dock: Fixed at bottom with z-index 50 -->
    <!-- Validates: Requirements 2.3, 2.4 - Dock icon click and running indicator -->
    <Dock
      :apps="dockApps"
      @app-click="handleDockAppClick"
    />
  </div>
</template>

<style scoped>
/**
 * Desktop System Container
 * 
 * Full viewport container that holds all desktop components.
 * Uses fixed positioning to ensure proper layering.
 */
.desktop-system {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #1e1e1e;
}
</style>
