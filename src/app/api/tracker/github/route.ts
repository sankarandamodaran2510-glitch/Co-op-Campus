import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Missing username parameter" }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.github.com/users/${username}/events/public`, {
      headers: {
        "User-Agent": "co-op-campus-tracker",
      },
      next: { revalidate: 0 } // Always fetch fresh data
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with status: ${response.status}`);
    }

    const events = await response.json();
    
    // Using current UTC date; in reality, align with user time zone if needed
    const today = new Date().toISOString().split('T')[0];
    
    // Find today's PushEvents
    const pushEvent = events.find((event: any) => {
      const isPush = event.type === "PushEvent";
      const isToday = event.created_at.startsWith(today);
      return isPush && isToday;
    });

    if (!pushEvent) {
      return NextResponse.json({ passed_today: false, commit_message: null });
    }

    const commits = pushEvent.payload.commits || [];
    
    // Filter out trivial commits
    const meaningfulCommit = commits.find((c: any) => {
      const msg = c.message.toLowerCase();
      return !msg.includes("update readme") && !msg.includes("merge pull request");
    }) || commits[0];

    return NextResponse.json({
      passed_today: true,
      commit_message: meaningfulCommit ? meaningfulCommit.message : "Pushed code",
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
