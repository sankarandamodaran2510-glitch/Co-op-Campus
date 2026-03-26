"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Code2, Link as LinkIcon, Save } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

// Custom Github Icon 
const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

export default function ProfileForm({ 
  user, 
  profile, 
  identities 
}: { 
  user: any, 
  profile: any, 
  identities: any[] 
}) {
  const [displayName, setDisplayName] = useState(profile?.name || "");
  const [leetcodeUsername, setLeetcodeUsername] = useState(profile?.leetcode_username || "");
  const [isSavingName, setIsSavingName] = useState(false);
  const [isLinkingLeetcode, setIsLinkingLeetcode] = useState(false);
  const [isLinkingGithub, setIsLinkingGithub] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  const hasGithubIdentity = identities.some(id => id.provider === 'github');

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName) return;
    setIsSavingName(true);

    try {
      const res = await fetch("/api/profile/update-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: displayName }),
      });

      if (!res.ok) throw new Error("Failed to update name");
      toast.success("Display name has been updated!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSavingName(false);
    }
  };

  const handleLinkLeetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leetcodeUsername) return;
    setIsLinkingLeetcode(true);
    
    try {
      const res = await fetch("/api/auth/link-leetcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leetcode_username: leetcodeUsername }),
      });

      if (!res.ok) throw new Error("Failed to link LeetCode account");
      toast.success("LeetCode account successfully verified and linked!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLinkingLeetcode(false);
    }
  };

  const handleLinkGithub = async () => {
    setIsLinkingGithub(true);
    
    let url = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL ?? 'http://localhost:3000/';
    url = url.includes('http') ? url : `https://${url}`;
    url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
    const redirectUrl = `${url}api/auth/callback?next=/profile`;

    const { error } = await supabase.auth.linkIdentity({
      provider: 'github',
      options: {
        redirectTo: redirectUrl
      }
    });

    if (error) {
      toast.error(`Failed to link GitHub: ${error.message}`);
      setIsLinkingGithub(false);
    } else {
      toast.success("Redirecting to GitHub to link account...");
    }
  };

  return (
    <div className="space-y-10 relative z-10 text-zinc-100">
      
      {/* SECTION 1: Basic Info */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold border-b border-zinc-800 pb-2">1. Basic Info</h3>
        
        <div className="space-y-4 bg-zinc-950/40 p-5 rounded-xl border border-zinc-800">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-400">Email Address</Label>
            <Input 
              id="email" 
              type="text" 
              value={user.email} 
              disabled 
              className="bg-zinc-900 border-zinc-800 text-zinc-500 cursor-not-allowed"
            />
          </div>

          <form onSubmit={handleUpdateName} className="space-y-2">
            <Label htmlFor="displayName" className="text-zinc-400">Display Name</Label>
            <div className="flex space-x-3">
              <Input 
                id="displayName" 
                type="text" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-white focus-visible:ring-emerald-500"
              />
              <Button 
                type="submit" 
                disabled={isSavingName || !displayName || displayName === profile?.name}
                className="bg-zinc-800 hover:bg-zinc-700 text-white"
              >
                {isSavingName ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save</>}
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* SECTION 2: Linked Coding Accounts */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold border-b border-zinc-800 pb-2">2. Linked Coding Accounts</h3>
        <p className="text-sm text-zinc-400">Link your platforms so Co-op Campus can track your daily habits automatically.</p>
        
        <div className="space-y-4">
          
          {/* GitHub Integration */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-zinc-950/50 border border-zinc-800 rounded-xl gap-4">
            <div className="flex items-center space-x-3">
              <GithubIcon className="w-8 h-8 text-zinc-100 p-1.5 bg-zinc-900 rounded-lg border border-zinc-700" />
              <div>
                <p className="font-medium text-white">GitHub</p>
                <p className="text-xs text-zinc-400">For tracking daily code commits</p>
              </div>
            </div>
            
            {hasGithubIdentity ? (
              <span className="flex items-center text-sm text-emerald-400 font-medium px-3 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 w-fit">
                GitHub Connected <CheckCircle2 className="w-4 h-4 ml-1.5" />
              </span>
            ) : (
              <Button 
                onClick={handleLinkGithub} 
                disabled={isLinkingGithub}
                variant="outline" 
                className="bg-[#24292e] border-0 hover:bg-[#2f363d] text-white"
              >
                {isLinkingGithub ? "Linking..." : "Link GitHub Account"}
              </Button>
            )}
          </div>

          {/* LeetCode Integration */}
          <div className="flex flex-col space-y-4 p-4 bg-zinc-950/50 border border-zinc-800 rounded-xl">
            <div className="flex items-center space-x-3">
              <Code2 className="w-8 h-8 text-yellow-500 p-1.5 bg-zinc-900 rounded-lg border border-zinc-700" />
              <div>
                <p className="font-medium text-white">LeetCode</p>
                <p className="text-xs text-zinc-400">Enter your public LeetCode handle to track daily problem-solving.</p>
              </div>
            </div>
            
            <form onSubmit={handleLinkLeetCode} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="text"
                placeholder="LeetCode Username"
                value={leetcodeUsername}
                onChange={(e) => setLeetcodeUsername(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-emerald-500 max-w-[250px]"
              />
              <Button 
                type="submit" 
                disabled={isLinkingLeetcode || !leetcodeUsername}
                className="bg-[#FFA116] hover:bg-[#ffb347] text-black w-full sm:w-auto font-medium"
              >
                {isLinkingLeetcode ? "Verifying..." : "Verify & Save"}
              </Button>
            </form>
            {profile?.leetcode_username && (
               <div className="flex items-center text-sm text-emerald-400 mt-2">
                 <CheckCircle2 className="w-4 h-4 mr-1.5" /> 
                 Currently tracking: <span className="font-semibold ml-1">{profile.leetcode_username}</span>
               </div>
            )}
          </div>
        </div>
      </section>
      
      <div className="pt-6">
        <Button 
          onClick={() => router.push('/dashboard')}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-12 text-lg font-medium"
        >
          Go to Squad Dashboard
        </Button>
      </div>
    </div>
  );
}
