import React from 'react';
import { Send, X, ShieldCheck, Sparkles, TrendingUp, Users } from 'lucide-react';
import botAvatarImg from '../assets/images/zohaib_bot_avatar_1784840026900.jpg';

interface TelegramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TELEGRAM_LINK = 'https://t.me/+8sP671dsgLg1MzMx';

export const TelegramModal: React.FC<TelegramModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleJoinTelegram = () => {
    window.open(TELEGRAM_LINK, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm sm:max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-5 sm:p-6 text-slate-100 relative overflow-hidden">
        
        {/* Glow Accent */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-slate-800/80 border border-slate-700/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center font-bold text-sm transition-all z-10"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Body */}
        <div className="text-center pt-2">
          
          <div className="relative inline-block mb-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-tr from-cyan-500 via-emerald-400 to-amber-400 shadow-xl mx-auto">
              <img
                src={botAvatarImg}
                alt="Bull Trader LLC Bot"
                className="w-full h-full object-cover rounded-full bg-slate-950"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-cyan-500 text-slate-950 p-1.5 rounded-full shadow-lg">
              <Send className="w-4 h-4 fill-slate-950" />
            </div>
          </div>

          <h3 className="font-black text-xl sm:text-2xl tracking-tight text-slate-100">
            Bull Trader LLC
          </h3>
          <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider mt-0.5 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Official Quotex VIP Channel
          </p>

          <div className="my-4 bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 text-left text-xs space-y-2 text-slate-300">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>Get 99% accuracy OTC signals for Quotex directly on Telegram.</span>
            </div>
            <div className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Daily live trading sessions, market news & win-rate proofs.</span>
            </div>
            <div className="flex items-start gap-2">
              <Users className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>Join over 15,000+ active traders in our official community!</span>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <button
              onClick={handleJoinTelegram}
              className="w-full bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm uppercase tracking-wider py-3 rounded-2xl shadow-lg shadow-cyan-500/25 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 fill-slate-950" />
              Join Telegram Channel
            </button>

            <button
              onClick={onClose}
              className="w-full bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs py-2.5 rounded-xl border border-slate-700/60 transition-all"
            >
              Continue to Bot
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
