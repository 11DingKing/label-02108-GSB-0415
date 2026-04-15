/**
 * TypeScript type definitions for macOS Desktop System
 * 
 * This file contains all the interfaces and types used throughout
 * the application for window management, app definitions, dock,
 * menu bar, and desktop icons.
 */

import type { Component } from 'vue';

// ============================================
// Menu Bar Types
// ============================================

/**
 * Represents a menu item in the menu bar
 */
export interface MenuItem {
  id: string;
  label: string;
  children?: MenuItem[];
  action?: () => void;
}

/**
 * Props for the MenuBar component
 */
export interface MenuBarProps {
  activeAppName: string;
  menuItems: MenuItem[];
}

// ============================================
// Dock Types
// ============================================

/**
 * Represents an application in the Dock
 */
export interface DockApp {
  id: string;
  name: string;
  icon: string;
  isRunning: boolean;
}

/**
 * Props for the Dock component
 */
export interface DockProps {
  apps: DockApp[];
}

/**
 * Emits for the Dock component
 */
export interface DockEmits {
  (e: 'app-click', appId: string): void;
}

// ============================================
// Desktop Icon Types
// ============================================

/**
 * Position coordinates for desktop icons
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Represents a desktop icon's data
 */
export interface DesktopIconData {
  id: string;
  name: string;
  icon: string;
  appId: string;
  position: Position;
}

/**
 * Props for the DesktopIcon component
 */
export interface DesktopIconProps {
  icon: DesktopIconData;
  isSelected: boolean;
}

/**
 * Emits for the DesktopIcon component
 */
export interface DesktopIconEmits {
  (e: 'select', iconId: string): void;
  (e: 'open', appId: string): void;
  (e: 'move', iconId: string, position: Position): void;
}

// ============================================
// Window Types
// ============================================

/**
 * Stores the previous state of a window before maximizing
 */
export interface WindowPreviousState {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Represents the complete state of a window
 */
export interface WindowState {
  id: string;
  appId: string;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  previousState?: WindowPreviousState;
}

/**
 * Props for the AppWindow component
 */
export interface AppWindowProps {
  window: WindowState;
}

/**
 * Emits for the AppWindow component
 */
export interface AppWindowEmits {
  (e: 'close', windowId: string): void;
  (e: 'minimize', windowId: string): void;
  (e: 'maximize', windowId: string): void;
  (e: 'focus', windowId: string): void;
  (e: 'update-position', windowId: string, x: number, y: number): void;
  (e: 'update-size', windowId: string, width: number, height: number): void;
}

/**
 * Emits for the TrafficLightButtons component
 */
export interface TrafficLightEmits {
  (e: 'close'): void;
  (e: 'minimize'): void;
  (e: 'maximize'): void;
}

// ============================================
// App Definition Types
// ============================================

/**
 * Defines an application that can be launched in the desktop system
 */
export interface AppDefinition {
  id: string;
  name: string;
  icon: string;
  defaultWidth: number;
  defaultHeight: number;
  component: Component;
}

// ============================================
// Store Types
// ============================================

/**
 * Window store state and actions interface
 */
export interface WindowStore {
  windows: Map<string, WindowState>;
  activeWindowId: string | null;
  nextZIndex: number;
  
  // Actions
  openWindow(appId: string): void;
  closeWindow(windowId: string): void;
  minimizeWindow(windowId: string): void;
  maximizeWindow(windowId: string): void;
  focusWindow(windowId: string): void;
  updateWindowPosition(windowId: string, x: number, y: number): void;
  updateWindowSize(windowId: string, width: number, height: number): void;
}

/**
 * App store state and actions interface
 */
export interface AppStore {
  apps: Map<string, AppDefinition>;
  runningApps: Set<string>;
  
  // Actions
  getApp(appId: string): AppDefinition | undefined;
  isAppRunning(appId: string): boolean;
  setAppRunning(appId: string, running: boolean): void;
}

/**
 * Desktop icon store state and actions interface
 */
export interface DesktopIconStore {
  icons: DesktopIconData[];
  selectedIconId: string | null;
  
  // Actions
  selectIcon(iconId: string | null): void;
  moveIcon(iconId: string, position: Position): void;
}

// ============================================
// Desktop Types
// ============================================

/**
 * Props for the Desktop component
 */
export interface DesktopProps {
  wallpaper: string;
}

// ============================================
// App State Types
// ============================================

/**
 * Main application state
 */
export interface AppState {
  activeAppId: string | null;
}
