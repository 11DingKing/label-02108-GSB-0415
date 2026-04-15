<script setup lang="ts">
/**
 * MenuBar Component - macOS Style Menu Bar
 * 
 * A fixed top menu bar that displays:
 * - Apple logo icon on the left
 * - Active application name
 * - Menu items with dropdown functionality
 * - Current system time on the right
 * - Semi-transparent frosted glass effect background
 * 
 * Requirements satisfied:
 * - 1.1: Fixed at top with height 24-28 pixels
 * - 1.2: Display Apple logo icon on left
 * - 1.3: Click menu item shows dropdown
 * - 1.4: Display current time on right
 * - 1.5: Semi-transparent frosted glass effect
 * - 1.6: Update to show active application name
 */

import { ref, onMounted, onUnmounted } from 'vue';
import type { MenuItem } from '../types';

// Props definition
interface Props {
  activeAppName: string;
  menuItems: MenuItem[];
}

withDefaults(defineProps<Props>(), {
  activeAppName: 'Finder',
  menuItems: () => [],
});

// Emits definition
const emit = defineEmits<{
  (e: 'menu-action', menuId: string): void;
}>();

// State for current time
const currentTime = ref('');

// State for active dropdown menu
const activeMenuId = ref<string | null>(null);

// Format time as macOS style (e.g., "Mon Jan 1 12:00 PM")
function formatTime(date: Date): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const dayNum = date.getDate();
  
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  
  return `${dayName} ${monthName} ${dayNum}  ${hours}:${minutes} ${ampm}`;
}

// Update time every minute
let timeInterval: ReturnType<typeof setInterval> | null = null;

function updateTime(): void {
  currentTime.value = formatTime(new Date());
}

// Toggle dropdown menu
function toggleMenu(menuId: string): void {
  if (activeMenuId.value === menuId) {
    activeMenuId.value = null;
  } else {
    activeMenuId.value = menuId;
  }
}

// Handle menu item click
function handleMenuItemClick(item: MenuItem): void {
  if (item.action) {
    item.action();
  }
  emit('menu-action', item.id);
  activeMenuId.value = null;
}

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent): void {
  const target = event.target as HTMLElement;
  if (!target.closest('.menu-bar-item') && !target.closest('.dropdown-menu')) {
    activeMenuId.value = null;
  }
}

// Computed: Check if a menu has children
function hasChildren(item: MenuItem): boolean {
  return !!(item.children && item.children.length > 0);
}

// Lifecycle hooks
onMounted(() => {
  updateTime();
  timeInterval = setInterval(updateTime, 60000); // Update every minute
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <header class="menu-bar frosted-glass">
    <!-- Left Section: Apple Icon + App Name + Menu Items -->
    <div class="menu-bar-left">
      <!-- Apple Logo -->
      <div class="menu-bar-item apple-menu" @click.stop="toggleMenu('apple')">
        <span class="apple-icon"></span>
        <!-- Apple Menu Dropdown -->
        <div v-if="activeMenuId === 'apple'" class="dropdown-menu">
          <div class="dropdown-item" @click="handleMenuItemClick({ id: 'about', label: 'About This Mac' })">
            About This Mac
          </div>
          <div class="dropdown-divider"></div>
          <div class="dropdown-item" @click="handleMenuItemClick({ id: 'preferences', label: 'System Preferences...' })">
            System Preferences...
          </div>
          <div class="dropdown-item" @click="handleMenuItemClick({ id: 'app-store', label: 'App Store...' })">
            App Store...
          </div>
          <div class="dropdown-divider"></div>
          <div class="dropdown-item" @click="handleMenuItemClick({ id: 'sleep', label: 'Sleep' })">
            Sleep
          </div>
          <div class="dropdown-item" @click="handleMenuItemClick({ id: 'restart', label: 'Restart...' })">
            Restart...
          </div>
          <div class="dropdown-item" @click="handleMenuItemClick({ id: 'shutdown', label: 'Shut Down...' })">
            Shut Down...
          </div>
        </div>
      </div>

      <!-- Active App Name -->
      <div class="menu-bar-item app-name" @click.stop="toggleMenu('app')">
        <span class="app-name-text">{{ activeAppName }}</span>
        <!-- App Menu Dropdown -->
        <div v-if="activeMenuId === 'app'" class="dropdown-menu">
          <div class="dropdown-item" @click="handleMenuItemClick({ id: 'about-app', label: `About ${activeAppName}` })">
            About {{ activeAppName }}
          </div>
          <div class="dropdown-divider"></div>
          <div class="dropdown-item" @click="handleMenuItemClick({ id: 'preferences-app', label: 'Preferences...' })">
            Preferences...
          </div>
          <div class="dropdown-divider"></div>
          <div class="dropdown-item" @click="handleMenuItemClick({ id: 'hide-app', label: `Hide ${activeAppName}` })">
            Hide {{ activeAppName }}
          </div>
          <div class="dropdown-item" @click="handleMenuItemClick({ id: 'hide-others', label: 'Hide Others' })">
            Hide Others
          </div>
          <div class="dropdown-item" @click="handleMenuItemClick({ id: 'show-all', label: 'Show All' })">
            Show All
          </div>
          <div class="dropdown-divider"></div>
          <div class="dropdown-item" @click="handleMenuItemClick({ id: 'quit-app', label: `Quit ${activeAppName}` })">
            Quit {{ activeAppName }}
          </div>
        </div>
      </div>

      <!-- Custom Menu Items -->
      <template v-for="menuItem in menuItems" :key="menuItem.id">
        <div class="menu-bar-item" @click.stop="toggleMenu(menuItem.id)">
          <span>{{ menuItem.label }}</span>
          <!-- Dropdown for menu items with children -->
          <div v-if="activeMenuId === menuItem.id && hasChildren(menuItem)" class="dropdown-menu">
            <template v-for="child in menuItem.children" :key="child.id">
              <div 
                v-if="child.label === '-'" 
                class="dropdown-divider"
              ></div>
              <div 
                v-else
                class="dropdown-item"
                @click="handleMenuItemClick(child)"
              >
                {{ child.label }}
              </div>
            </template>
          </div>
        </div>
      </template>
    </div>

    <!-- Right Section: System Time -->
    <div class="menu-bar-right">
      <div class="menu-bar-item time-display">
        {{ currentTime }}
      </div>
    </div>
  </header>
</template>

<style scoped>
.menu-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--menu-bar-height, 24px);
  background-color: var(--menu-bar-bg, rgba(255, 255, 255, 0.8));
  z-index: var(--z-menu-bar, 9999);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary, #1d1d1f);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.menu-bar-left {
  display: flex;
  align-items: center;
  height: 100%;
}

.menu-bar-right {
  display: flex;
  align-items: center;
  height: 100%;
}

.menu-bar-item {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 10px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.15s ease;
}

.menu-bar-item:hover {
  background-color: rgba(0, 0, 0, 0.08);
}

.menu-bar-item:active {
  background-color: rgba(0, 0, 0, 0.12);
}

/* Apple Icon */
.apple-menu {
  padding: 0 12px;
}

.apple-icon {
  font-size: 16px;
  line-height: 1;
}

.apple-icon::before {
  content: '';
}

/* App Name */
.app-name-text {
  font-weight: 600;
}

/* Time Display */
.time-display {
  font-weight: 400;
  font-variant-numeric: tabular-nums;
}

/* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 200px;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 6px;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(0, 0, 0, 0.1);
  padding: 4px 0;
  z-index: 10000;
  animation: dropdown-appear 0.15s ease;
}

@keyframes dropdown-appear {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  padding: 6px 16px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 400;
  color: var(--text-primary, #1d1d1f);
  transition: background-color 0.1s ease;
}

.dropdown-item:hover {
  background-color: var(--system-blue, #007aff);
  color: white;
}

.dropdown-divider {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  margin: 4px 0;
}
</style>
