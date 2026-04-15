/**
 * Window State Management Store
 * 
 * Manages all window states including opening, closing, minimizing,
 * maximizing, focusing, and position/size updates.
 * 
 * Z-Index Layer Structure:
 * - Windows: z-index 100-999 (dynamic management)
 * - Each new window or focused window gets the next available z-index
 * 
 * Requirements satisfied:
 * - 4.5: Red button closes window
 * - 4.6: Yellow button minimizes window to Dock
 * - 4.7: Green button maximizes/restores window
 * - 4.8: Clicking window brings it to front (z-index management)
 * - 4.9: Support multiple windows open simultaneously
 */

import { reactive, computed } from 'vue';
import type { WindowState, AppDefinition } from '../types';

// Base z-index for windows (100-999 range as per design)
const BASE_Z_INDEX = 100;

// Minimum window dimensions to prevent unusable states
const MIN_WINDOW_WIDTH = 200;
const MIN_WINDOW_HEIGHT = 150;

/**
 * Window store state
 */
interface WindowStoreState {
  windows: Map<string, WindowState>;
  activeWindowId: string | null;
  nextZIndex: number;
}

/**
 * Creates the window store with reactive state and actions
 */
function createWindowStore() {
  // Reactive state
  const state = reactive<WindowStoreState>({
    windows: new Map<string, WindowState>(),
    activeWindowId: null,
    nextZIndex: BASE_Z_INDEX,
  });

  // Counter for generating unique window IDs
  let windowIdCounter = 0;

  /**
   * Generates a unique window ID
   */
  function generateWindowId(appId: string): string {
    windowIdCounter++;
    return `${appId}-window-${windowIdCounter}-${Date.now()}`;
  }

  /**
   * Gets the next z-index and increments the counter
   */
  function getNextZIndex(): number {
    const zIndex = state.nextZIndex;
    state.nextZIndex++;
    // Reset if we exceed the window z-index range (999)
    if (state.nextZIndex > 999) {
      normalizeZIndexes();
    }
    return zIndex;
  }

  /**
   * Normalizes all window z-indexes to prevent overflow
   * Maintains relative ordering while resetting to base range
   */
  function normalizeZIndexes(): void {
    const sortedWindows = Array.from(state.windows.values())
      .sort((a, b) => a.zIndex - b.zIndex);
    
    let newZIndex = BASE_Z_INDEX;
    sortedWindows.forEach(window => {
      window.zIndex = newZIndex++;
    });
    
    state.nextZIndex = newZIndex;
  }

  /**
   * Opens a new window for the specified application
   * @param appId - The ID of the application to open
   * @param appDefinition - Optional app definition with default dimensions
   */
  function openWindow(appId: string, appDefinition?: AppDefinition): string {
    const windowId = generateWindowId(appId);
    const zIndex = getNextZIndex();

    // Calculate default position (slightly offset for each new window)
    const existingWindowCount = state.windows.size;
    const offsetX = (existingWindowCount % 10) * 30;
    const offsetY = (existingWindowCount % 10) * 30;

    const newWindow: WindowState = {
      id: windowId,
      appId: appId,
      title: appDefinition?.name || appId,
      icon: appDefinition?.icon || '',
      x: 100 + offsetX,
      y: 50 + offsetY,
      width: appDefinition?.defaultWidth || 600,
      height: appDefinition?.defaultHeight || 400,
      zIndex: zIndex,
      isMinimized: false,
      isMaximized: false,
      previousState: undefined,
    };

    state.windows.set(windowId, newWindow);
    state.activeWindowId = windowId;

    return windowId;
  }

  /**
   * Closes a window and removes it from the store
   * Validates: Requirements 4.5 - Red button closes window
   * @param windowId - The ID of the window to close
   */
  function closeWindow(windowId: string): void {
    if (!state.windows.has(windowId)) {
      return; // Silently ignore invalid window IDs as per error handling spec
    }

    state.windows.delete(windowId);

    // Update active window if the closed window was active
    if (state.activeWindowId === windowId) {
      // Set the window with highest z-index as active, or null if no windows
      const remainingWindows = Array.from(state.windows.values());
      if (remainingWindows.length > 0) {
        const topWindow = remainingWindows.reduce((prev, current) => 
          current.zIndex > prev.zIndex ? current : prev
        );
        state.activeWindowId = topWindow.id;
      } else {
        state.activeWindowId = null;
      }
    }
  }

  /**
   * Minimizes a window to the Dock
   * Validates: Requirements 4.6 - Yellow button minimizes window to Dock
   * @param windowId - The ID of the window to minimize
   */
  function minimizeWindow(windowId: string): void {
    const win = state.windows.get(windowId);
    if (!win) {
      return; // Silently ignore invalid window IDs
    }

    win.isMinimized = true;

    // Update active window if the minimized window was active
    if (state.activeWindowId === windowId) {
      // Find the next visible window with highest z-index
      const visibleWindows = Array.from(state.windows.values())
        .filter(w => !w.isMinimized && w.id !== windowId);
      
      if (visibleWindows.length > 0) {
        const topWindow = visibleWindows.reduce((prev, current) => 
          current.zIndex > prev.zIndex ? current : prev
        );
        state.activeWindowId = topWindow.id;
      } else {
        state.activeWindowId = null;
      }
    }
  }

  /**
   * Maximizes a window or restores it to its previous size
   * Validates: Requirements 4.7 - Green button maximizes/restores window
   * @param windowId - The ID of the window to maximize/restore
   */
  function maximizeWindow(windowId: string): void {
    const win = state.windows.get(windowId);
    if (!win) {
      return; // Silently ignore invalid window IDs
    }

    if (win.isMaximized) {
      // Restore to previous state
      if (win.previousState) {
        win.x = win.previousState.x;
        win.y = win.previousState.y;
        win.width = win.previousState.width;
        win.height = win.previousState.height;
      }
      win.isMaximized = false;
      win.previousState = undefined;
    } else {
      // Save current state before maximizing
      win.previousState = {
        x: win.x,
        y: win.y,
        width: win.width,
        height: win.height,
      };
      
      // Maximize to fill viewport (accounting for menu bar at top)
      // Menu bar height is approximately 24-28 pixels as per requirements
      const menuBarHeight = 28;
      win.x = 0;
      win.y = menuBarHeight;
      win.width = globalThis.innerWidth || 1920;
      win.height = (globalThis.innerHeight || 1080) - menuBarHeight;
      win.isMaximized = true;
    }

    // Bring maximized/restored window to front
    focusWindow(windowId);
  }

  /**
   * Brings a window to the front by updating its z-index
   * Validates: Requirements 4.8 - Clicking window brings it to front
   * @param windowId - The ID of the window to focus
   */
  function focusWindow(windowId: string): void {
    const win = state.windows.get(windowId);
    if (!win) {
      return; // Silently ignore invalid window IDs
    }

    // If window is minimized, restore it
    if (win.isMinimized) {
      win.isMinimized = false;
    }

    // Only update z-index if this window isn't already at the top
    const currentMaxZIndex = Math.max(
      ...Array.from(state.windows.values()).map(w => w.zIndex),
      BASE_Z_INDEX - 1
    );

    if (win.zIndex < currentMaxZIndex) {
      win.zIndex = getNextZIndex();
    }

    state.activeWindowId = windowId;
  }

  /**
   * Updates the position of a window
   * @param windowId - The ID of the window to update
   * @param x - New x coordinate
   * @param y - New y coordinate
   */
  function updateWindowPosition(windowId: string, x: number, y: number): void {
    const win = state.windows.get(windowId);
    if (!win) {
      return; // Silently ignore invalid window IDs
    }

    // Constrain position to keep window partially visible
    // Allow some negative values so window can be partially off-screen
    const minVisiblePortion = 50;
    win.x = Math.max(-win.width + minVisiblePortion, x);
    win.y = Math.max(0, y); // Don't allow window above viewport (menu bar area)
  }

  /**
   * Updates the size of a window
   * @param windowId - The ID of the window to update
   * @param width - New width
   * @param height - New height
   */
  function updateWindowSize(windowId: string, width: number, height: number): void {
    const win = state.windows.get(windowId);
    if (!win) {
      return; // Silently ignore invalid window IDs
    }

    // Enforce minimum dimensions
    win.width = Math.max(MIN_WINDOW_WIDTH, width);
    win.height = Math.max(MIN_WINDOW_HEIGHT, height);

    // If window was maximized, it's no longer maximized after manual resize
    if (win.isMaximized) {
      win.isMaximized = false;
      win.previousState = undefined;
    }
  }

  /**
   * Gets a window by its ID
   * @param windowId - The ID of the window to get
   */
  function getWindow(windowId: string): WindowState | undefined {
    return state.windows.get(windowId);
  }

  /**
   * Gets all windows as an array
   */
  function getAllWindows(): WindowState[] {
    return Array.from(state.windows.values());
  }

  /**
   * Gets all visible (non-minimized) windows
   */
  function getVisibleWindows(): WindowState[] {
    return Array.from(state.windows.values()).filter(w => !w.isMinimized);
  }

  /**
   * Gets all windows for a specific application
   * @param appId - The application ID to filter by
   */
  function getWindowsByApp(appId: string): WindowState[] {
    return Array.from(state.windows.values()).filter(w => w.appId === appId);
  }

  /**
   * Checks if an application has any open windows
   * @param appId - The application ID to check
   */
  function hasOpenWindows(appId: string): boolean {
    return Array.from(state.windows.values()).some(w => w.appId === appId);
  }

  /**
   * Gets the currently active window
   */
  function getActiveWindow(): WindowState | null {
    if (!state.activeWindowId) {
      return null;
    }
    return state.windows.get(state.activeWindowId) || null;
  }

  /**
   * Restores a minimized window
   * @param windowId - The ID of the window to restore
   */
  function restoreWindow(windowId: string): void {
    const win = state.windows.get(windowId);
    if (!win) {
      return;
    }

    win.isMinimized = false;
    focusWindow(windowId);
  }

  // Computed properties
  const windowCount = computed(() => state.windows.size);
  const activeWindow = computed(() => getActiveWindow());
  const visibleWindows = computed(() => getVisibleWindows());

  return {
    // State (reactive)
    state,
    
    // Computed
    windowCount,
    activeWindow,
    visibleWindows,
    
    // Actions
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
    restoreWindow,
    
    // Getters
    getWindow,
    getAllWindows,
    getVisibleWindows,
    getWindowsByApp,
    hasOpenWindows,
    getActiveWindow,
  };
}

// Create and export the singleton store instance
export const windowStore = createWindowStore();

// Export the store type for use in components
export type WindowStoreType = ReturnType<typeof createWindowStore>;
