<script setup lang="ts">
/**
 * NotesApp.vue
 * macOS Notes 风格笔记应用
 * 
 * Requirements satisfied:
 * - 6.1: Include at least 3 sample applications (Notes is one of them)
 * - 6.2: Display appropriate content inside the window
 */

import { ref, computed, watch } from 'vue';

// Note interface
interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Folder interface
interface Folder {
  id: string;
  name: string;
  icon: string;
  isSystem: boolean;
}

// Folders data
const folders = ref<Folder[]>([
  { id: 'all-icloud', name: 'All iCloud', icon: '☁️', isSystem: true },
  { id: 'notes', name: 'Notes', icon: '📁', isSystem: false },
  { id: 'recently-deleted', name: 'Recently Deleted', icon: '🗑️', isSystem: true },
]);

// Mock notes data
const notes = ref<Note[]>([
  {
    id: '1',
    title: 'Welcome to Notes',
    content: 'Welcome to Notes!\n\nThis is your first note. You can use Notes to capture quick thoughts, create checklists, sketch ideas, and more.\n\nTry creating a new note to get started!',
    folderId: 'notes',
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-15T10:30:00'),
  },
  {
    id: '2',
    title: 'Meeting Notes - Project Review',
    content: 'Meeting Notes - Project Review\n\nDate: January 14, 2024\nAttendees: Team Alpha\n\nAgenda:\n1. Q4 Review\n2. Q1 Planning\n3. Resource allocation\n\nAction Items:\n- Complete documentation by Friday\n- Schedule follow-up meeting\n- Review budget proposal',
    folderId: 'notes',
    createdAt: new Date('2024-01-14T14:00:00'),
    updatedAt: new Date('2024-01-14T15:30:00'),
  },
  {
    id: '3',
    title: 'Shopping List',
    content: 'Shopping List\n\n☐ Milk\n☐ Bread\n☐ Eggs\n☐ Butter\n☐ Cheese\n☐ Apples\n☐ Orange juice\n☐ Coffee',
    folderId: 'notes',
    createdAt: new Date('2024-01-13T09:00:00'),
    updatedAt: new Date('2024-01-13T09:15:00'),
  },
  {
    id: '4',
    title: 'Ideas for Weekend',
    content: 'Ideas for Weekend\n\n🎬 Movies to watch:\n- The latest sci-fi release\n- Documentary about nature\n\n📚 Books to read:\n- Start that new novel\n\n🏃 Activities:\n- Morning jog in the park\n- Try the new coffee shop downtown',
    folderId: 'notes',
    createdAt: new Date('2024-01-12T18:00:00'),
    updatedAt: new Date('2024-01-12T18:45:00'),
  },
  {
    id: '5',
    title: 'Recipe: Pasta Carbonara',
    content: 'Recipe: Pasta Carbonara\n\nIngredients:\n- 400g spaghetti\n- 200g pancetta\n- 4 egg yolks\n- 100g Pecorino Romano\n- Black pepper\n\nInstructions:\n1. Cook pasta in salted water\n2. Fry pancetta until crispy\n3. Mix egg yolks with cheese\n4. Combine hot pasta with pancetta\n5. Add egg mixture off heat\n6. Season with pepper\n\nServes 4',
    folderId: 'notes',
    createdAt: new Date('2024-01-10T12:00:00'),
    updatedAt: new Date('2024-01-10T12:30:00'),
  },
]);

// Currently selected folder
const selectedFolderId = ref('all-icloud');

// Currently selected note
const selectedNoteId = ref<string | null>('1');

// Edit mode content
const editContent = ref('');

// Get notes for current folder
const currentNotes = computed(() => {
  if (selectedFolderId.value === 'all-icloud') {
    return notes.value.filter(n => n.folderId !== 'recently-deleted');
  }
  return notes.value.filter(n => n.folderId === selectedFolderId.value);
});

// Get selected note
const selectedNote = computed(() => {
  if (!selectedNoteId.value) return null;
  return notes.value.find(n => n.id === selectedNoteId.value) || null;
});

// Get note count for a folder
function getNoteCount(folderId: string): number {
  if (folderId === 'all-icloud') {
    return notes.value.filter(n => n.folderId !== 'recently-deleted').length;
  }
  return notes.value.filter(n => n.folderId === folderId).length;
}

// Format date for display
function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } else if (days === 1) {
    return 'Yesterday';
  } else if (days < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

// Get note preview (first line after title)
function getNotePreview(note: Note): string {
  const lines = note.content.split('\n').filter(line => line.trim());
  if (lines.length > 1) {
    return lines[1].substring(0, 50) + (lines[1].length > 50 ? '...' : '');
  }
  return 'No additional text';
}

// Handle folder selection
function handleFolderClick(folderId: string): void {
  selectedFolderId.value = folderId;
  // Select first note in folder if available
  const folderNotes = folderId === 'all-icloud' 
    ? notes.value.filter(n => n.folderId !== 'recently-deleted')
    : notes.value.filter(n => n.folderId === folderId);
  selectedNoteId.value = folderNotes.length > 0 ? folderNotes[0].id : null;
}

// Handle note selection
function handleNoteClick(noteId: string): void {
  selectedNoteId.value = noteId;
}

// Watch for selected note changes to update edit content
watch(selectedNote, (note) => {
  if (note) {
    editContent.value = note.content;
  } else {
    editContent.value = '';
  }
}, { immediate: true });

// Handle content edit
function handleContentChange(event: Event): void {
  const target = event.target as HTMLTextAreaElement;
  editContent.value = target.value;
  
  // Update the note
  if (selectedNote.value) {
    const noteIndex = notes.value.findIndex(n => n.id === selectedNote.value!.id);
    if (noteIndex !== -1) {
      notes.value[noteIndex].content = target.value;
      notes.value[noteIndex].updatedAt = new Date();
      
      // Update title from first line
      const firstLine = target.value.split('\n')[0].trim();
      if (firstLine) {
        notes.value[noteIndex].title = firstLine;
      }
    }
  }
}
</script>

<template>
  <div class="notes-app">
    <!-- Sidebar - Folders -->
    <div class="notes-sidebar">
      <div class="sidebar-header">
        <span class="sidebar-title">iCloud</span>
      </div>
      <div class="folder-list">
        <div
          v-for="folder in folders"
          :key="folder.id"
          class="folder-item"
          :class="{ 'selected': selectedFolderId === folder.id }"
          @click="handleFolderClick(folder.id)"
        >
          <span class="folder-icon">{{ folder.icon }}</span>
          <span class="folder-name">{{ folder.name }}</span>
          <span class="folder-count">{{ getNoteCount(folder.id) }}</span>
        </div>
      </div>
    </div>

    <!-- Notes List -->
    <div class="notes-list">
      <div class="notes-list-header">
        <span class="notes-list-title">{{ folders.find(f => f.id === selectedFolderId)?.name }}</span>
        <span class="notes-list-count">{{ currentNotes.length }} notes</span>
      </div>
      <div class="notes-list-items">
        <div
          v-for="note in currentNotes"
          :key="note.id"
          class="note-item"
          :class="{ 'selected': selectedNoteId === note.id }"
          @click="handleNoteClick(note.id)"
        >
          <div class="note-title">{{ note.title }}</div>
          <div class="note-meta">
            <span class="note-date">{{ formatDate(note.updatedAt) }}</span>
            <span class="note-preview">{{ getNotePreview(note) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Note Editor -->
    <div class="note-editor">
      <template v-if="selectedNote">
        <div class="editor-header">
          <span class="editor-date">{{ formatDate(selectedNote.updatedAt) }}</span>
        </div>
        <div class="editor-content">
          <textarea
            :value="editContent"
            class="editor-textarea"
            placeholder="Start typing..."
            @input="handleContentChange"
          ></textarea>
        </div>
      </template>
      <template v-else>
        <div class="editor-empty">
          <div class="empty-icon">📝</div>
          <div class="empty-text">Select a note to view or edit</div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.notes-app {
  display: flex;
  height: 100%;
  background: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 13px;
  color: #1d1d1f;
}

/* Sidebar Styles */
.notes-sidebar {
  width: 180px;
  min-width: 180px;
  background: #f5f5f7;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
}

.sidebar-title {
  font-size: 11px;
  font-weight: 600;
  color: #86868b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.folder-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.folder-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.folder-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.folder-item.selected {
  background: rgba(255, 204, 0, 0.2);
}

.folder-icon {
  font-size: 14px;
  width: 20px;
  text-align: center;
}

.folder-name {
  flex: 1;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.folder-count {
  font-size: 12px;
  color: #86868b;
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 8px;
  border-radius: 10px;
}

/* Notes List Styles */
.notes-list {
  width: 250px;
  min-width: 250px;
  background: #fafafa;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}

.notes-list-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.notes-list-title {
  font-size: 15px;
  font-weight: 600;
  color: #1d1d1f;
}

.notes-list-count {
  font-size: 11px;
  color: #86868b;
}

.notes-list-items {
  flex: 1;
  overflow-y: auto;
}

.note-item {
  padding: 12px 16px;
  border-bottom: 1px solid #e8e8e8;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.note-item:hover {
  background: rgba(0, 0, 0, 0.03);
}

.note-item.selected {
  background: rgba(255, 204, 0, 0.15);
}

.note-title {
  font-size: 14px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.note-meta {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #86868b;
}

.note-date {
  flex-shrink: 0;
}

.note-preview {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Editor Styles */
.note-editor {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: #ffffff;
}

.editor-header {
  padding: 12px 20px;
  border-bottom: 1px solid #e8e8e8;
  text-align: center;
}

.editor-date {
  font-size: 12px;
  color: #86868b;
}

.editor-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-textarea {
  flex: 1;
  width: 100%;
  padding: 20px;
  border: none;
  outline: none;
  resize: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #1d1d1f;
  background: transparent;
}

.editor-textarea::placeholder {
  color: #c7c7cc;
}

/* Empty State */
.editor-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #86868b;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 14px;
}
</style>
