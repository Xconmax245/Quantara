'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

const containerAnim = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemAnim = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
} as const;

// Simulated borrower data
const incomeStreams = [
  { source: 'Primary Employment — Meridian Corp', type: 'Salary', frequency: 'Bi-Weekly', amount: 8250, verified: true, stability: 97 },
  { source: 'Contract Revenue — DataVault Inc', type: 'Consulting', frequency: 'Monthly', amount: 3200, verified: true, stability: 82 },
  { source: 'Rental Income — Unit 14B', type: 'Property', frequency: 'Monthly', amount: 2100, verified: true, stability: 94 },
];

const monthlyIncome = [11200, 11500, 10800, 13200, 11900, 11400, 12100, 11800, 13550, 11650, 12200, 13550];
const avgIncome = Math.round(monthlyIncome.reduce((a, b) => a + b, 0) / monthlyIncome.length);

const activeContracts = [
  { id: 'QNT-2024-0847', tranche: 'Senior', principal: 45000, rate: '5.8%', term: '18mo', status: 'ACTIVE', repaid: 62, nextPayment: '2024-03-15' },
  { id: 'QNT-2024-1203', tranche: 'Mezzanine', principal: 22000, rate: '9.4%', term: '12mo', status: 'ACTIVE', repaid: 34, nextPayment: '2024-03-01' },
];

const repaymentHistory = [
  { date: '2024-02-15', amount: 2814, contract: 'QNT-2024-0847', status: 'completed' },
  { date: '2024-02-01', amount: 2054, contract: 'QNT-2024-1203', status: 'completed' },
  { date: '2024-01-15', amount: 2814, contract: 'QNT-2024-0847', status: 'completed' },
  { date: '2024-01-01', amount: 2054, contract: 'QNT-2024-1203', status: 'completed' },
  { date: '2023-12-15', amount: 2814, contract: 'QNT-2024-0847', status: 'completed' },
  { date: '2023-12-01', amount: 2054, contract: 'QNT-2024-1203', status: 'completed' },
];

export default function BorrowerPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'income' | 'contracts' | 'repayment'>('overview');

  const riskScore = 74;
  const dtiRatio = 28.4;
  const totalVerifiedIncome = 162600;
  const coverageRatio = 1.85;
  const probabilityOfDefault = 0.42;
  const confidenceBand = [68, 80];
  const tier = 'A';

  return (
    <div className="min-h-screen bg-background-dark text-white flex flex-col lg:flex-row">
      {/* Sidebar — hidden on mobile */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-background-dark border-r border-[#363636] flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-[#363636]">
          <Link href="/" className="flex items-center gap-3">
            <div className="size-7 text-white">
              <svg className="h-full w-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 4L4 24L24 44L44 24L24 4ZM24 10L10 24L24 38L38 24L24 10Z" fill="currentColor" fillRule="evenodd" />
              </svg>
            </div>
            <div>
              <span className="text-white text-sm font-bold tracking-wider uppercase block">Quantara</span>
              <span className="text-[10px] text-slate-500 font-mono">BORROWER v2.4</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 py-4">
          {[
            { icon: 'dashboard', label: 'Overview', tab: 'overview' as const },
            { icon: 'payments', label: 'Income Streams', tab: 'income' as const },
            { icon: 'description', label: 'Active Contracts', tab: 'contracts' as const },
            { icon: 'receipt_long', label: 'Repayment History', tab: 'repayment' as const },
          ].map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`flex items-center gap-3 w-full px-6 py-3 text-sm transition-colors ${
                activeTab === item.tab
                  ? 'bg-white text-black font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#363636]">
          <div className="bg-surface-dark border border-[#363636] p-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-8 bg-white/10 flex items-center justify-center text-xs font-bold font-mono">JD</div>
              <div>
                <p className="text-white text-sm font-bold">J. Doe</p>
                <p className="text-slate-500 text-[10px] font-mono">ID: BRW-884-21</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="block size-1.5 bg-emerald-500 rounded-full" />
              <span className="text-[10px] text-slate-400 font-mono">Verified Borrower</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-background-dark/80 backdrop-blur-sm border-b border-[#363636] px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </Link>
            <h1 className="text-white text-base sm:text-lg font-bold uppercase tracking-tight">Borrower Intelligence</h1>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <Link href="/risk-engine" className="text-xs font-mono text-slate-400 border border-[#363636] px-3 py-1.5 hover:text-white hover:border-white transition-colors uppercase">Risk Engine</Link>
            <Link href="/terminal" className="text-xs font-mono text-slate-400 border border-[#363636] px-3 py-1.5 hover:text-white hover:border-white transition-colors uppercase">Terminal</Link>
          </div>
        </header>

        {/* Mobile Tab Bar — visible on mobile only */}
        <div className="lg:hidden flex overflow-x-auto border-b border-[#363636] bg-background-dark">
          {[
            { icon: 'dashboard', label: 'Overview', tab: 'overview' as const },
            { icon: 'payments', label: 'Income', tab: 'income' as const },
            { icon: 'description', label: 'Contracts', tab: 'contracts' as const },
            { icon: 'receipt_long', label: 'Repayment', tab: 'repayment' as const },
          ].map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`flex items-center gap-2 px-4 py-3 text-xs whitespace-nowrap shrink-0 transition-colors border-b-2 ${
                activeTab === item.tab
                  ? 'border-white text-white font-bold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerAnim}
            className="space-y-8"
          >
            {/* ═══ KPI STRIP ═══ */}
            <motion.div variants={itemAnim} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: 'Risk Score',
                  icon: 'shield',
                  value: riskScore.toString(),
                  change: '+2.1%',
                  positive: true,
                  sub: `Tier ${tier} — Confidence: ${confidenceBand[0]}–${confidenceBand[1]}`,
                },
                {
                  label: 'DTI Ratio',
                  icon: 'pie_chart',
                  value: `${dtiRatio}%`,
                  change: '-0.5%',
                  positive: true,
                  sub: 'Debt-to-Income across all active contracts',
                },
                {
                  label: 'Verified Income',
                  icon: 'payments',
                  value: `$${(totalVerifiedIncome / 1000).toFixed(1)}k`,
                  change: '+5.0%',
                  positive: true,
                  sub: `${incomeStreams.length} verified sources — YTD total`,
                },
                {
                  label: 'Coverage Ratio',
                  icon: 'umbrella',
                  value: `${coverageRatio}x`,
                  change: '+0.05',
                  positive: true,
                  sub: 'Income-to-obligation coverage buffer',
                },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-surface-dark border border-[#363636] p-5 flex flex-col gap-3 group hover:border-white transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">{kpi.label}</span>
                    <span className="material-symbols-outlined text-slate-500 text-lg">{kpi.icon}</span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-mono font-bold text-white">{kpi.value}</span>
                    <span className={`text-xs font-mono flex items-center gap-0.5 ${kpi.positive ? 'text-white' : 'text-slate-400'}`}>
                      <span className="material-symbols-outlined text-sm">{kpi.positive ? 'arrow_upward' : 'arrow_downward'}</span>
                      {kpi.change}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">{kpi.sub}</span>
                </div>
              ))}
            </motion.div>

            {/* ═══ OVERVIEW TAB ═══ */}
            {activeTab === 'overview' && (
              <>
                {/* Income Stability + Cash Flow Confidence */}
                <motion.div variants={itemAnim} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Income Stability Chart */}
                  <div className="bg-surface-dark border border-[#363636] p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-white text-sm font-bold uppercase tracking-wider">Income Stability Analysis</h3>
                        <p className="text-xs text-slate-500 mt-1 font-mono">12-Month Rolling Average</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500 font-mono">AVG ${avgIncome.toLocaleString()}/mo</p>
                        <p className="text-xs text-slate-500 font-mono">VAR 4.2%</p>
                      </div>
                    </div>
                    <div className="h-40 relative">
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="w-full h-px border-t border-dashed border-[#363636]/50" />
                        ))}
                      </div>
                      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <motion.path
                          d={`M${monthlyIncome.map((v, i) => {
                            const x = (i / (monthlyIncome.length - 1)) * 100;
                            const minV = Math.min(...monthlyIncome) - 500;
                            const maxV = Math.max(...monthlyIncome) + 500;
                            const y = 100 - ((v - minV) / (maxV - minV)) * 100;
                            return `${x},${y}`;
                          }).join(' L')}`}
                          fill="none"
                          stroke="white"
                          strokeWidth="0.8"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: 0.5, duration: 2 }}
                        />
                        {monthlyIncome.map((v, i) => {
                          const x = (i / (monthlyIncome.length - 1)) * 100;
                          const minV = Math.min(...monthlyIncome) - 500;
                          const maxV = Math.max(...monthlyIncome) + 500;
                          const y = 100 - ((v - minV) / (maxV - minV)) * 100;
                          return (
                            <motion.circle
                              key={i}
                              cx={x}
                              cy={y}
                              r="1.2"
                              fill={i === monthlyIncome.length - 1 ? 'white' : '#363636'}
                              stroke="white"
                              strokeWidth="0.3"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
                            />
                          );
                        })}
                      </svg>
                      <div className="flex justify-between mt-2 text-[10px] text-slate-600 font-mono">
                        {['JAN', 'MAR', 'MAY', 'JUL', 'SEP', 'NOV'].map((m) => (
                          <span key={m}>{m}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Cash Flow Confidence */}
                  <div className="bg-surface-dark border border-[#363636] p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-white text-sm font-bold uppercase tracking-wider">Cash Flow Confidence</h3>
                        <p className="text-xs text-slate-500 mt-1 font-mono">Statistical Probability</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center py-4">
                      <div className="relative size-36">
                        <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#363636"
                            strokeDasharray="100, 100"
                            strokeWidth="2.5"
                          />
                          <motion.path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="white"
                            strokeWidth="2.5"
                            initial={{ strokeDasharray: "0, 100" }}
                            animate={{ strokeDasharray: "98.2, 100" }}
                            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] as const }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-mono font-bold text-white">98.2%</span>
                          <span className="text-[10px] text-slate-500 font-mono">Confidence</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4b border-t border-[#363636] pt-4">
                      <div>
                        <span className="text-xs text-slate-500 font-mono">Volatility</span>
                        <p className="text-white font-bold text-sm mt-0.5">Low</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 font-mono">Trend</span>
                        <p className="text-white font-bold text-sm mt-0.5">Stable</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Quick Metrics Row */}
                <motion.div variants={itemAnim} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-surface-dark border border-[#363636] p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Deposits Analysis</span>
                      <span className="material-symbols-outlined text-slate-500 text-lg">more_horiz</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm border-b border-[#363636] pb-2">
                        <span className="text-slate-400 font-mono">Frequency</span>
                        <span className="text-white font-bold font-mono">Bi-Weekly</span>
                      </div>
                      <div className="flex justify-between items-center text-sm border-b border-[#363636] pb-2">
                        <span className="text-slate-400 font-mono">Source Var</span>
                        <span className="text-white font-bold font-mono">1.2%</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400 font-mono">Total (YTD)</span>
                        <span className="text-white font-bold font-mono">${totalVerifiedIncome.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface-dark border border-[#363636] p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Expense Ratio</span>
                      <span className="material-symbols-outlined text-slate-500 text-lg">more_horiz</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm border-b border-[#363636] pb-2">
                        <span className="text-slate-400 font-mono">Fixed</span>
                        <span className="text-white font-bold font-mono">$4,200/mo</span>
                      </div>
                      <div className="flex justify-between items-center text-sm border-b border-[#363636] pb-2">
                        <span className="text-slate-400 font-mono">Variable</span>
                        <span className="text-white font-bold font-mono">$1,850/mo</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400 font-mono">Ratio</span>
                        <span className="text-white font-bold font-mono">32%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface-dark border border-[#363636] p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Model Output</span>
                      <span className="material-symbols-outlined text-slate-500 text-lg">more_horiz</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm border-b border-[#363636] pb-2">
                        <span className="text-slate-400 font-mono">Propensity</span>
                        <span className="text-white font-bold font-mono">High</span>
                      </div>
                      <div className="flex justify-between items-center text-sm border-b border-[#363636] pb-2">
                        <span className="text-slate-400 font-mono">Default Prob</span>
                        <span className="text-white font-bold font-mono">{`< ${probabilityOfDefault}%`}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400 font-mono">Limit Rec</span>
                        <span className="text-white font-bold font-mono">$55,000</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}

            {/* ═══ INCOME TAB ═══ */}
            {activeTab === 'income' && (
              <motion.div variants={itemAnim} className="space-y-6">
                <div className="bg-surface-dark border border-[#363636] p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-white text-sm font-bold uppercase tracking-wider">Verified Income Sources</h3>
                      <p className="text-xs text-slate-500 mt-1 font-mono">Multi-oracle verified — {incomeStreams.length} active sources</p>
                    </div>
                    <Link href="/onboarding" className="text-xs font-mono text-slate-400 border border-[#363636] px-3 py-1.5 hover:text-white hover:border-white transition-colors uppercase">
                      + Add Source
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {incomeStreams.map((stream, i) => (
                      <motion.div
                        key={stream.source}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.15, duration: 0.4 }}
                        className="border border-[#363636] p-5 hover:border-white/30 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="text-white font-bold text-sm">{stream.source}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs font-mono text-slate-500">{stream.type}</span>
                              <span className="text-xs font-mono text-slate-600">•</span>
                              <span className="text-xs font-mono text-slate-500">{stream.frequency}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {stream.verified && (
                              <span className="flex items-center gap-1 text-[10px] font-mono text-white bg-white/10 px-2 py-0.5">
                                <span className="material-symbols-outlined text-xs">verified</span>
                                VERIFIED
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                          <div>
                            <span className="text-xs text-slate-500 font-mono">Monthly Amount</span>
                            <p className="text-white font-bold font-mono mt-0.5">${stream.amount.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-xs text-slate-500 font-mono">Stability Index</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <p className="text-white font-bold font-mono">{stream.stability}%</p>
                              <div className="flex-1 h-1.5 bg-[#363636] max-w-24">
                                <motion.div
                                  className="h-full bg-white"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${stream.stability}%` }}
                                  transition={{ delay: 0.5 + i * 0.2, duration: 0.8 }}
                                />
                              </div>
                            </div>
                          </div>
                          <div>
                            <span className="text-xs text-slate-500 font-mono">Annual Projected</span>
                            <p className="text-white font-bold font-mono mt-0.5">${(stream.amount * 12).toLocaleString()}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="border-t border-[#363636] mt-6 pt-4 flex justify-between items-center">
                    <span className="text-xs font-mono text-slate-500">Total Verified Monthly Income</span>
                    <span className="text-white font-bold font-mono text-lg">${incomeStreams.reduce((a, s) => a + s.amount, 0).toLocaleString()}/mo</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══ CONTRACTS TAB ═══ */}
            {activeTab === 'contracts' && (
              <motion.div variants={itemAnim} className="space-y-6">
                <div className="bg-surface-dark border border-[#363636] p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-white text-sm font-bold uppercase tracking-wider">Active Structured Contracts</h3>
                      <p className="text-xs text-slate-500 mt-1 font-mono">{activeContracts.length} contracts in execution</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {activeContracts.map((contract, i) => (
                      <motion.div
                        key={contract.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.15 }}
                        className="border border-[#363636] p-6"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                          <div className="flex items-center gap-4">
                            <span className="font-mono text-xs text-white font-bold">{contract.id}</span>
                            <span className="text-[10px] font-mono border border-[#363636] px-2 py-0.5 text-slate-400">{contract.tranche}</span>
                            <span className="text-[10px] font-mono bg-white text-black px-2 py-0.5 font-bold">{contract.status}</span>
                          </div>
                          <span className="text-xs font-mono text-slate-500">Next: {contract.nextPayment}</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-4">
                          <div>
                            <span className="text-xs text-slate-500 font-mono">Principal</span>
                            <p className="text-white font-bold font-mono mt-0.5">${contract.principal.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-xs text-slate-500 font-mono">Rate</span>
                            <p className="text-white font-bold font-mono mt-0.5">{contract.rate}</p>
                          </div>
                          <div>
                            <span className="text-xs text-slate-500 font-mono">Term</span>
                            <p className="text-white font-bold font-mono mt-0.5">{contract.term}</p>
                          </div>
                          <div>
                            <span className="text-xs text-slate-500 font-mono">Repaid</span>
                            <p className="text-white font-bold font-mono mt-0.5">{contract.repaid}%</p>
                          </div>
                        </div>

                        <div className="h-2 bg-[#363636]">
                          <motion.div
                            className="h-full bg-white"
                            initial={{ width: 0 }}
                            animate={{ width: `${contract.repaid}%` }}
                            transition={{ delay: 0.5 + i * 0.2, duration: 1 }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══ REPAYMENT TAB ═══ */}
            {activeTab === 'repayment' && (
              <motion.div variants={itemAnim} className="space-y-6">
                <div className="bg-surface-dark border border-[#363636] p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-white text-sm font-bold uppercase tracking-wider">Repayment Ledger</h3>
                      <p className="text-xs text-slate-500 mt-1 font-mono">Complete payment history — on-chain verified</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono text-slate-500">On-Time Rate</span>
                      <p className="text-white font-bold font-mono">100%</p>
                    </div>
                  </div>

                  <div className="border border-[#363636] overflow-x-auto">
                    <div className="grid grid-cols-4 bg-black/40 text-xs text-slate-500 font-mono uppercase tracking-wider min-w-[480px]">
                      <div className="p-3">Date</div>
                      <div className="p-3">Contract</div>
                      <div className="p-3 text-right">Amount</div>
                      <div className="p-3 text-right">Status</div>
                    </div>
                    {repaymentHistory.map((entry, i) => (
                      <motion.div
                        key={`${entry.date}-${entry.contract}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="grid grid-cols-4 border-t border-[#363636] hover:bg-white/5 transition-colors min-w-[480px]"
                      >
                        <div className="p-3 text-sm font-mono text-slate-300">{entry.date}</div>
                        <div className="p-3 text-sm font-mono text-white">{entry.contract}</div>
                        <div className="p-3 text-sm font-mono text-white text-right">${entry.amount.toLocaleString()}</div>
                        <div className="p-3 text-right">
                          <span className="text-[10px] font-mono bg-white/10 text-white px-2 py-0.5 uppercase">
                            {entry.status}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="border-t border-[#363636] mt-4 pt-4 flex justify-between items-center">
                    <span className="text-xs font-mono text-slate-500">Total Repaid (Shown)</span>
                    <span className="text-white font-bold font-mono">${repaymentHistory.reduce((a, r) => a + r.amount, 0).toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Footer */}
            <motion.div variants={itemAnim} className="border-t border-[#363636] pt-4 flex justify-between items-center text-[10px] text-slate-600 font-mono uppercase tracking-wider">
              <div className="flex gap-4">
                <span className="flex items-center gap-1">
                  <span className="block size-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  System Online
                </span>
                <span>Latency: 22ms</span>
              </div>
              <span>Data Freshness: Real-time</span>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
