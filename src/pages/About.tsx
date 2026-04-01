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
    </div>
  );
};

export default About;