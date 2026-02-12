import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float } from '@react-three/drei';
import { useGLTF } from '@react-three/drei';
import { useTranslation } from 'react-i18next';
import technologiesData from '../data/technologies.json';



// 3D Model Components
const RobotModel = () => {
  const [error, setError] = useState(false);
  
  if (error) {
    return <ModelFallback color="#00d4ff" />;
  }
  
  try {
    const { scene } = useGLTF('/assets/models/logistic_robot_test__2.glb');
    return <primitive object={scene} scale={0.8} />;
  } catch (error) {
    console.warn('Error loading Robot Model:', error);
    setError(true);
    return <ModelFallback color="#00d4ff" />;
  }
};

const LaserModel = () => {
  const [error, setError] = useState(false);
  
  if (error) {
    return <ModelFallback color="#ff6b35" />;
  }
  
  try {
    const { scene } = useGLTF('/assets/models/simulation_laser_cutting_robot_systems.glb');
    return <primitive object={scene} scale={0.8} />;
  } catch (error) {
    console.warn('Error loading Laser Model:', error);
    setError(true);
    return <ModelFallback color="#ff6b35" />;
  }
};

const AGVModel = () => {
  const [error, setError] = useState(false);
  
  if (error) {
    return <ModelFallback color="#8b5cf6" />;
  }
  
  try {
    const { scene } = useGLTF('/assets/models/industrial_-_3d_agv__trolley_-_omrom.glb');
    return <primitive object={scene} scale={0.8} />;
  } catch (error) {
    console.warn('Error loading AGV Model:', error);
    setError(true);
    return <ModelFallback color="#8b5cf6" />;
  }
};

const ModelFallback = ({ color }: { color: string }) => (
  <mesh>
    <boxGeometry args={[2, 2, 2]} />
    <meshStandardMaterial color={color} />
  </mesh>
);

const TechnologySection: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { t: tTech } = useTranslation('technologies');
  const [activeTechnology, setActiveTechnology] = useState(0);

  const modelMap: Record<string, React.FC> = {
    logistic_robot_test__2: RobotModel,
    simulation_laser_cutting_robot_systems: LaserModel,
    industrial_agv_trolley_omrom: AGVModel,
  };
  
  // Combine data from technologies.json with translations
  const technologies = (technologiesData as any[]).map((tech) => {
    const translatedData = tTech(tech.id, { returnObjects: true }) as any;
    return {
      ...tech,
      ...translatedData,
      model: modelMap[tech.modelKey] || (() => null),
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTechnology((prev) => (prev + 1) % technologies.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [technologies.length]);

  const currentTech = technologies[activeTechnology];
  const ModelComponent = currentTech?.model;

  if (!currentTech || !ModelComponent) {
    return (
      <section className="technology-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('technology_page.section_title')}</h2>
            <p className="section-subtitle">
              {t('technology_page.section_subtitle')}
            </p>
          </div>
          <div className="loading-3d">
            <div className="spinner"></div>
            <p>...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="technology-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{t('technology_page.section_title')}</h2>
          <p className="section-subtitle">
            {t('technology_page.section_subtitle')}
          </p>
        </div>

        <div className="technology-showcase">
          <div className="technology-visual">
            <div className="technology-3d-container">
              <Canvas
                camera={{ position: [0, 0, 8], fov: 50 }}
                onError={(error) => console.warn('Canvas error:', error)}
              >
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                <Float
                  speed={2}
                  rotationIntensity={0.5}
                  floatIntensity={0.5}
                >
                  <ModelComponent />
                </Float>
                <OrbitControls 
                  enableZoom={true}
                  enablePan={false}
                  enableRotate={true}
                  zoomSpeed={0.5}
                  rotateSpeed={0.5}
                  minDistance={4}
                  maxDistance={12}
                />
                <Environment preset="city" />
              </Canvas>
            </div>
            
            <div className="technology-indicators">
              {technologies.map((tech, index) => (
                <button
                  key={tech.id}
                  className={`technology-indicator ${activeTechnology === index ? 'active' : ''}`}
                  onClick={() => setActiveTechnology(index)}
                  style={{ '--indicator-color': tech.color } as any}
                >
                  <span style={{color: 'var(--text-primary)'}} className="indicator-label">{tech.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="technology-details">
            <div className="technology-header">
              <div className="technology-badge" style={{ '--badge-color': currentTech.color } as any}>
                <span>{currentTech.icon}</span>
                <span>{currentTech.category}</span>
              </div>
              
              <h3 className="technology-name">{currentTech.name}</h3>
              <p className="technology-description">{currentTech.description}</p>
            </div>

            <div className="technology-content">
              <div className="technology-features">
                <h4>{t('technology_page.features_title')}</h4>
                <ul>
                  {(currentTech.features as string[]).map((feature: string, index: number) => (
                    <li key={index}>
                      <span className="feature-icon">⚡</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="technology-applications">
                <h4>{t('technology_page.applications_title')}</h4>
                <div className="applications-grid">
                  {(currentTech.applications as string[]).map((app: string, index: number) => (
                    <div key={index} className="application-item">
                      <span>{app}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="technology-actions">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/solutions')}
              >
                <span>{t('technology_page.btn_solutions')}</span>
              </button>
              
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/products')}
              >
                <span>{t('technology_page.btn_products')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Technology Stats */}
        <div className="technology-stats">
          <div className="stat-item">
            <div className="stat-number">99.9%</div>
            <div className="stat-label">{t('technology_page.stat_accuracy')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">{t('technology_page.stat_uptime')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50%</div>
            <div className="stat-label">{t('technology_page.stat_cost')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">300%</div>
            <div className="stat-label">{t('technology_page.stat_productivity')}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologySection; 