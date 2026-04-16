import { Outlet } from 'react-router-dom';
import { ConfigProvider } from 'antd';

export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#4f46e5',
          borderRadius: 6,
          fontFamily: "'Segoe UI', system-ui, sans-serif",
          colorBgContainer: '#ffffff',
          colorBgLayout: '#f5f6fa',
        },
      }}
    >
      <Outlet />
    </ConfigProvider>
  );
}



