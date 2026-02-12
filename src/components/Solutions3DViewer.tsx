import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Float, Html } from '@react-three/drei';
// import { useAppStore } from '../store/appStore'; // No longer needed
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import solutionsData from '../data/solutions.json';
import VideoViewer from './VideoViewer';



interface Solution {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  features: string[];
  applications: string[];
  modelPath: string;
  stats: {
    label: string;
    value: string;
  }[];
  benefits: string[];
  technology: string[];
}

// 3D Model Component
const ModelComponent: React.FC<{ modelPath: string }> = ({ modelPath }) => {
  try {
    const { scene } = useGLTF(modelPath);
    
    return (
      <Float
        speed={2}
        rotationIntensity={0.5}
        floatIntensity={0.5}
      >
        <primitive object={scene} scale={1.5} />
      </Float>
    );
  } catch (error) {
    console.error('Error loading 3D model:', error);
    return (
      <Html center>
        <div className="model-error">
          <div className="error-icon">⚠️</div>
          <h3>Không thể tải model 3D</h3>
          <p>Vui lòng thử lại sau</p>
        </div>
      </Html>
    );
  }
};

// Solutions data will be loaded from translation files

const Solutions3DViewer: React.FC = () => {
  const { t } = useTranslation();
  const { t: tSolutions } = useTranslation('solutions');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'technology' | 'benefits'>('overview');
  const navigate = useNavigate();
  
  // Combine data from solutions.json with translations
  const solutions: Solution[] = (solutionsData as any[]).map((solution) => {
    const translatedData = tSolutions(solution.id, { returnObjects: true }) as any;
    return {
      ...solution,
      ...translatedData,
      stats: translatedData.stats?.map((stat: any) => ({
        ...stat,
        label: tSolutions(`stats.${stat.labelKey}`)
      })) || []
    };
  });

  const [selectedSolutionIndex, setSelectedSolutionIndex] = useState<number>(0);

  // Handle CTA button clicks
  const handleContactClick = () => {
    navigate('/contactus');
  };

  const handleDemoClick = () => {
    // Navigate to contact page with demo parameter
    navigate('/contactus?type=demo');
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="solutions-loading">
        <div className="loading-spinner"></div>
        <h2>Đang tải giải pháp...</h2>
      </div>
    );
  }

  const selectedSolution = solutions[selectedSolutionIndex];

  if (!selectedSolution) {
    return (
      <div className="solutions-loading">
        <div className="loading-spinner"></div>
        <h2>Đang tải giải pháp...</h2>
      </div>
    );
  }

  return (
    <div className="solutions-3d-viewer">
      {/* Main Content */}
      <div className="solutions-main">
        {/* Video Viewer Component */}
        <VideoViewer />
        
        <div className="solutions-grid">
          {/* Menu Panel */}
          <div className="solutions-menu-panel">
            <div className="menu-header">
              <h3>{t('solutions_3d.menu_title')}</h3>
              <p>{t('solutions_3d.menu_subtitle')}</p>
            </div>
            <div className="solutions-menu">
              {solutions.map((solution, index) => (
                <motion.div
                  key={solution.id}
                  className={`solution-menu-item ${selectedSolutionIndex === index ? 'active' : ''}`}
                  onClick={() => setSelectedSolutionIndex(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="menu-item-content">
                    <div className="menu-item-info">
                      <h4 className="menu-item-title">{solution.title}</h4>
                      <p className="menu-item-subtitle">{solution.titleEn}</p>
                      <p className="menu-item-description">{solution.description}</p>
                    </div>
                    <div className="menu-item-arrow">→</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Details Panel */}
          <div className="solution-details-panel">
            <div className="solution-header">
              <div className="solution-info">
                <h2 className="solution-title">{selectedSolution.title}</h2>
                <p className="solution-subtitle">{selectedSolution.titleEn}</p>
                <p className="solution-description">{selectedSolution.description}</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="solution-stats">
              {selectedSolution.stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="stat-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="stat-value" style={{ color: 'var(--primary)' }}>
                    {stat.value}
                  </div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Tabs */}
            <div className="solution-tabs">
              <button
                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                {t('solutions_3d.tab_overview')}
              </button>
              <button
                className={`tab-btn ${activeTab === 'features' ? 'active' : ''}`}
                onClick={() => setActiveTab('features')}
              >
                {t('solutions_3d.tab_features')}
              </button>
              <button
                className={`tab-btn ${activeTab === 'technology' ? 'active' : ''}`}
                onClick={() => setActiveTab('technology')}
              >
                {t('solutions_3d.tab_technology')}
              </button>
              <button
                className={`tab-btn ${activeTab === 'benefits' ? 'active' : ''}`}
                onClick={() => setActiveTab('benefits')}
              >
                {t('solutions_3d.tab_benefits')}
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  className="tab-panel"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 'overview' && (
                    <div className="overview-content">
                      <div className="overview-section">
                        <h3>{t('solutions_3d.overview_applications')}</h3>
                        <div className="applications-grid">
                          {selectedSolution.applications.map((app, index) => (
                            <motion.div
                              key={index}
                              className="application-tag"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              {app}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'features' && (
                    <div className="features-content">
                      <div className="features-grid">
                        {selectedSolution.features.map((feature, index) => (
                          <motion.div
                            key={index}
                            className="feature-item"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="feature-icon" style={{ color: 'var(--primary)' }}>✓</div>
                            <div className="feature-text">{feature}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'technology' && (
                    <div className="technology-content">
                      <div className="technology-grid">
                        {selectedSolution.technology.map((tech, index) => (
                          <motion.div
                            key={index}
                            className="technology-item"
                            style={{ background: 'var(--gradient-primary)' }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            {tech}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'benefits' && (
                    <div className="benefits-content">
                      <div className="benefits-grid">
                        {selectedSolution.benefits.map((benefit, index) => (
                          <motion.div
                            key={index}
                            className="benefit-item"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="benefit-text">{benefit}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* CTA Buttons */}
            <div className="solution-cta">
              <button
                className="btn btn-primary"
                style={{ background: 'var(--gradient-primary)' }}
                onClick={handleContactClick}
              >
                <span>{t('solutions_3d.cta_consultation')}</span>
              </button>
              <button className="btn btn-secondary" onClick={handleDemoClick}>
                <span>{t('solutions_3d.cta_brochure')}</span>
              </button>
              <button className="btn btn-outline" onClick={handleDemoClick}>
                <span>{t('solutions_3d.cta_view_demo')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Model Section */}
      <div className="model-section">
        <div className="model-header">
          <h2>{t('solutions_3d.model_title')} {selectedSolution.title}</h2>
          <p>{t('solutions_3d.model_subtitle')}</p>
        </div>
        <div className="model-viewer-container">
          <div className="model-viewer">
            <Suspense fallback={
              <div className="model-loading">
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <p>{t('solutions_3d.model_loading')}</p>
              </div>
            }>
              <Canvas
                camera={{ position: [0, 0, 5], fov: 75 }}
                style={{ width: '100%', height: '500px' }}
              >
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} />
                <ModelComponent modelPath={selectedSolution.modelPath} />
                <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                <Environment preset="city" />
              </Canvas>
            </Suspense>
            <div className="model-controls">
              <button className="control-btn">
                <span>{t('solutions_3d.model_controls.rotate')}</span>
              </button>
              <button className="control-btn">
                <span>{t('solutions_3d.model_controls.zoom')}</span>
              </button>
              <button className="control-btn">
                <span>{t('solutions_3d.model_controls.vr')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA Section */}
      <div className="contact-cta-section">
        <div className="cta-content">
          <h2>{t('solutions_3d.cta_title')}</h2>
          <p>{t('solutions_3d.cta_subtitle')}</p>
          <div className="cta-buttons">
            <button className="btn btn-primary" onClick={handleContactClick}>
              <span>{t('solutions_3d.cta_contact')}</span>
            </button>
            <button className="btn btn-secondary" onClick={handleDemoClick}>
              <span>{t('solutions_3d.cta_demo')}</span>
            </button>
          </div>
        </div>
      </div>


      {/* Chat Button */}
      <div className="chat-button">
        <a href="https://zalo.me/84986249212"style={{textDecoration: 'none',color: 'var(--text-primary)'}}>
        <span className="chat-icon">💬</span>
        <span className="chat-text">Chat với chúng tôi</span>
        </a>
      </div>
    </div>
  );
};

export default Solutions3DViewer; 