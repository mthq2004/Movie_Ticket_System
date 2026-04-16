import { useState, useEffect } from 'react';
import {
  Table, Tag, Typography, Button, Space, Empty, Card,
} from 'antd';
import {
  BookOutlined, ReloadOutlined, PlusOutlined,
  CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

const { Title, Text } = Typography;

const STATUS_CONFIG = {
  pending: { color: 'gold', label: 'Đang xử lý', icon: <ClockCircleOutlined /> },
  confirmed: { color: 'green', label: 'Thành công', icon: <CheckCircleOutlined /> },
  failed: { color: 'red', label: 'Thất bại', icon: <CloseCircleOutlined /> },
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = Number(localStorage.getItem('userId'));

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await API.get('/bookings');
      setBookings(res.data.filter((b) => b.userId === userId));
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', width: 60 },
    {
      title: 'Phim', dataIndex: 'movieTitle', key: 'movieTitle',
      render: (t) => <Text strong style={{ color: '#fff' }}>{t}</Text>,
    },
    {
      title: 'Ghế', dataIndex: 'seats', key: 'seats', width: 80,
      render: (s) => <Tag>{s} ghế</Tag>,
    },
    {
      title: 'Tổng tiền', dataIndex: 'totalPrice', key: 'totalPrice',
      render: (p) => (
        <Text style={{ color: '#389e0d', fontWeight: 600 }}>
          {Number(p).toLocaleString('vi-VN')} ₫
        </Text>
      ),
    },
    {
      title: 'Trạng thái', dataIndex: 'status', key: 'status',
      render: (s) => {
        const cfg = STATUS_CONFIG[s] || STATUS_CONFIG.pending;
        return <Tag color={cfg.color} icon={cfg.icon}>{cfg.label}</Tag>;
      },
    },
    {
      title: 'Thời gian', dataIndex: 'createdAt', key: 'createdAt',
      render: (d) => new Date(d).toLocaleString('vi-VN'),
    },
  ];

  return (
    <>
      <div
        style={{
          marginBottom: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0 }}>
            <BookOutlined style={{ marginRight: 8 }} />
            Booking của tôi
          </Title>
          <Text type="secondary">🔄 Tự động cập nhật mỗi 3 giây · {bookings.length} booking</Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchBookings}>
            Làm mới
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/user/movies')}
          >
            Đặt vé mới
          </Button>
        </Space>
      </div>

      {!loading && bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<Text type="secondary">Bạn chưa có booking nào</Text>}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/user/movies')}
            >
              Đặt vé ngay
            </Button>
          </Empty>
        </div>
      ) : (
        <Card>
          <Table
            columns={columns}
            dataSource={bookings}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 15, showSizeChanger: false }}
          />
        </Card>
      )}
    </>
  );
}
