import React from 'react';
import { Card, Table, Button, Space, Input, message } from 'antd';
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
    </AdminLayout>
  );
};

export default QuanLySanPham;