import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { MagneticButton } from '../../../utils/magnetic';
import { soundFx } from '../../../utils/audio';
import { Zap, Send, FileText, CheckCircle, ArrowRight, ShieldCheck, Terminal } from 'lucide-react';

export const FooterSection: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setSubmitted(true);
    soundFx.playTargetLock();
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#00D5FF', '#00E699', '#FFFFFF'],
      });
    } catch {
      // Confetti fallback
    }
  };

  return (
    <footer
      id="footer"
      style={{
        backgroundColor: '#070A0E',
        borderTop: '1px solid rgba(0, 213, 255, 0.25)',
        paddingTop: '80px',
        paddingBottom: '48px',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div className="section-container">
        {/* Closing Executive CTA Card */}
        <div
          className="glass-panel blueprint-box"
          style={{
            padding: '48px 36px',
            marginBottom: '64px',
            background: 'linear-gradient(135deg, rgba(18, 27, 38, 0.9) 0%, rgba(11, 15, 20, 0.95) 100%)',
            textAlign: 'center',
          }}
        >
          <div className="telemetry-badge" style={{ marginBottom: 16 }}>
            <span className="dot" />
            READY FOR DEPLOYMENT // COMMERCIAL ENGAGEMENTS
          </div>

          <h2
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              marginBottom: 16,
              color: 'var(--text-snow)',
            }}
          >
            Deploy Autonomous Dynamics to Your Facility
          </h2>

          <p
            style={{
              maxWidth: '640px',
              margin: '0 auto 32px auto',
              fontSize: '1.1rem',
              color: 'var(--text-secondary)',
            }}
          >
            Connect with our engineering solutions architects to evaluate payload integration, site readiness, and ROI timelines across your facility.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <MagneticButton strength={0.25}>
              <button
                onClick={() => { setModalOpen(true); soundFx.playClick(); }}
                className="btn-cyber"
              >
                <span>Request Facility Pilot</span>
                <ArrowRight size={18} />
              </button>
            </MagneticButton>

            <MagneticButton strength={0.25}>
              <a
                href="#hero"
                className="btn-cyber-outline"
                onClick={() => soundFx.playClick()}
              >
                <span>Back to Overview Top</span>
              </a>
            </MagneticButton>
          </div>
        </div>

        {/* Modal Terminal Dialog */}
        {modalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(7, 10, 14, 0.85)',
              backdropFilter: 'blur(12px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
            }}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="glass-panel blueprint-box"
              style={{
                maxWidth: '480px',
                width: '100%',
                padding: 32,
                backgroundColor: '#0B0F14',
                border: '1px solid #00D5FF',
                boxShadow: '0 0 32px rgba(0, 213, 255, 0.25)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#00D5FF', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                  <Terminal size={16} />
                  COMMAND INTERFACE // PILOT REQUEST
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  style={{ color: 'var(--text-secondary)', fontSize: '18px', cursor: 'pointer' }}
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              {!submitted ? (
                <form onSubmit={handleSubmit}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: 20 }}>
                    Enter your organization contact to schedule a live technical telemetry simulation with our robotics deployment engineers.
                  </p>

                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#00D5FF', marginBottom: 6 }}>
                      ENTERPRISE EMAIL ADDRESS:
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="engineer@enterprise.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        backgroundColor: '#121B26',
                        border: '1px solid var(--border-accent)',
                        borderRadius: 4,
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '13px',
                      }}
                    />
                  </div>

                  <button type="submit" className="btn-cyber" style={{ width: '100%' }}>
                    <span>TRANSMIT BRIEFING DISPATCH</span>
                    <Send size={16} />
                  </button>
                </form>
              ) : (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <CheckCircle size={48} color="#00E699" style={{ margin: '0 auto 16px auto' }} />
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--text-snow)', marginBottom: 8 }}>
                    DISPATCH TRANSMITTED
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: 20 }}>
                    Telemetry handshake confirmed for <strong style={{ color: '#00D5FF' }}>{emailInput}</strong>. Our engineering leads will reach out within 24 hours.
                  </p>
                  <button
                    onClick={() => { setModalOpen(false); setSubmitted(false); }}
                    className="btn-cyber-outline"
                    style={{ width: '100%' }}
                  >
                    CLOSE TERMINAL
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Sitemap & Legal Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 36,
            marginBottom: 48,
          }}
        >
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Zap size={20} color="#00D5FF" />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-snow)' }}>
                SIGNATURE ROBOTICS
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              A cinematic concept showcase exploring autonomous kinematics, bio-inspired whole-body balance, and interactive companion robotics.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#00D5FF', marginBottom: 14, letterSpacing: '0.08em' }}>
              PLATFORMS
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <li><a href="#atlas" style={{ transition: 'color 0.2s' }}>Atlas Electric Humanoid</a></li>
              <li><a href="#spot" style={{ transition: 'color 0.2s' }}>Spot Industrial Quadruped</a></li>
              <li><a href="#stretch" style={{ transition: 'color 0.2s' }}>Stretch Logistics Unloader</a></li>
              <li><a href="#mission" style={{ transition: 'color 0.2s' }}>Orbit Fleet Command</a></li>
            </ul>
          </div>

          {/* Research & Tech */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#00D5FF', marginBottom: 14, letterSpacing: '0.08em' }}>
              CORE ARCHITECTURE
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <li><a href="#vision">Whole-Body Dynamic MPC</a></li>
              <li><a href="#connected">Orbit Mesh Protocols</a></li>
              <li><a href="#lab">A* Kinematic Path Planning</a></li>
              <li><a href="#timeline">Chronological Milestones</a></li>
            </ul>
          </div>

          {/* Accessibility & Shortcuts */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#00D5FF', marginBottom: 14, letterSpacing: '0.08em' }}>
              ACCESSIBILITY & SHORTCUTS
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <div><strong style={{ color: 'var(--text-snow)' }}>[TAB]</strong> Navigate focus targets</div>
              <div><strong style={{ color: 'var(--text-snow)' }}>[ENTER]</strong> Trigger IK press mirror</div>
              <div><strong style={{ color: 'var(--text-snow)' }}>[ESC]</strong> Close open modals</div>
              <div style={{ marginTop: 8, color: '#00E699' }}>WCAG 2.1 AA Compliant</div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer & Verification Notice */}
        <div
          style={{
            paddingTop: 24,
            borderTop: '1px solid rgba(142, 154, 168, 0.12)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            CINEMATIC CONCEPT EXPERIENCE // Non-official portfolio engineering showcase.
          </div>
          <div>
            STAGE 1-5 PRODUCTION READY // VITE + REACT + THREE.JS + GSAP
          </div>
        </div>
      </div>
    </footer>
  );
};
