import React from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Statistic,
  Table,
  Tag,
  message,
} from 'antd';
import type { TableProps } from 'antd';
import { DatabaseOutlined, EditOutlined, QrcodeOutlined, SearchOutlined, ShopOutlined, WarningOutlined } from '@ant-design/icons';
import { AdminLayout } from '../../components/Layout';
import { CustomPagination } from '../../components/CustomPagination';
import { apiService } from '../../services/apiService';
import type { DuLieuCapNhatTonKho, TonKhoDaiLy } from '../../types/kho';
import { ModalButton } from '../../components/ModalButton';

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
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<TonKhoTableItem | null>(null);
  const [form] = Form.useForm<DuLieuCapNhatTonKho>();

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAllInventory();
      const items = Array.isArray(response?.data) ? response.data : [];

      // Chỉ hiển thị tồn kho có số lượng > 0
      const filteredItems = items.filter((item: TonKhoDaiLy) => item.soLuong > 0);

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

  const totalQuantity = React.useMemo(
    () => filteredInventory.reduce((sum, item) => sum + item.soLuong, 0),
    [filteredInventory],
  );

  const totalWarehouses = React.useMemo(
    () => new Set(filteredInventory.map((item) => item.maKho)).size,
    [filteredInventory],
  );

  const totalProducts = React.useMemo(
    () => new Set(filteredInventory.map((item) => item.tenSanPham)).size,
    [filteredInventory],
  );

  const columns: TableProps<TonKhoTableItem>['columns'] = [
    {
      title: 'Mã kho',
      dataIndex: 'maKho',
      key: 'maKho',
      width: 80,
    },
    {
      title: 'Tên kho',
      dataIndex: 'tenKho',
      key: 'tenKho',
      width: 160,
    },
    {
      title: 'Mã lô',
      dataIndex: 'maLo',
      key: 'maLo',
      width: 70,
    },
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
      render: (_, record) => `${record.soLuong.toLocaleString('vi-VN')} ${record.donViTinh}`,
    },
    {
      title: 'Mã QR',
      dataIndex: 'maQR',
      key: 'maQR',
      width: 100,
      render: (value: string) => <Tag color="green">{value}</Tag>,
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'ngayCapNhat',
      key: 'ngayCapNhat',
      width: 110,
      render: (value: string) => formatDate(value),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Button 
          type="link"
          size="small"
          icon={<EditOutlined />} 
          onClick={() => showUpdateModal(record)}
        >
          Điều chỉnh
        </Button>
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
        message="Lưu ý quan trọng"
        description="Tồn kho tự động cập nhật khi nhập/xuất hàng. Chỉ sử dụng 'Điều chỉnh' cho trường hợp kiểm kê, hao hụt, hư hỏng hoặc sai lệch thực tế."
        type="warning"
        icon={<WarningOutlined />}
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic title="Tổng số lượng tồn" value={totalQuantity} suffix="đơn vị" prefix={<DatabaseOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic title="Số kho có hàng" value={totalWarehouses} prefix={<ShopOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic title="Số sản phẩm" value={totalProducts} prefix={<QrcodeOutlined />} />
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
          <Input
            placeholder="Tìm theo kho, sản phẩm, mã QR, mã lô..."
            prefix={<SearchOutlined />}
            style={{ width: 360, maxWidth: '100%' }}
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            allowClear
          />
        </div>

        <Table<TonKhoTableItem>
          columns={columns}
          dataSource={paginatedInventory}
          pagination={false}
          loading={loading}
          scroll={{ x: 920 }}
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
          message="Chỉ điều chỉnh khi cần thiết"
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
    </AdminLayout>
  );
};

export default TonKhoDaiLyPage;
