import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import LogoCarousel from './LogoCarousel';
import TimelineAnimation from './TimelineAnimation';  

const AboutSection: React.FC = () => {
  const { setCurrentSection } = useAppStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Hàm tạo màu sắc cho timeline dựa trên năm
  const getTimelineColor = (year: string): string => {
    const colors = [
      '#4F46E5', // Indigo
      '#7C3AED', // Purple
      '#EC4899', // Pink
      '#F59E0B', // Amber
      '#10B981', // Emerald
      '#06B6D4'  // Cyan
    ] as const;
    const yearNum = parseInt(year);
    if (isNaN(yearNum)) return colors[0];
    const yearIndex = yearNum - 2009; // Bắt đầu từ 2009
    const colorIndex = Math.abs(yearIndex) % colors.length;
    return colors[colorIndex] || colors[0];
  };

  const stats = [
    { number: '5+', label: t('about.stats.experience') },
    { number: '50+', label: t('about.stats.projects') },
    { number: '50+', label: t('about.stats.clients') },
    { number: '99%', label: t('about.stats.satisfaction') }
  ];


  const team = [
    {
      name: 'Jenny Phạm',
      position: t('about.team.cco.position'),
      description: t('about.team.cco.description')
    },
    {
      name: 'Steven Phạm',
      position: t('about.team.ceo.position'),
      description: t('about.team.ceo.description')
    },
    {
      name: 'Hòa Phạm',
      position: t('about.team.rd.position'),
      description: t('about.team.rd.description')
    },
  ];

  const values = [
    {
      title: t('about.values.mission.title'),
      description: t('about.values.mission.description')
    },
    {
      title: t('about.values.vision.title'),
      description: t('about.values.vision.description')
    },
    {
      title: t('about.values.core.title'),
      description: t('about.values.core.description')
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: t('about.timeline.2020.title'),
      description: t('about.timeline.2020.description')
    },
    {
      year: '2021',
      title: t('about.timeline.2021.title'),
      description: t('about.timeline.2021.description')
    },
    {
      year: '2022',
      title: t('about.timeline.2022.title'),
      description: t('about.timeline.2022.description')
    },
    {
      year: '2023',
      title: t('about.timeline.2023.title'),
      description: t('about.timeline.2023.description')
    },
    {
      year: '2024',
      title: t('about.timeline.2024.title'),
      description: t('about.timeline.2024.description')
    },
    {
      year: '2025',
      title: t('about.timeline.2025.title'),
      description: t('about.timeline.2025.description')
    }
  ];

  return (
    <section className="about-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{t('about.section_title')} <span style={{color: 'var(--primary)'}} className="text-company">Thadorobot</span></h2>
          <p className="section-subtitle">
          {t('about.section_subtitle')}
          </p>
        </div>

        {/* Stats */}
        <div className="about-stats">
          {stats.map((stat, index) => (
            <div key={index} className="about-stat">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission, Vision, Values */}
        <div className="about-values">
          {values.map((value, index) => (
            <div key={index} className="value-card">
              <h3 className="value-title">{value.title}</h3>
              <p className="value-description">{value.description}</p>
            </div>
          ))}
        </div>
          
        {/* Timeline */}
        <div className="about-timeline">
          <h3 className="timeline-title">{t('about.timeline_title')}</h3>
          <TimelineAnimation 
            data={milestones.map(milestone => ({
              year: milestone.year,
              title: milestone.title,
              description: milestone.description,
              color: getTimelineColor(milestone.year)
            }))}
          />
        </div>

        {/* Team */}
        <div className="about-team">
          <h3 className="team-title">{t('about.team_title')}</h3>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <h4 className="member-name">{member.name}</h4>
                <p className="member-position">{member.position}</p>
                <p className="member-description">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
        <LogoCarousel />
        {/* CTA */}
        <div className="about-cta">
          <div className="cta-content">
            <h3>{t('about.cta.title')}</h3>
            <p>{t('about.cta.description')}</p>
            <div className="cta-buttons">
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setCurrentSection('contact');
                  navigate('/contactus');
                }}
              >
                <span>{t('about.cta.contact_btn')}</span>
              </button>
              
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setCurrentSection('solutions');
                  navigate('/solutions');
                }}
              >
                <span>{t('about.cta.solutions_btn')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 