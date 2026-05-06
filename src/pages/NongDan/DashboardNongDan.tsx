import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Spin, message, Table } from 'antd';
import { 
  ShopOutlined,
  InboxOutlined,
  CheckCircleOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { AdminLayout } from '../../components/Layout';
import { apiService } from '../../services/apiService';

const DashboardNongDan: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    tongSanPham: 0,
    tongTrangTrai: 0,
    tongLoNongSan: 0,
    tongDonHang: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

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
      render: (value: number) => value.toLocaleString('vi-VN') + ' VNĐ'
    },
    {
      title: 'Loại người mua',
      dataIndex: 'loaiNguoiMua',
      key: 'loaiNguoiMua',
      width: 120,
      render: (text: string) => text === 'daily' ? 'Đại lý' : text
    }
  ];

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

          {/* Recent Orders */}
          <Card title="Đơn hàng gần đây" style={{ marginTop: '24px' }}>
            <Table
              columns={columns}
              dataSource={recentOrders.map((order, index) => ({
                ...order,
                key: index
              }))}
              pagination={false}
              size="small"
            />
          </Card>
        </>
      )}
    </AdminLayout>
  );
};

export default DashboardNongDan;