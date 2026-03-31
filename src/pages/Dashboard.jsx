import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProjectForm from '../components/ProjectForm';
import {
  HiOutlineHome,
  HiOutlineArrowRightOnRectangle,
  HiOutlineSparkles,
  HiOutlineDocumentText,
  HiOutlineCurrencyRupee,
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineChartBar,
} from 'react-icons/hi2';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleFormSubmit = useCallback((data) => {
    navigate('/results', { state: { projectData: data } });
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const firstName = user?.displayName?.split(' ')[0] || 'there';
  const initial = user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="dashboard-page">
      {/* Background orbs */}
      <div className="bg-orbs" aria-hidden="true">
        <div className="orb orb--1"></div>
        <div className="orb orb--2"></div>
        <div className="orb orb--3"></div>
      </div>

      {/* Top Navigation */}
      <header className="dashboard-nav">
        <div className="dashboard-nav__inner">
          <a href="/" className="dashboard-nav__brand" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
            <div className="dashboard-nav__logo">
              <svg viewBox="0 0 24 24">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
              </svg>
            </div>
            <span className="dashboard-nav__name">Smart<span>Build</span></span>
          </a>

          <div className="dashboard-nav__right">
            <div className="dashboard-nav__user">
              <div className="dashboard-nav__avatar">{initial}</div>
              <div className="dashboard-nav__user-info">
                <p className="dashboard-nav__user-name">{user?.displayName || 'User'}</p>
                <p className="dashboard-nav__user-email">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="dashboard-nav__logout"
              title="Sign Out"
            >
              <HiOutlineArrowRightOnRectangle />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="dashboard-main">
        {/* Welcome Section */}
        <div className="dashboard-welcome anim-fade-up">
          <div className="dashboard-welcome__text">
            <h1 className="dashboard-welcome__heading">
              Welcome back, <span className="gradient-gold">{firstName}</span> 👋
            </h1>
            <p className="dashboard-welcome__sub">
              Ready to plan your dream home? Fill in your project details below and our AI will generate a comprehensive construction plan.
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="dashboard-stats anim-fade-up anim-delay-1">
          {[
            { icon: <HiOutlineSparkles />, label: 'AI-Powered', desc: 'Smart Analysis', color: 'green' },
            { icon: <HiOutlineDocumentText />, label: '5 Sections', desc: 'Detailed Plan', color: 'gold' },
            { icon: <HiOutlineCurrencyRupee />, label: 'Cost Estimate', desc: 'Market Rates', color: 'green' },
            { icon: <HiOutlineShieldCheck />, label: 'Vastu Ready', desc: 'Compliant Design', color: 'gold' },
          ].map((stat) => (
            <div key={stat.label} className={`dashboard-stat-card glass-landing`}>
              <div className={`dashboard-stat-card__icon dashboard-stat-card__icon--${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <div className="dashboard-stat-card__label">{stat.label}</div>
                <div className="dashboard-stat-card__desc">{stat.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Form Section */}
        <div className="dashboard-form-section anim-fade-up anim-delay-2">
          <ProjectForm
            onSubmit={handleFormSubmit}
            userId={user?.uid}
          />
        </div>

        {/* What You'll Get section */}
        <div className="dashboard-features anim-fade-up anim-delay-3">
          <h3 className="dashboard-features__title">
            <HiOutlineChartBar className="dashboard-features__title-icon" />
            What Your AI Plan Includes
          </h3>
          <div className="dashboard-features__grid">
            {[
              { icon: <HiOutlineDocumentText />, title: 'Project Summary', desc: 'BHK recommendations, space planning, and regulatory considerations.' },
              { icon: <HiOutlineCurrencyRupee />, title: 'Cost Breakdown', desc: 'Material-wise and phase-wise budget estimation at current market rates.' },
              { icon: <HiOutlineSparkles />, title: 'Interior Design', desc: 'Style recommendations, color palettes, lighting plans, and furniture ideas.' },
              { icon: <HiOutlineShieldCheck />, title: 'Vastu Layout', desc: 'Room placement and orientation following Vastu Shastra principles.' },
              { icon: <HiOutlineClock />, title: 'Timeline', desc: 'Phase-by-phase construction timeline with milestones and inspections.' },
            ].map((feature) => (
              <div key={feature.title} className="dashboard-feature-item glass-landing">
                <div className="dashboard-feature-item__icon">{feature.icon}</div>
                <div>
                  <div className="dashboard-feature-item__title">{feature.title}</div>
                  <div className="dashboard-feature-item__desc">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
