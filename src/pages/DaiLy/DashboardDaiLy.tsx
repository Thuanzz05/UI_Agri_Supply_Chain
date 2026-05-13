import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Spin, message, Table, Tag } from 'antd';
import { 
  ShoppingOutlined,
  CheckCircleOutlined,
  HomeOutlined,
  ShopOutlined
} from '@ant-design/icons';
import { Column, Pie } from '@ant-design/charts';
import { AdminLayout } from '../../components/Layout';
import { apiService } from '../../services/apiService';
import dayjs from 'dayjs';
import './DashboardDaiLy.css';

interface ProductSalesData {
  tenSanPham: string;
  soLuongBan: number;
  doanhThu: number;
}

interface OrderStatsItem {
  type: string;
  value: number;
}

const DashboardDaiLy: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    tongKho: 0,
    tongKhoHang: 0,
    tongDonHangMua: 0,
    tongDonHangBan: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [productSalesData, setProductSalesData] = useState<ProductSalesData[]>([]);
  const [revenueData, setRevenueData] = useState<ProductSalesData[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        message.error('Không tìm thấy thông tin người dùng');
        return;
      }
      
      const user = JSON.parse(userStr);
      const maDaiLy = user.MaDaiLy || user.maDaiLy;
      
      if (!maDaiLy) {
        message.error('Không tìm thấy mã đại lý');
        return;
      }
      
      // Fetch stats
      const statsResponse = await apiService.getAgentDashboardStats(maDaiLy);
      const statsData = statsResponse.success ? statsResponse.data : stats;
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      // Fetch recent orders
      const ordersResponse = await apiService.getAgentRecentOrders(maDaiLy, 5);
      if (ordersResponse.success) {
        setRecentOrders(ordersResponse.data);
      }

      // Fetch product sales statistics
      try {
        const salesResponse = await apiService.getAgentProductSales(maDaiLy);
        if (salesResponse.success && salesResponse.data) {
          const salesData = salesResponse.data;
          // Sort by quantity sold
          const sortedByQuantity = [...salesData].sort((a, b) => b.soLuongBan - a.soLuongBan).slice(0, 10);
          setProductSalesData(sortedByQuantity);
          
          // Sort by revenue
          const sortedByRevenue = [...salesData].sort((a, b) => b.doanhThu - a.doanhThu).slice(0, 5);
          setRevenueData(sortedByRevenue);
        }
      } catch (error) {
        console.error('Error fetching product sales:', error);
        // Continue without sales data
      }
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      message.error('Lỗi khi tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      'cho_xac_nhan': 'orange',
      'da_xac_nhan': 'blue',
      'dang_van_chuyen': 'cyan',
      'hoan_thanh': 'green',
      'da_huy': 'red',
    };
    return map[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      'cho_xac_nhan': 'Chờ xác nhận',
      'da_xac_nhan': 'Đã xác nhận',
      'dang_van_chuyen': 'Đang vận chuyển',
      'hoan_thanh': 'Hoàn thành',
      'da_huy': 'Đã hủy',
    };
    return map[status] || status;
  };

  const columns = [
    {
      title: 'Mã ĐH',
      dataIndex: 'maDonHang',
      key: 'maDonHang',
      width: 80,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'ngayDat',
      key: 'ngayDat',
      width: 110,
      render: (date: string) => date ? dayjs(date).format('DD/MM/YYYY') : '-',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 130,
      render: (text: string) => (
        <Tag color={getStatusColor(text)}>
          {getStatusText(text)}
        </Tag>
      ),
    },
    {
      title: 'Tổng giá trị',
      dataIndex: 'tongGiaTri',
      key: 'tongGiaTri',
      width: 140,
      render: (value: number) => value ? value.toLocaleString('vi-VN') + ' VNĐ' : '0 VNĐ',
    },
    {
      title: 'Loại',
      dataIndex: 'loaiNguoiMua',
      key: 'loaiNguoiMua',
      width: 100,
      render: (text: string) => text === 'sieuthi' ? 'Siêu thị' : (text === 'daily' ? 'Đại lý' : text),
    }
  ];

  // ===== Chart configs =====
  const quantityChartConfig: any = {
    data: productSalesData,
    xField: 'tenSanPham',
    yField: 'soLuongBan',
    style: {
      radiusEndTop: 6,
      fill: '#1890ff',
    },
    label: {
      text: (d: any) => `${d.soLuongBan.toFixed(0)} kg`,
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
        { field: 'soLuongBan', name: 'Số lượng bán', valueFormatter: (v: number) => `${v.toFixed(0)} kg` },
      ],
    },
  };

  const revenueChartConfig: any = {
    data: revenueData,
    angleField: 'doanhThu',
    colorField: 'tenSanPham',
    radius: 0.85,
    innerRadius: 0.55,
    label: {
      text: (d: any) => `${d.tenSanPham}\n${(d.doanhThu / 1000000).toFixed(1)}M`,
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
        { field: 'doanhThu', name: 'Doanh thu', valueFormatter: (v: number) => `${v.toLocaleString('vi-VN')} VNĐ` },
        { field: 'soLuongBan', name: 'Số lượng', valueFormatter: (v: number) => `${v.toFixed(0)} kg` },
      ],
    },
  };

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Dashboard Đại Lý</h1>
        <p>Tổng quan hoạt động kinh doanh của đại lý</p>
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
            <Col xs={24} sm={12} lg={6}>
              <Card className="dashboard-stat-card">
                <Statistic
                  title="Tổng số lượng tồn kho"
                  value={stats.tongKho}
                  prefix={<HomeOutlined style={{ color: '#52c41a' }} />}
                  styles={{ content: { color: '#52c41a' } }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="dashboard-stat-card">
                <Statistic
                  title="Số kho hàng"
                  value={stats.tongKhoHang}
                  prefix={<ShopOutlined style={{ color: '#1890ff' }} />}
                  styles={{ content: { color: '#1890ff' } }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="dashboard-stat-card">
                <Statistic
                  title="Đơn hàng mua"
                  value={stats.tongDonHangMua}
                  prefix={<ShoppingOutlined style={{ color: '#fa8c16' }} />}
                  styles={{ content: { color: '#fa8c16' } }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="dashboard-stat-card">
                <Statistic
                  title="Đơn hàng bán"
                  value={stats.tongDonHangBan}
                  prefix={<CheckCircleOutlined style={{ color: '#f5222d' }} />}
                  styles={{ content: { color: '#f5222d' } }}
                />
              </Card>
            </Col>
          </Row>

          {/* Charts Row */}
          <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
            <Col xs={24} lg={14}>
              <Card 
                title="Top 10 sản phẩm bán chạy nhất (theo số lượng)" 
                className="dashboard-chart-card"
              >
                <div className="chart-container">
                  {productSalesData.length > 0 ? (
                    <Column {...quantityChartConfig} height={300} />
                  ) : (
                    <div className="chart-empty">Chưa có dữ liệu bán hàng</div>
                  )}
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={10}>
              <Card 
                title="Top 5 sản phẩm có doanh thu cao nhất" 
                className="dashboard-chart-card"
              >
                <div className="chart-container">
                  {revenueData.length > 0 ? (
                    <Pie {...revenueChartConfig} height={300} />
                  ) : (
                    <div className="chart-empty">Chưa có dữ liệu doanh thu</div>
                  )}
                </div>
              </Card>
            </Col>
          </Row>

          {/* Recent Orders */}
          <Card title="Đơn hàng gần đây" className="recent-orders-card">
            <div className="dashboard-table">
              <Table
                columns={columns}
                dataSource={recentOrders.map((order, index) => ({
                  ...order,
                  key: index
                }))}
                pagination={false}
                size="small"
                locale={{ emptyText: 'Chưa có đơn hàng nào' }}
              />
            </div>
          </Card>
        </>
      )}
    </AdminLayout>
  );
};

export default DashboardDaiLy;