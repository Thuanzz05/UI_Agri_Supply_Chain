import React from 'react';
import { Card, Space, Input, message, Modal, Form, Empty, Upload } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { AdminLayout } from '../../components/Layout';
import { CustomPagination } from '../../components/CustomPagination';
import { apiService } from '../../services/apiService';
import type { DuLieuFormSanPham } from '../../types/sanPham';
import { ModalButton } from '../../components/ModalButton';
import { ActionButton } from '../../components/ActionButton';
import './QuanLySanPham.css';

interface DataType {
  key: string;
  maSanPham: number;
  tenSanPham: string;
  donViTinh: string;
  moTa: string;
  hinhAnh?: string;
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
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);
  const [imageBase64, setImageBase64] = React.useState<string>('');

  // 2.2: Tạo function để gọi API lấy dữ liệu
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await apiService.getFarmerProducts();
      
      if (response && response.data) {
        const products = Array.isArray(response.data) ? response.data : [];
        
        const mappedData: DataType[] = products.map((product: any) => ({
          key: product.maSanPham?.toString(),
          maSanPham: product.maSanPham,
          tenSanPham: product.tenSanPham,
          donViTinh: product.donViTinh,
          moTa: product.moTa,
          hinhAnh: product.hinhAnh
        }));
        
        setData(mappedData);
      } else {
        setData([]);
      }
    } catch (error: any) {
      message.error('Không thể tải danh sách sản phẩm');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // 2.6: Gọi API khi component được mount
  React.useEffect(() => {
    fetchProducts();
  }, []);

  // Hàm mở modal thêm mới
  const showModal = () => {
    setIsEditMode(false);
    setEditingProduct(null);
    setFileList([]);
    setImageBase64('');
    form.resetFields();
    setIsModalOpen(true);
  };

  // Hàm mở modal sửa
  const showEditModal = (record: DataType) => {
    setIsEditMode(true);
    setEditingProduct(record);
    setImageBase64(record.hinhAnh || '');
    
    if (record.hinhAnh) {
      setFileList([{
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: record.hinhAnh,
      }]);
    } else {
      setFileList([]);
    }
    
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
    setFileList([]);
    setImageBase64('');
    form.resetFields();
  };

  // Hàm xử lý upload ảnh
  const handleUploadChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const file = newFileList[0].originFileObj;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageBase64(reader.result as string);
      };
    } else if (newFileList.length === 0) {
      setImageBase64('');
    }
  };

  // Hàm xử lý trước khi upload
  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/gif' || file.type === 'image/webp';
    if (!isJpgOrPng) {
      message.error('Chỉ được tải lên file ảnh (JPG, PNG, GIF, WEBP)!');
      return Upload.LIST_IGNORE;
    }
    
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Ảnh phải nhỏ hơn 5MB!');
      return Upload.LIST_IGNORE;
    }
    
    return false; // Prevent auto upload
  };

  // Hàm xử lý submit form (thêm hoặc sửa)
  const handleSubmit = async (values: DuLieuFormSanPham) => {
    try {
      setLoading(true);
      
      const productData = {
        ...values,
        hinhAnh: imageBase64 || null
      };
      
      if (isEditMode && editingProduct) {
        await apiService.updateFarmerProduct(editingProduct.maSanPham, productData);
        message.success('Cập nhật sản phẩm thành công!');
      } else {
        await apiService.addFarmerProduct(productData);
        message.success('Thêm sản phẩm thành công!');
      }
      
      setIsModalOpen(false);
      form.resetFields();
      setIsEditMode(false);
      setEditingProduct(null);
      setFileList([]);
      setImageBase64('');
      fetchProducts();
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

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Quản lý sản phẩm</h1>
        <p>Quản lý sản phẩm nông sản của trang trại</p>
      </div>
      
      <div style={{ padding: '24px 0' }}>
        <div className="page-header-actions">
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            prefix={<SearchOutlined />}
            className="search-input"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
          <ActionButton 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={showModal}
            className="add-button"
          >
            <span className="button-text">Thêm sản phẩm</span>
            <span className="button-text-mobile">Thêm</span>
          </ActionButton>
        </div>

        {paginatedData.length === 0 ? (
          <Empty description="Không có sản phẩm nào" />
        ) : (
          <>
            <div className="products-grid">
              {paginatedData.map((product) => (
                  <Card 
                    key={product.key}
                    className="product-card"
                    cover={
                      product.hinhAnh ? (
                        <div className="product-card-image">
                          <img 
                            src={product.hinhAnh} 
                            alt={product.tenSanPham} 
                          />
                        </div>
                      ) : (
                        <div className="product-card-image product-card-image-empty">
                          <div className="product-card-image-placeholder">
                            <PlusOutlined />
                            <div>Chưa có ảnh</div>
                          </div>
                        </div>
                      )
                    }
                    hoverable
                  >
                    <h3 className="product-card-title">{product.tenSanPham}</h3>
                    <div className="product-card-unit">
                      <strong>Đơn vị tính:</strong> {product.donViTinh}
                    </div>
                    <div className="product-card-description">
                      <strong>Mô tả:</strong> {product.moTa}
                    </div>
                    <Space className="product-card-actions">
                      <ActionButton 
                        type="default" 
                        icon={<EditOutlined />}
                        onClick={() => showEditModal(product)}
                      >
                        Sửa
                      </ActionButton>
                      <ActionButton 
                        type="danger" 
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(product)}
                      >
                        Xóa
                      </ActionButton>
                    </Space>
                  </Card>
              ))}
            </div>

            <div className="pagination-wrapper">
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
            </div>
          </>
        )}
      </div>

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
            label="Hình ảnh sản phẩm"
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={beforeUpload}
              maxCount={1}
              accept="image/*"
              onRemove={() => {
                setImageBase64('');
                setFileList([]);
              }}
            >
              {fileList.length === 0 && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                </div>
              )}
            </Upload>
            <div style={{ color: '#999', fontSize: '12px', marginTop: '8px' }}>
              Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP), tối đa 5MB
            </div>
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
              <ModalButton onClick={handleCancel}>
                Hủy
              </ModalButton>
              <ModalButton 
                type="primary" 
                htmlType="submit" 
                loading={loading}
              >
                {isEditMode ? 'Cập nhật' : 'Thêm sản phẩm'}
              </ModalButton>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default QuanLySanPham;