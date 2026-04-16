import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const STATUS_COLORS = {
  pending: 'bg-yellow-900/40 text-yellow-300 border-yellow-700',
  confirmed: 'bg-green-900/40 text-green-300 border-green-700',
  failed: 'bg-red-900/40 text-red-300 border-red-700',
};

const STATUS_LABEL = {
  pending: '⏳ Đang xử lý',
  confirmed: '✅ Thành công',
  failed: '❌ Thất bại',
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    fetchBookings();
    // Tự động refresh mỗi 3 giây để thấy cập nhật trạng thái
    const interval = setInterval(fetchBookings, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await API.get('/bookings');
      setBookings(res.data);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-purple-400">📋 Lịch sử Booking</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/movies')}
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-1.5 rounded-lg transition"
          >
            🎬 Danh sách phim
          </button>
          <button
            onClick={() => { localStorage.clear(); navigate('/login'); }}
            className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-1.5 rounded-lg transition"
          >
            Đăng xuất
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-gray-400 text-sm">🔄 Tự động cập nhật mỗi 3 giây</span>
        </div>

        {loading ? (
          <p className="text-gray-400 text-center py-12">Đang tải...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-500 text-center py-12">Chưa có booking nào.</p>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <div key={b.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-bold">Booking #{b.id}</span>
                      <span className={`text-xs border rounded-full px-2 py-0.5 ${STATUS_COLORS[b.status]}`}>
                        {STATUS_LABEL[b.status]}
                      </span>
                    </div>
                    <p className="text-gray-300 font-medium">{b.movieTitle}</p>
                    <p className="text-gray-400 text-sm mt-1">
                      👤 {b.username} · 💺 {b.seats} ghế
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-400 font-bold">{Number(b.totalPrice).toLocaleString('vi-VN')} VNĐ</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(b.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>

                {b.status === 'pending' && (
                  <p className="text-yellow-400/60 text-xs mt-3 border-t border-gray-800 pt-3">
                    📡 Event đã publish → Payment Service đang xử lý...
                  </p>
                )}
                {b.status === 'confirmed' && (
                  <p className="text-green-400/60 text-xs mt-3 border-t border-gray-800 pt-3">
                    🎉 PAYMENT_COMPLETED — Notification đã được gửi!
                  </p>
                )}
                {b.status === 'failed' && (
                  <p className="text-red-400/60 text-xs mt-3 border-t border-gray-800 pt-3">
                    💔 BOOKING_FAILED — Thanh toán không thành công.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
