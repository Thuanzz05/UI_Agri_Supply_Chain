import { NodeIndexOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="top">
          <div className="brand">
            <NodeIndexOutlined style={{ fontSize: '20px', color: '#52c41a' }} />
            <span>AgriChain</span>
          </div>
          <div className="links">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <Link to="/guide">Guide</Link>
          </div>
        </div>
        <div className="bottom">
          <p>© 2026 AgriChain. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;