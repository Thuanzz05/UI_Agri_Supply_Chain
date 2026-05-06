import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, message, Spin, Table, Tag } from 'antd';
import { 
  ShopOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { AdminLayout } from '../../components/Layout';
import { authService } from '../../services/authService';
import { apiService } from '../../services/apiService';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

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

const DashboardSieuThi: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    loadDashboardStats();
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
    } catch (error: any) {
      console.error('Error loading dashboard stats:', error);
      message.error('Không thể tải thống kê dashboard');
    } finally {
      setLoading(false);
    }
  };



  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      'cho_xac_nhan': 'orange',
      'hoan_thanh': 'green',
      'da_huy': 'red',
    };
    return statusMap[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'cho_xac_nhan': 'Chờ xác nhận',
      'hoan_thanh': 'Hoàn thành',
      'da_huy': 'Đã hủy',
    };
    return statusMap[status] || status;
  };

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
    {
      title: 'Ngày đặt',
      dataIndex: 'ngayDat',
      key: 'ngayDat',
      width: 120,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'tongGiaTri',
      key: 'tongGiaTri',
      width: 130,
      render: (value: number) => `${value.toLocaleString('vi-VN')} đ`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 130,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
  ];

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
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Sản phẩm trong kho"
              value={stats?.tongSanPhamTrongKho || 0}
              prefix={<ShopOutlined />}
              styles={{ content: { color: '#52c41a' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đơn hàng tháng này"
              value={stats?.tongDonHangThang || 0}
              prefix={<ShoppingCartOutlined />}
              styles={{ content: { color: '#1890ff' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Chờ xác nhận"
              value={stats?.soDonChoXacNhan || 0}
              prefix={<ClockCircleOutlined />}
              styles={{ content: { color: '#fa8c16' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đã hoàn thành"
              value={stats?.soDonHoanThanh || 0}
              prefix={<CheckCircleOutlined />}
              styles={{ content: { color: '#52c41a' } }}
            />
          </Card>
        </Col>
      </Row>

      {/* Đơn hàng gần đây */}
      {stats?.donHangGanDay && stats.donHangGanDay.length > 0 && (
        <Card title="Đơn hàng gần đây" style={{ marginTop: 24 }}>
          <Table
            columns={recentOrderColumns}
            dataSource={stats.donHangGanDay}
            pagination={false}
            rowKey="maDonHang"
            locale={{ emptyText: 'Chưa có đơn hàng' }}
          />
        </Card>
      )}
    </AdminLayout>
  );
};

export default DashboardSieuThi;