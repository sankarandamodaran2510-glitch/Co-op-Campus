"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Trophy, Medal, Target, Users, Zap, Leaf } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TOP_SQUADS = [
  { rank: 1, name: "Neural Knights", score: 980, members: 4, treeLevel: "Legendary 🌟", color: "from-yellow-500 to-amber-600" },
  { rank: 2, name: "Byte Planters", score: 945, members: 4, treeLevel: "Flourishing 🌲", color: "from-emerald-400 to-teal-600" },
  { rank: 3, name: "Crypto Crafters", score: 890, members: 3, treeLevel: "Flourishing 🌲", color: "from-blue-400 to-indigo-600" },
];

const OTHER_SQUADS = [
  { rank: 4, name: "Algorithm Alchemists", score: 820, members: 4, treeLevel: "Sapling 🌿" },
  { rank: 5, name: "Syntax Soldiers", score: 750, members: 4, treeLevel: "Sapling 🌿" },
  { rank: 6, name: "Kernel Keepers", score: 680, members: 2, treeLevel: "Seedling 🌱" },
  { rank: 7, name: "Logic Lords", score: 540, members: 4, treeLevel: "Seedling 🌱" },
  { rank: 8, name: "Git Guardians", score: 420, members: 3, treeLevel: "Seedling 🌱" },
];

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-12 font-sans selection:bg-emerald-500/30">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-4">
            <Link href="/dashboard" className="inline-flex items-center text-xs font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Squad
            </Link>
            <h1 className="text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
              Campus Hall of Fame
            </h1>
            <p className="text-zinc-500 max-w-md font-medium"> The global ranking of all squads currently nurturing legendary trees across the university campus. </p>
          </div>
          <div className="flex bg-zinc-900/50 border border-zinc-800 p-1 rounded-2xl">
            <Button variant="ghost" className="rounded-xl bg-zinc-800 text-white px-6">Top Squads</Button>
            <Button variant="ghost" className="rounded-xl text-zinc-500 hover:text-white px-6">My Rank</Button>
          </div>
        </header>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end pt-10">
          {/* Rank 2 */}
          <div className="order-2 md:order-1">
            <PodiumCard squad={TOP_SQUADS[1]} height="h-64" delay={0.2} />
          </div>
          {/* Rank 1 */}
          <div className="order-1 md:order-2">
            <PodiumCard squad={TOP_SQUADS[0]} height="h-80" delay={0} isGold />
          </div>
          {/* Rank 3 */}
          <div className="order-3">
            <PodiumCard squad={TOP_SQUADS[2]} height="h-56" delay={0.4} />
          </div>
        </div>

        {/* Ranking Table */}
        <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-[2.5rem] overflow-hidden backdrop-blur-sm">
          <div className="p-8 border-b border-zinc-800/50 flex justify-between items-center">
            <h2 className="text-xl font-black flex items-center">
              <Target className="w-5 h-5 mr-3 text-emerald-500" />
              Global Standings
            </h2>
            <Badge variant="outline" className="text-zinc-500 border-zinc-800 px-4 py-1">Updated 5m ago</Badge>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs uppercase tracking-widest text-zinc-600 font-black border-b border-zinc-800/30">
                  <th className="px-8 py-5">Rank</th>
                  <th className="px-8 py-5">Squad Name</th>
                  <th className="px-8 py-5">Tree Vitality</th>
                  <th className="px-8 py-5">Squad Size</th>
                  <th className="px-8 py-5 text-right">Hall Points</th>
                </tr>
              </thead>
              <tbody>
                {OTHER_SQUADS.map((squad, i) => (
                  <motion.tr 
                    key={squad.rank}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (i * 0.1) }}
                    className="border-b border-zinc-800/20 hover:bg-zinc-800/30 transition-colors group"
                  >
                    <td className="px-8 py-6 text-zinc-500 font-mono font-bold">#{squad.rank}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-black text-xs">
                          {squad.name.charAt(0)}
                        </div>
                        <span className="font-bold group-hover:text-emerald-400 transition-colors">{squad.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <Badge variant="secondary" className="bg-zinc-800/50 text-zinc-400 border-zinc-700/50 font-bold">
                        {squad.treeLevel}
                      </Badge>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center text-zinc-400 text-sm">
                        <Users className="w-4 h-4 mr-2 opacity-50" />
                        {squad.members}/4
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right font-black text-lg tracking-tighter">
                      {squad.score}
                      <span className="text-[10px] text-zinc-600 ml-1.5 uppercase tracking-tighter">PTS</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <style jsx global>{`
        @keyframes subtle-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: subtle-float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function PodiumCard({ squad, height, delay, isGold = false }: { squad: any, height: string, delay: number, isGold?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
      className="flex flex-col items-center group cursor-default"
    >
      <div className={`relative mb-6 ${isGold ? "scale-110" : "scale-100"}`}>
        <div className={`absolute inset-0 rounded-full blur-2xl opacity-20 bg-gradient-to-t ${squad.color}`} />
        <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${squad.color} flex items-center justify-center relative z-10 shadow-2xl`}>
          {isGold ? <Trophy className="w-10 h-10 text-white" /> : <Medal className="w-10 h-10 text-white" />}
          <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-black font-black flex items-center justify-center text-sm shadow-xl">
            {squad.rank}
          </div>
        </div>
      </div>

      <div className={`w-full ${height} bg-zinc-900/50 border border-zinc-800/80 rounded-t-[3rem] p-6 flex flex-col items-center justify-start text-center group-hover:bg-zinc-900/80 transition-all duration-500`}>
        <h3 className="text-xl font-black tracking-tight mt-4 truncate w-full">{squad.name}</h3>
        <p className="text-xs font-black text-emerald-500 uppercase tracking-widest mt-1 mb-6">{squad.treeLevel}</p>
        
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-6" />
        
        <div className="space-y-4 w-full">
          <div className="flex justify-between items-center text-[10px] uppercase font-black text-zinc-500">
            <span>Vitality</span>
            <span className="text-white">{(squad.score / 10).toFixed(0)}%</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(squad.score / 10)}%` }}
              transition={{ delay: delay + 0.5, duration: 1.5 }}
              className={`h-full bg-gradient-to-r ${squad.color}`}
            />
          </div>
          <p className="text-2xl font-black tracking-tighter mt-4">
            {squad.score}
            <span className="text-[10px] text-zinc-600 ml-1 uppercase tracking-tighter">Points</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
