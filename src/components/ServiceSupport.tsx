import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';


const ServiceSupport: React.FC = () => {
  const { t } = useTranslation();

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.1 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  };

  return (
    <section className="services-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{t('home_sections.services_support_title')}</h2>
          <p className="section-subtitle">
            {t('home_sections.services_support_subtitle')}
          </p>
        </div>
        <div className="services-grid">
          <motion.div className="service-card" variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }}>
            <img src="/assets/thinking.png" alt="Thinking" />
            <h3>{t('home_sections.services_cards.strategy_title')}</h3>
            <p>{t('home_sections.services_cards.strategy_desc')}</p>
          </motion.div>
          <motion.div className="service-card" variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }}>
            <img src="/assets/develop.png" alt="Deployment" />
            <h3>{t('home_sections.services_cards.deployment_title')}</h3>
            <p>{t('home_sections.services_cards.deployment_desc')}</p>
          </motion.div>
          <motion.div className="service-card" variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }}>
            <img src="/assets/training.png" alt="Training" />
            <h3>{t('home_sections.services_cards.training_title')}</h3>
            <p>{t('home_sections.services_cards.training_desc')}</p>
          </motion.div>
          <motion.div className="service-card" variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }}>
            <img src="/assets/maintain.png" alt="Maintenance" />
            <h3>{t('home_sections.services_cards.maintenance_title')}</h3>
            <p>{t('home_sections.services_cards.maintenance_desc')}</p>
          </motion.div>
          <motion.div className="service-card" variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }}>
            <img src="/assets/Twenty_Four_Seven.png" alt="24/7" />
            <h3>{t('home_sections.services_cards.support_title')}</h3>
            <p>{t('home_sections.services_cards.support_desc')}</p>
          </motion.div>
          <motion.div className="service-card" variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }}>
            <img src="/assets/Continuous_Mode.png" alt="Continuous Mode" />
            <h3>{t('home_sections.services_cards.optimization_title')}</h3>
            <p>{t('home_sections.services_cards.optimization_desc')}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSupport;


