import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function BookingPage() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    API.get('/movies').then((res) => {
      const found = res.data.find((m) => m.id === Number(movieId));
      setMovie(found || null);
    });
  }, [movieId]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!movie) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await API.post('/bookings', {
        userId: Number(userId),
        username,
        movieId: movie.id,
        movieTitle: movie.title,
        seats: Number(seats),
        totalPrice: Number(movie.price) * Number(seats),
      });
      setResult({
        type: 'success',
        message: `✅ Đặt vé thành công! Booking #${res.data.id} đang chờ xử lý thanh toán...`,
        booking: res.data,
      });
    } catch (err) {
      setResult({
        type: 'error',
        message: err.response?.data?.message || 'Đặt vé thất bại',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">
        Đang tải thông tin phim...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl p-8">
        <button
          onClick={() => navigate('/movies')}
          className="text-gray-400 hover:text-white text-sm mb-6 flex items-center gap-1"
        >
          ← Quay lại
        </button>

        <h1 className="text-2xl font-bold mb-1">🎟 Đặt vé</h1>
        <p className="text-gray-400 text-sm mb-6">Điền thông tin để đặt vé xem phim</p>

        {/* Movie info */}
        <div className="bg-gray-800 rounded-xl p-4 mb-6 border border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-bold text-lg">{movie.title}</h2>
              <p className="text-gray-400 text-sm">{movie.genre} · {movie.duration} phút</p>
            </div>
            <span className="text-green-400 font-bold">{Number(movie.price).toLocaleString('vi-VN')} VNĐ/ghế</span>
          </div>
        </div>

        <form onSubmit={handleBook} className="space-y-4">
          <div>
            <label className="text-gray-300 text-sm block mb-1">Số ghế</label>
            <input
              type="number"
              min={1}
              max={movie.availableSeats}
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
            />
            <p className="text-gray-500 text-xs mt-1">Còn {movie.availableSeats} ghế trống</p>
          </div>

          <div className="bg-gray-800 rounded-lg px-4 py-3 flex justify-between items-center">
            <span className="text-gray-400">Tổng tiền:</span>
            <span className="text-yellow-400 font-bold text-lg">
              {(Number(movie.price) * Number(seats)).toLocaleString('vi-VN')} VNĐ
            </span>
          </div>

          {result && (
            <div
              className={`rounded-lg px-4 py-3 text-sm border ${
                result.type === 'success'
                  ? 'bg-green-900/40 border-green-700 text-green-300'
                  : 'bg-red-900/40 border-red-700 text-red-300'
              }`}
            >
              {result.message}
              {result.type === 'success' && (
                <p className="mt-1 text-green-400/70 text-xs">
                  📡 Event BOOKING_CREATED đã được publish lên Redis. Payment Service đang xử lý...
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? 'Đang xử lý...' : '🎟 Xác nhận đặt vé'}
          </button>
        </form>

        {result?.type === 'success' && (
          <button
            onClick={() => navigate('/bookings')}
            className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition text-sm"
          >
            📋 Xem trạng thái booking
          </button>
        )}
      </div>
    </div>
  );
}
