
import React from 'react';
import { AppView } from '../types';
import { ICONS } from '../constants';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  pendingCount: number;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView, pendingCount }) => {
  return (
    <nav className="bg-red-600 text-white shadow-xl z-50 flex-shrink-0 border-b-4 border-red-700" role="navigation" aria-label="Main navigation">
      <div className="px-4 h-16 flex items-center justify-between max-w-7xl mx-auto">
        {/* Brand/Logo Area */}
        <div className="flex items-center space-x-3">
          <div className="bg-white p-1.5 rounded-lg shadow-inner">
            <span className="text-2xl leading-none">🍗</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base font-black uppercase tracking-tighter leading-none">POPIAH</h1>
            <p className="text-[8px] font-bold text-red-100 uppercase tracking-widest mt-0.5">Kitchen Ops v2.0</p>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center space-x-1.5 py-2 flex-1 justify-end pr-1">
          <NavButton
            active={currentView === AppView.ORDER}
            onClick={() => setView(AppView.ORDER)}
            label="Order"
            icon={<ICONS.Plus size={16} />}
          />

          <div className="relative">
            <NavButton
              active={currentView === AppView.QUEUE}
              onClick={() => setView(AppView.QUEUE)}
              label="Queue"
              icon={<ICONS.Box size={16} />}
            />
            {pendingCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded-full border-2 border-red-600 shadow-sm animate-pulse">
                {pendingCount}
              </span>
            )}
          </div>

          <NavButton
            active={currentView === AppView.HISTORY}
            onClick={() => setView(AppView.HISTORY)}
            label="Logs"
            icon={<ICONS.History size={16} />}
          />

          <NavButton
            active={currentView === AppView.MANAGEMENT}
            onClick={() => setView(AppView.MANAGEMENT)}
            label="Stock"
            icon={<ICONS.Edit size={16} />}
          />
        </div>
      </div>
    </nav>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, label, icon }) => (
  <button
    onClick={onClick}
    aria-label={label}
    aria-current={active ? 'page' : undefined}
    className={`
      flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600
      ${active
        ? 'bg-white text-red-600 shadow-lg scale-105 z-10'
        : 'text-red-50 hover:bg-red-500/50'
      }
    `}
  >
    <span className={`${active ? 'text-red-600' : 'text-red-200'}`} aria-hidden="true">{icon}</span>
    <span className="hidden xs:inline-block">{label}</span>
  </button>
);

export default Navigation;
