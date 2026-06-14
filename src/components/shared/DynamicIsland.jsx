import React, { useContext } from 'react';
import { DynamicIslandContext } from '../../contexts/DynamicIslandContext';
import { CheckCircle2, XCircle, AlertTriangle, Info, Loader2, X } from 'lucide-react';

export const DynamicIsland = () => {
  const context = useContext(DynamicIslandContext);
  if (!context) return null;

  const { activeNotification, contentVisible, collapse } = context;
  const { type, width, height, radius, bg, glowClass, contentData } = activeNotification;

  const renderContent = () => {
    if (!contentData) return null;

    switch (type) {
      case 'success':
        return (
          <div className="w-full h-full px-5 flex items-center justify-between animate-fade-in relative z-20">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 rounded-[14px] bg-[#00FF85]/15 dark:bg-[#00FF85]/20 flex items-center justify-center shrink-0 border border-[#00FF85]/20 dark:border-[#00FF85]/30 relative overflow-hidden">
                <CheckCircle2 className="w-5 h-5 text-[#00FF85] dark:text-[#00FF85] relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
              </div>
              <div className="flex flex-col text-left min-w-0 py-0.5">
                <span className="text-xs font-black text-slate-900 dark:text-white leading-tight tracking-tight">{contentData.title || 'Success'}</span>
                <span className="text-[10px] text-slate-500 dark:text-white/40 font-bold leading-relaxed mt-0.5 break-words tracking-wide">{contentData.message || 'Action completed'}</span>
              </div>
            </div>
            <button
              onClick={collapse}
              className="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 flex items-center justify-center transition-all shrink-0 ml-3 group"
            >
              <X className="w-3 h-3 text-slate-400 dark:text-white/30 group-hover:text-slate-600 dark:group-hover:text-white/60" />
            </button>
          </div>
        );

      case 'error':
        return (
          <div className="w-full h-full px-5 flex items-center justify-between animate-fade-in relative z-20">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 rounded-[14px] bg-[#FF2D55]/15 dark:bg-[#FF2D55]/20 flex items-center justify-center shrink-0 border border-[#FF2D55]/20 dark:border-[#FF2D55]/30 relative overflow-hidden">
                <XCircle className="w-5 h-5 text-[#FF2D55] dark:text-[#FF2D55] relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
              </div>
              <div className="flex flex-col text-left min-w-0 py-0.5">
                <span className="text-xs font-black text-slate-900 dark:text-white leading-tight tracking-tight">{contentData.title || 'Error'}</span>
                <span className="text-[10px] text-slate-500 dark:text-white/40 font-bold leading-relaxed mt-0.5 break-words tracking-wide">{contentData.message || 'Something went wrong'}</span>
              </div>
            </div>
            <button
              onClick={collapse}
              className="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 flex items-center justify-center transition-all shrink-0 ml-3 group"
            >
              <X className="w-3 h-3 text-slate-400 dark:text-white/30 group-hover:text-slate-600 dark:group-hover:text-white/60" />
            </button>
          </div>
        );

      case 'warning':
        return (
          <div className="w-full h-full px-5 flex items-center justify-between animate-fade-in relative z-20">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 rounded-[14px] bg-[#FFB800]/15 dark:bg-[#FFB800]/20 flex items-center justify-center shrink-0 border border-[#FFB800]/20 dark:border-[#FFB800]/30 relative overflow-hidden">
                <AlertTriangle className="w-5 h-5 text-[#FFB800] dark:text-[#FFB800] relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
              </div>
              <div className="flex flex-col text-left min-w-0 py-0.5">
                <span className="text-xs font-black text-slate-900 dark:text-white leading-tight tracking-tight">{contentData.title || 'Warning'}</span>
                <span className="text-[10px] text-slate-500 dark:text-white/40 font-bold leading-relaxed mt-0.5 break-words tracking-wide">{contentData.message || 'Attention needed'}</span>
              </div>
            </div>
            <button
              onClick={collapse}
              className="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 flex items-center justify-center transition-all shrink-0 ml-3 group"
            >
              <X className="w-3 h-3 text-slate-400 dark:text-white/30 group-hover:text-slate-600 dark:group-hover:text-white/60" />
            </button>
          </div>
        );

      case 'info':
        return (
          <div className="w-full h-full px-5 flex items-center justify-center gap-3 animate-fade-in relative z-20">
            <Info className="w-3.5 h-3.5 text-[#00F5FF]" />
            <span className="text-[11px] font-bold text-slate-800 dark:text-white/90 tracking-wide">Work Focus Mode Active</span>
          </div>
        );

      case 'process':
        return (
          <div className="w-full h-full px-5 py-3 flex flex-col justify-center gap-2 animate-fade-in relative z-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Loader2 className="w-4 h-4 text-[#7000FF] animate-spin" />
                <span className="text-xs font-black text-slate-900 dark:text-white leading-tight tracking-tight">{contentData.title || 'Processing...'}</span>
              </div>
              <span className="text-[11px] font-black text-[#7000FF]">{contentData.percentage || 0}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-1.5 overflow-hidden border border-slate-200 dark:border-white/5">
              <div
                className="bg-[#7000FF] h-full rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(112,0,255,0.3)]"
                style={{ width: `${contentData.percentage || 0}%` }}
              ></div>
            </div>
          </div>
        );

      case 'interactive':
        return (
          <div className="w-full h-full pt-7 pb-5 px-7 flex flex-col animate-fade-in relative z-20">
            <div className="flex items-center justify-between w-full mb-6">
              <div className="flex items-center gap-5">
                <div className="w-13 h-13 rounded-[20px] bg-gradient-to-tr from-[#7000FF] to-indigo-900 flex items-center justify-center shadow-xl dark:shadow-2xl shadow-[#7000FF]/20 dark:shadow-[#7000FF]/30 border border-white/10 relative overflow-hidden shrink-0 group">
                  <span className="text-white text-2xl font-black relative z-10 group-hover:scale-110 transition-transform duration-500">{contentData.avatarText || 'AI'}</span>
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#00F5FF] rounded-full border-[2.5px] border-white dark:border-[#040404]"></div>
                </div>
                <div className="flex flex-col text-left">
                  <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-1.5">{contentData.title}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-white/30 font-bold tracking-[0.15em] uppercase">{contentData.subtitle}</p>
                </div>
              </div>
              {contentData.badgeText && (
                <div className="bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-full border border-slate-200 dark:border-white/5 shrink-0 ml-4">
                  <span className="text-[9px] font-black text-[#FFB800] tracking-widest uppercase">{contentData.badgeText}</span>
                </div>
              )}
            </div>

            <div className="w-full h-px bg-slate-200 dark:bg-white/5 mb-6"></div>

            <div className="flex items-center gap-3 mt-auto">
              <button
                onClick={() => {
                  if (contentData.onDecline) contentData.onDecline();
                  collapse();
                }}
                className="flex-1 py-2.5 rounded-[20px] bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 active:scale-[0.96] text-slate-600 dark:text-white/60 text-xs font-bold border border-slate-200 dark:border-white/8 transition-all duration-300"
              >
                {contentData.declineText || 'Minimize'}
              </button>
              <button
                onClick={() => {
                  if (contentData.onAccept) contentData.onAccept();
                }}
                className="flex-1.5 py-2.5 rounded-[20px] bg-[#020202] dark:bg-white hover:bg-slate-800 dark:hover:bg-[#00F5FF] active:scale-[0.96] text-white dark:text-black text-xs font-black tracking-tight transition-all duration-300 shadow-xl shadow-black/10 dark:shadow-[#00F5FF]/20"
              >
                {contentData.acceptText || 'Optimize'}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed top-8 left-0 right-0 z-[9999] flex justify-center pointer-events-none perspective-[1200px]">
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          borderRadius: `${radius}px`,
          transition: 'width 0.8s cubic-bezier(0.19, 1, 0.22, 1), height 0.8s cubic-bezier(0.19, 1, 0.22, 1), border-radius 0.8s cubic-bezier(0.19, 1, 0.22, 1), background-color 0.4s ease, box-shadow 0.4s ease, opacity 0.6s ease, transform 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          opacity: type === 'idle' ? 0 : 1,
          transform: type === 'idle' ? 'translateY(-50px) scale(0.75)' : 'translateY(0) scale(1)',
        }}
        className={`overflow-hidden flex items-center justify-center select-none backdrop-blur-[30px] dark:backdrop-blur-[40px] saturate-[180%] dark:saturate-[220%] contrast-[105%] dark:contrast-[110%] border-[0.6px] border-slate-200/50 dark:border-white/20 ${bg} ${glowClass} ${type === 'idle' ? 'pointer-events-none' : 'pointer-events-auto shadow-[0_30px_60px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)]'}`}
      >
        {/* Advanced Glass Reflection & Light System */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none z-10 hidden dark:block"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-10 hidden dark:block"></div>
        
        <div
          style={{
            transition: 'opacity 250ms ease-in-out',
            opacity: contentVisible && type !== 'idle' ? 1 : 0,
          }}
          className="w-full h-full flex items-center justify-center relative z-20"
        >
          {type !== 'idle' && renderContent()}
        </div>
      </div>
    </div>
  );
};
