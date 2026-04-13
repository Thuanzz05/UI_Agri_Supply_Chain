import { ConfigProvider } from 'antd';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import viVN from 'antd/locale/vi_VN';
import HomePage from './pages/HomePage';
import About from './pages/About';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Reports from './pages/admin/Reports';
import DashboardNongDan from './pages/farmer/DashboardNongDan';
import QuanLySanPham from './pages/farmer/QuanLySanPham';
import QuanLyTrangTrai from './pages/farmer/QuanLyTrangTrai';
import QuanLyLoNongSan from './pages/farmer/QuanLyLoNongSan';
import DashboardDaiLy from './pages/agent/DashboardDaiLy';
import DashboardSieuThi from './pages/supermarket/DashboardSieuThi';
import ProtectedRoute from './components/ProtectedRoute';
import 'antd/dist/reset.css';

function App() {
  return (
    <ConfigProvider locale={viVN}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/reports" 
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/farmer/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardNongDan />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/farmer/products" 
            element={
              <ProtectedRoute>
                <QuanLySanPham />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/farmer/farms" 
            element={
              <ProtectedRoute>
                <QuanLyTrangTrai />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/farmer/batches" 
            element={
              <ProtectedRoute>
                <QuanLyLoNongSan />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/agent/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardDaiLy />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/supermarket/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardSieuThi />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
