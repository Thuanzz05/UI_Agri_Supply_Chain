import React from 'react';
import { Card, Table, Space, Input, message, Modal, Form, Select } from 'antd';
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
import { ModalButton } from '../../components/ModalButton';
import { ActionButton } from '../../components/ActionButton';
import './QuanLyKho.css';

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

  // Function để gọi API lấy dữ liệu
  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        message.error('Vui lòng đăng nhập lại');
        setData([]);
        return;
      }

      const user = JSON.parse(userStr);
      const maDaiLy = user.MaDaiLy || user.maDaiLy;
      
      if (!maDaiLy) {
        message.warning('Phiên đăng nhập cũ. Vui lòng đăng xuất và đăng nhập lại để cập nhật thông tin');
        setData([]);
        return;
      }

      const response = await apiService.getWarehousesByAgent(maDaiLy);
      
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
        // Lấy thông tin đại lý từ localStorage
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          message.error('Vui lòng đăng nhập lại');
          return;
        }
        
        const user = JSON.parse(userStr);
        const maDaiLy = user.MaDaiLy || user.maDaiLy;
        
        if (!maDaiLy) {
          message.error('Không tìm thấy thông tin đại lý');
          return;
        }
        
        // Tự động thêm thông tin chủ sở hữu
        const warehouseData = {
          ...values,
          maChuSoHuu: maDaiLy,
          loaiChuSoHuu: 'daily'
        };
        
        await apiService.addWarehouse(warehouseData);
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
    ...(!isMobile ? [{
      title: 'Mã kho',
      dataIndex: 'maKho',
      key: 'maKho',
      width: 70,
    }] : []),
    {
      title: 'Tên kho',
      dataIndex: 'tenKho',
      key: 'tenKho',
      width: 160,
    },
    ...(!isTablet ? [{
      title: 'Loại kho',
      dataIndex: 'loaiKho',
      key: 'loaiKho',
      width: 100,
    }] : []),
    ...(!isMobile ? [{
      title: 'Địa chỉ',
      dataIndex: 'diaChi',
      key: 'diaChi',
      width: 220,
      ellipsis: true,
    }] : []),
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
      width: isMobile ? 100 : 140,
      fixed: isMobile ? false : ('right' as any),
      render: (_: any, record: DataType) => (
        <Space size="small" className="action-buttons">
          <ActionButton 
            type="default" 
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          >
            <span className="button-text">Sửa</span>
          </ActionButton>
          <ActionButton 
            type="danger" 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            <span className="button-text">Xóa</span>
          </ActionButton>
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
          <ActionButton 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={showModal}
          >
            <span className="button-text">Thêm kho hàng</span>
            <span className="button-text-mobile">Thêm</span>
          </ActionButton>
        </div>
        
        <Table<DataType>
          columns={columns} 
          dataSource={paginatedData}
          pagination={false}
          scroll={{ x: 'max-content' }}
          loading={loading}
          className="warehouse-table"
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
              { required: true, message: 'Vui lòng chọn loại kho!' }
            ]}
            tooltip="Loại kho theo chức năng lưu trữ"
          >
            <Select placeholder="Chọn loại kho">
              <Select.Option value="thuong">Kho thường</Select.Option>
              <Select.Option value="lanh">Kho lạnh</Select.Option>
              <Select.Option value="dong">Kho đông</Select.Option>
              <Select.Option value="tong">Kho tổng</Select.Option>
              <Select.Option value="daily">Kho đại lý</Select.Option>
            </Select>
          </Form.Item>

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
              <ModalButton onClick={handleCancel}>
                Hủy
              </ModalButton>
              <ModalButton 
                type="primary" 
                htmlType="submit" 
                loading={loading}
              >
                {isEditMode ? 'Cập nhật' : 'Thêm kho hàng'}
              </ModalButton>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default QuanLyKho;