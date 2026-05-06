import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, message, Card, Statistic, Row, Col, Modal, Form, Input, Select, DatePicker } from 'antd';
import { TruckOutlined, ClockCircleOutlined, CheckCircleOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { AdminLayout } from '../../components/Layout';
import { apiService } from '../../services/apiService';
import { ActionButton } from '../../components/ActionButton';
import { ModalButton } from '../../components/ModalButton';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { Kho } from '../../types/kho';

interface VanChuyen {
  maVanChuyen: number;
  maLo: number;
  tenSanPham?: string;
  diemDi: string;
  diemDen: string;
  ngayBatDau: string;
  ngayKetThuc?: string;
  trangThai: string;
  donViTinh?: string;
  maQR?: string;
  soLuongLo?: number;
  ngayThuHoach?: string;
  hanSuDung?: string;
  ghiChu?: string;
}

const QuanLyVanChuyen: React.FC = () => {
  const [vanChuyens, setVanChuyens] = useState<VanChuyen[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingVanChuyen, setEditingVanChuyen] = useState<VanChuyen | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [warehouses, setWarehouses] = useState<Kho[]>([]);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [completingTransportId, setCompletingTransportId] = useState<number | null>(null);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(null);
  const [stats, setStats] = useState({
    tongVanChuyen: 0,
    dangVanChuyen: 0,
    hoanThanh: 0
  });
  const [form] = Form.useForm();

  const getApiErrorMessage = (error: any, fallbackMessage: string) => {
    const responseData = error?.response?.data;
    if (typeof responseData === 'string' && responseData.trim()) return responseData;
    if (typeof responseData?.message === 'string' && responseData.message.trim()) return responseData.message;
    if (typeof responseData?.title === 'string' && responseData.title.trim()) return responseData.title;
    return fallbackMessage;
  };

  useEffect(() => {
    loadVanChuyens();
  }, []);

  const loadVanChuyens = async () => {
    try {
      setLoading(true);
      
      // Lấy thông tin đại lý từ localStorage
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        message.error('Không tìm thấy thông tin người dùng');
        setVanChuyens([]);
        return;
      }

      const user = JSON.parse(userStr);
      const maDaiLy = user.maDaiLy;

      if (!maDaiLy) {
        message.error('Không tìm thấy mã đại lý');
        setVanChuyens([]);
        return;
      }

      // Gọi API lấy vận chuyển theo đại lý
      const [response, warehouseRes] = await Promise.all([
        apiService.getTransportsByAgent(maDaiLy),
        apiService.getWarehousesByAgent(String(maDaiLy)),
      ]);
      // Backend trả về { success, data, count } - cần lấy data từ response
      let list: any[] = [];
      if (response && response.data) {
        list = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        list = response;
      }
      setVanChuyens(list);

      const whData = warehouseRes?.data || warehouseRes;
      setWarehouses(Array.isArray(whData) ? whData : []);

      // Fetch stats
      const statsResponse = await apiService.getTransportStats(maDaiLy);
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (error: any) {
      console.error('Error loading transports:', error);
      message.error('Không thể tải danh sách vận chuyển');
      setVanChuyens([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingVanChuyen(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: VanChuyen) => {
    setEditingVanChuyen(record);
    form.setFieldsValue({
      ...record,
      ngayBatDau: record.ngayBatDau ? dayjs(record.ngayBatDau) : null,
      ngayKetThuc: record.ngayKetThuc ? dayjs(record.ngayKetThuc) : null,
    });
    setModalVisible(true);
  };

  const handleComplete = async (id: number) => {
    setCompletingTransportId(id);
    setSelectedWarehouseId(null);
    setCompleteModalOpen(true);
  };

  const confirmComplete = async () => {
    if (!completingTransportId) return;
    if (!selectedWarehouseId) {
      message.error('Vui lòng chọn kho đích để nhập hàng');
      return;
    }

    try {
      await apiService.completeTransport(completingTransportId, selectedWarehouseId);
      message.success('Hoàn thành vận chuyển thành công');
      setCompleteModalOpen(false);
      setCompletingTransportId(null);
      setSelectedWarehouseId(null);
      loadVanChuyens();
    } catch (error: any) {
      console.error('Error completing transport:', error);
      message.error(getApiErrorMessage(error, 'Không thể hoàn thành vận chuyển'));
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const submitData = {
        ...values,
        ngayBatDau: values.ngayBatDau?.format('YYYY-MM-DD'),
        ngayKetThuc: values.ngayKetThuc?.format('YYYY-MM-DD'),
      };

      if (editingVanChuyen) {
        await apiService.updateTransportStatus(editingVanChuyen.maVanChuyen, submitData);
        message.success('Cập nhật vận chuyển thành công');
      } else {
        await apiService.createTransport(submitData);
        message.success('Tạo vận chuyển thành công');
      }

      setModalVisible(false);
      loadVanChuyens();
    } catch (error: any) {
      console.error('Error saving transport:', error);
      message.error(getApiErrorMessage(error, 'Không thể lưu thông tin vận chuyển'));
    }
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      'dang_van_chuyen': 'blue',
      'hoan_thanh': 'green',
      'da_huy': 'red',
    };
    return statusMap[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'dang_van_chuyen': 'Đang vận chuyển',
      'hoan_thanh': 'Hoàn thành',
      'da_huy': 'Đã hủy',
    };
    return statusMap[status] || status;
  };

  const filteredVanChuyens = filterStatus === 'all' 
    ? vanChuyens 
    : vanChuyens.filter(vc => vc.trangThai === filterStatus);

  const columns: ColumnsType<VanChuyen> = [
    {
      title: 'Mã VC',
      dataIndex: 'maVanChuyen',
      key: 'maVanChuyen',
      width: 80,
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'tenSanPham',
      key: 'tenSanPham',
      width: 150,
      render: (text: string) => text || 'N/A',
    },
    {
      title: 'Điểm đi',
      dataIndex: 'diemDi',
      key: 'diemDi',
      ellipsis: true,
    },
    {
      title: 'Điểm đến',
      dataIndex: 'diemDen',
      key: 'diemDen',
      ellipsis: true,
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'ngayBatDau',
      key: 'ngayBatDau',
      width: 110,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'ngayKetThuc',
      key: 'ngayKetThuc',
      width: 110,
      render: (date: string) => date ? dayjs(date).format('DD/MM/YYYY') : '-',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 130,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <ModalButton
            type="default"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </ModalButton>
          {record.trangThai === 'dang_van_chuyen' && (
            <ModalButton
              type="primary"
              onClick={() => handleComplete(record.maVanChuyen)}
            >
              Hoàn thành
            </ModalButton>
          )}
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Quản lý Vận chuyển</h1>
        <p>Quản lý vận chuyển hàng hóa</p>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Tổng vận chuyển"
              value={stats.tongVanChuyen}
              prefix={<TruckOutlined />}
              styles={{ content: { color: '#1890ff' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Đang vận chuyển"
              value={stats.dangVanChuyen}
              prefix={<ClockCircleOutlined />}
              styles={{ content: { color: '#faad14' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Hoàn thành"
              value={stats.hoanThanh}
              prefix={<CheckCircleOutlined />}
              styles={{ content: { color: '#52c41a' } }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Space style={{ marginBottom: 16 }}>
          <ActionButton
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Tạo vận chuyển
          </ActionButton>
          
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ width: 200 }}
          >
            <Select.Option value="all">Tất cả trạng thái</Select.Option>
            <Select.Option value="dang_van_chuyen">Đang vận chuyển</Select.Option>
            <Select.Option value="hoan_thanh">Hoàn thành</Select.Option>
            <Select.Option value="da_huy">Đã hủy</Select.Option>
          </Select>
        </Space>

        <Table
          columns={columns}
          dataSource={filteredVanChuyens}
          rowKey="maVanChuyen"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} vận chuyển`,
          }}
        />
      </Card>

      <Modal
        title={editingVanChuyen ? 'Cập nhật vận chuyển' : 'Tạo vận chuyển mới'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Mã lô"
            name="maLo"
            rules={[{ required: true, message: 'Vui lòng nhập mã lô!' }]}
          >
            <Input placeholder="Nhập mã lô" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Điểm đi"
                name="diemDi"
                rules={[{ required: true, message: 'Vui lòng nhập điểm đi!' }]}
              >
                <Input placeholder="Nhập điểm đi" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Điểm đến"
                name="diemDen"
                rules={[{ required: true, message: 'Vui lòng nhập điểm đến!' }]}
              >
                <Input placeholder="Nhập điểm đến" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Ngày bắt đầu"
                name="ngayBatDau"
                rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ngày kết thúc"
                name="ngayKetThuc"
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Trạng thái"
            name="trangThai"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value="dang_van_chuyen">Đang vận chuyển</Select.Option>
              <Select.Option value="hoan_thanh">Hoàn thành</Select.Option>
              <Select.Option value="da_huy">Đã hủy</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Ghi chú"
            name="ghiChu"
          >
            <Input.TextArea rows={3} placeholder="Nhập ghi chú" />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <ModalButton onClick={() => setModalVisible(false)}>
                Hủy
              </ModalButton>
              <ModalButton type="primary" htmlType="submit">
                {editingVanChuyen ? 'Cập nhật' : 'Tạo mới'}
              </ModalButton>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chọn kho đích để nhập hàng"
        open={completeModalOpen}
        onCancel={() => {
          setCompleteModalOpen(false);
          setCompletingTransportId(null);
          setSelectedWarehouseId(null);
        }}
        footer={
          <Space>
            <ModalButton
              onClick={() => {
                setCompleteModalOpen(false);
                setCompletingTransportId(null);
                setSelectedWarehouseId(null);
              }}
            >
              Hủy
            </ModalButton>
            <ModalButton type="primary" onClick={confirmComplete}>
              Xác nhận
            </ModalButton>
          </Space>
        }
      >
        <Select
          placeholder="Chọn kho đích"
          style={{ width: '100%' }}
          value={selectedWarehouseId ?? undefined}
          onChange={(value) => setSelectedWarehouseId(Number(value))}
          options={warehouses.map((kho) => ({
            value: kho.maKho,
            label: `${kho.maKho} - ${kho.tenKho}${kho.diaChi ? ` (${kho.diaChi})` : ''}`,
          }))}
        />
      </Modal>
    </AdminLayout>
  );
};

export default QuanLyVanChuyen;