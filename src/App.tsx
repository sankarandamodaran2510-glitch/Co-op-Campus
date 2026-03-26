import { useState } from 'react'
import TreeVisualizer from './components/TreeVisualizer'
import Challenges from './components/Challenges'
import RecruiterHub from './components/RecruiterHub'
import TeamGarden from './components/TeamGarden'
import MilestoneModal from './components/MilestoneModal'
import { habitService } from './services/HabitService'
import './App.css'

interface Habit {
  id: number
  title: string
  type: string
  status: 'done' | 'pending'
}

const initialTestUsers = [
  { id: 1, name: 'Alice', day: 1, habitStatus: 'Sprout', level: 'Seedling' },
  { id: 2, name: 'Bob', day: 2, habitStatus: 'Growing', level: 'Seedling' },
  { id: 3, name: 'Charlie', day: 3, habitStatus: 'Growing', level: 'Sapling' },
  { id: 4, name: 'Diana', day: 4, habitStatus: 'Persistent', level: 'Sapling' },
  { id: 5, name: 'Ethan', day: 5, habitStatus: 'Strong', level: 'Sapling' },
  { id: 6, name: 'Fiona', day: 6, habitStatus: 'Robust', level: 'Pre-Garden' },
  { id: 7, name: 'George', day: 7, habitStatus: 'Harvested!', level: 'Garden' },
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [activeUserId, setActiveUserId] = useState(1)
  const [showMilestone, setShowMilestone] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncResults, setSyncResults] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)

  const [activeUsers, setActiveUsers] = useState(initialTestUsers)
  const [habits, setHabits] = useState<Habit[]>([
    { id: 1, title: 'LeetCode Daily', type: 'Coding', status: 'done' },
    { id: 2, title: 'DS & Algo Study', type: 'Academic', status: 'pending' },
    { id: 3, title: 'React Project', type: 'Extra', status: 'pending' },
  ])
  
  const [pastTrees, setPastTrees] = useState<any[]>([
    { id: '1', date: 'March Week 1', level: 'Sapling', score: 850, day: 4 },
    { id: '2', date: 'Feb Week 4', level: 'Garden', score: 1240, day: 7 },
  ])

  const currentUser = activeUsers.find(u => u.id === activeUserId) || activeUsers[0]

  const syncActivity = async () => {
    setIsSyncing(true)
    setShowResults(false)
    const data = await habitService.checkActivity(currentUser.name.toLowerCase())
    
    if (data) {
      setSyncResults(data.recentActivity)
      setShowResults(true)
      
      // Update the user's progress
      if (currentUser.day < 7) {
        setActiveUsers(prev => prev.map(u => 
          u.id === activeUserId ? { ...u, day: u.day + 1 } : u
        ))
      } else if (currentUser.day === 7) {
        // Harvest logic
        setPastTrees(prev => [
          { id: Date.now().toString(), date: 'Just Now', level: 'Harvested', score: 1200, day: 7 },
           ...prev
        ])
        setShowMilestone(true)
        // Reset to day 1 for demo
        setActiveUsers(prev => prev.map(u => 
          u.id === activeUserId ? { ...u, day: 1 } : u
        ))
      }
    }
    setIsSyncing(false)
    setTimeout(() => setShowResults(false), 4000)
  }

  const addHabit = () => {
    const title = prompt('Enter habit title:')
    if (title) {
      const type = prompt('Enter type (Coding/Academic/Extra):') || 'Extra'
      setHabits(prev => [...prev, { id: Date.now(), title, type, status: 'pending' }])
    }
  }

  const toggleHabit = (id: number) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, status: h.status === 'done' ? 'pending' : 'done' } : h))
  }

  return (
    <div className="app-container">
      <MilestoneModal 
        isOpen={showMilestone} 
        onClose={() => setShowMilestone(false)}
        milestone={{
          title: 'Tree Harvested! 🧺',
          reward: 'Garden Badge & 500 Campus Points',
          icon: '🌳'
        }}
      />

      <aside className="sidebar glass">
        <div className="logo">
          <div className="logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="gradient-text">Co-op Campus</span>
        </div>

        <nav className="nav-links">
          <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>🏠 Dashboard</button>
          <button className={`nav-item ${activeTab === 'challenges' ? 'active' : ''}`} onClick={() => setActiveTab('challenges')}>🏆 Challenges</button>
          <button className={`nav-item ${activeTab === 'team' ? 'active' : ''}`} onClick={() => setActiveTab('team')}>🌳 Team Garden</button>
          <button className={`nav-item ${activeTab === 'recruiter' ? 'active' : ''}`} onClick={() => setActiveTab('recruiter')}>💼 Recruiter Hub</button>
        </nav>

        {showResults && (
          <div className="glass" style={{ margin: '1rem', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary)', animation: 'slide-in 0.3s ease' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Sync Success!</div>
            {syncResults.map((r, i) => <div key={i} style={{ fontSize: '0.7rem', color: 'var(--text)', marginBottom: '0.2rem' }}>• {r}</div>)}
          </div>
        )}

        <div className="user-profile glass">
          <div className="avatar">{currentUser.name[0]}</div>
          <div className="user-info">
            <div style={{fontWeight: 700, fontSize: '0.9rem'}}>{currentUser.name}</div>
            <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{currentUser.level}</div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
          <div>
            <h1>{activeTab === 'dashboard' ? `Welcome back, ${currentUser.name}! 👋` : activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('team', 'Team Garden').replace('recruiter', 'Recruiter Hub')}</h1>
            <p style={{color: 'var(--text-muted)'}}>Current Streak: Day {currentUser.day} • {currentUser.habitStatus}</p>
          </div>
          <div className="header-actions" style={{display: 'flex', gap: '1rem'}}>
            <button className="glass" onClick={syncActivity} disabled={isSyncing} style={{ padding: '0.6rem 1.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, opacity: isSyncing ? 0.7 : 1 }}>
              <span>{isSyncing ? '⌛' : '🔄'}</span>
              <span>{isSyncing ? 'Syncing...' : 'Sync Activity'}</span>
            </button>
            <button onClick={addHabit} style={{padding: '0.6rem 1.2rem', background: 'var(--primary)', borderRadius: 'var(--radius-md)', color: 'white', fontWeight: 600}}>+ Create Habit</button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="dashboard">
            {/* User Switcher (Moved inside dashboard for cleaner header) */}
            <div className="glass" style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.8rem' }}>SELECT TEST USER:</span>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {activeUsers.map(u => (
                  <button key={u.id} onClick={() => setActiveUserId(u.id)} style={{ padding: '0.3rem 0.7rem', borderRadius: 'var(--radius-full)', background: activeUserId === u.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: activeUserId === u.id ? 'white' : 'var(--text)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.75rem', fontWeight: 700 }}>
                    {u.name} (D{u.day})
                  </button>
                ))}
              </div>
            </div>

            <div className="card-grid">
              <div className="card glass" style={{gridColumn: 'span 2', minHeight: '480px', display: 'flex', flexDirection: 'column'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                  <h3>Real-time Habit Growth</h3>
                  <div className="badge">{7 - currentUser.day} Days to Harvest</div>
                </div>
                <div className="tree-container" style={{flexGrow: 1}}>
                  <TreeVisualizer day={currentUser.day} />
                </div>
              </div>

              <div className="card glass">
                <h3>Your Habits</h3>
                <div style={{marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                  {habits.map(habit => (
                    <HabitItem key={habit.id} {...habit} onToggle={() => toggleHabit(habit.id)} />
                  ))}
                </div>
              </div>

              <div className="card glass">
                <h3>Campus Ranking</h3>
                <div style={{marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                  <LeaderboardItem rank={1} name="Bug Squashing Squad" score="2.4k pts" />
                  <LeaderboardItem rank={2} name="Byte Builders" score="2.1k pts" />
                  <LeaderboardItem rank={3} name={currentUser.name + "s Crew"} score="1.9k pts" isUserTeam />
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'challenges' && <Challenges />}
        {activeTab === 'team' && <TeamGarden pastTrees={pastTrees} />}
        {activeTab === 'recruiter' && <RecruiterHub />}
      </main>
    </div>
  )
}

function HabitItem({title, type, status, onToggle}: {title: string, type: string, status: 'done' | 'pending', onToggle: () => void}) {
  return (
    <div className="glass" style={{padding: '0.75rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255, 255, 255, 0.05)'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
        <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', background: type === 'Coding' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
          {type === 'Coding' ? '💻' : type === 'Academic' ? '📚' : '✨'}
        </div>
        <div>
          <div style={{fontSize: '0.85rem', fontWeight: 700}}>{title}</div>
          <div style={{fontSize: '0.7rem', color: 'var(--text-muted)'}}>{type}</div>
        </div>
      </div>
      <button onClick={onToggle} style={{ background: status === 'done' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)', color: status === 'done' ? 'var(--primary)' : 'var(--text-muted)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem', fontWeight: 800, border: status === 'done' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent' }}>
        {status === 'done' ? '✓ DONE' : 'TRACK'}
      </button>
    </div>
  )
}

function LeaderboardItem({rank, name, score, isUserTeam}: {rank: number, name: string, score: string, isUserTeam?: boolean}) {
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: isUserTeam ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.02)', border: isUserTeam ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid transparent'}}>
      <div style={{width: '24px', fontWeight: 800, color: rank === 1 ? '#fbbf24' : 'var(--text-muted)', textAlign: 'center'}}>{rank}</div>
      <div style={{flexGrow: 1, fontSize: '0.85rem', fontWeight: isUserTeam ? 700 : 500}}>{name}</div>
      <div style={{fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 800}}>{score}</div>
    </div>
  )
}

export default App
