import React from 'react';
import { Input, Space, Select, Button } from 'antd';
import { SearchOutlined, TagOutlined, AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useNotes } from '../context/NoteContext';

const { Option } = Select;

interface SearchBarProps {
  onToggleView: () => void;
  isGridView: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onToggleView, isGridView }) => {
  const { setSearchQuery, getAllTags, toggleTagSelection, state } = useNotes();
  const { selectedTags } = state;
  const allTags = getAllTags();

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleTagChange = (value: string[]) => {
    // Clear previous selections
    selectedTags.forEach(tag => toggleTagSelection(tag));
    
    // Set new selections
    value.forEach(tag => {
      if (!selectedTags.includes(tag)) {
        toggleTagSelection(tag);
      }
    });
  };

  return (
    <Space direction="vertical" style={{ width: '100%', marginBottom: '16px' }}>
      <Input.Search
        placeholder="Search notes..."
        allowClear
        enterButton={<SearchOutlined />}
        size="large"
        onSearch={handleSearch}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <Select
          mode="multiple"
          style={{ minWidth: '200px', maxWidth: '70%' }}
          placeholder={<><TagOutlined /> Filter by tags</>}
          value={selectedTags}
          onChange={handleTagChange}
          optionLabelProp="label"
        >
          {allTags.map(tag => (
            <Option key={tag} value={tag} label={tag}>
              <Space>
                <TagOutlined />
                <span>{tag}</span>
              </Space>
            </Option>
          ))}
        </Select>
        <Button 
          icon={isGridView ? <UnorderedListOutlined /> : <AppstoreOutlined />} 
          onClick={onToggleView}
          type="text"
        >
          {isGridView ? 'List View' : 'Grid View'}
        </Button>
      </Space>
    </Space>
  );
};

export default SearchBar;