import React, { useContext } from 'react';
import { DynamicIslandContext } from '../../contexts/DynamicIslandContext';
import { CheckCircle2, XCircle, AlertTriangle, Info, Loader2, X } from 'lucide-react';

export const DynamicIsland = () => {
  const context = useContext(DynamicIslandContext);
  if (!context) return null;

  const { activeNotification, contentVisible, collapse } = context;
  const { type, width, height, radius, bg, glowClass, contentData } = activeNotification;

  // Render content based on notification type
  const renderContent = () => {
    if (!contentData) return null;

    switch (type) {
      case 'success':
        return (
          <div className="w-full h-full px-4 flex items-center justify-between text-emerald-300 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-white">{contentData.title || 'Success'}</span>
                <span className="text-[10px] text-emerald-400/80 font-medium">{contentData.message || 'Action completed'}</span>
              </div>
            </div>
            <button 
              onClick={collapse} 
              className="w-5 h-5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 flex items-center justify-center transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );

      case 'error':
        return (
          <div className="w-full h-full px-4 flex items-center justify-between text-red-300 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-white">{contentData.title || 'Error'}</span>
                <span className="text-[10px] text-red-400/80 font-medium">{contentData.message || 'Something went wrong'}</span>
              </div>
            </div>
            <button 
              onClick={collapse} 
              className="w-5 h-5 rounded-full bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );

      case 'warning':
        return (
          <div className="w-full h-full px-4 flex items-center justify-between text-amber-300 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-white">{contentData.title || 'Warning'}</span>
                <span className="text-[10px] text-amber-400/80 font-medium">{contentData.message || 'Attention needed'}</span>
              </div>
            </div>
            <button 
              onClick={collapse} 
              className="w-5 h-5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 flex items-center justify-center transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );

      case 'info':
        return (
          <div className="w-full h-full px-4 flex items-center justify-between text-blue-300 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Info className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-white">{contentData.title || 'Notification'}</span>
                <span className="text-[10px] text-blue-400/80 font-medium">{contentData.message || 'New update'}</span>
              </div>
            </div>
            <button 
              onClick={collapse} 
              className="w-5 h-5 rounded-full bg-blue-500/10 hover:bg-blue-500/20 flex items-center justify-center transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );

      case 'process':
        return (
          <div className="w-full h-full px-4 flex flex-col justify-center gap-1.5 text-zinc-300 animate-fade-in">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                <span className="font-semibold text-white">{contentData.title || 'Processing...'}</span>
              </div>
              <span className="font-bold text-blue-400">{contentData.percentage || 0}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" 
                style={{ width: `${contentData.percentage || 0}%` }}
              ></div>
            </div>
          </div>
        );

      case 'interactive':
        return (
          <div className="w-full h-full p-4 flex flex-col justify-between text-zinc-300 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-blue-400 text-sm">
                  {contentData.avatarText || 'AI'}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-white">{contentData.title}</span>
                  <span className="text-[10px] text-zinc-400 font-medium">{contentData.subtitle}</span>
                </div>
              </div>
              {contentData.badgeText && (
                <div className="text-right flex flex-col">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Offer</span>
                  <span className="text-xs font-bold text-amber-400">{contentData.badgeText}</span>
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2.5 mt-2">
              <button 
                onClick={() => {
                  if (contentData.onDecline) contentData.onDecline();
                  collapse();
                }} 
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-zinc-400 hover:text-white text-xs font-semibold border border-slate-700 transition-all duration-200"
              >
                {contentData.declineText || 'Decline'}
              </button>
              <button 
                onClick={() => {
                  if (contentData.onAccept) contentData.onAccept();
                }} 
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] text-white text-xs font-semibold transition-all duration-200 shadow-md shadow-indigo-950/40"
              >
                {contentData.acceptText || 'Accept'}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed top-6 left-0 right-0 z-[9999] flex justify-center pointer-events-none">
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          borderRadius: `${radius}px`,
          transition: 'width 400ms cubic-bezier(0.175, 0.885, 0.32, 1.2), height 400ms cubic-bezier(0.175, 0.885, 0.32, 1.2), border-radius 400ms cubic-bezier(0.175, 0.885, 0.32, 1.2), background-color 300ms ease, box-shadow 300ms ease, opacity 300ms ease, transform 400ms cubic-bezier(0.175, 0.885, 0.32, 1.2)',
          opacity: activeNotification.isHidden ? 0 : 1,
          transform: activeNotification.isHidden ? 'scale(0.8) translateY(-20px)' : 'scale(1) translateY(0)',
        }}
        className={`overflow-hidden flex items-center justify-center select-none ${bg} ${glowClass} ${activeNotification.isHidden ? 'pointer-events-none' : 'pointer-events-auto'}`}
      >
        <div
          style={{
            transition: 'opacity 150ms ease-in-out',
            opacity: contentVisible && !activeNotification.isHidden ? 1 : 0,
          }}
          className="w-full h-full flex items-center justify-center"
        >
          {type !== 'idle' && renderContent()}
        </div>
      </div>
    </div>
  );
};
