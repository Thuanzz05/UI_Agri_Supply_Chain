import { NodeIndexOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
            <NodeIndexOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
            <span>AgriChain</span>
          </Link>
        </div>
        <div className="nav-menu">
          <a href="#features" className="nav-link">Tính năng</a>
          <Link to="/about" className="nav-link">Giới thiệu</Link>
          <a href="#contact" className="nav-link">Liên hệ</a>
        </div>
        <div className="nav-buttons">
          <button className="btn-login">Đăng nhập</button>
          <button className="btn-signup">Đăng ký</button>
        </div>
      </div>
    </nav>
  );
};

export default Header;