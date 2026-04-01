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
    </div>
  );
};

export default About;