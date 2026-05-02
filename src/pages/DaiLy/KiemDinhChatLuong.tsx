import React from 'react';
import { Card, Table, Tag, Modal, Form, Input, Select, Space, message, Row, Col, Statistic } from 'antd';
import type { TableProps } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined, SafetyOutlined } from '@ant-design/icons';
import { AdminLayout } from '../../components/Layout';
import { CustomPagination } from '../../components/CustomPagination';
import { ModalButton } from '../../components/ModalButton';
import { ActionButton } from '../../components/ActionButton';
import { apiService } from '../../services/apiService';
import { authService } from '../../services/authService';
import type { LoHangKiemDinh } from '../../types/kiemDinh';

interface DataType extends LoHangKiemDinh {
  key: string;
}

const getTrangThaiColor = (trangThai: string) => {
  switch (trangThai) {
    case 'cho_kiem_dinh':
      return 'orange';
    case 'dat':
      return 'green';
    case 'khong_dat':
      return 'red';
    default:
      return 'default';
  }
};

const getTrangThaiText = (trangThai: string) => {
  switch (trangThai) {
    case 'cho_kiem_dinh':
      return 'Chờ kiểm định';
    case 'dat':
      return 'Đạt chuẩn';
    case 'khong_dat':
      return 'Không đạt';
    default:
      return trangThai;
  }
};

const KiemDinhChatLuong: React.FC = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [loading, setLoading] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<string>('all');
  const [data, setData] = React.useState<DataType[]>([]);
  const [stats, setStats] = React.useState({
    choKiemDinh: 0,
    datChuanCount: 0,
    khongDatCount: 0
  });
  
  // Modal kiểm định
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedLo, setSelectedLo] = React.useState<LoHangKiemDinh | null>(null);
  const [form] = Form.useForm();

  // Load dữ liệu
  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const user = authService.getStoredUser();
      const maDaiLy = user?.maDaiLy || (user as any)?.MaDaiLy;
      
      if (!maDaiLy) {
        message.error('Không tìm thấy thông tin đại lý');
        return;
      }
      
      // Fetch lots data
      const response = await apiService.getLoHangKiemDinhByDaiLy(maDaiLy);
      const apiData = response.data || response;
      const formattedData = apiData.map((item: LoHangKiemDinh) => ({
        ...item,
        key: item.maLo.toString(),
        ngayThuHoach: item.ngayThuHoach ? new Date(item.ngayThuHoach).toISOString().split('T')[0] : '',
        ngayKiemDinh: item.ngayKiemDinh ? new Date(item.ngayKiemDinh).toISOString().split('T')[0] : undefined,
      }));
      
      setData(formattedData);

      // Fetch stats
      const statsResponse = await apiService.getKiemDinhStats(maDaiLy);
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (error: any) {
      console.error('Lỗi khi tải dữ liệu:', error);
      message.error('Không thể tải dữ liệu kiểm định: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const showKiemDinhModal = (record: DataType) => {
    setSelectedLo(record);
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedLo(null);
    form.resetFields();
  };

  const handleKiemDinh = async (values: any) => {
    try {
      setLoading(true);
      const user = authService.getStoredUser();
      
      const kiemDinhData = {
        maLo: selectedLo!.maLo,
        nguoiKiemDinh: user?.tenDangNhap || 'Đại lý',
        ketQua: values.ketQua,
        bienBanKiemTra: values.ghiChu,
        ngayKiemDinh: new Date().toISOString(),
      };
      
      await apiService.kiemDinhLoHang(kiemDinhData);
      message.success('Kiểm định thành công!');
      handleCancel();
      loadData();
    } catch (error) {
      console.error('Lỗi khi kiểm định:', error);
      message.error('Có lỗi xảy ra khi kiểm định');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = React.useMemo(() => {
    let result = data;
    
    if (searchText) {
      result = result.filter(item =>
        item.tenSanPham.toLowerCase().includes(searchText.toLowerCase()) ||
        item.tenNongDan.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    if (filterStatus !== 'all') {
      result = result.filter(item => item.trangThaiKiemDinh === filterStatus);
    }
    
    return result;
  }, [data, searchText, filterStatus]);

  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [currentPage, filteredData, pageSize]);

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Mã lô',
      dataIndex: 'maLo',
      key: 'maLo',
      width: 80,
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'tenSanPham',
      key: 'tenSanPham',
      width: 150,
    },
    {
      title: 'Nông dân',
      dataIndex: 'tenNongDan',
      key: 'tenNongDan',
      width: 150,
    },
    {
      title: 'Số lượng',
      key: 'soLuong',
      width: 120,
      render: (_, record) => `${record.soLuong} ${record.donViTinh}`,
    },
    {
      title: 'Ngày thu hoạch',
      dataIndex: 'ngayThuHoach',
      key: 'ngayThuHoach',
      width: 130,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThaiKiemDinh',
      key: 'trangThaiKiemDinh',
      width: 130,
      render: (value: string) => (
        <Tag color={getTrangThaiColor(value)}>{getTrangThaiText(value)}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <ActionButton
          type="primary"
          icon={record.trangThaiKiemDinh === 'cho_kiem_dinh' ? <SafetyOutlined /> : <EyeOutlined />}
          onClick={() => showKiemDinhModal(record)}
        >
          {record.trangThaiKiemDinh === 'cho_kiem_dinh' ? 'Kiểm định' : 'Chi tiết'}
        </ActionButton>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Kiểm định chất lượng</h1>
        <p>Kiểm tra và xác nhận chất lượng lô nông sản</p>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Chờ kiểm định"
              value={stats.choKiemDinh}
              prefix={<SafetyOutlined style={{ color: '#fa8c16' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Đạt chuẩn"
              value={stats.datChuanCount}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Không đạt"
              value={stats.khongDatCount}
              prefix={<CloseCircleOutlined style={{ color: '#f5222d' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          padding: '16px 0',
          borderBottom: '1px solid #f0f0f0',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <Input
            placeholder="Tìm kiếm sản phẩm, nông dân..."
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
          <Select
            style={{ width: 200 }}
            value={filterStatus}
            onChange={setFilterStatus}
            options={[
              { label: 'Tất cả trạng thái', value: 'all' },
              { label: 'Chờ kiểm định', value: 'cho_kiem_dinh' },
              { label: 'Đạt chuẩn', value: 'dat' },
              { label: 'Không đạt', value: 'khong_dat' },
            ]}
          />
        </div>

        <Table<DataType>
          columns={columns}
          dataSource={paginatedData}
          pagination={false}
          loading={loading}
          scroll={{ x: 900 }}
        />

        <CustomPagination
          current={currentPage}
          total={filteredData.length}
          pageSize={pageSize}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size || 10);
          }}
          showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} lô hàng`}
        />
      </Card>

      {/* Modal kiểm định */}
      <Modal
        title={selectedLo?.trangThaiKiemDinh === 'cho_kiem_dinh' ? 'Kiểm định chất lượng' : 'Chi tiết kiểm định'}
        open={isModalOpen}
        onCancel={handleCancel}
        width={600}
        footer={
          selectedLo?.trangThaiKiemDinh === 'cho_kiem_dinh' ? (
            <Space>
              <ModalButton onClick={handleCancel}>Hủy</ModalButton>
              <ModalButton type="primary" onClick={() => form.submit()} loading={loading}>
                Xác nhận kiểm định
              </ModalButton>
            </Space>
          ) : (
            <ModalButton onClick={handleCancel}>Đóng</ModalButton>
          )
        }
      >
        {selectedLo && (
          <>
            <div style={{ marginBottom: 24, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
              <p><strong>Mã lô:</strong> {selectedLo.maLo}</p>
              <p><strong>Sản phẩm:</strong> {selectedLo.tenSanPham}</p>
              <p><strong>Nông dân:</strong> {selectedLo.tenNongDan}</p>
              <p><strong>Số lượng:</strong> {selectedLo.soLuong} {selectedLo.donViTinh}</p>
              <p><strong>Ngày thu hoạch:</strong> {selectedLo.ngayThuHoach}</p>
            </div>

            {selectedLo.trangThaiKiemDinh === 'cho_kiem_dinh' ? (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleKiemDinh}
              >
                <Form.Item
                  label="Kết quả kiểm định"
                  name="ketQua"
                  rules={[{ required: true, message: 'Vui lòng chọn kết quả!' }]}
                >
                  <Select
                    placeholder="Chọn kết quả"
                    options={[
                      { label: 'Đạt chuẩn', value: 'dat' },
                      { label: 'Không đạt', value: 'khong_dat' },
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  label="Ghi chú"
                  name="ghiChu"
                  rules={[{ required: true, message: 'Vui lòng nhập ghi chú!' }]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Nhập kết quả kiểm tra chi tiết..."
                  />
                </Form.Item>
              </Form>
            ) : (
              <div>
                <p><strong>Trạng thái:</strong> <Tag color={getTrangThaiColor(selectedLo.trangThaiKiemDinh)}>{getTrangThaiText(selectedLo.trangThaiKiemDinh)}</Tag></p>
                <p><strong>Ngày kiểm định:</strong> {selectedLo.ngayKiemDinh}</p>
                <p><strong>Kết quả:</strong></p>
                <div style={{ padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
                  {selectedLo.ketQuaKiemDinh}
                </div>
              </div>
            )}
          </>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default KiemDinhChatLuong;
