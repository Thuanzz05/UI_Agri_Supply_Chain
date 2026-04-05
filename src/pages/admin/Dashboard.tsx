import { Card, Row, Col, Table } from 'antd';
import { 
  TrophyOutlined, 
  TeamOutlined, 
  ShopOutlined, 
  DollarOutlined 
} from '@ant-design/icons';
import Sidebar from '../../components/Sidebar';
import './Dashboard.css';

const Dashboard = () => {
  // Dữ liệu mẫu cho bảng
  const recentOrders = [
    {
      key: '1',
      id: 'ORD001',
      farm: 'Trang trại Xanh',
      product: 'Rau cải xanh',
      quantity: '100kg',
      status: 'Đang vận chuyển',
      date: '2024-01-15'
    },
    {
      key: '2',
      id: 'ORD002',
      farm: 'Trang trại Organic',
      product: 'Cà chua cherry',
      quantity: '50kg',
      status: 'Hoàn thành',
      date: '2024-01-14'
    },
    {
      key: '3',
      id: 'ORD003',
      farm: 'Trang trại Sạch',
      product: 'Xà lách',
      quantity: '75kg',
      status: 'Đang xử lý',
      date: '2024-01-13'
    }
  ];

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Trang trại',
      dataIndex: 'farm',
      key: 'farm',
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      key: 'product',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span className={`status ${status === 'Hoàn thành' ? 'completed' : status === 'Đang vận chuyển' ? 'shipping' : 'processing'}`}>
          {status}
        </span>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ 
        marginLeft: '256px', 
        flex: 1, 
        padding: '24px',
        background: '#f5f5f5',
        transition: 'margin-left 0.3s ease'
      }}>
        <div className="page-header">
          <h1>Dashboard</h1>
          <p>Tổng quan hệ thống quản lý chuỗi cung ứng nông sản</p>
        </div>
        
        {/* Stats Cards */}
        <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card">
              <div className="stat-content">
                <div className="stat-icon">
                  <ShopOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                </div>
                <div>
                  <div className="stat-number">1,234</div>
                  <div className="stat-label">Trang trại</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card">
              <div className="stat-content">
                <div className="stat-icon">
                  <TrophyOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                </div>
                <div>
                  <div className="stat-number">5,678</div>
                  <div className="stat-label">Sản phẩm</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card">
              <div className="stat-content">
                <div className="stat-icon">
                  <TeamOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />
                </div>
                <div>
                  <div className="stat-number">890</div>
                  <div className="stat-label">Đơn hàng</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card">
              <div className="stat-content">
                <div className="stat-icon">
                  <DollarOutlined style={{ fontSize: '24px', color: '#f5222d' }} />
                </div>
                <div>
                  <div className="stat-number">99.5%</div>
                  <div className="stat-label">Độ tin cậy</div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Charts and Tables */}
        <Row gutter={[24, 24]}>
          <Col xs={24}>
            <Card title="Đơn hàng gần đây" className="table-card">
              <Table 
                columns={columns} 
                dataSource={recentOrders} 
                pagination={false}
                size="small"
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;