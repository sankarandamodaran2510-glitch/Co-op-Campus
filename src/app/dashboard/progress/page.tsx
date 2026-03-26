"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar as CalendarIcon, Trophy, Flame, TreePine, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface DayStats {
  date: string;
  health: number;
  passedCount: number;
  totalMembers: number;
  isLegendary?: boolean;
}

// MiniTree component for calendar days
function MiniTree({ health, isLegendary }: { health: number; isLegendary?: boolean }) {
  const treeLevel = health >= 90 ? 4 : health >= 60 ? 3 : health >= 30 ? 2 : health > 0 ? 1 : 0;
  
  const stemColor = treeLevel === 0 ? "#57534e" : treeLevel < 3 ? "#78716c" : "#5c3d11";
  const leafColor = isLegendary ? "#fbbf24" : treeLevel >= 3 ? "#22c55e" : "#34d399";
  
  return (
    <svg viewBox="0 0 100 120" className="w-8 h-8 md:w-10 md:h-10">
      {/* Trunk */}
      <path 
        d="M50 110 L50 70" 
        stroke={stemColor} 
        strokeWidth={treeLevel >= 3 ? "6" : "4"} 
        strokeLinecap="round" 
      />
      
      {/* Branches & Canopy */}
      {treeLevel >= 2 && (
        <g stroke={stemColor} strokeWidth="3" fill="none">
          <path d="M50 90 L35 80" />
          <path d="M50 85 L65 75" />
        </g>
      )}

      <AnimatePresence>
        {treeLevel === 1 && (
          <motion.circle key="l1" cx="50" cy="65" r="10" fill={leafColor} initial={{ scale: 0 }} animate={{ scale: 1 }} />
        )}
        {treeLevel >= 2 && (
          <motion.g key="l2+" initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <circle cx="50" cy="60" r={treeLevel >= 3 ? "18" : "14"} fill={leafColor} opacity="0.8" />
            <circle cx="40" cy="70" r={treeLevel >= 3 ? "14" : "10"} fill={leafColor} opacity="0.7" />
            <circle cx="60" cy="70" r={treeLevel >= 3 ? "14" : "10"} fill={leafColor} opacity="0.7" />
            {treeLevel >= 4 && (
              <>
                <circle cx="50" cy="45" r="12" fill={isLegendary ? "#fde68a" : "#4ade80"} />
                <circle cx="50" cy="60" r="4" fill="#f43f5e" /> {/* Bloom */}
                <circle cx="40" cy="70" r="3" fill="#fb923c" />
                <circle cx="60" cy="70" r="3" fill="#fb923c" />
              </>
            )}
          </motion.g>
        )}
        {treeLevel === 0 && (
           <circle key="l0" cx="50" cy="110" r="3" fill="#52525b" />
        )}
      </AnimatePresence>
    </svg>
  );
}

export default function ProgressPage() {
  const [currentMonth] = useState(new Date(2026, 2, 1)); // March 2026
  const [stats, setStats] = useState<Record<string, DayStats>>({});
  const [squadName, setSquadName] = useState("Byte Planters");

  useEffect(() => {
    const savedName = localStorage.getItem("squad_name") || "Byte Planters";
    const savedMembers = localStorage.getItem("squad_members");
    const membersCount = savedMembers ? JSON.parse(savedMembers).length : 4;
    setSquadName(savedName);

    // Mock some historical data for March 2026
    const mockStats: Record<string, DayStats> = {};
    const today = new Date("2026-03-26");
    
    for (let i = 1; i <= 31; i++) {
        const d = new Date(2026, 2, i);
        const dateStr = d.toDateString();
        
        if (d <= today) {
            // Monday-Wednesday are passed (100% health for mock)
            // Others random or pending
            const isWeekDay = d.getDay() !== 0 && d.getDay() !== 6;
            const health = d.getDate() >= 23 && d.getDate() < 26 ? 100 : (isWeekDay ? 40 + Math.random() * 60 : 10 + Math.random() * 20);
            
            mockStats[dateStr] = {
                date: dateStr,
                health: Math.round(health),
                passedCount: Math.round((health / 100) * membersCount),
                totalMembers: membersCount,
                isLegendary: d.getDate() === 25 || (d.getDate() >= 23 && d.getDate() <= 26 && health > 95)
            };
        }
    }
    setStats(mockStats);
  }, []);

  const daysInMonth = 31;
  const startDay = new Date(2026, 2, 1).getDay(); // Sunday=0, so March 1, 2026 is Sunday (0)

  const calendarDays = Array.from({ length: 42 }).map((_, i) => {
    const day = i - startDay + 1;
    if (day < 1 || day > daysInMonth) return null;
    return new Date(2026, 2, day);
  });

  const getHealthColor = (health: number) => {
    if (health >= 90) return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
    if (health >= 60) return "bg-emerald-600/5 border-emerald-600/20 text-emerald-500";
    if (health >= 30) return "bg-yellow-500/5 border-yellow-500/20 text-yellow-500";
    if (health > 0) return "bg-orange-500/5 border-orange-500/20 text-orange-500";
    return "bg-zinc-900 border-zinc-800 text-zinc-600";
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/dashboard" className="inline-flex items-center text-sm text-zinc-500 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </Link>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-emerald-500/10 rounded-2xl">
                <CalendarIcon className="w-8 h-8 text-emerald-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white leading-tight">Monthly Progress</h1>
                <p className="text-zinc-400">{squadName} &bull; March 2026</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl backdrop-blur-sm">
            <div className="text-center px-4 border-r border-zinc-800">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Best Streak</p>
              <div className="flex items-center justify-center text-orange-400">
                <Flame className="w-4 h-4 mr-1" />
                <span className="text-2xl font-mono font-bold">12</span>
              </div>
            </div>
            <div className="text-center px-4">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Total Passed</p>
              <div className="flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                <span className="text-2xl font-mono font-bold">18</span>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl relative overflow-hidden">
           {/* Subtle glow */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

           <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-white flex items-center">
                <TreePine className="w-5 h-5 mr-2 text-emerald-500" />
                Growth History
              </h2>
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-4 mr-4 border-r border-zinc-800 pr-6">
                   <div className="flex items-center space-x-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] text-zinc-400 uppercase font-bold">Passed</span>
                   </div>
                   <div className="flex items-center space-x-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                      <span className="text-[10px] text-zinc-400 uppercase font-bold">Missed</span>
                   </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-zinc-800 pointer-events-none opacity-50">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-semibold text-zinc-300">March 2026</span>
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-zinc-800 pointer-events-none opacity-50">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
           </div>

           <div className="grid grid-cols-7 gap-3 mb-4 text-center">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                <div key={d} className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest py-2">
                   {d}
                </div>
              ))}
           </div>

           <div className="grid grid-cols-7 gap-2 sm:gap-4 lg:gap-6">
              {calendarDays.map((date, idx) => {
                if (!date) return <div key={`empty-${idx}`} />;
                
                const statsForDay = stats[date.toDateString()];
                const isToday = date.toDateString() === new Date("2026-03-26").toDateString();
                
                return (
                  <motion.div
                    key={date.toISOString()}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.01 }}
                    className={`
                      aspect-[4/5] rounded-2xl border flex flex-col items-center justify-between p-2 lg:p-4 relative group transition-all duration-300
                      ${statsForDay ? getHealthColor(statsForDay.health) : "bg-transparent border-transparent text-zinc-800"}
                      ${isToday ? "ring-2 ring-emerald-500 ring-offset-4 ring-offset-zinc-950 scale-105 z-10 shadow-[0_0_20px_rgba(16,185,129,0.2)]" : ""}
                      hover:scale-110 hover:z-20 hover:shadow-2xl
                    `}
                  >
                    <span className="text-xs lg:text-sm font-bold font-mono opacity-80 self-start">{date.getDate()}</span>
                    
                    {statsForDay ? (
                      <MiniTree health={statsForDay.health} isLegendary={statsForDay.isLegendary} />
                    ) : (
                      <div className="h-8 md:h-10" />
                    )}

                    {statsForDay && (
                      <div className="flex space-x-0.5 mt-auto">
                        {Array.from({ length: statsForDay.totalMembers }).map((_, i) => (
                           <motion.div 
                             key={i}
                             initial={{ scale: 0 }}
                             animate={{ scale: 1 }}
                             transition={{ delay: 0.2 + (i * 0.1) }}
                             className={`w-1 h-1 rounded-full ${i < statsForDay.passedCount ? "bg-current" : "bg-zinc-800"}`} 
                           />
                        ))}
                      </div>
                    )}

                    {statsForDay?.isLegendary && (
                       <div className="absolute top-2 right-2">
                          <Sparkles className="w-3 h-3 text-yellow-400" />
                       </div>
                    )}

                    {/* Tooltip on hover */}
                    {statsForDay && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-40 bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-[10px] opacity-0 group-hover:opacity-100 transition-all z-50 shadow-2xl pointer-events-none translate-y-2 group-hover:translate-y-0">
                        <div className="flex justify-between items-center mb-1">
                           <span className="font-bold text-zinc-200">Growth: {statsForDay.health}%</span>
                           {statsForDay.isLegendary && <Badge className="h-4 text-[8px] bg-yellow-500 text-black px-1 leading-none">Legend</Badge>}
                        </div>
                        <p className="text-zinc-500">{statsForDay.passedCount}/{statsForDay.totalMembers} Members Completed Habits</p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
           </div>


           {/* Legend */}
           <div className="mt-10 pt-6 border-t border-zinc-800/50 flex flex-wrap gap-6 items-center justify-center">
              <div className="flex items-center space-x-2">
                 <div className="w-3 h-3 rounded bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                 <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Full Bloom (90%+)</span>
              </div>
              <div className="flex items-center space-x-2">
                 <div className="w-3 h-3 rounded bg-emerald-600/50" />
                 <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Healthy (60%+)</span>
              </div>
              <div className="flex items-center space-x-2">
                 <div className="w-3 h-3 rounded bg-yellow-500/50" />
                 <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Growing (30%+)</span>
              </div>
              <div className="flex items-center space-x-2">
                 <div className="w-3 h-3 rounded border border-zinc-800 bg-zinc-900" />
                 <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">No Activity</span>
              </div>
           </div>
        </div>

        {/* Action button */}
        <div className="text-center pt-4">
           <Link href="/dashboard">
              <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full px-8 py-6 text-base font-bold shadow-lg shadow-emerald-500/20">
                 Keep Growing Your Tree
              </Button>
           </Link>
        </div>

      </div>
    </div>
  );
}

// Helper icons needed by page
const CheckCircle2 = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/>
  </svg>
);
