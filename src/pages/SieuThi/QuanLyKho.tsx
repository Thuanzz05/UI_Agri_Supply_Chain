import React, { useState, useEffect } from 'react';
import { Table, Tag, message, Card, Button, Modal, Form, Input, Select, Space } from 'antd';
import { HomeOutlined, ReloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { AdminLayout } from '../../components/Layout';
import { authService } from '../../services/authService';
import { apiService } from '../../services/apiService';
import type { ColumnsType } from 'antd/es/table';
import { ModalButton } from '../../components/ModalButton';
import { ActionButton } from '../../components/ActionButton';
import './QuanLyKho.css';

interface Kho {
  maKho: number;
  tenKho: string;
  loaiKho: string;
  maChuSoHuu: number;
  loaiChuSoHuu: string;
  diaChi?: string;
  tenChuSoHuu?: string;
}

const QuanLyKho: React.FC = () => {
  const [khos, setKhos] = useState<Kho[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // State cho modal thêm/sửa kho
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Kho | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const user = authService.getStoredUser();
      
      if (!user?.maSieuThi) {
        message.error('Không tìm thấy thông tin siêu thị');
        return;
      }

      const khoRes = await apiService.getSupermarketWarehouses(user.maSieuThi);
      const data = khoRes?.data || khoRes;
      setKhos(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Error loading data:', error);
      message.error('Không thể tải dữ liệu kho hàng');
    } finally {
      setLoading(false);
    }
  };

  const showModal = () => {
    setIsEditMode(false);
    setEditingWarehouse(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const showEditModal = (record: Kho) => {
    setIsEditMode(true);
    setEditingWarehouse(record);
    form.setFieldsValue({
      tenKho: record.tenKho,
      loaiKho: record.loaiKho,
      diaChi: record.diaChi
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingWarehouse(null);
    form.resetFields();
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      if (isEditMode && editingWarehouse) {
        await apiService.updateSupermarketWarehouse(editingWarehouse.maKho, values);
        message.success('Cập nhật kho hàng thành công!');
      } else {
        const user = authService.getStoredUser();
        if (!user?.maSieuThi) {
          message.error('Không tìm thấy thông tin siêu thị');
          return;
        }
        
        const warehouseData = {
          ...values,
          maChuSoHuu: user.maSieuThi,
          loaiChuSoHuu: 'sieuthi'
        };
        
        await apiService.addSupermarketWarehouse(warehouseData);
        message.success('Thêm kho hàng thành công!');
      }
      
      setIsModalOpen(false);
      form.resetFields();
      setIsEditMode(false);
      setEditingWarehouse(null);
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Không thể lưu kho hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (record: Kho) => {
    Modal.confirm({
      title: 'Xác nhận xóa kho hàng',
      content: `Bạn có chắc chắn muốn xóa kho "${record.tenKho}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          setLoading(true);
          await apiService.deleteSupermarketWarehouse(record.maKho);
          message.success('Xóa kho hàng thành công!');
          loadData();
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Không thể xóa kho hàng');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const khoColumns: ColumnsType<Kho> = [
    ...(!isMobile ? [{
      title: 'Mã kho',
      dataIndex: 'maKho',
      key: 'maKho',
      width: 80,
    }] : []),
    {
      title: 'Tên kho',
      dataIndex: 'tenKho',
      key: 'tenKho',
    },
    {
      title: 'Loại kho',
      dataIndex: 'loaiKho',
      key: 'loaiKho',
      width: 120,
      render: (loai: string) => {
        const colorMap: Record<string, string> = {
          'lanh': 'blue',
          'dong': 'cyan',
          'thuong': 'green',
          'tong': 'purple',
          'sieuthi': 'orange'
        };
        return <Tag color={colorMap[loai] || 'default'}>{loai}</Tag>;
      }
    },
    ...(!isMobile ? [{
      title: 'Địa chỉ',
      dataIndex: 'diaChi',
      key: 'diaChi',
      ellipsis: true,
    }] : []),
    {
      title: 'Thao tác',
      key: 'action',
      width: isMobile ? 100 : 140,
      render: (_: any, record: Kho) => (
        <Space size="small">
          <ActionButton 
            type="default" 
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          >
            {!isMobile && 'Sửa'}
          </ActionButton>
          <ActionButton 
            type="danger" 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            {!isMobile && 'Xóa'}
          </ActionButton>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Quản lý kho hàng</h1>
        <p>Quản lý danh sách kho hàng của siêu thị</p>
      </div>

      <Card
        title={
          <Space>
            <HomeOutlined />
            <span>Danh sách kho hàng ({khos.length})</span>
          </Space>
        }
        extra={
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadData}
              loading={loading}
            >
              {!isMobile && 'Làm mới'}
            </Button>
            <ActionButton
              type="primary"
              icon={<PlusOutlined />}
              onClick={showModal}
            >
              {!isMobile ? 'Thêm kho' : 'Thêm'}
            </ActionButton>
          </Space>
        }
      >
        <Table
          columns={khoColumns}
          dataSource={khos}
          rowKey="maKho"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} kho`,
          }}
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
            <Input placeholder="Ví dụ: Kho lạnh tầng 1, Kho rau củ..." />
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
              <Select.Option value="lanh">Kho lạnh (2-8°C)</Select.Option>
              <Select.Option value="dong">Kho đông (-18°C)</Select.Option>
              <Select.Option value="sieuthi">Kho siêu thị</Select.Option>
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
