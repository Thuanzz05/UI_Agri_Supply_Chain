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
import type { TableProps } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
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
import type { NongDan } from '../../types/nongDan';
import type { LoNongSan } from '../../types/loNongSan';
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

const DonHangMuaVao: React.FC = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [loading, setLoading] = React.useState(false);
  const [orders, setOrders] = React.useState<DonHangTableItem[]>([]);
  const [filterStatus, setFilterStatus] = React.useState<string>('all');
  
  // Modal chi tiết
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<DonHang | null>(null);
  const [detailLoading, setDetailLoading] = React.useState(false);

  // Modal tạo đơn
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [createLoading, setCreateLoading] = React.useState(false);
  const [createForm, setCreateForm] = React.useState({
    maNongDan: '',
    chiTietDonHang: [{ maLo: '', soLuong: '', donGia: '' }],
  });

  // Danh sách nông dân và lô hàng
  const [farmers, setFarmers] = React.useState<NongDan[]>([]);
  const [batches, setBatches] = React.useState<LoNongSan[]>([]);
  const [loadingFarmers, setLoadingFarmers] = React.useState(false);
  const [loadingBatches, setLoadingBatches] = React.useState(false);

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

      const response = await apiService.getAgentOrdersFromFarmer(maDaiLy);
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

  // Fetch danh sách nông dân và lô hàng khi mở modal
  const fetchFarmersAndBatches = async () => {
    setLoadingFarmers(true);
    setLoadingBatches(true);
    
    try {
      const [farmersResponse, batchesResponse] = await Promise.all([
        apiService.getAllFarmers(),
        apiService.getAllBatches(),
      ]);

      if (farmersResponse?.data) {
        setFarmers(Array.isArray(farmersResponse.data) ? farmersResponse.data : []);
      }

      if (batchesResponse?.data) {
        setBatches(Array.isArray(batchesResponse.data) ? batchesResponse.data : []);
      }
    } catch (error: any) {
      message.error(getApiErrorMessage(error, 'Không thể tải danh sách'));
    } finally {
      setLoadingFarmers(false);
      setLoadingBatches(false);
    }
  };

  const showDetailModal = async (order: DonHangTableItem) => {
    setIsDetailModalOpen(true);
    setDetailLoading(true);
    try {
      const response = await apiService.getAgentOrderFromFarmerById(order.maDonHang);
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

  const handleUpdateStatus = async (maDonHang: number, trangThai: string) => {
    Modal.confirm({
      title: trangThai === 'hoan_thanh' ? 'Xác nhận đơn hàng' : 'Từ chối đơn hàng',
      content: trangThai === 'hoan_thanh' 
        ? 'Bạn có chắc chắn muốn xác nhận đơn hàng này?' 
        : 'Bạn có chắc chắn muốn từ chối đơn hàng này?',
      okText: trangThai === 'hoan_thanh' ? 'Xác nhận' : 'Từ chối',
      okType: trangThai === 'hoan_thanh' ? 'primary' : 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await apiService.updateAgentOrderFromFarmerStatus(maDonHang, trangThai);
          message.success(
            trangThai === 'hoan_thanh' 
              ? 'Xác nhận đơn hàng thành công' 
              : 'Từ chối đơn hàng thành công'
          );
          handleCloseDetailModal();
          await fetchOrders();
        } catch (error: any) {
          message.error(getApiErrorMessage(error, 'Không thể cập nhật trạng thái'));
        }
      },
    });
  };

  // Handlers cho modal tạo đơn
  const showCreateModal = () => {
    setIsCreateModalOpen(true);
    setCreateForm({
      maNongDan: '',
      chiTietDonHang: [{ maLo: '', soLuong: '', donGia: '' }],
    });
    fetchFarmersAndBatches();
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateForm({
      maNongDan: '',
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
    if (!createForm.maNongDan) {
      message.error('Vui lòng nhập mã nông dân');
      return;
    }

    const hasEmptyProduct = createForm.chiTietDonHang.some(
      (item) => !item.maLo || !item.soLuong || !item.donGia
    );
    if (hasEmptyProduct) {
      message.error('Vui lòng điền đầy đủ thông tin sản phẩm');
      return;
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

      await apiService.createAgentOrderFromFarmer({
        loaiDon: 'nongdan_to_daily',
        maNguoiBan: parseInt(createForm.maNongDan),
        loaiNguoiBan: 'nongdan',
        maNguoiMua: maDaiLy,
        loaiNguoiMua: 'daily',
        chiTietDonHang: createForm.chiTietDonHang.map((item) => ({
          maLo: parseInt(item.maLo),
          soLuong: parseFloat(item.soLuong),
          donGia: parseFloat(item.donGia),
        })),
      });

      message.success('Tạo đơn hàng thành công');
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
      title: 'Nông dân',
      dataIndex: 'tenNguoiBan',
      key: 'tenNguoiBan',
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
          style={{ fontSize: '14px', height: '32px', padding: '0 15px' }}
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
        <h1>Đơn hàng mua vào</h1>
        <p>Quản lý đơn hàng mua từ nông dân</p>
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
            <Button 
              size="small" 
              icon={<ReloadOutlined />} 
              onClick={fetchOrders} 
              loading={loading}
              style={{ fontSize: '14px', height: '32px', padding: '0 15px' }}
            >
              Làm mới
            </Button>
            <Button 
              size="small" 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={showCreateModal}
              style={{ fontSize: '14px', height: '32px', padding: '0 15px' }}
            >
              Tạo đơn hàng
            </Button>
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
        footer={
          selectedOrder?.trangThai === 'cho_xac_nhan' ? (
            <Space>
              <Button 
                onClick={handleCloseDetailModal}
                style={{ fontSize: '14px', height: '32px', padding: '0 15px' }}
              >
                Đóng
              </Button>
              <Button
                danger
                size="small"
                icon={<CloseCircleOutlined />}
                onClick={() => handleUpdateStatus(selectedOrder.maDonHang, 'da_huy')}
                style={{ fontSize: '14px', height: '32px', padding: '0 15px' }}
              >
                Từ chối
              </Button>
              <Button
                type="primary"
                size="small"
                icon={<CheckCircleOutlined />}
                onClick={() => handleUpdateStatus(selectedOrder.maDonHang, 'hoan_thanh')}
                style={{ fontSize: '14px', height: '32px', padding: '0 15px' }}
              >
                Xác nhận
              </Button>
            </Space>
          ) : (
            <Button 
              onClick={handleCloseDetailModal}
              style={{ fontSize: '14px', height: '32px', padding: '0 15px' }}
            >
              Đóng
            </Button>
          )
        }
      >
        {detailLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>Đang tải...</div>
        ) : selectedOrder ? (
          <>
            {selectedOrder.trangThai === 'cho_xac_nhan' && (
              <Alert
                message="Đơn hàng chờ xác nhận"
                description="Vui lòng kiểm tra kỹ thông tin đơn hàng trước khi xác nhận hoặc từ chối."
                type="warning"
                showIcon
                style={{ marginBottom: 20 }}
              />
            )}

            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Mã đơn hàng">{selectedOrder.maDonHang}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getTrangThaiColor(selectedOrder.trangThai)}>
                  {getTrangThaiText(selectedOrder.trangThai)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Nông dân">{selectedOrder.tenNguoiBan}</Descriptions.Item>
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

      {/* Modal tạo đơn hàng */}
      <Modal
        title="Tạo đơn hàng mua từ nông dân"
        open={isCreateModalOpen}
        onCancel={handleCloseCreateModal}
        onOk={handleCreateOrder}
        confirmLoading={createLoading}
        width={700}
        okText="Tạo đơn hàng"
        cancelText="Hủy"
      >
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>
            Chọn nông dân: <span style={{ color: 'red' }}>*</span>
          </label>
          <Select
            showSearch
            placeholder="Tìm và chọn nông dân"
            style={{ width: '100%' }}
            value={createForm.maNongDan || undefined}
            onChange={(value) => setCreateForm({ ...createForm, maNongDan: value })}
            loading={loadingFarmers}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={farmers.map((farmer) => ({
              value: farmer.maNongDan?.toString(),
              label: `${farmer.maNongDan} - ${farmer.hoTen || farmer.tenNongDan || 'Chưa có tên'}${
                farmer.diaChi ? ` (${farmer.diaChi})` : ''
              }`,
            }))}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>
            Danh sách lô: <span style={{ color: 'red' }}>*</span>
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
                  placeholder="Chọn lô"
                  style={{ width: '100%' }}
                  value={item.maLo || undefined}
                  onChange={(value) => handleProductChange(index, 'maLo', value)}
                  loading={loadingBatches}
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={batches.map((batch) => ({
                    value: batch.maLo?.toString(),
                    label: `Lô ${batch.maLo} - ${batch.tenSanPham || 'Chưa có tên'} (${
                      batch.soLuongHienTai || 0
                    } ${batch.donViTinh || 'kg'})`,
                  }))}
                />
              </div>
              <input
                type="number"
                value={item.soLuong}
                onChange={(e) => handleProductChange(index, 'soLuong', e.target.value)}
                placeholder="Số lượng"
                style={{
                  flex: 1,
                  padding: '8px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                }}
              />
              <input
                type="number"
                value={item.donGia}
                onChange={(e) => handleProductChange(index, 'donGia', e.target.value)}
                placeholder="Đơn giá"
                style={{
                  flex: 1,
                  padding: '8px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
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
            Thêm lô
          </Button>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default DonHangMuaVao;
