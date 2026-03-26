import React from 'react';
import { Button } from 'antd';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="page">
      <nav className="nav">
        <div className="nav-wrap">
          <div className="logo">
            <img src="/favicon.svg" alt="Logo" />
            <span>AgriChain</span>
          </div>
          <div className="menu">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <Button type="primary">Get Started</Button>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="wrap">
          <div className="content">
            <h1>Hệ thống Quản lý Chuỗi Cung Ứng Nông Sản</h1>
            <p>Kiểm soát và theo dõi toàn diện từ trang trại đến người tiêu dùng. Tối ưu hóa quy trình và đảm bảo chất lượng với khả năng truy xuất nguồn gốc hoàn chỉnh.</p>
            <div className="btns">
              <Button type="primary" size="large">Dùng thử miễn phí</Button>
              <Button size="large">Xem demo</Button>
            </div>
            <div className="stats">
              <div className="stat">
                <span className="num">999+</span>
                <span className="label">Nông dân</span>
              </div>
              <div className="stat">
                <span className="num">999+</span>
                <span className="label">Đại lý</span>
              </div>
              <div className="stat">
                <span className="num">99K+</span>
                <span className="label">Sản phẩm</span>
              </div>
            </div>
          </div>
          <div className="visual">
            <img src="/favicon.svg" alt="Platform" className="main-img" />
          </div>
        </div>
      </section>

      <section className="showcase">
        <div className="wrap">
          <h2>Quy trình hoạt động</h2>
          <div className="process">
            <div className="step">
              <div className="step-img">
                <img src="/favicon.svg" alt="Trang trại" />
              </div>
              <div className="step-content">
                <h3>1. Trang trại</h3>
                <p>Nông dân đăng ký sản phẩm, theo dõi quá trình trồng trọt và thu hoạch. Hệ thống ghi nhận mọi thông tin từ giống, phân bón đến thời gian thu hoạch.</p>
              </div>
            </div>
            
            <div className="step reverse">
              <div className="step-content">
                <h3>2. Kiểm định chất lượng</h3>
                <p>Sản phẩm được kiểm tra chất lượng tại các trạm kiểm định. Kết quả được ghi nhận và cập nhật vào hệ thống để đảm bảo an toàn thực phẩm.</p>
              </div>
              <div className="step-img">
                <img src="/favicon.svg" alt="Kiểm định" />
              </div>
            </div>

            <div className="step">
              <div className="step-img">
                <img src="/favicon.svg" alt="Vận chuyển" />
              </div>
              <div className="step-content">
                <h3>3. Vận chuyển & Phân phối</h3>
                <p>Theo dõi hành trình vận chuyển từ trang trại đến các đại lý và siêu thị. Kiểm soát nhiệt độ, độ ẩm và thời gian vận chuyển.</p>
              </div>
            </div>

            <div className="step reverse">
              <div className="step-content">
                <h3>4. Người tiêu dùng</h3>
                <p>Người mua có thể quét mã QR để xem toàn bộ hành trình của sản phẩm từ trang trại đến tay họ, đảm bảo minh bạch và tin cậy.</p>
              </div>
              <div className="step-img">
                <img src="/favicon.svg" alt="Người tiêu dùng" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <div className="wrap">
          <h2>Tính năng chính</h2>
          <div className="grid">
            <div className="card">
              <div className="card-img">
                <img src="/favicon.svg" alt="Analytics" />
              </div>
              <h3>Phân tích thời gian thực</h3>
              <p>Theo dõi các chỉ số hiệu suất và có được thông tin chi tiết với bảng điều khiển toàn diện.</p>
            </div>
            <div className="card">
              <div className="card-img">
                <img src="/favicon.svg" alt="Quality" />
              </div>
              <h3>Đảm bảo chất lượng</h3>
              <p>Đảm bảo chất lượng sản phẩm với quy trình kiểm tra tự động và quản lý chứng nhận.</p>
            </div>
            <div className="card">
              <div className="card-img">
                <img src="/favicon.svg" alt="Logistics" />
              </div>
              <h3>Quản lý logistics</h3>
              <p>Tối ưu hóa tuyến đường vận chuyển và quản lý hàng tồn kho một cách hiệu quả.</p>
            </div>
            <div className="card">
              <div className="card-img">
                <img src="/favicon.svg" alt="Network" />
              </div>
              <h3>Mạng lưới đối tác</h3>
              <p>Kết nối nông dân, nhà phân phối và nhà bán lẻ trong một nền tảng.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="gallery">
        <div className="wrap">
          <h2>Hình ảnh thực tế</h2>
          <div className="images">
            <div className="img-item">
              <img src="/favicon.svg" alt="Trang trại hiện đại" />
              <p>Trang trại ứng dụng công nghệ cao</p>
            </div>
            <div className="img-item">
              <img src="/favicon.svg" alt="Kiểm định sản phẩm" />
              <p>Quy trình kiểm định chất lượng nghiêm ngặt</p>
            </div>
            <div className="img-item">
              <img src="/favicon.svg" alt="Kho bảo quản" />
              <p>Hệ thống kho bảo quản hiện đại</p>
            </div>
            <div className="img-item">
              <img src="/favicon.svg" alt="Vận chuyển" />
              <p>Xe vận chuyển chuyên dụng</p>
            </div>
          </div>
        </div>
      </section>

      <section className="proof">
        <div className="wrap">
          <p>Được tin tưởng bởi các công ty nông nghiệp hàng đầu</p>
          <div className="logos">
            <div>NôngSản Corp</div>
            <div>TrangTraiTech</div>
            <div>CungỨngXanh</div>
            <div>ThuHoạchPro</div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="wrap">
          <h2>Sẵn sàng bắt đầu?</h2>
          <p>Tham gia cùng hàng nghìn doanh nghiệp nông nghiệp đang sử dụng nền tảng của chúng tôi</p>
          <div className="btns">
            <Button type="primary" size="large">Dùng thử miễn phí</Button>
            <Button size="large">hi</Button>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="wrap">
          <div className="top">
            <div className="brand">
              <img src="/favicon.svg" alt="Logo" />
              <span>AgriChain</span>
            </div>
            <div className="links">
              <a href="#privacy">Privacy</a>
              <a href="#terms">Terms</a>
              <a href="#support">Support</a>
            </div>
          </div>
          <div className="bottom">
            <p>© 2026 AgriChain. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;