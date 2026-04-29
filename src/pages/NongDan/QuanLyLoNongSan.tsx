import React from 'react';
import { Card, Table, message, Tag, Input, Modal, Form, InputNumber, DatePicker, Select, Space } from 'antd';
import type { TableProps } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { AdminLayout } from '../../components/Layout';
import { CustomPagination } from '../../components/CustomPagination';
import { apiService } from '../../services/apiService';
import type { DuLieuFormLoNongSan, DuLieuCapNhatLoNongSan } from '../../types/loNongSan';
import { ModalButton } from '../../components/ModalButton';
import { ActionButton } from '../../components/ActionButton';
import dayjs from 'dayjs';

// Định nghĩa kiểu dữ liệu cho bảng
interface DataType {
  key: string;
  maLo: number;
  maTrangTrai: number;
  maSanPham: number;
  soLuongBanDau: number;
  soLuongHienTai: number;
  ngayThuHoach: string;
  hanSuDung: string;
  maQR: string;
  trangThai: string;
  tenTrangTrai: string;
  tenSanPham: string;
  donViTinh: string;
}

const QuanLyLoNongSan: React.FC = () => {
  // State quản lý phân trang
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [data, setData] = React.useState<DataType[]>([]);
  const [loading, setLoading] = React.useState(false);
  
  // State quản lý tìm kiếm
  const [searchText, setSearchText] = React.useState('');
  
  // State quản lý modal thêm/sửa lô nông sản
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editingBatch, setEditingBatch] = React.useState<DataType | null>(null);
  const [form] = Form.useForm();
  
  // State cho dropdown
  const [farms, setFarms] = React.useState<any[]>([]);
  const [products, setProducts] = React.useState<any[]>([]);

  // Function gọi API lấy danh sách lô nông sản của nông dân đang đăng nhập
  const fetchBatches = async () => {
    setLoading(true);
    try {
      // Lấy thông tin nông dân từ localStorage
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        message.error('Không tìm thấy thông tin người dùng');
        setData([]);
        return;
      }

      const user = JSON.parse(userStr);
      const maNongDan = user.maNongDan;

      if (!maNongDan) {
        message.error('Không tìm thấy mã nông dân');
        setData([]);
        return;
      }

      // Gọi API lấy lô nông sản theo nông dân
      const response = await apiService.getBatchesByFarmer(maNongDan);
      
      if (response && response.data) {
        const batches = Array.isArray(response.data) ? response.data : [];
        
        const mappedData: DataType[] = batches.map((batch: any) => ({
          key: batch.maLo?.toString(),
          maLo: batch.maLo,
          maTrangTrai: batch.maTrangTrai,
          maSanPham: batch.maSanPham,
          soLuongBanDau: batch.soLuongBanDau,
          soLuongHienTai: batch.soLuongHienTai,
          ngayThuHoach: batch.ngayThuHoach,
          hanSuDung: batch.hanSuDung,
          maQR: batch.maQR,
          trangThai: batch.trangThai,
          tenTrangTrai: batch.tenTrangTrai,
          tenSanPham: batch.tenSanPham,
          donViTinh: batch.donViTinh
        }));
        
        setData(mappedData);
      } else {
        setData([]);
      }
    } catch (error: any) {
      message.error('Không thể tải danh sách lô nông sản');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component mount
  React.useEffect(() => {
    fetchBatches();
    fetchFarms();
    fetchProducts();
  }, []);

  // Function lấy danh sách trang trại
  const fetchFarms = async () => {
    try {
      const response = await apiService.getAllFarms();
      if (response && response.data) {
        setFarms(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error fetching farms:', error);
    }
  };

  // Function lấy danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      const response = await apiService.getFarmerProducts();
      if (response && response.data) {
        setProducts(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Hàm mở modal thêm mới
  const showModal = () => {
    setIsEditMode(false);
    setEditingBatch(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Hàm mở modal sửa
  const showEditModal = (record: DataType) => {
    setIsEditMode(true);
    setEditingBatch(record);
    form.setFieldsValue({
      soLuongHienTai: record.soLuongHienTai,
      ngayThuHoach: dayjs(record.ngayThuHoach),
      hanSuDung: dayjs(record.hanSuDung),
      maQR: record.maQR,
      trangThai: record.trangThai
    });
    setIsModalOpen(true);
  };

  // Hàm đóng modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingBatch(null);
    form.resetFields();
  };

  // Hàm xử lý submit form thêm/sửa lô nông sản
  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      if (isEditMode && editingBatch) {
        // Sửa lô nông sản - chỉ gửi các trường cho phép update
        const updateData: DuLieuCapNhatLoNongSan = {
          soLuongHienTai: values.soLuongHienTai,
          ngayThuHoach: values.ngayThuHoach.format('YYYY-MM-DD'),
          hanSuDung: values.hanSuDung.format('YYYY-MM-DD'),
          maQR: values.maQR,
          trangThai: values.trangThai
        };
        await apiService.updateBatch(editingBatch.maLo, updateData);
        message.success('Cập nhật lô nông sản thành công!');
      } else {
        // Thêm lô nông sản mới
        const batchData: DuLieuFormLoNongSan = {
          maTrangTrai: values.maTrangTrai,
          maSanPham: values.maSanPham,
          soLuongBanDau: values.soLuongBanDau,
          ngayThuHoach: values.ngayThuHoach.format('YYYY-MM-DD'),
          hanSuDung: values.hanSuDung.format('YYYY-MM-DD'),
          maQR: values.maQR
        };
        await apiService.addBatch(batchData);
        message.success('Thêm lô nông sản thành công!');
      }
      
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditingBatch(null);
      form.resetFields();
      fetchBatches();
    } catch (error: any) {
      console.error('Error saving batch:', error);
      message.error(error.response?.data?.message || 'Không thể lưu lô nông sản');
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý xóa lô nông sản
  const handleDelete = (record: DataType) => {
    Modal.confirm({
      title: 'Xác nhận xóa lô nông sản',
      content: `Bạn có chắc chắn muốn xóa lô nông sản "${record.maQR}" - ${record.tenSanPham}?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          setLoading(true);
          await apiService.deleteBatch(record.maLo);
          message.success('Xóa lô nông sản thành công!');
          fetchBatches();
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Không thể xóa lô nông sản');
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
      item.maQR.toLowerCase().includes(searchText.toLowerCase()) ||
      item.tenTrangTrai.toLowerCase().includes(searchText.toLowerCase()) ||
      item.tenSanPham.toLowerCase().includes(searchText.toLowerCase()) ||
      item.trangThai.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [data, searchText]);

  // Reset về trang 1 khi tìm kiếm
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  // Tính toán dữ liệu phân trang (từ filteredData)
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, pageSize]);

  // Hàm hiển thị trạng thái
  const renderStatus = (status: string) => {
    const statusMap: { [key: string]: { color: string; text: string } } = {
      'san_sang': { color: 'green', text: 'Sẵn sàng' },
      'dang_van_chuyen': { color: 'blue', text: 'Đang vận chuyển' },
      'da_ban': { color: 'default', text: 'Đã bán' },
      'het_han': { color: 'red', text: 'Hết hạn' }
    };
    
    const statusInfo = statusMap[status] || { color: 'default', text: status };
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
  };

  // Định nghĩa các cột của bảng
  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Mã lô',
      dataIndex: 'maLo',
      key: 'maLo',
      width: 80,
    },
    {
      title: 'Mã QR',
      dataIndex: 'maQR',
      key: 'maQR',
      width: 100,
    },
    {
      title: 'Trang trại',
      dataIndex: 'tenTrangTrai',
      key: 'tenTrangTrai',
      width: 150,
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'tenSanPham',
      key: 'tenSanPham',
      width: 150,
    },
    {
      title: 'SL ban đầu',
      dataIndex: 'soLuongBanDau',
      key: 'soLuongBanDau',
      width: 120,
      render: (value: number, record) => `${value} ${record.donViTinh}`,
    },
    {
      title: 'SL hiện tại',
      dataIndex: 'soLuongHienTai',
      key: 'soLuongHienTai',
      width: 120,
      render: (value: number, record) => `${value} ${record.donViTinh}`,
    },
    {
      title: 'Ngày thu hoạch',
      dataIndex: 'ngayThuHoach',
      key: 'ngayThuHoach',
      width: 130,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Hạn sử dụng',
      dataIndex: 'hanSuDung',
      key: 'hanSuDung',
      width: 130,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 130,
      render: renderStatus,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <ActionButton 
            type="default" 
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          >
            Sửa
          </ActionButton>
          <ActionButton 
            type="danger" 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            Xóa
          </ActionButton>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Quản lý lô nông sản</h1>
        <p>Quản lý các lô nông sản từ trang trại</p>
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
            placeholder="Tìm kiếm lô nông sản..."
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
            Thêm lô nông sản
          </ActionButton>
        </div>
        
        <Table<DataType>
          columns={columns} 
          dataSource={paginatedData}
          pagination={false}
          scroll={{ x: 1200 }}
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
            `${range[0]}-${range[1]} của ${total} lô nông sản`
          }
        />
      </Card>

      {/* Modal thêm/sửa lô nông sản */}
      <Modal
        title={isEditMode ? "Sửa lô nông sản" : "Thêm lô nông sản mới"}
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
          {!isEditMode && (
            <>
              <Form.Item
                label="Trang trại"
                name="maTrangTrai"
                rules={[
                  { required: true, message: 'Vui lòng chọn trang trại!' }
                ]}
              >
                <Select placeholder="Chọn trang trại">
                  {farms.map(farm => (
                    <Select.Option key={farm.maTrangTrai} value={farm.maTrangTrai}>
                      {farm.tenTrangTrai}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Sản phẩm"
                name="maSanPham"
                rules={[
                  { required: true, message: 'Vui lòng chọn sản phẩm!' }
                ]}
              >
                <Select placeholder="Chọn sản phẩm">
                  {products.map(product => (
                    <Select.Option key={product.maSanPham} value={product.maSanPham}>
                      {product.tenSanPham} ({product.donViTinh})
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Số lượng ban đầu"
                name="soLuongBanDau"
                rules={[
                  { required: true, message: 'Vui lòng nhập số lượng!' },
                  { type: 'number', min: 1, message: 'Số lượng phải lớn hơn 0!' }
                ]}
              >
                <InputNumber 
                  placeholder="Nhập số lượng" 
                  style={{ width: '100%' }}
                  min={1}
                />
              </Form.Item>

              <Form.Item
                label="Mã QR"
                name="maQR"
                rules={[
                  { required: true, message: 'Vui lòng nhập mã QR!' }
                ]}
              >
                <Input placeholder="Nhập mã QR" />
              </Form.Item>
            </>
          )}

          {isEditMode && (
            <>
              <Form.Item
                label="Số lượng hiện tại"
                name="soLuongHienTai"
                rules={[
                  { required: true, message: 'Vui lòng nhập số lượng hiện tại!' },
                  { type: 'number', min: 0, message: 'Số lượng không được âm!' }
                ]}
              >
                <InputNumber 
                  placeholder="Nhập số lượng hiện tại" 
                  style={{ width: '100%' }}
                  min={0}
                />
              </Form.Item>

              <Form.Item
                label="Mã QR"
                name="maQR"
                rules={[
                  { required: true, message: 'Vui lòng nhập mã QR!' }
                ]}
              >
                <Input placeholder="Nhập mã QR" />
              </Form.Item>

              <Form.Item
                label="Trạng thái"
                name="trangThai"
                rules={[
                  { required: true, message: 'Vui lòng chọn trạng thái!' }
                ]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Select.Option value="san_sang">Sẵn sàng</Select.Option>
                  <Select.Option value="dang_van_chuyen">Đang vận chuyển</Select.Option>
                  <Select.Option value="da_ban">Đã bán</Select.Option>
                  <Select.Option value="het_han">Hết hạn</Select.Option>
                </Select>
              </Form.Item>
            </>
          )}

          <Form.Item
            label="Ngày thu hoạch"
            name="ngayThuHoach"
            rules={[
              { required: true, message: 'Vui lòng chọn ngày thu hoạch!' }
            ]}
          >
            <DatePicker 
              placeholder="Chọn ngày thu hoạch"
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item
            label="Hạn sử dụng"
            name="hanSuDung"
            rules={[
              { required: true, message: 'Vui lòng chọn hạn sử dụng!' }
            ]}
          >
            <DatePicker 
              placeholder="Chọn hạn sử dụng"
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
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
                {isEditMode ? 'Cập nhật' : 'Thêm lô nông sản'}
              </ModalButton>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default QuanLyLoNongSan;
