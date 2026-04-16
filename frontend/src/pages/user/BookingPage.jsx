import { useState, useEffect } from 'react';
import {
  Card, Form, InputNumber, Button, Typography,
  Space, Tag, Alert, Spin, Divider, message,
} from 'antd';
import { ArrowLeftOutlined, PlayCircleOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';

const { Title, Text } = Typography;

export default function BookingPage() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [seats, setSeats] = useState(1);
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    API.get('/movies')
      .then((res) => {
        const m = res.data.find((m) => m.id === Number(movieId));
        setMovie(m || null);
      })
      .finally(() => setLoading(false));
  }, [movieId]);

  const handleBook = async (values) => {
    if (!movie) return;
    setSubmitting(true);
    try {
      const res = await API.post('/bookings', {
        userId: Number(userId),
        username,
        movieId: movie.id,
        movieTitle: movie.title,
        seats: values.seats,
        totalPrice: Number(movie.price) * values.seats,
      });
      message.success(`Đặt vé thành công! Booking #${res.data.id} đang chờ xử lý thanh toán...`);
      setTimeout(() => navigate('/user/bookings'), 1500);
    } catch (err) {
      message.error(err.response?.data?.message || 'Đặt vé thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!movie) {
    return <Alert type="error" message="Không tìm thấy phim" />;
  }

  return (
    <div style={{ maxWidth: 580, margin: '0 auto' }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/user/movies')}
        style={{ marginBottom: 24 }}
      >
        Quay lại danh sách phim
      </Button>

      <Card
        style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
        styles={{ body: { padding: 32 } }}
      >
        <Title level={3} style={{ marginBottom: 24 }}>
          <PlayCircleOutlined style={{ marginRight: 8, color: '#4f46e5' }} />
          Đặt vé xem phim
        </Title>

        {/* Movie info card */}
        <Card
          style={{
            background: 'linear-gradient(135deg, #f0f2ff 0%, #e0e7ff 100%)',
            border: '1px solid #c7d2fe',
            marginBottom: 28,
            borderRadius: 10,
          }}
        >
          <Space direction="vertical" size={8} style={{ width: '100%' }}>
            <Tag color="purple">{movie.genre}</Tag>
            <Title level={4} style={{ margin: 0 }}>{movie.title}</Title>
            {movie.description && (
              <Text type="secondary" style={{ fontSize: 13 }}>{movie.description}</Text>
            )}
            <Divider style={{ margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text type="secondary">⏱ {movie.duration} phút</Text>
              <Text type="secondary">💺 {movie.availableSeats} ghế trống</Text>
              <Text style={{ color: '#389e0d', fontWeight: 700 }}>
                {Number(movie.price).toLocaleString('vi-VN')} ₫/ghế
              </Text>
            </div>
          </Space>
        </Card>

        <Form form={form} onFinish={handleBook} layout="vertical" initialValues={{ seats: 1 }}>
          <Form.Item
            name="seats"
            label="Số ghế muốn đặt"
            rules={[{ required: true, message: 'Vui lòng nhập số ghế!' }]}
          >
            <InputNumber
              min={1}
              max={movie.availableSeats}
              size="large"
              style={{ width: '100%' }}
              onChange={(v) => setSeats(v || 1)}
            />
          </Form.Item>

          {/* Total */}
          <Card
            style={{
              background: '#f5f6fa',
              marginBottom: 16,
              borderRadius: 8,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Space direction="vertical" size={2}>
                <Text strong>Tổng thanh toán</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {Number(movie.price).toLocaleString('vi-VN')} ₫ × {seats} ghế
                </Text>
              </Space>
              <Text style={{ color: '#4f46e5', fontWeight: 700, fontSize: 22 }}>
                {(Number(movie.price) * (seats || 1)).toLocaleString('vi-VN')} ₫
              </Text>
            </div>
          </Card>

          <Alert
            icon={<ThunderboltOutlined />}
            type="info"
            showIcon
            message="Thanh toán tự động"
            description="Sau khi đặt vé, Payment Service sẽ xử lý thanh toán và gửi thông báo kết quả."
            style={{ marginBottom: 20 }}
          />

          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            block
            size="large"
            icon={<PlayCircleOutlined />}
          >
            Xác nhận đặt vé
          </Button>
        </Form>
      </Card>
    </div>
  );
}
