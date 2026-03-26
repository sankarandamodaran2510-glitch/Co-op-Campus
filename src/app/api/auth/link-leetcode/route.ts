import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const { leetcode_username } = await request.json();

    if (!leetcode_username) {
      return NextResponse.json({ error: "Missing leetcode_username parameter" }, { status: 400 });
    }

    const supabase = await createClient();

    // Authenticate user session
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update the custom users table
    const { error: updateError } = await supabase
      .from('users')
      .update({ leetcode_username })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ success: true, message: "LeetCode linked successfully" });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
