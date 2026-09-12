import React, { useContext } from 'react';
import { DynamicIslandContext } from '../../contexts/DynamicIslandContext';
import { CheckCircle2, XCircle, AlertTriangle, Info, Loader2, X } from 'lucide-react';

const CloseButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Close notification"
    className="w-7 h-7 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-all shrink-0 ml-3 group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
  >
    <X className="w-3 h-3 text-muted-foreground group-hover:text-foreground" />
  </button>
);

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
              <div className="w-10 h-10 rounded-[14px] bg-success/15 flex items-center justify-center shrink-0 border border-success/30 relative overflow-hidden">
                <CheckCircle2 className="w-5 h-5 text-success relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
              </div>
              <div className="flex flex-col text-left min-w-0 py-0.5">
                <span className="text-[0.75rem] font-black text-foreground leading-tight tracking-tight">{contentData.title || 'Success'}</span>
                <span className="text-[0.625rem] text-muted-foreground font-bold leading-relaxed mt-0.5 break-words tracking-wide">{contentData.message || 'Action completed'}</span>
              </div>
            </div>
            <CloseButton onClick={collapse} />
          </div>
        );

      case 'error':
        return (
          <div className="w-full h-full px-5 flex items-center justify-between animate-fade-in relative z-20">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 rounded-[14px] bg-destructive/15 flex items-center justify-center shrink-0 border border-destructive/30 relative overflow-hidden">
                <XCircle className="w-5 h-5 text-destructive relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
              </div>
              <div className="flex flex-col text-left min-w-0 py-0.5">
                <span className="text-[0.75rem] font-black text-foreground leading-tight tracking-tight">{contentData.title || 'Error'}</span>
                <span className="text-[0.625rem] text-muted-foreground font-bold leading-relaxed mt-0.5 break-words tracking-wide">{contentData.message || 'Something went wrong'}</span>
              </div>
            </div>
            <CloseButton onClick={collapse} />
          </div>
        );

      case 'warning':
        return (
          <div className="w-full h-full px-5 flex items-center justify-between animate-fade-in relative z-20">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 rounded-[14px] bg-warning/15 flex items-center justify-center shrink-0 border border-warning/30 relative overflow-hidden">
                <AlertTriangle className="w-5 h-5 text-warning relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
              </div>
              <div className="flex flex-col text-left min-w-0 py-0.5">
                <span className="text-[0.75rem] font-black text-foreground leading-tight tracking-tight">{contentData.title || 'Warning'}</span>
                <span className="text-[0.625rem] text-muted-foreground font-bold leading-relaxed mt-0.5 break-words tracking-wide">{contentData.message || 'Attention needed'}</span>
              </div>
            </div>
            <CloseButton onClick={collapse} />
          </div>
        );

      case 'info':
        return (
          <div className="w-full h-full px-5 flex items-center justify-center gap-3 animate-fade-in relative z-20">
            <Info className="w-3.5 h-3.5 text-primary" />
            <span className="text-[0.6875rem] font-bold text-foreground tracking-wide">Work Focus Mode Active</span>
          </div>
        );

      case 'process':
        return (
          <div className="w-full h-full px-5 py-3 flex flex-col justify-center gap-2 animate-fade-in relative z-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                <span className="text-[0.75rem] font-black text-foreground leading-tight tracking-tight">{contentData.title || 'Processing...'}</span>
              </div>
              <span className="text-[0.6875rem] font-black text-primary">{contentData.percentage || 0}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden border border-border">
              <div
                className="bg-primary h-full rounded-full transition-all duration-300"
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
                <div className="w-13 h-13 rounded-[20px] bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-xl shadow-primary/20 border border-border relative overflow-hidden shrink-0 group">
                  <span className="text-primary-foreground text-2xl font-black relative z-10 group-hover:scale-110 transition-transform duration-500">{contentData.avatarText || 'AI'}</span>
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-[2.5px] border-background"></div>
                </div>
                <div className="flex flex-col text-left">
                  <h4 className="text-lg font-black text-foreground tracking-tighter leading-none mb-1.5">{contentData.title}</h4>
                  <p className="text-[0.625rem] text-muted-foreground font-bold tracking-[0.15em] uppercase">{contentData.subtitle}</p>
                </div>
              </div>
              {contentData.badgeText && (
                <div className="bg-muted px-2.5 py-1 rounded-full border border-border shrink-0 ml-4">
                  <span className="text-[0.5625rem] font-black text-warning tracking-widest uppercase">{contentData.badgeText}</span>
                </div>
              )}
            </div>

            <div className="w-full h-px bg-border mb-6"></div>

            <div className="flex items-center gap-3 mt-auto">
              <button
                onClick={() => {
                  if (contentData.onDecline) contentData.onDecline();
                  collapse();
                }}
                className="flex-1 py-2.5 rounded-[20px] bg-muted hover:bg-muted/80 active:scale-[0.96] text-foreground text-[0.75rem] font-bold border border-border transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {contentData.declineText || 'Minimize'}
              </button>
              <button
                onClick={() => {
                  if (contentData.onAccept) contentData.onAccept();
                }}
                className="flex-1.5 py-2.5 rounded-[20px] bg-primary hover:bg-primary/90 active:scale-[0.96] text-primary-foreground text-[0.75rem] font-black tracking-tight transition-all duration-300 shadow-xl shadow-primary/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
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
    <div
      className="fixed top-8 left-0 right-0 z-[9999] flex justify-center pointer-events-none"
      role="status"
      aria-live="polite"
      aria-label={type !== 'idle' ? `${type} notification` : undefined}
    >
      <div
        style={{
          width: `${width}px`,
          maxWidth: 'min(100vw - 32px)',
          height: `${height}px`,
          borderRadius: `${radius}px`,
          transition: 'width 0.8s cubic-bezier(0.19, 1, 0.22, 1), height 0.8s cubic-bezier(0.19, 1, 0.22, 1), border-radius 0.8s cubic-bezier(0.19, 1, 0.22, 1), background-color 0.4s ease, box-shadow 0.4s ease, opacity 0.6s ease, transform 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          opacity: type === 'idle' ? 0 : 1,
          transform: type === 'idle' ? 'translateY(-50px) scale(0.75)' : 'translateY(0) scale(1)',
        }}
        className={`overflow-hidden flex items-center justify-center select-none backdrop-blur-[30px] dark:backdrop-blur-[40px] saturate-[150%] dark:saturate-[200%] contrast-[105%] dark:contrast-[110%] border-[0.6px] border-border ${bg} ${glowClass} ${type === 'idle' ? 'pointer-events-none' : 'pointer-events-auto'}`}
      >
        {/* Glass Reflection — works in both modes now */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent pointer-events-none z-10 dark:from-white/5"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none z-10 dark:via-white/15"></div>
        
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
