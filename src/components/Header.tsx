import React from 'react';
import { Layout, Typography, Switch, Space } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';

const { Header } = Layout;
const { Title } = Typography;

const AppHeader: React.FC = () => {
  const { currentTheme, toggleTheme } = useTheme();

  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        backgroundColor: currentTheme === 'dark' ? '#141414' : '#fff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Title
        level={3}
        style={{
          margin: 0,
          color: currentTheme === 'dark' ? '#fff' : '#000',
        }}
      >
        NoteZen
      </Title>
      <Space>
        <Switch
          checkedChildren={<BulbFilled />}
          unCheckedChildren={<BulbOutlined />}
          checked={currentTheme === 'dark'}
          onChange={toggleTheme}
        />
      </Space>
    </Header>
  );
};

export default AppHeader;