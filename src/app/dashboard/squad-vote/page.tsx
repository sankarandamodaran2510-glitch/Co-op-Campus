"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// Re-using mock data from dashboard
const MOCK_TEAM = [
  {
    name: "Alex",
    avatar: "https://github.com/shadcn.png",
  },
  {
    name: "Sam",
    avatar: "https://github.com/vercel.png",
  },
  {
    name: "Jordan",
    avatar: "",
  },
  {
    name: "Taylor",
    avatar: "",
  }
];

export default function SquadVotePage() {
  const [teamMembers, setTeamMembers] = useState<{name: string, avatar: string}[]>([]);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());
  const [kickedMember, setKickedMember] = useState<string | null>(null);

  // Load team members from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("squad_members");
    if (saved) {
      const parsed = JSON.parse(saved);
      setTeamMembers(parsed.map((m: any) => ({ name: m.name, avatar: m.avatar })));
      
      const initialVotes: Record<string, number> = {};
      parsed.forEach((m: any) => {
        initialVotes[m.name] = 0;
      });
      setVotes(initialVotes);
    }
  }, []);

  const totalVotesCast = Object.values(votes).reduce((a, b) => a + b, 0);
  const majorityThreshold = Math.max(2, Math.ceil((teamMembers.length + 1) / 2)); 

  const handleToggleVote = (memberName: string) => {
    if (kickedMember) return; // Stop voting if someone is already kicked

    setUserVotes((prev) => {
      const newVotes = new Set(prev);
      const isVoting = !newVotes.has(memberName);
      
      if (isVoting) {
        newVotes.add(memberName);
        setVotes(v => {
          const updated = { ...v, [memberName]: v[memberName] + 1 };
          checkMajorityBlocker(memberName, updated[memberName]);
          return updated;
        });
      } else {
        newVotes.delete(memberName);
        setVotes(v => ({ ...v, [memberName]: v[memberName] - 1 }));
      }
      
      return newVotes;
    });
  };

  const checkMajorityBlocker = (memberName: string, newVoteCount: number) => {
    if (newVoteCount >= majorityThreshold) {
      setKickedMember(memberName);
      
      // PERSISTENT REMOVAL: Actually remove from localStorage
      const saved = localStorage.getItem("squad_members");
      if (saved) {
        const parsed = JSON.parse(saved);
        const filtered = parsed.filter((m: any) => m.name !== memberName);
        localStorage.setItem("squad_members", JSON.stringify(filtered));
      }

      toast.error(`${memberName} has received majority votes and is kicked out of the squad.`);
    }
  };

  // WhatsApp-style poll bar calculation
  const getVotePercentage = (count: number) => {
    if (totalVotesCast === 0) return 0;
    return (count / majorityThreshold) * 100;
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8 flex justify-center pt-16">
      <div className="w-full max-w-lg space-y-6">
        
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/dashboard" className="text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <ShieldAlert className="w-6 h-6 mr-2 text-emerald-500" />
              Squad Tribune
            </h1>
            <p className="text-sm text-zinc-400">Democratic voting system for team behavioral issues</p>
          </div>
        </div>

        {/* WhatsApp Style Poll Card */}
        <div className="bg-[#111b21] border border-zinc-800/50 rounded-2xl p-4 md:p-6 shadow-xl relative overflow-hidden">
          {kickedMember && (
            <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-zinc-900 border border-red-500/30 p-6 rounded-xl text-center max-w-[80%] shadow-2xl space-y-3">
                <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
                <h3 className="text-xl font-bold text-white">Democracy has spoken</h3>
                <p className="text-zinc-300">
                  <span className="font-semibold text-red-400">{kickedMember}</span> has been voted out of the squad.
                </p>
                <Link href="/dashboard" className="mt-4 inline-block text-emerald-400 hover:underline">
                  Return to Dashboard
                </Link>
              </div>
            </div>
          )}

          <div className="mb-6 space-y-2">
            <p className="text-white text-lg font-medium leading-snug">
              Vote to remove toxic player from the squad
            </p>
            <p className="text-zinc-400 text-sm">
              Majority threshold ({majorityThreshold} votes) required for kicking.
            </p>
          </div>

          <div className="space-y-3">
            {teamMembers.map((member) => {
              const count = votes[member.name] || 0;
              const percentage = getVotePercentage(count);
              const isSelected = userVotes.has(member.name);

              return (
                <div 
                  key={member.name}
                  onClick={() => handleToggleVote(member.name)}
                  className="group relative cursor-pointer"
                >
                  <div className="relative z-10 flex items-center justify-between p-3 rounded-lg border border-transparent hover:bg-white/5 transition-colors">
                    <div className="flex items-center space-x-3 w-full max-w-[70%]">
                      <div className="flex-shrink-0 w-6 flex justify-center">
                        <AnimatePresence mode="wait">
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                            >
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <Avatar className="w-8 h-8 border border-zinc-700">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-zinc-800 text-xs">
                          {member.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-zinc-200 font-medium truncate">{member.name}</span>
                    </div>

                    {/* Progress Bar Background */}
                    <div 
                      className="absolute left-0 top-0 bottom-0 bg-emerald-500/10 rounded-lg pointer-events-none transition-all duration-500 ease-out"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                    
                    {/* Vote Count visible */}
                    {count > 0 && (
                      <span className="text-emerald-500/80 text-sm font-semibold pr-2">
                        {count}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 pt-4 border-t border-zinc-800/50 flex justify-between text-xs text-zinc-500">
            <span>{totalVotesCast} votes so far</span>
            <span>Majority threshold: {majorityThreshold}</span>
          </div>

        </div>
      </div>
    </div>
  );
}
