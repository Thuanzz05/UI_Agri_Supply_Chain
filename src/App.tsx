import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { useState } from 'react';
import Login from './pages/Login';
import AppLayout from './components/Layout/AppLayout';
import Dashboard from './pages/Dashboard';
import { authService } from './services/authService';
import 'antd/dist/reset.css';

function App() {
  const [isAuthenticated] = useState(authService.isAuthenticated());
  const currentUser = authService.getCurrentUser();

  if (!isAuthenticated) {
    return (
      <ConfigProvider locale={viVN}>
        <Login />
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider locale={viVN}>
      <AppLayout userRole={currentUser?.loaiTaiKhoan}>
        <Dashboard />
      </AppLayout>
    </ConfigProvider>
  );
}

export default App;
