import React from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  message,
} from 'antd';
import type { TableProps } from 'antd';
import {
  CheckCircleOutlined,
  DollarOutlined,
  EyeOutlined,
  FileTextOutlined,
  PlusOutlined,
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

interface SieuThiOption {
  maSieuThi: number;
  tenSieuThi: string;
  diaChi?: string;
}

interface TonKhoItem {
  maKho: number;
  maLo: number;
  soLuong: number;
  tenKho: string;
  tenSanPham: string;
  donViTinh: string;
  maQR: string;
  ngayCapNhat: string;
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
  const [counterpartyProfile, setCounterpartyProfile] = React.useState<unknown>(null);
  const [detailLoading, setDetailLoading] = React.useState(false);

  // Modal tạo đơn
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [createLoading, setCreateLoading] = React.useState(false);
  const [createForm, setCreateForm] = React.useState({
    maSieuThi: '',
    chiTietDonHang: [{ maLo: '', soLuong: '', donGia: '' }],
  });

  // Danh sách siêu thị và tồn kho
  const [supermarkets, setSupermarkets] = React.useState<SieuThiOption[]>([]);
  const [inventoryItems, setInventoryItems] = React.useState<TonKhoItem[]>([]);
  const [loadingSupermarkets, setLoadingSupermarkets] = React.useState(false);
  const [loadingInventory, setLoadingInventory] = React.useState(false);

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
    setCounterpartyProfile(null);
    try {
      const response = await apiService.getAgentOrderToSupermarketById(order.maDonHang);
      const data = response.data || response;
      setSelectedOrder(data);

      try {
        const profileResponse = await apiService.getPublicProfile(
          data.loaiNguoiMua || order.loaiNguoiMua || 'sieuthi',
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

  // Fetch danh sách siêu thị và tồn kho khi mở modal
  const fetchSupermarketsAndInventory = async () => {
    setLoadingSupermarkets(true);
    setLoadingInventory(true);

    try {
      const [supermarketsResponse, inventoryResponse] = await Promise.all([
        apiService.getAllSupermarkets(),
        apiService.getAllInventory(),
      ]);

      // Xử lý danh sách siêu thị
      const smData = supermarketsResponse?.data || supermarketsResponse;
      if (smData) {
        setSupermarkets(Array.isArray(smData) ? smData : []);
      }

      // Xử lý tồn kho - chỉ lấy tồn kho có số lượng > 0
      const invData = inventoryResponse?.data || inventoryResponse;
      if (invData) {
        const items = Array.isArray(invData) ? invData : [];
        setInventoryItems(items.filter((item: TonKhoItem) => item.soLuong > 0));
      }
    } catch (error: any) {
      message.error(getApiErrorMessage(error, 'Không thể tải dữ liệu'));
    } finally {
      setLoadingSupermarkets(false);
      setLoadingInventory(false);
    }
  };

  // Handlers cho modal tạo đơn
  const showCreateModal = () => {
    setIsCreateModalOpen(true);
    setCreateForm({
      maSieuThi: '',
      chiTietDonHang: [{ maLo: '', soLuong: '', donGia: '' }],
    });
    fetchSupermarketsAndInventory();
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateForm({
      maSieuThi: '',
      chiTietDonHang: [{ maLo: '', soLuong: '', donGia: '' }],
    });
  };

  const handleAddProduct = () => {
    setCreateForm({
      ...createForm,
      chiTietDonHang: [...createForm.chiTietDonHang, { maLo: '', soLuong: '', donGia: '' }],
    });
  };

  const handleRemoveProduct = (index: number) => {
    const newChiTiet = createForm.chiTietDonHang.filter((_, i) => i !== index);
    setCreateForm({ ...createForm, chiTietDonHang: newChiTiet });
  };

  const handleProductChange = (index: number, field: string, value: string) => {
    const newChiTiet = [...createForm.chiTietDonHang];
    newChiTiet[index] = { ...newChiTiet[index], [field]: value };
    setCreateForm({ ...createForm, chiTietDonHang: newChiTiet });
  };

  const handleCreateOrder = async () => {
    // Validation
    if (!createForm.maSieuThi) {
      message.error('Vui lòng chọn siêu thị');
      return;
    }

    const hasEmptyProduct = createForm.chiTietDonHang.some(
      (item) => !item.maLo || !item.soLuong || !item.donGia
    );
    if (hasEmptyProduct) {
      message.error('Vui lòng điền đầy đủ thông tin sản phẩm');
      return;
    }

    const hasInvalidNumber = createForm.chiTietDonHang.some(
      (item) => parseFloat(item.soLuong) <= 0 || parseFloat(item.donGia) <= 0
    );
    if (hasInvalidNumber) {
      message.error('Số lượng và đơn giá phải lớn hơn 0');
      return;
    }

    // Kiểm tra số lượng không vượt quá tồn kho
    for (const item of createForm.chiTietDonHang) {
      const invItem = inventoryItems.find((inv) => inv.maLo.toString() === item.maLo);
      if (invItem && parseFloat(item.soLuong) > invItem.soLuong) {
        message.error(
          `Số lượng "${invItem.tenSanPham}" (${item.soLuong}) vượt quá tồn kho (${invItem.soLuong} ${invItem.donViTinh})`
        );
        return;
      }
    }

    setCreateLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        message.error('Vui lòng đăng nhập lại');
        return;
      }

      const user = JSON.parse(userStr);
      const maDaiLy = user.maDaiLy || (user as any).MaDaiLy;

      await apiService.createAgentOrderToSupermarket({
        loaiDon: 'daily_to_sieuthi',
        maNguoiBan: maDaiLy,
        loaiNguoiBan: 'daily',
        maNguoiMua: parseInt(createForm.maSieuThi),
        loaiNguoiMua: 'sieuthi',
        chiTietDonHang: createForm.chiTietDonHang.map((item) => ({
          maLo: parseInt(item.maLo),
          soLuong: parseFloat(item.soLuong),
          donGia: parseFloat(item.donGia),
        })),
      });

      message.success('Tạo đơn hàng và sinh vận chuyển thành công!');
      handleCloseCreateModal();
      await fetchOrders();
    } catch (error: any) {
      message.error(getApiErrorMessage(error, 'Không thể tạo đơn hàng'));
    } finally {
      setCreateLoading(false);
    }
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
      render: (value: number) => `${(value || 0).toLocaleString('vi-VN')} đ`,
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
              prefix={<CheckCircleOutlined />}
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
          <div style={{ display: 'flex', gap: 8 }}>
            <ActionButton 
              icon={<ReloadOutlined />} 
              onClick={fetchOrders} 
              loading={loading}
            >
              Làm mới
            </ActionButton>
            <ActionButton
              type="primary"
              icon={<PlusOutlined />}
              onClick={showCreateModal}
            >
              Tạo đơn hàng
            </ActionButton>
          </div>
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
        footer={<ModalButton onClick={handleCloseDetailModal}>Đóng</ModalButton>}
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
              <Descriptions.Item label="Facebook/TikTok">
                <SocialLinks data={counterpartyProfile || selectedOrder} showEmpty />
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đặt">
                {dayjs(selectedOrder.ngayDat).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng giá trị" span={2}>
                <strong style={{ fontSize: 16, color: '#1890ff' }}>
                  {(selectedOrder.tongGiaTri || 0).toLocaleString('vi-VN')} đ
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

      {/* Modal tạo đơn hàng bán ra */}
      <Modal
        title="Tạo đơn hàng bán cho siêu thị"
        open={isCreateModalOpen}
        onCancel={handleCloseCreateModal}
        width={750}
        footer={
          <Space>
            <ModalButton onClick={handleCloseCreateModal}>
              Hủy
            </ModalButton>
            <ModalButton
              type="primary"
              onClick={handleCreateOrder}
              loading={createLoading}
            >
              Tạo đơn hàng
            </ModalButton>
          </Space>
        }
      >
        <Alert
          message="Lưu ý"
          description="Khi tạo đơn hàng thành công, hệ thống sẽ tự động sinh phiếu vận chuyển (đang vận chuyển). Khi vận chuyển hoàn thành, tồn kho bên đại lý sẽ giảm và tồn kho bên siêu thị sẽ tăng tương ứng."
          type="info"
          showIcon
          style={{ marginBottom: 20 }}
        />

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>
            Chọn siêu thị: <span style={{ color: 'red' }}>*</span>
          </label>
          <Select
            showSearch
            placeholder="Tìm và chọn siêu thị"
            style={{ width: '100%' }}
            value={createForm.maSieuThi || undefined}
            onChange={(value) => setCreateForm({ ...createForm, maSieuThi: value })}
            loading={loadingSupermarkets}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={supermarkets.map((sm) => ({
              value: sm.maSieuThi?.toString(),
              label: `${sm.maSieuThi} - ${sm.tenSieuThi || 'Chưa có tên'}${
                sm.diaChi ? ` (${sm.diaChi})` : ''
              }`,
            }))}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>
            Sản phẩm từ kho: <span style={{ color: 'red' }}>*</span>
          </label>
          {createForm.chiTietDonHang.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                gap: 8,
                marginBottom: 8,
                alignItems: 'flex-start',
              }}
            >
              <div style={{ flex: 2 }}>
                <Select
                  showSearch
                  placeholder="Chọn sản phẩm từ kho"
                  style={{ width: '100%' }}
                  value={item.maLo || undefined}
                  onChange={(value) => handleProductChange(index, 'maLo', value)}
                  loading={loadingInventory}
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={inventoryItems.map((inv) => ({
                    value: inv.maLo?.toString(),
                    label: `Lô ${inv.maLo} - ${inv.tenSanPham || 'N/A'} (${inv.soLuong} ${inv.donViTinh || 'kg'}) - Kho: ${inv.tenKho}`,
                  }))}
                />
              </div>
              <InputNumber
                min={1}
                value={item.soLuong ? parseFloat(item.soLuong) : undefined}
                onChange={(value) => handleProductChange(index, 'soLuong', value?.toString() || '')}
                placeholder="Số lượng"
                style={{ flex: 1 }}
                onKeyPress={(event) => {
                  if (event.key === '-' || event.key === 'e') {
                    event.preventDefault();
                  }
                }}
              />
              <InputNumber
                min={1}
                value={item.donGia ? parseFloat(item.donGia) : undefined}
                onChange={(value) => handleProductChange(index, 'donGia', value?.toString() || '')}
                placeholder="Đơn giá (đ)"
                style={{ flex: 1 }}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/,/g, '') as unknown as number}
                onKeyPress={(event) => {
                  if (event.key === '-' || event.key === 'e') {
                    event.preventDefault();
                  }
                }}
              />
              {createForm.chiTietDonHang.length > 1 && (
                <Button danger size="small" onClick={() => handleRemoveProduct(index)}>
                  Xóa
                </Button>
              )}
            </div>
          ))}
          <Button
            type="dashed"
            onClick={handleAddProduct}
            block
            size="small"
            icon={<PlusOutlined />}
            style={{ marginTop: 8 }}
          >
            Thêm sản phẩm
          </Button>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default DonHangBanRa;
