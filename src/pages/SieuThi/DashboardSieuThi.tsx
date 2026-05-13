import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, message, Spin, Table, Tag } from 'antd';
import {
  ShopOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { Column, Pie } from '@ant-design/charts';
import { AdminLayout } from '../../components/Layout';
import { authService } from '../../services/authService';
import { apiService } from '../../services/apiService';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import './DashboardSieuThi.css';

interface DashboardStats {
  tongSanPhamTrongKho: number;
  tongDonHangThang: number;
  soDonChoXacNhan: number;
  soDonHoanThanh: number;
  donHangGanDay?: Array<{
    maDonHang: number;
    ngayDat: string;
    trangThai: string;
    tongGiaTri: number;
    tenNguoiBan: string;
  }>;
}

interface ProductSalesData {
  tenSanPham: string;
  soLuongMua: number;
  tongChiPhi: number;
}

const STATUS_LABELS: Record<string, string> = {
  cho_xac_nhan: 'Chờ xác nhận',
  da_xac_nhan: 'Đã xác nhận',
  dang_van_chuyen: 'Đang vận chuyển',
  hoan_thanh: 'Hoàn thành',
  da_huy: 'Đã hủy',
};

const STATUS_COLORS: Record<string, string> = {
  cho_xac_nhan: 'orange',
  da_xac_nhan: 'blue',
  dang_van_chuyen: 'cyan',
  hoan_thanh: 'green',
  da_huy: 'red',
};

const DashboardSieuThi: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [productSalesData, setProductSalesData] = useState<ProductSalesData[]>([]);
  const [revenueData, setRevenueData] = useState<ProductSalesData[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 992);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 992);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const user = authService.getStoredUser();

      if (!user?.maSieuThi) {
        message.error('Không tìm thấy thông tin siêu thị');
        return;
      }

      const response = await apiService.getSupermarketDashboardStats(user.maSieuThi);
      setStats(response);

      // Fetch product sales statistics
      try {
        const salesResponse = await apiService.getSupermarketProductSales(user.maSieuThi);
        if (salesResponse.success && salesResponse.data) {
          const salesData = salesResponse.data;
          // Sort by quantity purchased
          const sortedByQuantity = [...salesData].sort((a, b) => b.soLuongMua - a.soLuongMua).slice(0, 10);
          setProductSalesData(sortedByQuantity);
          
          // Sort by total cost
          const sortedByCost = [...salesData].sort((a, b) => b.tongChiPhi - a.tongChiPhi).slice(0, 5);
          setRevenueData(sortedByCost);
        }
      } catch (error) {
        console.error('Error fetching product sales:', error);
        // Continue without sales data
      }
    } catch (error: any) {
      console.error('Error loading dashboard stats:', error);
      message.error('Không thể tải thống kê dashboard');
    } finally {
      setLoading(false);
    }
  };

  // ── Table columns ──
  const recentOrderColumns: ColumnsType<any> = [
    {
      title: 'Mã ĐH',
      dataIndex: 'maDonHang',
      key: 'maDonHang',
      width: 80,
    },
    {
      title: 'Đại lý',
      dataIndex: 'tenNguoiBan',
      key: 'tenNguoiBan',
    },
    ...(!isMobile ? [{
      title: 'Ngày đặt',
      dataIndex: 'ngayDat',
      key: 'ngayDat',
      width: 120,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    }] : []),
    ...(!isTablet && !isMobile ? [{
      title: 'Tổng tiền',
      dataIndex: 'tongGiaTri',
      key: 'tongGiaTri',
      width: 130,
      render: (value: number) => `${value?.toLocaleString('vi-VN') || 0} đ`,
    }] : []),
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 130,
      render: (status: string) => (
        <Tag color={STATUS_COLORS[status] || 'default'}>
          {STATUS_LABELS[status] || status}
        </Tag>
      ),
    },
  ];

  // ── Chart configs (v2.x) ──
  const quantityChartConfig: any = {
    data: productSalesData,
    xField: 'tenSanPham',
    yField: 'soLuongMua',
    style: {
      radiusEndTop: 6,
      fill: '#1890ff',
    },
    label: {
      text: (d: any) => `${d.soLuongMua.toFixed(0)} kg`,
      position: 'outside',
      style: { fill: '#595959', fontSize: 12 },
    },
    axis: {
      x: {
        label: {
          autoRotate: true,
          style: { fontSize: 11 },
        },
      },
      y: {
        title: 'Số lượng (kg)',
      },
    },
    tooltip: {
      title: 'tenSanPham',
      items: [
        { field: 'soLuongMua', name: 'Số lượng mua', valueFormatter: (v: number) => `${v.toFixed(0)} kg` },
      ],
    },
  };

  const revenueChartConfig: any = {
    data: revenueData,
    angleField: 'tongChiPhi',
    colorField: 'tenSanPham',
    radius: 0.85,
    innerRadius: 0.55,
    label: {
      text: (d: any) => `${d.tenSanPham}\n${(d.tongChiPhi / 1000000).toFixed(1)}M`,
      position: 'outside',
      style: { fontSize: 11 },
    },
    legend: {
      color: {
        position: 'bottom',
        layout: { justifyContent: 'center' },
      },
    },
    tooltip: {
      title: 'tenSanPham',
      items: [
        { field: 'tongChiPhi', name: 'Tổng chi phí', valueFormatter: (v: number) => `${v.toLocaleString('vi-VN')} VNĐ` },
        { field: 'soLuongMua', name: 'Số lượng', valueFormatter: (v: number) => `${v.toFixed(0)} kg` },
      ],
    },
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Dashboard Siêu Thị</h1>
        <p>Tổng quan hoạt động bán lẻ của siêu thị</p>
      </div>

      {/* Stats Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="dashboard-stat-card">
            <Statistic
              title="Sản phẩm trong kho"
              value={stats?.tongSanPhamTrongKho || 0}
              prefix={<ShopOutlined style={{ color: '#52c41a' }} />}
              styles={{ content: { color: '#52c41a' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="dashboard-stat-card">
            <Statistic
              title="Đơn hàng tháng này"
              value={stats?.tongDonHangThang || 0}
              prefix={<ShoppingCartOutlined style={{ color: '#1890ff' }} />}
              styles={{ content: { color: '#1890ff' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="dashboard-stat-card">
            <Statistic
              title="Chờ xác nhận"
              value={stats?.soDonChoXacNhan || 0}
              prefix={<ClockCircleOutlined style={{ color: '#fa8c16' }} />}
              styles={{ content: { color: '#fa8c16' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="dashboard-stat-card">
            <Statistic
              title="Đã hoàn thành"
              value={stats?.soDonHoanThanh || 0}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              styles={{ content: { color: '#52c41a' } }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={14}>
          <Card 
            title="Top 10 sản phẩm mua nhiều nhất (theo số lượng)" 
            className="dashboard-chart-card"
          >
            <div className="chart-container">
              {productSalesData.length > 0 ? (
                <Column {...quantityChartConfig} height={300} />
              ) : (
                <div className="chart-empty">Chưa có dữ liệu mua hàng</div>
              )}
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card 
            title="Top 5 sản phẩm có chi phí mua cao nhất" 
            className="dashboard-chart-card"
          >
            <div className="chart-container">
              {revenueData.length > 0 ? (
                <Pie {...revenueChartConfig} height={300} />
              ) : (
                <div className="chart-empty">Chưa có dữ liệu chi phí</div>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Đơn hàng gần đây */}
      <Card title="Đơn hàng gần đây" className="recent-orders-card">
        <div className="dashboard-table">
          <Table
            columns={recentOrderColumns}
            dataSource={stats?.donHangGanDay || []}
            pagination={false}
            rowKey="maDonHang"
            size="small"
            locale={{ emptyText: 'Chưa có đơn hàng' }}
          />
        </div>
      </Card>
    </AdminLayout>
  );
};

export default DashboardSieuThi;