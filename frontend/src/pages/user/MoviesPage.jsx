import { useState, useEffect } from 'react';
import {
  Row, Col, Card, Tag, Button, Input, Select,
  Typography, Space, Empty, Spin, Badge,
} from 'antd';
import { SearchOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

const { Title, Text, Paragraph } = Typography;

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, genresRes] = await Promise.all([
          API.get('/movies'),
          API.get('/genres'),
        ]);
        setMovies(moviesRes.data);
        setGenres(genresRes.data);
      } catch {
        //
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = movies.filter((m) => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase());
    const matchGenre = !selectedGenre || m.genre === selectedGenre;
    return matchSearch && matchGenre;
  });

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">Đang tải danh sách phim...</Text>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          marginBottom: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0 }}>🎬 Danh sách phim</Title>
          <Text type="secondary">{filtered.length} phim đang chiếu</Text>
        </div>
        <Space wrap>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm phim..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 220 }}
            allowClear
          />
          <Select
            placeholder="Lọc thể loại"
            allowClear
            value={selectedGenre}
            onChange={setSelectedGenre}
            style={{ width: 160 }}
            options={genres.map((g) => ({ value: g.name, label: g.name }))}
          />
        </Space>
      </div>

      {filtered.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<Text type="secondary">Không tìm thấy phim phù hợp</Text>}
        />
      ) : (
        <Row gutter={[16, 16]}>
          {filtered.map((movie) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={movie.id}>
              <Card
                hoverable
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column' } }}
                cover={
                  <div
                    style={{
                      height: 90,
                      background: 'linear-gradient(135deg, #e0e7ff 0%, #ddd6fe 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 36,
                    }}
                  >
                    🎬
                  </div>
                }
              >
                <div style={{ flex: 1 }}>
                  <Space style={{ marginBottom: 8 }}>
                    <Tag color="purple">{movie.genre}</Tag>
                    {movie.availableSeats === 0 && <Tag color="red">Hết ghế</Tag>}
                  </Space>
                  <Title level={5} style={{ margin: '0 0 8px', lineHeight: 1.4 }}>
                    {movie.title}
                  </Title>
                  {movie.description && (
                    <Paragraph
                      type="secondary"
                      style={{ fontSize: 12, marginBottom: 12 }}
                      ellipsis={{ rows: 2 }}
                    >
                      {movie.description}
                    </Paragraph>
                  )}
                  <Space direction="vertical" size={4} style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text type="secondary" style={{ fontSize: 13 }}>⏱ {movie.duration} phút</Text>
                      <Text type="secondary" style={{ fontSize: 13 }}>
                        💺{' '}
                        <span style={{ color: movie.availableSeats > 10 ? '#389e0d' : '#d46b08' }}>
                          {movie.availableSeats}
                        </span>{' '}
                        ghế
                      </Text>
                    </div>
                    <Text style={{ color: '#389e0d', fontWeight: 700, fontSize: 15 }}>
                      {Number(movie.price).toLocaleString('vi-VN')} ₫
                    </Text>
                  </Space>
                </div>
                <Button
                  type="primary"
                  icon={<PlayCircleOutlined />}
                  block
                  style={{ marginTop: 16 }}
                  disabled={movie.availableSeats === 0}
                  onClick={() => navigate(`/user/booking/${movie.id}`)}
                >
                  {movie.availableSeats === 0 ? 'Hết ghế' : 'Đặt vé ngay'}
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
