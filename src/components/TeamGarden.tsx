import TreeVisualizer from './TreeVisualizer'
import '../App.css'

interface PastTree {
  id: string
  date: string
  level: string
  score: number
  day: number
}

interface TeamGardenProps {
  pastTrees: PastTree[]
}

function TeamGarden({ pastTrees }: TeamGardenProps) {
  return (
    <div className="team-garden">
      <div style={{marginBottom: '2rem'}}>
        <h2>My Team's Garden</h2>
        <p style={{color: 'var(--text-muted)'}}>Collection of trees your team has grown over time.</p>
      </div>

      <div className="card-grid">
        {/* Current Active Tree Info */}
        <div className="card glass" style={{gridColumn: 'span 2', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid var(--primary)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
            <h3>Current Evolution Status</h3>
            <span className="badge" style={{background: 'var(--primary)', color: 'white'}}>ACTIVE GROWTH</span>
          </div>
          <div className="tree-container" style={{height: '300px'}}>
             <TreeVisualizer day={5} />
          </div>
          <div style={{display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)'}}>
             <div><strong>8 Trees</strong> to Garden Level</div>
             <div style={{color: 'var(--text-muted)'}}>|</div>
             <div><strong>2 Days</strong> to next harvest</div>
          </div>
        </div>

        {/* Level Info */}
        <div className="card glass">
          <h3>Garden Evolution</h3>
          <div style={{marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
             <LevelStep current label="Seedling Level" desc="1-5 trees collected" />
             <LevelStep label="Garden Level" desc="10 trees collected • Color changes!" />
             <LevelStep label="Forest Level" desc="25 trees collected • Surprise gifts" />
          </div>
        </div>

        {/* Past Collections */}
        <div className="card glass">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
            <h3>Past Collections</h3>
            <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>{pastTrees.length} Total</span>
          </div>
          <div style={{marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '250px', overflowY: 'auto', paddingRight: '0.5rem'}}>
            {pastTrees.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)' }}>
                No trees harvested yet. Complete a 7-day habit to see your first tree here!
              </div>
            ) : (
              pastTrees.map(tree => (
                <div key={tree.id} className="glass" style={{padding: '0.75rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255, 255, 255, 0.05)'}}>
                  <div style={{ flexGrow: 1 }}>
                    <div style={{fontSize: '0.9rem', fontWeight: 700}}>{tree.date}</div>
                    <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{tree.level} • {tree.score} pts</div>
                  </div>
                  <div style={{width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)'}}>
                     <TreeVisualizer day={tree.day} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function LevelStep({label, desc, current}: {label: string, desc: string, current?: boolean}) {
  return (
    <div style={{display: 'flex', gap: '1rem', alignItems: 'flex-start', opacity: current ? 1 : 0.5}}>
      <div style={{
        width: '24px', height: '24px', borderRadius: 'var(--radius-full)', 
        background: current ? 'var(--primary)' : 'var(--surface-hover)',
        border: current ? 'none' : '2px solid var(--border)',
        flexShrink: 0, marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px'
      }}>
        {current ? '✓' : ''}
      </div>
      <div>
        <div style={{fontSize: '1rem', fontWeight: 700, color: current ? 'var(--primary)' : 'var(--text)'}}>{label}</div>
        <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{desc}</div>
      </div>
    </div>
  )
}

export default TeamGarden
