import React from 'react';
import { Card, message, Modal, Form, Input, Space, Row, Col, Empty, Upload } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { AdminLayout } from '../../components/Layout';
import { CustomPagination } from '../../components/CustomPagination';
import { apiService } from '../../services/apiService';
import type { DuLieuFormTrangTrai } from '../../types/trangTrai';
import { ModalButton } from '../../components/ModalButton';
import { ActionButton } from '../../components/ActionButton';
import './QuanLyTrangTrai.css';

  // Định nghĩa kiểu dữ liệu cho bảng
interface DataType {
  key: string;
  maTrangTrai: number;
  maNongDan: number;
  tenTrangTrai: string;
  diaChi: string;
  soChungNhan: string;
  tenNongDan: string;
  hinhAnh?: string;
}

const QuanLyTrangTrai: React.FC = () => {
  // State quản lý phân trang
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [data, setData] = React.useState<DataType[]>([]);
  const [loading, setLoading] = React.useState(false);
  
  // State quản lý tìm kiếm
  const [searchText, setSearchText] = React.useState('');
  
  // State quản lý modal thêm/sửa trang trại
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editingFarm, setEditingFarm] = React.useState<DataType | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);
  const [imageBase64, setImageBase64] = React.useState<string>('');

  // Function gọi API lấy danh sách trang trại
  const fetchFarms = async () => {
    setLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        message.error('Vui lòng đăng nhập lại');
        setData([]);
        return;
      }

      const user = JSON.parse(userStr);
      const maNongDan = user.maNongDan || (user as any).MaNongDan;
      
      if (!maNongDan) {
        message.warning('Không tìm thấy thông tin nông dân');
        setData([]);
        return;
      }

      const response = await apiService.getFarmsByFarmer(maNongDan.toString());
      
      if (response && response.data) {
        const farms = Array.isArray(response.data) ? response.data : [];
        
        const mappedData: DataType[] = farms.map((farm: any) => ({
          key: farm.maTrangTrai?.toString(),
          maTrangTrai: farm.maTrangTrai,
          maNongDan: farm.maNongDan,
          tenTrangTrai: farm.tenTrangTrai,
          diaChi: farm.diaChi,
          soChungNhan: farm.soChungNhan,
          tenNongDan: farm.tenNongDan,
          hinhAnh: farm.hinhAnh
        }));
        
        setData(mappedData);
      } else {
        setData([]);
      }
    } catch (error: any) {
      message.error('Không thể tải danh sách trang trại');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component mount
  React.useEffect(() => {
    fetchFarms();
  }, []);

  // Hàm mở modal thêm mới
  const showModal = () => {
    setIsEditMode(false);
    setEditingFarm(null);
    setFileList([]);
    setImageBase64('');
    form.resetFields();
    setIsModalOpen(true);
  };

  // Hàm mở modal sửa
  const showEditModal = (record: DataType) => {
    setIsEditMode(true);
    setEditingFarm(record);
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
      tenTrangTrai: record.tenTrangTrai,
      diaChi: record.diaChi,
      soChungNhan: record.soChungNhan
    });
    setIsModalOpen(true);
  };

  // Hàm đóng modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingFarm(null);
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

  // Hàm xử lý submit form thêm/sửa trang trại
  const handleSubmit = async (values: DuLieuFormTrangTrai) => {
    try {
      setLoading(true);
      
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        message.error('Không tìm thấy thông tin người dùng');
        return;
      }
      
      const user = JSON.parse(userStr);
      const maNongDan = user.maNongDan || (user as any).MaNongDan;
      
      if (!maNongDan) {
        message.error('Không tìm thấy thông tin nông dân');
        return;
      }
      
      const farmData = {
        ...values,
        maNongDan: isEditMode && editingFarm ? editingFarm.maNongDan : maNongDan,
        hinhAnh: imageBase64 || null
      };
      
      if (isEditMode && editingFarm) {
        await apiService.updateFarm(editingFarm.maTrangTrai, farmData);
        message.success('Cập nhật trang trại thành công!');
      } else {
        await apiService.addFarm(farmData);
        message.success('Thêm trang trại thành công!');
      }
      
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditingFarm(null);
      setFileList([]);
      setImageBase64('');
      form.resetFields();
      fetchFarms();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Không thể lưu trang trại');
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý xóa trang trại
  const handleDelete = (record: DataType) => {
    Modal.confirm({
      title: 'Xác nhận xóa trang trại',
      content: `Bạn có chắc chắn muốn xóa trang trại "${record.tenTrangTrai}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          setLoading(true);
          await apiService.deleteFarm(record.maTrangTrai);
          message.success('Xóa trang trại thành công!');
          fetchFarms();
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Không thể xóa trang trại');
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
      item.tenTrangTrai.toLowerCase().includes(searchText.toLowerCase()) ||
      item.diaChi.toLowerCase().includes(searchText.toLowerCase()) ||
      item.soChungNhan.toLowerCase().includes(searchText.toLowerCase()) ||
      item.tenNongDan.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [data, searchText]);

  // Reset về trang 1 khi tìm kiếm
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  // Tính toán dữ liệu phân trang (từ filteredData thay vì data)
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, pageSize]);

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Quản lý Trang Trại</h1>
        <p>Quản lý thông tin các trang trại của bạn</p>
      </div>

      <div style={{ padding: '24px 0' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          gap: '16px'
        }}>
          <Input
            placeholder="Tìm kiếm trang trại..."
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
          <ActionButton 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={showModal}
          >
            Thêm trang trại
          </ActionButton>
        </div>

        {paginatedData.length === 0 ? (
          <Empty description="Không có trang trại nào" />
        ) : (
          <>
            <Row gutter={[24, 24]}>
              {paginatedData.map((farm) => (
                <Col xs={24} sm={12} lg={8} key={farm.key}>
                  <Card 
                    className="farm-card"
                    cover={
                      farm.hinhAnh ? (
                        <div className="farm-card-image">
                          <img 
                            src={farm.hinhAnh} 
                            alt={farm.tenTrangTrai} 
                          />
                        </div>
                      ) : (
                        <div className="farm-card-image" style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          background: '#f0f0f0',
                          color: '#999'
                        }}>
                          <div style={{ textAlign: 'center' }}>
                            <PlusOutlined style={{ fontSize: '32px', marginBottom: '8px' }} />
                            <div>Chưa có ảnh</div>
                          </div>
                        </div>
                      )
                    }
                    hoverable
                  >
                    <h3 style={{ marginBottom: '12px', color: '#2E7D32' }}>{farm.tenTrangTrai}</h3>
                    <div style={{ marginBottom: '12px', fontSize: '14px', color: '#666' }}>
                      <EnvironmentOutlined style={{ marginRight: '8px' }} />
                      {farm.diaChi}
                    </div>
                    <div style={{ marginBottom: '16px', fontSize: '13px', color: '#999' }}>
                      <strong>Số chứng nhận:</strong> {farm.soChungNhan}
                    </div>
                    <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                      <ActionButton 
                        type="default" 
                        icon={<EditOutlined />}
                        onClick={() => showEditModal(farm)}
                      >
                        Sửa
                      </ActionButton>
                      <ActionButton 
                        type="danger" 
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(farm)}
                      >
                        Xóa
                      </ActionButton>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>

            <div style={{ marginTop: '24px' }}>
              <CustomPagination
                current={currentPage}
                total={filteredData.length}
                pageSize={pageSize}
                onChange={(page, size) => {
                  setCurrentPage(page);
                  setPageSize(size || 10);
                }}
                showTotal={(total, range) => 
                  `${range[0]}-${range[1]} của ${total} trang trại`
                }
              />
            </div>
          </>
        )}
      </div>

      {/* Modal thêm/sửa trang trại */}
      <Modal
        title={isEditMode ? "Sửa trang trại" : "Thêm trang trại mới"}
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
            label="Tên trang trại"
            name="tenTrangTrai"
            rules={[
              { required: true, message: 'Vui lòng nhập tên trang trại!' },
              { min: 3, message: 'Tên trang trại phải có ít nhất 3 ký tự!' }
            ]}
          >
            <Input placeholder="Nhập tên trang trại" />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="diaChi"
            rules={[
              { required: true, message: 'Vui lòng nhập địa chỉ!' }
            ]}
          >
            <Input placeholder="Nhập địa chỉ trang trại" />
          </Form.Item>

          <Form.Item
            label="Số chứng nhận"
            name="soChungNhan"
            rules={[
              { required: true, message: 'Vui lòng nhập số chứng nhận!' }
            ]}
          >
            <Input placeholder="Ví dụ: VG001234" />
          </Form.Item>

          <Form.Item
            label="Hình ảnh trang trại"
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
                {isEditMode ? 'Cập nhật' : 'Thêm trang trại'}
              </ModalButton>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default QuanLyTrangTrai;
