"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DynamicTree } from "@/components/DynamicTree";
import { MemberCard, Member } from "@/components/MemberCard";
import { Progress } from "@/components/ui/progress";
import { Leaf, Clock, ArrowLeft, UserPlus, Vote, CheckCircle2, Circle, Zap, TreePine, Sparkles, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MilestoneModal from "@/components/MilestoneModal";
import MilestoneModal from "@/components/MilestoneModal";

// Initial Mock Data
const MOCK_DATA = {
  squadName: "Byte Planters",
  members: [
    {
      name: "Alex",
      avatar: "https://github.com/shadcn.png",
      status: "passed",
      latestCommit: "Refactored the auth middleware",
      aiVerified: true
    },
    {
      name: "Sam",
      avatar: "https://github.com/vercel.png",
      status: "passed",
      latestCommit: "Solved LeetCode #704 Binary Search",
      aiVerified: true
    },
    {
      name: "Jordan",
      avatar: "",
      status: "pending",
      latestCommit: "Waiting for push...",
      aiVerified: false
    },
    {
      name: "You",
      avatar: "https://github.com/nutlope.png",
      status: "pending",
      latestCommit: "Working on missions...",
      aiVerified: false,
      isMe: true
    }
  ] as Member[]
};

const HABIT_LABELS: Record<string, string> = {
  code: "Code for 1 hour",
  leetcode: "Solve 1 LeetCode Problem",
  commit: "Make a GitHub Commit",
  readme: "Update Project README",
  docs: "Read 30m of Docs",
  review: "Review a Peer's Code",
  standup: "Attend Daily Standup",
  test: "Write a Unit Test",
  refactor: "Refactor a Function",
  learn: "Learn a New Concept",
};

export default function DashboardPage() {
  const [timeLeft, setTimeLeft] = useState("");
  const [habits, setHabits] = useState<string[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [members, setMembers] = useState<Member[]>([]);
  const [squadName, setSquadName] = useState("Byte Planters");
  const [streakDays, setStreakDays] = useState(0);
  const [showMilestone, setShowMilestone] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);

  // Initialize
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem("squad_members");
    const savedName = localStorage.getItem("squad_name");
    const savedHabits = localStorage.getItem("user_habits");

    if (savedName) setSquadName(savedName);
    
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    } else {
      const defaultHabits = Object.keys(HABIT_LABELS);
      setHabits(defaultHabits);
      localStorage.setItem("user_habits", JSON.stringify(defaultHabits));
    }

    const today = new Date().toDateString();
    const rawDays = localStorage.getItem("streak_days_passed");
    let daysPassed: string[] = rawDays ? JSON.parse(rawDays) : [];

    if (daysPassed.length === 0) {
      const mon = new Date("2026-03-23").toDateString();
      const tue = new Date("2026-03-24").toDateString();
      const wed = new Date("2026-03-25").toDateString();
      daysPassed = [mon, tue, wed];
      localStorage.setItem("streak_days_passed", JSON.stringify(daysPassed));
    }
    setStreakDays(daysPassed.length);

    const savedTasks = localStorage.getItem(`completed_tasks_${today}`);
    if (savedTasks) setCompletedTasks(new Set(JSON.parse(savedTasks)));

    if (saved) {
      const parsedMembers = JSON.parse(saved);
      // Ensure "You" has isMe if somehow lost
      const processed = parsedMembers.map((m: Member) => 
        (m.name === "You" || m.name === localStorage.getItem('mock_github_user')) ? { ...m, isMe: true } : m
      );
      setMembers(processed);
    } else {
      const initial = MOCK_DATA.members.map((m, i) => i < 3 ? { ...m, status: 'passed' as const } : m);
      setMembers(initial);
      localStorage.setItem("squad_members", JSON.stringify(initial));
    }
  }, []);

  // Sync Timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(23, 59, 59, 999);
      const diff = midnight.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft("00:00:00");
      } else {
        const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        setTimeLeft(`${h}:${m}:${s}`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute live health score Reactively
  const liveHealthScore = (() => {
    if (members.length === 0) return 0;
    const othersPassedCount = members.filter(m => !m.isMe && m.status === "passed").length;
    const othersScore = (othersPassedCount / members.length) * 100;
    const userWeight = (1 / members.length) * 100;
    const userHabitProgress = habits.length > 0 ? (completedTasks.size / habits.length) : 0;
    return Math.min(100, Math.round(othersScore + (userHabitProgress * userWeight)));
  })();

  // Task Toggle
  const toggleTask = (habitId: string) => {
    setCompletedTasks(prev => {
      const next = new Set(prev);
      if (next.has(habitId)) next.delete(habitId);
      else next.add(habitId);
      
      const today = new Date().toDateString();
      localStorage.setItem(`completed_tasks_${today}`, JSON.stringify([...next]));

      if (next.size === habits.length && habits.length > 0) {
        toast.success("🎉 Mission accomplished! You passed today.");
        setShowMilestone(true);
        setMembers(curr => {
          const updated = curr.map(m => 
            m.isMe
              ? { ...m, status: 'passed' as const, latestCommit: `All habits done! (${new Date().toLocaleTimeString()})` } 
              : m
          );
          localStorage.setItem('squad_members', JSON.stringify(updated));
          return updated;
        });
      } else {
        // Revert to pending if some undone
        setMembers(curr => {
          const updated = curr.map(m => 
            m.isMe && m.status === 'passed'
              ? { ...m, status: 'pending' as const, latestCommit: "Updating progress..." } 
              : m
          );
          localStorage.setItem('squad_members', JSON.stringify(updated));
          return updated;
        });
      }
      return next;
    });
  };

  const [isInviteOpen, setIsInviteOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8 font-sans selection:bg-emerald-500/30">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Hall of Fame Banner */}
        <Link href="/leaderboard" className="block group">
          <motion.div 
            whileHover={{ scale: 1.005 }}
            className="bg-gradient-to-r from-emerald-600/20 via-emerald-500/10 to-emerald-600/20 border border-emerald-500/30 rounded-3xl p-5 flex items-center justify-between group-hover:border-emerald-500/50 transition-all cursor-pointer shadow-2xl"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-yellow-500 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Campus Hall of Fame</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Your squad is Ranked <span className="text-emerald-400">#2</span> globally. See the competition →</p>
              </div>
            </div>
            <ArrowLeft className="w-5 h-5 text-emerald-500 rotate-180 group-hover:translate-x-1 transition-transform" />
          </motion.div>
        </Link>

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-2 border-b border-zinc-900">
          <div className="space-y-3">
            <h1 className="text-5xl font-black tracking-tighter leading-none">
              {squadName}
            </h1>
            <div className="flex flex-wrap gap-3 items-center">
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1 font-black uppercase text-[10px] tracking-widest">
                <Leaf className="w-3 h-3 mr-2" />
                {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', weekday: 'long' })}
              </Badge>
              <div className="flex items-center bg-zinc-900 px-3 py-1 rounded-full text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                <Clock className="w-3.5 h-3.5 mr-2 text-zinc-600" />
                DL: <span className="text-zinc-200 ml-2 font-mono">{timeLeft}</span>
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-3">
            <Link href="/dashboard/team">
              <Button variant="outline" className="rounded-2xl border-zinc-800 text-zinc-400 font-black uppercase tracking-widest text-[10px] hover:text-white hover:bg-zinc-900 px-6">Garden</Button>
            </Link>
            <Link href="/dashboard/progress">
              <Button variant="outline" className="rounded-2xl border-zinc-800 text-zinc-400 font-black uppercase tracking-widest text-[10px] hover:text-white hover:bg-zinc-900 px-6">Log</Button>
            </Link>
            <Link href="/dashboard/squad-vote">
              <Button variant="outline" className="rounded-2xl border-zinc-800 text-zinc-400 font-black uppercase tracking-widest text-[10px] hover:text-white hover:bg-zinc-900 px-6">Vote</Button>
            </Link>
          </nav>
        </header>

        {/* Main Interface */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Cinematic Tree Area */}
          <section className="lg:col-span-7 bg-zinc-900/20 border border-zinc-900 rounded-[3rem] p-12 relative overflow-hidden flex flex-col items-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.08)_0%,transparent_60%)] pointer-events-none" />
            
            <DynamicTree streakDays={streakDays} health={liveHealthScore} />

            <div className="w-full max-w-sm mt-10 space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Tree Vitality</span>
                <span className="text-3xl font-black text-emerald-400">{liveHealthScore}%</span>
              </div>
              <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${liveHealthScore}%` }}
                  className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                />
              </div>
              <p className="text-[9px] text-center text-zinc-600 font-black uppercase tracking-[0.2em]">
                Tree scaling responds in real-time to each mission update
              </p>
            </div>
          </section>

          {/* Interaction Column */}
          <section className="lg:col-span-5 space-y-8 h-full flex flex-col">
            
            {/* Missions Card */}
            <div className="bg-zinc-900/40 border border-zinc-900 p-8 rounded-[2.5rem] flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black tracking-tight flex items-center">
                  <Zap className="w-5 h-5 mr-3 text-yellow-500" />
                  Daily Quests
                </h2>
                <div className="bg-zinc-950 px-3 py-1 rounded-full text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                  {completedTasks.size}/{habits.length}
                </div>
              </div>
              
              <div className="space-y-3 flex-1 overflow-y-auto pr-3 custom-scrollbar max-h-[360px]">
                {habits.map((id) => {
                  const done = completedTasks.has(id);
                  return (
                    <button
                      key={id}
                      onClick={() => toggleTask(id)}
                      className={`w-full flex items-center gap-4 p-5 rounded-3xl border-2 text-left transition-all ${
                        done ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400" : "bg-zinc-950/50 border-zinc-900 text-zinc-500 hover:border-zinc-800 hover:bg-zinc-900"
                      }`}
                    >
                      {done ? <CheckCircle2 className="w-6 h-6 flex-shrink-0" /> : <Circle className="w-6 h-6 flex-shrink-0" />}
                      <span className="font-bold text-sm tracking-tight">{HABIT_LABELS[id] || id}</span>
                      {done && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto text-[8px] font-black uppercase tracking-tighter bg-emerald-500 text-black px-2 py-0.5 rounded-full">Synced</motion.span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Squad Card */}
            <div className="bg-zinc-900/40 border border-zinc-900 p-8 rounded-[2.5rem]">
              <div className="flex items-center justify-between mb-6 text-zinc-200">
                <h2 className="text-xl font-black tracking-tight flex items-center">
                  <Users className="w-5 h-5 mr-3" />
                  Squad
                </h2>
                <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                  <DialogTrigger className="h-8 px-4 rounded-full border border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                     + Invite
                  </DialogTrigger>
                  <DialogContent className="bg-zinc-950 border-zinc-800 text-white p-8 rounded-[2.5rem]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-black tracking-tighter">Campus Invitation</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <Input placeholder="university_id@campus.edu" className="bg-zinc-900 border-zinc-800 rounded-xl h-12" />
                      <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-black uppercase tracking-widest text-xs" onClick={() => {toast.success("Invitation Sent!"); setIsInviteOpen(false);}}>Deploy Invite</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                {members.map((m, i) => (
                  <MemberCard key={i} member={m} index={i} />
                ))}
              </div>
            </div>

          </section>

        </main>
      </div>
      <MilestoneModal 
        isOpen={showMilestone} 
        onClose={() => setShowMilestone(false)}
        milestone={{
          title: "7-Day Legend Status",
          reward: "Golden Tree Badge & 1000 Campus Points",
          icon: "🌟"
        }}
      />
      <MilestoneModal 
        isOpen={showMilestone} 
        onClose={() => setShowMilestone(false)}
        milestone={{
          title: "7-Day Legend Status",
          reward: "Golden Tree Badge & 1000 Campus Points",
          icon: "🌟"
        }}
      />
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
      `}</style>
    </div>
  );
}
