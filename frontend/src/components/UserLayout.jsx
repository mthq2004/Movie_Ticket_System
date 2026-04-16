import { Layout, Menu, Avatar, Dropdown, Typography, Space } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  UserOutlined, LogoutOutlined, VideoCameraOutlined, BookOutlined,
} from '@ant-design/icons';

const { Header, Content } = Layout;
const { Text } = Typography;

export default function UserLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('username');

  const menuItems = [
    { key: '/user/movies', icon: <VideoCameraOutlined />, label: 'Danh sách phim' },
    { key: '/user/bookings', icon: <BookOutlined />, label: 'Booking của tôi' },
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
    <Layout style={{ minHeight: '100vh', background: '#f5f6fa' }}>
      <Header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: '#fff',
        padding: '0 32px',
        display: 'flex', alignItems: 'center', gap: 24,
        borderBottom: '1px solid #f0f0f0',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        height: 64,
      }}>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', flexShrink: 0 }}
          onClick={() => navigate('/user/movies')}
        >
          <span style={{ fontSize: 22 }}>🎬</span>
          <Text strong style={{ fontSize: 16, color: '#4f46e5', whiteSpace: 'nowrap' }}>MovieTicket</Text>
        </div>

        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ flex: 1, borderBottom: 'none', minWidth: 0 }}
        />

        <Dropdown menu={avatarMenu} placement="bottomRight">
          <Space style={{ cursor: 'pointer', flexShrink: 0 }}>
            <Avatar icon={<UserOutlined />} style={{ background: '#4f46e5' }} />
            <Text strong style={{ whiteSpace: 'nowrap' }}>{username}</Text>
          </Space>
        </Dropdown>
      </Header>

      <Content style={{ padding: 24 }}>
        <Outlet />
      </Content>
    </Layout>
  );
}
