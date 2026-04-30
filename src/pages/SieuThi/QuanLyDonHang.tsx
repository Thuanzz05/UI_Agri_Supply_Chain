import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, message, Card, Statistic, Row, Col, Select, DatePicker } from 'antd';
import { ShoppingCartOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { AdminLayout } from '../../components/Layout';
import { authService } from '../../services/authService';
import { apiService } from '../../services/apiService';
import { ActionButton } from '../../components/ActionButton';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

interface DonHang {
  maDonHang: number;
  maNguoiBan: number;
  tenNguoiBan: string;
  maNguoiMua: number;
  tenNguoiMua: string;
  loaiDon: string;
  loaiNguoiBan: string;
  loaiNguoiMua: string;
  ngayDat: string;
  trangThai: string;
  tongGiaTri: number;
  ghiChu?: string;
}

const QuanLyDonHang: React.FC = () => {
  const [donHangs, setDonHangs] = useState<DonHang[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadDonHangs();
  }, []);

  const loadDonHangs = async () => {
    try {
      setLoading(true);
      const user = authService.getStoredUser();
      
      if (!user?.maSieuThi) {
        message.error('Không tìm thấy thông tin siêu thị');
        return;
      }

      const response = await apiService.getSupermarketOrders(user.maSieuThi);
      const data = response.data || response;
      setDonHangs(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Error loading orders:', error);
      message.error('Không thể tải danh sách đơn hàng');
      setDonHangs([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      'cho_xac_nhan': 'orange',
      'da_xac_nhan': 'blue',
      'dang_giao': 'cyan',
      'hoan_thanh': 'green',
      'da_huy': 'red',
    };
    return statusMap[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'cho_xac_nhan': 'Chờ xác nhận',
      'da_xac_nhan': 'Đã xác nhận',
      'dang_giao': 'Đang giao',
      'hoan_thanh': 'Hoàn thành',
      'da_huy': 'Đã hủy',
    };
    return statusMap[status] || status;
  };

  const filteredDonHangs = filterStatus === 'all' 
    ? donHangs 
    : donHangs.filter(dh => dh.trangThai === filterStatus);

  const statistics = {
    total: donHangs.length,
    pending: donHangs.filter(dh => dh.trangThai === 'cho_xac_nhan').length,
    completed: donHangs.filter(dh => dh.trangThai === 'hoan_thanh').length,
    cancelled: donHangs.filter(dh => dh.trangThai === 'da_huy').length,
  };

  const columns: ColumnsType<DonHang> = [
    {
      title: 'Mã ĐH',
      dataIndex: 'maDonHang',
      key: 'maDonHang',
      width: 80,
      fixed: 'left',
    },
    {
      title: 'Đại lý',
      dataIndex: 'tenNguoiBan',
      key: 'tenNguoiBan',
      width: 150,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'ngayDat',
      key: 'ngayDat',
      width: 120,
      render: (date: string) => date ? dayjs(date).format('DD/MM/YYYY') : '-',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'tongGiaTri',
      key: 'tongGiaTri',
      width: 120,
      render: (value: number) => `${value?.toLocaleString() || 0} đ`,
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
    {
      title: 'Ghi chú',
      dataIndex: 'ghiChu',
      key: 'ghiChu',
      width: 200,
      ellipsis: true,
    },
  ];

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Quản lý Đơn hàng</h1>
        <p>Quản lý đơn hàng mua từ đại lý</p>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={statistics.total}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Chờ xác nhận"
              value={statistics.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Hoàn thành"
              value={statistics.completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đã hủy"
              value={statistics.cancelled}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ width: 200 }}
          >
            <Select.Option value="all">Tất cả trạng thái</Select.Option>
            <Select.Option value="cho_xac_nhan">Chờ xác nhận</Select.Option>
            <Select.Option value="da_xac_nhan">Đã xác nhận</Select.Option>
            <Select.Option value="dang_giao">Đang giao</Select.Option>
            <Select.Option value="hoan_thanh">Hoàn thành</Select.Option>
            <Select.Option value="da_huy">Đã hủy</Select.Option>
          </Select>
        </Space>

        <Table
          columns={columns}
          dataSource={filteredDonHangs}
          rowKey="maDonHang"
          loading={loading}
          scroll={{ x: 900 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} đơn hàng`,
          }}
        />
      </Card>
    </AdminLayout>
  );
};

export default QuanLyDonHang;
