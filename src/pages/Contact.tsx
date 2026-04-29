import React from 'react';
import { Card, Row, Col, Typography, Form, Input, Button } from 'antd';
import { PhoneOutlined, MailOutlined, SendOutlined } from '@ant-design/icons';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './Contact.css';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const Contact: React.FC = () => {
  const [form] = Form.useForm();

  return (
    <div className="contact-page">
      <Header />
      
      <div className="contact-container">
        {/* Header Section */}
        <div className="contact-header">
          <Title level={1}>Liên hệ với chúng tôi</Title>
          <Paragraph className="contact-subtitle">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ với chúng tôi qua các thông tin dưới đây.
          </Paragraph>
        </div>

        {/* Contact Info Cards */}
        <Row gutter={[24, 24]} className="contact-info-section">
          <Col xs={24} sm={12}>
            <Card className="contact-info-card">
              <div className="contact-info-content">
                <div className="contact-icon-wrapper">
                  <PhoneOutlined className="contact-icon" />
                </div>
                <div className="contact-info-text">
                  <Text className="contact-label">Số điện thoại</Text>
                  <Text className="contact-value">0329649661</Text>
                </div>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} sm={12}>
            <Card className="contact-info-card">
              <div className="contact-info-content">
                <div className="contact-icon-wrapper">
                  <MailOutlined className="contact-icon" />
                </div>
                <div className="contact-info-text">
                  <Text className="contact-label">Email</Text>
                  <Text className="contact-value">thuantoppo@gmail.com</Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Row justify="center">
          {/* Contact Form */}
          <Col xs={24} lg={16} xl={12}>
            <Card className="contact-form-card">
              <div className="form-header">
                <Title level={2}>Gửi tin nhắn</Title>
                <Paragraph>Điền thông tin bên dưới và chúng tôi sẽ liên hệ lại với bạn sớm nhất.</Paragraph>
              </div>
              
              <Form
                form={form}
                layout="vertical"
                className="contact-form"
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Họ và tên"
                      name="name"
                      rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                    >
                      <Input placeholder="Nhập họ và tên" size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Email không hợp lệ!' }
                      ]}
                    >
                      <Input placeholder="Nhập email" size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                    { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại" size="large" />
                </Form.Item>

                <Form.Item
                  label="Chủ đề"
                  name="subject"
                  rules={[{ required: true, message: 'Vui lòng nhập chủ đề!' }]}
                >
                  <Input placeholder="Nhập chủ đề" size="large" />
                </Form.Item>

                <Form.Item
                  label="Nội dung"
                  name="message"
                  rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                >
                  <TextArea 
                    rows={5} 
                    placeholder="Nhập nội dung tin nhắn..."
                    size="large"
                  />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    icon={<SendOutlined />}
                    size="large"
                    className="submit-button"
                    block
                  >
                    Gửi tin nhắn
                  </Button>
                </Form.Item>

              </Form>
            </Card>
          </Col>
        </Row>
      </div>
      
      <Footer />
    </div>
  );
};

export default Contact;