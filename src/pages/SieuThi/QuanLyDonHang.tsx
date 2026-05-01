import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, message, Card, Statistic, Row, Col, Select, Modal, Descriptions, Popconfirm, Spin } from 'antd';
import { ShoppingCartOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import { AdminLayout } from '../../components/Layout';
import { authService } from '../../services/authService';
import { apiService } from '../../services/apiService';
import { ActionButton } from '../../components/ActionButton';
import { ModalButton } from '../../components/ModalButton';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

interface ChiTietDonHang {
  maDonHang: number;
  maLo: number;
  soLuong: number;
  donGia: number;
  thanhTien: number;
  tenSanPham?: string;
  donViTinh?: string;
  maQR?: string;
}

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
  chiTietDonHang?: ChiTietDonHang[];
}

const getApiErrorMessage = (error: any, fallbackMessage: string) => {
  const responseData = error?.response?.data;
  if (typeof responseData === 'string' && responseData.trim()) {
    return responseData;
  }
  if (typeof responseData?.message === 'string' && responseData.message.trim()) {
    return responseData.message;
  }
  if (typeof responseData?.title === 'string' && responseData.title.trim()) {
    return responseData.title;
  }
  return fallbackMessage;
};

const QuanLyDonHang: React.FC = () => {
  const [donHangs, setDonHangs] = useState<DonHang[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modal chi tiết
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<DonHang | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

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

  const showDetailModal = async (record: DonHang) => {
    setIsDetailModalOpen(true);
    setDetailLoading(true);
    try {
      const response = await apiService.getSupermarketOrderById(record.maDonHang);
      const data = response?.data || response;
      setSelectedOrder(data);
    } catch (error: any) {
      setSelectedOrder(record);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedOrder(null);
  };

  const handleConfirmOrder = async (id: number) => {
    try {
      await apiService.updateSupermarketOrderStatus(id, 'hoan_thanh');
      message.success('Xác nhận đơn hàng thành công');
      handleCloseDetailModal();
      await loadDonHangs();
    } catch (error: any) {
      message.error(getApiErrorMessage(error, 'Không thể xác nhận đơn hàng'));
    }
  };

  const handleCancelOrder = async (id: number) => {
    try {
      await apiService.updateSupermarketOrderStatus(id, 'da_huy');
      message.success('Đã hủy đơn hàng');
      handleCloseDetailModal();
      await loadDonHangs();
    } catch (error: any) {
      message.error(getApiErrorMessage(error, 'Không thể hủy đơn hàng'));
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
    },
    {
      title: 'Đại lý',
      dataIndex: 'tenNguoiBan',
      key: 'tenNguoiBan',
      ellipsis: true,
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
      width: 140,
      render: (value: number) => `${(value || 0).toLocaleString('vi-VN')} đ`,
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
      title: 'Thao tác',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <ActionButton
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => showDetailModal(record)}
        >
          Chi tiết
        </ActionButton>
      ),
    },
  ];

  const detailColumns: ColumnsType<ChiTietDonHang> = [
    {
      title: 'Sản phẩm',
      dataIndex: 'tenSanPham',
      key: 'tenSanPham',
    },
    {
      title: 'Mã lô',
      dataIndex: 'maLo',
      key: 'maLo',
      width: 80,
    },
    {
      title: 'Số lượng',
      key: 'soLuong',
      width: 120,
      render: (_, record) => `${record.soLuong} ${record.donViTinh || ''}`,
    },
    {
      title: 'Đơn giá',
      dataIndex: 'donGia',
      key: 'donGia',
      width: 120,
      render: (value: number) => `${(value || 0).toLocaleString('vi-VN')} đ`,
    },
    {
      title: 'Thành tiền',
      dataIndex: 'thanhTien',
      key: 'thanhTien',
      width: 130,
      render: (value: number) => `${(value || 0).toLocaleString('vi-VN')} đ`,
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
            marginBottom: 24,
            padding: '16px 0',
            borderBottom: '1px solid #f0f0f0',
            flexWrap: 'wrap',
          }}
        >
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ width: 200 }}
          >
            <Select.Option value="all">Tất cả trạng thái</Select.Option>
            <Select.Option value="cho_xac_nhan">Chờ xác nhận</Select.Option>
            <Select.Option value="hoan_thanh">Hoàn thành</Select.Option>
            <Select.Option value="da_huy">Đã hủy</Select.Option>
          </Select>
          <ActionButton 
            icon={<ReloadOutlined />} 
            onClick={loadDonHangs} 
            loading={loading}
          >
            Làm mới
          </ActionButton>
        </div>

        <Table
          columns={columns}
          dataSource={filteredDonHangs}
          rowKey="maDonHang"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} đơn hàng`,
          }}
        />
      </Card>

      {/* Modal chi tiết đơn hàng */}
      <Modal
        title={`Chi tiết đơn hàng #${selectedOrder?.maDonHang || ''}`}
        open={isDetailModalOpen}
        onCancel={handleCloseDetailModal}
        width={800}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, alignItems: 'center' }}>
            <ModalButton onClick={handleCloseDetailModal}>
              Đóng
            </ModalButton>
            {selectedOrder?.trangThai === 'cho_xac_nhan' && (
              <>
                <Popconfirm
                  title="Hủy đơn hàng"
                  description="Bạn có chắc muốn hủy đơn hàng này?"
                  onConfirm={() => {
                    if (selectedOrder) {
                      handleCancelOrder(selectedOrder.maDonHang);
                    }
                  }}
                  okText="Hủy đơn"
                  cancelText="Không"
                  okButtonProps={{ danger: true }}
                >
                  <ModalButton type="danger">
                    Hủy đơn hàng
                  </ModalButton>
                </Popconfirm>
                <Popconfirm
                  title="Xác nhận đơn hàng"
                  description="Bạn có chắc muốn xác nhận đơn hàng này?"
                  onConfirm={() => {
                    if (selectedOrder) {
                      handleConfirmOrder(selectedOrder.maDonHang);
                    }
                  }}
                  okText="Xác nhận"
                  cancelText="Không"
                >
                  <ModalButton type="success">
                    Xác nhận đơn hàng
                  </ModalButton>
                </Popconfirm>
              </>
            )}
          </div>
        }
      >
        {detailLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin tip="Đang tải chi tiết..." />
          </div>
        ) : selectedOrder ? (
          <>
            <Descriptions bordered column={2} size="small" style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Mã đơn hàng">
                <strong>#{selectedOrder.maDonHang}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getStatusColor(selectedOrder.trangThai)}>
                  {getStatusText(selectedOrder.trangThai)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Đại lý">{selectedOrder.tenNguoiBan}</Descriptions.Item>
              <Descriptions.Item label="Ngày đặt">
                {selectedOrder.ngayDat ? dayjs(selectedOrder.ngayDat).format('DD/MM/YYYY HH:mm') : '--'}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng giá trị" span={2}>
                <strong style={{ fontSize: 16, color: '#1890ff' }}>
                  {(selectedOrder.tongGiaTri || 0).toLocaleString('vi-VN')} đ
                </strong>
              </Descriptions.Item>
              {selectedOrder.ghiChu && (
                <Descriptions.Item label="Ghi chú" span={2}>
                  {selectedOrder.ghiChu}
                </Descriptions.Item>
              )}
            </Descriptions>

            {selectedOrder.chiTietDonHang && selectedOrder.chiTietDonHang.length > 0 && (
              <div>
                <h4 style={{ marginBottom: 12 }}>Chi tiết sản phẩm</h4>
                <Table<ChiTietDonHang>
                  columns={detailColumns}
                  dataSource={selectedOrder.chiTietDonHang}
                  pagination={false}
                  size="small"
                  rowKey={(record) => `${record.maDonHang}-${record.maLo}`}
                />
              </div>
            )}
          </>
        ) : null}
      </Modal>
    </AdminLayout>
  );
};

export default QuanLyDonHang;
