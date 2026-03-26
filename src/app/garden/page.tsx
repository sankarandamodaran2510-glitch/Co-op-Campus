"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Star, TreePine, Trophy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlantedTree {
  squadName: string;
  date: string;
  members: number;
}

// Animated floating particle
function FloatingParticle({ x, y, delay, color }: { x: number; y: number; delay: number; color: string }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: 4, height: 4, backgroundColor: color }}
      animate={{
        y: [0, -30, -60, -30, 0],
        opacity: [0, 1, 0.6, 1, 0],
        scale: [0.5, 1, 0.8, 1, 0.5],
      }}
      transition={{
        duration: 6 + Math.random() * 4,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

// SVG of a compact legendary planted tree
function PlantedTreeSVG({ index }: { index: number }) {
  const hues = [120, 150, 80, 200];
  const h = hues[index % hues.length];
  const isGolden = index % 3 === 0;
  const leafColor = isGolden ? "#fbbf24" : `hsl(${h}, 70%, 50%)`;
  const darkLeaf = isGolden ? "#f59e0b" : `hsl(${h}, 70%, 35%)`;
  const bloomColor = isGolden ? "#f43f5e" : "#e879f9";

  return (
    <motion.svg
      viewBox="0 0 200 260"
      className="w-full h-full"
      animate={{ filter: `drop-shadow(0 0 18px ${isGolden ? "rgba(251,191,36,0.5)" : "rgba(34,197,94,0.3)"})` }}
    >
      {/* Ground */}
      <ellipse cx="100" cy="250" rx="65" ry="12" fill="#14532d" opacity="0.5" />

      {/* Roots */}
      <path d="M100 240 C 80 244, 65 248, 55 255" stroke="#5c3d11" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M100 240 C 120 244, 135 248, 145 255" stroke="#5c3d11" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Trunk */}
      <motion.path
        d="M100 240 C 100 200, 100 165, 100 135"
        stroke="#5c3d11"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      {/* Branches */}
      <path d="M100 190 C 80 175, 60 165, 48 150" stroke="#5c3d11" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M100 180 C 120 168, 142 155, 153 142" stroke="#5c3d11" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M100 155 C 88 142, 78 132, 68 120" stroke="#5c3d11" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M100 150 C 112 138, 122 128, 132 118" stroke="#5c3d11" strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* Canopy */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0.97, 1.03, 0.97], opacity: 1 }}
        transition={{
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 0.8, delay: 0.8 },
        }}
        style={{ transformOrigin: "100px 120px" }}
        fill={leafColor}
      >
        <circle cx="100" cy="105" r="45" opacity="0.9" />
        <circle cx="66" cy="128" r="35" opacity="0.85" fill={darkLeaf} />
        <circle cx="134" cy="125" r="35" opacity="0.85" fill={darkLeaf} />
        <circle cx="80" cy="82" r="30" opacity="0.8" />
        <circle cx="120" cy="80" r="30" opacity="0.8" />
        <circle cx="100" cy="65" r="28" opacity="0.85" />
        {isGolden && <circle cx="100" cy="45" r="20" opacity="0.9" fill="#fde68a" />}
      </motion.g>

      {/* Blooms */}
      {[
        { cx: 82, cy: 80, r: 7 }, { cx: 120, cy: 75, r: 6 },
        { cx: 62, cy: 120, r: 7 }, { cx: 138, cy: 117, r: 6 },
        { cx: 100, cy: 55, r: 8 },
      ].map((b, i) => (
        <motion.circle
          key={i}
          cx={b.cx}
          cy={b.cy}
          r={b.r}
          fill={bloomColor}
          animate={{ scale: [1, 1.3, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 2 + i * 0.35, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}

      {/* Golden star top for golden trees */}
      {isGolden && (
        <motion.text
          x="100" y="32"
          textAnchor="middle"
          fontSize="18"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ✨
        </motion.text>
      )}
    </motion.svg>
  );
}

export default function GardenPage() {
  const [trees, setTrees] = useState<PlantedTree[]>([]);
  const [particles] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: i * 0.4,
      color: ["#4ade80", "#fbbf24", "#f472b6", "#86efac"][Math.floor(Math.random() * 4)],
    }))
  );

  useEffect(() => {
    const saved = localStorage.getItem("garden_trees");
    if (saved) {
      setTrees(JSON.parse(saved));
    } else {
      // Demo trees so the garden isn't empty
      setTrees([
        { squadName: "Byte Blazers", date: "Mon Mar 24 2026", members: 4 },
        { squadName: "Code Clan", date: "Tue Mar 25 2026", members: 4 },
      ]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#030a03] relative overflow-hidden">
      {/* Starry particles */}
      {particles.map((p, i) => (
        <FloatingParticle key={i} {...p} />
      ))}

      {/* Deep forest ambient gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030a03] via-[#051205] to-[#0a1f0a] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Ground strip */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#052005] to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center space-y-4">
          <Link href="/dashboard" className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-300 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-emerald-400 to-yellow-300">
                Garden of Legends
              </h1>
              <Trophy className="w-8 h-8 text-yellow-400" />
            </div>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              Squads who completed a full 7-day streak have their tree forever planted here.
            </p>
            <div className="flex items-center justify-center space-x-2 mt-3">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-yellow-500 text-sm font-semibold">{trees.length} Legendary Trees Planted</span>
              <Star className="w-4 h-4 text-yellow-500" />
            </div>
          </motion.div>
        </div>

        {trees.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 space-y-4"
          >
            <TreePine className="w-16 h-16 text-zinc-700 mx-auto" />
            <p className="text-zinc-600 text-xl">No legendary trees yet.</p>
            <p className="text-zinc-700 text-sm">Complete a 7-day streak with your full squad to plant the first one.</p>
            <Link href="/dashboard">
              <Button className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white">Go tend your tree</Button>
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Tree Garden Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-10 items-end">
              {trees.map((tree, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  className="flex flex-col items-center"
                >
                  {/* Tree SVG */}
                  <div className="w-full aspect-[3/4]">
                    <PlantedTreeSVG index={i} />
                  </div>

                  {/* Nameplate */}
                  <motion.div
                    className="mt-3 text-center bg-zinc-900/70 border border-zinc-800/50 rounded-xl px-4 py-2 backdrop-blur-sm"
                    whileHover={{ scale: 1.05 }}
                  >
                    <p className="text-white font-bold text-sm">{tree.squadName}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">{tree.date}</p>
                    <div className="flex items-center justify-center space-x-1 mt-1">
                      <Sparkles className="w-3 h-3 text-yellow-500" />
                      <span className="text-yellow-500 text-xs font-medium">7-Day Legend</span>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Ground decoration */}
            <div className="mt-20 flex justify-center space-x-4 opacity-30">
              {["🌿", "🌾", "🍄", "🌸", "🦋", "🌿", "🌾"].map((e, i) => (
                <motion.span
                  key={i}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
                  className="text-2xl select-none"
                >
                  {e}
                </motion.span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
