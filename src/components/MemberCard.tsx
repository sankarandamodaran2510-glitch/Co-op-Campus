"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle2, Clock, XCircle } from "lucide-react";

export interface Member {
  name: string;
  avatar: string;
  status: "passed" | "pending" | "failed";
  latestCommit: string;
  aiVerified: boolean;
  isMe?: boolean;
}

interface MemberCardProps {
  member: Member;
  index: number;
}

export function MemberCard({ member, index }: MemberCardProps) {
  const isPassed = member.status === "passed";
  const isPending = member.status === "pending";
  const isFailed = member.status === "failed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.15, ease: "easeOut" }}
      className="h-full"
    >
      <motion.div
        animate={
          isPassed
            ? { borderColor: ["rgba(34, 197, 94, 0.2)", "rgba(34, 197, 94, 0.6)", "rgba(34, 197, 94, 0.2)"] }
            : member.isMe ? { borderColor: "rgba(16, 185, 129, 0.4)" } : { borderColor: "rgba(39, 39, 42, 0.5)" } 
        }
        transition={{ duration: 1, ease: "easeInOut", repeat: isPassed ? Infinity : 0 }}
        className={`h-full rounded-xl border ${member.isMe ? "bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.05)]" : ""}`}
      >
        <Card className={`h-full border-0 shadow-sm overflow-hidden flex flex-col ${member.isMe ? "bg-zinc-900/40" : "bg-zinc-900"}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 px-4 pt-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 border border-zinc-700 bg-zinc-800">
                <AvatarImage src={member.avatar || undefined} alt={member.name} />
                <AvatarFallback className="bg-zinc-800 text-zinc-400">
                  {member.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-zinc-100 flex items-center">
                  {member.name}
                  {member.isMe && <span className="ml-2 text-[8px] bg-emerald-500 text-black px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">You</span>}
                </span>
              </div>
            </div>
            {isPassed && (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Passed
              </Badge>
            )}
            {isPending && (
              <Badge variant="outline" className={`bg-yellow-500/10 text-yellow-500 border-yellow-500/20 ${member.isMe ? "animate-pulse" : ""}`}>
                <Clock className="w-3 h-3 mr-1" />
                Pending
              </Badge>
            )}
            {isFailed && (
              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                <XCircle className="w-3 h-3 mr-1" />
                Failed
              </Badge>
            )}
          </CardHeader>
          <CardContent className="px-4 pb-4 flex-1 flex flex-col justify-end">
            <div className="mt-4 bg-zinc-950/50 rounded-lg p-3 text-sm text-zinc-300 border border-zinc-800/50">
              <p className="line-clamp-2 font-mono text-xs">{member.latestCommit}</p>
            </div>
            {member.aiVerified && (
              <div className="mt-3 flex items-center">
                <Badge
                  variant="secondary"
                  className="bg-primary/5 text-primary hover:bg-primary/10 transition-colors border-primary/10 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                >
                  <Sparkles className="w-3 h-3 mr-1.5" />
                  AI Verified
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
