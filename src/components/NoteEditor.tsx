import React, { useState, useEffect } from 'react';
import { Input, Button, Space, Tabs, Tag, Tooltip, Typography } from 'antd';
import { PlusOutlined, CheckOutlined, CloseOutlined, MarkdownOutlined, FileTextOutlined } from '@ant-design/icons';
import { Note } from '../types';
import ReactMarkdown from 'react-markdown';

const { TextArea } = Input;
// Remove TabPane import as it's deprecated in Ant Design 5.x

interface NoteEditorProps {
  note: Note | null;
  onSave: (note: Partial<Note>) => void;
  onCancel: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isMarkdown, setIsMarkdown] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');
  
  // Initialize form with note data if editing an existing note
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags);
      setIsMarkdown(note.isMarkdown);
    } else {
      // Default values for a new note
      setTitle('');
      setContent('');
      setTags([]);
      setIsMarkdown(false);
    }
  }, [note]);

  const handleSave = () => {
    onSave({
      id: note?.id,
      title: title.trim() || 'Untitled Note',
      content,
      tags,
      isMarkdown,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const handleTagClose = (removedTag: string) => {
    const newTags = tags.filter(tag => tag !== removedTag);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const toggleMarkdown = () => {
    setIsMarkdown(!isMarkdown);
  };

  return (
    <div style={{ padding: '16px' }}>
      <Input
        placeholder="Note Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}
      />

      <div style={{ marginBottom: '16px' }}>
        <Space>
          <Tooltip title={isMarkdown ? 'Switch to Plain Text' : 'Switch to Markdown'}>
            <Button
              icon={isMarkdown ? <FileTextOutlined /> : <MarkdownOutlined />}
              onClick={toggleMarkdown}
            >
              {isMarkdown ? 'Plain Text' : 'Markdown'}
            </Button>
          </Tooltip>
        </Space>
      </div>

      {isMarkdown && (
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab} 
          style={{ marginBottom: '16px' }}
          items={[
            {
              key: 'edit',
              label: 'Edit',
              children: (
                <TextArea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your note in Markdown..."
                  autoSize={{ minRows: 10, maxRows: 20 }}
                />
              ),
            },
            {
              key: 'preview',
              label: 'Preview',
              children: (
                <div className="editor-preview">
                  {content ? <ReactMarkdown>{content}</ReactMarkdown> : <Typography.Text type="secondary">Nothing to preview</Typography.Text>}
                </div>
              ),
            },
          ]}
        />
      )}

      {!isMarkdown && (
        <TextArea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note..."
          autoSize={{ minRows: 10, maxRows: 20 }}
        />
      )}

      <div style={{ marginTop: '16px', marginBottom: '16px' }}>
        <Typography.Text style={{ marginRight: '8px' }}>Tags:</Typography.Text>
        <div className="tag-container">
          {tags.map((tag) => (
            <Tag
              key={tag}
              closable
              onClose={() => handleTagClose(tag)}
            >
              {tag}
            </Tag>
          ))}
          {inputVisible ? (
            <Input
              type="text"
              size="small"
              style={{ width: '120px' }}
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputConfirm}
              onPressEnter={handleInputConfirm}
              autoFocus
            />
          ) : (
            <Tag onClick={showInput} style={{ borderStyle: 'dashed' }}>
              <PlusOutlined /> New Tag
            </Tag>
          )}
        </div>
      </div>

      <div className="editor-actions">
        <Space>
          <Button onClick={onCancel} icon={<CloseOutlined />}>Cancel</Button>
          <Button type="primary" onClick={handleSave} icon={<CheckOutlined />}>Save</Button>
        </Space>
      </div>
    </div>
  );
};

export default NoteEditor;