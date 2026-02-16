import React from 'react';
import { ArrowRight, Search, Shield, Zap, Truck } from 'lucide-react';

interface HeroProps {
  onStart: (tab?: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="relative min-h-screen flex flex-col pt-12">
      {/* Background with cinematic gradient */}
      <div className="absolute inset-0 hero-video-bg z-0"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center relative z-10 w-full">
        <div className="mt-20 mb-6 animate-fade-in">
          <span className="text-primary-500 font-semibold tracking-wide text-sm uppercase">Intelligence for the Region</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-apple-text mb-8 max-w-4xl mx-auto leading-[1.05]">
          Search Less. <br />
          <span className="text-primary-500">Match More.</span>
        </h1>

        <p className="text-xl md:text-2xl font-medium text-apple-text/80 max-w-3xl mx-auto mb-16 leading-relaxed">
          The ultimate engine bridging institutional capital to prime Middle East construction through data-driven certainty.
        </p>

        {/* Strategic Unlocks Section - Apple Product Grid Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-20 text-left">
           <div className="apple-card p-6 group cursor-pointer border border-transparent hover:border-primary-500/20" onClick={() => onStart('match')}>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Search className="h-6 w-6 text-primary-500" />
                </div>
                <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-md">Developers</span>
              </div>
              <h3 className="text-lg font-bold mb-3">From "Search" to <span className="text-primary-500">Match</span></h3>
              <p className="text-apple-secondary text-xs leading-relaxed">
                Move beyond listing portals. AI agents match deployment mandates to high-yield sites automatically.
              </p>
           </div>

           <div className="apple-card p-6 group cursor-pointer border border-transparent hover:border-primary-500/20" onClick={() => onStart('compliance')}>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest bg-green-50 px-2 py-1 rounded-md">Compliance</span>
              </div>
              <h3 className="text-lg font-bold mb-3">From "Regulation" to <span className="text-primary-500">Advantage</span></h3>
              <p className="text-apple-secondary text-xs leading-relaxed">
                Turn Estidama and Saudi codes into speed-to-market advantages with pre-validated reporting.
              </p>
           </div>

           <div className="apple-card p-6 group cursor-pointer border border-transparent hover:border-primary-500/20" onClick={() => onStart('procurement')}>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Truck className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-2 py-1 rounded-md">Suppliers</span>
              </div>
              <h3 className="text-lg font-bold mb-3">From "Sourcing" to <span className="text-primary-500">Orchestrated</span></h3>
              <p className="text-apple-secondary text-xs leading-relaxed">
                Dynamic Gantt trackers and risk dashboards ensure parallel procurement and zero-idle site time.
              </p>
           </div>

           <div className="apple-card p-6 group cursor-pointer border border-transparent hover:border-primary-500/20" onClick={() => onStart('seamless')}>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6 text-orange-500" />
                </div>
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-2 py-1 rounded-md">Ecosystem</span>
              </div>
              <h3 className="text-lg font-bold mb-3">From "Siloed" to <span className="text-primary-500">Seamless</span></h3>
              <p className="text-apple-secondary text-xs leading-relaxed">
                The only bridge from the investment board to the construction site via deep ecosystem integrations.
              </p>
           </div>
        </div>

        <button 
          onClick={() => onStart('match')}
          className="bg-apple-text hover:bg-black text-white px-10 py-5 rounded-full text-lg font-bold transition-all shadow-xl hover:shadow-2xl flex items-center gap-3 mx-auto mb-32 group"
        >
          Launch Engine
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default Hero;