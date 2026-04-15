<script setup lang="ts">
/**
 * FinderApp.vue
 * macOS Finder 风格文件浏览器应用
 * 
 * Requirements satisfied:
 * - 6.1: Include at least 3 sample applications (Finder is one of them)
 * - 6.2: Display appropriate content inside the window
 */

import { ref, computed } from 'vue';

// File/Folder item interface
interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  icon: string;
  size?: string;
  modified?: string;
}

// Sidebar location interface
interface SidebarLocation {
  id: string;
  name: string;
  icon: string;
  items: FileItem[];
}

// Mock data for sidebar locations
const sidebarLocations = ref<SidebarLocation[]>([
  {
    id: 'favorites',
    name: 'Favorites',
    icon: '⭐',
    items: [],
  },
  {
    id: 'icloud',
    name: 'iCloud',
    icon: '☁️',
    items: [],
  },
  {
    id: 'locations',
    name: 'Locations',
    icon: '💻',
    items: [],
  },
]);

// Sidebar items under each location
const sidebarItems = ref([
  { id: 'airdrop', name: 'AirDrop', icon: '📡', locationId: 'favorites' },
  { id: 'recents', name: 'Recents', icon: '🕐', locationId: 'favorites' },
  { id: 'applications', name: 'Applications', icon: '📱', locationId: 'favorites' },
  { id: 'desktop', name: 'Desktop', icon: '🖥️', locationId: 'favorites' },
  { id: 'documents', name: 'Documents', icon: '📄', locationId: 'favorites' },
  { id: 'downloads', name: 'Downloads', icon: '⬇️', locationId: 'favorites' },
  { id: 'icloud-drive', name: 'iCloud Drive', icon: '☁️', locationId: 'icloud' },
  { id: 'macbook', name: 'Macintosh HD', icon: '💾', locationId: 'locations' },
  { id: 'network', name: 'Network', icon: '🌐', locationId: 'locations' },
]);

// Mock file data for different locations
const fileData: Record<string, FileItem[]> = {
  'desktop': [
    { id: '1', name: 'Screenshot 2024-01-15.png', type: 'file', icon: '🖼️', size: '2.4 MB', modified: 'Today, 10:30 AM' },
    { id: '2', name: 'Project Files', type: 'folder', icon: '📁', modified: 'Yesterday' },
    { id: '3', name: 'Notes.txt', type: 'file', icon: '📝', size: '4 KB', modified: 'Jan 10, 2024' },
  ],
  'documents': [
    { id: '4', name: 'Work', type: 'folder', icon: '📁', modified: 'Dec 28, 2023' },
    { id: '5', name: 'Personal', type: 'folder', icon: '📁', modified: 'Dec 15, 2023' },
    { id: '6', name: 'Resume.pdf', type: 'file', icon: '📕', size: '156 KB', modified: 'Nov 20, 2023' },
    { id: '7', name: 'Budget 2024.xlsx', type: 'file', icon: '📊', size: '89 KB', modified: 'Jan 2, 2024' },
    { id: '8', name: 'Meeting Notes.docx', type: 'file', icon: '📝', size: '23 KB', modified: 'Jan 8, 2024' },
  ],
  'downloads': [
    { id: '9', name: 'installer.dmg', type: 'file', icon: '💿', size: '245 MB', modified: 'Today, 9:15 AM' },
    { id: '10', name: 'photo-archive.zip', type: 'file', icon: '🗜️', size: '1.2 GB', modified: 'Yesterday' },
    { id: '11', name: 'presentation.pptx', type: 'file', icon: '📊', size: '15 MB', modified: 'Jan 12, 2024' },
  ],
  'applications': [
    { id: '12', name: 'Safari', type: 'file', icon: '🧭', size: '45 MB', modified: 'Dec 1, 2023' },
    { id: '13', name: 'Mail', type: 'file', icon: '✉️', size: '32 MB', modified: 'Dec 1, 2023' },
    { id: '14', name: 'Calendar', type: 'file', icon: '📅', size: '28 MB', modified: 'Dec 1, 2023' },
    { id: '15', name: 'Photos', type: 'file', icon: '🌸', size: '156 MB', modified: 'Dec 1, 2023' },
    { id: '16', name: 'Music', type: 'file', icon: '🎵', size: '89 MB', modified: 'Dec 1, 2023' },
    { id: '17', name: 'Terminal', type: 'file', icon: '⬛', size: '12 MB', modified: 'Dec 1, 2023' },
  ],
  'recents': [
    { id: '18', name: 'Report Q4.pdf', type: 'file', icon: '📕', size: '2.1 MB', modified: 'Today, 11:00 AM' },
    { id: '19', name: 'Design Mockup.sketch', type: 'file', icon: '🎨', size: '45 MB', modified: 'Today, 8:30 AM' },
    { id: '20', name: 'Code Review.md', type: 'file', icon: '📝', size: '8 KB', modified: 'Yesterday' },
  ],
};

// Default files for locations without specific data
const defaultFiles: FileItem[] = [
  { id: 'default-1', name: 'No items', type: 'file', icon: '📄', size: '-', modified: '-' },
];

// Currently selected sidebar item
const selectedSidebarItem = ref('documents');

// Currently selected file
const selectedFileId = ref<string | null>(null);

// Get current files based on selected sidebar item
const currentFiles = computed(() => {
  return fileData[selectedSidebarItem.value] || defaultFiles;
});

// Get current location name
const currentLocationName = computed(() => {
  const item = sidebarItems.value.find(i => i.id === selectedSidebarItem.value);
  return item?.name || 'Finder';
});

// Handle sidebar item click
function handleSidebarClick(itemId: string): void {
  selectedSidebarItem.value = itemId;
  selectedFileId.value = null;
}

// Handle file click
function handleFileClick(fileId: string): void {
  selectedFileId.value = fileId;
}

// Handle file double-click (would open the file in a real app)
function handleFileDoubleClick(file: FileItem): void {
  if (file.type === 'folder') {
    // In a real app, this would navigate into the folder
    console.log('Opening folder:', file.name);
  } else {
    // In a real app, this would open the file
    console.log('Opening file:', file.name);
  }
}

// Get items for a specific location
function getItemsForLocation(locationId: string) {
  return sidebarItems.value.filter(item => item.locationId === locationId);
}
</script>

<template>
  <div class="finder-app">
    <!-- Sidebar -->
    <div class="finder-sidebar">
      <div 
        v-for="location in sidebarLocations" 
        :key="location.id"
        class="sidebar-section"
      >
        <div class="sidebar-section-header">
          {{ location.name }}
        </div>
        <div class="sidebar-items">
          <div
            v-for="item in getItemsForLocation(location.id)"
            :key="item.id"
            class="sidebar-item"
            :class="{ 'selected': selectedSidebarItem === item.id }"
            @click="handleSidebarClick(item.id)"
          >
            <span class="sidebar-item-icon">{{ item.icon }}</span>
            <span class="sidebar-item-name">{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="finder-content">
      <!-- Toolbar -->
      <div class="finder-toolbar">
        <div class="toolbar-nav">
          <button class="toolbar-btn" disabled>
            <span>◀</span>
          </button>
          <button class="toolbar-btn" disabled>
            <span>▶</span>
          </button>
        </div>
        <div class="toolbar-title">
          {{ currentLocationName }}
        </div>
        <div class="toolbar-actions">
          <button class="toolbar-btn view-btn">
            <span>☰</span>
          </button>
        </div>
      </div>

      <!-- File List -->
      <div class="file-list">
        <!-- Column Headers -->
        <div class="file-list-header">
          <div class="file-col file-name-col">Name</div>
          <div class="file-col file-modified-col">Date Modified</div>
          <div class="file-col file-size-col">Size</div>
        </div>

        <!-- File Items -->
        <div class="file-list-body">
          <div
            v-for="file in currentFiles"
            :key="file.id"
            class="file-item"
            :class="{ 'selected': selectedFileId === file.id }"
            @click="handleFileClick(file.id)"
            @dblclick="handleFileDoubleClick(file)"
          >
            <div class="file-col file-name-col">
              <span class="file-icon">{{ file.icon }}</span>
              <span class="file-name">{{ file.name }}</span>
            </div>
            <div class="file-col file-modified-col">{{ file.modified }}</div>
            <div class="file-col file-size-col">{{ file.size || '--' }}</div>
          </div>
        </div>
      </div>

      <!-- Status Bar -->
      <div class="finder-status-bar">
        {{ currentFiles.length }} items
      </div>
    </div>
  </div>
</template>

<style scoped>
.finder-app {
  display: flex;
  height: 100%;
  background: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 13px;
  color: #1d1d1f;
}

/* Sidebar Styles */
.finder-sidebar {
  width: 180px;
  min-width: 180px;
  background: #f5f5f7;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
  padding: 8px 0;
}

.sidebar-section {
  margin-bottom: 16px;
}

.sidebar-section-header {
  padding: 4px 16px;
  font-size: 11px;
  font-weight: 600;
  color: #86868b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sidebar-items {
  padding: 0 8px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.sidebar-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.sidebar-item.selected {
  background: rgba(0, 122, 255, 0.15);
  color: #007aff;
}

.sidebar-item-icon {
  font-size: 14px;
  width: 20px;
  text-align: center;
}

.sidebar-item-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Main Content Styles */
.finder-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* Toolbar Styles */
.finder-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 38px;
  min-height: 38px;
  padding: 0 12px;
  background: #f6f6f6;
  border-bottom: 1px solid #e0e0e0;
}

.toolbar-nav {
  display: flex;
  gap: 4px;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 24px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  color: #86868b;
  font-size: 12px;
}

.toolbar-btn:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.05);
}

.toolbar-btn:disabled {
  opacity: 0.4;
  cursor: default;
}

.toolbar-title {
  font-weight: 500;
  color: #1d1d1f;
}

.toolbar-actions {
  display: flex;
  gap: 4px;
}

.view-btn {
  font-size: 14px;
}

/* File List Styles */
.file-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.file-list-header {
  display: flex;
  align-items: center;
  height: 28px;
  padding: 0 16px;
  background: #fafafa;
  border-bottom: 1px solid #e0e0e0;
  font-size: 11px;
  font-weight: 500;
  color: #86868b;
}

.file-list-body {
  flex: 1;
  overflow-y: auto;
}

.file-col {
  padding: 0 8px;
}

.file-name-col {
  flex: 1;
  min-width: 200px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-modified-col {
  width: 140px;
  flex-shrink: 0;
}

.file-size-col {
  width: 80px;
  flex-shrink: 0;
  text-align: right;
}

.file-item {
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 16px;
  cursor: pointer;
  transition: background-color 0.1s ease;
}

.file-item:hover {
  background: rgba(0, 0, 0, 0.03);
}

.file-item.selected {
  background: rgba(0, 122, 255, 0.15);
}

.file-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.file-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Status Bar Styles */
.finder-status-bar {
  height: 24px;
  min-height: 24px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  background: #f6f6f6;
  border-top: 1px solid #e0e0e0;
  font-size: 11px;
  color: #86868b;
}
</style>
