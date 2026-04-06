import React from 'react';
import { Card, Table, Button, Space, Tag, Input, Avatar } from 'antd';
import type { TableProps } from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined,
  UserOutlined 
} from '@ant-design/icons';
import { AdminLayout } from '../../components/Layout';
import { CustomPagination } from '../../components/CustomPagination';
import './Users.css';

interface DataType {
  key: string;
  id: string;
  avatar: string | null;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  farm: string;
  status: string;
  lastLogin: string;
  createdDate: string;
}

const Users: React.FC = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  // Dữ liệu mẫu cho bảng người dùng
  const data: DataType[] = [
    {
      key: '1',
      id: 'ND001',
      avatar: null,
      name: 'Nguyễn Văn An',
      username: 'nguyenvanan',
      email: 'nguyenvanan@email.com',
      phone: '0901234567',
      role: 'Admin',
      farm: 'Trang trại Xanh',
      status: 'Hoạt động',
      lastLogin: '2024-01-16 09:30',
      createdDate: '2023-12-01'
    },
    {
      key: '2',
      id: 'ND002',
      avatar: null,
      name: 'Trần Thị Bình',
      username: 'tranthibinh',
      email: 'tranthibinh@email.com',
      phone: '0912345678',
      role: 'Farmer',
      farm: 'Trang trại Organic',
      status: 'Hoạt động',
      lastLogin: '2024-01-15 14:20',
      createdDate: '2023-11-15'
    },
    {
      key: '3',
      id: 'ND003',
      avatar: null,
      name: 'Lê Văn Cường',
      username: 'levancuong',
      email: 'levancuong@email.com',
      phone: '0923456789',
      role: 'Distributor',
      farm: 'Trung tâm phân phối Miền Nam',
      status: 'Tạm khóa',
      lastLogin: '2024-01-10 16:45',
      createdDate: '2023-10-20'
    },
    {
      key: '4',
      id: 'ND004',
      avatar: null,
      name: 'Phạm Thị Dung',
      username: 'phamthidung',
      email: 'phamthidung@email.com',
      phone: '0934567890',
      role: 'Quality Inspector',
      farm: 'Trung tâm kiểm định',
      status: 'Hoạt động',
      lastLogin: '2024-01-16 08:15',
      createdDate: '2023-09-10'
    },
    {
      key: '5',
      id: 'ND005',
      avatar: null,
      name: 'Hoàng Văn Em',
      username: 'hoangvanem',
      email: 'hoangvanem@email.com',
      phone: '0945678901',
      role: 'Farmer',
      farm: 'Trang trại Sạch',
      status: 'Hoạt động',
      lastLogin: '2024-01-14 11:30',
      createdDate: '2023-08-05'
    }
  ];

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 60,
      render: (avatar: string) => (
        <Avatar 
          size={32} 
          src={avatar} 
          icon={<UserOutlined />}
        />
      ),
    },
    {
      title: 'Mã ND',
      dataIndex: 'id',
      key: 'id',
      width: 70,
    },
    {
      title: 'Họ tên',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      key: 'username',
      width: 100,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 160,
      ellipsis: true,
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
      key: 'phone',
      width: 100,
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      width: 90,
      render: (_, { role }) => {
        let color = 'blue';
        if (role === 'Admin') color = 'red';
        else if (role === 'Farmer') color = 'green';
        else if (role === 'Distributor') color = 'orange';
        else if (role === 'Quality Inspector') color = 'purple';
        
        return <Tag color={color}>{role}</Tag>;
      },
    },
    {
      title: 'Tổ chức',
      dataIndex: 'farm',
      key: 'farm',
      width: 140,
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (_, { status }) => (
        <Tag color={status === 'Hoạt động' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      render: () => (
        <Space size="small">
          <a>Sửa</a>
          <a>Xóa</a>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Quản lý người dùng</h1>
        <p>Quản lý thông tin người dùng trong hệ thống</p>
      </div>
      
      <Card className="users-card">
        <div className="users-toolbar">
          <div className="search-section">
            <Input
              placeholder="Tìm kiếm người dùng..."
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
            />
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            size="large"
          >
            Thêm người dùng
          </Button>
        </div>
        
        <Table<DataType>
          columns={columns} 
          dataSource={data}
          pagination={false}
          scroll={{ x: 1000 }}
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
            `${range[0]}-${range[1]} của ${total} người dùng`
          }
        />
      </Card>
    </AdminLayout>
  );
};

export default Users;