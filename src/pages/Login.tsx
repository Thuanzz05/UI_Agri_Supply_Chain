import React from 'react';
import { Form, Input, Button, Select, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import type { LoginForm } from '../types/auth';
import { authService } from '../services/authService';
import './Login.css';

const { Title } = Typography;
const { Option } = Select;

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    try {
      const response = await authService.login(values);
      if (response.success) {
        message.success('Đăng nhập thành công!');
        // TODO: Redirect to dashboard based on user role
        console.log('User logged in:', response.user);
      }
    } catch (error: any) {
      message.error(error.message || 'Đăng nhập thất bại!');
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

          <Form.Item
            name="loaiTaiKhoan"
            rules={[{ required: true, message: 'Vui lòng chọn loại tài khoản!' }]}
          >
            <Select placeholder="Chọn loại tài khoản">
              <Option value="Admin">Quản trị viên</Option>
              <Option value="NongDan">Nông dân</Option>
              <Option value="DaiLy">Đại lý</Option>
              <Option value="SieuThi">Siêu thị</Option>
            </Select>
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