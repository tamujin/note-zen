export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isMarkdown: boolean;
}

export interface NoteState {
  notes: Note[];
  activeNoteId: string | null;
  searchQuery: string;
  selectedTags: string[];
  viewMode: 'list' | 'grid';
}