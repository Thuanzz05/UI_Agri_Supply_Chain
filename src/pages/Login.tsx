import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { authService, type LoginRequest } from '../services/authService';
import './Login.css';

const { Title } = Typography;

interface LoginFormData {
  tenDangNhap: string;
  matKhau: string;
}

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
        message.success('Đăng nhập thành công!');
        
        // Redirect based on user role - Admin goes to admin dashboard
        if (response.data.loaiTaiKhoan === 'Admin') {
          navigate('/admin/dashboard');
        } else {
          // Other roles can go to different dashboards later
          navigate('/admin/dashboard'); // For now, all go to admin dashboard
        }
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
      <Card className="login-card">
        <div className="login-header">
          <Title level={2}>Hệ thống Chuỗi Cung Ứng Nông Sản</Title>
          <Title level={4}>Đăng nhập</Title>
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

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<LoginOutlined />}
              block
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;