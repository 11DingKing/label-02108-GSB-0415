<script setup lang="ts">
/**
 * SettingsApp.vue
 * macOS System Preferences 风格设置应用
 * 
 * Requirements satisfied:
 * - 6.1: Include at least 3 sample applications (Settings is one of them)
 * - 6.2: Display appropriate content inside the window
 */

import { ref, computed } from 'vue';

// Preference pane interface
interface PreferencePane {
  id: string;
  name: string;
  icon: string;
  category: string;
}

// Preference categories
const categories = [
  { id: 'personal', name: '' },
  { id: 'hardware', name: '' },
  { id: 'internet', name: '' },
  { id: 'system', name: '' },
];

// Preference panes data (macOS System Preferences style)
const preferencePanes = ref<PreferencePane[]>([
  // Personal
  { id: 'general', name: 'General', icon: '⚙️', category: 'personal' },
  { id: 'desktop', name: 'Desktop & Screen Saver', icon: '🖼️', category: 'personal' },
  { id: 'dock', name: 'Dock & Menu Bar', icon: '📱', category: 'personal' },
  { id: 'mission-control', name: 'Mission Control', icon: '🚀', category: 'personal' },
  { id: 'siri', name: 'Siri', icon: '🎙️', category: 'personal' },
  { id: 'spotlight', name: 'Spotlight', icon: '🔍', category: 'personal' },
  { id: 'language', name: 'Language & Region', icon: '🌐', category: 'personal' },
  { id: 'notifications', name: 'Notifications', icon: '🔔', category: 'personal' },
  
  // Hardware
  { id: 'displays', name: 'Displays', icon: '🖥️', category: 'hardware' },
  { id: 'sound', name: 'Sound', icon: '🔊', category: 'hardware' },
  { id: 'keyboard', name: 'Keyboard', icon: '⌨️', category: 'hardware' },
  { id: 'trackpad', name: 'Trackpad', icon: '🖱️', category: 'hardware' },
  { id: 'mouse', name: 'Mouse', icon: '🖲️', category: 'hardware' },
  { id: 'printers', name: 'Printers & Scanners', icon: '🖨️', category: 'hardware' },
  { id: 'battery', name: 'Battery', icon: '🔋', category: 'hardware' },
  
  // Internet & Wireless
  { id: 'network', name: 'Network', icon: '📶', category: 'internet' },
  { id: 'bluetooth', name: 'Bluetooth', icon: '📲', category: 'internet' },
  { id: 'sharing', name: 'Sharing', icon: '📤', category: 'internet' },
  
  // System
  { id: 'users', name: 'Users & Groups', icon: '👥', category: 'system' },
  { id: 'accessibility', name: 'Accessibility', icon: '♿', category: 'system' },
  { id: 'security', name: 'Security & Privacy', icon: '🔒', category: 'system' },
  { id: 'software-update', name: 'Software Update', icon: '📦', category: 'system' },
  { id: 'date-time', name: 'Date & Time', icon: '🕐', category: 'system' },
  { id: 'startup-disk', name: 'Startup Disk', icon: '💾', category: 'system' },
  { id: 'time-machine', name: 'Time Machine', icon: '⏰', category: 'system' },
]);

// Currently selected pane
const selectedPaneId = ref<string | null>(null);

// Search query
const searchQuery = ref('');

// Get selected pane details
const selectedPane = computed(() => {
  if (!selectedPaneId.value) return null;
  return preferencePanes.value.find(p => p.id === selectedPaneId.value) || null;
});

// Filter panes by search query
const filteredPanes = computed(() => {
  if (!searchQuery.value.trim()) {
    return preferencePanes.value;
  }
  const query = searchQuery.value.toLowerCase();
  return preferencePanes.value.filter(pane => 
    pane.name.toLowerCase().includes(query)
  );
});

// Get panes by category
function getPanesByCategory(categoryId: string): PreferencePane[] {
  return filteredPanes.value.filter(pane => pane.category === categoryId);
}

// Handle pane click
function handlePaneClick(paneId: string): void {
  selectedPaneId.value = paneId;
}

// Go back to main view
function handleBackClick(): void {
  selectedPaneId.value = null;
}

// Check if category has any visible panes
function categoryHasPanes(categoryId: string): boolean {
  return getPanesByCategory(categoryId).length > 0;
}
</script>

<template>
  <div class="settings-app">
    <!-- Main Grid View -->
    <div v-if="!selectedPane" class="settings-main">
      <!-- Search Bar -->
      <div class="settings-search">
        <div class="search-container">
          <span class="search-icon">🔍</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search"
            class="search-input"
          />
        </div>
      </div>

      <!-- Preference Panes Grid -->
      <div class="settings-grid-container">
        <template v-for="category in categories" :key="category.id">
          <div 
            v-if="categoryHasPanes(category.id)" 
            class="settings-category"
          >
            <div class="panes-grid">
              <div
                v-for="pane in getPanesByCategory(category.id)"
                :key="pane.id"
                class="pane-item"
                @click="handlePaneClick(pane.id)"
              >
                <div class="pane-icon">{{ pane.icon }}</div>
                <div class="pane-name">{{ pane.name }}</div>
              </div>
            </div>
            <div class="category-divider"></div>
          </div>
        </template>
      </div>
    </div>

    <!-- Detail View -->
    <div v-else class="settings-detail">
      <!-- Detail Header -->
      <div class="detail-header">
        <button class="back-button" @click="handleBackClick">
          <span class="back-icon">◀</span>
          <span class="back-text">Show All</span>
        </button>
        <div class="detail-search">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search"
            class="search-input"
            disabled
          />
        </div>
      </div>

      <!-- Detail Content -->
      <div class="detail-content">
        <div class="detail-icon">{{ selectedPane.icon }}</div>
        <h1 class="detail-title">{{ selectedPane.name }}</h1>
        <p class="detail-description">
          Configure your {{ selectedPane.name.toLowerCase() }} preferences here.
        </p>
        
        <!-- Sample Settings UI -->
        <div class="sample-settings">
          <div class="setting-row">
            <span class="setting-label">Enable {{ selectedPane.name }}</span>
            <label class="toggle-switch">
              <input type="checkbox" checked />
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="setting-row">
            <span class="setting-label">Show in Menu Bar</span>
            <label class="toggle-switch">
              <input type="checkbox" />
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="setting-row">
            <span class="setting-label">Automatic Updates</span>
            <label class="toggle-switch">
              <input type="checkbox" checked />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-app {
  height: 100%;
  background: linear-gradient(180deg, #f5f5f7 0%, #e8e8ed 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 13px;
  color: #1d1d1f;
  overflow: hidden;
}

/* Main View Styles */
.settings-main {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Search Bar Styles */
.settings-search {
  padding: 16px 20px 8px;
  display: flex;
  justify-content: center;
}

.search-container {
  display: flex;
  align-items: center;
  width: 220px;
  height: 28px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 6px;
  padding: 0 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.search-icon {
  font-size: 12px;
  margin-right: 6px;
  opacity: 0.5;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 13px;
  outline: none;
  color: #1d1d1f;
}

.search-input::placeholder {
  color: #86868b;
}

.search-input:disabled {
  cursor: default;
}

/* Grid Container */
.settings-grid-container {
  flex: 1;
  overflow-y: auto;
  padding: 8px 20px 20px;
}

/* Category Styles */
.settings-category {
  margin-bottom: 8px;
}

.category-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
  margin: 16px 0;
}

.settings-category:last-child .category-divider {
  display: none;
}

/* Panes Grid */
.panes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 16px;
  justify-items: center;
}

/* Pane Item */
.pane-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90px;
  padding: 12px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.pane-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.pane-item:active {
  background: rgba(0, 0, 0, 0.1);
}

.pane-icon {
  font-size: 40px;
  margin-bottom: 8px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.pane-name {
  text-align: center;
  font-size: 11px;
  line-height: 1.3;
  color: #1d1d1f;
  word-wrap: break-word;
  max-width: 100%;
}

/* Detail View Styles */
.settings-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.5);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.back-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: none;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: #007aff;
  transition: background-color 0.15s ease;
}

.back-button:hover {
  background: rgba(0, 0, 0, 0.1);
}

.back-icon {
  font-size: 10px;
}

.back-text {
  font-weight: 500;
}

.detail-search {
  display: flex;
  align-items: center;
  width: 180px;
  height: 26px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 6px;
  padding: 0 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  opacity: 0.5;
}

.detail-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  overflow-y: auto;
}

.detail-icon {
  font-size: 64px;
  margin-bottom: 16px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
}

.detail-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px;
  color: #1d1d1f;
}

.detail-description {
  font-size: 13px;
  color: #86868b;
  margin: 0 0 32px;
  text-align: center;
}

/* Sample Settings UI */
.sample-settings {
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  padding: 8px 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.setting-row:last-child {
  border-bottom: none;
}

.setting-label {
  font-size: 13px;
  color: #1d1d1f;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e9e9eb;
  transition: 0.3s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.toggle-switch input:checked + .toggle-slider {
  background-color: #34c759;
}

.toggle-switch input:checked + .toggle-slider:before {
  transform: translateX(20px);
}
</style>
