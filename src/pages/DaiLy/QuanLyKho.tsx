import React from 'react';
import { Card, Table, Button, Space, Input, message, Modal, Form } from 'antd';
import type { TableProps } from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { AdminLayout } from '../../components/Layout';
import { CustomPagination } from '../../components/CustomPagination';
import { apiService } from '../../services/apiService';
import type { DuLieuFormKhoThem, DuLieuFormKhoSua } from '../../types/kho';

interface DataType {
  key: string;
  maKho: number;
  tenKho: string;
  loaiKho: string;
  diaChi: string;
  tenChuSoHuu: string;
}

const QuanLyKho: React.FC = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  
  // State để lưu dữ liệu từ API
  const [data, setData] = React.useState<DataType[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');

  // State cho modal thêm/sửa kho hàng
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editingWarehouse, setEditingWarehouse] = React.useState<DataType | null>(null);
  const [form] = Form.useForm();

  // Function để gọi API lấy dữ liệu
  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAllWarehouses();
      
      if (response && response.data) {
        const warehouses = Array.isArray(response.data) ? response.data : [];
        
        // Chuyển đổi dữ liệu từ API sang format của bảng
        const mappedData: DataType[] = warehouses.map((warehouse: any) => ({
          key: warehouse.maKho?.toString(),
          maKho: warehouse.maKho,
          tenKho: warehouse.tenKho,
          loaiKho: warehouse.loaiKho,
          diaChi: warehouse.diaChi,
          tenChuSoHuu: warehouse.tenChuSoHuu
        }));
        
        setData(mappedData);
      } else {
        setData([]);
      }
    } catch (error: any) {
      message.error('Không thể tải danh sách kho hàng');
      setData([]);
    } finally {
      setLoading(false); 
    }
  };

  // Gọi API khi component được mount
  React.useEffect(() => {
    fetchWarehouses();
  }, []);

  // Hàm mở modal thêm mới
  const showModal = () => {
    setIsEditMode(false);
    setEditingWarehouse(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Hàm mở modal sửa
  const showEditModal = (record: DataType) => {
    setIsEditMode(true);
    setEditingWarehouse(record);
    form.setFieldsValue({
      tenKho: record.tenKho,
      loaiKho: record.loaiKho,
      diaChi: record.diaChi
    });
    setIsModalOpen(true);
  };

  // Hàm đóng modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingWarehouse(null);
    form.resetFields();
  };

  // Hàm xử lý submit form (thêm hoặc sửa)
  const handleSubmit = async (values: DuLieuFormKhoThem | DuLieuFormKhoSua) => {
    try {
      setLoading(true);
      if (isEditMode && editingWarehouse) {
        await apiService.updateWarehouse(editingWarehouse.maKho, values);
        message.success('Cập nhật kho hàng thành công!');
      } else {
        await apiService.addWarehouse(values);
        message.success('Thêm kho hàng thành công!');
      }
      setIsModalOpen(false);
      form.resetFields();
      setIsEditMode(false);
      setEditingWarehouse(null);
      fetchWarehouses();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Không thể lưu kho hàng');
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý xóa kho hàng
  const handleDelete = (record: DataType) => {
    Modal.confirm({
      title: 'Xác nhận xóa kho hàng',
      content: `Bạn có chắc chắn muốn xóa kho "${record.tenKho}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          setLoading(true);
          await apiService.deleteWarehouse(record.maKho);
          message.success('Xóa kho hàng thành công!');
          fetchWarehouses();
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Không thể xóa kho hàng');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Lọc dữ liệu theo từ khóa tìm kiếm
  const filteredData = React.useMemo(() => {
    if (!searchText) return data;
    
    return data.filter(item => 
      item.tenKho.toLowerCase().includes(searchText.toLowerCase()) ||
      item.loaiKho.toLowerCase().includes(searchText.toLowerCase()) ||
      item.diaChi.toLowerCase().includes(searchText.toLowerCase()) ||
      item.tenChuSoHuu.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [data, searchText]);

  // Reset về trang 1 khi tìm kiếm
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  // Dữ liệu hiển thị theo trang
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, pageSize]);

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Mã kho',
      dataIndex: 'maKho',
      key: 'maKho',
      width: 70,
    },
    {
      title: 'Tên kho',
      dataIndex: 'tenKho',
      key: 'tenKho',
      width: 160,
    },
    {
      title: 'Loại kho',
      dataIndex: 'loaiKho',
      key: 'loaiKho',
      width: 100,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'diaChi',
      key: 'diaChi',
      width: 220,
      ellipsis: true,
    },
    {
      title: 'Chủ sở hữu',
      dataIndex: 'tenChuSoHuu',
      key: 'tenChuSoHuu',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 140,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="default" 
            size="small" 
            icon={<EditOutlined />}
            style={{ 
              color: '#1890ff', 
              borderColor: '#1890ff',
              minWidth: '60px'
            }}
            onClick={() => showEditModal(record)}
          >
            Sửa
          </Button>
          <Button 
            danger 
            size="small" 
            icon={<DeleteOutlined />}
            style={{ minWidth: '60px' }}
            onClick={() => handleDelete(record)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Quản lý kho hàng</h1>
        <p>Quản lý danh sách kho hàng của đại lý</p>
      </div>
      
      <Card>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          padding: '16px 0',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <Input
            placeholder="Tìm kiếm kho hàng..."
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            size="large"
            onClick={showModal}
          >
            Thêm kho hàng
          </Button>
        </div>
        
        <Table<DataType>
          columns={columns} 
          dataSource={paginatedData}
          pagination={false}
          scroll={{ x: 850 }}
          loading={loading}
        />
        
        <CustomPagination
          current={currentPage}
          total={filteredData.length}
          pageSize={pageSize}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size || 10);
          }}
          showTotal={(total, range) => 
            `${range[0]}-${range[1]} của ${total} kho hàng`
          }
        />
      </Card>

      {/* Modal thêm/sửa kho hàng */}
      <Modal
        title={isEditMode ? "Sửa kho hàng" : "Thêm kho hàng mới"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            label="Tên kho"
            name="tenKho"
            rules={[
              { required: true, message: 'Vui lòng nhập tên kho!' },
              { min: 3, message: 'Tên kho phải có ít nhất 3 ký tự!' }
            ]}
          >
            <Input placeholder="Nhập tên kho hàng" />
          </Form.Item>

          <Form.Item
            label="Loại kho"
            name="loaiKho"
            rules={[
              { required: true, message: 'Vui lòng nhập loại kho!' }
            ]}
          >
            <Input placeholder="Ví dụ: daily, lanh, thuong..." />
          </Form.Item>

          {/* Chỉ hiển thị các trường này khi thêm mới */}
          {!isEditMode && (
            <>
              <Form.Item
                label="Mã chủ sở hữu"
                name="maChuSoHuu"
                rules={[
                  { required: true, message: 'Vui lòng nhập mã chủ sở hữu!' }
                ]}
              >
                <Input type="number" placeholder="Nhập mã chủ sở hữu" />
              </Form.Item>

              <Form.Item
                label="Loại chủ sở hữu"
                name="loaiChuSoHuu"
                rules={[
                  { required: true, message: 'Vui lòng nhập loại chủ sở hữu!' }
                ]}
              >
                <Input placeholder="Ví dụ: daily, nongdan..." />
              </Form.Item>
            </>
          )}

          <Form.Item
            label="Địa chỉ"
            name="diaChi"
            rules={[
              { required: true, message: 'Vui lòng nhập địa chỉ!' }
            ]}
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Nhập địa chỉ chi tiết của kho hàng"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCancel} size="middle">
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading} 
                size="middle"
                style={{ 
                  fontSize: '14px',
                  height: '32px',
                  padding: '0 15px'
                }}
              >
                {isEditMode ? 'Cập nhật' : 'Thêm kho hàng'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default QuanLyKho;