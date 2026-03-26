"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Custom Github Icon 
const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  const getURL = () => {
    let url =
      process.env.NEXT_PUBLIC_SITE_URL ?? 
      process.env.NEXT_PUBLIC_VERCEL_URL ?? 
      'http://localhost:3000/';
    url = url.includes('http') ? url : `https://${url}`;
    url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
    return `${url}api/auth/callback`;
  };

  const handleOAuthLogin = async (provider: 'github') => {
    setIsLoading(true);
    
    // Check if Supabase is properly configured or using defaults
    const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                   process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

    if (isMock) {
      toast.info("Mocking GitHub Login...");
      setTimeout(() => {
        localStorage.setItem('mock_github_user', 'Developer');
        router.push('/onboarding');
        setIsLoading(false);
      }, 500);
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: getURL() },
    });
    if (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (action: 'login' | 'signup', e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in both email and password.");
      return;
    }
    setIsLoading(true);
    
    let error;
    if (action === 'login') {
      const res = await supabase.auth.signInWithPassword({ email, password });
      error = res.error;
    } else {
      const res = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: getURL()
        } 
      });
      error = res.error;
    }

    if (error) {
      toast.error(error.message);
    } else {
      if (action === 'signup') {
        toast.success("Account created successfully! Welcome to Campus.");
      } else {
        toast.success("Successfully logged in.");
      }
      router.push('/onboarding');
    }
    setIsLoading(false);
  };

  const handleLeetCodeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leetcodeUsername) return;
    setIsLoading(true);
    // Explicit manual login path for LeetCode hackathon MVP bypass
    localStorage.setItem('mock_leetcode_user', leetcodeUsername);
    router.push('/onboarding');
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950">
      <section className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 lg:px-12 py-12 relative overflow-hidden max-w-[1400px] mx-auto gap-12 w-full">
        
        {/* Background gradient effect */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
        
        {/* Hero Section (Left) */}
        <motion.div
           initial={{ opacity: 0, x: -30 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8 }}
           className="relative z-10 flex-1 space-y-6 text-center lg:text-left pt-12 lg:pt-0"
        >
          <div className="inline-flex items-center space-x-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 text-sm font-medium text-zinc-300">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>Welcome to Co-op Campus</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Grow Together. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
              Code Every Day.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            A gamified, group-first habit tracker for CS students. Join a squad, keep your daily coding streak alive, and watch your collective tree bloom.
          </p>
        </motion.div>

        {/* Auth Section (Right) */}
        <motion.div
           initial={{ opacity: 0, x: 30 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="relative z-10 w-full max-w-md mt-8 lg:mt-0"
        >
          <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-zinc-950 border border-zinc-800 rounded-xl p-1 h-auto">
                <TabsTrigger value="login" className="rounded-lg py-2.5 data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400">Login</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-lg py-2.5 data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="m-0 space-y-4">
                <form onSubmit={(e) => handleEmailAuth('login', e)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-zinc-300">Email</Label>
                    <Input 
                      id="login-email" 
                      type="email" 
                      placeholder="student@university.edu" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-zinc-300">Password</Label>
                    <Input 
                      id="login-password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-emerald-500"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium h-11"
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="m-0 space-y-4">
                <form onSubmit={(e) => handleEmailAuth('signup', e)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-zinc-300">Email</Label>
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder="student@university.edu" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-zinc-300">Password</Label>
                    <Input 
                      id="signup-password" 
                      type="password" 
                      placeholder="Create a strong password" 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-emerald-500"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium h-11"
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-zinc-900 px-3 text-zinc-500 font-medium">Or continue with</span>
                </div>
              </div>

              <Button
                onClick={() => handleOAuthLogin('github')}
                disabled={isLoading}
                variant="outline"
                className="w-full h-11 bg-[#24292e] hover:bg-[#2f363d] text-white border-0 font-medium transition-colors"
              >
                <GithubIcon className="w-5 h-5 mr-3" />
                Sign in with GitHub
              </Button>

              <form onSubmit={handleLeetCodeLogin} className="pt-4 mt-4 border-t border-zinc-800 space-y-3">
                <Input
                  type="text"
                  placeholder="LeetCode Username"
                  value={leetcodeUsername}
                  onChange={(e) => setLeetcodeUsername(e.target.value)}
                  className="h-11 bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-emerald-500"
                />
                <Button
                  type="submit"
                  disabled={isLoading || !leetcodeUsername}
                  className="w-full h-11 bg-[#FFA116] hover:bg-[#ffb347] text-black border-0 font-semibold transition-colors"
                >
                  Sign in with LeetCode
                </Button>
              </form>

            </Tabs>
          </div>
        </motion.div>

      </section>

      {/* Live Campus Section */}
      <section className="py-24 px-6 border-t border-zinc-900 bg-zinc-950/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Live from Campus</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto">
              Real squads, real progress. Join one of these active groups or create your own legendary team.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Alpha Squad", status: "Full", members: 4, icon: "🌸", color: "from-emerald-500/20" },
              { name: "Byte Blazers", status: "2 Spots Left", members: 2, icon: "🌳", color: "from-blue-500/20" },
              { name: "Code Clan", status: "1 Spot Left", members: 3, icon: "🌿", color: "from-purple-500/20" },
              { name: "Debug Duo", status: "2 Spots Left", members: 2, icon: "🌱", color: "from-amber-500/20" },
            ].map((squad) => (
              <motion.div
                key={squad.name}
                whileHover={{ y: -5 }}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${squad.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10 space-y-4">
                  <div className="text-4xl">{squad.icon}</div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{squad.name}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-xs font-semibold ${squad.status === 'Full' ? 'text-zinc-600' : 'text-emerald-500'}`}>
                        {squad.status}
                      </span>
                      <span className="text-xs text-zinc-500">{squad.members}/4 Members</span>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${i < squad.members ? 'bg-emerald-500' : 'bg-zinc-800'}`} />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center pt-8">
            <p className="text-zinc-600 text-sm">
              Join <span className="text-white font-medium">120+ students</span> growing their skills today.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-zinc-900 bg-zinc-950 text-center">
        <p className="text-zinc-600 text-sm">© 2026 Co-op Campus. All rights reserved.</p>
      </footer>
    </div>
  );
}
