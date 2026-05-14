import React, { useState, useEffect } from 'react';
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SwapOutlined, HistoryOutlined, ReloadOutlined } from '@ant-design/icons';
import { AdminLayout } from '../../components/Layout';
import { authService } from '../../services/authService';
import { apiService } from '../../services/apiService';
import { ModalButton } from '../../components/ModalButton';
import dayjs from 'dayjs';

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
}

interface PhieuChuyenKho {
  maPhieu: number;
  maKhoNguon: number;
  maKhoDich: number;
  maLo: number;
  soLuong: number;
  ngayTao: string;
  nguoiTao: string;
  ghiChu?: string;
  tenKhoNguon?: string;
  tenKhoDich?: string;
  tenSanPham?: string;
}

const TonKhoSieuThi: React.FC = () => {
  const [tonKhos, setTonKhos] = useState<TonKho[]>([]);
  const [khos, setKhos] = useState<Kho[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Transfer modal
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferItem, setTransferItem] = useState<TonKho | null>(null);
  const [transferSubmitting, setTransferSubmitting] = useState(false);
  const [transferForm] = Form.useForm();

  // History modal
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [history, setHistory] = useState<PhieuChuyenKho[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
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
      message.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const openTransferModal = (record: TonKho) => {
    setTransferItem(record);
    transferForm.resetFields();
    transferForm.setFieldsValue({
      soLuong: 1,
    });
    setIsTransferModalOpen(true);
  };

  const closeTransferModal = () => {
    setIsTransferModalOpen(false);
    setTransferItem(null);
    transferForm.resetFields();
  };

  const handleTransfer = async (values: any) => {
    if (!transferItem) return;

    try {
      setTransferSubmitting(true);
      await apiService.transferSupermarketWarehouse({
        maKhoNguon: transferItem.maKho,
        maKhoDich: values.maKhoDich,
        maLo: transferItem.maLo,
        soLuong: values.soLuong,
        ghiChu: values.ghiChu,
      });
      message.success('Chuyển kho thành công');
      closeTransferModal();
      await loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Không thể chuyển kho');
    } finally {
      setTransferSubmitting(false);
    }
  };

  const openHistory = async () => {
    try {
      setHistoryOpen(true);
      setHistoryLoading(true);
      const user = authService.getStoredUser();
      
      if (!user?.maSieuThi) {
        message.error('Không tìm thấy thông tin siêu thị');
        return;
      }

      const response = await apiService.getSupermarketWarehouseTransferHistory(user.maSieuThi);
      const data = response?.data || response;
      setHistory(Array.isArray(data) ? data : []);
    } catch (error: any) {
      message.error('Không thể tải lịch sử chuyển kho');
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const columns: ColumnsType<TonKho> = [
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
    ...(!isMobile ? [{
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
    {
      title: 'Thao tác',
      key: 'action',
      width: isMobile ? 80 : 100,
      render: (_: any, record: TonKho) => (
        <Button
          type="primary"
          size="small"
          icon={<SwapOutlined />}
          onClick={() => openTransferModal(record)}
          disabled={record.soLuong <= 0 || khos.length < 2}
          style={{ fontSize: '12px', padding: '0 8px', height: '28px' }}
        >
          {!isMobile && 'Chuyển'}
        </Button>
      ),
    },
  ];

  const historyColumns: ColumnsType<PhieuChuyenKho> = [
    {
      title: 'Mã phiếu',
      dataIndex: 'maPhieu',
      key: 'maPhieu',
      width: 80,
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'tenSanPham',
      key: 'tenSanPham',
    },
    {
      title: 'Từ kho',
      dataIndex: 'tenKhoNguon',
      key: 'tenKhoNguon',
    },
    {
      title: 'Đến kho',
      dataIndex: 'tenKhoDich',
      key: 'tenKhoDich',
    },
    {
      title: 'Số lượng',
      dataIndex: 'soLuong',
      key: 'soLuong',
      width: 100,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'ngayTao',
      key: 'ngayTao',
      width: 140,
      render: (date: string) => date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '--',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'ghiChu',
      key: 'ghiChu',
      ellipsis: true,
      render: (text: string) => text || '--',
    },
  ];

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Tồn kho & Chuyển kho</h1>
        <p>Quản lý tồn kho và chuyển kho nội bộ giữa các kho của siêu thị</p>
      </div>

      <Card
        title="Danh sách tồn kho"
        extra={
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadData}
              loading={loading}
            >
              {!isMobile && 'Làm mới'}
            </Button>
            <Button
              icon={<HistoryOutlined />}
              onClick={openHistory}
            >
              {!isMobile && 'Lịch sử chuyển kho'}
            </Button>
          </Space>
        }
      >
        {khos.length < 2 && (
          <Alert
            message="Cần ít nhất 2 kho để sử dụng chức năng chuyển kho"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        
        <Table
          columns={columns}
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

      {/* Modal chuyển kho */}
      <Modal
        title="Chuyển kho nội bộ"
        open={isTransferModalOpen}
        onCancel={closeTransferModal}
        footer={null}
        width={600}
      >
        <Alert
          message="Gợi ý"
          description="Dùng 'Chuyển kho' để điều chuyển nội bộ giữa các kho của siêu thị (có lưu lịch sử)."
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        {transferItem && (
          <div style={{ marginBottom: 24, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
            <p><strong>Sản phẩm:</strong> {transferItem.tenSanPham}</p>
            <p><strong>Kho hiện tại:</strong> {transferItem.tenKho}</p>
            <p><strong>Số lượng hiện có:</strong> {transferItem.soLuong} {transferItem.donViTinh}</p>
            <p><strong>Mã lô:</strong> {transferItem.maLo}</p>
          </div>
        )}

        <Form
          form={transferForm}
          layout="vertical"
          onFinish={handleTransfer}
        >
          <Form.Item
            label="Chuyển đến kho"
            name="maKhoDich"
            rules={[
              { required: true, message: 'Vui lòng chọn kho đích!' },
              {
                validator: (_, value) => {
                  if (value && transferItem && value === transferItem.maKho) {
                    return Promise.reject('Không thể chuyển đến cùng kho!');
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Select placeholder="Chọn kho đích">
              {khos
                .filter(k => k.maKho !== transferItem?.maKho)
                .map(kho => (
                  <Select.Option key={kho.maKho} value={kho.maKho}>
                    {kho.tenKho} ({kho.loaiKho})
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Số lượng chuyển"
            name="soLuong"
            rules={[
              { required: true, message: 'Vui lòng nhập số lượng!' },
              {
                validator: (_, value) => {
                  if (value && transferItem && value > transferItem.soLuong) {
                    return Promise.reject(`Số lượng không được vượt quá ${transferItem.soLuong}!`);
                  }
                  if (value && value <= 0) {
                    return Promise.reject('Số lượng phải lớn hơn 0!');
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              min={1}
              max={transferItem?.soLuong || 1}
              style={{ width: '100%' }}
              placeholder="Nhập số lượng"
              addonAfter={transferItem?.donViTinh || ''}
            />
          </Form.Item>

          <Form.Item label="Ghi chú" name="ghiChu">
            <Input.TextArea rows={3} placeholder="(Không bắt buộc) Lý do chuyển kho..." />
          </Form.Item>

          <div style={{ textAlign: 'right' }}>
            <Space>
              <ModalButton onClick={closeTransferModal}>Hủy</ModalButton>
              <ModalButton type="primary" htmlType="submit" loading={transferSubmitting}>
                Xác nhận chuyển kho
              </ModalButton>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* Modal lịch sử chuyển kho */}
      <Modal
        title="Lịch sử chuyển kho"
        open={historyOpen}
        onCancel={() => setHistoryOpen(false)}
        footer={null}
        width={1000}
      >
        <Table
          columns={historyColumns}
          dataSource={history}
          rowKey="maPhieu"
          loading={historyLoading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng ${total} phiếu`,
          }}
        />
      </Modal>
    </AdminLayout>
  );
};

export default TonKhoSieuThi;
