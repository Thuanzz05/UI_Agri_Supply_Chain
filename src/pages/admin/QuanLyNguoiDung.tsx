import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Modal,
  Descriptions,
  message,
  Card,
  Statistic,
  Row,
  Col,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  UserOutlined,
  ShopOutlined,
  HomeOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { AdminLayout } from '../../components/Layout';
import { apiService } from '../../services/apiService';
import SocialLinks from '../../components/SocialLinks';
import dayjs from 'dayjs';

const { Option } = Select;

interface User {
  id: number;
  tenDangNhap: string;
  email: string;
  hoTen: string;
  soDienThoai: string;
  diaChi: string;
  facebook?: string;
  tiktok?: string;
  ngayTao: string;
  trangThai: string;
  loaiNguoiDung: string;
}

interface UserDetail {
  maNongDan?: number;
  maDaiLy?: number;
  maSieuThi?: number;
  maTaiKhoan: number;
  tenDangNhap: string;
  email: string;
  trangThai: string;
  hoTen?: string;
  tenDaiLy?: string;
  tenSieuThi?: string;
  soDienThoai: string;
  diaChi: string;
  facebook?: string;
  tikTok?: string;
  ngayTao: string;
  soTrangTrai?: number;
  soLoNongSan?: number;
  soDonHangNhan?: number;
  soDonHangBan?: number;
  soKiemDinh?: number;
  soDonHangMua?: number;
  soKho?: number;
}

const QuanLyNguoiDung: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [filterType]);

  useEffect(() => {
    // Filter dữ liệu theo search text
    if (searchText) {
      const filtered = users.filter(user => 
        user.tenDangNhap.toLowerCase().includes(searchText.toLowerCase()) ||
        user.hoTen.toLowerCase().includes(searchText.toLowerCase()) ||
        user.soDienThoai.includes(searchText)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchText, users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filterType) {
        params.loaiNguoiDung = filterType;
      }
      const response = await apiService.getAllUsers(params);
      const data = response?.data || [];
      
      setUsers(data);
      setFilteredUsers(data);
      setPagination({
        ...pagination,
        total: response?.total || 0,
      });
    } catch (error: any) {
      message.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (record: User) => {
    setDetailModalVisible(true);
    setDetailLoading(true);
    try {
      let response;
      if (record.loaiNguoiDung === 'nongdan') {
        response = await apiService.getNongDanDetail(record.id);
      } else if (record.loaiNguoiDung === 'daily') {
        response = await apiService.getDaiLyDetail(record.id);
      } else {
        response = await apiService.getSieuThiDetail(record.id);
      }
      setSelectedUser(response?.data || null);
    } catch (error: any) {
      message.error('Không thể tải thông tin chi tiết');
      setDetailModalVisible(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const getLoaiNguoiDungTag = (loai: string) => {
    const map: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
      nongdan: { color: 'green', text: 'Nông dân', icon: <UserOutlined /> },
      daily: { color: 'blue', text: 'Đại lý', icon: <ShopOutlined /> },
      sieuthi: { color: 'purple', text: 'Siêu thị', icon: <HomeOutlined /> },
    };
    const config = map[loai] || { color: 'default', text: loai, icon: null };
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const getTrangThaiTag = (trangThai: string) => {
    return trangThai === 'hoat_dong' || trangThai === 'active' ? (
      <Tag color="success">Hoạt động</Tag>
    ) : (
      <Tag color="error">Khóa</Tag>
    );
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'tenDangNhap',
      key: 'tenDangNhap',
      width: 130,
    },
    {
      title: 'Họ tên',
      dataIndex: 'hoTen',
      key: 'hoTen',
      width: 150,
    },
    {
      title: 'Loại',
      dataIndex: 'loaiNguoiDung',
      key: 'loaiNguoiDung',
      width: 100,
      render: (loai: string) => getLoaiNguoiDungTag(loai),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'soDienThoai',
      key: 'soDienThoai',
      width: 120,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 110,
      render: (trangThai: string) => getTrangThaiTag(trangThai),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      fixed: 'right' as const,
      render: (_: any, record: User) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  const renderDetailContent = () => {
    if (!selectedUser) return null;

    const getName = () => {
      return selectedUser.hoTen || selectedUser.tenDaiLy || selectedUser.tenSieuThi || '';
    };

    return (
      <div>
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Tên đăng nhập" span={2}>
            <strong>{selectedUser.tenDangNhap}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Họ tên" span={2}>
            <strong style={{ fontSize: 16 }}>{getName()}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            <MailOutlined /> {selectedUser.email}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            <PhoneOutlined /> {selectedUser.soDienThoai}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ" span={2}>
            <EnvironmentOutlined /> {selectedUser.diaChi}
          </Descriptions.Item>
          <Descriptions.Item label="Mạng xã hội" span={2}>
            <SocialLinks data={selectedUser} showEmpty />
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            {getTrangThaiTag(selectedUser.trangThai)}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {dayjs(selectedUser.ngayTao).format('DD/MM/YYYY HH:mm')}
          </Descriptions.Item>

        </Descriptions>

        {/* Thống kê */}
        <div style={{ marginTop: 24 }}>
          <h3>Thống kê hoạt động</h3>
          <Row gutter={16}>
            {selectedUser.soTrangTrai !== undefined && (
              <>
                <Col span={12}>
                  <Card>
                    <Statistic
                      title="Số trang trại"
                      value={selectedUser.soTrangTrai}
                      prefix={<HomeOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card>
                    <Statistic
                      title="Số lô nông sản"
                      value={selectedUser.soLoNongSan}
                      prefix={<ShopOutlined />}
                    />
                  </Card>
                </Col>
              </>
            )}
            {selectedUser.soDonHangNhan !== undefined && (
              <>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Đơn hàng nhận"
                      value={selectedUser.soDonHangNhan}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Đơn hàng bán"
                      value={selectedUser.soDonHangBan}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Số kiểm định"
                      value={selectedUser.soKiemDinh}
                    />
                  </Card>
                </Col>
              </>
            )}
            {selectedUser.soDonHangMua !== undefined && (
              <>
                <Col span={12}>
                  <Card>
                    <Statistic
                      title="Đơn hàng mua"
                      value={selectedUser.soDonHangMua}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card>
                    <Statistic
                      title="Số kho"
                      value={selectedUser.soKho}
                    />
                  </Card>
                </Col>
              </>
            )}
          </Row>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Quản lý người dùng</h1>
        <p>Quản lý tất cả người dùng trong hệ thống</p>
      </div>

      <Card>
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="Tìm theo tên, SĐT, email..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          <Select
            placeholder="Lọc theo loại"
            style={{ width: 150 }}
            value={filterType || undefined}
            onChange={(value) => setFilterType(value || '')}
            allowClear
          >
            <Option value="nongdan">Nông dân</Option>
            <Option value="daily">Đại lý</Option>
            <Option value="sieuthi">Siêu thị</Option>
          </Select>
        </Space>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: filteredUsers.length,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} người dùng`,
            onChange: (page, pageSize) => {
              setPagination({ ...pagination, current: page, pageSize: pageSize || 10 });
            },
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      <Modal
        title="Chi tiết người dùng"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={800}
      >
        {detailLoading ? <div>Đang tải...</div> : renderDetailContent()}
      </Modal>
    </AdminLayout>
  );
};

export default QuanLyNguoiDung;
