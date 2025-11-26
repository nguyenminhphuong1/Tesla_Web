import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {motion, useInView, useAnimation, animate, useScroll, useTransform} from 'framer-motion';
import productsData from '../data/products.json';
import type { Brand, Product } from '../types/products';
import { useTranslation } from 'react-i18next';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // States cho animated counters
  const [projectsCount, setProjectsCount] = useState(0);
  const [yearsCount, setYearsCount] = useState(0);
  const [satisfactionCount, setSatisfactionCount] = useState(0);

  // Tạo separate refs và controls cho từng animation
  const aboutImageRef = useRef(null);
  const robotCardsRef = useRef(null);
  const sectionHeaderRef = useRef(null);
  const solutionSectionRef = useRef<HTMLElement | null>(null);
  
  const aboutImageInView = useInView(aboutImageRef, { once: true });
  const sectionHeaderInView = useInView(sectionHeaderRef, { once: true, amount: 0.6 });
  
  const aboutImageControls = useAnimation();
  const sectionTitleControls = useAnimation();
  
  
  // Scroll progress for solution section (trigger-based)
  const { scrollYProgress } = useScroll({
    target: solutionSectionRef,
    offset: ["start end", "end start"]
  });
  const scaleSolutionProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [solutionActivated, setSolutionActivated] = useState(false);

  useEffect(() => {
    const unsubscribe = scaleSolutionProgress.on("change", (v) => {
      if (!solutionActivated && v >= 0.2) {
        setSolutionActivated(true);
      }
    });
    return () => unsubscribe();
  }, [solutionActivated, scaleSolutionProgress]);

  // Animation cho about image và counters
  useEffect(() => {
    if (aboutImageInView) {
      aboutImageControls.start("visible");
      
      // Animate counters cùng lúc với about image
      const animateCounters = () => {
        // Animate projects count
        animate(0, 500, {
          duration: 1.5,
          ease: "easeOut",
          onUpdate: (value) => setProjectsCount(Math.round(value))
        });
        
        // Animate years count
        animate(0, 5, {
          duration: 1.5,
          ease: "easeOut",
          onUpdate: (value) => setYearsCount(Math.round(value))
        });
        
        // Animate satisfaction count
        animate(0, 99, {
          duration: 1.5,
          ease: "easeOut",
          onUpdate: (value) => setSatisfactionCount(Math.round(value))
        });
      };
      
      animateCounters();
    } 
  }, [aboutImageInView]);


  // Animation cho section title
  useEffect(() => {
    if (sectionHeaderInView) {
      sectionTitleControls.start("visible");
    } 
  }, [sectionHeaderInView]);

  
  
  const features = [
    {
      title: t('hero.feature_1_title'),
      description: t('hero.feature_1_desc')
    },
    {
      title: t('hero.feature_2_title'),
      description: t('hero.feature_2_desc')
    },
    {
      title: t('hero.feature_3_title'),
      description: t('hero.feature_3_desc')
    }
  ];

  // Variants cho các animations
  const aboutImageVariants = {
    hidden: { opacity: 0.2, y: 200 },
    visible: { opacity: 1, y: 0 }
  };

  const sectionTitleVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  // (đã dùng inline variants cho card)

  // Chọn 4 sản phẩm từ 4 danh mục khác nhau
  const getShowcaseProducts = (): Product[] => {
    const brands: Brand[] = (productsData as any).brands as Brand[];
    const selected: Product[] = [];
    const seenCategories = new Set<string>();

    for (const brand of brands) {
      for (const category of brand.categories) {
        if (seenCategories.has(category.id)) continue;
        const firstProduct = category.products[0];
        if (firstProduct) {
          selected.push(firstProduct);
          seenCategories.add(category.id);
          if (selected.length === 4) return selected;
        }
      }
    }
    return selected.slice(0, 4);
  };

  const showcaseProducts = getShowcaseProducts();

  return (
    <section className="hero">
      <div className="hero-background">
        <div className="hero-particles">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="hero-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${6 + Math.random() * 4}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="container">
        {/* Main Hero Content */}
        <div className="hero-section-content">
          <div className="hero-section-video">
          {/* Hình nền cho mobile (light/dark) */}
          <img
            className="hero-image hero-image--light"
            src={'/assets/home_background_light.png'}
            alt="Background Light"
          />
          <img
            className="hero-image hero-image--dark"
            src={'/assets/home_background_dark.png'}
            alt="Background Dark"
          />
          
          {/* Video nền (light) */}
          <video 
            className="hero-video hero-video--light" 
            src={'/assets/0001-0500-light.mp4'} 
            autoPlay 
            muted 
            loop 
            playsInline 
            onLoadedData={(e) => {
              e.currentTarget.playbackRate = 0.3;
            }}
          />
          {/* Video overlay (dark) */}
          <video 
            className="hero-video hero-video--dark" 
            src={'/assets/0001-0500-dark.mp4'} 
            autoPlay 
            muted 
            loop 
            playsInline 
            onLoadedData={(e) => {
              e.currentTarget.playbackRate = 0.3;
            }}
          />
          </div>
          <div className="hero-content">
              <div className="hero-badge">
                <span>{t('hero.badge')}</span>
              </div>
              <h1 className="hero-title">
                {t('hero.title_line1')}
                <span className="hero-title-highlight"> {t('hero.title_highlight')}</span>
                <br />
                {t('hero.title_line2')}
              </h1>
              <div className="hero-buttons">
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/products')}
                >
                  <span>{t('hero.btn_products')}</span>
                </button>
              </div>
          </div>
        </div>
        <div ref={sectionHeaderRef} className="section-header" style={{top: '20px',margin: '0 0',borderRadius: 'var(--radius-xl)',padding: 'var(--space-2xl)',background: 'var(--bg-glass-sticky)',backdropFilter: 'blur(20px)'}}>
          <motion.h2 
            className="section-title"
            variants={sectionTitleVariants}
            initial="hidden"
            animate={sectionTitleControls}
          >
            {t('hero.about_title').split(' ')[0]} <span style={{color: 'var(--primary)'}} className="text-company">{t('hero.about_title').split(' ').slice(1).join(' ')}</span>
          </motion.h2>
          <div className="hero-about-layout">
            <motion.div 
              ref={aboutImageRef}
              className="hero-about-image"
              variants={aboutImageVariants}
              initial="hidden"
              animate={aboutImageControls}
              transition={{ duration: 1, delay: 0.3}}
            >
              <img src="/assets/Office_aboutus.png" alt="Logo ThaDo Robot" />
            </motion.div>
            
            <div className="hero-about-content">
               <p className="section-subtitle">
               {t('hero.about_desc')}
               </p>
               
                 {/* Company Criteria */}
                 <div className="hero-criteria">
                   <div className="criteria-item">
                     <div className="criteria-icon criteria-icon--quality"></div>
                     <div className="criteria-text">
                       <h4>Chất lượng</h4>
                       <p>Cam kết sản phẩm đạt tiêu chuẩn cao nhất</p>
                     </div>
                   </div>
                   <div className="criteria-item">
                     <div className="criteria-icon criteria-icon--reputation"></div>
                     <div className="criteria-text">
                       <h4>Uy tín</h4>
                       <p>Xây dựng niềm tin qua nhiều năm kinh nghiệm</p>
                     </div>
                   </div>
                   <div className="criteria-item">
                     <div className="criteria-icon criteria-icon--professional"></div>
                     <div className="criteria-text">
                       <h4>Chuyên nghiệp</h4>
                       <p>Đội ngũ kỹ thuật chuyên môn cao</p>
                     </div>
                   </div>
                 </div>
               
               
               <div className="hero-stats">
                  <div className="hero-stat">
                      <div className="hero-stat-number">{projectsCount}+</div>
                    <div className="hero-stat-label">{t('hero.stats_projects')}</div>
                  </div>
                  <div className="hero-stat">
                    <div className="hero-stat-number">{yearsCount}+</div>
                    <div className="hero-stat-label">{t('hero.stats_years')}</div>
                  </div>
                  <div className="hero-stat">
                    <div className="hero-stat-number">{satisfactionCount}%</div>
                    <div className="hero-stat-label">{t('hero.stats_satisfaction')}</div>
                  </div>
                </div>
            </div>
          </div>
        </div>

        {/* Robot Showcase */}
          <div className="hero-robots-showcase">
            <h2 className="hero-robots-showcase-title"> {t('hero.robots_title')}</h2>
            <div ref={robotCardsRef} className="robots-grid">
              {showcaseProducts.map((product, index) => (
                <motion.div 
                  key={product.id}
                  className="robot-card"
                  onClick={() => navigate(`/product/${product.id}`)}
                  style={{ cursor: 'pointer' }}
                  variants={{
                    hidden: { opacity: 0, scale: 0.1, y: 50 },
                    visible: { 
                      opacity: 1, 
                      scale: 1, 
                      y: 0,
                      transition: { duration: 0.6, ease: 'easeOut', delay: index * 0.1 }
                    }
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.2 }}
                >
                  <div className="robot-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="robot-info">
                    <h4>{product.name}</h4>
                    <p>{product.description?.line1 || 'Sản phẩm nổi bật'}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        {/* Solution Section */}
        <section ref={solutionSectionRef} className='section-stack-cards solution-stackcards'>
          <div className="hero-solution">
            <h2 className="hero-solution-title"> {t('hero.solutions_title')}</h2>
            {/* Features Section */}
            <div className="hero-features">
              <div 
                className="features-container"
              >
                {features.map((feature, index) => (
                  <motion.div 
                    key={index}
                    className={`feature-card`}
                    initial={{ scale: 0.35 }}
                    animate={{ scale: solutionActivated ? 1 : 0.35 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25, delay: index * 0.05 }}
                  >
                    <div className="feature-content"onClick={() => navigate('/solutions')}>
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </div>
                    <div className="feature-arrow">→</div>
                  </motion.div>
                ))}
              </div>
            </div>
            {/* Technology Highlights */}
            <div className="hero-tech-highlights">
              <div 
                className="tech-highlights-grid"
              >
                <motion.div 
                  className="tech-highlight"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: solutionActivated ? 1 : 0.5 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.1 }}
                >
                  <div className="tech-content">
                    <h4>{t('hero.tech_battery_title')}</h4>
                    <p>{t('hero.tech_battery_desc')}</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="tech-highlight"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: solutionActivated ? 1 : 0.5 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.15 }}
                >
                  <div className="tech-content">
                    <h4>{t('hero.tech_5g_title')}</h4>
                    <p>{t('hero.tech_5g_desc')}</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="tech-highlight"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: solutionActivated ? 1 : 0.5 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.2 }}
                >
                  <div className="tech-content">
                    <h4>{t('hero.tech_ai_title')}</h4>
                    <p>{t('hero.tech_ai_desc')}</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="tech-highlight"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: solutionActivated ? 1 : 0.5 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.25 }}
                >
                  <div className="tech-content">
                    <h4>{t('hero.tech_safety_title')}</h4>
                    <p>{t('hero.tech_safety_desc')}</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </section>
  );
};

export default HeroSection;