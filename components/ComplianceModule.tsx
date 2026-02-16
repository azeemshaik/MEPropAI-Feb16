import React, { useState } from 'react';
import { analyzeCompliance, ComplianceInsight } from '../services/gemini';
import { ShieldCheck, FileText, Loader2, BarChart3, Globe, Zap, CheckCircle2 } from 'lucide-react';

const ComplianceModule: React.FC = () => {
  const [projectType, setProjectType] = useState('High-Rise Residential');
  const [location, setLocation] = useState('Riyadh, KSA');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<ComplianceInsight[] | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setInsights(null);
    try {
      const results = await analyzeCompliance(projectType, location);
      setInsights(results);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 animate-fade-in space-y-12">
      <div className="max-w-3xl">
        <h2 className="text-4xl font-bold text-apple-text mb-4">Regulatory <span className="text-primary-500">Advantage</span></h2>
        <p className="text-xl text-apple-secondary leading-relaxed">
          Unlock development speed and tax incentives by aligning your mandate with regional sustainability codes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Scanner Panel */}
        <div className="lg:col-span-5">
          <div className="apple-card p-10 relative overflow-hidden">
            {loading && (
              <div className="absolute top-0 left-0 w-full h-1 bg-primary-500 animate-pulse"></div>
            )}
            
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-primary-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-apple-text">Compliance Scanner</h3>
                  <p className="text-xs font-bold text-apple-secondary uppercase tracking-widest mt-0.5">Engine: V4.1 Stable</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-apple-secondary uppercase tracking-widest px-1">Region</label>
                  <select 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-apple-gray border border-transparent rounded-2xl p-4 text-apple-text font-medium focus:ring-4 focus:ring-primary-500/10 focus:bg-white focus:border-primary-500 outline-none transition-all"
                  >
                    <option>Riyadh, KSA (White Land Tax)</option>
                    <option>Abu Dhabi, UAE (Estidamah)</option>
                    <option>Dubai, UAE (Green Building Code)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-apple-secondary uppercase tracking-widest px-1">Development Type</label>
                  <div className="relative group">
                    <input 
                      type="text" 
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="w-full bg-apple-gray border border-transparent rounded-2xl p-4 text-apple-text font-medium focus:ring-4 focus:ring-primary-500/10 focus:bg-white focus:border-primary-500 outline-none transition-all"
                      placeholder="e.g. Luxury Residential Tower"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="w-full bg-apple-text hover:bg-black text-white font-bold py-5 rounded-3xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Scan Regulations <Zap className="h-4 w-4" /></>}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 p-6 rounded-3xl text-center">
                  <div className="text-3xl font-bold text-apple-text">0.8s</div>
                  <div className="text-[10px] text-apple-secondary font-bold uppercase tracking-widest">Verification Speed</div>
                </div>
                <div className="bg-gray-50 p-6 rounded-3xl text-center">
                  <div className="text-3xl font-bold text-green-600">Auto</div>
                  <div className="text-[10px] text-apple-secondary font-bold uppercase tracking-widest">Risk Mitigation</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Insights Panel */}
        <div className="lg:col-span-7 space-y-4">
           {insights ? (
             insights.map((item, idx) => (
               <div key={idx} className="apple-card p-8 group border-l-4 border-l-primary-500">
                 <div className="flex justify-between items-start mb-4">
                   <h4 className="text-xl font-bold text-apple-text">{item.title}</h4>
                   <div className="flex items-center gap-1 text-green-600">
                     <CheckCircle2 className="h-4 w-4" />
                     <span className="text-[11px] font-bold uppercase tracking-widest">Validated</span>
                   </div>
                 </div>
                 <p className="text-apple-secondary text-sm mb-6 leading-relaxed">{item.description}</p>
                 <div className="bg-primary-50/50 p-4 rounded-2xl border border-primary-100 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <BarChart3 className="h-5 w-5 text-primary-500" />
                     <span className="text-sm font-bold text-apple-text">Est. Incentive</span>
                   </div>
                   <span className="text-lg font-bold text-primary-600">{item.savingEstimate}</span>
                 </div>
               </div>
             ))
           ) : (
             <div className="h-full flex flex-col items-center justify-center apple-card p-12 text-center opacity-80">
               <FileText className="h-16 w-16 text-gray-200 mb-6" />
               <p className="text-apple-secondary font-medium italic">Execute scan to reveal strategic advantages.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ComplianceModule;