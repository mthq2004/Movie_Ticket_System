import { useState } from 'react';
import { Form, Input, Button, Typography, Card, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const { Title, Text } = Typography;

export default function RegisterPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await API.post('/auth/register', {
        username: values.username,
        email: values.email,
        password: values.password,
      });
      message.success('Đăng ký thành công!');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      message.error(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f2ff 0%, #e8f4fd 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>🎬</div>
          <Title level={2} style={{ margin: 0, color: '#1a1a2e' }}>Tham gia MovieTicket</Title>
          <Text type="secondary">Khám phá những bộ phim đặc sắc ngay hôm nay</Text>
        </div>

        <Card
          style={{ borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', border: '1px solid #e8e8e8' }}
          styles={{ body: { padding: 36 } }}
        >
          <Title level={4} style={{ marginTop: 0, marginBottom: 24 }}>Đăng ký tài khoản</Title>
          <Form form={form} onFinish={handleSubmit} layout="vertical" size="large" requiredMark={false}>
            <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true, message: 'Vui lòng nhập username!' }]}>
              <Input prefix={<UserOutlined style={{ color: '#bbb' }} />} placeholder="username" />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ!' }]}>
              <Input prefix={<MailOutlined style={{ color: '#bbb' }} />} placeholder="example@gmail.com" />
            </Form.Item>
            <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, min: 6, message: 'Tối thiểu 6 ký tự!' }]}>
              <Input.Password prefix={<LockOutlined style={{ color: '#bbb' }} />} placeholder="••••••••" />
            </Form.Item>
            <Form.Item
              name="confirm"
              label="Xác nhận mật khẩu"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) return Promise.resolve();
                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined style={{ color: '#bbb' }} />} placeholder="••••••••" />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" loading={loading} block size="large">
                Đăng ký ngay
              </Button>
            </Form.Item>
          </Form>

          <Divider style={{ margin: '20px 0' }} />
          <Button block icon={<ArrowLeftOutlined />} onClick={() => navigate('/login')}>
            Quay lại đăng nhập
          </Button>

          <div style={{ marginTop: 12, textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Tài khoản đăng ký mới là <Text code>User</Text>
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
}

