import React from 'react';
import { Database, Coins, HardHat, Workflow, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const IntegrationModule: React.FC = () => {
  const data = [
    { stage: 'Mandate', siloed: 100, seamless: 100 },
    { stage: 'Site Selection', siloed: 82, seamless: 100 },
    { stage: 'Feasibility', siloed: 65, seamless: 100 },
    { stage: 'Permitting', siloed: 48, seamless: 100 },
    { stage: 'Construction', siloed: 32, seamless: 100 },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 space-y-20 animate-fade-in">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h2 className="text-4xl font-bold text-apple-text">A Unified <span className="text-primary-500">Ecosystem</span></h2>
        <p className="text-xl text-apple-secondary">The only platform that carries investment intent directly through to the construction floor.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Pipeline Infographic */}
        <div className="apple-card p-10 bg-white overflow-hidden relative">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
           
           <h3 className="text-2xl font-bold mb-12 flex items-center gap-3">
             <Workflow className="h-6 w-6 text-primary-500" />
             Seamless Data Flow
           </h3>

           <div className="space-y-12 relative">
             <div className="absolute left-7 top-0 bottom-0 w-px bg-gray-100"></div>

             {[
               { icon: Coins, title: 'Pre-Acquisition', detail: 'Mandates & Budgets', color: 'bg-blue-500' },
               { icon: Database, title: 'MEPropAI Bridge', detail: 'Real-time Feasibility', color: 'bg-primary-500', highlighted: true },
               { icon: HardHat, title: 'Project Delivery', detail: 'Procore & Autodesk Sync', color: 'bg-orange-500' }
             ].map((step, idx) => (
               <div key={idx} className="flex items-center gap-8 relative">
                 <div className={`w-14 h-14 rounded-2xl ${step.highlighted ? 'bg-primary-500 shadow-xl shadow-primary-500/30' : 'bg-gray-100'} flex items-center justify-center z-10 transition-transform hover:scale-110`}>
                   <step.icon className={`h-6 w-6 ${step.highlighted ? 'text-white' : 'text-apple-secondary'}`} />
                 </div>
                 <div className={`flex-1 p-6 rounded-3xl border ${step.highlighted ? 'bg-primary-50 border-primary-100' : 'bg-gray-50 border-gray-100'}`}>
                   <h4 className={`font-bold ${step.highlighted ? 'text-primary-900' : 'text-apple-text'}`}>{step.title}</h4>
                   <p className="text-xs text-apple-secondary font-medium mt-1">{step.detail}</p>
                 </div>
                 {idx < 2 && <ArrowRight className="absolute -bottom-10 left-12 rotate-90 h-5 w-5 text-gray-200" />}
               </div>
             ))}
           </div>
        </div>

        {/* Integrity Visualization */}
        <div className="space-y-10">
           <div className="apple-card p-10">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-apple-text mb-2">Context Persistence</h3>
                <p className="text-apple-secondary text-sm">Traditional siloed handovers lose up to 68% of institutional context. We maintain total integrity.</p>
              </div>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="primaryGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#006aff" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#006aff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="stage" hide />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                      labelStyle={{ fontWeight: 'bold' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="seamless" 
                      stroke="#006aff" 
                      fill="url(#primaryGrad)" 
                      strokeWidth={3}
                      name="Unified Flow"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="siloed" 
                      stroke="#d1d1d6" 
                      fill="rgba(0,0,0,0.02)" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Legacy Surcharge"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-8">
              <div className="apple-card p-8 text-center">
                <div className="text-5xl font-bold text-apple-text mb-2">0</div>
                <div className="text-[10px] text-apple-secondary font-bold uppercase tracking-widest">Manual Re-entry Points</div>
              </div>
              <div className="apple-card p-8 text-center bg-primary-500">
                <div className="text-5xl font-bold text-white mb-2">100%</div>
                <div className="text-[10px] text-white/70 font-bold uppercase tracking-widest">Auditability</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationModule;