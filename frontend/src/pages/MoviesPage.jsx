import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: '',
    description: '',
    genre: '',
    duration: '',
    price: '',
  });
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await API.get('/movies');
      setMovies(res.data);
    } catch {
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      await API.post('/movies', {
        ...newMovie,
        duration: Number(newMovie.duration),
        price: Number(newMovie.price),
      });
      setShowForm(false);
      setNewMovie({ title: '', description: '', genre: '', duration: '', price: '' });
      fetchMovies();
    } catch (err) {
      alert(err.response?.data?.message || 'Thêm phim thất bại');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-purple-400">🎬 Movie Ticket System</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">Xin chào, <span className="text-white font-semibold">{username}</span></span>
          <button
            onClick={() => navigate('/bookings')}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded-lg transition"
          >
            📋 Bookings
          </button>
          <button
            onClick={handleLogout}
            className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-1.5 rounded-lg transition"
          >
            Đăng xuất
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Danh sách phim</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            {showForm ? '✕ Đóng' : '+ Thêm phim'}
          </button>
        </div>

        {/* Form thêm phim */}
        {showForm && (
          <form
            onSubmit={handleAddMovie}
            className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6 grid grid-cols-2 gap-4"
          >
            <div className="col-span-2">
              <label className="text-gray-400 text-sm">Tên phim</label>
              <input
                required
                value={newMovie.title}
                onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="col-span-2">
              <label className="text-gray-400 text-sm">Mô tả</label>
              <input
                value={newMovie.description}
                onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
                className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Thể loại</label>
              <input
                required
                value={newMovie.genre}
                onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
                className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Thời lượng (phút)</label>
              <input
                required
                type="number"
                value={newMovie.duration}
                onChange={(e) => setNewMovie({ ...newMovie, duration: e.target.value })}
                className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Giá vé (VNĐ)</label>
              <input
                required
                type="number"
                value={newMovie.price}
                onChange={(e) => setNewMovie({ ...newMovie, price: e.target.value })}
                className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="col-span-2 flex justify-end">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
              >
                Lưu phim
              </button>
            </div>
          </form>
        )}

        {/* Danh sách phim */}
        {loading ? (
          <p className="text-gray-400 text-center py-12">Đang tải...</p>
        ) : movies.length === 0 ? (
          <p className="text-gray-500 text-center py-12">Chưa có phim nào. Hãy thêm phim!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onBook={() => navigate(`/booking/${movie.id}`)} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function MovieCard({ movie, onBook }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-purple-700 transition">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-white">{movie.title}</h3>
        <span className="bg-purple-900/50 text-purple-300 text-xs px-2 py-0.5 rounded-full">{movie.genre}</span>
      </div>
      {movie.description && (
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{movie.description}</p>
      )}
      <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
        <span>⏱ {movie.duration} phút</span>
        <span>💺 {movie.availableSeats} ghế</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-green-400 font-bold">{Number(movie.price).toLocaleString('vi-VN')} VNĐ</span>
        <button
          onClick={onBook}
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-1.5 rounded-lg transition"
        >
          Đặt vé
        </button>
      </div>
    </div>
  );
}
