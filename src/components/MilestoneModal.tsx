import React from 'react'
import '../App.css'

interface MilestoneModalProps {
  isOpen: boolean
  onClose: () => void
  milestone: {
    title: string
    reward: string
    icon: string
  }
}

const MilestoneModal: React.FC<MilestoneModalProps> = ({ isOpen, onClose, milestone }) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content glass">
        <div style={{fontSize: '4rem', marginBottom: '1.5rem'}}>{milestone.icon}</div>
        <h2 className="gradient-text" style={{fontSize: '2rem', marginBottom: '1rem'}}>Milestone Achieved!</h2>
        <h3 style={{marginBottom: '0.5rem'}}>{milestone.title}</h3>
        <p style={{color: 'var(--text-muted)', marginBottom: '2rem'}}>
          Your team has grown 10 trees together. You've unlocked the <strong>{milestone.reward}</strong>!
        </p>
        <button 
          onClick={onClose}
          style={{
            padding: '0.8rem 2rem', 
            background: 'var(--primary)', 
            color: 'white', 
            borderRadius: 'var(--radius-md)', 
            fontWeight: 700,
            width: '100%'
          }}
        >
          Claim Reward & Continue
        </button>
      </div>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(8px);
        }
        .modal-content {
          width: 90%;
          max-width: 450px;
          padding: 3rem;
          border-radius: var(--radius-lg);
          text-align: center;
          animation: modal-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes modal-pop {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default MilestoneModal
