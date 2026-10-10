import React, { useState, useEffect } from 'react';
import { CompanionProvider } from './companion/CompanionContext';
import { RobotScene } from './companion/RobotScene';
import { CustomCursor } from './utils/cursor';
import { initSmoothScroll, scrollToTarget } from './utils/lenis';
import { Loader } from './components/common/Loader';
import { Header, ViewRoute } from './components/common/Header';

// 12 Scroll-driven Sections
import { HeroSection } from './components/sections/01_Hero/HeroSection';
import { VisionSection } from './components/sections/02_Vision/VisionSection';
import { AtlasSection } from './components/sections/03_Atlas/AtlasSection';
import { SpotSection } from './components/sections/04_Spot/SpotSection';
import { StretchSection } from './components/sections/05_Stretch/StretchSection';
import { MissionControlSection } from './components/sections/06_MissionControl/MissionControlSection';
import { ConnectedRoboticsSection } from './components/sections/07_ConnectedRobotics/ConnectedRoboticsSection';
import { PerformanceSection } from './components/sections/08_Performance/PerformanceSection';
import { TimelineSection } from './components/sections/09_Timeline/TimelineSection';
import { StoriesSection } from './components/sections/10_Stories/StoriesSection';
import { InnovationLabSection } from './components/sections/11_InnovationLab/InnovationLabSection';
import { FooterSection } from './components/sections/12_Footer/FooterSection';

// Dedicated Product Detail Pages
import { AtlasPage } from './components/products/AtlasPage';
import { SpotPage } from './components/products/SpotPage';
import { StretchPage } from './components/products/StretchPage';
import { OrbitPage } from './components/products/OrbitPage';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewRoute>('home');
  const [loaded, setLoaded] = useState(false);

  // Initialize smooth scroll Lenis & GSAP
  useEffect(() => {
    const lenis = initSmoothScroll();
    return () => {
      lenis.destroy();
    };
  }, []);

  // Handle URL hash and browser Back / Forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['atlas', 'spot', 'stretch', 'orbit'].includes(hash)) {
        setCurrentView(hash as ViewRoute);
      } else {
        setCurrentView('home');
      }
    };

    handleHashChange();
    window.addEventListener('popstate', handleHashChange);
    return () => window.removeEventListener('popstate', handleHashChange);
  }, []);

  const handleNavigate = (view: ViewRoute, sectionId?: string) => {
    if (view === 'home') {
      setCurrentView('home');
      window.history.pushState(null, '', '#');
      if (sectionId) {
        setTimeout(() => scrollToTarget(sectionId), 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (['atlas', 'spot', 'stretch', 'orbit'].includes(view)) {
      setCurrentView(view);
      window.history.pushState(null, '', `#${view}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'mission-control') {
      setCurrentView('home');
      window.history.pushState(null, '', '#mission');
      setTimeout(() => scrollToTarget('#mission'), 100);
    } else if (view === 'lab') {
      setCurrentView('home');
      window.history.pushState(null, '', '#lab');
      setTimeout(() => scrollToTarget('#lab'), 100);
    }
  };

  return (
    <CompanionProvider>
      <div className="app-shell" style={{ minHeight: '100vh', position: 'relative' }}>
        {/* Lightweight Non-blocking Diagnostic Boot Loader */}
        <Loader onComplete={() => setLoaded(true)} />

        {/* Custom Enhanced Cursor with Reticle */}
        <CustomCursor />

        {/* UNIT-01 Fixed Background Companion Robot */}
        <RobotScene />

        {/* Unified Top Navigation Header */}
        <Header currentView={currentView} onNavigate={handleNavigate} />

        {/* Main Content Area */}
        <main
          style={{
            position: 'relative',
            zIndex: 2, // Sits above UNIT-01 fixed background
            minHeight: '100vh',
          }}
        >
          {currentView === 'home' && (
            <div className="home-scroll-container">
              {/* 01 Cinematic Hero */}
              <HeroSection
                onExploreProducts={() => handleNavigate('atlas')}
                onDiscoverTech={() => scrollToTarget('#vision')}
              />

              {/* 02 The Future of Robotics */}
              <VisionSection />

              {/* 03 Atlas Experience */}
              <AtlasSection />

              {/* 04 Spot in Action */}
              <SpotSection />

              {/* 05 Industrial Automation */}
              <StretchSection />

              {/* 06 Mission Control Center */}
              <MissionControlSection />

              {/* 07 Connected Robotics */}
              <ConnectedRoboticsSection />

              {/* 08 Performance & Insights */}
              <PerformanceSection />

              {/* 09 Evolution Timeline */}
              <TimelineSection />

              {/* 10 Real-World Stories */}
              <StoriesSection />

              {/* 11 Innovation Lab */}
              <InnovationLabSection />

              {/* 12 Executive CTA & Comprehensive Footer */}
              <FooterSection />
            </div>
          )}

          {currentView === 'atlas' && (
            <AtlasPage onBackToHome={() => handleNavigate('home')} />
          )}

          {currentView === 'spot' && (
            <SpotPage onBackToHome={() => handleNavigate('home')} />
          )}

          {currentView === 'stretch' && (
            <StretchPage onBackToHome={() => handleNavigate('home')} />
          )}

          {currentView === 'orbit' && (
            <OrbitPage onBackToHome={() => handleNavigate('home')} />
          )}
        </main>
      </div>
    </CompanionProvider>
  );
};
