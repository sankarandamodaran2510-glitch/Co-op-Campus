"use client";

import { useState } from "react";
import TeamGarden from "@/components/TeamGarden";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function TeamGardenPage() {
  const [pastTrees] = useState([
    { id: '1', date: 'March Week 1', level: 'Sapling', score: 850, day: 4 },
    { id: '2', date: 'Feb Week 4', level: 'Garden', score: 1240, day: 7 },
    { id: '3', date: 'Jan Week 2', level: 'Forest', score: 2100, day: 7 },
  ]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center gap-4 mb-8">
          <Link href="/dashboard" className="p-2 hover:bg-zinc-900 rounded-full transition-colors text-zinc-400 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-4xl font-black tracking-tighter">Team Garden</h1>
            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mt-1">Our shared evolution journey</p>
          </div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TeamGarden pastTrees={pastTrees} />
        </motion.div>
      </div>
    </div>
  );
}
