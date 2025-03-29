import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Note, NoteState } from '../types';

type NoteAction =
  | { type: 'ADD_NOTE'; payload: Omit<Note, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_NOTE'; payload: Partial<Note> & { id: string } }
  | { type: 'DELETE_NOTE'; payload: { id: string } }
  | { type: 'SET_ACTIVE_NOTE'; payload: { id: string | null } }
  | { type: 'SET_SEARCH_QUERY'; payload: { query: string } }
  | { type: 'TOGGLE_TAG_SELECTION'; payload: { tag: string } }
  | { type: 'TOGGLE_VIEW_MODE' };

interface NoteContextType {
  state: NoteState;
  dispatch: React.Dispatch<NoteAction>;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (note: Partial<Note> & { id: string }) => void;
  deleteNote: (id: string) => void;
  setActiveNote: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  toggleTagSelection: (tag: string) => void;
  toggleViewMode: () => void;
  getAllTags: () => string[];
  filteredNotes: Note[];
}

const initialState: NoteState = {
  notes: [],
  activeNoteId: null,
  searchQuery: '',
  selectedTags: [],
  viewMode: 'grid',
};

const loadState = (): NoteState => {
  try {
    const savedState = localStorage.getItem('noteState');
    return savedState ? JSON.parse(savedState) : initialState;
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
    return initialState;
  }
};

const noteReducer = (state: NoteState, action: NoteAction): NoteState => {
  switch (action.type) {
    case 'ADD_NOTE': {
      const timestamp = new Date().toISOString();
      const newNote: Note = {
        ...action.payload,
        id: uuidv4(),
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      return {
        ...state,
        notes: [newNote, ...state.notes],
        activeNoteId: newNote.id,
      };
    }
    case 'UPDATE_NOTE': {
      const updatedNotes = state.notes.map(note =>
        note.id === action.payload.id
          ? { ...note, ...action.payload, updatedAt: new Date().toISOString() }
          : note
      );
      return {
        ...state,
        notes: updatedNotes,
      };
    }
    case 'DELETE_NOTE': {
      const filteredNotes = state.notes.filter(note => note.id !== action.payload.id);
      return {
        ...state,
        notes: filteredNotes,
        activeNoteId: state.activeNoteId === action.payload.id ? null : state.activeNoteId,
      };
    }
    case 'SET_ACTIVE_NOTE': {
      return {
        ...state,
        activeNoteId: action.payload.id,
      };
    }
    case 'SET_SEARCH_QUERY': {
      return {
        ...state,
        searchQuery: action.payload.query,
      };
    }
    case 'TOGGLE_TAG_SELECTION': {
      const { tag } = action.payload;
      const selectedTags = state.selectedTags.includes(tag)
        ? state.selectedTags.filter(t => t !== tag)
        : [...state.selectedTags, tag];
      return {
        ...state,
        selectedTags,
      };
    }
    case 'TOGGLE_VIEW_MODE': {
      return {
        ...state,
        viewMode: state.viewMode === 'list' ? 'grid' : 'list',
      };
    }
    default:
      return state;
  }
};

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const useNotes = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error('useNotes must be used within a NoteProvider');
  }
  return context;
};

interface NoteProviderProps {
  children: ReactNode;
}

export const NoteProvider: React.FC<NoteProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(noteReducer, loadState());

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('noteState', JSON.stringify(state));
  }, [state]);

  // Helper functions for common operations
  const addNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch({ type: 'ADD_NOTE', payload: note });
  };

  const updateNote = (note: Partial<Note> & { id: string }) => {
    dispatch({ type: 'UPDATE_NOTE', payload: note });
  };

  const deleteNote = (id: string) => {
    dispatch({ type: 'DELETE_NOTE', payload: { id } });
  };

  const setActiveNote = (id: string | null) => {
    dispatch({ type: 'SET_ACTIVE_NOTE', payload: { id } });
  };

  const setSearchQuery = (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: { query } });
  };

  const toggleTagSelection = (tag: string) => {
    dispatch({ type: 'TOGGLE_TAG_SELECTION', payload: { tag } });
  };

  const toggleViewMode = () => {
    dispatch({ type: 'TOGGLE_VIEW_MODE' });
  };

  const getAllTags = (): string[] => {
    const allTags = new Set<string>();
    state.notes.forEach(note => {
      note.tags.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags);
  };

  // Filter notes based on search query and selected tags
  const filteredNotes = state.notes.filter(note => {
    const matchesSearch = state.searchQuery
      ? note.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(state.searchQuery.toLowerCase())
      : true;

    const matchesTags = state.selectedTags.length > 0
      ? state.selectedTags.every(tag => note.tags.includes(tag))
      : true;

    return matchesSearch && matchesTags;
  });

  return (
    <NoteContext.Provider
      value={{
        state,
        dispatch,
        addNote,
        updateNote,
        deleteNote,
        setActiveNote,
        setSearchQuery,
        toggleTagSelection,
        toggleViewMode,
        getAllTags,
        filteredNotes,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};