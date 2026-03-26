"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, X } from 'lucide-react';

interface GiftsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GiftsModal: React.FC<GiftsModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            className="relative bg-zinc-950 border border-zinc-900 w-full max-w-md p-10 rounded-[3rem] text-center shadow-2xl"
          >
            <div className="absolute top-6 right-6">
              <button 
                onClick={onClose}
                className="p-2 hover:bg-zinc-900 rounded-full text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="w-24 h-24 bg-yellow-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-yellow-500/30">
              <Gift className="w-12 h-12 text-yellow-500" />
            </div>

            <h2 className="text-4xl font-black tracking-tighter text-white mb-4 uppercase">
              Surprising Gifts Unlocked!
            </h2>
            
            <p className="text-zinc-500 font-bold mb-8 uppercase tracking-widest text-xs leading-relaxed">
              You've successfully nurtured a 7-Day Legend. Your rewards have been added to your profile.
            </p>

            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-4 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-900">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-emerald-500" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-black uppercase text-white">Elite Squad Badge</div>
                  <div className="text-[10px] text-zinc-500">Show off your consistency</div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-900">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center text-lg">
                  🪙
                </div>
                <div className="text-left">
                  <div className="text-xs font-black uppercase text-white">+500 Campus Coins</div>
                  <div className="text-[10px] text-zinc-500">Spend them in the squad shop</div>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              Claim & Start New Cycle
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GiftsModal;
