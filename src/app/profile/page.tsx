import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();

  // 1. Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/auth");
  }

  // Get user's linked OAuth identities directly from Supabase session
  const { data: identities } = await supabase.auth.getUserIdentities();

  // 2. Fetch or create custom record in `users` table
  let { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    const githubUsername = user.user_metadata?.preferred_username || null;
    const name = user.user_metadata?.full_name || user.email?.split('@')[0] || "Hacker";

    const { data: newProfile, error: insertError } = await supabase
      .from("users")
      .insert({
        id: user.id,
        name: name,
        github_username: githubUsername,
      })
      .select()
      .single();

    if (!insertError) profile = newProfile;
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 flex justify-center">
      <div className="w-full max-w-3xl space-y-6 mt-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Profile Settings</h1>
          <p className="text-zinc-400 mt-1">Manage your identity and linked coding platforms.</p>
        </div>
        
        <div className="bg-zinc-900 shadow-2xl border border-zinc-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <ProfileForm user={user} profile={profile} identities={identities?.identities || []} />
        </div>
      </div>
    </div>
  );
}
