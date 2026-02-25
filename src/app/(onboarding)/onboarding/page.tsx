'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';

type OnboardingPhase = 
  | 'INITIALIZATION' 
  | 'COMPLIANCE' 
  | 'FINANCIAL_STRUCTURING' 
  | 'RISK_CALIBRATION' 
  | 'PERMISSIONS' 
  | 'ACTIVATION';

type Role = 'BORROWER' | 'LENDER';

interface OnboardingState {
  currentPhase: OnboardingPhase;
  selectedRoles: Role[];
  identity: {
    email: string;
    authMethod: 'PASSWORD' | 'WALLET';
    mfaEnabled: boolean;
  };
  compliance: {
    legalName: string;
    jurisdiction: string;
    entityType: string;
    kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
    accreditationConfirmed: boolean;
  };
  financial: {
    incomeSources: { source: string; amount: string }[];
    capitalSource: string;
    riskTolerance: number; // 0-100
    preferredSectors: string[];
    annualVolume?: string;
    deploymentLimit?: string;
  };
  progress: number;
}

const PHASES: { id: OnboardingPhase; label: string; ordinal: string }[] = [
  { id: 'INITIALIZATION', label: 'Identity Initialization', ordinal: '01' },
  { id: 'COMPLIANCE', label: 'Compliance & Legal Layer', ordinal: '02' },
  { id: 'FINANCIAL_STRUCTURING', label: 'Financial Profile Structuring', ordinal: '03' },
  { id: 'RISK_CALIBRATION', label: 'Risk Calibration', ordinal: '04' },
  { id: 'PERMISSIONS', label: 'System Permissions', ordinal: '05' },
  { id: 'ACTIVATION', label: 'Operational Activation', ordinal: '06' },
];

export default function OnboardingPage() {
  const [state, setState] = useState<OnboardingState>({
    currentPhase: 'INITIALIZATION',
    selectedRoles: [],
    identity: {
      email: '',
      authMethod: 'PASSWORD',
      mfaEnabled: false,
    },
    compliance: {
      legalName: '',
      jurisdiction: '',
      entityType: 'individual',
      kycStatus: 'PENDING',
      accreditationConfirmed: false,
    },
    financial: {
      incomeSources: [{ source: '', amount: '' }],
      capitalSource: '',
      riskTolerance: 50,
      preferredSectors: [],
      annualVolume: '',
      deploymentLimit: '',
    },
    progress: 16.6,
  });

  const [auditLog, setAuditLog] = useState<{ step: string; timestamp: string }[]>([]);

  // Log action for audit trail
  const logAction = (stepName: string) => {
    const entry = { step: stepName, timestamp: new Date().toISOString() };
    setAuditLog(prev => [...prev, entry]);
    console.log(`[AUDIT] ${entry.timestamp}: ${entry.step}`);
  };

  const canContinue = () => {
    switch (state.currentPhase) {
      case 'INITIALIZATION':
        return state.selectedRoles.length > 0 && state.identity.email.includes('@');
      case 'COMPLIANCE':
        return state.compliance.legalName.length > 2 && state.compliance.jurisdiction !== '';
      case 'FINANCIAL_STRUCTURING':
        if (state.selectedRoles.includes('BORROWER')) return (state.financial.annualVolume?.length ?? 0) > 0;
        if (state.selectedRoles.includes('LENDER')) return (state.financial.deploymentLimit?.length ?? 0) > 0;
        return true;
      default:
        return true;
    }
  };

  const nextPhase = () => {
    if (!canContinue()) return;
    const currentIndex = PHASES.findIndex(p => p.id === state.currentPhase);
    if (currentIndex < PHASES.length - 1) {
      const nextP = PHASES[currentIndex + 1].id;
      setState(prev => ({ 
        ...prev, 
        currentPhase: nextP,
        progress: ((currentIndex + 2) / PHASES.length) * 100
      }));
      logAction(`Advanced to ${nextP}`);
    }
  };

  const prevPhase = () => {
    const currentIndex = PHASES.findIndex(p => p.id === state.currentPhase);
    if (currentIndex > 0) {
      const prevP = PHASES[currentIndex - 1].id;
      setState(prev => ({ 
        ...prev, 
        currentPhase: prevP,
        progress: (currentIndex / PHASES.length) * 100
      }));
      logAction(`Reverted to ${prevP}`);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark text-white flex flex-col font-mono selection:bg-white selection:text-black">
      {/* OS Header */}
      <header className="border-b border-border-dark px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-50 bg-background-dark/90 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="size-5 bg-white text-black flex items-center justify-center font-bold text-[10px]">Q</div>
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase">Quantara // OS</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[#4a4a4a] text-[10px] uppercase tracking-widest">
            <span>System Provisioning</span>
            <span className="size-1 bg-border-dark rounded-full" />
            <span>v.2.0.4</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-[10px] text-[#888]">
            <div className="size-1.5 bg-white rounded-full animate-pulse" />
            <span className="uppercase">Secure Uplink</span>
          </div>
          <Link href="/" className="text-[10px] uppercase border border-border-dark px-3 py-1 hover:bg-white hover:text-black transition-all flex items-center gap-2">
            <span>Terminate</span>
            <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Progress Sidebar */}
        <aside className="w-full lg:w-80 border-r border-border-dark bg-[#0c0c0c] flex flex-col shrink-0">
          <div className="p-8 space-y-8 flex-1">
            <div>
              <span className="text-[10px] text-[#4a4a4a] uppercase tracking-[0.3em] block mb-2">Phase Progress</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-light">{Math.round(state.progress)}</span>
                <span className="text-sm text-[#4a4a4a]">%</span>
              </div>
              <div className="h-0.5 w-full bg-[#1a1a1a] mt-4">
                <motion.div 
                  className="h-full bg-white" 
                  initial={{ width: 0 }}
                  animate={{ width: `${state.progress}%` }}
                />
              </div>
            </div>

            <nav className="space-y-4">
              {PHASES.map((p, i) => {
                const isActive = p.id === state.currentPhase;
                const isCompleted = PHASES.findIndex(x => x.id === state.currentPhase) > i;
                return (
                  <div key={p.id} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className={`size-4 border flex items-center justify-center text-[8px] transition-all ${
                        isActive ? 'bg-white border-white text-black' : 
                        isCompleted ? 'bg-border-dark border-border-dark text-white' : 
                        'border-border-dark text-[#4a4a4a]'
                      }`}>
                        {isCompleted ? 'CH' : p.ordinal}
                      </div>
                      {i < PHASES.length - 1 && (
                        <div className={`w-px h-8 transition-colors ${isCompleted ? 'bg-border-dark' : 'bg-[#1a1a1a]'}`} />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-[10px] uppercase tracking-widest transition-colors ${
                        isActive ? 'text-white font-bold' : isCompleted ? 'text-[#888]' : 'text-[#4a4a4a]'
                      }`}>
                        {p.label}
                      </span>
                      {isActive && (
                        <motion.span layoutId="activeStep" className="text-[9px] text-[#4a4a4a] mt-1 italics">PROCESSING...</motion.span>
                      )}
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>

          <div className="p-8 border-t border-border-dark">
            <div className="space-y-2 text-[10px] text-[#4a4a4a] uppercase">
              <div className="flex justify-between">
                <span>Entropy Status</span>
                <span className="text-white">OPTIMAL</span>
              </div>
              <div className="flex justify-between">
                <span>Encryption</span>
                <span className="text-white">AES-256</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Action Surface */}
        <main className="flex-1 flex flex-col bg-background-dark overflow-y-auto">
          <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={state.currentPhase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-2xl"
              >
                {/* ═══ INITIALIZATION ═══ */}
                {state.currentPhase === 'INITIALIZATION' && (
                  <div className="space-y-12">
                    <div className="space-y-4">
                      <h1 className="text-2xl font-light uppercase tracking-tighter">Initialize Operational Identity</h1>
                      <div className="space-y-4 max-w-lg">
                        <p className="text-[#888] text-sm leading-relaxed">
                          Establish authenticated context. Quantara requires session initialization 
                          before compliance provisioning.
                        </p>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-[#4a4a4a]">Institutional Email</label>
                          <input 
                            type="email"
                            value={state.identity.email}
                            onChange={(e) => setState(prev => ({ ...prev, identity: { ...prev.identity, email: e.target.value } }))}
                            className="w-full bg-transparent border border-border-dark p-4 text-sm focus:border-white focus:outline-none transition-all placeholder:text-border-dark" 
                            placeholder="OPERATOR@CORE.QUANTARA.IO"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="p-6 border border-border-dark bg-white/5 space-y-6">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-white">fingerprint</span>
                          <span className="text-[10px] uppercase tracking-[0.3em] text-white">Security Protocol Selection</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <button 
                            onClick={() => setState(prev => ({ ...prev, identity: { ...prev.identity, authMethod: 'PASSWORD' } }))}
                            className={`p-4 border text-left transition-all ${state.identity.authMethod === 'PASSWORD' ? 'border-white bg-white/10' : 'border-border-dark text-[#888] hover:border-white/50'}`}
                          >
                            <span className="text-[10px] block mb-1">Method A</span>
                            <span className="text-xs font-bold block uppercase">Institutional Auth</span>
                          </button>
                          <button 
                            onClick={() => setState(prev => ({ ...prev, identity: { ...prev.identity, authMethod: 'WALLET' } }))}
                            className={`p-4 border text-left transition-all ${state.identity.authMethod === 'WALLET' ? 'border-white bg-white/10' : 'border-border-dark text-[#888] hover:border-white/50'}`}
                          >
                            <span className="text-[10px] block mb-1">Method B</span>
                            <span className="text-xs font-bold block uppercase">Web3 Identity</span>
                          </button>
                        </div>
                      </div>

                      <div className="border-t border-border-dark pt-12">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-[#4a4a4a] block mb-6">Select Operational Intent</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {[
                            { id: 'BORROWER', title: 'Borrower', desc: 'I provide structured income', icon: 'payments' },
                            { id: 'LENDER', title: 'Lender', desc: 'I allocate capital', icon: 'account_balance' },
                          ].map((role) => (
                            <button
                              key={role.id}
                              onClick={() => setState(prev => ({ ...prev, selectedRoles: [role.id as Role] }))}
                              className={`p-6 border text-left transition-all relative group overflow-hidden ${
                                state.selectedRoles.includes(role.id as Role)
                                  ? 'bg-white text-black border-white'
                                  : 'border-border-dark text-white hover:border-white/50'
                              }`}
                            >
                              <div className="relative z-10">
                                <span className={`material-symbols-outlined mb-4 block transition-colors ${
                                  state.selectedRoles.includes(role.id as Role) ? 'text-black' : 'text-[#4a4a4a]'
                                }`}>
                                  {role.icon}
                                </span>
                                <span className="text-sm font-bold block uppercase tracking-wider">{role.title}</span>
                                <span className={`text-[10px] block mt-1 ${
                                  state.selectedRoles.includes(role.id as Role) ? 'text-black/60' : 'text-text-dark'
                                }`}>{role.desc}</span>
                              </div>
                              <div className="absolute top-2 right-2">
                                <div className={`size-4 border flex items-center justify-center ${
                                  state.selectedRoles.includes(role.id as Role) ? 'border-black' : 'border-border-dark'
                                }`}>
                                  {state.selectedRoles.includes(role.id as Role) && <div className="size-2 bg-black" />}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ═══ COMPLIANCE ═══ */}
                {state.currentPhase === 'COMPLIANCE' && (
                  <div className="space-y-12">
                    <div className="space-y-4">
                      <h1 className="text-2xl font-light uppercase tracking-tighter text-white">Compliance & Legal Layer</h1>
                      <p className="text-[#888] text-sm leading-relaxed max-w-lg">
                        Establishing legal jurisdiction and entity parameters for 
                        <span className="text-white ml-2 font-bold">{state.selectedRoles.join(' + ')}</span> operations.
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#4a4a4a]">Legal Entity Name</label>
                        <input 
                          value={state.compliance.legalName}
                          onChange={(e) => setState(prev => ({ ...prev, compliance: { ...prev.compliance, legalName: e.target.value } }))}
                          className="w-full bg-transparent border border-border-dark p-4 text-sm focus:border-white focus:outline-none transition-all placeholder:text-border-dark" 
                          placeholder="FULL LEGAL IDENTIFIER"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-[#4a4a4a]">Jurisdiction</label>
                          <select 
                            value={state.compliance.jurisdiction}
                            onChange={(e) => setState(prev => ({ ...prev, compliance: { ...prev.compliance, jurisdiction: e.target.value } }))}
                            className="w-full bg-background-dark border border-border-dark p-4 text-sm focus:border-white focus:outline-none appearance-none"
                          >
                            <option value="">SELECT REGION</option>
                            <option value="US">US - NORTH AMERICA</option>
                            <option value="UK">UK - EUROPE</option>
                            <option value="SG">SG - ASIA PACIFIC</option>
                            <option value="CH">CH - OFFSHORE</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-[#4a4a4a]">Entity Type</label>
                          <select 
                            value={state.compliance.entityType}
                            onChange={(e) => setState(prev => ({ ...prev, compliance: { ...prev.compliance, entityType: e.target.value } }))}
                            className="w-full bg-background-dark border border-border-dark p-4 text-sm focus:border-white focus:outline-none appearance-none"
                          >
                            <option value="individual">INDIVIDUAL</option>
                            <option value="corporation">CORPORATION</option>
                            <option value="fund">INSTITUTIONAL FUND</option>
                            <option value="trust">TRUST / SPV</option>
                          </select>
                        </div>
                      </div>

                      {state.selectedRoles.includes('LENDER') && (
                        <div className="p-6 border border-border-dark bg-white/5 space-y-4">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-white text-sm">verified_user</span>
                            <span className="text-[10px] uppercase tracking-widest text-white">Accreditation Declaration</span>
                          </div>
                          <p className="text-[11px] text-[#888] leading-relaxed">
                            Lenders must verify "Qualified Investor" or "Accredited" status 
                            to access the credit marketplace. By checking this box, you confirm 
                            regulatory compliance.
                          </p>
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <div 
                              onClick={() => setState(prev => ({ ...prev, compliance: { ...prev.compliance, accreditationConfirmed: !prev.compliance.accreditationConfirmed } }))}
                              className={`size-4 border transition-all flex items-center justify-center ${
                                state.compliance.accreditationConfirmed ? 'border-white bg-white text-black' : 'border-[#4a4a4a] group-hover:border-white'
                              }`}
                            >
                              {state.compliance.accreditationConfirmed && <span className="material-symbols-outlined text-[10px] font-bold">check</span>}
                            </div>
                            <span className="text-[10px] uppercase text-[#888] group-hover:text-white transition-colors">Confirm Status</span>
                          </label>
                        </div>
                      )}

                      <div className="pt-6 border-t border-border-dark">
                        <div className="flex items-start gap-4 p-4 bg-white/5 border border-border-dark">
                          <svg className="size-5 text-white mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase text-white font-bold block">Document Uplink Required</span>
                            <p className="text-[9px] text-[#4a4a4a] leading-relaxed">
                              Quantara Protocol uses zero-knowledge verification for ID documents. 
                              Submit Government ID and Address Verification next.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ═══ FINANCIAL STRUCTURING ═══ */}
                {state.currentPhase === 'FINANCIAL_STRUCTURING' && (
                  <div className="space-y-12">
                    <div className="space-y-4">
                      <h1 className="text-2xl font-light uppercase tracking-tighter">Financial Profile Structuring</h1>
                      <p className="text-[#888] text-sm leading-relaxed max-w-lg">
                        Establishing structural constraints for role execution. Inputs are mapped 
                        to real-time risk modeling vectors.
                      </p>
                    </div>

                    <div className="space-y-10">
                      {state.selectedRoles.includes('BORROWER') && (
                        <div className="space-y-6">
                          <span className="text-[10px] uppercase tracking-[0.3em] text-white">Borrower Financial Profile</span>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-[#4a4a4a]">Annual Income Volume</label>
                                <input 
                                  value={state.financial.annualVolume}
                                  onChange={(e) => setState(prev => ({ ...prev, financial: { ...prev.financial, annualVolume: e.target.value } }))}
                                  className="w-full bg-background-dark border border-border-dark p-4 text-sm focus:border-white focus:outline-none placeholder:text-border-dark"
                                  placeholder="E.G. $1.2M"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-[#4a4a4a]">Primary Income Stream</label>
                                <select className="w-full bg-background-dark border border-border-dark p-4 text-sm focus:border-white focus:outline-none appearance-none">
                                  <option>SUBSCRIPTION / SAAS</option>
                                  <option>DIRECT SALES / COMMERCE</option>
                                  <option>PAYROLL / SALARY</option>
                                  <option>AD REVENUE</option>
                                </select>
                              </div>
                            </div>
                            <div className="p-6 border border-border-dark bg-black space-y-4">
                              <label className="text-[10px] uppercase tracking-widest text-white block">Verification Layer</label>
                              <p className="text-[11px] text-[#888] mb-4">
                                Quantara requires direct programmatic access to income sources for 
                                real-time securitization.
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button className="border border-border-dark py-3 text-[10px] uppercase hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2">
                                  <span className="material-symbols-outlined text-sm">link</span>
                                  Link Banking API
                                </button>
                                <button className="border border-border-dark py-3 text-[10px] uppercase hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2">
                                  <span className="material-symbols-outlined text-sm">upload_file</span>
                                  Upload Tax Returns
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {state.selectedRoles.includes('LENDER') && (
                        <div className="space-y-6">
                          <span className="text-[10px] uppercase tracking-[0.3em] text-white">Capital Allocation Params</span>
                          <div className="space-y-8">
                            <div className="space-y-4">
                              <div className="flex justify-between items-baseline">
                                <label className="text-[10px] uppercase tracking-widest text-[#4a4a4a]">Target Risk Weight (%)</label>
                                <span className="text-lg font-bold">RW / {state.financial.riskTolerance}</span>
                              </div>
                              <input 
                                type="range" 
                                min="0" max="100" 
                                value={state.financial.riskTolerance}
                                onChange={(e) => setState(prev => ({ ...prev, financial: { ...prev.financial, riskTolerance: parseInt(e.target.value) } }))}
                                className="w-full accent-white appearance-none h-px bg-border-dark cursor-pointer"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-[#4a4a4a]">Deployment Limit</label>
                                <input 
                                  value={state.financial.deploymentLimit}
                                  onChange={(e) => setState(prev => ({ ...prev, financial: { ...prev.financial, deploymentLimit: e.target.value } }))}
                                  className="w-full bg-background-dark border border-border-dark p-4 text-sm focus:border-white focus:outline-none placeholder:text-border-dark"
                                  placeholder="E.G. $5M"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-[#4a4a4a]">Target Yield (%)</label>
                                <input 
                                  className="w-full bg-background-dark border border-border-dark p-4 text-sm focus:border-white focus:outline-none"
                                  placeholder="E.G. 8.5%"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ═══ RISK CALIBRATION ═══ */}
                {state.currentPhase === 'RISK_CALIBRATION' && (
                  <div className="space-y-12">
                    <div className="space-y-4">
                      <h1 className="text-2xl font-light uppercase tracking-tighter">System Risk Calibration</h1>
                      <p className="text-[#888] text-sm leading-relaxed max-w-lg">
                        Calibrating response thresholds for the Quantara engine. This ensures 
                        consistency between operational intent and system execution.
                      </p>
                    </div>

                    <div className="space-y-6">
                       <div className="p-8 border border-border-dark bg-white/5 relative overflow-hidden backdrop-blur-sm">
                         <div className="absolute top-0 right-0 p-4 opacity-5">
                           <span className="material-symbols-outlined text-[80px] text-white">analytics</span>
                         </div>
                         <span className="text-[10px] uppercase tracking-[0.3em] text-[#888] block mb-6">Interactive Stress Simulation</span>
                         <div className="space-y-6 relative z-10">
                           <p className="text-sm text-white leading-relaxed font-light">
                             "SCENARIO: Macro volatility event causes 20% systemic income reduction. 
                             Liquidity buffer thresholds reached. Engine requires response policy."
                           </p>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                             <button className="border border-white py-4 text-[10px] uppercase bg-white text-black font-bold hover:bg-[#888] transition-all">Harden Buffers</button>
                             <button className="border border-border-dark py-4 text-[10px] uppercase hover:border-white transition-all text-white">Aggressive Deploy</button>
                           </div>
                         </div>
                       </div>

                       <div className="grid grid-cols-3 gap-4 h-32">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="border border-[#1a1a1a] flex flex-col items-center justify-center p-4 relative bg-background-dark group">
                            <div className="h-full w-px bg-border-dark absolute left-1/2 -ml-px group-hover:bg-white transition-colors" />
                            <div className={`size-3 border border-white absolute transition-all ${i === 1 ? 'top-[20%]' : i === 2 ? 'top-[60%]' : 'top-[10%]'}`} />
                            <span className="text-[8px] text-[#4a4a4a] mt-auto uppercase tracking-widest">Vector_{i}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ═══ PERMISSIONS ═══ */}
                {state.currentPhase === 'PERMISSIONS' && (
                  <div className="space-y-12">
                    <div className="space-y-4">
                      <h1 className="text-2xl font-light uppercase tracking-tighter">System Permissions</h1>
                      <p className="text-[#888] text-sm leading-relaxed max-w-lg">
                        Identity verification processed. Protocol intent confirmed. Initializing 
                        operational access keys and dashboard route maps.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {[
                        { scope: 'READ_ACCESS', status: 'AUTHORIZED', desc: 'Symmetric data visibility', icon: 'visibility' },
                        { scope: 'CONTRACT_INIT', status: 'AUTHORIZED', desc: 'Securitization execution rights', icon: 'account_tree' },
                        { scope: 'LEDGER_WRITE', status: 'AUTHORIZED', desc: 'Signature authority assigned', icon: 'draw' },
                        { scope: 'RISK_READ', status: 'AUTHORIZED', desc: 'Real-time telemetry access', icon: 'sensors' },
                      ].map(perm => (
                        <div key={perm.scope} className="flex items-center justify-between p-4 border border-border-dark bg-black/40 group hover:border-white/40 transition-all">
                          <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-[#4a4a4a] text-lg group-hover:text-white transition-colors">{perm.icon}</span>
                            <div>
                              <span className="text-xs font-bold block">{perm.scope}</span>
                              <span className="text-[9px] text-[#4a4a4a] uppercase tracking-widest mt-1 block">{perm.desc}</span>
                            </div>
                          </div>
                          <span className="text-[9px] text-white border border-white/20 px-2 py-1 uppercase tracking-tighter group-hover:border-white transition-all">
                            {perm.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ═══ ACTIVATION ═══ */}
                {state.currentPhase === 'ACTIVATION' && (
                  <div className="space-y-12">
                    <div className="text-center space-y-6">
                      <div className="size-20 bg-white mx-auto flex items-center justify-center rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                        <span className="material-symbols-outlined text-black text-4xl">check_circle</span>
                      </div>
                      <div className="space-y-2">
                        <h1 className="text-3xl font-light uppercase tracking-tighter">Operational Activation</h1>
                        <p className="text-[#888] text-[10px] uppercase tracking-[0.4em]">Provisioning Complete // Session Valid</p>
                      </div>
                    </div>

                    <div className="bg-[#0c0c0c] border border-border-dark p-8 space-y-8">
                      <div className="space-y-4">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-white block">Next Actions</span>
                        <div className="space-y-2">
                          {state.selectedRoles.includes('BORROWER') && (
                            <Link href="/borrower" className="w-full p-4 border border-border-dark flex items-center justify-between group hover:border-white transition-all bg-white/5">
                              <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-sm">payments</span>
                                <span className="text-xs uppercase font-bold tracking-widest">Access Borrower Dashboard</span>
                              </div>
                              <svg className="size-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </Link>
                          )}
                          {state.selectedRoles.includes('LENDER') && (
                            <Link href="/terminal" className="w-full p-4 border border-border-dark flex items-center justify-between group hover:border-white transition-all bg-white/5">
                              <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-sm">account_balance</span>
                                <span className="text-xs uppercase font-bold tracking-widest">Launch Capital Terminal</span>
                              </div>
                              <svg className="size-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </Link>
                          )}
                        </div>
                      </div>

                      <div className="pt-8 border-t border-border-dark flex justify-between items-center text-[10px] text-[#4a4a4a] uppercase">
                        <div className="flex gap-4">
                          <span>Session: VALID</span>
                          <span>Uptime: 00:04:12</span>
                        </div>
                        <span>ID: {Math.random().toString(16).slice(2, 10).toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <footer className="border-t border-border-dark p-4 sm:p-8 flex items-center justify-between bg-background-dark/80 backdrop-blur-sm sticky bottom-0">
            <button 
              onClick={prevPhase}
              disabled={state.currentPhase === 'INITIALIZATION'}
              className={`text-[10px] uppercase font-bold tracking-widest px-8 py-3 border transition-all ${
                state.currentPhase === 'INITIALIZATION' 
                ? 'border-border-dark text-border-dark cursor-not-allowed' 
                : 'border-border-dark text-text-light hover:border-white hover:text-white'
              }`}
            >
              / Back
            </button>
            
            <div className="hidden md:flex gap-2">
              {PHASES.map((p, i) => (
                <div key={p.id} className={`size-1.5 rounded-full ${p.id === state.currentPhase ? 'bg-white' : 'bg-border-dark'}`} />
              ))}
            </div>

            {state.currentPhase !== 'ACTIVATION' && (
              <button 
                onClick={nextPhase}
                disabled={!canContinue()}
                className={`text-[10px] uppercase font-bold tracking-widest px-8 py-3 transition-all flex items-center gap-2 ${
                  !canContinue()
                  ? 'bg-border-dark text-[#4a4a4a] cursor-not-allowed'
                  : 'bg-white text-black hover:bg-[#888]'
                }`}
              >
                <span>Continue</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            )}
            {state.currentPhase === 'ACTIVATION' && (
               <div className="text-[10px] uppercase text-[#4a4a4a] tracking-widest">System Ready</div>
            )}
          </footer>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .italics { font-style: italic; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #262626; }
        ::-webkit-scrollbar-thumb:hover { background: #4a4a4a; }
      `}} />
    </div>
  );
}
