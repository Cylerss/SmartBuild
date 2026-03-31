import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    navigate(user ? '/dashboard' : '/login');
  };

  return (
    <div className="landing-page">
      {/* ===== Background Orbs ===== */}
      <div className="bg-orbs" aria-hidden="true">
        <div className="orb orb--1"></div>
        <div className="orb orb--2"></div>
        <div className="orb orb--3"></div>
      </div>

      {/* ===== NAVBAR ===== */}
      <header className="landing-container">
        <nav className="navbar">
          <a href="#" className="navbar__brand" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
            <div className="navbar__logo">
              <svg viewBox="0 0 24 24">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
              </svg>
            </div>
            <span className="navbar__name">Smart<span>Build</span></span>
          </a>

          <div className="navbar__links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it Works</a>
          </div>

          <button onClick={handleGetStarted} className="btn btn--gold btn--nav">
            {user ? 'Dashboard' : 'Get Started'}
          </button>
        </nav>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="hero">
        <div className="landing-container">
          <div className="hero__grid">
            {/* LEFT COLUMN */}
            <div>
              <div className="hero__pill anim-fade-up">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                </svg>
                AI-Powered Construction Planning
              </div>

              <h1 className="hero__heading anim-fade-up anim-delay-1">
                Build Your<br/>
                <span className="gradient-gold">Dream Home</span><br/>
                Smartly
              </h1>

              <p className="hero__sub anim-fade-up anim-delay-2">
                Get AI-powered cost estimates, Vastu-compliant layouts, interior design suggestions, and construction timelines — tailored for Indian homeowners.
              </p>

              <div className="hero__actions anim-fade-up anim-delay-3">
                <button onClick={handleGetStarted} className="btn btn--gold">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                  </svg>
                  {user ? 'Go to Dashboard' : 'Get Started Free'}
                </button>
                <a href="#features" className="btn btn--outline">Learn More</a>
              </div>

              <div className="hero__trust anim-fade-up anim-delay-4">
                <div className="trust-item">
                  <div className="trust-item__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="trust-item__value">5,000+</div>
                    <div className="trust-item__label">Plans Generated</div>
                  </div>
                </div>

                <div className="trust-item">
                  <div className="trust-item__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                      <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="trust-item__value">₹2Cr+</div>
                    <div className="trust-item__label">Budget Saved</div>
                  </div>
                </div>

                <div className="trust-item">
                  <div className="trust-item__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="trust-item__value">98%</div>
                    <div className="trust-item__label">Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN — Hero Card */}
            <div className="hero__card-wrap anim-fade-up anim-delay-3">
              <div className="hero__card glass-hero-landing anim-float anim-glow">
                <div className="hero__card-dots">
                  <span className="dot dot--red"></span>
                  <span className="dot dot--yellow"></span>
                  <span className="dot dot--green"></span>
                  <span className="card-title">SmartBuild — Cost Estimate</span>
                </div>

                <div className="card-row">
                  <span className="card-row__label">Project Type</span>
                  <span className="card-row__value">3 BHK Independent House</span>
                </div>
                <div className="card-row">
                  <span className="card-row__label">Plot Size</span>
                  <span className="card-row__value">1,200 sq ft</span>
                </div>
                <div className="card-row">
                  <span className="card-row__label">Location</span>
                  <span className="card-row__value">Bangalore, Karnataka</span>
                </div>
                <div className="card-row" style={{ borderBottom: 'none' }}>
                  <span className="card-row__label">Floors</span>
                  <span className="card-row__value">G + 1</span>
                </div>

                <div className="card-cost">
                  <div className="card-cost__label">Estimated Total Cost</div>
                  <div className="card-cost__amount gradient-green-text">₹32,50,000</div>
                  <div className="card-cost__note">Based on current market rates</div>
                </div>

                <div className="card-phases">
                  <div className="phase-box">
                    <div className="phase-box__label">Foundation</div>
                    <div className="phase-box__value">₹4.2L</div>
                    <div className="phase-bar"><div className="phase-bar__fill" style={{ width: '30%' }}></div></div>
                  </div>
                  <div className="phase-box">
                    <div className="phase-box__label">Structure</div>
                    <div className="phase-box__value">₹12.8L</div>
                    <div className="phase-bar"><div className="phase-bar__fill" style={{ width: '65%' }}></div></div>
                  </div>
                  <div className="phase-box">
                    <div className="phase-box__label">Finishing</div>
                    <div className="phase-box__value">₹15.5L</div>
                    <div className="phase-bar"><div className="phase-bar__fill" style={{ width: '80%' }}></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="features-section" id="features">
        <div className="landing-container">
          <div className="section-header anim-fade-up">
            <h2 className="section-header__title">
              Everything You Need to <span className="gradient-green-text">Plan Your Home</span>
            </h2>
            <p className="section-header__sub">
              Our AI analyzes your requirements and generates detailed plans covering every aspect of home construction.
            </p>
          </div>

          <div className="features__grid">
            {[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor"/></svg>
                ),
                title: 'Project Summary',
                desc: 'Get BHK recommendations, built-up area calculations, and space planning tailored to your needs.',
                color: 'green',
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor"/></svg>
                ),
                title: 'Cost Estimation',
                desc: 'Detailed material-wise and phase-wise cost breakdown with current Indian market rates.',
                color: 'gold',
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none"><path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" stroke="currentColor"/></svg>
                ),
                title: 'Interior Design',
                desc: 'AI-suggested interior styles, color palettes, lighting plans, and furniture recommendations.',
                color: 'green',
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor"/></svg>
                ),
                title: 'Vastu Compliance',
                desc: 'Room placement and orientation aligned with traditional Vastu Shastra principles.',
                color: 'gold',
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor"/></svg>
                ),
                title: 'Construction Timeline',
                desc: 'Phase-by-phase timeline with milestones and seasonal recommendations for your region.',
                color: 'green',
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke="currentColor"/></svg>
                ),
                title: 'Secure & Private',
                desc: 'Your project data is encrypted and stored securely. We never share your information.',
                color: 'gold',
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className={`feature-card glass-landing anim-fade-up anim-delay-${(i % 3) + 1}`}
              >
                <div className={`feature-card__icon feature-card__icon--${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="feature-card__title">{feature.title}</h3>
                <p className="feature-card__desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="landing-container">
          <div className="section-header anim-fade-up">
            <h2 className="section-header__title">
              How <span className="gradient-gold">SmartBuild</span> Works
            </h2>
            <p className="section-header__sub">
              Three simple steps to your comprehensive home construction plan
            </p>
          </div>

          <div className="steps">
            {[
              { num: '01', title: 'Enter Project Details', desc: 'Provide your plot size, budget, location, number of floors, and preferences. The more details, the better your plan.', gradient: 'gradient-gold' },
              { num: '02', title: 'AI Generates Your Plan', desc: 'Our AI engine analyzes your inputs against current market data and best practices to create a detailed plan.', gradient: 'gradient-green-text' },
              { num: '03', title: 'View & Refine Results', desc: 'Explore your project summary, cost breakdown, interior recommendations, Vastu layout, and timeline. Regenerate any section as needed.', gradient: 'gradient-gold' },
            ].map((step, i) => (
              <div key={step.num} className={`step anim-fade-up anim-delay-${i + 1}`}>
                <div className={`step__num ${step.gradient}`}>{step.num}</div>
                <div>
                  <h3 className="step__title">{step.title}</h3>
                  <p className="step__desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="cta-section">
        <div className="landing-container">
          <div className="cta__card glass-landing anim-fade-up">
            <h2 className="cta__title">Ready to Build Your <span className="gradient-gold">Dream Home</span>?</h2>
            <p className="cta__sub">
              Join thousands of homeowners who've used SmartBuild to plan their perfect home. It only takes 2 minutes.
            </p>
            <button onClick={handleGetStarted} className="btn btn--gold">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              {user ? 'Go to Dashboard' : 'Start Planning Now'}
            </button>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="footer__inner">
            <div className="footer__brand">
              <div className="footer__brand-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
                </svg>
              </div>
              <span className="footer__brand-name">Smart<span style={{ color: 'var(--clr-primary)' }}>Build</span></span>
            </div>
            <p className="footer__copy">© 2026 SmartBuild. Built with AI for Indian homeowners.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
