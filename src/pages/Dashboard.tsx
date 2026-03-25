import React from 'react';
import { Row, Col, Card, Statistic, Typography, Space, Button } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  TruckOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>Tổng quan hệ thống</Title>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng người dùng"
              value={1128}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
              suffix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đơn hàng tháng này"
              value={93}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Doanh thu"
              value={112893}
              prefix={<DollarOutlined />}
              suffix="VNĐ"
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đang vận chuyển"
              value={28}
              prefix={<TruckOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Hoạt động gần đây" style={{ height: 400 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>📦 Đơn hàng #DH001 đã được tạo</div>
              <div>✅ Lô nông sản #LO001 đã qua kiểm định</div>
              <div>🚚 Đơn hàng #DH002 đang được vận chuyển</div>
              <div>👤 Người dùng mới đã đăng ký</div>
              <div>📊 Báo cáo tháng đã được tạo</div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Thông báo" style={{ height: 400 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>🔔 Có 3 đơn hàng cần xử lý</div>
              <div>⚠️ Sản phẩm Cà chua sắp hết hàng</div>
              <div>📋 Cần kiểm định 5 lô nông sản</div>
              <div>💰 Doanh thu tháng này tăng 15%</div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;