import { ConfigProvider } from 'antd';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import viVN from 'antd/locale/vi_VN';
import HomePage from './pages/HomePage';
import About from './pages/About';
import Contact from './pages/Contact';
import Guide from './pages/Guide';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import QuanLyKho from './pages/DaiLy/QuanLyKho';
import DonHangMuaVao from './pages/DaiLy/DonHangMuaVao';
import DonHangBanRa from './pages/DaiLy/DonHangBanRa';
import KiemDinhChatLuong from './pages/DaiLy/KiemDinhChatLuong';
import QuanLyVanChuyen from './pages/DaiLy/QuanLyVanChuyen';
import ThongTinCaNhanDaiLy from './pages/DaiLy/ThongTinCaNhan';
import DashboardNongDan from './pages/NongDan/DashboardNongDan';
import QuanLySanPham from './pages/NongDan/QuanLySanPham';
import QuanLyTrangTrai from './pages/NongDan/QuanLyTrangTrai';
import QuanLyLoNongSan from './pages/NongDan/QuanLyLoNongSan';
import QuanLyDonHangNongDan from './pages/NongDan/QuanLyDonHang';
import ThongTinCaNhanNongDan from './pages/NongDan/ThongTinCaNhan';
import DashboardDaiLy from './pages/DaiLy/DashboardDaiLy';
import TonKhoDaiLy from './pages/DaiLy/TonKhoDaiLy';
import DashboardSieuThi from './pages/SieuThi/DashboardSieuThi';
import QuanLyDonHangSieuThi from './pages/SieuThi/QuanLyDonHang';
import QuanLyKhoSieuThi from './pages/SieuThi/QuanLyKho';
import ThongTinCaNhanSieuThi from './pages/SieuThi/ThongTinCaNhan';
import TruyXuatNguonGoc from './pages/SieuThi/TruyXuatNguonGoc';
import QuanLyNguoiDung from './pages/admin/QuanLyNguoiDung';
import QuanLyTaiKhoan from './pages/admin/QuanLyTaiKhoan';
import TinNhan from './pages/Chat/TinNhan';
import ProtectedRoute from './components/ProtectedRoute';
import 'antd/dist/reset.css';

function App() {
  return (
    <ConfigProvider locale={viVN}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <Users />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/quan-ly-nguoi-dung" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <QuanLyNguoiDung />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/quan-ly-tai-khoan" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <QuanLyTaiKhoan />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/farmer/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Farmer']}>
                <DashboardNongDan />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/farmer/products" 
            element={
              <ProtectedRoute allowedRoles={['Farmer']}>
                <QuanLySanPham />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/farmer/farms" 
            element={
              <ProtectedRoute allowedRoles={['Farmer']}>
                <QuanLyTrangTrai />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/farmer/batches" 
            element={
              <ProtectedRoute allowedRoles={['Farmer']}>
                <QuanLyLoNongSan />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/farmer/orders" 
            element={
              <ProtectedRoute allowedRoles={['Farmer']}>
                <QuanLyDonHangNongDan />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/farmer/profile" 
            element={
              <ProtectedRoute allowedRoles={['Farmer']}>
                <ThongTinCaNhanNongDan />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/farmer/messages" 
            element={
              <ProtectedRoute allowedRoles={['Farmer']}>
                <TinNhan />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/agent/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Agent']}>
                <DashboardDaiLy />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/agent/warehouses" 
            element={
              <ProtectedRoute allowedRoles={['Agent']}>
                <QuanLyKho />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/agent/inventory" 
            element={
              <ProtectedRoute allowedRoles={['Agent']}>
                <TonKhoDaiLy />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/agent/orders-in" 
            element={
              <ProtectedRoute allowedRoles={['Agent']}>
                <DonHangMuaVao />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/agent/orders-out" 
            element={
              <ProtectedRoute allowedRoles={['Agent']}>
                <DonHangBanRa />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/agent/quality-check" 
            element={
              <ProtectedRoute allowedRoles={['Agent']}>
                <KiemDinhChatLuong />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/agent/transport" 
            element={
              <ProtectedRoute allowedRoles={['Agent']}>
                <QuanLyVanChuyen />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/agent/profile" 
            element={
              <ProtectedRoute allowedRoles={['Agent']}>
                <ThongTinCaNhanDaiLy />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/agent/messages" 
            element={
              <ProtectedRoute allowedRoles={['Agent']}>
                <TinNhan />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/supermarket/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Supermarket']}>
                <DashboardSieuThi />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/supermarket/orders" 
            element={
              <ProtectedRoute allowedRoles={['Supermarket']}>
                <QuanLyDonHangSieuThi />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/supermarket/warehouses" 
            element={
              <ProtectedRoute allowedRoles={['Supermarket']}>
                <QuanLyKhoSieuThi />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/supermarket/traceability" 
            element={
              <ProtectedRoute allowedRoles={['Supermarket']}>
                <TruyXuatNguonGoc />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/supermarket/profile" 
            element={
              <ProtectedRoute allowedRoles={['Supermarket']}>
                <ThongTinCaNhanSieuThi />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/supermarket/messages" 
            element={
              <ProtectedRoute allowedRoles={['Supermarket']}>
                <TinNhan />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Farmer', 'Agent', 'Supermarket']}>
                <TinNhan />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
