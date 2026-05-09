import React from 'react';
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
import type { TableProps } from 'antd';
import { EditOutlined, SearchOutlined, WarningOutlined, SwapOutlined, HistoryOutlined } from '@ant-design/icons';
import { AdminLayout } from '../../components/Layout';
import { CustomPagination } from '../../components/CustomPagination';
import { apiService } from '../../services/apiService';
import type { DuLieuCapNhatTonKho, TonKhoDaiLy } from '../../types/kho';
import { ModalButton } from '../../components/ModalButton';
import type { Kho } from '../../types/kho';
import type { PhieuChuyenKho } from '../../types/chuyenKho';
import './TonKhoDaiLy.css';

interface TonKhoTableItem extends TonKhoDaiLy {
  key: string;
}

const formatDate = (value: string) => {
  if (!value) {
    return '--';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('vi-VN');
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

  if (Array.isArray(responseData?.errors)) {
    return responseData.errors.join(', ');
  }

  if (responseData?.errors && typeof responseData.errors === 'object') {
    const firstError = Object.values(responseData.errors).flat()[0];
    if (typeof firstError === 'string' && firstError.trim()) {
      return firstError;
    }
  }

  if (typeof error?.message === 'string' && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
};

const TonKhoDaiLyPage: React.FC = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [searchText, setSearchText] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [inventory, setInventory] = React.useState<TonKhoTableItem[]>([]);
  const [warehouses, setWarehouses] = React.useState<Kho[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<TonKhoTableItem | null>(null);
  const [form] = Form.useForm<DuLieuCapNhatTonKho>();

  const [isTransferModalOpen, setIsTransferModalOpen] = React.useState(false);
  const [transferItem, setTransferItem] = React.useState<TonKhoTableItem | null>(null);
  const [transferSubmitting, setTransferSubmitting] = React.useState(false);
  const [transferForm] = Form.useForm<{
    maKhoDich: number;
    soLuong: number;
    ghiChu?: string;
  }>();

  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [historyLoading, setHistoryLoading] = React.useState(false);
  const [history, setHistory] = React.useState<PhieuChuyenKho[]>([]);
  
  // State để theo dõi kích thước màn hình
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = React.useState(window.innerWidth < 992);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth < 992);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        message.error('Vui lòng đăng nhập lại');
        setInventory([]);
        return;
      }

      const user = JSON.parse(userStr);
      const maDaiLy = user.MaDaiLy || user.maDaiLy;
      
      if (!maDaiLy) {
        message.warning('Phiên đăng nhập cũ. Vui lòng đăng xuất và đăng nhập lại để cập nhật thông tin');
        setInventory([]);
        return;
      }

      // Lấy danh sách kho của đại lý
      const warehousesResponse = await apiService.getWarehousesByAgent(maDaiLy);
      const warehouses = Array.isArray(warehousesResponse?.data) ? warehousesResponse.data : [];
      setWarehouses(warehouses);
      
      if (warehouses.length === 0) {
        setInventory([]);
        return;
      }

      // Lấy tồn kho từ tất cả kho của đại lý
      let allItems: TonKhoDaiLy[] = [];
      for (const warehouse of warehouses) {
        try {
          const response = await apiService.getTonKhoByKho(warehouse.maKho);
          const items = Array.isArray(response?.data) ? response.data : [];
          allItems = allItems.concat(items);
        } catch (error) {
          // Bỏ qua lỗi từ kho riêng lẻ
          continue;
        }
      }

      // Chỉ hiển thị tồn kho có số lượng > 0
      const filteredItems = allItems.filter((item: TonKhoDaiLy) => item.soLuong > 0);

      setInventory(
        filteredItems.map((item: TonKhoDaiLy) => ({
          ...item,
          key: `${item.maKho}-${item.maLo}-${item.maQR}`,
        })),
      );
    } catch (error: any) {
      setInventory([]);
      message.error(getApiErrorMessage(error, 'Không thể tải danh sách tồn kho'));
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchInventory();
  }, []);

  const showUpdateModal = (item: TonKhoTableItem) => {
    setSelectedItem(item);
    form.setFieldsValue({ soLuongMoi: item.soLuong });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    form.resetFields();
  };

  const handleUpdateQuantity = async (values: DuLieuCapNhatTonKho) => {
    if (!selectedItem) {
      return;
    }

    setSubmitting(true);
    try {
      await apiService.adjustInventory(selectedItem.maKho, selectedItem.maLo, values.soLuongMoi);
      message.success('Điều chỉnh số lượng tồn kho thành công');
      handleCloseModal();
      await fetchInventory();
    } catch (error: any) {
      message.error(getApiErrorMessage(error, 'Không thể điều chỉnh số lượng tồn kho'));
    } finally {
      setSubmitting(false);
    }
  };

  const openTransferModal = (item: TonKhoTableItem) => {
    setTransferItem(item);
    transferForm.setFieldsValue({
      maKhoDich: undefined as any,
      soLuong: item.soLuong,
      ghiChu: '',
    });
    setIsTransferModalOpen(true);
  };

  const closeTransferModal = () => {
    setIsTransferModalOpen(false);
    setTransferItem(null);
    transferForm.resetFields();
  };

  const submitTransfer = async (values: { maKhoDich: number; soLuong: number; ghiChu?: string }) => {
    if (!transferItem) return;

    if (values.maKhoDich === transferItem.maKho) {
      message.error('Kho đích phải khác kho nguồn');
      return;
    }

    if (values.soLuong <= 0) {
      message.error('Số lượng chuyển phải lớn hơn 0');
      return;
    }

    if (values.soLuong > transferItem.soLuong) {
      message.error('Số lượng chuyển không được vượt quá số lượng tồn kho');
      return;
    }

    setTransferSubmitting(true);
    try {
      await apiService.transferInventory({
        maKhoNguon: transferItem.maKho,
        maKhoDich: values.maKhoDich,
        maLo: transferItem.maLo,
        soLuong: values.soLuong,
        ghiChu: values.ghiChu,
      });
      message.success('Chuyển kho thành công');
      closeTransferModal();
      await fetchInventory();
    } catch (error: any) {
      message.error(getApiErrorMessage(error, 'Không thể chuyển kho'));
    } finally {
      setTransferSubmitting(false);
    }
  };

  const openHistory = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        message.error('Vui lòng đăng nhập lại');
        return;
      }
      const user = JSON.parse(userStr);
      const maDaiLy = user.MaDaiLy || user.maDaiLy;
      if (!maDaiLy) {
        message.warning('Phiên đăng nhập cũ. Vui lòng đăng xuất và đăng nhập lại để cập nhật thông tin');
        return;
      }

      setHistoryOpen(true);
      setHistoryLoading(true);
      const res = await apiService.getTransferHistoryByAgent(Number(maDaiLy));
      const rows = Array.isArray(res?.data) ? res.data : [];
      setHistory(rows);
    } catch (error: any) {
      message.error(getApiErrorMessage(error, 'Không thể tải lịch sử chuyển kho'));
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const filteredInventory = React.useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    if (!keyword) {
      return inventory;
    }

    return inventory.filter((item) =>
      [item.tenKho, item.tenSanPham, item.maQR, item.donViTinh, String(item.maLo)].some((value) =>
        value.toLowerCase().includes(keyword),
      ),
    );
  }, [inventory, searchText]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  React.useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filteredInventory.length / pageSize));
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, filteredInventory.length, pageSize]);

  const paginatedInventory = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredInventory.slice(startIndex, startIndex + pageSize);
  }, [currentPage, filteredInventory, pageSize]);

  const columns: TableProps<TonKhoTableItem>['columns'] = [
    ...(!isMobile ? [{
      title: 'Mã kho',
      dataIndex: 'maKho',
      key: 'maKho',
      width: 80,
    }] : []),
    {
      title: 'Tên kho',
      dataIndex: 'tenKho',
      key: 'tenKho',
      width: 160,
    },
    ...(!isTablet ? [{
      title: 'Mã lô',
      dataIndex: 'maLo',
      key: 'maLo',
      width: 70,
    }] : []),
    {
      title: 'Sản phẩm',
      dataIndex: 'tenSanPham',
      key: 'tenSanPham',
      width: 150,
    },
    {
      title: 'Số lượng',
      key: 'soLuong',
      width: 120,
      render: (_: any, record: TonKhoTableItem) => `${record.soLuong.toLocaleString('vi-VN')} ${record.donViTinh}`,
    },
    ...(!isMobile ? [{
      title: 'Mã QR',
      dataIndex: 'maQR',
      key: 'maQR',
      width: 100,
      render: (value: string) => <Tag color="green">{value}</Tag>,
    }] : []),
    ...(!isTablet ? [{
      title: 'Ngày cập nhật',
      dataIndex: 'ngayCapNhat',
      key: 'ngayCapNhat',
      width: 110,
      render: (value: string) => formatDate(value),
    }] : []),
    {
      title: 'Thao tác',
      key: 'action',
      width: isMobile ? 120 : 190,
      fixed: isMobile ? false : ('right' as any),
      render: (_: any, record: TonKhoTableItem) => (
        <Space size={0} className="action-buttons">
          <Button
            type="link"
            size="small"
            icon={<SwapOutlined />}
            onClick={() => openTransferModal(record)}
          >
            <span className="button-text">Chuyển kho</span>
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => showUpdateModal(record)}
          >
            <span className="button-text">Điều chỉnh</span>
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Tồn kho đại lý</h1>
        <p>Theo dõi danh sách tồn kho hiện có tại các kho của đại lý</p>
      </div>

      <Alert
        title="Lưu ý quan trọng"
        description="Tồn kho tự động cập nhật khi nhập/xuất hàng. Chỉ sử dụng 'Điều chỉnh' cho trường hợp kiểm kê, hao hụt, hư hỏng hoặc sai lệch thực tế."
        type="warning"
        icon={<WarningOutlined />}
        showIcon
        style={{ marginBottom: 24 }}
      />

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
          <Input
            placeholder="Tìm theo kho, sản phẩm, mã QR, mã lô..."
            prefix={<SearchOutlined />}
            style={{ width: 360, maxWidth: '100%' }}
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            allowClear
          />

          <Button icon={<HistoryOutlined />} onClick={openHistory}>
            Lịch sử chuyển kho
          </Button>
        </div>

        <Table<TonKhoTableItem>
          columns={columns}
          dataSource={paginatedInventory}
          pagination={false}
          loading={loading}
          scroll={{ x: 'max-content' }}
          className="inventory-table"
        />

        <CustomPagination
          current={currentPage}
          total={filteredInventory.length}
          pageSize={pageSize}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size || 10);
          }}
          showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} dòng tồn kho`}
        />
      </Card>

      <Modal 
        title="Điều chỉnh số lượng tồn kho" 
        open={isModalOpen} 
        onCancel={handleCloseModal} 
        footer={null} 
        destroyOnHidden
        className="ton-kho-modal"
      >
        <Alert
          title="Chỉ điều chỉnh khi cần thiết"
          description="Tồn kho tự động cập nhật qua nhập/xuất hàng. Chỉ điều chỉnh khi phát hiện sai lệch thực tế."
          type="info"
          showIcon
          style={{ marginBottom: 20 }}
        />
        
        <Form form={form} layout="vertical" onFinish={handleUpdateQuantity} style={{ marginTop: 20 }}>
          <Form.Item label="Kho">
            <Input value={selectedItem?.tenKho} disabled />
          </Form.Item>

          <Form.Item label="Sản phẩm">
            <Input value={selectedItem?.tenSanPham} disabled />
          </Form.Item>

          <Form.Item label="Mã lô">
            <Input value={selectedItem?.maLo} disabled />
          </Form.Item>

          <Form.Item
            label="Số lượng mới"
            name="soLuongMoi"
            rules={[
              { required: true, message: 'Vui lòng nhập số lượng mới' },
              { type: 'number', min: 0, message: 'Số lượng mới phải lớn hơn hoặc bằng 0' },
            ]}
          >
            <InputNumber style={{ width: '100%' }} min={0} step={0.1} addonAfter={selectedItem?.donViTinh} />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <ModalButton onClick={handleCloseModal}>Hủy</ModalButton>
            <ModalButton type="primary" htmlType="submit" loading={submitting}>
              Xác nhận điều chỉnh
            </ModalButton>
          </div>
        </Form>
      </Modal>

      <Modal
        title="Chuyển kho nội bộ"
        open={isTransferModalOpen}
        onCancel={closeTransferModal}
        footer={null}
        destroyOnHidden
      >
        <Alert
          title="Gợi ý"
          description="Dùng 'Chuyển kho' để điều chuyển nội bộ giữa các kho của đại lý (có lưu lịch sử). 'Điều chỉnh' chỉ dùng khi kiểm kê/sai lệch."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Form
          form={transferForm}
          layout="vertical"
          onFinish={submitTransfer}
        >
          <Form.Item label="Kho nguồn">
            <Input value={transferItem?.tenKho} disabled />
          </Form.Item>

          <Form.Item label="Sản phẩm">
            <Input value={transferItem?.tenSanPham} disabled />
          </Form.Item>

          <Form.Item label="Mã lô">
            <Input value={transferItem?.maLo} disabled />
          </Form.Item>

          <Form.Item
            label="Kho đích"
            name="maKhoDich"
            rules={[{ required: true, message: 'Vui lòng chọn kho đích' }]}
          >
            <Select
              placeholder="Chọn kho đích"
              options={warehouses
                .filter((kho) => kho.maKho !== transferItem?.maKho)
                .map((kho) => ({
                  value: kho.maKho,
                  label: `${kho.maKho} - ${kho.tenKho}${kho.diaChi ? ` (${kho.diaChi})` : ''}`,
                }))}
            />
          </Form.Item>

          <Form.Item
            label="Số lượng chuyển"
            name="soLuong"
            rules={[
              { required: true, message: 'Vui lòng nhập số lượng chuyển' },
              { type: 'number', min: 0.0000001, message: 'Số lượng chuyển phải lớn hơn 0' },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              max={transferItem?.soLuong ?? undefined}
              step={0.1}
              addonAfter={transferItem?.donViTinh}
            />
          </Form.Item>

          <Form.Item label="Ghi chú" name="ghiChu">
            <Input.TextArea rows={3} placeholder="(Không bắt buộc) Lý do chuyển kho..." />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <ModalButton onClick={closeTransferModal}>Hủy</ModalButton>
            <ModalButton type="primary" htmlType="submit" loading={transferSubmitting}>
              Xác nhận chuyển kho
            </ModalButton>
          </div>
        </Form>
      </Modal>

      <Modal
        title="Lịch sử chuyển kho"
        open={historyOpen}
        onCancel={() => setHistoryOpen(false)}
        footer={null}
        width={900}
        destroyOnHidden
      >
        <Table
          rowKey="maPhieu"
          loading={historyLoading}
          dataSource={history}
          pagination={{ pageSize: 8, showSizeChanger: true }}
          columns={[
            { title: 'Mã phiếu', dataIndex: 'maPhieu', key: 'maPhieu', width: 90 },
            { title: 'Ngày', dataIndex: 'ngayChuyen', key: 'ngayChuyen', width: 120, render: (v: string) => formatDate(v) },
            { title: 'Từ kho', dataIndex: 'tenKhoNguon', key: 'tenKhoNguon', width: 180, render: (v: string, r: any) => v || r.maKhoNguon },
            { title: 'Sang kho', dataIndex: 'tenKhoDich', key: 'tenKhoDich', width: 180, render: (v: string, r: any) => v || r.maKhoDich },
            { title: 'Mã lô', dataIndex: 'maLo', key: 'maLo', width: 80 },
            { title: 'Sản phẩm', dataIndex: 'tenSanPham', key: 'tenSanPham', width: 160, render: (v: string) => v || '--' },
            {
              title: 'Số lượng',
              dataIndex: 'soLuong',
              key: 'soLuong',
              width: 120,
              render: (v: number, r: any) => `${Number(v).toLocaleString('vi-VN')} ${r.donViTinh || ''}`.trim(),
            },
            { title: 'Ghi chú', dataIndex: 'ghiChu', key: 'ghiChu', render: (v: string) => v || '--' },
          ]}
        />
      </Modal>
    </AdminLayout>
  );
};

export default TonKhoDaiLyPage;
