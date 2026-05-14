import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShopOutlined,
  ShoppingOutlined,
  InboxOutlined,
  HomeOutlined,
  AppstoreOutlined,
  SafetyOutlined,
  TruckOutlined,
  KeyOutlined,
  MessageOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Menu } from 'antd';
import { authService } from '../../services/authService';

type MenuItem = Required<MenuProps>['items'][number];

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [userRole, setUserRole] = useState<string>('Admin');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const user = authService.getStoredUser();
    if (user && user.loaiTaiKhoan) {
      setUserRole(user.loaiTaiKhoan);
    }
  }, []);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    // Dispatch custom event để các trang admin biết sidebar đã thay đổi
    window.dispatchEvent(new CustomEvent('sidebarToggle', { 
      detail: { collapsed: !collapsed } 
    }));
  };

  // Menu cho Admin
  const adminItems: MenuItem[] = [
    { 
      key: '/admin/dashboard', 
      icon: <DashboardOutlined />, 
      label: 'Dashboard' 
    },
    { 
      key: '/admin/quan-ly-nguoi-dung', 
      icon: <UserOutlined />, 
      label: 'Quản lý người dùng' 
    },
    { 
      key: '/admin/quan-ly-tai-khoan', 
      icon: <KeyOutlined />, 
      label: 'Quản lý tài khoản' 
    },
    { 
      type: 'divider'
    },
    { 
      key: '/', 
      icon: <LogoutOutlined />, 
      label: 'Về trang chủ' 
    },
  ];

  // Menu cho Nông dân
  const farmerItems: MenuItem[] = [
    { 
      key: '/farmer/dashboard', 
      icon: <DashboardOutlined />, 
      label: 'Dashboard' 
    },
    { 
      key: '/farmer/farms', 
      icon: <HomeOutlined />, 
      label: 'Trang trại' 
    },
    { 
      key: '/farmer/products', 
      icon: <ShopOutlined />, 
      label: 'Sản phẩm' 
    },
    { 
      key: '/farmer/batches', 
      icon: <AppstoreOutlined />, 
      label: 'Lô nông sản' 
    },
    { 
      key: '/farmer/orders', 
      icon: <InboxOutlined />, 
      label: 'Đơn hàng' 
    },
    { 
      key: '/chat', 
      icon: <MessageOutlined />, 
      label: 'Tin nhắn' 
    },
    { 
      key: '/farmer/profile', 
      icon: <UserOutlined />, 
      label: 'Thông tin cá nhân' 
    },
    { 
      type: 'divider'
    },
    { 
      key: '/', 
      icon: <LogoutOutlined />, 
      label: 'Về trang chủ' 
    },
  ];

  // Menu cho Đại lý
  const agentItems: MenuItem[] = [
    { 
      key: '/agent/dashboard', 
      icon: <DashboardOutlined />, 
      label: 'Dashboard' 
    },
    { 
      key: '/agent/warehouses', 
      icon: <HomeOutlined />, 
      label: 'Kho hàng' 
    },
    { 
      key: '/agent/inventory', 
      icon: <ShoppingOutlined />, 
      label: 'Tồn kho' 
    },
    { 
      key: '/agent/orders-in', 
      icon: <InboxOutlined />, 
      label: 'Đơn hàng mua vào' 
    },
    { 
      key: '/agent/orders-out', 
      icon: <InboxOutlined />, 
      label: 'Đơn hàng bán ra' 
    },
    { 
      key: '/agent/quality-check', 
      icon: <SafetyOutlined />, 
      label: 'Kiểm định chất lượng' 
    },
    { 
      key: '/agent/transport', 
      icon: <TruckOutlined />, 
      label: 'Vận chuyển' 
    },
    { 
      key: '/chat', 
      icon: <MessageOutlined />, 
      label: 'Tin nhắn' 
    },
    { 
      key: '/agent/profile', 
      icon: <UserOutlined />, 
      label: 'Thông tin cá nhân' 
    },
    { 
      type: 'divider'
    },
    { 
      key: '/', 
      icon: <LogoutOutlined />, 
      label: 'Về trang chủ' 
    },
  ];

  // Menu cho Siêu thị
  const supermarketItems: MenuItem[] = [
    { 
      key: '/supermarket/dashboard', 
      icon: <DashboardOutlined />, 
      label: 'Dashboard' 
    },
    { 
      key: '/supermarket/orders', 
      icon: <InboxOutlined />, 
      label: 'Đơn hàng' 
    },
    { 
      key: '/supermarket/warehouses', 
      icon: <HomeOutlined />, 
      label: 'Kho hàng' 
    },
    { 
      key: '/supermarket/inventory', 
      icon: <DatabaseOutlined />, 
      label: 'Tồn kho' 
    },
    { 
      key: '/supermarket/traceability', 
      icon: <SafetyOutlined />, 
      label: 'Truy xuất nguồn gốc' 
    },
    { 
      key: '/chat', 
      icon: <MessageOutlined />, 
      label: 'Tin nhắn' 
    },
    { 
      key: '/supermarket/profile', 
      icon: <UserOutlined />, 
      label: 'Thông tin cá nhân' 
    },
    { 
      type: 'divider'
    },
    { 
      key: '/', 
      icon: <LogoutOutlined />, 
      label: 'Về trang chủ' 
    },
  ];

  // Chọn menu items dựa trên role
  const getMenuItems = () => {
    switch (userRole) {
      case 'Farmer':
        return farmerItems;
      case 'Agent':
        return agentItems;
      case 'Supermarket':
        return supermarketItems;
      default:
        return adminItems;
    }
  };

  // Lấy tên hiển thị dựa trên role
  const getDisplayName = () => {
    switch (userRole) {
      case 'Farmer':
        return 'Nông Dân';
      case 'Agent':
        return 'Đại Lý';
      case 'Supermarket':
        return 'Siêu Thị';
      default:
        return 'Admin';
    }
  };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };

  return (
    <div style={{ 
      width: collapsed ? 80 : 256, 
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      background: '#001529',
      transition: 'width 0.3s ease'
    }}>
      <div style={{ 
        padding: '16px', 
        borderBottom: '1px solid #1f1f1f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px'
      }}>
        {!collapsed && (
          <div style={{ 
            color: '#52c41a', 
            fontSize: '18px', 
            fontWeight: 700 
          }}>
            AgriChain {getDisplayName()}
          </div>
        )}
        <Button 
          type="primary" 
          onClick={toggleCollapsed}
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          style={{ 
            background: 'transparent',
            border: 'none',
            boxShadow: 'none'
          }}
        />
      </div>
      
      <Menu
        selectedKeys={[location.pathname]}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={getMenuItems()}
        onClick={handleMenuClick}
        style={{ 
          border: 'none',
          height: 'calc(100vh - 64px)',
          overflow: 'auto'
        }}
      />
    </div>
  );
};

export default Sidebar;
