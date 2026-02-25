'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const systemLayers = [
  {
    id: '01',
    title: 'Income Layer',
    node: 'INGEST_V3',
    icon: 'input',
    desc: 'Ingests structured and unstructured income data from ERPs, payment processors, banking APIs, and payroll systems. Normalizes revenue streams into time-series models for downstream consumption.',
    specs: ['API Ingestion Rate: 12,000 tx/s', 'Source Verification: Multi-oracle', 'Data Freshness: < 500ms'],
  },
  {
    id: '02',
    title: 'Risk Intelligence Layer',
    node: 'RISK_CORE',
    icon: 'hub',
    desc: 'Deterministic risk scoring engine that evaluates income stability, repayment history, sector volatility, and liquidity buffer. Produces probability of default, confidence bands, and tier classifications.',
    specs: ['Scoring Model: QNT-RISK-V2', 'Variables: 14 weighted inputs', 'Recalculation: Real-time'],
  },
  {
    id: '03',
    title: 'Structured Contract Layer',
    node: 'CONTRACT_ENGINE',
    icon: 'description',
    desc: 'Transforms risk-scored income profiles into structured capital instruments with deterministic repayment schedules, collateral ratios, and automated state transitions across the contract lifecycle.',
    specs: ['Contract Types: Senior / Mezzanine / Junior', 'State Machine: 7 states', 'Settlement: T+0'],
  },
  {
    id: '04',
    title: 'Capital Pool Layer',
    node: 'LIQUIDITY_V3',
    icon: 'account_balance',
    desc: 'Deep liquidity pools structured for institutional allocators. Automated yield distribution, tranche management, and exposure optimization across diversified income-backed instruments.',
    specs: ['Pool Architecture: Multi-tranche', 'Yield Distribution: Per-block', 'Rebalancing: Algorithmic'],
  },
  {
    id: '05',
    title: 'Insurance Layer',
    node: 'COVERAGE_SYS',
    icon: 'shield',
    desc: 'Default coverage vaults that programmatically underwrite contract risk. Automated claim processing triggered by on-chain default events with deterministic payout calculations.',
    specs: ['Coverage Ratio: 1.2x–2.5x', 'Claim Resolution: < 1 block', 'Reserve Model: Dynamic'],
  },
  {
    id: '06',
    title: 'Observability Layer',
    node: 'OBSERVE_NET',
    icon: 'visibility',
    desc: 'Protocol-wide monitoring infrastructure providing real-time TVL tracking, default rate analytics, yield distribution metrics, liquidity buffer health, and live event feeds across all system layers.',
    specs: ['Event Throughput: 50k/s', 'Metric Granularity: Per-block', 'Alert Latency: < 100ms'],
  },
];

const riskVariables = [
  { name: 'Income Stability', weight: '30%', desc: 'Coefficient of variation across 12-month rolling income data. Lower variance produces higher stability scores.' },
  { name: 'Repayment History', weight: '25%', desc: 'Historical on-time payment ratio weighted by recency. Incorporates payment velocity and consistency metrics.' },
  { name: 'Sector Coefficient', weight: '20%', desc: 'Industry-specific volatility multiplier derived from macroeconomic indicators and sector default correlations.' },
  { name: 'Liquidity Buffer', weight: '15%', desc: 'Ratio of liquid reserves to projected obligations. Measures capacity to absorb income disruptions without default.' },
  { name: 'Collateral Quality', weight: '10%', desc: 'Mark-to-market valuation of pledged assets with haircuts applied based on asset class and liquidity depth.' },
];

const contractStates = [
  { state: 'CREATED', desc: 'Contract terms defined, risk score attached' },
  { state: 'PENDING_REVIEW', desc: 'Awaiting compliance verification' },
  { state: 'APPROVED', desc: 'Risk parameters validated, ready for funding' },
  { state: 'FUNDED', desc: 'Capital allocated from pool to contract' },
  { state: 'ACTIVE', desc: 'Repayment schedule in execution' },
  { state: 'COMPLETED', desc: 'All obligations fulfilled, contract settled' },
  { state: 'DEFAULTED', desc: 'Missed obligations, insurance triggered' },
];

export default function MarketingPage() {
  const [activeLayer, setActiveLayer] = useState(0);
  const [expandedVar, setExpandedVar] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#191919]">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[#363636] px-4 sm:px-6 md:px-10 py-4 bg-[#191919] sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <div className="flex items-center gap-4">
          <div className="size-6 text-white">
            <svg className="h-full w-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_6_543)">
                <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor" />
                <path clipRule="evenodd" d="M7.24189 26.4066C7.31369 26.4411 7.64204 26.5637 8.52504 26.3738C9.59462 26.1438 11.0343 25.5311 12.7183 24.4963C14.7583 23.2426 17.0256 21.4503 19.238 19.238C21.4503 17.0256 23.2426 14.7583 24.4963 12.7183C25.5311 11.0343 26.1438 9.59463 26.3738 8.52504C26.5637 7.64204 26.4411 7.31369 26.4066 7.24189C26.345 7.21246 26.143 7.14535 25.6664 7.1918C24.9745 7.25925 23.9954 7.5498 22.7699 8.14278C20.3369 9.32007 17.3369 11.4915 14.4142 14.4142C11.4915 17.3369 9.32007 20.3369 8.14278 22.7699C7.5498 23.9954 7.25925 24.9745 7.1918 25.6664C7.14534 26.143 7.21246 26.345 7.24189 26.4066ZM29.9001 10.7285C29.4519 12.0322 28.7617 13.4172 27.9042 14.8126C26.465 17.1544 24.4686 19.6641 22.0664 22.0664C19.6641 24.4686 17.1544 26.465 14.8126 27.9042C13.4172 28.7617 12.0322 29.4519 10.7285 29.9001L21.5754 40.747C21.6001 40.7606 21.8995 40.931 22.8729 40.7217C23.9424 40.4916 25.3821 39.879 27.0661 38.8441C29.1062 37.5904 31.3734 35.7982 33.5858 33.5858C35.7982 31.3734 37.5904 29.1062 38.8441 27.0661C39.879 25.3821 40.4916 23.9425 40.7216 22.8729C40.931 21.8995 40.7606 21.6001 40.747 21.5754L29.9001 10.7285ZM29.2403 4.41187L43.5881 18.7597C44.9757 20.1473 44.9743 22.1235 44.6322 23.7139C44.2714 25.3919 43.4158 27.2666 42.252 29.1604C40.8128 31.5022 38.8165 34.012 36.4142 36.4142C34.012 38.8165 31.5022 40.8128 29.1604 42.252C27.2666 43.4158 25.3919 44.2714 23.7139 44.6322C22.1235 44.9743 20.1473 44.9757 18.7597 43.5881L4.41187 29.2403C3.29027 28.1187 3.08209 26.5973 3.21067 25.2783C3.34099 23.9415 3.8369 22.4852 4.54214 21.0277C5.96129 18.0948 8.43335 14.7382 11.5858 11.5858C14.7382 8.43335 18.0948 5.9613 21.0277 4.54214C22.4852 3.8369 23.9415 3.34099 25.2783 3.21067C26.5973 3.08209 28.1187 3.29028 29.2403 4.41187Z" fill="currentColor" fillRule="evenodd" />
              </g>
              <defs>
                <clipPath id="clip0_6_543"><rect fill="white" height="48" width="48" /></clipPath>
              </defs>
            </svg>
          </div>
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] uppercase">Quantara</h2>
        </div>
        <div className="hidden md:flex flex-1 justify-end gap-8">
          <nav className="flex items-center gap-9">
            <a className="text-slate-300 hover:text-white text-sm font-medium transition-colors" href="#architecture">Architecture</a>
            <a className="text-slate-300 hover:text-white text-sm font-medium transition-colors" href="#risk-engine">Risk Engine</a>
            <a className="text-slate-300 hover:text-white text-sm font-medium transition-colors" href="#contracts">Contracts</a>
            <a className="text-slate-300 hover:text-white text-sm font-medium transition-colors" href="#roles">System Roles</a>
          </nav>
          <div className="flex gap-3">
            <Link href="/onboarding" className="flex items-center justify-center overflow-hidden border border-white text-white hover:bg-white/10 transition-colors h-9 px-4 text-sm font-bold tracking-[0.015em]">
              Get Access
            </Link>
            <Link href="/terminal" className="flex items-center justify-center overflow-hidden bg-white text-black hover:bg-slate-200 transition-colors h-9 px-4 text-sm font-bold tracking-[0.015em]">
              Launch Terminal
            </Link>
          </div>
        </div>
        {/* Mobile menu button */}
        <button
          className="md:hidden flex items-center justify-center size-10 text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[65px] z-40 bg-[#191919]/98 backdrop-blur-sm flex flex-col p-6 gap-6 overflow-y-auto">
          <nav className="flex flex-col gap-4">
            <a className="text-white text-lg font-bold uppercase tracking-wider" href="#architecture" onClick={() => setMobileMenuOpen(false)}>Architecture</a>
            <a className="text-white text-lg font-bold uppercase tracking-wider" href="#risk-engine" onClick={() => setMobileMenuOpen(false)}>Risk Engine</a>
            <a className="text-white text-lg font-bold uppercase tracking-wider" href="#contracts" onClick={() => setMobileMenuOpen(false)}>Contracts</a>
            <a className="text-white text-lg font-bold uppercase tracking-wider" href="#roles" onClick={() => setMobileMenuOpen(false)}>System Roles</a>
          </nav>
          <div className="flex flex-col gap-3 mt-4">
            <Link href="/onboarding" className="flex items-center justify-center border border-white text-white h-12 text-sm font-bold uppercase tracking-wider" onClick={() => setMobileMenuOpen(false)}>
              Get Access
            </Link>
            <Link href="/terminal" className="flex items-center justify-center bg-white text-black h-12 text-sm font-bold uppercase tracking-wider" onClick={() => setMobileMenuOpen(false)}>
              Launch Terminal
            </Link>
          </div>
        </div>
      )}

      <main className="grow flex flex-col items-center">
        {/* ═══════════════ HERO ═══════════════ */}
        <section className="w-full max-w-7xl px-6 md:px-10 py-20 lg:py-32">
          <motion.div
            className="flex flex-col gap-8 max-w-4xl"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} custom={0} className="flex items-center gap-3">
              <span className="block size-2 rounded-full bg-white animate-pulse" />
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Protocol v2.4.0 — Mainnet Live</span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-white text-5xl md:text-6xl lg:text-[72px] font-black leading-[1.05] tracking-[-0.04em] uppercase"
            >
              The Income Intelligence Layer for On-Chain Credit Markets
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-3xl"
            >
              Quantara transforms predictable income streams into structured, risk-scored capital instruments. 
              A deterministic financial operating system that sits between income verification, algorithmic risk modeling, 
              structured contract issuance, institutional capital allocation, and protocol-wide observability.
            </motion.p>

            <motion.p
              variants={fadeUp}
              custom={3}
              className="text-slate-500 text-base leading-relaxed max-w-2xl font-mono"
            >
              Income → Risk Model → Structured Contract → Capital Pool → Settlement
            </motion.p>

            <motion.div variants={fadeUp} custom={4} className="flex flex-wrap gap-4 mt-4">
              <Link
                href="/onboarding"
                className="group flex items-center justify-center gap-2 border-2 border-white bg-transparent hover:bg-white text-white hover:text-black transition-all duration-300 h-14 px-8 text-base font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                <span>Begin Onboarding</span>
                <svg className="size-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                href="#architecture"
                className="flex items-center justify-center gap-2 border border-transparent hover:border-neutral-600 bg-neutral-800 hover:bg-neutral-700 text-white transition-all duration-300 h-14 px-8 text-base font-bold uppercase tracking-wider"
              >
                <span>Read Architecture</span>
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* ═══════════════ PROTOCOL METRICS ═══════════════ */}
        <section className="w-full border-y border-[#363636] bg-black/20">
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {[
                { label: 'Total Value Locked', value: '$4.2B' },
                { label: 'Active Contracts', value: '12,847' },
                { label: 'Capital Deployed', value: '$2.1B' },
                { label: 'Avg Default Rate', value: '0.34%' },
                { label: 'Weighted Yield', value: '8.7%' },
                { label: 'System Uptime', value: '99.99%' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex flex-col gap-2 border-l-2 border-white/20 pl-4"
                >
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider font-mono">{stat.label}</p>
                  <p className="text-white text-2xl font-mono font-bold">{stat.value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ SYSTEM ARCHITECTURE ═══════════════ */}
        <section id="architecture" className="w-full max-w-7xl px-6 md:px-10 py-24">
          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-4 max-w-3xl">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">System Model</span>
              <h2 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.03em] uppercase">
                6-Layer Architecture
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Quantara operates on a modular, deterministic architecture. Each layer is independently auditable, 
                horizontally scalable, and designed for institutional-grade throughput. The system processes income 
                data through six sequential layers — each producing structured outputs consumed by the next.
              </p>
            </div>

            {/* Interactive Layer Selector */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Layer List */}
              <div className="lg:col-span-4 flex flex-col border border-[#363636]">
                {systemLayers.map((layer, i) => (
                  <button
                    key={layer.id}
                    onClick={() => setActiveLayer(i)}
                    className={`flex items-center gap-4 p-5 border-b border-[#363636] text-left transition-all duration-200 ${
                      activeLayer === i
                        ? 'bg-white text-black'
                        : 'bg-transparent text-white hover:bg-white/5'
                    }`}
                  >
                    <span className={`font-mono text-xs font-bold ${activeLayer === i ? 'text-black/50' : 'text-slate-500'}`}>
                      {layer.id}
                    </span>
                    <span className={`material-symbols-outlined text-xl ${activeLayer === i ? 'text-black' : 'text-white'}`}>
                      {layer.icon}
                    </span>
                    <span className="font-bold text-sm uppercase tracking-wider">{layer.title}</span>
                  </button>
                ))}
              </div>

              {/* Layer Detail */}
              <motion.div
                key={activeLayer}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="lg:col-span-8 border border-[#363636] bg-border-dark p-8 flex flex-col gap-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-3xl text-white">{systemLayers[activeLayer].icon}</span>
                    <div>
                      <h3 className="text-white text-xl font-bold uppercase tracking-tight">{systemLayers[activeLayer].title}</h3>
                      <span className="text-xs font-mono text-slate-500">Node: {systemLayers[activeLayer].node}</span>
                    </div>
                  </div>
                  <span className="text-4xl font-mono font-bold text-white/10">{systemLayers[activeLayer].id}</span>
                </div>

                <p className="text-slate-300 text-base leading-relaxed">{systemLayers[activeLayer].desc}</p>

                <div className="border-t border-[#363636] pt-4 mt-2">
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3 block">Technical Specifications</span>
                  <div className="space-y-2">
                    {systemLayers[activeLayer].specs.map((spec) => (
                      <div key={spec} className="flex items-center gap-3 text-sm">
                        <span className="block size-1.5 bg-white/40 rounded-full" />
                        <span className="font-mono text-slate-300">{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Layer Flow Diagram */}
                <div className="border-t border-[#363636] pt-4 mt-2">
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3 block">Data Flow</span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {systemLayers.map((l, i) => (
                      <div key={l.id} className="flex items-center gap-2 shrink-0">
                        <div className={`px-3 py-1.5 border text-xs font-mono uppercase tracking-wider ${
                          i === activeLayer ? 'bg-white text-black border-white font-bold' : 'border-[#363636] text-slate-500'
                        }`}>
                          {l.id}
                        </div>
                        {i < systemLayers.length - 1 && (
                          <span className="text-slate-600 text-xs">→</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════ RISK ENGINE ═══════════════ */}
        <section id="risk-engine" className="w-full bg-black/40 border-y border-[#363636]">
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-24">
            <div className="flex flex-col gap-16">
              <div className="flex flex-col gap-4 max-w-3xl">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Core Intelligence</span>
                <h2 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.03em] uppercase">
                  Deterministic Risk Scoring
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Every risk score in Quantara is derived from explicit inputs, defined formulas, and visible assumptions.
                  There are no black-box calculations. The scoring model processes 14 weighted variables across 5 categories 
                  to produce a deterministic output: probability of default, confidence bands, and tier classification.
                </p>
              </div>

              {/* Risk Formula */}
              <div className="bg-border-dark border border-[#363636] p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-white text-xl">functions</span>
                  <span className="text-sm font-bold text-white uppercase tracking-wider">Scoring Formula</span>
                </div>
                <div className="bg-black/40 border border-[#363636] p-6 font-mono text-sm text-slate-300 overflow-x-auto">
                  <pre className="whitespace-pre-wrap">
{`Risk_Score = Σ(Wᵢ × Vᵢ) × Sector_Coefficient

Where:
  W₁ = 0.30  →  Income Stability Index
  W₂ = 0.25  →  Repayment History Score
  W₃ = 0.20  →  Sector Volatility Factor
  W₄ = 0.15  →  Liquidity Buffer Ratio
  W₅ = 0.10  →  Collateral Quality Index

Output:
  Score ∈ [0, 100]
  PD = e^(-0.08 × Score + 2.5)
  Confidence Band = Score ± (100 - Score) × 0.15
  Tier ∈ {AAA, AA, A, BBB, BB, B, CCC, D}`}
                  </pre>
                </div>
              </div>

              {/* Risk Variables */}
              <div className="space-y-3">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest block mb-4">Variable Weights</span>
                {riskVariables.map((v, i) => (
                  <motion.div
                    key={v.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="border border-[#363636] bg-border-dark"
                  >
                    <button
                      onClick={() => setExpandedVar(expandedVar === i ? null : i)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-6">
                        <span className="font-mono text-white font-bold text-lg w-16">{v.weight}</span>
                        <span className="text-white font-bold text-sm uppercase tracking-wider">{v.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-32 h-2 bg-[#363636] hidden md:block">
                          <motion.div
                            className="h-full bg-white"
                            initial={{ width: 0 }}
                            whileInView={{ width: v.weight }}
                            transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                            viewport={{ once: true }}
                          />
                        </div>
                        <span className="material-symbols-outlined text-slate-400 text-lg transition-transform" 
                          style={{ transform: expandedVar === i ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                          expand_more
                        </span>
                      </div>
                    </button>
                    {expandedVar === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="px-5 pb-5 border-t border-[#363636]"
                      >
                        <p className="text-slate-400 text-sm leading-relaxed pt-4">{v.desc}</p>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center">
                <Link
                  href="/risk-engine"
                  className="flex items-center gap-2 border border-white text-white font-bold uppercase tracking-widest text-sm px-8 py-3 hover:bg-white hover:text-black transition-all"
                >
                  <span>Launch Risk Simulator</span>
                  <span className="material-symbols-outlined text-lg">north_east</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ STRUCTURED CONTRACTS ═══════════════ */}
        <section id="contracts" className="w-full max-w-7xl px-6 md:px-10 py-24">
          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-4 max-w-3xl">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Contract Engine</span>
              <h2 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.03em] uppercase">
                Structured Income Contracts
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Quantara transforms risk-scored income profiles into deterministic capital instruments. Each contract 
                follows a 7-state lifecycle with automated state transitions, on-chain settlement, and programmatic 
                repayment scheduling. Contracts are structured as senior, mezzanine, or junior tranches based on 
                risk tier and capital allocation requirements.
              </p>
            </div>

            {/* Contract Lifecycle */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* State Machine */}
              <div className="border border-[#363636] bg-border-dark p-6">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-white text-xl">account_tree</span>
                  <span className="text-sm font-bold text-white uppercase tracking-wider">Contract State Machine</span>
                </div>
                <div className="space-y-0">
                  {contractStates.map((cs, i) => (
                    <div key={cs.state} className="flex items-start gap-4 relative">
                      <div className="flex flex-col items-center">
                        <div className={`size-3 rounded-full border-2 ${
                          cs.state === 'DEFAULTED' ? 'border-white/30 bg-transparent' : 'border-white bg-white'
                        }`} />
                        {i < contractStates.length - 1 && (
                          <div className="w-px h-10 bg-[#363636]" />
                        )}
                      </div>
                      <div className="pb-6">
                        <span className="font-mono text-xs text-white font-bold">{cs.state}</span>
                        <p className="text-slate-400 text-xs mt-0.5">{cs.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contract Specs */}
              <div className="flex flex-col gap-6">
                {[
                  {
                    title: 'Senior Tranche',
                    risk: 'Low',
                    yield: '4.2% — 6.8%',
                    coverage: '2.5x',
                    desc: 'First-priority claim on income streams. Highest coverage ratio, lowest yield. Designed for institutional allocators seeking capital preservation.',
                  },
                  {
                    title: 'Mezzanine Tranche',
                    risk: 'Medium',
                    yield: '8.5% — 12.4%',
                    coverage: '1.5x',
                    desc: 'Second-priority claim with balanced risk-return profile. Absorbs losses after junior tranche exhaustion.',
                  },
                  {
                    title: 'Junior Tranche',
                    risk: 'Higher',
                    yield: '14.0% — 22.0%',
                    coverage: '1.2x',
                    desc: 'First-loss position with highest yield. Absorbs initial default losses before mezzanine and senior tranches.',
                  },
                ].map((tranche) => (
                  <div key={tranche.title} className="border border-[#363636] bg-border-dark p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white font-bold text-sm uppercase tracking-wider">{tranche.title}</span>
                      <span className="font-mono text-xs text-slate-400 border border-[#363636] px-2 py-0.5">{tranche.risk}</span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">{tranche.desc}</p>
                    <div className="flex gap-6 text-xs font-mono">
                      <div>
                        <span className="text-slate-500">Yield Range</span>
                        <p className="text-white font-bold mt-0.5">{tranche.yield}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Coverage</span>
                        <p className="text-white font-bold mt-0.5">{tranche.coverage}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ SYSTEM ROLES ═══════════════ */}
        <section id="roles" className="w-full bg-black/40 border-y border-[#363636]">
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-24">
            <div className="flex flex-col gap-16">
              <div className="flex flex-col gap-4 max-w-3xl">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Access Control</span>
                <h2 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.03em] uppercase">
                  System Roles
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Quantara implements role-based access with three primary personas. Each role has a dedicated interface, 
                  distinct navigation context, and permission-scoped data access.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    role: 'Borrower',
                    icon: 'person',
                    href: '/borrower',
                    actions: [
                      'Submit verified income data',
                      'Request structured capital instruments',
                      'Monitor risk score and repayment',
                      'Track credit profile evolution',
                      'View income stability analytics',
                    ],
                  },
                  {
                    role: 'Capital Allocator',
                    icon: 'account_balance',
                    href: '/terminal',
                    actions: [
                      'Evaluate structured contracts',
                      'Allocate capital to tranches',
                      'Monitor yield and exposure',
                      'Run stress simulations',
                      'Manage portfolio allocation',
                    ],
                  },
                  {
                    role: 'Operator',
                    icon: 'admin_panel_settings',
                    href: '/operator',
                    actions: [
                      'Monitor systemic risk flags',
                      'Trigger insurance mechanisms',
                      'Override or freeze contracts',
                      'Execute compliance audits',
                      'Review protocol observability',
                    ],
                  },
                ].map((r, i) => (
                  <motion.div
                    key={r.role}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="group border border-[#363636] bg-border-dark p-8 flex flex-col gap-6 hover:border-white transition-colors duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="h-12 w-12 flex items-center justify-center bg-black text-white group-hover:bg-white group-hover:text-black transition-colors duration-300">
                        <span className="material-symbols-outlined text-2xl">{r.icon}</span>
                      </div>
                      <Link href={r.href} className="text-slate-500 hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-xl">north_east</span>
                      </Link>
                    </div>
                    <h3 className="text-white text-xl font-bold uppercase tracking-tight">{r.role}</h3>
                    <ul className="space-y-2">
                      {r.actions.map((action) => (
                        <li key={action} className="flex items-start gap-2 text-slate-400 text-sm">
                          <span className="block size-1.5 bg-white/30 rounded-full mt-1.5 shrink-0" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ TECHNICAL SPECS ═══════════════ */}
        <section className="w-full max-w-7xl px-6 md:px-10 py-24">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4" data-aos="fade-up">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Infrastructure</span>
              <h2 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.03em] uppercase">
                Technical Specifications
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#363636]" data-aos="fade-up">
              {[
                { label: 'Settlement Finality', value: 'T+0', desc: 'Instant on-chain settlement' },
                { label: 'Risk Recalculation', value: '< 50ms', desc: 'Real-time scoring updates' },
                { label: 'Event Throughput', value: '50k/s', desc: 'Protocol event processing' },
                { label: 'Data Freshness', value: '< 500ms', desc: 'Income data ingestion lag' },
                { label: 'Scoring Variables', value: '14', desc: 'Weighted risk inputs' },
                { label: 'Contract States', value: '7', desc: 'Lifecycle state machine' },
                { label: 'Tranche Types', value: '3', desc: 'Senior / Mezz / Junior' },
                { label: 'Oracle Sources', value: '8', desc: 'Multi-oracle verification' },
              ].map((spec) => (
                <div key={spec.label} className="bg-border-dark p-6 flex flex-col gap-2">
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">{spec.label}</span>
                  <span className="text-2xl font-mono font-bold text-white">{spec.value}</span>
                  <span className="text-xs text-slate-400">{spec.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ DESIGN PRINCIPLES ═══════════════ */}
        <section className="w-full bg-black border-y border-[#363636]">
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="flex flex-col gap-8" data-aos="fade-up">
                <div>
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Philosophy</span>
                  <h2 className="text-white text-3xl font-black leading-tight tracking-[-0.03em] uppercase mt-3">
                    Core Principles
                  </h2>
                </div>
                <div className="space-y-6">
                  {[
                    { title: 'Determinism over Aesthetics', desc: 'Every calculation is reproducible. Every state transition is explicit. The system prioritizes mathematical correctness over visual embellishment.' },
                    { title: 'Transparency over Abstraction', desc: 'If a number exists, the user understands what influences it. All scoring models, formulas, and assumptions are visible and auditable.' },
                    { title: 'Structure over Style', desc: 'UI reflects system architecture. Data density is intentional. Information hierarchy mirrors the operational flow of capital.' },
                    { title: 'Intelligence over Persuasion', desc: 'The interface communicates like a risk engine, not a brand. Content explains mechanics — what it does, how it works, what variables affect it.' },
                  ].map((p) => (
                    <div key={p.title} className="border-l-2 border-white/20 pl-6">
                      <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-1">{p.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-8" data-aos="fade-up" data-aos-delay="100">
                <div>
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Guarantees</span>
                  <h2 className="text-white text-3xl font-black leading-tight tracking-[-0.03em] uppercase mt-3">
                    System Behavior
                  </h2>
                </div>
                <div className="space-y-4">
                  {[
                    'Every state in the system is explicit, traceable, and deterministic',
                    'Income data is verified through multi-oracle consensus before scoring',
                    'Risk scores recalculate in real-time as underlying variables change',
                    'Contract state transitions are atomic and irreversible',
                    'Default events automatically trigger insurance claim processing',
                    'Capital pool rebalancing occurs algorithmically per-block',
                    'All protocol events are logged with sub-second granularity',
                    'System health is monitored continuously across all six layers',
                  ].map((g) => (
                    <div key={g} className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-white/40 text-base mt-0.5">check</span>
                      <span className="text-slate-300 text-sm leading-relaxed">{g}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ CTA ═══════════════ */}
        <section className="w-full bg-[#191919] text-white py-24 px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto flex flex-col items-center text-center gap-8"
          >
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
              Access the Protocol
            </h2>
            <p className="text-slate-400 text-lg max-w-xl">
              Quantara is currently available to institutional participants, verified borrowers, and 
              qualified capital allocators. Begin the onboarding process to access the system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/onboarding"
                className="bg-white text-black font-bold uppercase tracking-wider px-8 py-4 hover:bg-slate-200 transition-colors whitespace-nowrap flex items-center gap-2"
              >
                Begin Onboarding
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
              <Link
                href="/terminal"
                className="border border-white text-white font-bold uppercase tracking-wider px-8 py-4 hover:bg-white/10 transition-colors whitespace-nowrap flex items-center gap-2"
              >
                View Terminal
                <span className="material-symbols-outlined text-lg">terminal</span>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* ═══════════════ FOOTER ═══════════════ */}
        <footer className="w-full py-8 border-t border-[#363636] bg-[#191919]">
          <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600 font-mono">
            <div>© 2024 Quantara Systems. All rights reserved.</div>
            <div className="flex gap-6">
              <a className="hover:text-slate-400" href="#">Protocol Documentation</a>
              <a className="hover:text-slate-400" href="#">Risk Methodology</a>
              <a className="hover:text-slate-400" href="#">System Status</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
