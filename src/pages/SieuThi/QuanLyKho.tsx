import React, { useState, useEffect } from 'react';
import { Table, Tag, message, Card, Statistic, Row, Col, Button } from 'antd';
import { HomeOutlined, InboxOutlined, ReloadOutlined, DatabaseOutlined } from '@ant-design/icons';
import { AdminLayout } from '../../components/Layout';
import { authService } from '../../services/authService';
import { apiService } from '../../services/apiService';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import './QuanLyKho.css';

interface TonKho {
  maKho: number;
  maLo: number;
  soLuong: number;
  ngayCapNhat: string;
  tenKho?: string;
  tenSanPham?: string;
  donViTinh?: string;
  maQR?: string;
}

interface Kho {
  maKho: number;
  tenKho: string;
  loaiKho: string;
  maChuSoHuu: number;
  loaiChuSoHuu: string;
  diaChi?: string;
  tenChuSoHuu?: string;
}

const QuanLyKho: React.FC = () => {
  const [tonKhos, setTonKhos] = useState<TonKho[]>([]);
  const [khos, setKhos] = useState<Kho[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 992);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 992);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const user = authService.getStoredUser();
      
      if (!user?.maSieuThi) {
        message.error('Không tìm thấy thông tin siêu thị');
        return;
      }

      // Load cả kho hàng và tồn kho
      const [khoRes, tonKhoRes] = await Promise.allSettled([
        apiService.getSupermarketWarehouses(user.maSieuThi),
        apiService.getSupermarketInventory(user.maSieuThi),
      ]);

      if (khoRes.status === 'fulfilled') {
        const data = khoRes.value?.data || khoRes.value;
        setKhos(Array.isArray(data) ? data : []);
      }

      if (tonKhoRes.status === 'fulfilled') {
        const data = tonKhoRes.value?.data || tonKhoRes.value;
        setTonKhos(Array.isArray(data) ? data : []);
      }
    } catch (error: any) {
      console.error('Error loading data:', error);
      message.error('Không thể tải dữ liệu kho hàng');
    } finally {
      setLoading(false);
    }
  };

  const totalSoLuong = tonKhos.reduce((sum, tk) => sum + (tk.soLuong || 0), 0);

  const tonKhoColumns: ColumnsType<TonKho> = [
    {
      title: 'Tên kho',
      dataIndex: 'tenKho',
      key: 'tenKho',
      render: (text: string) => text || '--',
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'tenSanPham',
      key: 'tenSanPham',
      render: (text: string) => text || '--',
    },
    ...(!isMobile ? [{
      title: 'Mã lô',
      dataIndex: 'maLo',
      key: 'maLo',
      width: 80,
    }] : []),
    ...(!isTablet && !isMobile ? [{
      title: 'Mã QR',
      dataIndex: 'maQR',
      key: 'maQR',
      width: 110,
      render: (text: string) => text ? <Tag color="blue">{text}</Tag> : '--',
    }] : []),
    {
      title: 'Số lượng',
      key: 'soLuong',
      width: 130,
      render: (_: any, record: TonKho) => (
        <strong style={{ color: record.soLuong > 0 ? '#52c41a' : '#ff4d4f' }}>
          {record.soLuong} {record.donViTinh || ''}
        </strong>
      ),
    },
    ...(!isMobile ? [{
      title: 'Ngày cập nhật',
      dataIndex: 'ngayCapNhat',
      key: 'ngayCapNhat',
      width: 140,
      render: (date: string) => date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '--',
    }] : []),
  ];

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Kho hàng & Tồn kho</h1>
        <p>Quản lý kho hàng và theo dõi tồn kho của siêu thị</p>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Tổng số kho"
              value={khos.length}
              prefix={<HomeOutlined />}
              styles={{ content: { color: '#1890ff' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Số mặt hàng tồn kho"
              value={tonKhos.length}
              prefix={<InboxOutlined />}
              styles={{ content: { color: '#52c41a' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Tổng số lượng"
              value={totalSoLuong}
              prefix={<DatabaseOutlined />}
              styles={{ content: { color: '#faad14' } }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Danh sách tồn kho"
        extra={
          <Button
            icon={<ReloadOutlined />}
            onClick={loadData}
            loading={loading}
          >
            Làm mới
          </Button>
        }
      >
        <Table
          columns={tonKhoColumns}
          dataSource={tonKhos}
          rowKey={(record) => `${record.maKho}-${record.maLo}`}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} mặt hàng`,
          }}
        />
      </Card>
    </AdminLayout>
  );
};

export default QuanLyKho;
