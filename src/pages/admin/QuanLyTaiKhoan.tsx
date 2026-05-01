import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Modal,
  message,
  Card,
  Popconfirm,
  Form,
} from 'antd';
import {
  SearchOutlined,
  LockOutlined,
  UnlockOutlined,
  DeleteOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import { AdminLayout } from '../../components/Layout';
import { apiService } from '../../services/apiService';
import dayjs from 'dayjs';

const { Option } = Select;

interface Account {
  maTaiKhoan: number;
  tenDangNhap: string;
  email: string;
  loaiTaiKhoan: string;
  trangThai: string;
  ngayTao: string;
}

const QuanLyTaiKhoan: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAccounts();
  }, [filterType]);

  useEffect(() => {
    // Filter dữ liệu theo search text
    if (searchText) {
      const filtered = accounts.filter(account => 
        account.tenDangNhap.toLowerCase().includes(searchText.toLowerCase()) ||
        account.email.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredAccounts(filtered);
    } else {
      setFilteredAccounts(accounts);
    }
  }, [searchText, accounts]);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filterType) {
        params.loaiTaiKhoan = filterType;
      }
      const response = await apiService.getAllAccounts(params);
      const data = response?.data || [];
      
      setAccounts(data);
      setFilteredAccounts(data);
      setPagination({
        ...pagination,
        total: response?.total || 0,
      });
    } catch (error: any) {
      message.error('Không thể tải danh sách tài khoản');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (record: Account) => {
    try {
      const response = await apiService.toggleAccountStatus(record.maTaiKhoan);
      message.success(response.message || 'Cập nhật trạng thái thành công');
      fetchAccounts();
    } catch (error: any) {
      message.error('Không thể cập nhật trạng thái');
    }
  };

  const handleDeleteAccount = async (id: number) => {
    try {
      const response = await apiService.deleteAccount(id);
      message.success(response.message || 'Xóa tài khoản thành công');
      fetchAccounts();
    } catch (error: any) {
      message.error('Không thể xóa tài khoản');
    }
  };

  const handleChangePassword = async (values: any) => {
    if (!selectedAccount) return;
    
    try {
      const response = await apiService.changeAccountPassword(
        selectedAccount.maTaiKhoan,
        values.matKhauMoi
      );
      message.success(response.message || 'Đổi mật khẩu thành công');
      setPasswordModalVisible(false);
      form.resetFields();
    } catch (error: any) {
      message.error('Không thể đổi mật khẩu');
    }
  };

  const openPasswordModal = (record: Account) => {
    setSelectedAccount(record);
    setPasswordModalVisible(true);
  };

  const getLoaiTaiKhoanTag = (loai: string) => {
    const map: Record<string, { color: string; text: string }> = {
      admin: { color: 'red', text: 'Admin' },
      nongdan: { color: 'green', text: 'Nông dân' },
      daily: { color: 'blue', text: 'Đại lý' },
      sieuthi: { color: 'purple', text: 'Siêu thị' },
    };
    const config = map[loai] || { color: 'default', text: loai };
    return <Tag color={config.color}>{config.text}</Tag>;
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
      dataIndex: 'maTaiKhoan',
      key: 'maTaiKhoan',
      width: 60,
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'tenDangNhap',
      key: 'tenDangNhap',
      width: 110,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 180,
    },
    {
      title: 'Loại tài khoản',
      dataIndex: 'loaiTaiKhoan',
      key: 'loaiTaiKhoan',
      width: 100,
      render: (loai: string) => getLoaiTaiKhoanTag(loai),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 90,
      render: (trangThai: string) => getTrangThaiTag(trangThai),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'ngayTao',
      key: 'ngayTao',
      width: 90,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: Account) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={record.trangThai === 'hoat_dong' ? <LockOutlined /> : <UnlockOutlined />}
            onClick={() => handleToggleStatus(record)}
          >
            {record.trangThai === 'hoat_dong' ? 'Khóa' : 'Mở'}
          </Button>
          <Button
            type="link"
            size="small"
            icon={<KeyOutlined />}
            onClick={() => openPasswordModal(record)}
          >
            Đổi MK
          </Button>
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc muốn xóa tài khoản này?"
            onConfirm={() => handleDeleteAccount(record.maTaiKhoan)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ 
              danger: true, 
              size: 'middle',
              style: { fontSize: '14px', height: '32px', padding: '4px 15px' }
            }}
            cancelButtonProps={{ 
              size: 'middle',
              style: { fontSize: '14px', height: '32px', padding: '4px 15px' }
            }}
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Quản lý tài khoản</h1>
        <p>Quản lý tất cả tài khoản trong hệ thống</p>
      </div>

      <Card>
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="Tìm theo tên đăng nhập hoặc email..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          <Select
            placeholder="Lọc theo loại tài khoản"
            style={{ width: 200 }}
            value={filterType || undefined}
            onChange={(value) => {
              setFilterType(value || '');
              setPagination({ ...pagination, current: 1 });
            }}
            allowClear
          >
            <Option value="admin">Admin</Option>
            <Option value="nongdan">Nông dân</Option>
            <Option value="daily">Đại lý</Option>
            <Option value="sieuthi">Siêu thị</Option>
          </Select>
        </Space>

        <Table
          columns={columns}
          dataSource={filteredAccounts}
          rowKey="maTaiKhoan"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: filteredAccounts.length,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} tài khoản`,
            onChange: (page, pageSize) => {
              setPagination({ ...pagination, current: page, pageSize: pageSize || 10 });
            },
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      <Modal
        title={
          <Space>
            <KeyOutlined />
            Đổi mật khẩu
          </Space>
        }
        open={passwordModalVisible}
        onCancel={() => {
          setPasswordModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item label="Tài khoản">
            <Input
              value={selectedAccount?.tenDangNhap}
              disabled
            />
          </Form.Item>
          <Form.Item
            label="Mật khẩu mới"
            name="matKhauMoi"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu"
            name="xacNhanMatKhau"
            dependencies={['matKhauMoi']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('matKhauMoi') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu không khớp'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu mới" />
          </Form.Item>
          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setPasswordModalVisible(false);
                form.resetFields();
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Đổi mật khẩu
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default QuanLyTaiKhoan;
