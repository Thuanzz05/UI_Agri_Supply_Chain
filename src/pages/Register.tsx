import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message, Select, Row, Col } from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  MailOutlined, 
  PhoneOutlined,
  TeamOutlined,
  UserAddOutlined 
} from '@ant-design/icons';
import { authService, type RegisterRequest } from '../services/authService';
import registerImage from '../assets/login.png';
import './Register.css';

const { Title, Text } = Typography;

interface RegisterFormData {
  tenDangNhap: string;
  matKhau: string;
  xacNhanMatKhau: string;
  email: string;
  loaiTaiKhoan: string;
  hoTen?: string;
  soDienThoai?: string;
  diaChi?: string;
}

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: RegisterFormData) => {
    setLoading(true);
    try {
      const registerData: RegisterRequest = {
        TenDangNhap: values.tenDangNhap,
        MatKhau: values.matKhau,
        Email: values.email,
        LoaiTaiKhoan: values.loaiTaiKhoan,
        HoTen: values.hoTen,
        SoDienThoai: values.soDienThoai,
        DiaChi: values.diaChi,
      };

      const response = await authService.register(registerData);
      
      if (response.success) {
        message.success('Đăng ký thành công! Vui lòng đăng nhập.');
        navigate('/login');
      } else {
        message.error(response.message || 'Đăng ký thất bại!');
      }
    } catch (error: any) {
      message.error(error.message || 'Đăng ký thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <Row className="register-wrapper" gutter={0}>
        <Col xs={0} sm={0} md={12} className="register-image-col">
          <div className="register-image">
            <img 
              src={registerImage}
              alt="Agriculture" 
              className="image-content"
            />
          </div>
        </Col>
        
        <Col xs={24} sm={24} md={12} className="register-form-col">
          <Card className="register-card">
            <div className="register-header">
              <Title level={3}>Đăng ký tài khoản</Title>
              <Text type="secondary">Tạo tài khoản mới để bắt đầu</Text>
            </div>
            
            <Form
              form={form}
              name="register"
              onFinish={onFinish}
              layout="vertical"
              size="large"
              scrollToFirstError
            >
              <Form.Item
                name="loaiTaiKhoan"
                label="Loại tài khoản"
                rules={[{ required: true, message: 'Vui lòng chọn loại tài khoản!' }]}
              >
                <Select
                  placeholder="Chọn loại tài khoản"
                  suffixIcon={<TeamOutlined />}
                >
                  <Select.Option value="nongdan">Nông dân</Select.Option>
                  <Select.Option value="daily">Đại lý</Select.Option>
                  <Select.Option value="sieuthi">Siêu thị</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="tenDangNhap"
                label="Tên đăng nhập"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                  { min: 4, message: 'Tên đăng nhập phải có ít nhất 4 ký tự!' },
                  { pattern: /^[a-zA-Z0-9_]+$/, message: 'Tên đăng nhập chỉ chứa chữ, số và dấu gạch dưới!' }
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Tên đăng nhập"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Email"
                />
              </Form.Item>

              <Form.Item
                name="matKhau"
                label="Mật khẩu"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                ]}
                hasFeedback
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Mật khẩu"
                />
              </Form.Item>

              <Form.Item
                name="xacNhanMatKhau"
                label="Xác nhận mật khẩu"
                dependencies={['matKhau']}
                hasFeedback
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('matKhau') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Xác nhận mật khẩu"
                />
              </Form.Item>

              <Form.Item
                name="hoTen"
                label="Họ và tên"
                rules={[
                  { required: true, message: 'Vui lòng nhập họ và tên!' },
                  { min: 3, message: 'Họ và tên phải có ít nhất 3 ký tự!' }
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Họ và tên"
                />
              </Form.Item>

              <Form.Item
                name="soDienThoai"
                label="Số điện thoại"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại!' },
                  { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số!' }
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Số điện thoại"
                />
              </Form.Item>

              <Form.Item
                name="diaChi"
                label="Địa chỉ"
                rules={[
                  { required: true, message: 'Vui lòng nhập địa chỉ!' }
                ]}
              >
                <Input.TextArea
                  placeholder="Địa chỉ"
                  rows={2}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<UserAddOutlined />}
                  block
                  size="large"
                >
                  Đăng ký
                </Button>
              </Form.Item>

              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <Text type="secondary">Đã có tài khoản? </Text>
                <Link to="/login" style={{ color: '#2E7D32', fontWeight: 600 }}>Đăng nhập ngay</Link>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
