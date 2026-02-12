import React, { useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const ServicesHub: React.FC = () => {
  const { t } = useTranslation();
  
  const services = [
    {
      id: 'ai-ml',
      title: t('services.ai_ml.title'),
      description: t('services.ai_ml.description'),
      features: t('services.ai_ml.features', { returnObjects: true }) as string[]
    },
    {
      id: 'iot',
      title: t('services.iot.title'),
      description: t('services.iot.description'),
      features: t('services.iot.features', { returnObjects: true }) as string[]
    },
    {
      id: 'robotics',
      title: t('services.robotics.title'),
      description: t('services.robotics.description'),
      features: t('services.robotics.features', { returnObjects: true }) as string[]
    },
    {
      id: 'automation',
      title: t('services.automation.title'),
      description: t('services.automation.description'),
      features: t('services.automation.features', { returnObjects: true }) as string[]
    },
    {
      id: 'analytics',
      title: t('services.analytics.title'),
      description: t('services.analytics.description'),
      features: t('services.analytics.features', { returnObjects: true }) as string[]
    },
    {
      id: 'maintenance',
      title: t('services.maintenance.title'),
      description: t('services.maintenance.description'),
      features: t('services.maintenance.features', { returnObjects: true }) as string[]
    }
  ];
  // Animation refs và controls
  const headerRef = useRef(null);
  const gridRef = useRef(null);
  
  const headerInView = useInView(headerRef, { once: true });
  const gridInView = useInView(gridRef, { once: true });
  
  const headerControls = useAnimation();
  const gridControls = useAnimation();

  // Animation effects
  React.useEffect(() => {
    if (headerInView) {
      headerControls.start("visible");
    }
  }, [headerInView, headerControls]);

  React.useEffect(() => {
    if (gridInView) {
      gridControls.start("visible");
    }
  }, [gridInView, gridControls]);

  // Animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: -100 },
    visible: { opacity: 1, y: 0 }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.1 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="services">
      <div className="container">
        <motion.div 
          ref={headerRef}
          className="section-header"
          variants={headerVariants}
          initial="hidden"
          animate={headerControls}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="section-title">{t('services.section_title')}</h2>
          <p className="section-subtitle">
            {t('services.section_subtitle')}
          </p>
        </motion.div>

        <motion.div 
          ref={gridRef}
          className="services-grid"
          variants={containerVariants}
          initial="hidden"
          animate={gridControls}
        >
          {services.map((service) => (
            <motion.div 
              key={service.id} 
              className="service-card"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{amount: 0.2 }}
            >
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              
              <ul className="service-features">
                {service.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesHub; 