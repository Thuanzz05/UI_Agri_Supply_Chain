import { Button } from 'antd';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="page">
      <Header />

      <section className="hero">
        <div className="wrap">
          <div className="content">
            <h1>Hệ thống Quản lý Chuỗi Cung Ứng Nông Sản</h1>
            <p>Kiểm soát và theo dõi toàn diện từ trang trại đến người tiêu dùng. Tối ưu hóa quy trình và đảm bảo chất lượng với khả năng truy xuất nguồn gốc hoàn chỉnh.</p>
            <div className="btns">
              <Button type="primary" size="large">Bắt đầu ngay</Button>
              <Button size="large">Tìm hiểu thêm</Button>
            </div>
          </div>
          <div className="visual">
            <img src="/fruits_and_vegetables.jpg" alt="Trái cây và rau củ tươi sạch" className="main-img" />
          </div>
        </div>
      </section>

      <section className="showcase">
        <div className="wrap">
          <h2>Quy trình hoạt động</h2>
          <div className="process">
            <div className="step">
              <div className="step-img">
                <img src="/trang_trai.jpg" alt="Trang trại" />
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
                <img src="/kiem_dinh_chat_luong.jpg" alt="Kiểm định" />
              </div>
            </div>

            <div className="step">
              <div className="step-img">
                <img src="/van_chuyen.jpg" alt="Vận chuyển" />
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
                <img src="/nguoi_tieu_dung.jpg" alt="Người tiêu dùng" />
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
                <img src="/ananlytics.jpg" alt="Analytics" />
              </div>
              <h3>Phân tích thời gian thực</h3>
              <p>Theo dõi các chỉ số hiệu suất và có được thông tin chi tiết với bảng điều khiển toàn diện.</p>
            </div>
            <div className="card">
              <div className="card-img">
                <img src="/dam_bao_chat_luong.jpg" alt="Quality Control Laboratory" />
              </div>
              <h3>Đảm bảo chất lượng</h3>
              <p>Đảm bảo chất lượng sản phẩm với quy trình kiểm tra tự động và quản lý chứng nhận.</p>
            </div>
            <div className="card">
              <div className="card-img">
                <img src="/quan_ly_logistics.jpg" alt="Transportation Logistics" />
              </div>
              <h3>Quản lý logistics</h3>
              <p>Tối ưu hóa tuyến đường vận chuyển và quản lý hàng tồn kho một cách hiệu quả.</p>
            </div>
            <div className="card">
              <div className="card-img">
                <img src="/mang_luoi_doi_tac.jpg" alt="Network" />
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
              <img src="/trang_trai_cong_nghe_cao.jpg" alt="Trang trại thông minh" />
              <p>Trang trại ứng dụng công nghệ cao</p>
            </div>
            <div className="img-item">
              <img src="/quy_trinh_kiem_dinh_chat_luong.jpg" alt="Phòng thí nghiệm kiểm định" />
              <p>Quy trình kiểm định chất lượng nghiêm ngặt</p>
            </div>
            <div className="img-item">
              <img src="/cam_bien_cho_nha_kinh.jpg" alt="Nhà kính hiện đại" />
              <p>Hệ thống nhà kính tự động hóa</p>
            </div>
            <div className="img-item">
              <img src="/trung_tam_phan_phoi.jpg" alt="Trung tâm phân phối" />
              <p>Trung tâm phân phối hiện đại</p>
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
            <Button size="large">Liên hệ tư vấn</Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;