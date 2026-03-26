"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CheckCircle2, Flame, Code, BookOpen, Users, Lock, ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const HABITS = [
  { id: "code", label: "Code for 1 hour", icon: Code, color: "from-blue-500 to-cyan-500" },
  { id: "leetcode", label: "Solve 1 LeetCode Problem", icon: BookOpen, color: "from-yellow-500 to-orange-500" },
  { id: "commit", label: "Make a GitHub Commit", icon: Flame, color: "from-purple-500 to-pink-500" },
  { id: "readme", label: "Update Project README", icon: CheckCircle2, color: "from-emerald-500 to-teal-500" },
  { id: "docs", label: "Read 30m of Docs", icon: BookOpen, color: "from-indigo-500 to-blue-500" },
  { id: "review", label: "Review a Peer's Code", icon: Users, color: "from-orange-400 to-red-500" },
  { id: "standup", label: "Attend Daily Standup", icon: Users, color: "from-green-400 to-emerald-600" },
  { id: "test", label: "Write a Unit Test", icon: CheckCircle2, color: "from-pink-500 to-rose-600" },
  { id: "refactor", label: "Refactor a Function", icon: Code, color: "from-amber-400 to-orange-600" },
  { id: "learn", label: "Learn a New Concept", icon: BookOpen, color: "from-violet-500 to-purple-600" },
];

const MOCK_SQUADS = [
  { name: "Alpha Squad", code: "1012", members: 4, max: 4, description: "The elite four — pushing boundaries daily.", avatars: ["AS", "MK", "PL", "RY"] },
  { name: "Byte Blazers", code: "1236", members: 2, max: 4, description: "Two determined coders looking for allies.", avatars: ["BB", "SJ"] },
  { name: "Code Clan", code: "4595", members: 3, max: 4, description: "Three grinders with one open spot.", avatars: ["CC", "TN", "VA"] },
  { name: "Debug Duo", code: "7823", members: 2, max: 4, description: "Methodical problem solvers, 2 seats open.", avatars: ["DA", "KW"] },
  { name: "Null Pointers", code: "3311", members: 1, max: 4, description: "Just started — plenty of room to grow.", avatars: ["NP"] },
  { name: "Binary Bit", code: "1101", members: 3, max: 4, description: "Fast-paced logic heads. Join us!", avatars: ["BB", "JX", "RT"] },
  { name: "Full Stackers", code: "8821", members: 4, max: 4, description: "Node/React pros. Currently full.", avatars: ["FS", "EL", "OP", "QM"] },
  { name: "Logic Lords", code: "5542", members: 2, max: 4, description: "Logic puzzles and high-octane coding.", avatars: ["LL", "ZM"] },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [selectedSquad, setSelectedSquad] = useState<typeof MOCK_SQUADS[0] | null>(null);
  const [customCode, setCustomCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const toggleHabit = (id: string) => {
    setSelectedHabits(prev =>
      prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
    );
  };

  const handleJoinSelected = () => {
    if (!selectedSquad) {
      toast.error("Please select a squad first.");
      return;
    }
    if (selectedSquad.members >= selectedSquad.max) {
      toast.error(`${selectedSquad.name} is full! (${selectedSquad.members}/${selectedSquad.max} members)`);
      return;
    }
    doJoin(selectedSquad);
  };

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCode) {
      toast.error("Please enter a squad code.");
      return;
    }
    const squad = MOCK_SQUADS.find(s => s.code === customCode.trim());
    if (!squad) {
      toast.error("Invalid squad code. Check the list above or ask your friend.");
      return;
    }
    if (squad.members >= squad.max) {
      toast.error(`${squad.name} is currently full! (${squad.members}/${squad.max} members)`);
      return;
    }
    doJoin(squad);
  };

  const doJoin = (squad: typeof MOCK_SQUADS[0]) => {
    setIsLoading(true);
    const baseMembers: { name: string; avatar: string; status: string; latestCommit: string; aiVerified: boolean }[] = [
      { name: "Alex", avatar: "https://github.com/shadcn.png", status: "passed", latestCommit: "Refactored auth", aiVerified: true },
      { name: "Sam", avatar: "https://github.com/vercel.png", status: "passed", latestCommit: "Solved Binary Search", aiVerified: true },
    ];
    if (squad.members >= 3) {
      baseMembers.push({ name: "Jordan", avatar: "", status: "pending", latestCommit: "Waiting...", aiVerified: false });
    }

    const ourUser = {
      name: localStorage.getItem("mock_github_user") || "You",
      avatar: "",
      status: "pending",
      latestCommit: "Just joined!",
      aiVerified: false,
    };

    setTimeout(() => {
      toast.success(`Welcome to ${squad.name}! 🌱`);
      localStorage.setItem("user_habits", JSON.stringify(selectedHabits));
      localStorage.setItem("squad_name", squad.name);
      localStorage.setItem("squad_members", JSON.stringify([...baseMembers, ourUser]));
      router.push("/dashboard");
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/8 rounded-full blur-[140px] pointer-events-none" />

      {/* Step Indicator */}
      <div className="relative z-10 flex items-center space-x-3 mb-10">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center space-x-3">
            <div className={`
              w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300
              ${step >= s
                ? "bg-emerald-500 border-emerald-500 text-black shadow-lg shadow-emerald-500/30"
                : "bg-zinc-900 border-zinc-700 text-zinc-500"
              }
            `}>
              {step > s ? <Check className="w-4 h-4" /> : s}
            </div>
            {s < 2 && (
              <div className={`w-16 h-0.5 rounded transition-all duration-300 ${step > s ? "bg-emerald-500" : "bg-zinc-800"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="w-full max-w-3xl relative z-10">
        <AnimatePresence mode="wait">
          {/* STEP 1 — Habits */}
          {step === 1 && (
            <motion.div
              key="habits"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="text-center space-y-3">
                <p className="text-emerald-500 text-sm font-semibold uppercase tracking-widest">Step 1 of 2</p>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                  Your Daily <span className="text-emerald-400">Commitments</span>
                </h1>
                <p className="text-zinc-400 text-base max-w-md mx-auto">
                  Choose which habits you'll track with your squad every day. Your team sees your progress.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {HABITS.map((habit) => {
                  const Icon = habit.icon;
                  const isSelected = selectedHabits.includes(habit.id);
                  return (
                    <motion.button
                      key={habit.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleHabit(habit.id)}
                      className={`
                        p-5 rounded-2xl border-2 text-left transition-all duration-300 relative group
                        ${isSelected
                          ? "bg-emerald-500/10 border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.12)]"
                          : "bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900"
                        }
                      `}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${habit.color} text-white shadow-lg`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <span className={`font-semibold text-base block transition-colors ${isSelected ? "text-white" : "text-zinc-300 group-hover:text-white"}`}>
                            {habit.label}
                          </span>
                          <span className="text-xs text-zinc-600 mt-0.5 block">Daily task</span>
                        </div>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-4 right-4 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center"
                        >
                          <Check className="w-3.5 h-3.5 text-black" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  onClick={() => {
                    if (selectedHabits.length === 0) {
                      toast.error("Select at least one habit to track!");
                    } else {
                      setStep(2);
                    }
                  }}
                  className="px-10 py-6 text-base font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-500/20 transition-all flex items-center space-x-2"
                >
                  <span>Next: Find Your Squad</span>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2 — Squad Selection */}
          {step === 2 && (
            <motion.div
              key="squad"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="text-center space-y-3">
                <p className="text-emerald-500 text-sm font-semibold uppercase tracking-widest">Step 2 of 2</p>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                  Pick Your <span className="text-emerald-400">Squad</span>
                </h1>
                <p className="text-zinc-400 text-base max-w-md mx-auto">
                  Browse all available groups below. Full squads are locked out.
                </p>
              </div>

              {/* Squad grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {MOCK_SQUADS.map((squad) => {
                  const isFull = squad.members >= squad.max;
                  const isSelected = selectedSquad?.code === squad.code;
                  const spotsLeft = squad.max - squad.members;

                  return (
                    <motion.button
                      key={squad.code}
                      whileHover={!isFull ? { scale: 1.01 } : {}}
                      whileTap={!isFull ? { scale: 0.99 } : {}}
                      onClick={() => {
                        if (isFull) {
                          toast.error(`${squad.name} is full! (4/4 members)`);
                        } else {
                          setSelectedSquad(squad);
                        }
                      }}
                      className={`
                        w-full p-4 rounded-2xl border-2 text-left transition-all duration-300 relative
                        ${isFull
                          ? "bg-zinc-900/40 border-zinc-800/50 opacity-50 cursor-not-allowed"
                          : isSelected
                            ? "bg-emerald-500/10 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                            : "bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 cursor-pointer"
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {/* Avatar group */}
                          <div className="flex -space-x-2 flex-shrink-0">
                            {squad.avatars.slice(0, 3).map((initials, i) => (
                              <div
                                key={i}
                                className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-600 border-2 border-zinc-900 flex items-center justify-center text-[10px] font-bold text-zinc-300"
                              >
                                {initials}
                              </div>
                            ))}
                            {squad.members > 3 && (
                              <div className="w-9 h-9 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center text-[10px] text-zinc-500">
                                +{squad.members - 3}
                              </div>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center space-x-2">
                              <span className={`font-bold text-base ${isFull ? "text-zinc-500" : "text-white"}`}>
                                {squad.name}
                              </span>
                              <code className={`text-xs px-1.5 py-0.5 rounded font-mono ${isFull ? "text-zinc-600 bg-zinc-800" : "text-emerald-400 bg-emerald-500/10"}`}>
                                #{squad.code}
                              </code>
                            </div>
                            <p className="text-zinc-500 text-sm mt-0.5">{squad.description}</p>
                          </div>
                        </div>

                        <div className="flex-shrink-0 ml-4 text-right">
                          {isFull ? (
                            <div className="flex items-center space-x-1.5 text-zinc-600">
                              <Lock className="w-4 h-4" />
                              <span className="text-xs font-medium">Full</span>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <div className="text-emerald-400 text-xs font-semibold">{spotsLeft} spot{spotsLeft > 1 ? "s" : ""} left</div>
                              <div className="flex space-x-0.5">
                                {Array.from({ length: squad.max }).map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-4 h-1.5 rounded-full ${i < squad.members ? "bg-emerald-500" : "bg-zinc-700"}`}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                          {isSelected && !isFull && (
                            <div className="mt-2 text-emerald-500">
                              <Check className="w-5 h-5 ml-auto" />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Join by code input */}
              <div className="border-t border-zinc-800/50 pt-4">
                <p className="text-zinc-500 text-sm mb-3 text-center">Or enter a private squad code from a friend</p>
                <form onSubmit={handleJoinByCode} className="flex gap-3">
                  <Input
                    placeholder="Enter code (e.g. 1236)"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value)}
                    className="bg-zinc-900 border-zinc-800 text-white font-mono tracking-widest focus-visible:ring-emerald-500 h-12"
                  />
                  <Button type="submit" variant="outline" className="h-12 border-zinc-700 text-zinc-300 hover:bg-zinc-800 px-5">
                    Join
                  </Button>
                </form>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="flex-1 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
                >
                  ← Back
                </Button>
                <Button
                  onClick={handleJoinSelected}
                  disabled={!selectedSquad || isLoading}
                  className="flex-1 py-6 text-base font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-40"
                >
                  {isLoading ? (
                    <span>Joining Squad...</span>
                  ) : (
                    <>
                      <span>{selectedSquad ? `Join ${selectedSquad.name}` : "Select a Squad"}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
