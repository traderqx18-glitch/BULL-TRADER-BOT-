import React from 'react';
import { BotStats } from '../types';
import { Send, Volume2, VolumeX, ShieldCheck, Sparkles, Smartphone, Monitor } from 'lucide-react';
import botAvatarImg from '../assets/images/zohaib_bot_avatar_1784840026900.jpg';

interface HeaderProps {
  stats: BotStats;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  onOpenTelegramModal: () => void;
}

export const TELEGRAM_LINK = 'https://t.me/+8sP671dsgLg1MzMx';

export const Header: React.FC<HeaderProps> = ({
  stats,
  soundEnabled,
  onToggleSound,
  isMobileFrame,
  onToggleMobileFrame,
  onOpenTelegramModal,
}) => {
  return (
    <header className="bg-slate-900/95 border-b border-slate-800 sticky top-0 z-30 px-3 py-2 sm:px-4">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        
        {/* Left: Avatar & Title */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-full p-0.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 shadow-md shadow-amber-500/20">
              <img
                src={botAvatarImg}
                alt="Bull Trader LLC Bot"
                className="w-full h-full object-cover rounded-full bg-slate-950"
              />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-900"></span>
            </span>
          </div>

          <div className="truncate">
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-slate-100 text-sm tracking-tight truncate">
                Bull Trader LLC Bot
              </h1>
              <span className="bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded uppercase">
                VIP
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <span className="inline-flex items-center text-cyan-400 font-semibold">
                <ShieldCheck className="w-3 h-3 mr-0.5" />
                Quotex OTC Bot
              </span>
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5">
          {/* Telegram Channel Button */}
          <button
            onClick={onOpenTelegramModal}
            className="flex items-center gap-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs px-2.5 py-1.5 rounded-xl shadow-md transition-all active:scale-95"
            title="Join Telegram"
          >
            <Send className="w-3.5 h-3.5 fill-slate-950" />
            <span className="text-[11px] uppercase">Telegram</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-1.5 rounded-xl text-xs border transition-all active:scale-95 ${
              soundEnabled
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-800/60 border-slate-700 text-slate-500'
            }`}
            title={soundEnabled ? 'Mute' : 'Sound On'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Mobile Frame Toggle */}
          <button
            onClick={onToggleMobileFrame}
            className={`p-1.5 rounded-xl text-xs border hidden sm:flex transition-all active:scale-95 ${
              isMobileFrame
                ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400'
                : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}
            title="Toggle Device Frame"
          >
            {isMobileFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </header>
  );
};
