import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Vercel Cron will send a POST request here
export async function POST(request: Request) {
  // In a real Vercel Cron, verify the Authorization header
  const authHeader = request.headers.get("Authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Supabase client init (Requires environment variables)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock.supabase.co";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "mock_key";
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // 1. Fetch all teams
    const { data: teams, error: teamsError } = await supabase.from("teams").select("*");
    
    if (teamsError) throw teamsError;
    if (!teams || teams.length === 0) return NextResponse.json({ message: "No teams to evaluate" });

    const results = [];

    // 2. Loop through each team
    for (const team of teams) {
      // Fetch users for this team
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("*")
        .eq("team_id", team.id);

      if (usersError) continue;

      let passedCount = 0;

      // 3. Evaluate each user
      for (const user of users || []) {
        let passedToday = false;
        let commitMessage = null;

        if (user.github_username) {
          // Internal call to our Github Tracker (or direct fetch if preferred)
          // For simplicity in a CRON job, we fetch directly or import the logic.
          // Using fetch since it's an API route. 
          try {
            // NOTE: In production, URL should be absolute (e.g., process.env.NEXT_PUBLIC_SITE_URL)
            // Here we skip the http actual call and mock the external check for the hackathon MVP, 
            // since this is server-side and `localhost` might not be reachable from Vercel CRON.
            
            // Abstract logic that normally hits GitHub:
            const ghRes = await fetch(`https://api.github.com/users/${user.github_username}/events/public`);
            if (ghRes.ok) {
               const events = await ghRes.json();
               const today = new Date().toISOString().split('T')[0];
               const push = events.find((e: any) => e.type === "PushEvent" && e.created_at.startsWith(today));
               if (push) {
                 passedToday = true;
                 commitMessage = push.payload.commits?.[0]?.message || "Pushed code";
               }
            }
          } catch (e) {
            console.error("Github fetch error for user:", user.github_username);
          }
        }

        if (passedToday) passedCount++;

        // Add to daily_logs
        await supabase.from("daily_logs").insert({
          user_id: user.id,
          passed_today: passedToday,
          commit_message: commitMessage,
          ai_verified: false, // Could call the AI route here if needed
        });
      }

      // 4. Mercy Rule Application
      // Team of 4: if 3 or 4 pass -> Success.
      const teamSize = users?.length || 4; // default to 4 for mercy rule logic
      const mercyThreshold = Math.floor(teamSize * 0.75); // 3 out of 4
      
      const teamPassed = passedCount >= mercyThreshold;

      let newScore = team.health_score + (teamPassed ? 10 : -10);
      newScore = Math.max(0, Math.min(100, newScore)); // Clamp between 0 and 100

      // Calculate new tree level
      let newLevel = 0;
      if (newScore >= 90) newLevel = 4;
      else if (newScore >= 60) newLevel = 3;
      else if (newScore >= 30) newLevel = 2;
      else if (newScore > 0) newLevel = 1;

      // 5. Update Team
      await supabase
        .from("teams")
        .update({ health_score: newScore, tree_level: newLevel })
        .eq("id", team.id);

      results.push({ team: team.name, previousScore: team.health_score, newScore, passedCount });
    }

    return NextResponse.json({ success: true, evaluations: results });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
