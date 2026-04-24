import React from 'react';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Modal,
  Row,
  Select,
  Statistic,
  Table,
  Tag,
  message,
} from 'antd';
import type { TableProps } from 'antd';
import {
  DollarOutlined,
  EyeOutlined,
  FileTextOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { AdminLayout } from '../../components/Layout';
import { CustomPagination } from '../../components/CustomPagination';
import { apiService } from '../../services/apiService';
import type { ChiTietDonHang, DonHang } from '../../types/donHang';
import dayjs from 'dayjs';

interface DonHangTableItem extends DonHang {
  key: string;
}

const getTrangThaiColor = (trangThai: string) => {
  switch (trangThai) {
    case 'cho_xac_nhan':
      return 'orange';
    case 'hoan_thanh':
      return 'green';
    case 'da_huy':
      return 'red';
    default:
      return 'default';
  }
};

const getTrangThaiText = (trangThai: string) => {
  switch (trangThai) {
    case 'cho_xac_nhan':
      return 'Chờ xác nhận';
    case 'hoan_thanh':
      return 'Hoàn thành';
    case 'da_huy':
      return 'Đã hủy';
    default:
      return trangThai;
  }
};

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

const DonHangBanRa: React.FC = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [loading, setLoading] = React.useState(false);
  const [orders, setOrders] = React.useState<DonHangTableItem[]>([]);
  const [filterStatus, setFilterStatus] = React.useState<string>('all');
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<DonHang | null>(null);
  const [detailLoading, setDetailLoading] = React.useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        message.error('Vui lòng đăng nhập lại');
        setOrders([]);
        return;
      }

      const user = JSON.parse(userStr);
      const maDaiLy = user.maDaiLy || (user as any).MaDaiLy;
      
      if (!maDaiLy) {
        message.warning('Phiên đăng nhập cũ. Vui lòng đăng xuất và đăng nhập lại');
        setOrders([]);
        return;
      }

      const response = await apiService.getAgentOrdersToSupermarket(maDaiLy);
      const items = Array.isArray(response?.data) ? response.data : [];

      setOrders(
        items.map((item: DonHang) => ({
          ...item,
          key: item.maDonHang.toString(),
        })),
      );
    } catch (error: any) {
      setOrders([]);
      message.error(getApiErrorMessage(error, 'Không thể tải danh sách đơn hàng'));
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const showDetailModal = async (order: DonHangTableItem) => {
    setIsDetailModalOpen(true);
    setDetailLoading(true);
    try {
      const response = await apiService.getAgentOrderToSupermarketById(order.maDonHang);
      setSelectedOrder(response.data);
    } catch (error: any) {
      message.error(getApiErrorMessage(error, 'Không thể tải chi tiết đơn hàng'));
      setIsDetailModalOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedOrder(null);
  };

  const filteredOrders = React.useMemo(() => {
    if (filterStatus === 'all') {
      return orders;
    }
    return orders.filter((order) => order.trangThai === filterStatus);
  }, [orders, filterStatus]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  React.useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, filteredOrders.length, pageSize]);

  const paginatedOrders = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredOrders.slice(startIndex, startIndex + pageSize);
  }, [currentPage, filteredOrders, pageSize]);

  const totalValue = React.useMemo(
    () => filteredOrders.reduce((sum, order) => sum + order.tongGiaTri, 0),
    [filteredOrders],
  );

  const pendingCount = React.useMemo(
    () => orders.filter((order) => order.trangThai === 'cho_xac_nhan').length,
    [orders],
  );

  const completedCount = React.useMemo(
    () => orders.filter((order) => order.trangThai === 'hoan_thanh').length,
    [orders],
  );

  const columns: TableProps<DonHangTableItem>['columns'] = [
    {
      title: 'Mã ĐH',
      dataIndex: 'maDonHang',
      key: 'maDonHang',
      width: 80,
    },
    {
      title: 'Siêu thị',
      dataIndex: 'tenNguoiMua',
      key: 'tenNguoiMua',
      width: 180,
      ellipsis: true,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'ngayDat',
      key: 'ngayDat',
      width: 110,
      render: (value: string) => dayjs(value).format('DD/MM/YYYY'),
    },
    {
      title: 'Tổng giá trị',
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
      render: (value: string) => (
        <Tag color={getTrangThaiColor(value)}>{getTrangThaiText(value)}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => showDetailModal(record)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  const detailColumns: TableProps<ChiTietDonHang>['columns'] = [
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
      render: (value: number) => `${value.toLocaleString('vi-VN')} đ`,
    },
    {
      title: 'Thành tiền',
      dataIndex: 'thanhTien',
      key: 'thanhTien',
      width: 130,
      render: (value: number) => `${value.toLocaleString('vi-VN')} đ`,
    },
  ];

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Đơn hàng bán ra</h1>
        <p>Quản lý đơn hàng bán cho siêu thị</p>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={filteredOrders.length}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Chờ xác nhận"
              value={pendingCount}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Hoàn thành"
              value={completedCount}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng giá trị"
              value={totalValue}
              prefix={<DollarOutlined />}
              suffix="đ"
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
            style={{ width: 200 }}
            value={filterStatus}
            onChange={setFilterStatus}
            options={[
              { label: 'Tất cả trạng thái', value: 'all' },
              { label: 'Chờ xác nhận', value: 'cho_xac_nhan' },
              { label: 'Hoàn thành', value: 'hoan_thanh' },
              { label: 'Đã hủy', value: 'da_huy' },
            ]}
          />
          <Button type="primary" icon={<PlusOutlined />}>
            Tạo đơn hàng
          </Button>
        </div>

        <Table<DonHangTableItem>
          columns={columns}
          dataSource={paginatedOrders}
          pagination={false}
          loading={loading}
          scroll={{ x: 750 }}
        />

        <CustomPagination
          current={currentPage}
          total={filteredOrders.length}
          pageSize={pageSize}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size || 10);
          }}
          showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`}
        />
      </Card>

      <Modal
        title="Chi tiết đơn hàng"
        open={isDetailModalOpen}
        onCancel={handleCloseDetailModal}
        width={900}
        footer={<Button onClick={handleCloseDetailModal}>Đóng</Button>}
      >
        {detailLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>Đang tải...</div>
        ) : selectedOrder ? (
          <>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Mã đơn hàng">{selectedOrder.maDonHang}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getTrangThaiColor(selectedOrder.trangThai)}>
                  {getTrangThaiText(selectedOrder.trangThai)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Siêu thị">{selectedOrder.tenNguoiMua}</Descriptions.Item>
              <Descriptions.Item label="Ngày đặt">
                {dayjs(selectedOrder.ngayDat).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng giá trị" span={2}>
                <strong style={{ fontSize: 16, color: '#1890ff' }}>
                  {selectedOrder.tongGiaTri.toLocaleString('vi-VN')} đ
                </strong>
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 24 }}>
              <h4>Chi tiết sản phẩm</h4>
              <Table<ChiTietDonHang>
                columns={detailColumns}
                dataSource={selectedOrder.chiTietDonHang || []}
                pagination={false}
                size="small"
                rowKey={(record) => `${record.maDonHang}-${record.maLo}`}
              />
            </div>
          </>
        ) : null}
      </Modal>
    </AdminLayout>
  );
};

export default DonHangBanRa;
