import React from 'react';
import { Card, Form, Input, message, Avatar, Row, Col, Divider } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, HomeOutlined, SaveOutlined, FacebookOutlined } from '@ant-design/icons';
import { TikTokIcon } from '../../components/TikTokIcon';
import { AdminLayout } from '../../components/Layout';
import { authService } from '../../services/authService';
import { apiService } from '../../services/apiService';
import { ActionButton } from '../../components/ActionButton';
import { buildSocialUpdatePayload, getSocialLinks, validateOptionalSocialUrl } from '../../utils/socialLinks';

const ThongTinCaNhan: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState<any>(null);

  React.useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      setLoading(true);
      const user = authService.getStoredUser();
      
      if (!user?.maNongDan) {
        message.error('Không tìm thấy thông tin người dùng');
        return;
      }

      // Gọi API lấy thông tin nông dân
      const response = await apiService.getFarmerById(user.maNongDan);
      const data = response.data || response;
      const socialLinks = getSocialLinks(data);
      
      setUserInfo(data);
      form.setFieldsValue({
        hoTen: data.hoTen,
        soDienThoai: data.soDienThoai,
        email: data.email,
        diaChi: data.diaChi,
        facebook: socialLinks.facebook,
        tiktok: socialLinks.tiktok,
      });
    } catch (error: any) {
      console.error('Error loading user info:', error);
      message.error('Không thể tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const user = authService.getStoredUser();
      
      if (!user?.maNongDan) {
        message.error('Không tìm thấy thông tin người dùng');
        return;
      }

      await apiService.updateFarmerInfo(user.maNongDan, buildSocialUpdatePayload(values));
      message.success('Cập nhật thông tin thành công');
      loadUserInfo();
    } catch (error: any) {
      console.error('Error updating user info:', error);
      message.error('Không thể cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  const socialLinks = getSocialLinks(userInfo);

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Thông tin cá nhân</h1>
        <p>Quản lý thông tin tài khoản của bạn</p>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Avatar 
                size={120} 
                icon={<UserOutlined />}
                style={{ backgroundColor: '#52c41a', marginBottom: 20 }}
              />
              <h2 style={{ marginBottom: 8 }}>{userInfo?.hoTen || 'Chưa có tên'}</h2>
              <p style={{ color: '#8c8c8c', marginBottom: 4 }}>
                Mã nông dân: {userInfo?.maNongDan}
              </p>
              <p style={{ color: '#8c8c8c' }}>
                Tên đăng nhập: {userInfo?.tenDangNhap}
              </p>
            </div>
            
            <Divider />
            
            <div style={{ padding: '0 20px' }}>
              <div style={{ marginBottom: 16 }}>
                <PhoneOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                <span>{userInfo?.soDienThoai || 'Chưa cập nhật'}</span>
              </div>
              <div style={{ marginBottom: 16 }}>
                <MailOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                <span>{userInfo?.email || 'Chưa cập nhật'}</span>
              </div>
              <div style={{ marginBottom: 16 }}>
                <HomeOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                <span>{userInfo?.diaChi || 'Chưa cập nhật'}</span>
              </div>
              <div style={{ marginBottom: 16 }}>
                <FacebookOutlined style={{ marginRight: 8, color: '#1877F2' }} />
                {socialLinks.facebook ? (
                  <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                    {socialLinks.facebook}
                  </a>
                ) : (
                  <span style={{ color: '#8c8c8c' }}>Chưa cập nhật</span>
                )}
              </div>
              <div>
                <TikTokIcon style={{ marginRight: 8, color: '#000000' }} />
                {socialLinks.tiktok ? (
                  <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer">
                    {socialLinks.tiktok}
                  </a>
                ) : (
                  <span style={{ color: '#8c8c8c' }}>Chưa cập nhật</span>
                )}
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card title="Chỉnh sửa thông tin">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
            >
              <Form.Item
                label="Họ và tên"
                name="hoTen"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input 
                  prefix={<UserOutlined />}
                  placeholder="Nhập họ và tên"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="soDienThoai"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại!' },
                  { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
                ]}
              >
                <Input 
                  prefix={<PhoneOutlined />}
                  placeholder="Nhập số điện thoại"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              >
                <Input 
                  prefix={<MailOutlined />}
                  placeholder="Nhập email"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Địa chỉ"
                name="diaChi"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
              >
                <Input.TextArea 
                  placeholder="Nhập địa chỉ"
                  rows={3}
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Facebook"
                name="facebook"
                rules={[
                  { validator: validateOptionalSocialUrl }
                ]}
              >
                <Input 
                  prefix={<FacebookOutlined style={{ color: '#1877F2' }} />}
                  placeholder="https://facebook.com/..."
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="TikTok"
                name="tiktok"
                rules={[
                  { validator: validateOptionalSocialUrl }
                ]}
              >
                <Input 
                  prefix={<TikTokIcon />}
                  placeholder="https://tiktok.com/@..."
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <div style={{ width: '100%' }}>
                  <ActionButton
                    type="primary"
                    icon={<SaveOutlined />}
                    loading={loading}
                    onClick={() => form.submit()}
                  >
                    Lưu thay đổi
                  </ActionButton>
                </div>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </AdminLayout>
  );
};

export default ThongTinCaNhan;
