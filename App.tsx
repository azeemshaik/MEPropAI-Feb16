import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MatchModule from './components/MatchModule';
import ComplianceModule from './components/ComplianceModule';
import IntegrationModule from './components/IntegrationModule';
import ProcurementModule from './components/ProcurementModule';
import Login from './components/Login';
import { hasApiKey } from './services/gemini';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window.aistudio !== 'undefined' && window.aistudio.hasSelectedApiKey) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setIsAuthenticated(hasKey);
      } else {
        setIsAuthenticated(hasApiKey());
      }
      setIsCheckingAuth(false);
    };
    checkAuth();
  }, []);

  const handleStart = (tab: string = 'match') => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Hero onStart={handleStart} />;
      case 'match':
        return <MatchModule />;
      case 'compliance':
        return <ComplianceModule />;
      case 'procurement':
        return <ProcurementModule />;
      case 'seamless':
        return <IntegrationModule />;
      default:
        return <Hero onStart={handleStart} />;
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-apple-text font-sans selection:bg-primary-500/10 selection:text-primary-700 animate-in fade-in duration-1000">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="transition-all duration-500 ease-in-out">
        {renderContent()}
      </main>
      
      <footer className="py-12 text-center text-apple-secondary text-sm border-t border-gray-200 mt-20 bg-white">
        <p>© 2024 MEPropAI Inc. Built for the future of development in KSA & UAE.</p>
      </footer>
    </div>
  );
};

export default App;