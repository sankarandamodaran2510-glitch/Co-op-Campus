import { useState } from 'react'
import '../App.css'

interface Challenge {
  id: number
  title: string
  participants: number
  reward: string
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert'
  joined: boolean
}

function Challenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([
    { id: 1, title: 'LeetCode 7-Day Sprint', participants: 124, reward: 'Bronze Trophy', difficulty: 'Medium', joined: false },
    { id: 2, title: 'GitHub Open Source Drive', participants: 45, reward: 'Silver Badge', difficulty: 'Hard', joined: true },
    { id: 3, title: 'System Design Bootcamp', participants: 88, reward: 'Surprise Gift', difficulty: 'Expert', joined: false },
  ])

  const toggleJoin = (id: number) => {
    setChallenges(prev => prev.map(c => 
      c.id === id ? { ...c, joined: !c.joined, participants: c.joined ? c.participants - 1 : c.participants + 1 } : c
    ))
  }

  return (
    <div className="challenges">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <h2>Active Challenges</h2>
        <div style={{display: 'flex', gap: '0.5rem'}}>
          <button className="glass" style={{padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem'}}>All</button>
          <button className="glass" style={{padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', background: 'rgba(16, 185, 129, 0.1)'}}>Individual</button>
          <button className="glass" style={{padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', background: 'rgba(99, 102, 241, 0.1)'}}>Team</button>
        </div>
      </div>

      <div className="card-grid">
        {challenges.map(challenge => (
          <div key={challenge.id} className="card glass" style={{ border: challenge.joined ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
              <h3 style={{fontSize: '1.1rem'}}>{challenge.title}</h3>
              <span className="badge" style={{
                background: challenge.difficulty === 'Expert' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                color: challenge.difficulty === 'Expert' ? '#ef4444' : 'var(--primary)'
              }}>{challenge.difficulty}</span>
            </div>
            <div style={{marginBottom: '1.5rem'}}>
              <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>👥 {challenge.participants} students joined</div>
              <div style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem'}}>🎁 Reward: {challenge.reward}</div>
            </div>
            <button 
              onClick={() => toggleJoin(challenge.id)}
              style={{
                width: '100%', 
                padding: '0.75rem', 
                background: challenge.joined ? 'rgba(16, 185, 129, 0.1)' : 'var(--primary)', 
                color: challenge.joined ? 'var(--primary)' : 'white',
                borderRadius: 'var(--radius-md)', 
                fontWeight: 700,
                border: challenge.joined ? '1px solid var(--primary)' : 'none'
              }}
            >
              {challenge.joined ? '✓ Joined' : 'Join Challenge'}
            </button>
          </div>
        ))}
      </div>

      <div className="card glass" style={{marginTop: '2rem', background: 'rgba(99, 102, 241, 0.05)'}}>
        <h3>Upcoming Team-only Battles</h3>
        <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem'}}>
          Teams of 4 are required. Streaks only count if all members submit daily.
        </p>
        <div style={{marginTop: '1.5rem', padding: '1.5rem', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)', textAlign: 'center'}}>
          <span style={{fontSize: '2rem', display: 'block', marginBottom: '0.5rem'}}>🏆</span>
          <div style={{fontSize: '1rem', fontWeight: 700}}>Inter-Department Hackathon Prep</div>
          <div style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem'}}>Starts in 3 days • Registration Open</div>
          <button style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', background: 'white', color: 'black', borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '0.8rem' }}>Register Team</button>
        </div>
      </div>
    </div>
  )
}

export default Challenges
