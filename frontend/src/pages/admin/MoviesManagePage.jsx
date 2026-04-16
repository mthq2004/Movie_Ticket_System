import { useState, useEffect } from 'react';
import {
  Table, Button, Modal, Form, Input, InputNumber, Select,
  Tag, Space, Typography, message, Tabs, Card, Popconfirm, Empty,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, VideoCameraOutlined, TagsOutlined,
} from '@ant-design/icons';
import API from '../../services/api';

const { Title, Text } = Typography;

export default function MoviesManagePage() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [movieModalOpen, setMovieModalOpen] = useState(false);
  const [genreModalOpen, setGenreModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [movieForm] = Form.useForm();
  const [genreForm] = Form.useForm();
  const [editingGenre, setEditingGenre] = useState(null); // Thêm state này

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [moviesRes, genresRes] = await Promise.all([
        API.get('/movies'),
        API.get('/genres'),
      ]);
      setMovies(moviesRes.data);
      setGenres(genresRes.data);
    } catch {
      message.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingMovie(null);
    movieForm.resetFields();
    setMovieModalOpen(true);
  };

  const handleOpenEdit = (movie) => {
    setEditingMovie(movie);
    movieForm.setFieldsValue({
      ...movie,
      price: Number(movie.price),
    });
    setMovieModalOpen(true);
  };

  const handleSaveMovie = async (values) => {
    setLoading(true); // Thêm loading khi đang call API
    try {
      if (editingMovie) {
        // Trường hợp UPDATE
        await API.patch(`/movies/${editingMovie.id}`, values);
        message.success('Cập nhật phim thành công!');
      } else {
        // Trường hợp CREATE mới
        await API.post('/movies', values);
        message.success('Thêm phim thành công!');
      }
      
      setMovieModalOpen(false);
      setEditingMovie(null); // Reset state sau khi xong
      fetchAll(); // Tải lại danh sách
    } catch (err) {
      message.error(err.response?.data?.message || 'Lỗi lưu thông tin phim');
    } finally {
      setLoading(false);
    }
  };

  // Sửa lại hàm đóng Modal để đảm bảo reset dữ liệu
  const closeMovieModal = () => {
    setMovieModalOpen(false);
    setEditingMovie(null);
    movieForm.resetFields();
  };

  const handleOpenAddGenre = () => {
    setEditingGenre(null);
    genreForm.resetFields();
    setGenreModalOpen(true);
  };

  // Mở modal để sửa
  const handleOpenEditGenre = (genre) => {
    setEditingGenre(genre);
    genreForm.setFieldsValue(genre); // Đổ dữ liệu vào form
    setGenreModalOpen(true);
  };

  const handleSaveGenre = async (values) => {
    setLoading(true);
    try {
      if (editingGenre) {
        // Trường hợp UPDATE Genre
        await API.patch(`/genres/${editingGenre.id}`, values);
        message.success('Cập nhật thể loại thành công!');
      } else {
        // Trường hợp CREATE Genre
        await API.post('/genres', values);
        message.success(`Đã thêm thể loại "${values.name}"`);
      }
      
      closeGenreModal();
      fetchAll();
    } catch (err) {
      message.error(err.response?.data?.message || 'Lỗi lưu thể loại');
    } finally {
      setLoading(false);
    }
  };

  const closeGenreModal = () => {
    setGenreModalOpen(false);
    setEditingGenre(null);
    genreForm.resetFields();
  };
  const handleAddGenre = async (values) => {
    try {
      await API.post('/genres', values);
      message.success(`Đã thêm thể loại "${values.name}"`);
      genreForm.resetFields();
      setGenreModalOpen(false);
      fetchAll();
    } catch (err) {
      message.error(err.response?.data?.message || 'Lỗi thêm thể loại');
    }
  };

  const handleDeleteGenre = async (id) => {
    try {
      await API.delete(`/genres/${id}`);
      message.success('Đã xóa thể loại');
      fetchAll();
    } catch {
      message.error('Lỗi xóa thể loại');
    }
  };

  const movieColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    {
      title: 'Tên phim', dataIndex: 'title', key: 'title',
      render: (t) => <Text strong>{t}</Text>,
    },
    {
      title: 'Thể loại', dataIndex: 'genre', key: 'genre',
      render: (g) => <Tag color="purple">{g}</Tag>,
    },
    {
      title: 'Thời lượng', dataIndex: 'duration', key: 'duration',
      render: (d) => `${d} phút`,
    },
    {
      title: 'Giá vé', dataIndex: 'price', key: 'price',
      render: (p) => <Text style={{ color: '#389e0d' }}>{Number(p).toLocaleString('vi-VN')} ₫</Text>,
    },
    {
      title: 'Ghế trống', dataIndex: 'availableSeats', key: 'availableSeats',
      render: (s) => (
        <Tag color={s > 20 ? 'green' : s > 0 ? 'orange' : 'red'}>{s} ghế</Tag>
      ),
    },
    {
      title: 'Thao tác', key: 'actions',
      render: (_, record) => (
        <Button icon={<EditOutlined />} size="small" onClick={() => handleOpenEdit(record)}>
          Sửa
        </Button>
      ),
    },
  ];

  // 1. Định nghĩa cột cho Table Thể loại
  const genreColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Tên thể loại',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Tag color="purple" style={{ fontSize: 13 }}>
          {text}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined style={{ color: '#1890ff' }} />}
            onClick={() => handleOpenEditGenre(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa thể loại này?"
            onConfirm={() => handleDeleteGenre(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const genreItems = [
    {
      key: 'movies',
      label: (
        <span><VideoCameraOutlined /> Quản lý Phim <Tag>{movies.length}</Tag></span>
      ),
      children: (
        <>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAdd}>
              Thêm phim mới
            </Button>
          </div>
          <Table
            columns={movieColumns}
            dataSource={movies}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10, showSizeChanger: true }}
            locale={{ emptyText: <Empty description="Chưa có phim nào" /> }}
          />
        </>
      ),
    },
    {
      key: 'genres',
      label: (
        <span><TagsOutlined /> Quản lý Thể loại <Tag>{genres.length}</Tag></span>
      ),
      children: (
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleOpenAddGenre}
            >
              Thêm thể loại
            </Button>
          </div>
          
          <Table
            columns={genreColumns}
            dataSource={genres}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 5 }}
            size="middle"
            locale={{ emptyText: <Empty description="Chưa có thể loại nào" /> }}
            // Đảm bảo bảng hiển thị đẹp trên nền trắng
            bordered
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          <VideoCameraOutlined style={{ marginRight: 8 }} />
          Quản lý Phim & Thể loại
        </Title>
        <Text type="secondary">Thêm, sửa phim và quản lý thể loại</Text>
      </div>

      <Card>
        <Tabs items={genreItems} />
      </Card>

     {/* Movie Add/Edit Modal */}
      <Modal
        title={editingMovie ? '✏️ Sửa thông tin phim' : '🎬 Thêm phim mới'}
        open={movieModalOpen}
        onCancel={closeMovieModal} // Dùng hàm close mới để reset
        footer={null}
        width={600}
        // Giữ nguyên style dark mode của Quân
        // styles={{ content: { background: '#1a1a1a' }, header: { background: '#1a1a1a' } }}
      >
        <Form 
          form={movieForm} 
          onFinish={handleSaveMovie} 
          layout="vertical" 
          style={{ marginTop: 16 }}
        >
          {/* Các Form.Item giữ nguyên như cũ */}
          <Form.Item name="title" label="Tên phim" rules={[{ required: true, message: 'Nhập tên phim!' }]}>
            <Input placeholder="VD: Avengers: Endgame" />
          </Form.Item>
          
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Mô tả nội dung phim..." />
          </Form.Item>

          <Form.Item name="genre" label="Thể loại" rules={[{ required: true, message: 'Chọn thể loại!' }]}>
            <Select placeholder="Chọn thể loại" showSearch>
              {genres.map((g) => (
                <Select.Option key={g.id} value={g.name}>{g.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name="duration" label="Thời lượng (phút)" rules={[{ required: true }]}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="price" label="Giá vé (VNĐ)" rules={[{ required: true }]}>
              <InputNumber min={0} step={10000} style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <Form.Item name="availableSeats" label="Số ghế" initialValue={100}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={closeMovieModal}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingMovie ? 'Cập nhật' : 'Thêm phim'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Genre Modal đã được sửa lại để hỗ trợ Update */}
      <Modal
        title={editingGenre ? '🏷️ Sửa thể loại' : '🏷️ Thêm thể loại mới'}
        open={genreModalOpen}
        onCancel={closeGenreModal}
        footer={null}
        styles={{ content: { background: 'white' }, header: { background: 'white' } }}
      >
        <Form 
          form={genreForm} 
          onFinish={handleSaveGenre} 
          layout="vertical" 
          style={{ marginTop: 16 }}
        >
          <Form.Item 
            name="name" 
            label="Tên thể loại" 
            rules={[{ required: true, message: 'Nhập tên thể loại!' }]}
          >
            <Input placeholder="VD: Hành động, Tình cảm..." />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={closeGenreModal}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingGenre ? 'Cập nhật' : 'Thêm'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
