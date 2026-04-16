import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import AdminLayout from '../components/AdminLayout';
import UserLayout from '../components/UserLayout';
import MoviesManagePage from '../pages/admin/MoviesManagePage';
import BookingsManagePage from '../pages/admin/BookingsManagePage';
import UserMoviesPage from '../pages/user/MoviesPage';
import BookingPage from '../pages/user/BookingPage';
import MyBookingsPage from '../pages/user/MyBookingsPage';
import PrivateRoute from '../components/PrivateRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'admin',
        element: (
          <PrivateRoute requiredRole="admin">
            <AdminLayout />
          </PrivateRoute>
        ),
        children: [
          { index: true, element: <Navigate to="movies" replace /> },
          { path: 'movies', element: <MoviesManagePage /> },
          { path: 'bookings', element: <BookingsManagePage /> },
        ],
      },
      {
        path: 'user',
        element: (
          <PrivateRoute requiredRole="user">
            <UserLayout />
          </PrivateRoute>
        ),
        children: [
          { index: true, element: <Navigate to="movies" replace /> },
          { path: 'movies', element: <UserMoviesPage /> },
          { path: 'booking/:movieId', element: <BookingPage /> },
          { path: 'bookings', element: <MyBookingsPage /> },
        ],
      },
    ],
  },
]);

export default router;
