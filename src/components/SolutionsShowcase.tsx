import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float } from '@react-three/drei';
import { useGLTF } from '@react-three/drei';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import solutionsData from '../data/solutions.json';



// Dynamic 3D Model Component
const DynamicModel: React.FC<{ modelPath: string }> = ({ modelPath }) => {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} scale={0.4} />;
};

// Loading Fallback
const LoadingFallback = () => (
  <div className="loading-3d">
    <div className="spinner"></div>
  </div>
);

const SolutionsShowcase: React.FC = () => {
  const [activeSolution, setActiveSolution] = useState(0);
  const { t } = useTranslation();
  const { t: tSolutions } = useTranslation('solutions');
  const navigate = useNavigate();

  // Combine data from solutions.json with translations
  const solutions = (solutionsData as any[]).map((solution) => {
    const translatedData = tSolutions(solution.id, { returnObjects: true }) as any;
    return {
      ...solution,
      ...translatedData,
    };
  });

  // Animation refs
  const headerRef = useRef(null);
  const visualRef = useRef(null);
  const contentRef = useRef(null);

  // Auto cycle through solutions
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSolution((prev) => (prev + 1) % solutions.length);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const currentSolution = solutions[activeSolution];
  
  if (!currentSolution) {
    return <div>Loading...</div>;
  }

  return (
    <section className="solutions">
      <div className="container">
        <motion.div 
          ref={headerRef}
          className="section-header"
          variants={{
            hidden: { opacity: 0, scale: 0.8, y: -30 },
            visible: { 
              opacity: 1, 
              scale: 1, 
              y: 0,
              transition: { duration: 0.6, ease: 'easeOut' }
            }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
        >
          <h2 className="section-title">
            {t('solutions_showcase.section_title')}
          </h2>
          <p className="section-subtitle">
            {t('solutions_showcase.section_subtitle')}
          </p>
        </motion.div>

        <div className="solutions-showcase">
          <motion.div 
            ref={visualRef}
            className="solutions-visual"
            variants={{
              hidden: { opacity: 0, scale: 0.1, y: 50 },
              visible: { 
                opacity: 1, 
                scale: 1, 
                y: 0,
                transition: { duration: 0.6, ease: 'easeOut' }
              }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
          >
            <div className="solutions-3d-container">
              <Suspense fallback={<LoadingFallback />}>
                <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} />
                  <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <DynamicModel modelPath={currentSolution.modelPath} />
                  </Float>
                  <OrbitControls enableZoom={false} enablePan={false} />
                  <Environment preset="city" />
                </Canvas>
              </Suspense>
            </div>
            
            <div className="solutions-indicators">
              {solutions.map((solution, index) => (
                <motion.div
                  key={solution.id}
                  className={`solution-indicator ${index === activeSolution ? 'active' : ''}`}
                  onClick={() => setActiveSolution(index)}
                  style={{ '--indicator-color': solution.color } as any}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="indicator-label">{solution.title}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            ref={contentRef}
            className="solutions-content"
            variants={{
              hidden: { opacity: 0, scale: 0.1, y: 50 },
              visible: { 
                opacity: 1, 
                scale: 1, 
                y: 0,
                transition: { duration: 0.6, ease: 'easeOut' }
              }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
          >
            <div className="solution-header">
              <div 
                className="solution-badge"
                style={{ '--badge-color': currentSolution.color } as React.CSSProperties}
              >
                <span>{t('solutions_showcase.solution_badge', 'Giải pháp')} {activeSolution + 1}/{solutions.length}</span>
              </div>
              
              <h3 className="solution-title">{currentSolution.title}</h3>
              <p className="solution-description">{currentSolution.description}</p>
            </div>

            <div className="solution-features">
              <h4>{t('solutions_showcase.features_title', 'Tính năng nổi bật')}</h4>
              <ul>
                {(currentSolution.features as string[]).map((feature: string, index: number) => (
                  <li key={index}>
                    <span className="feature-icon">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="solution-actions">
              <button className="btn btn-primary" onClick={() => navigate('/solutions')}>
                <span>{t('solutions_showcase.btn_explore')}</span>
                <span className="btn-icon">→</span>
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/contactus')}>
                <span>{t('solutions_showcase.btn_contact')}</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SolutionsShowcase;
