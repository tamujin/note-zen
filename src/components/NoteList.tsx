import React from 'react';
import { Row, Col, Empty, Spin } from 'antd';
import NoteCard from './NoteCard';
import { Note } from '../types';

interface NoteListProps {
  notes: Note[];
  loading?: boolean;
  onEditNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
  isGridView: boolean;
}

const NoteList: React.FC<NoteListProps> = ({
  notes,
  loading = false,
  onEditNote,
  onDeleteNote,
  isGridView,
}) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <Empty
        description="No notes found"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        style={{ margin: '40px 0' }}
      />
    );
  }

  return (
    <Row gutter={[16, 16]}>
      {notes.map((note) => (
        <Col
          key={note.id}
          xs={24}
          sm={isGridView ? 12 : 24}
          md={isGridView ? 8 : 24}
          lg={isGridView ? 6 : 24}
        >
          <NoteCard
            note={note}
            onEdit={onEditNote}
            onDelete={onDeleteNote}
            isGrid={isGridView}
          />
        </Col>
      ))}
    </Row>
  );
};

export default NoteList;