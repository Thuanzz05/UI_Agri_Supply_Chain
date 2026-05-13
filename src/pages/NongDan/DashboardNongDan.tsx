                                                                                                                                                import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Spin, message, Table } from 'antd';
import { 
  ShopOutlined,
  InboxOutlined,
  CheckCircleOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { Column, Pie } from '@ant-design/charts';
import { AdminLayout } from '../../components/Layout';
import { apiService } from '../../services/apiService';
import dayjs from 'dayjs';

interface ProductSalesData {
  tenSanPham: string;
  soLuongBan: number;
  doanhThu: number;
}

const DashboardNongDan: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    tongSanPham: 0,
    tongTrangTrai: 0,
    tongLoNongSan: 0,
    tongDonHang: 0
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
      const maNongDan = user.MaNongDan || user.maNongDan;
      
      if (!maNongDan) {
        message.error('Không tìm thấy mã nông dân');
        return;
      }
      
      // Fetch stats
      const statsResponse = await apiService.getFarmerDashboardStats(maNongDan);
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      // Fetch recent orders
      const ordersResponse = await apiService.getFarmerRecentOrders(maNongDan, 5);
      if (ordersResponse.success) {
        setRecentOrders(ordersResponse.data);
      }

      // Fetch product sales statistics
      try {
        const salesResponse = await apiService.getFarmerProductSales(maNongDan);
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

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'maDonHang',
      key: 'maDonHang',
      width: 100,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'ngayDat',
      key: 'ngayDat',
      width: 120,
      render: (date: string) => date ? dayjs(date).format('DD/MM/YYYY') : '-',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 120,
      render: (text: string) => {
        const statusMap: { [key: string]: string } = {
          'cho_xac_nhan': 'Chờ xác nhận',
          'hoan_thanh': 'Hoàn thành',
          'da_huy': 'Đã hủy'
        };
        return statusMap[text] || text;
      }
    },
    {
      title: 'Tổng giá trị',
      dataIndex: 'tongGiaTri',
      key: 'tongGiaTri',
      width: 150,
      render: (value: number) => value ? value.toLocaleString('vi-VN') + ' VNĐ' : '0 VNĐ'
    },
    {
      title: 'Loại người mua',
      dataIndex: 'loaiNguoiMua',
      key: 'loaiNguoiMua',
      width: 120,
      render: (text: string) => text === 'daily' ? 'Đại lý' : text
    }
  ];

  // Chart configurations
  const quantityChartConfig: any = {
    data: productSalesData,
    xField: 'tenSanPham',
    yField: 'soLuongBan',
    style: {
      radiusEndTop: 6,
      fill: '#52c41a',
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
        { field: 'soLuongBan', name: 'Số lượng', valueFormatter: (v: number) => `${v} kg` },
      ],
    },
  };

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Dashboard Nông Dân</h1>
        <p>Tổng quan hoạt động trang trại của bạn</p>
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
              <Card>
                <Statistic
                  title="Loại sản phẩm đang trồng"
                  value={stats.tongSanPham}
                  prefix={<ShopOutlined style={{ color: '#52c41a' }} />}
                  styles={{ content: { color: '#52c41a' } }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Tổng trang trại"
                  value={stats.tongTrangTrai}
                  prefix={<HomeOutlined style={{ color: '#1890ff' }} />}
                  styles={{ content: { color: '#1890ff' } }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Tổng lô nông sản"
                  value={stats.tongLoNongSan}
                  prefix={<InboxOutlined style={{ color: '#fa8c16' }} />}
                  styles={{ content: { color: '#fa8c16' } }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Tổng đơn hàng"
                  value={stats.tongDonHang}
                  prefix={<CheckCircleOutlined style={{ color: '#f5222d' }} />}
                  styles={{ content: { color: '#f5222d' } }}
                />
              </Card>
            </Col>
          </Row>

          {/* Charts Row */}
          <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
            <Col xs={24} lg={14}>
              <Card title="Top 10 sản phẩm bán chạy nhất (theo số lượng)">
                <div style={{ height: 320 }}>
                  {productSalesData.length > 0 ? (
                    <Column {...quantityChartConfig} height={300} />
                  ) : (
                    <div style={{ textAlign: 'center', padding: '100px 0', color: '#999' }}>
                      Chưa có dữ liệu bán hàng
                    </div>
                  )}
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={10}>
              <Card title="Top 5 sản phẩm có doanh thu cao nhất">
                <div style={{ height: 320 }}>
                  {revenueData.length > 0 ? (
                    <Pie {...revenueChartConfig} height={300} />
                  ) : (
                    <div style={{ textAlign: 'center', padding: '100px 0', color: '#999' }}>
                      Chưa có dữ liệu doanh thu
                    </div>
                  )}
                </div>
              </Card>
            </Col>
          </Row>

          {/* Recent Orders */}
          <Card title="Đơn hàng gần đây">
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
          </Card>
        </>
      )}
    </AdminLayout>
  );
};

export default DashboardNongDan;