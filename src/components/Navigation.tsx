import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { useTranslation } from 'react-i18next';
import productsData from '../data/products.json';

const Navigation: React.FC = () => {
  const { currentSection, setCurrentSection, language, setLanguage } = useAppStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isDarkTheme, setIsDarkTheme] = useState(true); // Thêm state cho theme
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const allCategoryNames = useMemo(() => {
    const names = new Set<string>();
    for (const brand of (productsData as any).brands || []) {
      for (const category of brand.categories || []) {
        if (typeof category.name === 'string') names.add(category.name);
      }
    }
    return Array.from(names).sort((a, b) => a.localeCompare(b, 'vi', { sensitivity: 'base' }));
  }, []);

  const menuItems = [
    { id: 'home', label: t('nav.home'), path: '/home', isLink: true },
    { id: 'products', label: t('nav.products'), path: '/products', isLink: true },
    { id: 'solutions', label: t('nav.solutions'), path: '/solutions', isLink: true },
    { id: 'technology', label: t('nav.technology'), path: '/technology', isLink: true },
    { id: 'about', label: t('nav.about'), path: '/about-us', isLink: true },
    { id: 'blog', label: t('nav.blog'), path: '/blog', isLink: true }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsDarkTheme(true);
  }, []);

  // Thêm useEffect để áp dụng theme vào body
  useEffect(() => {
    if (isDarkTheme) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkTheme]);

  // Đồng bộ i18n theo store.language
  useEffect(() => {
    if (language !== i18n.language) {
      void i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  const handleNavClick = (sectionId: string) => {
    setCurrentSection(sectionId as any);
    setIsMobileMenuOpen(false);
  };

  const handleHomeClick = () => {
    setCurrentSection('home');
    navigate('/home');
    setIsMobileMenuOpen(false);
  };

  const handleContactClick = () => {
    setCurrentSection('contact');
    navigate('/contactus');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Thêm function để toggle theme
  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    localStorage.setItem('thadorobot-theme', newTheme ? 'dark' : 'light');
  };

  // Toggle ngôn ngữ EN/VI
  const toggleLanguage = () => {
    const nextLang = language === 'vi' ? 'en' : 'vi';
    setLanguage(nextLang);
  };

  const handleSelectSuggestion = (categoryName: string) => {
    setCurrentSection('products');
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
    setIsMobileMenuOpen(false);
    setShowSuggestions(false);
    setIsSearchExpanded(false);
    setSearchQuery('');
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const first = suggestions[0] || searchQuery.trim();
      if (first) handleSelectSuggestion(first);
    }
  };

  const handleSearchFocus = () => {
    setIsSearchExpanded(true);
  };

  const handleSearchBlur = () => {
    // Delay để người dùng có thể click vào nút search
    setTimeout(() => {
      setIsSearchExpanded(false);
      setShowSuggestions(false);
    }, 200);
  };

  useEffect(() => {
    const keyword = searchQuery.trim().toLowerCase();
    if (!keyword) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const filtered = allCategoryNames
      .filter((name) => name.toLowerCase().includes(keyword))
      .slice(0, 8);
    setSuggestions(filtered);
    setShowSuggestions(true);
  }, [searchQuery, allCategoryNames]);

  // Kiểm tra xem item có active không
  const isItemActive = (item: any) => {
    if (item.isLink) {
      return location.pathname === item.path;
    }
    return currentSection === item.id;
  };

  return (
    <>
      <nav className={`navigation ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          {/* Logo */}
          <div className="nav-logo" onClick={handleHomeClick}>
            <img src="/assets/1.png" alt="THADOROBOT" />
            <h2 className="text-company">THADOROBOT</h2>
          </div>

          {/* Desktop Menu */}
          <ul className="nav-menu">
            {menuItems.map((item) => (
              <li key={item.id} className="nav-item">
                {item.isLink ? (
                  <Link
                    to={item.path}
                    className={`nav-link ${isItemActive(item) ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <button
                    className={`nav-link ${isItemActive(item) ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.id)}
                  >
                    <span>{item.label}</span>
                  </button>
                )}
              </li>
            ))}
          {/* CTA Button */}
          <div className="nav-cta">
            <button
              className="cta-button"
              onClick={handleContactClick}
            >
              <span>{t('nav.contact')}</span>
              
            </button>
          </div>
          
          </ul>
            
          {/* Navigation Controls */}
          <div className="nav-controls">
            {/* Language Toggle */}     
            <button className="control-button language-toggle" title={t('nav.toggle_language')} onClick={toggleLanguage}>
              <span>{language === 'vi' ? '🇻🇳' : '🇺🇸'}</span>
            </button>
            {/* Theme Toggle */}
            <button 
              className="control-button theme-toggle" 
              title={isDarkTheme ? t('nav.toggle_theme_light') : t('nav.toggle_theme_dark')}
              onClick={toggleTheme}
            >
              <span>
                {isDarkTheme ? (
                  <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M484-80q-84 0-157.5-32t-128-86.5Q144-253 112-326.5T80-484q0-146 93-257.5T410-880q-18 99 11 193.5T521-521q71 71 165.5 100T880-410q-26 144-138 237T484-80Zm0-80q88 0 163-44t118-121q-86-8-163-43.5T464-465q-61-61-97-138t-43-163q-77 43-120.5 118.5T160-484q0 135 94.5 229.5T484-160Zm-20-305Z"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M444-768v-144h72v144h-72Zm265 112-54-52 104-102 52 50-102 104Zm59 212v-72h144v72H768ZM444-48v-144h72v144h-72ZM251-658 147-760l54-50 101 101-51 51Zm509 511L659-252l50-50 104 100-53 55ZM48-444v-72h144v72H48Zm152 297-51-53 102-100 25 24 24 25-100 104Zm280-93q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Zm0-72q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Zm0-168Z"/></svg>  
                )}
              </span>
            </button>
            {/* Search with suggestions */}
            <div className="search-container">
              <input
                type="text"
                placeholder={t('nav.find_product') + ' ...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                className={`search-input ${isSearchExpanded ? 'expanded' : ''}`}
              />
              {showSuggestions && suggestions.length >=1  && (
                <ul className="search-suggestions">
                  {suggestions.map((name) => (
                    <li
                      key={name}
                      className="search-suggestion-item"
                      onMouseDown={() => handleSelectSuggestion(name)}
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`mobile-menu-btn ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={toggleMobileMenu}
          >
            <div className="hamburger">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
            {/* Mobile Controls */}
            <div className="mobile-controls">
              <div className="search-container mobile">
                <input
                  type="text"
                    placeholder={t('nav.find_product') + ' ...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="search-input mobile"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="search-suggestions mobile">
                    {suggestions.map((name) => (
                      <li
                        key={name}
                        className="search-suggestion-item"
                        onMouseDown={() => handleSelectSuggestion(name)}
                      >
                        {name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button className="control-button language-toggle" title={t('nav.toggle_language')} onClick={toggleLanguage}>
                <span>{language === 'vi' ? '🇻🇳' : '🇺🇸'}</span>
              </button>
              <button 
                className="control-button theme-toggle" 
                title={isDarkTheme ? t('nav.toggle_theme_light') : t('nav.toggle_theme_dark')}
                onClick={toggleTheme}
              >
                <span>
                {isDarkTheme ? (
                  <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M484-80q-84 0-157.5-32t-128-86.5Q144-253 112-326.5T80-484q0-146 93-257.5T410-880q-18 99 11 193.5T521-521q71 71 165.5 100T880-410q-26 144-138 237T484-80Zm0-80q88 0 163-44t118-121q-86-8-163-43.5T464-465q-61-61-97-138t-43-163q-77 43-120.5 118.5T160-484q0 135 94.5 229.5T484-160Zm-20-305Z"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M444-768v-144h72v144h-72Zm265 112-54-52 104-102 52 50-102 104Zm59 212v-72h144v72H768ZM444-48v-144h72v144h-72ZM251-658 147-760l54-50 101 101-51 51Zm509 511L659-252l50-50 104 100-53 55ZM48-444v-72h144v72H48Zm152 297-51-53 102-100 25 24 24 25-100 104Zm280-93q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Zm0-72q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Zm0-168Z"/></svg>  
                )}
              </span>
              </button>
            </div>
            
            <ul className="mobile-nav-menu">
              {menuItems.map((item) => (
                <li key={item.id}>
                  {item.isLink ? (
                    <Link
                      to={item.path}
                      className={`mobile-nav-item ${isItemActive(item) ? 'active' : ''}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <button
                      className={`mobile-nav-item ${isItemActive(item) ? 'active' : ''}`}
                      onClick={() => handleNavClick(item.id)}
                    >
                      <span>{item.label}</span>
                    </button>
                  )}
                </li>
              ))}
            </ul>
            
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button
                className="cta-button"
                onClick={handleContactClick}
                style={{ width: '100%' }}
              >
                <span>📞</span>
                <span>{t('nav.contact')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation; 