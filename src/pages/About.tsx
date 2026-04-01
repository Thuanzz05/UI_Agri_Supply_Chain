import Header from '../components/Header';
import './About.css';

const About = () => {
  return (
    <div className="page">
      <Header />
      
      <section className="about-hero">
        <div className="wrap">
          <h1>Về chúng tôi</h1>
          <p>Chúng tôi là đội ngũ chuyên gia công nghệ với sứ mệnh cách mạng hóa ngành nông nghiệp Việt Nam</p>
        </div>
      </section>

      <section className="company-intro">
        <div className="wrap">
          <div className="intro-content">
            <div className="intro-text">
              <h2>AgriChain - Đối tác tin cậy của nông nghiệp hiện đại</h2>
              <p>Được thành lập vào năm 2020, AgriChain ra đời với mục tiêu ứng dụng công nghệ blockchain và IoT để tạo ra một hệ sinh thái nông nghiệp minh bạch, hiệu quả và bền vững.</p>
              <p>Chúng tôi hiểu rằng ngành nông nghiệp Việt Nam đang đối mặt với nhiều thách thức về truy xuất nguồn gốc, quản lý chất lượng và tối ưu hóa chuỗi cung ứng. Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi đã phát triển giải pháp toàn diện giúp nông dân, doanh nghiệp và người tiêu dùng kết nối trong một hệ thống thống nhất.</p>
            </div>
            <div className="intro-image">
              <img src="/trang_trai_cong_nghe_cao.jpg" alt="Công nghệ nông nghiệp" />
            </div>
          </div>
        </div>
      </section>

      <section className="mission-vision">
        <div className="wrap">
          <h2>Tầm nhìn & Sứ mệnh</h2>
          <div className="mv-grid">
            <div className="mv-card">
              <div className="mv-icon">
                <img src="/cam_bien_cho_nha_kinh.jpg" alt="Tầm nhìn" />
              </div>
              <h3>Tầm nhìn</h3>
              <p>Trở thành nền tảng công nghệ hàng đầu Đông Nam Á trong việc số hóa và tối ưu hóa chuỗi cung ứng nông sản, góp phần xây dựng một hệ sinh thái nông nghiệp bền vững và minh bạch.</p>
            </div>
            <div className="mv-card">
              <div className="mv-icon">
                <img src="/dam_bao_chat_luong.jpg" alt="Sứ mệnh" />
              </div>
              <h3>Sứ mệnh</h3>
              <p>Ứng dụng công nghệ tiên tiến để kết nối nông dân với thị trường, đảm bảo chất lượng sản phẩm và tạo ra giá trị bền vững cho toàn bộ chuỗi giá trị nông nghiệp Việt Nam.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="core-values">
        <div className="wrap">
          <h2>Giá trị cốt lõi</h2>
          <div className="values-grid">
            <div className="value-item">
              <div className="value-image">
                <img src="/quy_trinh_kiem_dinh_chat_luong.jpg" alt="Minh bạch" />
              </div>
              <h3>Minh bạch</h3>
              <p>Đảm bảo thông tin rõ ràng, chính xác trong toàn bộ chuỗi cung ứng</p>
            </div>
            <div className="value-item">
              <div className="value-image">
                <img src="/trang_trai.jpg" alt="Bền vững" />
              </div>
              <h3>Bền vững</h3>
              <p>Phát triển giải pháp thân thiện với môi trường và xã hội</p>
            </div>
            <div className="value-item">
              <div className="value-image">
                <img src="/ananlytics.jpg" alt="Đổi mới" />
              </div>
              <h3>Đổi mới</h3>
              <p>Không ngừng cải tiến và ứng dụng công nghệ tiên tiến</p>
            </div>
            <div className="value-item">
              <div className="value-image">
                <img src="/mang_luoi_doi_tac.jpg" alt="Hợp tác" />
              </div>
              <h3>Hợp tác</h3>
              <p>Xây dựng mối quan hệ đối tác bền vững và cùng phát triển</p>
            </div>
          </div>
        </div>
      </section>

      <section className="achievements">
        <div className="wrap">
          <h2>Thành tựu đạt được</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Trang trại kết nối</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Doanh nghiệp đối tác</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1M+</div>
              <div className="stat-label">Sản phẩm được truy xuất</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Độ tin cậy hệ thống</div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-about">
        <div className="wrap">
          <h2>Cùng xây dựng tương lai nông nghiệp</h2>
          <p>Hãy để AgriChain đồng hành cùng bạn trong hành trình số hóa và phát triển bền vững</p>
          <div className="cta-buttons">
            <button className="btn-primary">Liên hệ ngay</button>
            <button className="btn-secondary">Tìm hiểu thêm</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;