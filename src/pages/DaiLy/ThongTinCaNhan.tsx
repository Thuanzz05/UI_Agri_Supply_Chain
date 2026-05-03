import React from 'react';
import { Card, Form, Input, message, Avatar, Row, Col, Divider, Upload } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { PhoneOutlined, MailOutlined, HomeOutlined, SaveOutlined, ShopOutlined, FacebookOutlined, CameraOutlined } from '@ant-design/icons';
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
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);
  const [imageBase64, setImageBase64] = React.useState<string>('');

  React.useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      setLoading(true);
      const user = authService.getStoredUser();
      
      if (!user?.maDaiLy) {
        message.error('Không tìm thấy thông tin người dùng');
        return;
      }

      // Gọi API lấy thông tin đại lý
      const response = await apiService.getAgentById(user.maDaiLy);
      const data = response.data || response;
      const socialLinks = getSocialLinks(data);
      
      setUserInfo(data);
      setImageBase64(data.anhDaiDien || '');
      
      if (data.anhDaiDien) {
        setFileList([{
          uid: '-1',
          name: 'avatar.png',
          status: 'done',
          url: data.anhDaiDien,
        }]);
      }
      
      form.setFieldsValue({
        tenDaiLy: data.tenDaiLy,
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

  const handleUploadChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const file = newFileList[0].originFileObj;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageBase64(reader.result as string);
      };
    } else if (newFileList.length === 0) {
      setImageBase64('');
    }
  };

  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/gif' || file.type === 'image/webp';
    if (!isJpgOrPng) {
      message.error('Chỉ được tải lên file ảnh (JPG, PNG, GIF, WEBP)!');
      return Upload.LIST_IGNORE;
    }
    
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Ảnh phải nhỏ hơn 5MB!');
      return Upload.LIST_IGNORE;
    }
    
    return false;
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const user = authService.getStoredUser();
      
      if (!user?.maDaiLy) {
        message.error('Không tìm thấy thông tin người dùng');
        return;
      }

      const updateData = {
        ...buildSocialUpdatePayload(values),
        anhDaiDien: imageBase64 || null
      };

      await apiService.updateAgentInfo(user.maDaiLy, updateData);
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
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <Avatar 
                  size={120} 
                  icon={<ShopOutlined />}
                  src={imageBase64 || userInfo?.anhDaiDien}
                  style={{ backgroundColor: imageBase64 || userInfo?.anhDaiDien ? 'transparent' : '#1890ff', marginBottom: 20 }}
                />
                <Upload
                  listType="picture"
                  fileList={[]}
                  onChange={handleUploadChange}
                  beforeUpload={beforeUpload}
                  maxCount={1}
                  accept="image/*"
                  showUploadList={false}
                >
                  <div style={{
                    position: 'absolute',
                    bottom: 20,
                    right: 0,
                    background: '#1890ff',
                    borderRadius: '50%',
                    width: 36,
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: '3px solid white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}>
                    <CameraOutlined style={{ color: 'white', fontSize: 16 }} />
                  </div>
                </Upload>
              </div>
              <h2 style={{ marginBottom: 8 }}>{userInfo?.tenDaiLy || 'Chưa có tên'}</h2>
              <p style={{ color: '#8c8c8c', marginBottom: 4 }}>
                Mã đại lý: {userInfo?.maDaiLy}
              </p>
              <p style={{ color: '#8c8c8c' }}>
                Tên đăng nhập: {userInfo?.tenDangNhap}
              </p>
            </div>
            
            <Divider />
            
            <div style={{ padding: '0 20px' }}>
              <div style={{ marginBottom: 16 }}>
                <PhoneOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                <span>{userInfo?.soDienThoai || 'Chưa cập nhật'}</span>
              </div>
              <div style={{ marginBottom: 16 }}>
                <MailOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                <span>{userInfo?.email || 'Chưa cập nhật'}</span>
              </div>
              <div style={{ marginBottom: 16 }}>
                <HomeOutlined style={{ marginRight: 8, color: '#1890ff' }} />
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
                label="Tên đại lý"
                name="tenDaiLy"
                rules={[{ required: true, message: 'Vui lòng nhập tên đại lý!' }]}
              >
                <Input 
                  prefix={<ShopOutlined />}
                  placeholder="Nhập tên đại lý"
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
