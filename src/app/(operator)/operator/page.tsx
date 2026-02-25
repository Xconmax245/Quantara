'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useObservabilityStore } from '@/store/useObservabilityStore';

const containerAnim = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemAnim = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
} as const;

export default function OperatorPage() {
  const { metrics, complianceFlags, systemLogs } = useObservabilityStore();
  const [viewMode, setViewMode] = useState<'LIVE' | 'HISTORICAL'>('LIVE');

  // Live ticker text
  const tickerText =
    '[14:02:44] BLOCK #9,231,442 FINALIZED — [14:02:45] VALIDATOR_0X4A SLASHED (WARNING) — [14:02:46] TX_BATCH_421 COMMITTED — [14:02:48] LIQUIDITY POOL REBALANCE INITIATED — [14:02:49] ORACLE UPDATE: BTC/USD 64,231.00 — [14:02:51] NEW CONTRACT DEPLOYED: 0x8f...3a2 — [14:02:52] HIGH VOLATILITY DETECTED IN SECTOR 4 — [14:02:55] SYSTEM HEALTH 99.98%';

  return (
    <div className="bg-background-dark text-white font-sans antialiased min-h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-border-dark px-4 sm:px-6 py-3 bg-surface-dark w-full shrink-0 z-10 overflow-x-auto">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4 text-white">
            <div className="size-6 text-white">
              <span className="material-symbols-outlined text-2xl">hub</span>
            </div>
            <h2 className="text-white text-lg font-bold leading-tight tracking-tight">Quantara Operator</h2>
          </div>
          <nav className="hidden md:flex items-center gap-6 ml-4">
            <Link href="/" className="text-white/60 hover:text-white text-sm font-medium transition-colors">Dashboard</Link>
            <a href="#" className="text-white text-sm font-medium border-b border-white pb-0.5">Compliance</a>
            <a href="#" className="text-white/60 hover:text-white text-sm font-medium transition-colors">Risk Oversight</a>
            <a href="#" className="text-white/60 hover:text-white text-sm font-medium transition-colors">Protocol</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex w-64 items-center bg-background-dark border border-border-dark px-3 h-9 focus-within:border-white/40 transition-colors">
            <span className="material-symbols-outlined text-white/40 text-lg">search</span>
            <input className="w-full bg-transparent border-none text-sm text-white placeholder-white/40 focus:ring-0 px-2 font-mono" placeholder="Search TxID / Block" />
          </div>
          <div className="flex items-center gap-2">
            {['notifications', 'settings'].map((icon) => (
              <button key={icon} className="flex items-center justify-center size-9 bg-background-dark border border-border-dark text-white hover:bg-white hover:text-black transition-colors">
                <span className="material-symbols-outlined text-xl">{icon}</span>
              </button>
            ))}
            <div className="size-9 bg-white/10 flex items-center justify-center text-xs font-bold font-mono">OP</div>
          </div>
        </div>
      </header>

      {/* Devnet Ticker */}
      <div className="w-full bg-black border-b border-border-dark h-8 flex items-center shrink-0">
        <div className="px-4 bg-white text-black text-xs font-bold font-mono h-full flex items-center z-10">DEVNET LIVE</div>
        <div className="ticker-wrap h-8 flex items-center">
          <div className="ticker font-mono text-xs text-white/70">{tickerText}</div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden h-full">
        {/* Left Sidebar */}
        <aside className="hidden lg:flex w-80 flex-col border-r border-border-dark bg-surface-dark overflow-y-auto shrink-0">
          <div className="p-4 border-b border-border-dark">
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-1">Risk Oversight</h3>
            <p className="text-white/40 text-xs">Real-time anomaly detection</p>
          </div>

          {/* Fraud Alerts */}
          <div className="flex flex-col">
            <div className="px-4 py-3 bg-white text-black font-bold text-xs uppercase tracking-widest flex justify-between items-center">
              <span>Fraud Alerts</span>
              <span className="bg-black text-white text-[10px] px-1.5 py-0.5">3 NEW</span>
            </div>
            {complianceFlags.filter(f => f.type === 'fraud_alert' || f.type === 'kyc_issue').map((flag, i) => (
              <motion.div
                key={flag.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
                className="group border-b border-border-dark hover:bg-white/5 cursor-pointer transition-colors p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-[10px] text-white/50">TX-{9923 - i}-{i === 0 ? 'A' : 'B'}</span>
                  <span className={`font-mono text-[10px] font-bold px-1 ${
                    flag.severity === 'critical' ? 'text-white bg-white/20' : 'text-white/60 border border-white/20'
                  }`}>
                    {flag.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-white font-bold text-sm leading-tight mb-1">{flag.title}</p>
                <p className="text-white/60 text-xs">{flag.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Volatility Flags */}
          <div className="flex flex-col mt-4">
            <div className="px-4 py-3 border-y border-border-dark text-white/80 font-bold text-xs uppercase tracking-widest flex justify-between items-center">
              <span>Volatility Flags</span>
            </div>
            <div className="p-4 border-b border-border-dark bg-white/5">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-white text-sm">trending_up</span>
                <span className="text-white font-bold text-sm">Asset Class B</span>
              </div>
              <div className="h-1 w-full bg-white/10 rounded overflow-hidden mb-2">
                <motion.div
                  className="h-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  transition={{ delay: 0.5, duration: 1 }}
                />
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-white">STD DEV: 4.2</span>
                <span className="text-white font-bold">+12%</span>
              </div>
            </div>
            <div className="p-4 border-b border-border-dark">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-white/60 text-sm">trending_down</span>
                <span className="text-white/80 font-medium text-sm">Liquidity Pool 4</span>
              </div>
              <div className="h-1 w-full bg-white/10 rounded overflow-hidden mb-2">
                <motion.div
                  className="h-full bg-white/40"
                  initial={{ width: 0 }}
                  animate={{ width: '45%' }}
                  transition={{ delay: 0.7, duration: 1 }}
                />
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-white/60">STD DEV: 1.1</span>
                <span className="text-white/60">-2%</span>
              </div>
            </div>
          </div>

          <div className="mt-auto p-4 border-t border-border-dark">
            <button className="w-full py-2 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-white/90 transition-colors">
              Generate Audit Report
            </button>
          </div>
        </aside>

        {/* Center Stage */}
        <section className="flex-1 flex flex-col bg-background-dark min-w-0 overflow-y-auto">
          {/* Key Metrics */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border-dark border-b border-border-dark"
            initial="hidden"
            animate="visible"
            variants={containerAnim}
          >
            {[
              { label: 'TOTAL TRANSACTION VOL', value: '$4.2B', badge: '24H' },
              { label: 'ACTIVE OPERATORS', value: '142', pulse: true },
              { label: 'PENDING AUDITS', value: '12', badge: 'NON-CRITICAL' },
              { label: 'SYSTEM HEALTH', value: `${metrics.systemHealth}%` },
            ].map((m) => (
              <motion.div key={m.label} variants={itemAnim} className="bg-surface-dark p-6">
                <p className="text-white/40 text-xs font-mono mb-1">{m.label}</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-white text-2xl font-bold tracking-tight">{m.value}</h2>
                  {m.badge && <span className="text-white text-xs bg-white/10 px-1 py-0.5 font-mono">{m.badge}</span>}
                  {m.pulse && <span className="size-2 rounded-full bg-white animate-pulse" />}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Visualization Area */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-white text-xl font-bold tracking-tight"
              >
                Capital Orchestration Flow
              </motion.h2>
              <div className="flex gap-2">
                {(['LIVE', 'HISTORICAL'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1 text-xs font-bold ${
                      viewMode === mode
                        ? 'bg-white text-black'
                        : 'bg-transparent text-white border border-white/20 hover:bg-white/5'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Sankey Diagram */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="w-full h-[300px] sm:h-[400px] bg-surface-dark border border-border-dark relative overflow-hidden flex items-center justify-center"
            >
              <div className="absolute inset-0 opacity-10 grid-pattern" />
              <div className="absolute inset-0 flex p-4 sm:p-8">
                {/* Source Nodes */}
                <div className="flex flex-col justify-around h-full w-24 sm:w-32 z-10">
                  {[
                    { label: 'INSTITUTIONAL INFLOW', value: '$2.1B' },
                    { label: 'RETAIL INFLOW', value: '$0.8B' },
                    { label: 'DEFI BRIDGES', value: '$1.3B' },
                  ].map((node, i) => (
                    <motion.div
                      key={node.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.15, duration: 0.5 }}
                      className="bg-white/10 border border-white/20 p-2 sm:p-3 text-[10px] sm:text-xs text-white font-mono"
                    >
                      {node.label}<br />
                      <span className="text-white font-bold text-sm">{node.value}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Flow SVG */}
                <div className="flex-1 relative mx-4">
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="grad1" x1="0%" x2="100%" y1="0%" y2="0%">
                        <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.1)', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0.05)', stopOpacity: 1 }} />
                      </linearGradient>
                    </defs>
                    <path d="M0,60 C150,60 150,150 300,150" fill="none" stroke="url(#grad1)" strokeWidth="40" />
                    <path d="M0,200 C150,200 150,150 300,150" fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="20" />
                    <path d="M0,340 C150,340 150,280 300,280" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="30" />
                    <path d="M420,150 C550,150 550,100 700,100" fill="none" stroke="white" strokeOpacity="0.15" strokeWidth="30" />
                    <path d="M420,150 C550,150 550,250 700,250" fill="none" stroke="white" strokeOpacity="0.08" strokeWidth="20" />
                    <path d="M420,280 C550,280 550,250 700,250" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="15" />
                  </svg>
                </div>

                {/* Processing Nodes */}
                <div className="flex flex-col justify-around h-full w-24 sm:w-32 z-10">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="bg-background-dark border border-white/40 p-3 text-xs text-white font-mono shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                  >
                    CORE ENGINE<br /><span className="text-white font-bold text-sm">98% LOAD</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    className="bg-background-dark border border-white/10 p-3 text-xs text-white/60 font-mono"
                  >
                    SETTLEMENT<br /><span className="text-white font-bold text-sm">IDLE</span>
                  </motion.div>
                </div>

                <div className="flex-1 relative mx-4" />

                {/* Destination Nodes */}
                <div className="flex flex-col justify-around h-full w-24 sm:w-32 z-10">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4, duration: 0.5 }}
                    className="bg-white text-black p-3 text-xs font-bold font-mono"
                  >
                    YIELD GEN A<br /><span className="text-black text-sm">12.4% APY</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.6, duration: 0.5 }}
                    className="bg-white/5 border border-white/10 p-3 text-xs text-white/50 font-mono"
                  >
                    YIELD GEN B<br /><span className="text-white text-sm">4.1% APY</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Bottom Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Protocol Observability */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="border border-border-dark bg-surface-dark p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold">Protocol Observability</h3>
                  <span className="material-symbols-outlined text-white/40">visibility</span>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Block Finality Time', value: `${metrics.blockFinalityTime}s` },
                    { label: 'Active Validators', value: `${metrics.activeValidators}/${metrics.totalValidators}` },
                    { label: 'Gas Price (Gwei)', value: `${metrics.gasPrice}` },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-center text-sm border-b border-border-dark pb-2">
                      <span className="text-white/60">{row.label}</span>
                      <span className="text-white font-mono">{row.value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center text-sm pb-1">
                    <span className="text-white/60">Network Load</span>
                    <div className="w-32 h-2 bg-white/10 rounded overflow-hidden">
                      <motion.div
                        className="h-full bg-white"
                        initial={{ width: 0 }}
                        animate={{ width: `${metrics.networkLoad}%` }}
                        transition={{ delay: 1, duration: 1 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* System Logs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="border border-border-dark bg-surface-dark p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold">System Logs</h3>
                  <button className="text-xs text-white underline">View All</button>
                </div>
                <div className="font-mono text-xs space-y-2 text-white/70">
                  {systemLogs.map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + i * 0.1, duration: 0.3 }}
                      className="flex gap-3"
                    >
                      <span className="text-white/30">{log.time}</span>
                      <span className={log.highlight ? 'text-white' : ''}>{log.message}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
