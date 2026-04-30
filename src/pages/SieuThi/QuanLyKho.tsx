import React, { useState, useEffect } from 'react';
import { Table, Tag, message, Card, Statistic, Row, Col } from 'antd';
import { HomeOutlined, InboxOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { AdminLayout } from '../../components/Layout';
import { authService } from '../../services/authService';
import { apiService } from '../../services/apiService';
import type { ColumnsType } from 'antd/es/table';

interface Kho {
  maKho: number;
  maChuSoHuu: number;
  loaiChuSoHuu: string;
  tenKho: string;
  diaChi: string;
  sucChua: number;
  trangThai: string;
  ghiChu?: string;
}

const QuanLyKho: React.FC = () => {
  const [khos, setKhos] = useState<Kho[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadKhos();
  }, []);

  const loadKhos = async () => {
    try {
      setLoading(true);
      const user = authService.getStoredUser();
      
      if (!user?.maSieuThi) {
        message.error('Không tìm thấy thông tin siêu thị');
        return;
      }

      const response = await apiService.getSupermarketWarehouses(user.maSieuThi);
      const data = response.data || response;
      setKhos(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Error loading warehouses:', error);
      message.error('Không thể tải danh sách kho');
      setKhos([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      'hoat_dong': 'green',
      'bao_tri': 'orange',
      'ngung_hoat_dong': 'red',
    };
    return statusMap[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'hoat_dong': 'Hoạt động',
      'bao_tri': 'Bảo trì',
      'ngung_hoat_dong': 'Ngừng hoạt động',
    };
    return statusMap[status] || status;
  };

  const statistics = {
    total: khos.length,
    active: khos.filter(k => k.trangThai === 'hoat_dong').length,
    totalCapacity: khos.reduce((sum, k) => sum + (k.sucChua || 0), 0),
  };

  const columns: ColumnsType<Kho> = [
    {
      title: 'Mã kho',
      dataIndex: 'maKho',
      key: 'maKho',
      width: 80,
      fixed: 'left',
    },
    {
      title: 'Tên kho',
      dataIndex: 'tenKho',
      key: 'tenKho',
      width: 200,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'diaChi',
      key: 'diaChi',
      width: 250,
      ellipsis: true,
    },
    {
      title: 'Sức chứa (m³)',
      dataIndex: 'sucChua',
      key: 'sucChua',
      width: 120,
      render: (value: number) => value?.toLocaleString() || 0,
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
        <h1>Quản lý Kho hàng</h1>
        <p>Quản lý kho hàng của siêu thị</p>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Tổng số kho"
              value={statistics.total}
              prefix={<HomeOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Kho hoạt động"
              value={statistics.active}
              prefix={<InboxOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Tổng sức chứa"
              value={statistics.totalCapacity}
              suffix="m³"
              prefix={<EnvironmentOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={khos}
          rowKey="maKho"
          loading={loading}
          scroll={{ x: 1000 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} kho`,
          }}
        />
      </Card>
    </AdminLayout>
  );
};

export default QuanLyKho;
