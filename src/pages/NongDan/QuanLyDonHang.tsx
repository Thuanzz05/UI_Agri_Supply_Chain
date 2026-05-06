import React from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Modal,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  message,
} from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { TableProps } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  EyeOutlined,
  FileTextOutlined,
  ReloadOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { AdminLayout } from '../../components/Layout';
import { CustomPagination } from '../../components/CustomPagination';
import { apiService } from '../../services/apiService';
import type { ChiTietDonHang, DonHang } from '../../types/donHang';
import { ModalButton } from '../../components/ModalButton';
import { ActionButton } from '../../components/ActionButton';
import SocialLinks from '../../components/SocialLinks';
import dayjs from 'dayjs';

interface DonHangTableItem extends DonHang {
  key: string;
}

const getTrangThaiColor = (trangThai: string) => {
  switch (trangThai) {
    case 'cho_xac_nhan':
      return 'orange';
    case 'cho_kiem_dinh':
      return 'blue';
    case 'dang_van_chuyen':
      return 'cyan';
    case 'hoan_thanh':
      return 'green';
    case 'tra_hang':
      return 'volcano';
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
    case 'cho_kiem_dinh':
      return 'Chờ kiểm định';
    case 'dang_van_chuyen':
      return 'Đang vận chuyển';
    case 'hoan_thanh':
      return 'Hoàn thành';
    case 'tra_hang':
      return 'Trả hàng';
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

const QuanLyDonHangNongDan: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [loading, setLoading] = React.useState(false);
  const [orders, setOrders] = React.useState<DonHangTableItem[]>([]);
  const [filterStatus, setFilterStatus] = React.useState<string>('all');
  const [stats, setStats] = React.useState({
    tongDonHang: 0,
    choXacNhan: 0,
    hoanThanh: 0,
    tongGiaTri: 0
  });
  
  // Modal chi tiết
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<DonHang | null>(null);
  const [counterpartyProfile, setCounterpartyProfile] = React.useState<unknown>(null);
  const [detailLoading, setDetailLoading] = React.useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Lấy thông tin user để lấy mã nông dân
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        message.error('Vui lòng đăng nhập lại');
        setOrders([]);
        return;
      }

      const user = JSON.parse(userStr);
      // Xử lý cả PascalCase và camelCase
      const maNongDan = user.maNongDan || user.MaNongDan;
      
      if (!maNongDan) {
        message.warning('Phiên đăng nhập cũ. Vui lòng đăng xuất và đăng nhập lại để cập nhật thông tin');
        setOrders([]);
        return;
      }

      const response = await apiService.getFarmerOrdersByFarmer(maNongDan);
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

  const fetchOrderStats = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;

      const user = JSON.parse(userStr);
      const maNongDan = user.maNongDan || user.MaNongDan;
      
      if (!maNongDan) return;

      const response = await apiService.getFarmerOrderStats(maNongDan);
      if (response.success) {
        setStats(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching order stats:', error);
    }
  };

  React.useEffect(() => {
    fetchOrders();
    fetchOrderStats();
  }, []);

  const showDetailModal = async (order: DonHangTableItem) => {
    setIsDetailModalOpen(true);
    setDetailLoading(true);
    setCounterpartyProfile(null);
    try {
      const response = await apiService.getFarmerOrderById(order.maDonHang);
      const data = response.data || response;
      setSelectedOrder(data);

      try {
        const profileResponse = await apiService.getPublicProfile(
          data.loaiNguoiMua || order.loaiNguoiMua || 'daily',
          data.maNguoiMua || order.maNguoiMua,
        );
        setCounterpartyProfile(profileResponse?.data || profileResponse);
      } catch {
        setCounterpartyProfile(null);
      }
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
    setCounterpartyProfile(null);
  };

  const handleUpdateStatus = async (maDonHang: number, trangThai: string) => {
    Modal.confirm({
      title: trangThai === 'cho_kiem_dinh' ? 'Xác nhận đơn hàng' : 'Từ chối đơn hàng',
      content: trangThai === 'cho_kiem_dinh' 
        ? 'Xác nhận đơn hàng này sẽ chuyển lô sang trạng thái chờ kiểm định. Bạn có chắc chắn không?' 
        : 'Bạn có chắc chắn muốn từ chối đơn hàng này?',
      okText: trangThai === 'cho_kiem_dinh' ? 'Xác nhận' : 'Từ chối',
      okType: trangThai === 'cho_kiem_dinh' ? 'primary' : 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await apiService.updateFarmerOrderStatus(maDonHang, trangThai);
          message.success(
            trangThai === 'cho_kiem_dinh' 
              ? 'Đơn hàng đã chuyển sang chờ kiểm định' 
              : 'Từ chối đơn hàng thành công'
          );
          handleCloseDetailModal();
          await fetchOrders();
          await fetchOrderStats();
        } catch (error: any) {
          message.error(getApiErrorMessage(error, 'Không thể cập nhật trạng thái đơn hàng'));
        }
      },
    });
  };

  const handleChatWithBuyer = () => {
    if (!selectedOrder) return;
    
    const chatInfo = {
      maNguoi: selectedOrder.maNguoiMua,
      loaiNguoi: selectedOrder.loaiNguoiMua || 'daily',
      tenNguoi: selectedOrder.tenNguoiMua,
    };
    localStorage.setItem('pendingChat', JSON.stringify(chatInfo));
    navigate('/farmer/messages');
    message.info(`Đang mở chat với ${selectedOrder.tenNguoiMua}`);
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

  const columns: TableProps<DonHangTableItem>['columns'] = [
    {
      title: 'Mã ĐH',
      dataIndex: 'maDonHang',
      key: 'maDonHang',
      width: 80,
    },
    {
      title: 'Người mua',
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
        <h1>Quản lý đơn hàng</h1>
        <p>Xem và xử lý đơn hàng mua từ đại lý</p>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={stats.tongDonHang}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Chờ xác nhận"
              value={stats.choXacNhan}
              prefix={<ShoppingCartOutlined />}
              styles={{ content: { color: '#faad14' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Hoàn thành"
              value={stats.hoanThanh}
              prefix={<CheckCircleOutlined />}
              styles={{ content: { color: '#52c41a' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng giá trị"
              value={stats.tongGiaTri}
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
              { label: 'Chờ kiểm định', value: 'cho_kiem_dinh' },
              { label: 'Đang vận chuyển', value: 'dang_van_chuyen' },
              { label: 'Hoàn thành', value: 'hoan_thanh' },
              { label: 'Trả hàng', value: 'tra_hang' },
              { label: 'Đã hủy', value: 'da_huy' },
            ]}
          />
          <ActionButton icon={<ReloadOutlined />} onClick={fetchOrders} loading={loading}>
            Làm mới
          </ActionButton>
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

      {/* Modal chi tiết đơn hàng */}
      <Modal
        title="Chi tiết đơn hàng"
        open={isDetailModalOpen}
        onCancel={handleCloseDetailModal}
        width={900}
        footer={
          selectedOrder?.trangThai === 'cho_xac_nhan' ? (
            <Space>
              <ModalButton onClick={handleCloseDetailModal}>Đóng</ModalButton>
              <ModalButton
                type="danger"
                icon={<CloseCircleOutlined />}
                onClick={() => handleUpdateStatus(selectedOrder.maDonHang, 'da_huy')}
              >
                Từ chối
              </ModalButton>
              <ModalButton
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handleUpdateStatus(selectedOrder.maDonHang, 'cho_kiem_dinh')}
              >
                Xác nhận
              </ModalButton>
            </Space>
          ) : (
            <ModalButton onClick={handleCloseDetailModal}>Đóng</ModalButton>
          )
        }
      >
        {detailLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>Đang tải...</div>
        ) : selectedOrder ? (
          <>
            {selectedOrder.trangThai === 'cho_xac_nhan' && (
              <Alert
                title="Đơn hàng chờ xác nhận"
                description="Vui lòng kiểm tra kỹ thông tin đơn hàng trước khi xác nhận hoặc từ chối."
                type="warning"
                showIcon
                style={{ marginBottom: 20 }}
              />
            )}

            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Mã đơn hàng">{selectedOrder.maDonHang}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getTrangThaiColor(selectedOrder.trangThai)}>
                  {getTrangThaiText(selectedOrder.trangThai)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Người mua">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{selectedOrder.tenNguoiMua}</span>
                  <Button
                    type="link"
                    size="small"
                    icon={<MessageOutlined />}
                    onClick={handleChatWithBuyer}
                    style={{ padding: 0 }}
                  >
                    Nhắn tin
                  </Button>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Facebook/TikTok">
                <SocialLinks data={counterpartyProfile || selectedOrder} showEmpty />
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đặt">
                {dayjs(selectedOrder.ngayDat).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng giá trị">
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

export default QuanLyDonHangNongDan;
