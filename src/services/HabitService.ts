export interface ActivityData {
  platform: 'leetcode' | 'codeforces' | 'github'
  username: string
  streak: number
  lastSubmission: string
  submittedToday: boolean
  recentActivity: string[] // Added for functional mockup
}

class HabitService {
  private mockActivities = [
    { platform: 'github', titles: ['Initial commit: Login page', 'Fixed CSS layout bugs', 'Added HabitService logic', 'Refactored TreeVisualizer', 'Updated README'] },
    { platform: 'leetcode', titles: ['Solved: Two Sum', 'Solved: Longest Palindromic Substring', 'Solved: Binary Tree Inorder Traversal', 'Attempted: Median of Two Sorted Arrays'] }
  ]

  async checkActivity(username: string): Promise<ActivityData | null> {
    // Simulate real-world API latency
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const githubTitles = this.mockActivities[0].titles
    const leetcodeTitles = this.mockActivities[1].titles
    
    return {
      platform: 'github',
      username: username + '_dev',
      streak: 12,
      lastSubmission: new Date().toISOString(),
      submittedToday: true,
      recentActivity: [
        githubTitles[Math.floor(Math.random() * githubTitles.length)],
        leetcodeTitles[Math.floor(Math.random() * leetcodeTitles.length)]
      ]
    }
  }

  calculateTeamStreak(members: any[]): number {
    return Math.min(...members.map(m => m.day || 0))
  }
}

export const habitService = new HabitService()
