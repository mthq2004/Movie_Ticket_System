import { useState, useEffect } from 'react';
import { Table, Tag, Typography, Button, Card, Space, Statistic, Row, Col } from 'antd';
import { BookOutlined, ReloadOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import API from '../../services/api';

const { Title, Text } = Typography;

const STATUS_COLOR = { pending: 'gold', confirmed: 'green', failed: 'red' };
const STATUS_LABEL = { pending: 'Đang xử lý', confirmed: 'Thành công', failed: 'Thất bại' };
const STATUS_ICON = {
  pending: <ClockCircleOutlined />,
  confirmed: <CheckCircleOutlined />,
  failed: <CloseCircleOutlined />,
};

export default function BookingsManagePage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await API.get('/bookings');
      setBookings(res.data);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    failed: bookings.filter((b) => b.status === 'failed').length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    revenue: bookings
      .filter((b) => b.status === 'confirmed')
      .reduce((sum, b) => sum + Number(b.totalPrice), 0),
  };

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', width: 60 },
    {
      title: 'Người dùng', dataIndex: 'username', key: 'username',
      render: (u) => <Text strong>{u}</Text>,
    },
    {
      title: 'Phim', dataIndex: 'movieTitle', key: 'movieTitle',
      render: (t) => <Text>{t}</Text>,
    },
    {
      title: 'Ghế', dataIndex: 'seats', key: 'seats', width: 70,
      render: (s) => <Tag>{s} ghế</Tag>,
    },
    {
      title: 'Tổng tiền', dataIndex: 'totalPrice', key: 'totalPrice',
      render: (p) => <Text style={{ color: '#389e0d', fontWeight: 600 }}>{Number(p).toLocaleString('vi-VN')} ₫</Text>,
    },
    {
      title: 'Trạng thái', dataIndex: 'status', key: 'status',
      filters: [
        { text: 'Đang xử lý', value: 'pending' },
        { text: 'Thành công', value: 'confirmed' },
        { text: 'Thất bại', value: 'failed' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (s) => (
        <Tag color={STATUS_COLOR[s]} icon={STATUS_ICON[s]}>{STATUS_LABEL[s]}</Tag>
      ),
    },
    {
      title: 'Thời gian', dataIndex: 'createdAt', key: 'createdAt',
      render: (d) => new Date(d).toLocaleString('vi-VN'),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            <BookOutlined style={{ marginRight: 8 }} />
            Quản lý Booking
          </Title>
          <Text type="secondary">Tự động cập nhật mỗi 5 giây</Text>
        </div>
        <Button icon={<ReloadOutlined />} onClick={fetchBookings}>
          Làm mới
        </Button>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card bordered style={{ background: '#f6ffed' }}>
            <Statistic title="Tổng booking" value={stats.total} valueStyle={{ color: '#1a1a1a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered style={{ background: '#f6ffed' }}>
            <Statistic title="Thành công" value={stats.confirmed} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered style={{ background: '#fff2f0' }}>
            <Statistic title="Thất bại" value={stats.failed} valueStyle={{ color: '#ff4d4f' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered style={{ background: '#f0f5ff' }}>
            <Statistic
              title="Doanh thu"
              value={stats.revenue}
              suffix="₫"
              formatter={(v) => Number(v).toLocaleString('vi-VN')}
              valueStyle={{ color: '#4f46e5', fontSize: 18, fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={bookings}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 15, showSizeChanger: true }}
        />
      </Card>
    </>
  );
}
