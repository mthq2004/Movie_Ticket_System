import { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Typography, Space } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  VideoCameraOutlined,
  BookOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('username');

  const menuItems = [
    { key: '/admin/movies', icon: <VideoCameraOutlined />, label: 'Quản lý Phim' },
    { key: '/admin/bookings', icon: <BookOutlined />, label: 'Quản lý Booking' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const avatarMenu = {
    items: [
      { key: 'user', icon: <UserOutlined />, label: username, disabled: true },
      { type: 'divider' },
      { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true },
    ],
    onClick: ({ key }) => { if (key === 'logout') handleLogout(); },
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        width={220}
        style={{ background: '#fff', borderRight: '1px solid #e8e8e8', boxShadow: '2px 0 8px rgba(0,0,0,0.06)' }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? 0 : '0 20px',
            borderBottom: '1px solid #f0f0f0',
            background: '#fff',
          }}
        >
          <span style={{ fontSize: 22 }}>🎬</span>
          {!collapsed && (
            <Text strong style={{ marginLeft: 10, fontSize: 15, color: '#4f46e5' }}>Admin Panel</Text>
          )}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ border: 'none', marginTop: 8 }}
        />

        {!collapsed && (
          <div style={{
            position: 'absolute', bottom: 0, width: '100%',
            padding: '12px 16px', borderTop: '1px solid #f0f0f0', background: '#fafafa',
          }}>
            <Space>
              <Avatar size="small" icon={<UserOutlined />} style={{ background: '#4f46e5' }} />
              <Space direction="vertical" size={0}>
                <Text style={{ fontSize: 13, fontWeight: 600 }}>{username}</Text>
                <Text type="secondary" style={{ fontSize: 11 }}>Administrator</Text>
              </Space>
            </Space>
          </div>
        )}
      </Sider>

      <Layout>
        <Header style={{
          background: '#fff',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #f0f0f0',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          height: 64,
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <Dropdown menu={avatarMenu} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} style={{ background: '#4f46e5' }} />
              <Text strong>{username}</Text>
            </Space>
          </Dropdown>
        </Header>

        <Content style={{ margin: 24, minHeight: 'calc(100vh - 112px)' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
