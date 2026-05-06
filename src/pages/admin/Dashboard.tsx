import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spin, message } from 'antd';
import { 
  TeamOutlined, 
  ShopOutlined, 
  UserOutlined 
} from '@ant-design/icons';
import { AdminLayout } from '../../components/Layout';
import { apiService } from '../../services/apiService';
import './Dashboard.css';

interface DashboardStats {
  tongNongDan: number;
  tongDaiLy: number;
  tongSieuThi: number;
  tongTaiKhoan: number;
  tongLoNongSan: number;
  tongDonHang: number;
  tongKiemDinh: number;
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    tongNongDan: 0,
    tongDaiLy: 0,
    tongSieuThi: 0,
    tongTaiKhoan: 0,
    tongLoNongSan: 0,
    tongDonHang: 0,
    tongKiemDinh: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const statsResponse = await apiService.getDashboardStats();

      if (statsResponse?.data) {
        setStats(statsResponse.data);
      }
    } catch (error: any) {
      message.error('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Tổng quan hệ thống quản lý chuỗi cung ứng nông sản</p>
      </div>
      
      <Spin spinning={loading}>
        {/* Stats Cards */}
        <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card">
              <div className="stat-content">
                <div className="stat-icon">
                  <UserOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                </div>
                <div>
                  <div className="stat-number">{stats.tongNongDan}</div>
                  <div className="stat-label">Nông dân</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card">
              <div className="stat-content">
                <div className="stat-icon">
                  <ShopOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                </div>
                <div>
                  <div className="stat-number">{stats.tongDaiLy}</div>
                  <div className="stat-label">Đại lý</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card">
              <div className="stat-content">
                <div className="stat-icon">
                  <ShopOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />
                </div>
                <div>
                  <div className="stat-number">{stats.tongSieuThi}</div>
                  <div className="stat-label">Siêu thị</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card">
              <div className="stat-content">
                <div className="stat-icon">
                  <TeamOutlined style={{ fontSize: '24px', color: '#722ed1' }} />
                </div>
                <div>
                  <div className="stat-number">{stats.tongTaiKhoan}</div>
                  <div className="stat-label">Tổng tài khoản</div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Welcome Card with Illustration */}
        <Row gutter={[24, 24]}>
          <Col xs={24}>
            <Card 
              style={{ 
                background: '#ffffff',
                border: '1px solid #f0f0f0',
                borderRadius: '12px',
                minHeight: '300px'
              }}
            >
              <Row align="middle" style={{ minHeight: '250px' }}>
                <Col xs={24} md={12}>
                  <div style={{ padding: '40px' }}>
                    <h2 style={{ color: '#2E7D32', fontSize: '32px', marginBottom: '16px', fontWeight: 600 }}>
                      Chào mừng đến với AgriChain Admin
                    </h2>
                    <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.6' }}>
                      Quản lý toàn bộ hệ thống chuỗi cung ứng nông sản một cách hiệu quả và minh bạch. 
                      Theo dõi hoạt động của nông dân, đại lý và siêu thị trong hệ thống.
                    </p>
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    padding: '40px'
                  }}>
                    <img 
                      src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&h=400&fit=crop" 
                      alt="Agriculture Dashboard"
                      style={{
                        width: '100%',
                        maxWidth: '400px',
                        height: 'auto',
                        borderRadius: '8px',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Charts and Tables */}
      </Spin>
    </AdminLayout>
  );
};

export default Dashboard;