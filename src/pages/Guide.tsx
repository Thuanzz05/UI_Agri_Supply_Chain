import React from 'react';
import { Card, Typography, Steps, Collapse, Timeline } from 'antd';
import { 
  UserOutlined, 
  ShopOutlined, 
  ShoppingCartOutlined,
  CheckCircleOutlined,
  TruckOutlined,
  SafetyCertificateOutlined,
  BarChartOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './Guide.css';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const Guide: React.FC = () => {
  const nongDanSteps = [
    {
      title: 'Đăng ký tài khoản',
      description: 'Tạo tài khoản nông dân với thông tin cá nhân',
      icon: <UserOutlined />
    },
    {
      title: 'Quản lý lô nông sản',
      description: 'Thêm, sửa, xóa thông tin lô nông sản của bạn',
      icon: <FileTextOutlined />
    },
    {
      title: 'Nhận đơn hàng',
      description: 'Xem và xử lý đơn hàng từ đại lý',
      icon: <ShoppingCartOutlined />
    },
    {
      title: 'Xác nhận giao hàng',
      description: 'Xác nhận hoàn thành đơn hàng và cập nhật tồn kho',
      icon: <CheckCircleOutlined />
    }
  ];

  const daiLySteps = [
    {
      title: 'Đăng ký tài khoản',
      description: 'Tạo tài khoản đại lý với thông tin doanh nghiệp',
      icon: <ShopOutlined />
    },
    {
      title: 'Tạo đơn hàng mua vào',
      description: 'Đặt hàng từ nông dân với lô nông sản có sẵn',
      icon: <ShoppingCartOutlined />
    },
    {
      title: 'Kiểm định chất lượng',
      description: 'Kiểm tra và đánh giá chất lượng lô hàng nhận được',
      icon: <SafetyCertificateOutlined />
    },
    {
      title: 'Quản lý vận chuyển',
      description: 'Theo dõi và quản lý quá trình vận chuyển hàng hóa',
      icon: <TruckOutlined />
    },
    {
      title: 'Bán hàng cho siêu thị',
      description: 'Nhận và xử lý đơn hàng từ siêu thị',
      icon: <BarChartOutlined />
    }
  ];

  const sieuThiSteps = [
    {
      title: 'Đăng ký tài khoản',
      description: 'Tạo tài khoản siêu thị với thông tin doanh nghiệp',
      icon: <ShopOutlined />
    },
    {
      title: 'Đặt hàng từ đại lý',
      description: 'Tạo đơn hàng mua nông sản từ đại lý',
      icon: <ShoppingCartOutlined />
    },
    {
      title: 'Quản lý kho hàng',
      description: 'Theo dõi tồn kho và quản lý hàng hóa',
      icon: <BarChartOutlined />
    },
    {
      title: 'Truy xuất nguồn gốc',
      description: 'Kiểm tra thông tin nguồn gốc nông sản',
      icon: <SafetyCertificateOutlined />
    }
  ];

  return (
    <div className="guide-page">
      <Header />
      
      <div className="guide-container">
        {/* Header Section */}
        <div className="guide-header">
          <Title level={1}>Hướng dẫn sử dụng</Title>
          <Paragraph className="guide-subtitle">
            Tìm hiểu cách sử dụng hệ thống quản lý chuỗi cung ứng nông sản một cách hiệu quả
          </Paragraph>
        </div>

        {/* User Guides */}
        <div className="user-guides-section">
          <Title level={2} style={{ textAlign: 'center', marginBottom: '40px', color: '#fff' }}>
            Hướng dẫn theo vai trò
          </Title>
          
          <Collapse 
            defaultActiveKey={['1']} 
            size="large"
            className="guide-collapse"
          >
            <Panel 
              header={
                <div className="panel-header">
                  <UserOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                  <span>Hướng dẫn cho Nông dân</span>
                </div>
              } 
              key="1"
            >
              <div className="video-container">
                <iframe
                  width="100%"
                  height="400"
                  src="https://www.youtube.com/embed/Pb-YTS1eO54"
                  title="Hướng dẫn cho Nông dân"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <Steps
                direction="vertical"
                current={-1}
                items={nongDanSteps}
                className="guide-steps"
              />
            </Panel>
            
            <Panel 
              header={
                <div className="panel-header">
                  <ShopOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                  <span>Hướng dẫn cho Đại lý</span>
                </div>
              } 
              key="2"
            >
              <div className="video-container">
                <iframe
                  width="100%"
                  height="400"
                  src="https://www.youtube.com/embed/Pb-YTS1eO54"
                  title="Hướng dẫn cho Đại lý"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <Steps
                direction="vertical"
                current={-1}
                items={daiLySteps}
                className="guide-steps"
              />
            </Panel>
            
            <Panel 
              header={
                <div className="panel-header">
                  <ShoppingCartOutlined style={{ marginRight: '8px', color: '#fa8c16' }} />
                  <span>Hướng dẫn cho Siêu thị</span>
                </div>
              } 
              key="3"
            >
              <div className="video-container">
                <iframe
                  width="100%"
                  height="400"
                  src="https://www.youtube.com/embed/Pb-YTS1eO54"
                  title="Hướng dẫn cho Siêu thị"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <Steps
                direction="vertical"
                current={-1}
                items={sieuThiSteps}
                className="guide-steps"
              />
            </Panel>
          </Collapse>
        </div>

        {/* Process Flow */}
        <div className="process-section">
          <Title level={2} style={{ textAlign: 'center', marginBottom: '40px', color: '#fff' }}>
            Quy trình hoạt động
          </Title>
          
          <Card className="process-card">
            <Timeline
              mode="alternate"
              items={[
                {
                  children: (
                    <div>
                      <Title level={4}>Nông dân tạo lô nông sản</Title>
                      <Text>Nhập thông tin chi tiết về lô nông sản: loại, số lượng, hạn sử dụng</Text>
                    </div>
                  ),
                  color: '#52c41a'
                },
                {
                  children: (
                    <div>
                      <Title level={4}>Đại lý đặt hàng</Title>
                      <Text>Tạo đơn hàng mua vào từ các lô nông sản có sẵn</Text>
                    </div>
                  ),
                  color: '#1890ff'
                },
                {
                  children: (
                    <div>
                      <Title level={4}>Kiểm định chất lượng</Title>
                      <Text>Đại lý kiểm tra và đánh giá chất lượng hàng hóa nhận được</Text>
                    </div>
                  ),
                  color: '#fa8c16'
                },
                {
                  children: (
                    <div>
                      <Title level={4}>Vận chuyển</Title>
                      <Text>Quản lý và theo dõi quá trình vận chuyển đến siêu thị</Text>
                    </div>
                  ),
                  color: '#722ed1'
                },
                {
                  children: (
                    <div>
                      <Title level={4}>Siêu thị nhận hàng</Title>
                      <Text>Cập nhật kho hàng và cung cấp cho người tiêu dùng</Text>
                    </div>
                  ),
                  color: '#eb2f96'
                }
              ]}
            />
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <Title level={2} style={{ textAlign: 'center', marginBottom: '40px', color: '#fff' }}>
            Câu hỏi thường gặp
          </Title>
          
          <Card className="faq-card">
            <Collapse ghost>
              <Panel header="Làm thế nào để đăng ký tài khoản?" key="1">
                <p>Bạn có thể đăng ký tài khoản bằng cách click vào nút "Đăng ký" trên trang chủ, 
                chọn loại tài khoản phù hợp (Nông dân/Đại lý/Siêu thị) và điền đầy đủ thông tin.</p>
              </Panel>
              <Panel header="Tôi có thể theo dõi nguồn gốc nông sản như thế nào?" key="2">
                <p>Hệ thống cung cấp mã QR cho mỗi lô nông sản. Bạn có thể quét mã này để xem 
                toàn bộ thông tin từ trang trại đến điểm bán.</p>
              </Panel>
              <Panel header="Làm sao để kiểm định chất lượng nông sản?" key="3">
                <p>Đại lý có thể sử dụng tính năng "Kiểm định chất lượng" để đánh giá và ghi nhận 
                kết quả kiểm tra cho từng lô hàng nhận được.</p>
              </Panel>
              <Panel header="Hệ thống có hỗ trợ báo cáo không?" key="4">
                <p>Có, hệ thống cung cấp các báo cáo thống kê chi tiết về doanh thu, 
                số lượng hàng hóa, và hiệu quả hoạt động.</p>
              </Panel>
            </Collapse>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Guide;