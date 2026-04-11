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
import type { ProductFormData } from '../../types/product';

interface DataType {
  key: string;
  maSanPham: number;
  tenSanPham: string;
  donViTinh: string;
  moTa: string;
}

const QuanLySanPham: React.FC = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  
  // 2.1: Tạo state để lưu dữ liệu từ API
  const [data, setData] = React.useState<DataType[]>([]);
  const [loading, setLoading] = React.useState(false);
  
  // State cho modal thêm sản phẩm
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<DataType | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = React.useState('');

  // 2.2: Tạo function để gọi API lấy dữ liệu
  const fetchProducts = async () => {
    setLoading(true); // Bật loading
    try {
      const response = await apiService.getFarmerProducts();
      
      // 2.3: Kiểm tra và map dữ liệu từ API
      if (response && response.data) {
        const products = Array.isArray(response.data) ? response.data : [];
        
        // 2.4: Chuyển đổi dữ liệu từ API sang format của bảng
        const mappedData: DataType[] = products.map((product: any) => ({
          key: product.maSanPham?.toString(),
          maSanPham: product.maSanPham,
          tenSanPham: product.tenSanPham,
          donViTinh: product.donViTinh,
          moTa: product.moTa
        }));
        
        // 2.5: Cập nhật state với dữ liệu đã map
        setData(mappedData);
      } else {
        setData([]);
      }
    } catch (error: any) {
      message.error('Không thể tải danh sách sản phẩm');
      setData([]);
    } finally {
      setLoading(false); // Tắt loading
    }
  };

  // 2.6: Gọi API khi component được mount (hiển thị lần đầu)
  React.useEffect(() => {
    fetchProducts();
  }, []);

  // Hàm mở modal thêm mới
  const showModal = () => {
    setIsEditMode(false);
    setEditingProduct(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Hàm mở modal sửa
  const showEditModal = (record: DataType) => {
    setIsEditMode(true);
    setEditingProduct(record);
    form.setFieldsValue({
      tenSanPham: record.tenSanPham,
      donViTinh: record.donViTinh,
      moTa: record.moTa
    });
    setIsModalOpen(true);
  };

  // Hàm đóng modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingProduct(null);
    form.resetFields();
  };

  // Hàm xử lý submit form (thêm hoặc sửa)
  const handleSubmit = async (values: ProductFormData) => {
    try {
      setLoading(true);
      if (isEditMode && editingProduct) {
        // Sửa sản phẩm
        await apiService.updateFarmerProduct(editingProduct.maSanPham, values);
        message.success('Cập nhật sản phẩm thành công!');
      } else {
        // Thêm sản phẩm mới
        await apiService.addFarmerProduct(values);
        message.success('Thêm sản phẩm thành công!');
      }
      setIsModalOpen(false);
      form.resetFields();
      setIsEditMode(false);
      setEditingProduct(null);
      fetchProducts(); // Tải lại danh sách sản phẩm
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Không thể lưu sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý xóa sản phẩm
  const handleDelete = (record: DataType) => {
    Modal.confirm({
      title: 'Xác nhận xóa sản phẩm',
      content: `Bạn có chắc chắn muốn xóa sản phẩm "${record.tenSanPham}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          setLoading(true);
          await apiService.deleteFarmerProduct(record.maSanPham);
          message.success('Xóa sản phẩm thành công!');
          fetchProducts(); // Tải lại danh sách sản phẩm
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Không thể xóa sản phẩm');
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
      item.tenSanPham.toLowerCase().includes(searchText.toLowerCase()) ||
      item.donViTinh.toLowerCase().includes(searchText.toLowerCase()) ||
      item.moTa.toLowerCase().includes(searchText.toLowerCase())
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
      title: 'Mã SP',
      dataIndex: 'maSanPham',
      key: 'maSanPham',
      width: 80,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'tenSanPham',
      key: 'tenSanPham',
      width: 200,
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'donViTinh',
      key: 'donViTinh',
      width: 100,
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      key: 'moTa',
      width: 300,
      ellipsis: true,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="default" 
            size="small" 
            icon={<EditOutlined />}
            style={{ 
              color: '#1890ff', 
              borderColor: '#1890ff',
              minWidth: '65px'
            }}
            onClick={() => showEditModal(record)}
          >
            Sửa
          </Button>
          <Button 
            danger 
            size="small" 
            icon={<DeleteOutlined />}
            style={{ minWidth: '65px' }}
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
        <h1>Quản lý sản phẩm</h1>
        <p>Quản lý sản phẩm nông sản của trang trại</p>
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
            placeholder="Tìm kiếm sản phẩm..."
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
            Thêm sản phẩm
          </Button>
        </div>
        
        <Table<DataType>
          columns={columns} 
          dataSource={paginatedData}
          pagination={false}
          scroll={{ x: 800 }}
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
            `${range[0]}-${range[1]} của ${total} sản phẩm`
          }
        />
      </Card>

      {/* Modal thêm/sửa sản phẩm */}
      <Modal
        title={isEditMode ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
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
            label="Tên sản phẩm"
            name="tenSanPham"
            rules={[
              { required: true, message: 'Vui lòng nhập tên sản phẩm!' },
              { min: 3, message: 'Tên sản phẩm phải có ít nhất 3 ký tự!' }
            ]}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>

          <Form.Item
            label="Đơn vị tính"
            name="donViTinh"
            rules={[
              { required: true, message: 'Vui lòng nhập đơn vị tính!' }
            ]}
          >
            <Input placeholder="Ví dụ: kg, tấn, thùng..." />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="moTa"
            rules={[
              { required: true, message: 'Vui lòng nhập mô tả sản phẩm!' }
            ]}
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Nhập mô tả chi tiết về sản phẩm"
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
                {isEditMode ? 'Cập nhật' : 'Thêm sản phẩm'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default QuanLySanPham;