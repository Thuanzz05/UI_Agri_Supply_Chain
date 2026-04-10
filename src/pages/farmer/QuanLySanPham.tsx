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
  const [total, setTotal] = React.useState(0);
  
  // State cho modal thêm sản phẩm
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [form] = Form.useForm();

  // 2.2: Tạo function để gọi API lấy dữ liệu
  const fetchProducts = async () => {
    setLoading(true); // Bật loading
    try {
      const response = await apiService.getFarmerProducts();
      console.log('API Response:', response); // Debug: xem cấu trúc dữ liệu
      
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
        setTotal(mappedData.length);
      } else {
        setData([]);
        setTotal(0);
      }
    } catch (error: any) {
      console.error('Error fetching products:', error);
      message.error('Không thể tải danh sách sản phẩm');
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false); // Tắt loading
    }
  };

  // 2.6: Gọi API khi component được mount (hiển thị lần đầu)
  React.useEffect(() => {
    fetchProducts();
  }, []);

  // Hàm mở modal
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Hàm đóng modal
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // Hàm xử lý submit form thêm sản phẩm
  const handleAddProduct = async (values: ProductFormData) => {
    try {
      setLoading(true);
      await apiService.addFarmerProduct(values);
      message.success('Thêm sản phẩm thành công!');
      setIsModalOpen(false);
      form.resetFields();
      fetchProducts(); // Tải lại danh sách sản phẩm
    } catch (error: any) {
      console.error('Error adding product:', error);
      message.error(error.response?.data?.message || 'Không thể thêm sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  
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
      render: () => (
        <Space size="small">
          <Button 
            type="primary" 
            size="small" 
            icon={<EditOutlined />}
          >
            Sửa
          </Button>
          <Button 
            danger 
            size="small" 
            icon={<DeleteOutlined />}
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
          dataSource={data}
          pagination={false}
          scroll={{ x: 800 }}
          loading={loading}
        />
        
        <CustomPagination
          current={currentPage}
          total={total}
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

      {/* Modal thêm sản phẩm */}
      <Modal
        title="Thêm sản phẩm mới"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddProduct}
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
              <Button onClick={handleCancel}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Thêm sản phẩm
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default QuanLySanPham;