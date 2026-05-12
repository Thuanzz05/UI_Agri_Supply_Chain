import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, message, Card, Statistic, Row, Col, Modal, Form, Input, Select, DatePicker, Tooltip, Descriptions } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  PlusOutlined,
  TruckOutlined,
} from '@ant-design/icons';
import { AdminLayout } from '../../components/Layout';
import { apiService } from '../../services/apiService';
import { ActionButton } from '../../components/ActionButton';
import { ModalButton } from '../../components/ModalButton';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { Kho } from '../../types/kho';
import './QuanLyVanChuyen.css';

interface VanChuyen {
  maVanChuyen: number;
  maLo: number;
  maDonHang?: number;
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

// Interface cho vận chuyển đã nhóm theo đơn hàng
interface GroupedVanChuyen {
  maDonHang: number | null;
  diemDi: string;
  diemDen: string;
  ngayBatDau: string;
  ngayKetThuc?: string;
  trangThai: string;
  soLuongSanPham: number; // Số lượng sản phẩm/lô trong đơn
  danhSachLo: VanChuyen[]; // Danh sách các lô trong đơn
  tenSanPham: string; // Tên sản phẩm (nếu nhiều sẽ hiển thị "Nhiều sản phẩm")
}

const QuanLyVanChuyen: React.FC = () => {
  const [vanChuyens, setVanChuyens] = useState<VanChuyen[]>([]);
  const [groupedVanChuyens, setGroupedVanChuyens] = useState<GroupedVanChuyen[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingVanChuyen, setEditingVanChuyen] = useState<VanChuyen | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [warehouses, setWarehouses] = useState<Kho[]>([]);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [completingGroup, setCompletingGroup] = useState<GroupedVanChuyen | null>(null);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(null);
  const [stats, setStats] = useState({
    tongVanChuyen: 0,
    dangVanChuyen: 0,
    hoanThanh: 0
  });
  const [form] = Form.useForm();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 992);
  
  // Modal chi tiết vận chuyển
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupedVanChuyen | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

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

  useEffect(() => {
    // Nhóm vận chuyển theo đơn hàng
    const grouped = groupVanChuyensByOrder(vanChuyens);
    setGroupedVanChuyens(grouped);
  }, [vanChuyens]);

  const groupVanChuyensByOrder = (list: VanChuyen[]): GroupedVanChuyen[] => {
    const groups = new Map<string, VanChuyen[]>();
    
    // Nhóm theo maDonHang (hoặc maVanChuyen nếu không có maDonHang)
    list.forEach(vc => {
      const groupKey = vc.maDonHang ? `order_${vc.maDonHang}` : `transport_${vc.maVanChuyen}`;
      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(vc);
    });

    // Chuyển đổi thành GroupedVanChuyen
    const result: GroupedVanChuyen[] = [];
    groups.forEach((items) => {
      const first = items[0];
      const uniqueProducts = new Set(items.map(i => i.tenSanPham).filter(Boolean));
      
      result.push({
        maDonHang: first.maDonHang || null,
        diemDi: first.diemDi,
        diemDen: first.diemDen,
        ngayBatDau: first.ngayBatDau,
        ngayKetThuc: first.ngayKetThuc,
        trangThai: first.trangThai,
        soLuongSanPham: items.length,
        danhSachLo: items,
        tenSanPham: uniqueProducts.size === 1 
          ? Array.from(uniqueProducts)[0] || 'N/A'
          : `${uniqueProducts.size} sản phẩm`
      });
    });

    return result.sort((a, b) => 
      new Date(b.ngayBatDau).getTime() - new Date(a.ngayBatDau).getTime()
    );
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 992);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  const handleComplete = async (group: GroupedVanChuyen) => {
    // Kiểm tra xem có phải đơn bán ra không (có maDonHang)
    if (group.maDonHang) {
      // Đơn bán ra - không cần chọn kho, tự động nhập vào kho siêu thị
      Modal.confirm({
        title: 'Xác nhận hoàn thành vận chuyển',
        content: 'Hàng sẽ được tự động nhập vào kho siêu thị. Bạn có chắc muốn hoàn thành vận chuyển này?',
        okText: 'Xác nhận',
        cancelText: 'Hủy',
        onOk: async () => {
          try {
            // Hoàn thành tất cả các vận chuyển trong nhóm (không cần maKhoDich)
            for (const vc of group.danhSachLo) {
              await apiService.completeTransport(vc.maVanChuyen, 0); // Pass 0 để backend tự động lấy kho siêu thị
            }
            message.success('Hoàn thành vận chuyển thành công. Hàng đã được nhập vào kho siêu thị.');
            loadVanChuyens();
          } catch (error: any) {
            console.error('Error completing transport:', error);
            message.error(getApiErrorMessage(error, 'Không thể hoàn thành vận chuyển'));
          }
        },
      });
    } else {
      // Đơn mua vào - cần chọn kho đại lý
      setCompletingGroup(group);
      setSelectedWarehouseId(null);
      setCompleteModalOpen(true);
    }
  };

  const confirmComplete = async () => {
    if (!completingGroup) return;
    if (!selectedWarehouseId) {
      message.error('Vui lòng chọn kho đích để nhập hàng');
      return;
    }

    try {
      // Hoàn thành tất cả các vận chuyển trong nhóm
      for (const vc of completingGroup.danhSachLo) {
        await apiService.completeTransport(vc.maVanChuyen, selectedWarehouseId);
      }
      message.success('Hoàn thành vận chuyển thành công');
      setCompleteModalOpen(false);
      setCompletingGroup(null);
      setSelectedWarehouseId(null);
      loadVanChuyens();
    } catch (error: any) {
      console.error('Error completing transport:', error);
      message.error(getApiErrorMessage(error, 'Không thể hoàn thành vận chuyển'));
    }
  };

  const handleViewDetail = async (group: GroupedVanChuyen) => {
    setSelectedGroup(group);
    setIsDetailModalOpen(true);
    setDetailLoading(false);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedGroup(null);
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
    ? groupedVanChuyens 
    : groupedVanChuyens.filter(vc => vc.trangThai === filterStatus);

  const columns: ColumnsType<GroupedVanChuyen> = [
    ...(!isMobile ? [{
      title: 'Mã ĐH',
      dataIndex: 'maDonHang',
      key: 'maDonHang',
      width: 80,
      render: (value: number | null) => value || '-',
    }] : []),
    {
      title: 'Sản phẩm',
      dataIndex: 'tenSanPham',
      key: 'tenSanPham',
      width: 150,
      render: (text: string, record: GroupedVanChuyen) => (
        <div>
          <div>{text}</div>
          {record.soLuongSanPham > 1 && (
            <div style={{ fontSize: 12, color: '#888' }}>
              ({record.soLuongSanPham} lô)
            </div>
          )}
        </div>
      ),
    },
    ...(!isMobile ? [{
      title: 'Điểm đi',
      dataIndex: 'diemDi',
      key: 'diemDi',
      ellipsis: true,
    }] : []),
    ...(!isMobile ? [{
      title: 'Điểm đến',
      dataIndex: 'diemDen',
      key: 'diemDen',
      ellipsis: true,
    }] : []),
    ...(!isTablet && !isMobile ? [{
      title: 'Ngày bắt đầu',
      dataIndex: 'ngayBatDau',
      key: 'ngayBatDau',
      width: 110,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    }] : []),
    ...(!isTablet && !isMobile ? [{
      title: 'Ngày kết thúc',
      dataIndex: 'ngayKetThuc',
      key: 'ngayKetThuc',
      width: 110,
      render: (date: string) => date ? dayjs(date).format('DD/MM/YYYY') : '-',
    }] : []),
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: isMobile ? 100 : 130,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {isMobile ? (status === 'dang_van_chuyen' ? 'Đang VC' : status === 'hoan_thanh' ? 'HT' : 'Hủy') : getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: isMobile ? 120 : 180,
      fixed: (isMobile ? undefined : 'right') as any,
      render: (_: any, record: GroupedVanChuyen) => (
        <Space size={isMobile ? 4 : 8}>
          <Tooltip title="Xem chi tiết">
            <ModalButton
              type="default"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          {record.trangThai === 'dang_van_chuyen' && (
            <Tooltip title="Hoàn thành">
              <ModalButton
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handleComplete(record)}
              />
            </Tooltip>
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
        <Space style={{ marginBottom: 16, flexWrap: 'wrap' }}>
          <ActionButton
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            {isMobile ? 'Tạo' : 'Tạo vận chuyển'}
          </ActionButton>
          
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ width: isMobile ? 120 : 200 }}
          >
            <Select.Option value="all">Tất cả</Select.Option>
            <Select.Option value="dang_van_chuyen">Đang VC</Select.Option>
            <Select.Option value="hoan_thanh">Hoàn thành</Select.Option>
            <Select.Option value="da_huy">Đã hủy</Select.Option>
          </Select>
        </Space>

        <Table
          columns={columns}
          dataSource={filteredVanChuyens}
          rowKey={(record) => record.maDonHang ? `order_${record.maDonHang}` : `group_${record.danhSachLo[0]?.maVanChuyen}`}
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
            <Select 
              placeholder="Chọn trạng thái"
              disabled={editingVanChuyen?.trangThai === 'hoan_thanh'}
            >
              {editingVanChuyen?.trangThai === 'da_huy' ? (
                <Select.Option value="dang_van_chuyen">Đang vận chuyển</Select.Option>
              ) : (
                <>
                  <Select.Option value="dang_van_chuyen">Đang vận chuyển</Select.Option>
                  <Select.Option value="hoan_thanh">Hoàn thành</Select.Option>
                  <Select.Option value="da_huy">Đã hủy</Select.Option>
                </>
              )}
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
          setCompletingGroup(null);
          setSelectedWarehouseId(null);
        }}
        footer={
          <Space>
            <ModalButton
              onClick={() => {
                setCompleteModalOpen(false);
                setCompletingGroup(null);
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

      {/* Modal chi tiết vận chuyển */}
      <Modal
        title="Chi tiết vận chuyển"
        open={isDetailModalOpen}
        onCancel={handleCloseDetailModal}
        width={800}
        footer={
          <Space>
            <ModalButton onClick={handleCloseDetailModal}>
              Đóng
            </ModalButton>
            {selectedGroup?.trangThai === 'dang_van_chuyen' && (
              <ModalButton
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => {
                  handleCloseDetailModal();
                  handleComplete(selectedGroup);
                }}
              >
                Hoàn thành vận chuyển
              </ModalButton>
            )}
          </Space>
        }
      >
        {detailLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>Đang tải...</div>
        ) : selectedGroup ? (
          <>
            <Descriptions bordered column={2} size="small" style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Mã đơn hàng" span={2}>
                {selectedGroup.maDonHang || 'Không có'}
              </Descriptions.Item>
              <Descriptions.Item label="Điểm đi" span={2}>
                {selectedGroup.diemDi}
              </Descriptions.Item>
              <Descriptions.Item label="Điểm đến" span={2}>
                {selectedGroup.diemDen}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày bắt đầu">
                {dayjs(selectedGroup.ngayBatDau).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày kết thúc">
                {selectedGroup.ngayKetThuc 
                  ? dayjs(selectedGroup.ngayKetThuc).format('DD/MM/YYYY HH:mm')
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái" span={2}>
                <Tag color={getStatusColor(selectedGroup.trangThai)}>
                  {getStatusText(selectedGroup.trangThai)}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <h4 style={{ marginBottom: 12 }}>Danh sách lô trong vận chuyển ({selectedGroup.soLuongSanPham} lô)</h4>
            <Table
              size="small"
              dataSource={selectedGroup.danhSachLo}
              rowKey="maVanChuyen"
              pagination={false}
              columns={[
                {
                  title: 'Mã VC',
                  dataIndex: 'maVanChuyen',
                  width: 80,
                },
                {
                  title: 'Sản phẩm',
                  dataIndex: 'tenSanPham',
                  render: (text: string) => text || 'N/A',
                },
                {
                  title: 'Mã lô',
                  dataIndex: 'maLo',
                  width: 80,
                },
                {
                  title: 'Số lượng',
                  dataIndex: 'soLuongLo',
                  width: 100,
                  render: (value: number, record: VanChuyen) => 
                    `${value || 0} ${record.donViTinh || 'kg'}`,
                },
                {
                  title: 'Mã QR',
                  dataIndex: 'maQR',
                  width: 120,
                  render: (text: string) => text || '-',
                },
              ]}
            />
          </>
        ) : null}
      </Modal>
    </AdminLayout>
  );
};

export default QuanLyVanChuyen;