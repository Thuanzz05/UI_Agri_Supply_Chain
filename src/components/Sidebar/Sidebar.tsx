import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Menu } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    // Dispatch custom event để các trang admin biết sidebar đã thay đổi
    window.dispatchEvent(new CustomEvent('sidebarToggle', { 
      detail: { collapsed: !collapsed } 
    }));
  };

  const items: MenuItem[] = [
    { 
      key: '/admin/dashboard', 
      icon: <DashboardOutlined />, 
      label: 'Dashboard' 
    },
    { 
      key: '/admin/users', 
      icon: <UserOutlined />, 
      label: 'Người dùng' 
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
            AgriChain Admin
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
        items={items}
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