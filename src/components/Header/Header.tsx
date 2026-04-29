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
          <Link to="/contact" className="nav-link">Liên hệ</Link>
        </div>
        <div className="nav-buttons">
          <Link to="/login">
            <button className="btn-login">Đăng nhập</button>
          </Link>
          <Link to="/register">
            <button className="btn-signup">Đăng ký</button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;