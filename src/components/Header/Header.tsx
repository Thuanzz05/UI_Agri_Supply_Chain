import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Typography, Badge, Button } from 'antd';
import {
  UserOutlined,
  BellOutlined,
  LogoutOutlined,
  SettingOutlined,
  DashboardOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  TeamOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { authService } from '../../services/authService';
import './Header.css';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
  userRole?: string;
}

const Header: React.FC<HeaderProps> = ({ collapsed, onToggle, userRole = 'Admin' }) => {
  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Thông tin cá nhân',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: handleLogout,
    },
  ];

  const notificationMenuItems: MenuProps['items'] = [
    {
      key: 'notif1',
      label: (
        <div className="notification-item">
          <Text strong>Kiểm định mới</Text>
          <br />
          <Text type="secondary">Lô nông sản #001 cần kiểm định</Text>
        </div>
      ),
    },
    {
      key: 'notif2',
      label: (
        <div className="notification-item">
          <Text strong>Đơn hàng mới</Text>
          <br />
          <Text type="secondary">Đơn hàng #DH001 từ Siêu thị ABC</Text>
        </div>
      ),
    },
    {
      key: 'notif3',
      label: (
        <div className="notification-item">
          <Text strong>Cảnh báo tồn kho</Text>
          <br />
          <Text type="secondary">Sản phẩm Cà chua sắp hết hàng</Text>
        </div>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'view-all',
      label: (
        <div style={{ textAlign: 'center' }}>
          <Button type="link" size="small">
            Xem tất cả thông báo
          </Button>
        </div>
      ),
    },
  ];

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'Quản trị viên';
      case 'NongDan':
        return 'Nông dân';
      case 'DaiLy':
        return 'Đại lý';
      case 'SieuThi':
        return 'Siêu thị';
      default:
        return role;
    }
  };

  const getMainMenuItems = () => {
    const baseItems = [
      {
        key: 'dashboard',
        icon: <DashboardOutlined />,
        label: 'Tổng quan',
      },
    ];

    switch (userRole) {
      case 'Admin':
        return [
          ...baseItems,
          {
            key: 'users',
            icon: <TeamOutlined />,
            label: 'Quản lý người dùng',
          },
          {
            key: 'reports',
            icon: <BarChartOutlined />,
            label: 'Báo cáo thống kê',
          },
        ];
      case 'NongDan':
        return [
          ...baseItems,
          {
            key: 'farms',
            icon: <TeamOutlined />,
            label: 'Quản lý trang trại',
          },
          {
            key: 'products',
            icon: <ShoppingCartOutlined />,
            label: 'Sản phẩm',
          },
        ];
      case 'DaiLy':
        return [
          ...baseItems,
          {
            key: 'inventory',
            icon: <ShoppingCartOutlined />,
            label: 'Quản lý kho',
          },
          {
            key: 'orders',
            icon: <ShoppingCartOutlined />,
            label: 'Đơn hàng',
          },
          {
            key: 'quality',
            icon: <BarChartOutlined />,
            label: 'Kiểm định chất lượng',
          },
        ];
      case 'SieuThi':
        return [
          ...baseItems,
          {
            key: 'orders',
            icon: <ShoppingCartOutlined />,
            label: 'Đơn hàng',
          },
          {
            key: 'suppliers',
            icon: <TeamOutlined />,
            label: 'Nhà cung cấp',
          },
        ];
      default:
        return baseItems;
    }
  };

  return (
    <AntHeader className="app-header">
      <div className="header-left">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          className="trigger"
        />
        
        <div className="logo">
          <img src="/logo.png" alt="Logo" className="logo-img" />
          <Text strong className="logo-text">
            Chuỗi Cung Ứng Nông Sản
          </Text>
        </div>
      </div>

      <div className="header-center">
        <Menu
          mode="horizontal"
          items={getMainMenuItems()}
          className="main-menu"
          selectedKeys={['dashboard']}
        />
      </div>

      <div className="header-right">
        <Space size="middle">
          <Dropdown
            menu={{ items: notificationMenuItems }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Badge count={3} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                className="notification-btn"
              />
            </Badge>
          </Dropdown>

          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={['click']}
          >
            <div className="user-info">
              <Avatar icon={<UserOutlined />} />
              <div className="user-details">
                <Text strong>{currentUser?.tenDangNhap || 'User'}</Text>
                <br />
                <Text type="secondary" className="user-role">
                  {getRoleDisplayName(userRole)}
                </Text>
              </div>
            </div>
          </Dropdown>
        </Space>
      </div>
    </AntHeader>
  );
};

export default Header;