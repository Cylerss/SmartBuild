import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { generateAIPlan } from '../services/aiService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  HiOutlineDocumentText,
  HiOutlineCurrencyRupee,
  HiOutlineSparkles,
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineArrowPath,
  HiOutlineArrowLeft,
  HiOutlineExclamationTriangle,
  HiOutlineCheckCircle,
  HiOutlineMapPin,
  HiOutlineBuildingOffice,
  HiOutlineUsers,
} from 'react-icons/hi2';

const sections = [
  { id: 'summary', num: 1, label: 'Project Summary', icon: HiOutlineDocumentText },
  { id: 'cost', num: 2, label: 'Materials & Cost Estimate', icon: HiOutlineCurrencyRupee },
  { id: 'interior', num: 3, label: 'Interior & Design', icon: HiOutlineSparkles },
  { id: 'vastu', num: 4, label: 'Vastu Shastra Layout', icon: HiOutlineShieldCheck },
  { id: 'timeline', num: 5, label: 'Construction Timeline', icon: HiOutlineClock },
];

export default function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const projectData = location.state?.projectData;

  const [openSections, setOpenSections] = useState({ summary: true });
  const [aiResults, setAiResults] = useState({});
  const [loadingSection, setLoadingSection] = useState(null);
  const [errors, setErrors] = useState({});

  // Redirect if no project data
  useEffect(() => {
    if (!projectData) {
      navigate('/dashboard', { replace: true });
    }
  }, [projectData, navigate]);

  // Auto-fetch the first section on mount
  useEffect(() => {
    if (projectData && !aiResults.summary) {
      fetchSection('summary');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchSection = useCallback(async (sectionId, forceRegenerate = false) => {
    if (!forceRegenerate && aiResults[sectionId]) return;

    setLoadingSection(sectionId);
    setErrors(prev => ({ ...prev, [sectionId]: null }));

    // Reset results for this section if regenerating
    if (forceRegenerate) {
        setAiResults(prev => ({ ...prev, [sectionId]: null }));
    }

    try {
      // Call Gemini directly from frontend — no backend needed
      const result = await generateAIPlan(projectData, sectionId);
      setAiResults(prev => ({ ...prev, [sectionId]: result.content }));
    } catch (err) {
      setErrors(prev => ({ ...prev, [sectionId]: err.message || 'Failed to generate. Please try again.' }));
    } finally {
      setLoadingSection(null);
    }
  }, [projectData, aiResults]);

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
    // Auto-fetch when opening a section for the first time
    if (!openSections[sectionId] && !aiResults[sectionId] && !errors[sectionId]) {
      fetchSection(sectionId);
    }
  };

  // Markdown rendering is now handled by react-markdown and remark-gfm

  if (!projectData) return null;

  const initial = user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="results-page">
      {/* Background orbs */}
      <div className="bg-orbs" aria-hidden="true">
        <div className="orb orb--1"></div>
        <div className="orb orb--2"></div>
        <div className="orb orb--3"></div>
      </div>

      {/* ===== Top Navigation ===== */}
      <header className="dashboard-nav">
        <div className="dashboard-nav__inner">
          <div className="results-nav__left">
            <button
              onClick={() => navigate('/dashboard')}
              className="results-back-btn"
            >
              <HiOutlineArrowLeft />
              <span>Back</span>
            </button>
          </div>

          <a href="/" className="dashboard-nav__brand" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
            <div className="dashboard-nav__logo">
              <svg viewBox="0 0 24 24">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
              </svg>
            </div>
            <span className="dashboard-nav__name">Smart<span>Build</span></span>
          </a>

          <div className="dashboard-nav__right">
            <div className="dashboard-nav__avatar">{initial}</div>
          </div>
        </div>
      </header>

      {/* ===== Page Content ===== */}
      <main className="results-main">
        {/* Page header */}
        <div className="results-header anim-fade-up">
          <h1 className="results-header__title">Your Construction Plan</h1>
          <p className="results-header__sub">
            AI-generated comprehensive plan based on your project details
          </p>
        </div>

        {/* Quick project info bar */}
        <div className="results-info-bar anim-fade-up anim-delay-1">
          {[
            { icon: <HiOutlineBuildingOffice />, label: 'Plot Size', value: `${projectData.plotSize} sq m`, color: 'green' },
            { icon: <HiOutlineMapPin />, label: 'Location', value: projectData.location, color: 'gold' },
            { icon: <HiOutlineCurrencyRupee />, label: 'Budget', value: `₹${projectData.budget}`, color: 'green' },
            { icon: <HiOutlineUsers />, label: 'Type', value: projectData.type, color: 'gold' },
          ].map((item) => (
            <div key={item.label} className="results-info-card glass-landing">
              <div className={`results-info-card__icon results-info-card__icon--${item.color}`}>
                {item.icon}
              </div>
              <div className="results-info-card__text">
                <div className="results-info-card__label">{item.label}</div>
                <div className="results-info-card__value">{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ===== Accordion Sections ===== */}
        <div className="results-sections anim-fade-up anim-delay-2">
          {sections.map((section) => {
            const Icon = section.icon;
            const isOpen = openSections[section.id];
            const isLoading = loadingSection === section.id;
            const hasResult = !!aiResults[section.id];
            const hasError = !!errors[section.id];

            return (
              <div key={section.id} className="results-accordion glass-landing">
                {/* Accordion header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="results-accordion__header"
                >
                  <div className="results-accordion__left">
                    <div className="results-accordion__icon-wrap">
                      <Icon />
                    </div>
                    <span className="results-accordion__label">
                      {section.num}. {section.label}
                    </span>
                    {hasResult && (
                      <HiOutlineCheckCircle className="results-accordion__check" />
                    )}
                  </div>
                  <div className="results-accordion__right">
                    {hasResult && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          fetchSection(section.id, true);
                        }}
                        className="results-accordion__regen"
                        title="Regenerate"
                      >
                        <HiOutlineArrowPath className={isLoading ? 'spin-anim' : ''} />
                      </button>
                    )}
                    {isOpen ? (
                      <HiOutlineChevronUp className="results-accordion__chevron" />
                    ) : (
                      <HiOutlineChevronDown className="results-accordion__chevron" />
                    )}
                  </div>
                </button>

                {/* Accordion content */}
                {isOpen && (
                  <div className="results-accordion__body">
                    {isLoading ? (
                      <div className="results-loading">
                        <ResultSkeleton />
                      </div>
                    ) : hasError ? (
                      <div className="results-error-state">
                        <div className="results-error-state__icon">
                          <HiOutlineExclamationTriangle />
                        </div>
                        <p className="results-error-state__msg">{errors[section.id]}</p>
                        <button
                          onClick={() => fetchSection(section.id, true)}
                          className="btn btn--green results-error-state__btn"
                        >
                          <HiOutlineArrowPath />
                          Try Again
                        </button>
                      </div>
                    ) : hasResult ? (
                      <div className="results-content">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {aiResults[section.id]}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div className="results-empty-state">
                        <p className="results-empty-state__text">Click to generate this section</p>
                        <button
                          onClick={() => fetchSection(section.id, true)}
                          className="btn btn--green results-empty-state__btn"
                        >
                          <HiOutlineSparkles />
                          Generate
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom action */}
        <div className="results-bottom-action anim-fade-up anim-delay-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn--outline"
          >
            <HiOutlineArrowLeft />
            Start New Plan
          </button>
        </div>
      </main>
    </div>
  );
}

function ResultSkeleton() {
  return (
    <div className="results-skeleton">
      <div className="results-skeleton__line results-skeleton__line--title"></div>
      <div className="results-skeleton__group">
        <div className="results-skeleton__line" style={{ width: '90%' }}></div>
        <div className="results-skeleton__line" style={{ width: '75%' }}></div>
        <div className="results-skeleton__line" style={{ width: '85%' }}></div>
      </div>
      <div className="results-skeleton__line results-skeleton__line--title" style={{ width: '40%' }}></div>
      <div className="results-skeleton__group">
        <div className="results-skeleton__line" style={{ width: '80%' }}></div>
        <div className="results-skeleton__line" style={{ width: '65%' }}></div>
      </div>
      <div className="results-loading-text">
        <div className="results-loading-spinner"></div>
        <span>AI is generating your plan...</span>
      </div>
    </div>
  );
}
