"use client";

import React, { useMemo } from 'react'

interface TreeVisualizerProps {
  day: number // 1 to 7
}

const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ day }) => {
  const centerX = 150;
  const bottomY = 280;
  
  const treeElements = useMemo(() => {
     const elements: React.ReactNode[] = [];
     const maxDepth = Math.min(6, Math.ceil(day * 0.9));
     
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
           const leafRadius = leafBaseSize + modifier;
           
           const glow = day >= 6 ? 'url(#glow)' : '';
           const color = day === 7 ? 'var(--primary)' : (day >= 5 ? '#34d399' : '#6ee7b7');
           const secondaryColor = day === 7 ? 'var(--primary-hover)' : '#34d399';
           const fruitColor = '#fbbf24'; 
           
           elements.push(
             <circle 
               key={`leaf1-${path}`} cx={endX} cy={endY} r={leafRadius} 
               fill={color} fillOpacity={0.8} filter={glow} 
               style={{ transition: 'all 0.8s ease' }} 
             />
           );
           
           if (day >= 3) {
              elements.push(
                <circle key={`leaf2-${path}`} cx={endX + 5} cy={endY - 5} r={leafRadius * 0.8} fill={secondaryColor} fillOpacity={0.7} filter={glow} />
              )
           }
           
           if (day >= 5) {
              elements.push(
                <circle key={`leaf3-${path}`} cx={endX - 6} cy={endY - 2} r={leafRadius * 0.7} fill="#047857" fillOpacity={0.6} filter={glow} />
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
     
     const initialLength = 30 + (day * 6); 
     drawBranch(centerX, bottomY, initialLength, 0, 1, 'root');
     
     return elements;
  }, [day]);

  return (
    <svg width="100%" height="100%" viewBox="0 0 300 300" className="tree-svg">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <path 
        d="M50 280 Q150 250 250 280" 
        stroke="var(--border)" 
        strokeWidth="6" 
        fill="rgba(16, 185, 129, 0.05)" 
        strokeLinecap="round"
      />
      
      <circle cx={centerX} cy={bottomY} r={day * 3} fill="var(--primary)" opacity={0.1 + (day * 0.05)} filter="url(#glow)" />

      <g className="branches">
        {treeElements}
      </g>
      
      <style>{`
        .tree-svg {
          filter: drop-shadow(0 0 15px rgba(16, 185, 129, 0.15));
          max-height: 100%;
          max-width: 100%;
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-0.5deg); }
          50% { transform: rotate(0.5deg); }
        }
        .branches {
          transform-origin: 150px 280px;
          animation: sway 5s ease-in-out infinite;
        }
      `}</style>
    </svg>
  )
}

export default TreeVisualizer
