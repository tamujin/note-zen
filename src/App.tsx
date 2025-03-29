import React, { useState } from 'react';
import { Layout, FloatButton, Modal, Drawer } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { NoteProvider, useNotes } from './context/NoteContext';
import AppHeader from './components/Header';
import SearchBar from './components/SearchBar';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import { Note } from './types';
import './App.css';

const { Content } = Layout;

const AppContent: React.FC = () => {
  const { currentTheme } = useTheme();
  const { filteredNotes, addNote, updateNote, deleteNote, setActiveNote, state, toggleViewMode } = useNotes();
  const { viewMode, activeNoteId } = state;
  
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Find the active note if there is one
  const activeNote = activeNoteId ? filteredNotes.find(note => note.id === activeNoteId) || null : null;

  const handleAddNote = () => {
    setEditingNote(null); // Ensure we're creating a new note
    setIsEditorOpen(true);
  };

  const handleEditNote = (id: string) => {
    const noteToEdit = filteredNotes.find(note => note.id === id) || null;
    setEditingNote(noteToEdit);
    setIsEditorOpen(true);
  };

  const handleDeleteNote = (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this note?',
      content: 'This action cannot be undone.',
      okText: 'Yes, delete it',
      okType: 'danger',
      cancelText: 'No, keep it',
      onOk() {
        deleteNote(id);
      },
    });
  };

  const handleSaveNote = (note: Partial<Note>) => {
    if (editingNote) {
      // Update existing note
      updateNote({ ...note, id: editingNote.id });
    } else {
      // Add new note
      addNote({
        title: note.title || 'Untitled Note',
        content: note.content || '',
        tags: note.tags || [],
        isMarkdown: note.isMarkdown || false,
      });
    }
    setIsEditorOpen(false);
  };

  const handleCancelEdit = () => {
    setIsEditorOpen(false);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Content
        style={{
          padding: '24px',
          backgroundColor: currentTheme === 'dark' ? '#141414' : '#f0f2f5',
        }}
      >
        <div
          className="container"
          style={{
            backgroundColor: currentTheme === 'dark' ? '#1f1f1f' : '#fff',
          }}
        >
          <SearchBar onToggleView={toggleViewMode} isGridView={viewMode === 'grid'} />
          <NoteList
            notes={filteredNotes}
            onEditNote={handleEditNote}
            onDeleteNote={handleDeleteNote}
            isGridView={viewMode === 'grid'}
          />
        </div>

        <FloatButton
          type="primary"
          icon={<PlusOutlined />}
          tooltip="Add New Note"
          onClick={handleAddNote}
          style={{ right: 24, bottom: 24 }}
        />

        <Drawer
          title={editingNote ? 'Edit Note' : 'Create New Note'}
          placement="right"
          width={window.innerWidth > 768 ? 600 : '100%'}
          onClose={handleCancelEdit}
          open={isEditorOpen}
          bodyStyle={{ padding: 0 }}
        >
          <NoteEditor
            note={editingNote}
            onSave={handleSaveNote}
            onCancel={handleCancelEdit}
          />
        </Drawer>
      </Content>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <NoteProvider>
        <AppContent />
      </NoteProvider>
    </ThemeProvider>
  );
};

export default App;
