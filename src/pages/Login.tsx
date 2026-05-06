import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message, Select, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined, TeamOutlined } from '@ant-design/icons';
import { authService, normalizeRoleToBackend, normalizeUserRole, type LoginRequest } from '../services/authService';
import loginImage from '../assets/login.png';
import './Login.css';

const { Title, Text } = Typography;

interface LoginFormData {
  tenDangNhap: string;
  matKhau: string;
  loaiTaiKhoan: string;
}

interface ApiLoginData {
  maTaiKhoan?: number;
  MaTaiKhoan?: number;
  tenDangNhap?: string;
  TenDangNhap?: string;
  loaiTaiKhoan?: string;
  LoaiTaiKhoan?: string;
  maNongDan?: number;
  MaNongDan?: number;
  maDaiLy?: number;
  MaDaiLy?: number;
  maSieuThi?: number;
  MaSieuThi?: number;
}

const DASHBOARD_BY_ROLE: Record<string, string> = {
  Admin: '/admin/dashboard',
  Farmer: '/farmer/dashboard',
  Agent: '/agent/dashboard',
  Supermarket: '/supermarket/dashboard',
};

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: LoginFormData) => {
    setLoading(true);
    try {
      const loginData: LoginRequest = {
        TenDangNhap: values.tenDangNhap,
        MatKhau: values.matKhau
      };

      const response = await authService.login(loginData);
      
      if (response.success && response.data) {
        const apiData = response.data as ApiLoginData;
        const selectedRole = normalizeRoleToBackend(values.loaiTaiKhoan);
        const apiRoleRaw = apiData.loaiTaiKhoan || apiData.LoaiTaiKhoan;
        const apiRole = normalizeRoleToBackend(apiRoleRaw);

        if (!apiRole || selectedRole !== apiRole) {
          message.error('Loại tài khoản đã chọn không khớp với tài khoản đăng nhập!');
          authService.logout();
          return;
        }

        message.success('Đăng nhập thành công!');

        const appRole = normalizeUserRole(apiRole);
        const userData = {
          maTaiKhoan: apiData.maTaiKhoan ?? apiData.MaTaiKhoan,
          tenDangNhap: apiData.tenDangNhap ?? apiData.TenDangNhap,
          loaiTaiKhoan: appRole,
          maNongDan: apiData.maNongDan ?? apiData.MaNongDan,
          maDaiLy: apiData.maDaiLy ?? apiData.MaDaiLy,
          maSieuThi: apiData.maSieuThi ?? apiData.MaSieuThi
        };
        
        localStorage.setItem('user', JSON.stringify(userData));

        navigate(DASHBOARD_BY_ROLE[appRole] ?? '/login');
      } else {
        message.error(response.message || 'Đăng nhập thất bại!');
      }
    } catch (error: any) {
      message.error(error.message || 'Lỗi kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Row className="login-wrapper" gutter={0}>
        <Col xs={0} sm={0} md={12} className="login-image-col">
          <div className="login-image">
            <img 
              src={loginImage}
              alt="Agriculture" 
              className="image-content"
            />
          </div>
        </Col>
        
        <Col xs={24} sm={24} md={12} className="login-form-col">
          <Card className="login-card">
            <div className="login-header">
              <Title level={3}>Đăng nhập</Title>
              <Text type="secondary">Vui lòng nhập thông tin tài khoản của bạn</Text>
            </div>
            
            <Form
              form={form}
              name="login"
              onFinish={onFinish}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="tenDangNhap"
                rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Tên đăng nhập"
                />
              </Form.Item>

              <Form.Item
                name="matKhau"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Mật khẩu"
                />
              </Form.Item>

              <Form.Item
                name="loaiTaiKhoan"
                rules={[{ required: true, message: 'Vui lòng chọn loại tài khoản!' }]}
              >
                <Select
                  placeholder="Chọn loại tài khoản"
                  suffixIcon={<TeamOutlined />}
                  size="large"
                >
                  <Select.Option value="admin">Quản trị viên</Select.Option>
                  <Select.Option value="nongdan">Nông dân</Select.Option>
                  <Select.Option value="daily">Đại lý</Select.Option>
                  <Select.Option value="sieuthi">Siêu thị</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<LoginOutlined />}
                  block
                  size="large"
                >
                  Đăng nhập
                </Button>
              </Form.Item>

              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <Text type="secondary">Chưa có tài khoản? </Text>
                <Link to="/register" style={{ color: '#2E7D32', fontWeight: 600 }}>Đăng ký ngay</Link>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Login;