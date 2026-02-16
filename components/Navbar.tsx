
import React from 'react';
import { Building2, LayoutDashboard, Search, FileCheck, Network, Truck } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'match', label: 'Match', icon: Search },
    { id: 'compliance', label: 'Compliance', icon: FileCheck },
    { id: 'procurement', label: 'Supply', icon: Truck },
    { id: 'seamless', label: 'Flow', icon: Network },
  ];

  return (
    <nav className="sticky top-0 z-50 apple-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setActiveTab('dashboard')}>
            <Building2 className="h-5 w-5 text-apple-text group-hover:text-primary-500 transition-colors" />
            <span className="text-sm font-semibold tracking-tight text-apple-text">MEPropAI</span>
          </div>
          
          <div className="flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`text-[12px] font-medium transition-all duration-200 py-1 border-b flex items-center gap-1.5 ${
                    isActive
                      ? 'text-primary-500 border-primary-500'
                      : 'text-apple-secondary border-transparent hover:text-apple-text'
                  }`}
                >
                  <item.icon className="h-3 w-3" />
                  {item.label}
                </button>
              );
            })}
          </div>
          <div className="w-20"></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
