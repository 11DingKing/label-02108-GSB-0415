/**
 * Application State Management Store
 * 
 * Manages application definitions and running state tracking.
 * Provides the registry of available applications and tracks which
 * applications are currently running (have open windows).
 * 
 * Requirements satisfied:
 * - 6.1: Include at least 3 sample applications (Finder, Settings, Notes)
 * - 6.3: Sample applications shall have distinct icons and titles
 */

import { reactive, computed, markRaw, type Component } from 'vue';
import type { AppDefinition } from '../types';
import FinderApp from '../apps/FinderApp.vue';
import SettingsApp from '../apps/SettingsApp.vue';
import NotesApp from '../apps/NotesApp.vue';

/**
 * App store state
 */
interface AppStoreState {
  apps: Map<string, AppDefinition>;
  runningApps: Set<string>;
}

/**
 * Sample application definitions
 * Each app has a unique id, name, icon, and default dimensions
 * Validates: Requirements 6.1, 6.3
 */
const sampleApps: AppDefinition[] = [
  {
    id: 'finder',
    name: 'Finder',
    icon: '/icons/finder.svg',
    defaultWidth: 800,
    defaultHeight: 500,
    component: markRaw(FinderApp),
  },
  {
    id: 'settings',
    name: 'System Preferences',
    icon: '/icons/settings.svg',
    defaultWidth: 700,
    defaultHeight: 450,
    component: markRaw(SettingsApp),
  },
  {
    id: 'notes',
    name: 'Notes',
    icon: '/icons/notes.svg',
    defaultWidth: 800,
    defaultHeight: 500,
    component: markRaw(NotesApp),
  },
];

/**
 * Creates the app store with reactive state and actions
 */
function createAppStore() {
  // Initialize apps map with sample applications
  const appsMap = new Map<string, AppDefinition>();
  sampleApps.forEach(app => {
    appsMap.set(app.id, app);
  });

  // Reactive state
  const state = reactive<AppStoreState>({
    apps: appsMap,
    runningApps: new Set<string>(),
  });

  /**
   * Gets an application definition by its ID
   * @param appId - The ID of the application to retrieve
   * @returns The app definition or undefined if not found
   */
  function getApp(appId: string): AppDefinition | undefined {
    return state.apps.get(appId);
  }

  /**
   * Checks if an application is currently running
   * @param appId - The ID of the application to check
   * @returns true if the app has open windows, false otherwise
   */
  function isAppRunning(appId: string): boolean {
    return state.runningApps.has(appId);
  }

  /**
   * Sets the running state of an application
   * @param appId - The ID of the application
   * @param running - Whether the app should be marked as running
   */
  function setAppRunning(appId: string, running: boolean): void {
    if (running) {
      state.runningApps.add(appId);
    } else {
      state.runningApps.delete(appId);
    }
  }

  /**
   * Gets all registered applications
   * @returns Array of all app definitions
   */
  function getAllApps(): AppDefinition[] {
    return Array.from(state.apps.values());
  }

  /**
   * Gets all currently running applications
   * @returns Array of running app IDs
   */
  function getRunningAppIds(): string[] {
    return Array.from(state.runningApps);
  }

  /**
   * Registers a new application
   * @param app - The app definition to register
   */
  function registerApp(app: AppDefinition): void {
    state.apps.set(app.id, app);
  }

  /**
   * Updates an existing application's component
   * Useful for lazy-loading actual app components
   * @param appId - The ID of the application to update
   * @param component - The new component to use
   */
  function updateAppComponent(appId: string, component: Component): void {
    const app = state.apps.get(appId);
    if (app) {
      app.component = markRaw(component);
    }
  }

  // Computed properties
  const appCount = computed(() => state.apps.size);
  const runningAppCount = computed(() => state.runningApps.size);
  const allApps = computed(() => getAllApps());

  return {
    // State (reactive)
    state,
    
    // Computed
    appCount,
    runningAppCount,
    allApps,
    
    // Actions
    getApp,
    isAppRunning,
    setAppRunning,
    getAllApps,
    getRunningAppIds,
    registerApp,
    updateAppComponent,
  };
}

// Create and export the singleton store instance
export const appStore = createAppStore();

// Export the store type for use in components
export type AppStoreType = ReturnType<typeof createAppStore>;

// Export sample apps for testing purposes
export { sampleApps };
