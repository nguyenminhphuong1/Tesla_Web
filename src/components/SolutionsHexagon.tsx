import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import solutionsData from '../data/hexagon_solutions.json';
import { useTranslation } from 'react-i18next';
const solutions = (solutionsData as any[]).filter(s => !!s.subtitle);

const SolutionsHexagon: React.FC = () => {
  const [selectedSolution, setSelectedSolution] = useState<string | null>(null);
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const centralRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const hexRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Animation refs và controls
  const headerRef = useRef(null);
  
  const headerInView = useInView(headerRef, { once: true, amount:0.3 });
  
  const headerControls = useAnimation();

  // Animation effects
  useEffect(() => {
    if (headerInView) {
      headerControls.start("visible");
    }
  }, [headerInView]);

  // Animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 }
  };

  const hexItemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0 }
  };

  const hexGridVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  // Khóa cuộn nền khi mở modal
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    if (selectedSolution) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
    }
    return () => {
      if (selectedSolution) {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      }
    };
  }, [selectedSolution]);

  useEffect(() => {
    const drawLines = (): void => {
      if (!containerRef.current || !centralRef.current || !svgRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const centralRect = centralRef.current.getBoundingClientRect();
    
    // Tính toán radius dựa trên kích thước thực tế của central logo
    // Lấy kích thước thực tế sau khi được scale bởi CSS
    const logoRadius = Math.min(centralRect.width, centralRect.height) / 2;
    
    // Tính vị trí trung tâm chính xác
    const cx = centralRect.left - containerRect.left + centralRect.width / 2;
    const cy = centralRect.top - containerRect.top + centralRect.height / 2; 

    // Clear old lines
    svgRef.current.innerHTML = '';

    // Add new lines
    hexRefs.current.forEach((hex) => {
      if (!hex) return;
      const rect = hex.getBoundingClientRect();
      const x = rect.left - containerRect.left + rect.width / 2;
      const y = rect.top - containerRect.top + rect.height / 2;

      // Tính toán điểm bắt đầu từ rìa logo
      const dx = x - cx;
      const dy = y - cy;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 0) {
        const startX = cx + (dx / distance) * logoRadius;
        const startY = cy + (dy / distance) * logoRadius;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', startX.toString());
        line.setAttribute('y1', startY.toString());
        line.setAttribute('x2', x.toString());
        line.setAttribute('y2', y.toString());
        line.setAttribute('stroke', 'var(--primary)');
        line.setAttribute('stroke-width', '2');
        svgRef.current?.appendChild(line);
    }
    });
  }

  drawLines();
  window.addEventListener('resize', drawLines);
  return () => window.removeEventListener('resize', drawLines);
  }, [solutions]);

  return (
    <section className="solutions-hexagon">
      <div className="container">
        <motion.div 
          ref={headerRef}
          className="section-header"
          variants={headerVariants}
          initial="hidden"
          animate={headerControls}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="section-title">
            {t('solutions_hex.title_prefix')} <span className="text-company">THADOROBOT</span>
          </h2>
          <p className="section-subtitle">
            {t('solutions_hex.subtitle')}
          </p>
        </motion.div>

        <div className="hexagon-container" ref={containerRef}>
          <svg className="connection-lines" ref={svgRef}></svg>

          {/* Central Logo */}
          <div className="central-logo" ref={centralRef}>
            <div className="logo-circle">
              <img src="/assets/logo_white.png" alt="THADOROBOT" />
            </div>
          </div>

          {/* Hexagon Solutions */}
          <motion.div 
            className="hexagon-grid"
            variants={hexGridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.2 }}
          >
            {solutions.map((solution, index) => (
              <motion.div
                id={'hex-' + index}
                key={solution.id}
                ref={el => (hexRefs.current[index] = el)}
                className={`hexagon-item ${selectedSolution === solution.id ? 'active' : ''}`}
                onClick={() => setSelectedSolution(selectedSolution === solution.id ? null : solution.id)}
                variants={hexItemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ 
                  '--hex-color': solution.color,
                  '--hex-index': index 
                } as any}
              >
                <div className="hexagon-content">
                  <div className="hexagon-icon"><img style={{marginTop : '15px', width: '36px', height: '36px' }} src={solution.image} alt={solution.subtitle} /></div>
                  <div className="hexagon-text">
                    <h4>{solution.title}</h4>
                    <p>{solution.subtitle}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>


        {/* Solution Details Modal */}
        {selectedSolution && (
          <div className="solution-modal">
            <div className="modal-content">
              <button 
                className="modal-close"
                onClick={() => setSelectedSolution(null)}
              >
                ×
              </button>
              
              {(() => {
                const solution = solutions.find(s => s.id === selectedSolution);
                if (!solution) return null;
                
                return (
                  <>
                    <div className="modal-header">
                      <div className="modal-title">
                        <h3>{solution.title}</h3>
                        <p>{solution.subtitle}</p>
                      </div>
                    </div>
                    
                    <div className="modal-body">
                      <p className="modal-description">{solution.description}</p>
                      
                      <div className="modal-features">
                        <h4>{t('solutions_hex.features_title')}</h4>
                        <ul>
                          {(solution.features as string[]).map((feature: string, index: number) => (
                            <li key={index}>
                              <span className="feature-icon">✓</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="modal-actions">
                      <button className="btn btn-primary">
                        <span>{t('solutions_hex.btn_explore')}</span>
                        <span className="btn-icon">→</span>
                      </button>
                      <button className="btn btn-secondary">
                        <span>{t('solutions_hex.btn_contact')}</span>
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SolutionsHexagon;
