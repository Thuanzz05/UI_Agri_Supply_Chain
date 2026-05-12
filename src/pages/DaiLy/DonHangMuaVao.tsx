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
  MessageOutlined,
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
import type { LoNongSan } from '../../types/loNongSan';
import { ModalButton } from '../../components/ModalButton';
import { useNavigate } from 'react-router-dom';
import { ActionButton } from '../../components/ActionButton';
import SocialLinks from '../../components/SocialLinks';
import dayjs from 'dayjs';
import './DonHangMuaVao.css';

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

const DonHangMuaVao: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [loading, setLoading] = React.useState(false);
  const [orders, setOrders] = React.useState<DonHangTableItem[]>([]);
  const [filterStatus, setFilterStatus] = React.useState<string>('all');
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = React.useState(window.innerWidth >= 768 && window.innerWidth < 992);
  
  // Modal chi tiết
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<DonHang | null>(null);
  const [counterpartyProfile, setCounterpartyProfile] = React.useState<unknown>(null);
  const [detailLoading, setDetailLoading] = React.useState(false);

  // Modal tạo đơn
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [createLoading, setCreateLoading] = React.useState(false);
  const [createForm, setCreateForm] = React.useState({
    maNongDan: '',
    chiTietDonHang: [{ maLo: '', soLuong: '', donGia: '' }],
  });

  // Danh sách nông dân và lô hàng
  const [farmers, setFarmers] = React.useState<Array<{ maNongDan: number; hoTen: string; diaChi?: string }>>([]);
  const [batches, setBatches] = React.useState<LoNongSan[]>([]);
  const [allBatches, setAllBatches] = React.useState<LoNongSan[]>([]); // Lưu tất cả lô để filter
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

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 992);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch danh sách nông dân và lô hàng khi mở modal
  const fetchFarmersAndBatches = async () => {
    setLoadingFarmers(true);
    setLoadingBatches(true);
    
    try {
      // Lấy tất cả lô hàng available để tạo đơn hàng
      const batchesResponse = await apiService.getAllLoHangAvailable();

      // Backend trả về { success, message, data, count }
      // apiService đã return response.data nên batchesResponse = { success, message, data, count }
      const batchesData = batchesResponse?.data || batchesResponse;
      
      if (batchesData) {
        // Lấy tất cả lô (bao gồm cả chưa kiểm định và đã kiểm định)
        const fetchedBatches = Array.isArray(batchesData) 
          ? batchesData
          : [];
        
        // Map sang format LoNongSan và thêm thông tin kiểm định
        const mappedBatches = fetchedBatches.map((batch: any) => ({
          maLo: batch.maLo,
          maTrangTrai: 0, // Không cần thiết cho form tạo đơn
          maSanPham: 0, // Không cần thiết cho form tạo đơn
          soLuongBanDau: batch.soLuong,
          soLuongHienTai: batch.soLuong,
          ngayThuHoach: batch.ngayThuHoach,
          hanSuDung: batch.hanSuDung || '', // Thêm HSD
          maQR: '', // Không cần thiết cho form tạo đơn
          trangThai: 'san_sang',
          ngayTao: '', // Không cần thiết cho form tạo đơn
          tenTrangTrai: '', // Không cần thiết cho form tạo đơn
          tenSanPham: batch.tenSanPham,
          donViTinh: batch.donViTinh,
          // Thêm các field cho kiểm định
          maNongDan: batch.maNongDan,
          tenNongDan: batch.tenNongDan,
          soLuong: batch.soLuong,
          trangThaiKiemDinh: batch.trangThaiKiemDinh,
          ketQuaKiemDinh: batch.ketQuaKiemDinh,
        }));
        
        setAllBatches(mappedBatches); // Lưu tất cả lô
        setBatches(mappedBatches); // Hiển thị tất cả lô ban đầu

        // Sinh danh sách nông dân trực tiếp từ lô hàng để tránh phụ thuộc API nông dân.
        const uniqueFarmers = new Map<number, { maNongDan: number; hoTen: string; diaChi?: string }>();
        fetchedBatches.forEach((batch: any) => {
          const maNongDan = Number(batch.maNongDan);
          if (!Number.isNaN(maNongDan) && !uniqueFarmers.has(maNongDan)) {
            uniqueFarmers.set(maNongDan, {
              maNongDan,
              hoTen: batch.tenNongDan || 'Chưa có tên',
              diaChi: batch.diaChi || '',
            });
          }
        });
        setFarmers(Array.from(uniqueFarmers.values()));
      }
    } catch (error: any) {
      message.error(getApiErrorMessage(error, 'Không thể tải danh sách'));
    } finally {
      setLoadingFarmers(false);
      setLoadingBatches(false);
    }
  };

  // Filter lô theo nông dân được chọn
  const handleFarmerChange = (maNongDan: string) => {
    // Reset form: đổi nông dân thì xóa hết lô đã chọn
    setCreateForm({ 
      maNongDan,
      chiTietDonHang: [{ maLo: '', soLuong: '', donGia: '' }]
    });
    
    if (maNongDan) {
      // Filter lô theo mã nông dân
      const filteredBatches = allBatches.filter(
        (batch: any) => batch.maNongDan?.toString() === maNongDan
      );
      setBatches(filteredBatches);
    } else {
      // Nếu không chọn nông dân, hiển thị tất cả
      setBatches(allBatches);
    }
  };

  const showDetailModal = async (order: DonHangTableItem) => {
    setIsDetailModalOpen(true);
    setDetailLoading(true);
    setCounterpartyProfile(null);
    try {
      const response = await apiService.getAgentOrderFromFarmerById(order.maDonHang);
      const data = response.data || response;
      setSelectedOrder(data);

      try {
        const profileResponse = await apiService.getPublicProfile(
          data.loaiNguoiBan || order.loaiNguoiBan || 'nongdan',
          data.maNguoiBan || order.maNguoiBan,
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

  const handleChatWithFarmer = () => {
    if (!selectedOrder) return;
    
    const chatInfo = {
      maNguoi: selectedOrder.maNguoiBan,
      loaiNguoi: selectedOrder.loaiNguoiBan || 'nongdan',
      tenNguoi: selectedOrder.tenNguoiBan,
    };
    localStorage.setItem('pendingChat', JSON.stringify(chatInfo));
    navigate('/agent/messages');
    message.info(`Đang mở chat với ${selectedOrder.tenNguoiBan}`);
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
    
    // Nếu đang chọn lô và chưa có nông dân được chọn
    if (field === 'maLo' && value && !createForm.maNongDan) {
      // Tìm lô được chọn để lấy mã nông dân
      const selectedBatch = allBatches.find((batch: any) => batch.maLo?.toString() === value);
      if (selectedBatch && selectedBatch.maNongDan) {
        // Tự động chọn nông dân và filter lô
        const maNongDan = selectedBatch.maNongDan.toString();
        const filteredBatches = allBatches.filter(
          (batch: any) => batch.maNongDan?.toString() === maNongDan
        );
        setBatches(filteredBatches);
        setCreateForm({ 
          maNongDan,
          chiTietDonHang: newChiTiet 
        });
        return;
      }
    }
    
    setCreateForm({ ...createForm, chiTietDonHang: newChiTiet });
  };

  const handleCreateOrder = async () => {
    // Validation
    if (!createForm.maNongDan) {
      message.error('Vui lòng chọn nông dân');
      return;
    }

    const hasEmptyProduct = createForm.chiTietDonHang.some(
      (item) => !item.maLo || !item.soLuong || !item.donGia
    );
    if (hasEmptyProduct) {
      message.error('Vui lòng điền đầy đủ thông tin lô hàng');
      return;
    }

    const hasInvalidNumber = createForm.chiTietDonHang.some(
      (item) => parseFloat(item.soLuong) <= 0 || parseFloat(item.donGia) <= 0
    );
    if (hasInvalidNumber) {
      message.error('Số lượng và đơn giá phải lớn hơn 0');
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
    ...(!isMobile ? [{
      title: 'Ngày đặt',
      dataIndex: 'ngayDat',
      key: 'ngayDat',
      width: 110,
      render: (value: string) => dayjs(value).format('DD/MM/YYYY'),
    }] : []),
    ...(!isTablet && !isMobile ? [{
      title: 'Tổng giá trị',
      dataIndex: 'tongGiaTri',
      key: 'tongGiaTri',
      width: 130,
      render: (value: number) => `${(value || 0).toLocaleString('vi-VN')} đ`,
    }] : []),
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
      fixed: isMobile ? undefined : 'right',
      render: (_, record) => (
        <ActionButton
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => showDetailModal(record)}
        >
          {isMobile ? 'Xem' : 'Chi tiết'}
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
              { label: 'Chờ kiểm định', value: 'cho_kiem_dinh' },
              { label: 'Đang vận chuyển', value: 'dang_van_chuyen' },
              { label: 'Hoàn thành', value: 'hoan_thanh' },
              { label: 'Trả hàng', value: 'tra_hang' },
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
              {isMobile ? 'Tạo' : 'Tạo đơn hàng'}
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
          responsive={isMobile || isTablet}
        />
      </Card>

      <Modal
        title="Chi tiết đơn hàng"
        open={isDetailModalOpen}
        onCancel={handleCloseDetailModal}
        width={900}
        footer={
          <ModalButton onClick={handleCloseDetailModal}>
            Đóng
          </ModalButton>
        }
      >
        {detailLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>Đang tải...</div>
        ) : selectedOrder ? (
          <>
            {selectedOrder.trangThai === 'cho_xac_nhan' && (
              <Alert
                message="Đơn hàng đang chờ nông dân xác nhận"
                description="Đơn hàng này đang chờ nông dân xác nhận. Bạn không thể thao tác trên đơn hàng này."
                type="info"
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
              <Descriptions.Item label="Nông dân">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{selectedOrder.tenNguoiBan}</span>
                  <Button
                    type="link"
                    size="small"
                    icon={<MessageOutlined />}
                    onClick={handleChatWithFarmer}
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

      {/* Modal tạo đơn hàng */}
      <Modal
        title="Tạo đơn hàng mua từ nông dân"
        open={isCreateModalOpen}
        onCancel={handleCloseCreateModal}
        width={700}
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
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>
            Chọn nông dân: <span style={{ color: 'red' }}>*</span>
          </label>
          <Select
            showSearch
            placeholder="Tìm và chọn nông dân"
            style={{ width: '100%' }}
            value={createForm.maNongDan || undefined}
            onChange={handleFarmerChange}
            loading={loadingFarmers}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={farmers.map((farmer) => ({
              value: farmer.maNongDan?.toString(),
              label: `${farmer.maNongDan} - ${farmer.hoTen || 'Chưa có tên'}${
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
                  options={batches.map((batch: any) => {
                    // Tính số ngày còn lại đến HSD
                    let hsdInfo = '';
                    let isExpired = false;
                    if (batch.hanSuDung) {
                      // Chuyển về đầu ngày để so sánh chính xác
                      const hsd = new Date(batch.hanSuDung);
                      hsd.setHours(0, 0, 0, 0);
                      
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      
                      const daysLeft = Math.ceil((hsd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                      
                      if (daysLeft < 0) {
                        hsdInfo = ' - ⚠ Hết hạn';
                        isExpired = true;
                      } else if (daysLeft === 0) {
                        hsdInfo = ' - ⚠ Hết hạn hôm nay';
                        isExpired = true;
                      } else if (daysLeft <= 7) {
                        hsdInfo = ` - ⚠ Còn ${daysLeft} ngày`;
                      } else if (daysLeft <= 14) {
                        hsdInfo = ` - Còn ${daysLeft} ngày`;
                      } else if (daysLeft <= 30) {
                        hsdInfo = ` - HSD: ${daysLeft} ngày`;
                      }
                      // Nếu > 30 ngày thì không hiển thị (còn lâu)
                    }
                    
                    return {
                      value: batch.maLo?.toString(),
                      label: `Lô ${batch.maLo} - ${batch.tenSanPham || 'Chưa có tên'} (${
                        batch.soLuongHienTai || 0
                      } ${batch.donViTinh || 'kg'})${hsdInfo}`,
                      disabled: batch.trangThaiKiemDinh === 'khong_dat' || isExpired, // Không cho chọn lô không đạt hoặc hết hạn
                    };
                  })}
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
            Thêm lô
          </Button>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default DonHangMuaVao;
