import React from 'react';
import { Card, Tag, Typography, Space, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, FieldTimeOutlined } from '@ant-design/icons';
import { Note } from '../types';
import { useTheme } from '../context/ThemeContext';
import dayjs from 'dayjs';
import ReactMarkdown from 'react-markdown';

const { Text, Paragraph } = Typography;

interface NoteCardProps {
  note: Note;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isGrid: boolean;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete, isGrid }) => {
  const { currentTheme } = useTheme();
  const { id, title, content, tags, updatedAt, isMarkdown } = note;

  // Format the date
  const formattedDate = dayjs(updatedAt).format('MMM D, YYYY h:mm A');

  // Truncate content for preview
  const previewContent = content.length > 150 ? `${content.substring(0, 150)}...` : content;

  return (
    <Card
      hoverable
      className={`note-card ${isGrid ? 'grid' : 'list'}`}
      style={{
        marginBottom: 16,
        borderRadius: 8,
        backgroundColor: currentTheme === 'dark' ? '#1f1f1f' : '#fff',
      }}
      actions={[
        <Tooltip title="Edit" key="edit">
          <EditOutlined key="edit" onClick={() => onEdit(id)} />
        </Tooltip>,
        <Tooltip title="Delete" key="delete">
          <DeleteOutlined key="delete" onClick={() => onDelete(id)} />
        </Tooltip>,
      ]}
    >
      <div style={{ marginBottom: 8 }}>
        <Typography.Title level={4} style={{ margin: 0, marginBottom: 8 }}>
          {title || 'Untitled Note'}
        </Typography.Title>
        <Space align="center">
          <FieldTimeOutlined style={{ fontSize: '12px' }} />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {formattedDate}
          </Text>
        </Space>
      </div>

      <div className="note-card-content" style={{ marginBottom: 16, maxHeight: '150px', overflow: 'hidden' }}>
        {isMarkdown ? (
          <ReactMarkdown>{previewContent}</ReactMarkdown>
        ) : (
          <Paragraph ellipsis={{ rows: 3 }}>{previewContent}</Paragraph>
        )}
      </div>

      <div className="tag-container">
          {tags.map((tag) => (
            <Tag key={tag} color="blue">
              {tag}
            </Tag>
          ))}
      </div>
    </Card>
  );
};

export default NoteCard;