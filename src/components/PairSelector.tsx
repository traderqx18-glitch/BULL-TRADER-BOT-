import React, { useState } from 'react';
import { CurrencyPair } from '../types';
import { ALL_PAIRS } from '../data/pairs';
import { Search, ChevronDown, Check, Zap, Sparkles } from 'lucide-react';

interface PairSelectorProps {
  selectedPair: CurrencyPair;
  onSelectPair: (pair: CurrencyPair) => void;
  disabled?: boolean;
}

export const PairSelector: React.FC<PairSelectorProps> = ({ selectedPair, onSelectPair, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPairs = ALL_PAIRS.filter((pair) =>
    pair.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pair.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      {/* Selector Button */}
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl px-3 py-2 flex items-center justify-between shadow-lg backdrop-blur-md transition-all active:scale-[0.99] disabled:opacity-75"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-black text-amber-400 text-xs flex-shrink-0">
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
          </div>

          <div className="text-left truncate">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-100 text-sm sm:text-base tracking-tight">
                {selectedPair.symbol}
              </span>
            </div>
          </div>
        </div>

        {/* Dropdown Icon */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="p-1 rounded-xl bg-slate-800 text-slate-400 border border-slate-700">
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </button>

      {/* Modal / Dropdown */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[75vh] overflow-hidden">
            
            {/* Header */}
            <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <div>
                <h3 className="font-extrabold text-slate-100 text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Select Currency Pair
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-2.5 bg-slate-950/60 border-b border-slate-800">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search pair (e.g. AUD/CAD OTC)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* List of Pairs */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredPairs.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs">
                  No pairs match "{searchTerm}"
                </div>
              ) : (
                filteredPairs.map((pair) => {
                  const isSelected = selectedPair.id === pair.id;
                  return (
                    <button
                      key={pair.id}
                      onClick={() => {
                        onSelectPair(pair);
                        setIsOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-cyan-500/10 border-cyan-500/50 text-white shadow-md'
                          : 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-extrabold text-xs text-slate-100 flex items-center gap-1.5">
                          {pair.symbol}
                          {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
