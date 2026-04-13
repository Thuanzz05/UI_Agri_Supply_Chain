import React from 'react';
import { Card, Table, Button, message, Modal, Form, Input, Space } from 'antd';
import type { TableProps } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { AdminLayout } from '../../components/Layout';
import { CustomPagination } from '../../components/CustomPagination';
import { apiService } from '../../services/apiService';
import type { FarmFormData } from '../../types/farm';

// Định nghĩa kiểu dữ liệu cho bảng
interface DataType {
  key: string;
  maTrangTrai: number;
  maNongDan: number;
  tenTrangTrai: string;
  diaChi: string;
  soChungNhan: string;
  tenNongDan: string;
}

const QuanLyTrangTrai: React.FC = () => {
  // State quản lý phân trang
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [data, setData] = React.useState<DataType[]>([]);
  const [loading, setLoading] = React.useState(false);
  
  // State quản lý modal thêm/sửa trang trại
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editingFarm, setEditingFarm] = React.useState<DataType | null>(null);
  const [form] = Form.useForm();

  // Function gọi API lấy danh sách trang trại
  const fetchFarms = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAllFarms();
      
      if (response && response.data) {
        const farms = Array.isArray(response.data) ? response.data : [];
        
        const mappedData: DataType[] = farms.map((farm: any) => ({
          key: farm.maTrangTrai?.toString(),
          maTrangTrai: farm.maTrangTrai,
          maNongDan: farm.maNongDan,
          tenTrangTrai: farm.tenTrangTrai,
          diaChi: farm.diaChi,
          soChungNhan: farm.soChungNhan,
          tenNongDan: farm.tenNongDan
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
    form.resetFields();
    setIsModalOpen(true);
  };

  // Hàm mở modal sửa
  const showEditModal = (record: DataType) => {
    setIsEditMode(true);
    setEditingFarm(record);
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
    form.resetFields();
  };

  // Hàm xử lý submit form thêm/sửa trang trại
  const handleSubmit = async (values: FarmFormData) => {
    try {
      setLoading(true);
      
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        message.error('Không tìm thấy thông tin người dùng');
        return;
      }
      
      const user = JSON.parse(userStr);
      
      if (isEditMode && editingFarm) {
        // Sửa trang trại
        const farmData = {
          ...values,
          maNongDan: editingFarm.maNongDan
        };
        await apiService.updateFarm(editingFarm.maTrangTrai, farmData);
        message.success('Cập nhật trang trại thành công!');
      } else {
        // Thêm trang trại mới
        const farmData = {
          ...values,
          maNongDan: user.maTaiKhoan
        };
        await apiService.addFarm(farmData);
        message.success('Thêm trang trại thành công!');
      }
      
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditingFarm(null);
      form.resetFields();
      fetchFarms();
    } catch (error: any) {
      console.error('Error saving farm:', error);
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

  // Tính toán dữ liệu phân trang
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, pageSize]);

  // Định nghĩa các cột của bảng
  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Mã TT',
      dataIndex: 'maTrangTrai',
      key: 'maTrangTrai',
      width: 80,
    },
    {
      title: 'Tên trang trại',
      dataIndex: 'tenTrangTrai',
      key: 'tenTrangTrai',
      width: 200,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'diaChi',
      key: 'diaChi',
      width: 250,
    },
    {
      title: 'Số chứng nhận',
      dataIndex: 'soChungNhan',
      key: 'soChungNhan',
      width: 150,
    },
    {
      title: 'Nông dân',
      dataIndex: 'tenNongDan',
      key: 'tenNongDan',
      width: 150,
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
        <h1>Quản lý trang trại</h1>
        <p>Quản lý thông tin các trang trại</p>
      </div>
      
      <Card>
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginBottom: '24px',
          padding: '16px 0',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={showModal}
            style={{ height: '32px', fontSize: '14px' }}
          >
            Thêm trang trại
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
          total={data.length}
          pageSize={pageSize}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size || 10);
          }}
          showTotal={(total, range) => 
            `${range[0]}-${range[1]} của ${total} trang trại`
          }
        />
      </Card>

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

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button 
                onClick={handleCancel}
                style={{ height: '32px', padding: '4px 15px' }}
              >
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                style={{ height: '32px', padding: '4px 15px' }}
              >
                {isEditMode ? 'Cập nhật' : 'Thêm trang trại'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default QuanLyTrangTrai;
