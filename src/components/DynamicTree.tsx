"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

interface ParticleProps {
  x: number;
  y: number;
  delay: number;
  size: number;
  color: string;
}

function Particle({ x, y, delay, size, color }: ParticleProps) {
  return (
    <motion.circle
      cx={x}
      cy={y}
      r={size}
      fill={color}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.8, 0],
        y: [-10, -50, -100],
        scale: [0, 1, 0],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        delay: delay,
        ease: "easeOut",
      }}
    />
  );
}

export function DynamicTree({ streakDays, health = 0 }: { streakDays: number; health?: number }) {
  const [particles, setParticles] = useState<ParticleProps[]>([]);
  
  const initialStage = Math.min(7, Math.max(1, streakDays));
  const [activeDay, setActiveDay] = useState(initialStage);
  
  // Sync with prop changes
  useEffect(() => {
    setActiveDay(initialStage);
  }, [initialStage]);

  const isLegendary = activeDay >= 7;
  const day = activeDay;

  // Daily Maturity effects
  const maturity = health / 100;
  const leafOpacity = 0.4 + (maturity * 0.4);

  useEffect(() => {
    const particleCount = (activeDay * 2) + Math.floor(maturity * 10);
    const pts = Array.from({ length: particleCount }, (_, i) => ({
      x: 150 + Math.random() * 100,
      y: 150 + Math.random() * 150,
      delay: Math.random() * 5,
      size: 1 + Math.random() * 2,
      color: isLegendary ? "#fbbf24" : "#34d399",
    }));
    setParticles(pts);
  }, [activeDay, maturity, isLegendary]);

  const treeElements = useMemo(() => {
     const elements: React.ReactNode[] = [];
     const maxDepth = Math.min(6, Math.ceil(day * 0.9));
     
     const centerX = 200;
     const bottomY = 320;

     const drawBranch = (x: number, y: number, length: number, angle: number, depth: number, path: string): void => {
        if (depth > maxDepth) return;
        
        const endX = x + length * Math.sin(angle);
        const endY = y - length * Math.cos(angle);
        
        const baseThickness = (maxDepth - depth + 1) * 1.5;
        const thickness = baseThickness + (day * 0.5);
        
        elements.push(
           <line 
             key={`line-${path}`} 
             x1={x} y1={y} x2={endX} y2={endY} 
             stroke="#5c290b" 
             strokeWidth={thickness} 
             strokeLinecap="round" 
             style={{ transition: 'all 0.5s ease-in-out' }}
           />
        );
        
        const isTip = depth === maxDepth;
        if (isTip || (day >= 4 && depth >= maxDepth - 1)) {
           const leafBaseSize = 4 + (day * 1.2);
           const modifier = (depth * 13) % 5; 
           const leafRadius = (leafBaseSize + modifier) * (0.8 + maturity * 0.4);
           
           const glow = day >= 6 ? 'url(#glow)' : '';
           const color = day === 7 ? 'var(--primary)' : (day >= 5 ? '#34d399' : '#6ee7b7');
           const secondaryColor = day === 7 ? 'var(--primary-hover)' : '#34d399';
           const fruitColor = '#fbbf24'; 
           
           elements.push(
             <circle 
               key={`leaf1-${path}`} cx={endX} cy={endY} r={leafRadius} 
               fill={color} fillOpacity={leafOpacity} filter={glow} 
               style={{ transition: 'all 0.8s ease' }} 
             />
           );
           
           if (day >= 3) {
              elements.push(
                <circle key={`leaf2-${path}`} cx={endX + 5} cy={endY - 5} r={leafRadius * 0.8} fill={secondaryColor} fillOpacity={leafOpacity * 0.8} filter={glow} />
              )
           }
           
           if (day >= 5) {
              elements.push(
                <circle key={`leaf3-${path}`} cx={endX - 6} cy={endY - 2} r={leafRadius * 0.7} fill="#047857" fillOpacity={leafOpacity * 0.7} filter={glow} />
              )
           }
           
           if (day === 7 && (depth * 17) % 3 === 0) { 
              elements.push(
                <circle key={`fruit-${path}`} cx={endX} cy={endY + 3} r={4} fill={fruitColor} filter="url(#glow)" />
              )
           }
        }
        
        if (depth < maxDepth) {
           const nextLength = length * 0.75;
           const spread = 0.35 + (day * 0.015);
           drawBranch(endX, endY, nextLength, angle - spread, depth + 1, path + 'L');
           drawBranch(endX, endY, nextLength, angle + spread, depth + 1, path + 'R');
           
           if (day >= 5 && depth % 2 === 0) {
              drawBranch(endX, endY, nextLength * 0.6, angle, depth + 1, path + 'C');
           }
        }
     };
     
     const initialLength = 30 + (day * 8); 
     drawBranch(centerX, bottomY, initialLength, 0, 1, 'root');
     
     return elements;
  }, [day, maturity, leafOpacity]);

  const STAGE_LABELS = [
    "",
    "Day 1: Humble Seedling 🌱",
    "Day 2: Rising Sprout 🌿",
    "Day 3: Young Sapling 🌳",
    "Day 4: Growing Guardian 🌲",
    "Day 5: Flourishing Force 🍃",
    "Day 6: Ancient Arboreal 🍂",
    "Day 7: LEGENDARY TREE 🌟"
  ];

  return (
    <div className="flex flex-col items-center w-full">
      {/* Interactive Day Selection */}
      <div className="w-full max-w-sm mb-12 space-y-6">
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-500">Evolution Stage Selection</span>
            <span className="text-sm font-black text-white">{STAGE_LABELS[activeDay]}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-black tracking-widest text-emerald-500 animate-pulse">Sync Active</span>
          </div>
        </div>
        
        <div className="flex justify-between gap-1.5 p-1.5 bg-zinc-900/50 rounded-2xl border border-zinc-900">
          {Array.from({ length: 7 }).map((_, i) => {
            const d = i + 1;
            const isSelected = activeDay === d;
            const isActualProgress = d <= (streakDays || 1);
            
            return (
              <button 
                key={i}
                onClick={() => setActiveDay(d)}
                className={`flex-1 group py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
                  isSelected 
                    ? "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]" 
                    : "bg-zinc-950 text-zinc-500 hover:bg-zinc-900 border border-zinc-900/50"
                }`}
              >
                <div className="flex flex-col items-center gap-0.5 relative z-10">
                  <span className={`text-[10px] font-black uppercase tracking-tighter ${isSelected ? "text-black" : (isActualProgress ? "text-emerald-500/80" : "text-zinc-600")}`}>Day</span>
                  <span className={`text-sm font-black leading-none ${isSelected ? "text-black" : "text-zinc-300"}`}>{d}</span>
                </div>
                {isActualProgress && !isSelected && (
                  <div className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-500/30" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 7-Stage SVG Tree */}
      <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.svg
            key={activeDay}
            viewBox="0 0 400 400"
            className="w-full h-full drop-shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 1.05, rotate: 3 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <defs>
               <radialGradient id="aura" cx="50%" cy="50%" r="50%">
                 <stop offset="0%" stopColor={isLegendary ? "#fbbf24" : "var(--primary)"} stopOpacity="0.15" />
                 <stop offset="100%" stopColor="transparent" stopOpacity="0" />
               </radialGradient>
               <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <circle cx="200" cy="200" r="180" fill="url(#aura)" />

            {/* Ground */}
            <path 
              d="M100 320 Q200 290 300 320" 
              stroke="var(--border)" 
              strokeWidth="6" 
              fill="rgba(16, 185, 129, 0.05)" 
              strokeLinecap="round"
            />
            
            <circle cx="200" cy="320" r={day * 6} fill="var(--primary)" opacity={0.1 + (day * 0.05)} filter="url(#glow)" />

            {/* Recursive Tree */}
            <g className="branches" style={{ transformOrigin: '200px 320px', animation: 'sway 5s ease-in-out infinite' }}>
              {treeElements}
            </g>

            {/* Global Particles */}
            {particles.map((p, i) => <Particle key={i} {...p} />)}
            
            <style>{`
              @keyframes sway {
                0%, 100% { transform: rotate(-0.5deg); }
                50% { transform: rotate(0.5deg); }
              }
            `}</style>
          </motion.svg>
        </AnimatePresence>
      </div>

      {/* Label and Vitality */}
      <div className="w-full max-w-sm mt-8 space-y-4">
        <div className="flex justify-between items-end px-2">
           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">Daily Maturity</span>
           <span className="text-emerald-500 text-xs font-black">{health}%</span>
        </div>
        <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
           <motion.div 
             className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
             initial={{ width: 0 }}
             animate={{ width: `${health}%` }}
           />
        </div>
      </div>
    </div>
  );
}
