import { useState } from 'react'
import '../App.css'

interface Event {
  id: number
  recruiter: string
  title: string
  type: string
  date: string
  participating: boolean
}

function RecruiterHub() {
  const [events, setEvents] = useState<Event[]>([
    { id: 1, recruiter: 'Google', title: 'Modern Backend Architecture', type: 'Lecture', date: 'March 28', participating: false },
    { id: 2, recruiter: 'Amazon', title: 'Scale with AWS Lambda', type: 'Bootcamp', date: 'April 02', participating: true },
    { id: 3, recruiter: 'Stripe', title: 'Payments Infrastructure at Scale', type: 'Collab', date: 'April 05', participating: false },
  ])

  const toggleParticipate = (id: number) => {
    setEvents(prev => prev.map(e => 
      e.id === id ? { ...e, participating: !e.participating } : e
    ))
  }

  return (
    <div className="recruiter-hub">
      <div style={{marginBottom: '2rem'}}>
        <h2 className="gradient-text" style={{fontSize: '2rem'}}>Recruiter Hub</h2>
        <p style={{color: 'var(--text-muted)'}}>Connect with industry specialists and build your career through collaboration.</p>
      </div>

      <div className="card-grid">
        <div className="card glass" style={{gridColumn: 'span 2'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
            <h3>Industry Specialist Sessions</h3>
            <button style={{color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600}}>View All Events →</button>
          </div>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            {events.map(event => (
              <div key={event.id} className="glass" style={{
                padding: '1.25rem', 
                borderRadius: 'var(--radius-md)', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                border: event.participating ? '1px solid var(--accent)' : '1px solid rgba(255, 255, 255, 0.05)',
                background: event.participating ? 'rgba(99, 102, 241, 0.05)' : 'transparent'
              }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
                  <div style={{width: '48px', height: '48px', background: 'var(--surface-hover)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, border: '1px solid rgba(255,255,255,0.1)'}}>
                    {event.recruiter[0]}
                  </div>
                  <div>
                    <div style={{fontSize: '1rem', fontWeight: 700}}>{event.title}</div>
                    <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>by {event.recruiter} • {event.type}</div>
                  </div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div style={{fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)'}}>{event.date}</div>
                  <button 
                    onClick={() => toggleParticipate(event.id)}
                    style={{
                      marginTop: '0.5rem', 
                      padding: '0.5rem 1rem', 
                      background: event.participating ? 'var(--accent)' : 'rgba(99, 102, 241, 0.1)', 
                      color: event.participating ? 'white' : 'var(--accent)', 
                      borderRadius: 'var(--radius-sm)', 
                      fontSize: '0.75rem', 
                      fontWeight: 800,
                      border: 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {event.participating ? '✓ Registered' : 'Participate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card glass" style={{background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)', border: '1px solid rgba(255,255,255,0.1)'}}>
          <h3>Recruiter Match Score</h3>
          <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem'}}>Your current tree health matches you with top tech recruiters.</p>
          <div style={{marginTop: '2.5rem', textAlign: 'center'}}>
            <div style={{fontSize: '3.5rem', fontWeight: 800, color: 'var(--primary)', textShadow: '0 0 20px rgba(16, 185, 129, 0.3)'}}>84%</div>
            <div style={{fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '0.5rem'}}>Match Probability</div>
          </div>
          <button style={{width: '100%', marginTop: '2.5rem', padding: '0.8rem', background: 'white', color: 'black', borderRadius: 'var(--radius-md)', fontWeight: 700, border: 'none'}}>
            Share Profile with Recruiters
          </button>
        </div>
      </div>
    </div>
  )
}

export default RecruiterHub
