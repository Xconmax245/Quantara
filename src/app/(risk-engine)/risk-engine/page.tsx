'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { calculateRiskScore, calculateProbabilityOfDefault, calculateConfidenceBand, scoreToTier, tierToLabel } from '@/lib/risk-math';

const containerAnim = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemAnim = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
} as const;

export default function RiskEnginePage() {
  const [inputs, setInputs] = useState({
    incomeStability: 78,
    repaymentHistory: 85,
    sectorCoefficient: 1.1,
    liquidityBuffer: 62,
  });

  const riskScore = useMemo(() => calculateRiskScore(inputs), [inputs]);
  const pod = useMemo(() => calculateProbabilityOfDefault(riskScore), [riskScore]);
  const band = useMemo(() => calculateConfidenceBand(riskScore), [riskScore]);
  const tier = useMemo(() => scoreToTier(riskScore), [riskScore]);
  const tierLabel = useMemo(() => tierToLabel(tier), [tier]);

  const handleSliderChange = (key: keyof typeof inputs, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  // Simulate historical risk scores
  const historyData = [62, 65, 68, 70, 72, 71, 74, 76, 75, 78, riskScore];

  return (
    <div className="min-h-screen bg-background-dark text-white">
      {/* Header */}
      <header className="border-b border-[#333] bg-background-dark/80 backdrop-blur-sm px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-white flex items-center justify-center text-black font-bold text-lg font-mono">Q</div>
            <h1 className="text-white text-sm font-bold tracking-wider uppercase">Quantara</h1>
          </Link>
          <div className="h-6 w-px bg-[#333]" />
          <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[#888]">shield</span>
            Risk Engine
          </h2>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <Link href="/borrower" className="text-xs font-mono text-[#888] hover:text-white border border-[#333] px-3 py-1.5 uppercase transition-colors">Borrower</Link>
          <Link href="/terminal" className="text-xs font-mono text-[#888] hover:text-white border border-[#333] px-3 py-1.5 uppercase transition-colors">Terminal</Link>
          <Link href="/operator" className="text-xs font-mono text-[#888] hover:text-white border border-[#333] px-3 py-1.5 uppercase transition-colors">Operator</Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <motion.div
          className="space-y-8"
          initial="hidden"
          animate="visible"
          variants={containerAnim}
        >
          {/* Risk Score Output */}
          <motion.div variants={itemAnim} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Score */}
            <div className="lg:col-span-1 bg-surface-dark border border-[#333] p-8 flex flex-col items-center justify-center">
              <span className="text-xs font-mono text-[#888] uppercase tracking-widest mb-4">Risk Score</span>
              <div className="relative size-48">
                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#333"
                    strokeDasharray="100, 100"
                    strokeWidth="2.5"
                  />
                  <motion.path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    key={riskScore}
                    initial={{ strokeDasharray: "0, 100" }}
                    animate={{ strokeDasharray: `${riskScore}, 100` }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] as const }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span
                    key={riskScore}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-5xl font-mono font-bold text-white"
                  >
                    {riskScore}
                  </motion.span>
                  <span className="text-xs text-[#888] font-mono mt-1">/ 100</span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <span className="text-lg font-bold text-white">{tier}</span>
                <p className="text-xs text-[#888] font-mono">{tierLabel}</p>
              </div>
            </div>

            {/* Output Metrics */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface-dark border border-[#333] p-6">
                <span className="text-xs font-mono text-[#888] uppercase tracking-widest">Probability of Default</span>
                <div className="mt-4">
                  <motion.span
                    key={pod}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-3xl font-mono font-bold text-white"
                  >
                    {(pod * 100).toFixed(2)}%
                  </motion.span>
                </div>
                <div className="mt-4 h-1 bg-[#333]">
                  <motion.div
                    className="h-full bg-white"
                    key={pod}
                    initial={{ width: 0 }}
                    animate={{ width: `${pod * 100 * 10}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>

              <div className="bg-surface-dark border border-[#333] p-6">
                <span className="text-xs font-mono text-[#888] uppercase tracking-widest">Confidence Band</span>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-3xl font-mono font-bold text-white">{band[0]}</span>
                  <span className="text-lg font-mono text-[#888]">—</span>
                  <span className="text-3xl font-mono font-bold text-white">{band[1]}</span>
                </div>
                <div className="mt-4 h-1 bg-[#333] relative">
                  <motion.div
                    className="h-full bg-white/30 absolute"
                    key={`${band[0]}-${band[1]}`}
                    initial={{ left: 0, width: 0 }}
                    animate={{ left: `${band[0]}%`, width: `${band[1] - band[0]}%` }}
                    transition={{ duration: 1 }}
                  />
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 size-2 bg-white rounded-full"
                    key={`dot-${riskScore}`}
                    initial={{ left: 0 }}
                    animate={{ left: `${riskScore}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>

              <div className="bg-surface-dark border border-[#333] p-6">
                <span className="text-xs font-mono text-[#888] uppercase tracking-widest">Risk Tier</span>
                <div className="mt-4">
                  <span className="text-3xl font-mono font-bold text-white">{tier}</span>
                </div>
                <div className="mt-4 flex gap-1">
                  {['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'D'].map((t) => (
                    <div
                      key={t}
                      className={`flex-1 h-4 border ${
                        t === tier ? 'bg-white border-white' : 'bg-surface-dark border-[#333]'
                      } flex items-center justify-center`}
                    >
                      <span className={`text-[8px] font-mono ${t === tier ? 'text-black' : 'text-[#555]'}`}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Input Sliders */}
          <motion.div variants={itemAnim} className="bg-surface-dark border border-[#333] p-6">
            <div className="flex justify-between items-center mb-6 border-b border-[#333] pb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Risk Inputs</h3>
                <p className="text-xs text-[#888] mt-1 font-mono">Adjust parameters to simulate risk scores</p>
              </div>
              <span className="px-2 py-1 text-[10px] font-mono border border-white text-white">INTERACTIVE</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { key: 'incomeStability' as const, label: 'Income Stability', min: 0, max: 100, step: 1 },
                { key: 'repaymentHistory' as const, label: 'Repayment History', min: 0, max: 100, step: 1 },
                { key: 'sectorCoefficient' as const, label: 'Sector Coefficient', min: 0.5, max: 1.5, step: 0.05 },
                { key: 'liquidityBuffer' as const, label: 'Liquidity Buffer', min: 0, max: 100, step: 1 },
              ].map((slider) => (
                <div key={slider.key}>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-[#888]">{slider.label}</label>
                    <span className="text-sm font-mono text-white">{inputs[slider.key]}</span>
                  </div>
                  <input
                    type="range"
                    min={slider.min}
                    max={slider.max}
                    step={slider.step}
                    value={inputs[slider.key]}
                    onChange={(e) => handleSliderChange(slider.key, parseFloat(e.target.value))}
                    className="w-full h-1 bg-[#333] appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Score History Chart */}
          <motion.div variants={itemAnim} className="bg-surface-dark border border-[#333] p-6">
            <div className="mb-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Score History</h3>
              <p className="text-xs text-[#888] mt-1 font-mono">Last 11 Assessments</p>
            </div>
            <div className="h-48 relative">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-full h-px border-t border-dashed border-[#333]/50" />
                ))}
              </div>
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <motion.path
                  d={`M${historyData.map((v, i) => `${(i / (historyData.length - 1)) * 100},${100 - v}`).join(' L')}`}
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5, duration: 2 }}
                />
                {historyData.map((v, i) => (
                  <motion.circle
                    key={i}
                    cx={(i / (historyData.length - 1)) * 100}
                    cy={100 - v}
                    r="1"
                    fill={i === historyData.length - 1 ? 'white' : '#333'}
                    stroke="white"
                    strokeWidth="0.3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
                  />
                ))}
              </svg>
            </div>
          </motion.div>

          {/* Footer */}
          <div className="border-t border-[#333] pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[10px] text-[#888] font-mono uppercase tracking-wider">
            <div className="flex gap-4">
              <span className="flex items-center gap-1">
                <span className="block size-2 bg-green-500 rounded-full animate-pulse" /> Risk Engine Online
              </span>
              <span>Model: QNT-RISK-V2</span>
            </div>
            <div>© 2024 Quantara Financial Infrastructure</div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
