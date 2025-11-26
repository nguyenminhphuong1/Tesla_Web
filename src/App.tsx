import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import SolutionsShowcase from './components/SolutionsShowcase';
import SolutionsHexagon from './components/SolutionsHexagon';
import ServicesHub from './components/ServicesHub';
import ProductInfo from './components/ProductInfo';
import ProductDetail from './components/ProductDetail';
import AboutSection from './components/AboutSection';
import BlogSection   from './components/BlogSection';
import BlogDetail from './components/BlogDetail';
import BlogCarousel from './components/BlogCarousel';
import TechnologySection from './components/TechnologySection';
import ContactUs from './components/ContactUs';
import { LoadingScreen } from './components/LoadingScreen';
import { ErrorBoundary } from './components/ErrorBoundary';
import Solutions3DViewer from './components/Solutions3DViewer';
import ServiceSupport from './components/ServiceSupport';
// import { useAppStore } from './store/appStore';
import './styles/main.css';
import { useTranslation } from 'react-i18next';
// dùng đường dẫn tĩnh cho logo để tránh lỗi TS khi import png

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Handle navigation (đã dùng trực tiếp setCurrentSection tại nơi cần thiết)

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
      <div className="app">
        <div className="logo-bg">
          <img src="/assets/1.png" alt="Logo" />
        </div>
        {/* Ultra Modern Tech Background Effects */}
        <div className="particles-container">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
        
        <div className="energy-waves">
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
        </div>

        <Navigation />

        <main>
          <Routes>
            {/* Route cho Trang chủ - tên miền gốc */}
            <Route path="/" element={(
              <div className="homepage">
                <HeroSection />
                <SolutionsHexagon />
                <SolutionsShowcase />
                <ServicesHub />
                {/* ===== ADDITIONAL SECTIONS TO FILL EMPTY SPACE ===== */}
                {/* Blog Carousel Section */}
                <section className="case-studies-section">
                  <div className="container">
                    <div className="section-header">
                      <h2 className="section-title">{t('home_sections.case_studies_title')}</h2>
                      <p className="section-subtitle">
                        {t('home_sections.case_studies_subtitle')}
                      </p>
                    </div>
                    <BlogCarousel />
                  </div>
                </section>
                <ServiceSupport />
                {/* Contact CTA Section */}
                <section className="contact-cta-section">
                  <div className="container">
                    <div className="cta-content">
                      <h2>{t('home_sections.cta_title')}</h2>
                      <p>
                        {t('home_sections.cta_desc')}
                      </p>
                      <div className="cta-buttons">
                        <button 
                          className="btn btn-primary"
                          onClick={() => navigate('/contactus')}
                        >
                          {t('home_sections.cta_btn_contact')}
                        </button>
                        <button className="btn btn-secondary" onClick={() => navigate('/contactus')}>
                          {t('home_sections.cta_btn_demo')}
                        </button>
                        <button className="btn btn-outline">
                          {t('home_sections.cta_btn_docs')}
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )} />
            
            {/* Route cho Sản phẩm */}
            <Route path="/products" element={<ProductInfo />} />
            
            {/* Route cho chi tiết sản phẩm */}
            <Route path="/product/:productId" element={<ProductDetail />} />
            
            {/* Route cho Giải pháp */}
            <Route path="/solutions" element={<Solutions3DViewer />} />
            
            {/* Route cho Công nghệ */}
            <Route path="/technology" element={<TechnologySection />} />
            
            {/* Route cho Về chúng tôi */}
            <Route path="/about-us" element={<AboutSection />} />
            
            {/* Route cho Bài viết */}
            <Route path="/blog" element={(
              <div className="container">
                <div className="section-header">
                  <h1 className="section-title">{t('blog_page.list_title')}</h1>
                  <p className="section-subtitle">
                    {t('blog_page.list_subtitle')}
                  </p>
                </div>
                <BlogSection />
              </div>
            )} />
            
            {/* Route cho chi tiết bài viết */}
            <Route path="/blog/:slug" element={<BlogDetail />} />
            
            {/* Route cho Liên hệ */}
            <Route path="/contactus" element={<ContactUs />} />
            
            {/* Route mặc định - redirect về / */}
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
            
          </Routes>
        </main>
      </div>
  );
}

export default App; 