'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTerminalStore } from '@/store/useTerminalStore';

const containerAnim = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemAnim = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
} as const;

const rowAnim = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.35 },
  }),
};

export default function TerminalPage() {
  const contracts = useTerminalStore((s) => s.contracts);
  const [time, setTime] = useState('--:--:--.---');
  const [latency, setLatency] = useState(0);
  const [activeView, setActiveView] = useState<'marketplace' | 'portfolio'>('marketplace');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(
        `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`
      );
      setLatency(+(Math.random() * 2 + 0.5).toFixed(1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Derived metrics
  const totalDeployed = contracts.filter(c => c.status === 'ACTIVE' || c.status === 'FUNDED').reduce((a, c) => a + c.principal, 0);
  const avgYield = (contracts.reduce((a, c) => a + parseFloat(c.yield), 0) / contracts.length).toFixed(1);
  const defaultExposure = ((contracts.filter(c => c.riskScore < 60).length / contracts.length) * 100).toFixed(1);
  const avgCoverage = (contracts.reduce((a, c) => a + parseFloat(c.coverage), 0) / contracts.length).toFixed(1);

  // Allocation distribution
  const seniorCount = contracts.filter(c => c.tranche === 'Senior').length;
  const mezzCount = contracts.filter(c => c.tranche === 'Mezzanine').length;
  const juniorCount = contracts.filter(c => c.tranche === 'Junior').length;
  const total = contracts.length;

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[#333] bg-surface-dark px-4 sm:px-6 py-3 sticky top-0 z-50 gap-4 overflow-x-auto">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 text-white">
            <div className="size-6 bg-white text-black flex items-center justify-center">
              <span className="font-bold text-xs font-mono">Q</span>
            </div>
            <span className="font-bold text-sm tracking-wider uppercase whitespace-nowrap">Capital Terminal</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {['Connection', 'Assessment', 'Allocation', 'Risk', 'Settlement'].map((item) => (
              <span key={item} className="text-xs text-[#888] hover:text-white transition-colors cursor-pointer font-medium whitespace-nowrap">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center border border-[#333] bg-black h-8 px-2 w-64">
            <span className="material-symbols-outlined text-[#888] text-[16px]!">search</span>
            <input
              className="w-full bg-transparent border-none text-xs text-white placeholder-zinc-600 focus:ring-0 font-mono px-2"
              placeholder="SEARCH CONTRACT OR SECTOR"
            />
          </div>
          <div className="flex gap-1">
            {['notifications', 'settings'].map((icon) => (
              <button key={icon} className="size-8 flex items-center justify-center hover:bg-[#333] text-white transition-colors">
                <span className="material-symbols-outlined text-[18px]!">{icon}</span>
              </button>
            ))}
            <Link href="/" className="size-8 flex items-center justify-center hover:bg-[#333] text-white transition-colors">
              <span className="material-symbols-outlined text-[18px]!">home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 sm:p-6 flex flex-col gap-6">
        {/* KPI Strip */}
        <motion.section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          initial="hidden"
          animate="visible"
          variants={containerAnim}
        >
          {[
            { label: 'Total Deployed Capital', value: `$${(totalDeployed / 1000).toFixed(0)}K`, change: '+3.2%', bar: 72 },
            { label: 'Weighted Yield', value: `${avgYield}%`, change: '+0.4%', bar: parseFloat(avgYield) * 5 },
            { label: 'Default Exposure', value: `${defaultExposure}%`, change: '-1.1%', bar: parseFloat(defaultExposure) * 5 },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              variants={itemAnim}
              className="group bg-surface-dark border border-[#333] p-4 hover:border-white transition-colors cursor-default relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white text-[14px]!">arrow_outward</span>
              </div>
              <p className="text-[#888] text-xs font-mono uppercase tracking-wider mb-2">{card.label}</p>
              <div className="flex items-baseline gap-3">
                <p className="text-white text-2xl font-mono font-medium tracking-tight">{card.value}</p>
                <span className="text-xs font-mono border border-white px-1 py-0.5 text-white">{card.change}</span>
              </div>
              <div className="mt-3 h-1 w-full bg-[#333]">
                <motion.div
                  className="h-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${card.bar}%` }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 1, ease: [0.22, 1, 0.36, 1] as const }}
                />
              </div>
            </motion.div>
          ))}

          {/* Insurance Coverage Card */}
          <motion.div
            variants={itemAnim}
            className="group bg-surface-dark border-2 border-white p-4 relative"
          >
            <div className="absolute top-0 right-0 p-2">
              <span className="material-symbols-outlined text-white text-[16px]!">shield</span>
            </div>
            <p className="text-white text-xs font-mono uppercase tracking-wider mb-2">Insurance Coverage</p>
            <div className="flex items-baseline gap-3">
              <p className="text-white text-2xl font-mono font-medium tracking-tight">{avgCoverage}x</p>
              <span className="text-xs font-mono border border-white bg-white text-black px-1 py-0.5">PROTECTED</span>
            </div>
            <div className="mt-3 h-1 w-full bg-[#333] flex">
              <motion.div
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${parseFloat(avgCoverage) * 40}%` }}
                transition={{ delay: 0.8, duration: 1, ease: [0.22, 1, 0.36, 1] as const }}
              />
            </div>
          </motion.div>
        </motion.section>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
          {/* Contract Marketplace */}
          <motion.section
            className="xl:col-span-2 flex flex-col bg-surface-dark border border-[#333] min-h-[500px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="p-4 border-b border-[#333] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-4">
                <h3 className="text-white text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]!">description</span>
                  Structured Contract Marketplace
                </h3>
                <div className="flex gap-1">
                  {(['marketplace', 'portfolio'] as const).map((view) => (
                    <button
                      key={view}
                      onClick={() => setActiveView(view)}
                      className={`text-[10px] font-mono uppercase px-2 py-1 border transition-colors ${
                        activeView === view
                          ? 'bg-white text-black border-white font-bold'
                          : 'border-[#333] text-[#888] hover:text-white'
                      }`}
                    >
                      {view}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="text-xs font-mono text-[#888] hover:text-white border border-[#333] px-2 py-1 uppercase">Filter</button>
                <button className="text-xs font-mono text-[#888] hover:text-white border border-[#333] px-2 py-1 uppercase">Export</button>
              </div>
            </div>
            <div className="overflow-x-auto grow">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-[#333] bg-black">
                    {['Contract', 'Sector', 'Tier', 'Tranche', 'Principal', 'Yield', 'Term', 'Coverage', 'Risk Score', 'Status'].map((h) => (
                      <th
                        key={h}
                        className={`p-3 text-xs font-mono text-[#888] uppercase tracking-wider font-normal ${
                          ['Principal', 'Yield', 'Term', 'Coverage', 'Risk Score'].includes(h) ? 'text-right' : ''
                        } ${h === 'Status' ? 'text-center' : ''}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#333]">
                  {contracts.map((c, i) => (
                    <motion.tr
                      key={c.id}
                      custom={i}
                      variants={rowAnim}
                      initial="hidden"
                      animate="visible"
                      className="hover:bg-[#333]/30 group cursor-pointer transition-colors"
                    >
                      <td className="p-3 text-sm font-mono text-white font-bold">{c.id}</td>
                      <td className="p-3 text-sm font-mono text-zinc-400">{c.sector}</td>
                      <td className="p-3">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-mono font-bold border ${
                          c.tier === 'AAA' || c.tier === 'AA'
                            ? 'border-white text-white'
                            : c.tier === 'A' || c.tier === 'BBB'
                            ? 'border-zinc-500 text-zinc-300'
                            : 'border-zinc-700 text-zinc-500'
                        }`}>
                          {c.tier}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`text-xs font-mono ${
                          c.tranche === 'Senior' ? 'text-white font-bold' :
                          c.tranche === 'Mezzanine' ? 'text-zinc-300' : 'text-zinc-500'
                        }`}>
                          {c.tranche}
                        </span>
                      </td>
                      <td className="p-3 text-sm font-mono text-white text-right">${c.principal.toLocaleString()}</td>
                      <td className="p-3 text-sm font-mono text-white text-right font-bold">{c.yield}</td>
                      <td className="p-3 text-sm font-mono text-zinc-400 text-right">{c.term}</td>
                      <td className="p-3 text-sm font-mono text-zinc-400 text-right">{c.coverage}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2 justify-end">
                          <span className="text-xs font-mono text-white">{c.riskScore}</span>
                          <div className="h-1.5 w-16 bg-[#333] relative">
                            <div
                              className={`absolute top-0 left-0 h-full ${
                                c.riskScore >= 80 ? 'bg-white' :
                                c.riskScore >= 60 ? 'bg-zinc-400' :
                                'bg-zinc-600'
                              }`}
                              style={{ width: `${c.riskScore}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-mono font-bold ${
                          c.status === 'OPEN' ? 'border border-white text-white' :
                          c.status === 'ACTIVE' ? 'bg-white text-black' :
                          c.status === 'FUNDED' ? 'bg-white/20 text-white' :
                          'border border-zinc-600 text-zinc-400'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>

          {/* Right Panel */}
          <motion.section
            className="xl:col-span-1 flex flex-col gap-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {/* Allocation Distribution */}
            <div className="bg-surface-dark border border-[#333] p-5 flex flex-col gap-4 relative overflow-hidden">
              <div className="flex justify-between items-start z-10">
                <div>
                  <h3 className="text-white text-sm font-bold uppercase tracking-wider flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-[16px]!">pie_chart</span>
                    Allocation Distribution
                  </h3>
                  <p className="text-xs text-zinc-500 font-mono">By Tranche • {total} Contracts</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Senior', count: seniorCount, pct: ((seniorCount / total) * 100).toFixed(0), desc: 'First-priority, lowest yield' },
                  { label: 'Mezzanine', count: mezzCount, pct: ((mezzCount / total) * 100).toFixed(0), desc: 'Second-priority, balanced' },
                  { label: 'Junior', count: juniorCount, pct: ((juniorCount / total) * 100).toFixed(0), desc: 'First-loss, highest yield' },
                ].map((t, i) => (
                  <div key={t.label} className="border border-[#333] p-3">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-white font-bold text-sm uppercase tracking-wider">{t.label}</span>
                      <span className="text-white font-mono text-sm font-bold">{t.pct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#333] mb-2">
                      <motion.div
                        className={`h-full ${t.label === 'Senior' ? 'bg-white' : t.label === 'Mezzanine' ? 'bg-zinc-400' : 'bg-zinc-600'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${t.pct}%` }}
                        transition={{ delay: 0.8 + i * 0.15, duration: 1 }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                      <span>{t.desc}</span>
                      <span>{t.count} contracts</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sector Breakdown */}
              <div className="border-t border-[#333] pt-4 mt-2">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-3">Sector Exposure</span>
                <div className="space-y-2">
                  {Array.from(new Set(contracts.map(c => c.sector))).map((sector) => {
                    const count = contracts.filter(c => c.sector === sector).length;
                    const pct = ((count / total) * 100).toFixed(0);
                    return (
                      <div key={sector} className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400 font-mono">{sector}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1 bg-[#333]">
                            <div className="h-full bg-white/60" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-white font-mono w-8 text-right">{pct}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Stress Testing */}
            <div className="bg-surface-dark border border-[#333] p-5 flex flex-col gap-4 flex-1">
              <h3 className="text-white text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]!">speed</span>
                Stress Scenarios
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Income Drop 20%', impact: '-$42,300', severity: 'moderate' },
                  { label: 'Sector Downturn', impact: '-$18,500', severity: 'low' },
                  { label: 'Double Default', impact: '-$124,500', severity: 'severe' },
                ].map((scenario) => (
                  <div key={scenario.label} className="flex justify-between items-center border-b border-zinc-800 pb-2">
                    <div>
                      <span className="text-xs text-zinc-400 font-mono">{scenario.label}</span>
                      <div className={`text-[10px] font-mono mt-0.5 ${
                        scenario.severity === 'severe' ? 'text-white font-bold' :
                        scenario.severity === 'moderate' ? 'text-zinc-300' : 'text-zinc-500'
                      }`}>
                        {scenario.severity.toUpperCase()}
                      </div>
                    </div>
                    <span className="text-sm text-white font-mono font-bold">{scenario.impact}</span>
                  </div>
                ))}
              </div>

              {/* Connection Status */}
              <div className="border-t border-[#333] pt-4 mt-auto">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-3">API Connections</span>
                <div className="space-y-2">
                  {[
                    { name: 'Income Verification Oracle', status: 'CONNECTED' },
                    { name: 'Risk Scoring Engine', status: 'CONNECTED' },
                    { name: 'Settlement Layer', status: 'CONNECTED' },
                    { name: 'Insurance Protocol', status: 'STANDBY' },
                  ].map((conn) => (
                    <div key={conn.name} className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-zinc-400">{conn.name}</span>
                      <span className="flex items-center gap-1.5">
                        <span className={`block size-1.5 rounded-full ${conn.status === 'CONNECTED' ? 'bg-white animate-pulse' : 'bg-zinc-600'}`} />
                        <span className={conn.status === 'CONNECTED' ? 'text-white' : 'text-zinc-500'}>{conn.status}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Footer */}
        <footer className="mt-auto border-t border-[#333] pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[10px] text-zinc-500 font-mono uppercase">
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <span className="size-1.5 bg-white rounded-full animate-pulse" />
              Protocol: Mainnet
            </span>
            <span>Latency: {latency}ms</span>
          </div>
          <div className="flex gap-4">
            <span>Last Update: {time} EST</span>
            <span>Session ID: 88A-22B-X99</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
