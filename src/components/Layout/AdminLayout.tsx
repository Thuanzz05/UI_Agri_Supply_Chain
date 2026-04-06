import React from 'react';
import Sidebar from '../Sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  React.useEffect(() => {
    const handleSidebarToggle = (event: any) => {
      setSidebarCollapsed(event.detail.collapsed);
    };

    window.addEventListener('sidebarToggle', handleSidebarToggle);
    return () => {
      window.removeEventListener('sidebarToggle', handleSidebarToggle);
    };
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0
    }}>
      <Sidebar />
      <div style={{ 
        marginLeft: sidebarCollapsed ? '80px' : '256px', 
        flex: 1, 
        padding: '24px',
        background: '#f5f5f5',
        overflow: 'auto',
        width: sidebarCollapsed ? 'calc(100vw - 80px)' : 'calc(100vw - 256px)',
        transition: 'margin-left 0.3s ease, width 0.3s ease'
      }}>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;