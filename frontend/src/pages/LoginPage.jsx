import { useState } from 'react';
import { Form, Input, Button, Typography, Card, message, Divider, Space } from 'antd';
import { UserOutlined, LockOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const { Title, Text } = Typography;

export default function LoginPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/login', values);
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('userId', String(res.data.userId));
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('role', res.data.role);
      message.success('Đăng nhập thành công!');
      setTimeout(() => {
        navigate(res.data.role === 'admin' ? '/admin/movies' : '/user/movies');
      }, 500);
    } catch (err) {
      message.error(err.response?.data?.message || 'Sai username hoặc password');
    } finally {
      setLoading(false);
    }
  };

  const handleInitAdmin = async () => {
    setInitLoading(true);
    try {
      const res = await API.post('/auth/init-admin');
      message.success(res.data.message);
    } catch {
      message.error('Lỗi khởi tạo hoặc admin đã tồn tại');
    } finally {
      setInitLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f2ff 0%, #e8f4fd 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>🎬</div>
          <Title level={2} style={{ margin: 0, color: '#1a1a2e' }}>MovieTicket</Title>
          <Text type="secondary">Hệ thống đặt vé xem phim trực tuyến</Text>
        </div>

        <Card
          style={{ borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', border: '1px solid #e8e8e8' }}
          styles={{ body: { padding: 36 } }}
        >
          <Title level={4} style={{ marginTop: 0, marginBottom: 24 }}>Đăng nhập</Title>
          <Form form={form} onFinish={handleSubmit} layout="vertical" size="large">
            <Form.Item
              name="username"
              label="Tên đăng nhập"
              rules={[{ required: true, message: 'Vui lòng nhập username!' }]}
            >
              <Input prefix={<UserOutlined style={{ color: '#bbb' }} />} placeholder="Nhập username" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: 'Vui lòng nhập password!' }]}
            >
              <Input.Password prefix={<LockOutlined style={{ color: '#bbb' }} />} placeholder="Nhập mật khẩu" />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" loading={loading} block size="large">
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>

          <Divider style={{ margin: '20px 0' }} />

          <Space direction="vertical" style={{ width: '100%' }} size={10}>
            <Button block size="large" onClick={() => navigate('/register')}>
              Tạo tài khoản mới
            </Button>
            <Button
              block
              type="dashed"
              icon={<ThunderboltOutlined />}
              loading={initLoading}
              onClick={handleInitAdmin}
              style={{ color: '#4f46e5', borderColor: '#4f46e5' }}
            >
              Khởi tạo Admin lần đầu
            </Button>
          </Space>

          <div style={{ marginTop: 16, padding: '10px 12px', background: '#f5f6fa', borderRadius: 6, textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Admin mặc định: <Text code style={{ fontSize: 12 }}>admin / admin123</Text>
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
}
