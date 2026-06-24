import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  BookOpen,
  FileSearch,
  Globe,
  Languages,
  Code,
  Layout,
  MessageSquare,
  Trash2,
  Edit2,
  Pin,
  Settings,
  History,
  User,
  StickyNote,
  Inbox,
  Bell,
  Users,
  ArrowDownToLine,
  Wallet,
  Banknote,
  Bookmark,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useAiStore } from '@/store/aiStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import aiService from '@/services/aiService';
import ConfirmModal from '@/components/shared/ConfirmModal';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const subjects = [
  { id: 'ssc', label: 'SSC', icon: GraduationCap },
  { id: 'hsc', label: 'HSC', icon: BookOpen },
  { id: 'admission', label: 'Admission', icon: FileSearch },
  { id: 'math', label: 'Math', icon: Layout },
  { id: 'ielts', label: 'IELTS', icon: Globe },
  { id: 'english', label: 'English', icon: Languages },
  { id: 'programming', label: 'Programming', icon: Code },
  { id: 'general', label: 'General', icon: Layout },
];

const ModernSidebar = ({ className, isMobile = false, onCloseMobile }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [chatToDelete, setChatToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, dbUser } = useAuth();
  const queryClient = useQueryClient();
  const role = dbUser && dbUser.role ? dbUser.role.toLowerCase() : 'student';

  const currentSubject = useAiStore((s) => s.subject);
  const setSubject = useAiStore((s) => s.setSubject);
  const setActiveSessionId = useAiStore((s) => s.setActiveSessionId);

  // Use TanStack Query to prevent blinking (§5.9)
  const { data: recentData, isLoading: isLoadingChats } = useQuery({
    queryKey: ['recent-chats', user?.uid],
    queryFn: () => aiService.listChatSessions({ limit: 10 }),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  const recentChats = Array.isArray(recentData?.sessions) 
    ? recentData.sessions 
    : (Array.isArray(recentData) ? recentData : []);

  const handleNewChat = () => {
    // Clear any in-flight session state and return to the AI home.
    setActiveSessionId(null);
    if (location.pathname !== '/ai-assistant') {
      navigate('/ai-assistant');
    }
    if (isMobile && onCloseMobile) onCloseMobile();
  };

  const dashboardItems = [
    { path: "/dashboard", label: "Overview", icon: Layout },
    { path: "/dashboard/profile", label: "My Profile", icon: User },
    { path: "/dashboard/requests", label: "Requests", icon: Inbox },
    { path: "/dashboard/notifications", label: "Notifications", icon: Bell },
  ];

  if (role === "admin") {
    dashboardItems.push({ path: "/dashboard/users", label: "User Directory", icon: Users });
    dashboardItems.push({ path: "/dashboard/admin/withdrawals", label: "Withdrawals", icon: ArrowDownToLine });
    dashboardItems.push({ path: "/dashboard/admin/audit-logs", label: "Audit Logs", icon: History });
  } else if (role === "tutor") {
    dashboardItems.push({ path: "/dashboard/wallet", label: "Wallet", icon: Wallet });
    dashboardItems.push({ path: "/dashboard/withdraw", label: "Withdraw", icon: ArrowDownToLine });
  } else {
    dashboardItems.push({ path: "/dashboard/billing", label: "Billing", icon: Banknote });
    dashboardItems.push({ path: "/dashboard/relationships", label: "Relationships", icon: Users });
    dashboardItems.push({ path: "/dashboard/bookmarks", label: "Bookmarks", icon: Bookmark });
  }

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const promptDeleteChat = (e, chatId) => {
    e.preventDefault();
    e.stopPropagation();
    setChatToDelete(chatId);
  };

  const confirmDeleteChat = async () => {
    if (!chatToDelete) return;
    setIsDeleting(true);
    try {
      await aiService.deleteChatSession(chatToDelete);
      queryClient.invalidateQueries({ queryKey: ['recent-chats'] });
      if (location.pathname.includes(chatToDelete)) {
        navigate('/ai-assistant');
      }
    } catch (err) {
      console.error("Failed to delete chat", err);
    } finally {
      setIsDeleting(false);
      setChatToDelete(null);
    }
  };

  const handleStartEdit = (e, chat) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingChatId(chat._id);
    setEditTitle(chat.title || "Untitled chat");
  };

  const handleSaveEdit = async (e, chatId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!editTitle.trim()) {
        setEditingChatId(null);
        return;
    }
    
    try {
        setEditingChatId(null);
        await aiService.updateChatSession(chatId, { title: editTitle });
        queryClient.invalidateQueries({ queryKey: ['recent-chats'] });
    } catch (err) {
        console.error("Failed to update chat title", err);
    }
  };

  const handleKeyDown = (e, chatId) => {
      if (e.key === 'Enter') {
          handleSaveEdit(e, chatId);
      } else if (e.key === 'Escape') {
          setEditingChatId(null);
      }
  };

  const NavItem = ({ to, icon, label, isActive, collapsed, onClick }) => {
    const NavIcon = icon;
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            {to ? (
              <Link
                to={to}
                onClick={(e) => {
                  if (onClick) onClick(e);
                  if (isMobile && onCloseMobile) onCloseMobile();
                }}
                className={cn(
                  'group flex items-center gap-2.5 px-2 h-9 rounded-[7px] transition-all duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <NavIcon
                  size={16}
                  className={cn(
                    'shrink-0 transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                  )}
                />
                {!collapsed && (
                  <span className={cn('text-[13px] truncate flex-1', isActive ? 'font-medium' : 'font-normal')}>{label}</span>
                )}
              </Link>
            ) : (
              <button
                onClick={onClick}
                className={cn(
                  'group flex items-center gap-2.5 px-2 h-9 rounded-[7px] transition-all duration-200 w-full text-left',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <NavIcon
                  size={16}
                  className={cn(
                    'shrink-0 transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                  )}
                />
                {!collapsed && (
                  <span className={cn('text-[13px] truncate flex-1', isActive ? 'font-medium' : 'font-normal')}>{label}</span>
                )}
              </button>
            )}
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right" className="font-medium text-[12px]">
              {label}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
  <aside
    className={cn(
      'h-screen bg-card border-r border-border flex flex-col transition-all duration-300 ease-in-out shrink-0 sticky top-0 left-0',
      isCollapsed && !isMobile ? 'w-[68px]' : 'w-[260px]',
      isMobile ? 'z-auto' : 'z-40',
      className
    )}
  >
    {/* Header */}
    <div className="h-[56px] flex items-center justify-end px-3 shrink-0 border-b-[0.5px] border-border/50 gap-2">
      {!isMobile && (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleSidebar}
                className="p-1.5 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors shrink-0"
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>

    <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-3 pt-4">
      {/* Dashboard Section (Only if in dashboard) */}
      {location.pathname.startsWith('/dashboard') && (
        <div className="mb-5">
          {!isCollapsed && (
            <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground/50 px-3 mb-1.5">
              Dashboard
            </p>
          )}
          <div className="space-y-0.5">
            {dashboardItems.map((item) => (
              <NavItem
                key={item.path}
                to={item.path}
                icon={item.icon}
                label={item.label}
                isActive={location.pathname === item.path}
                collapsed={isCollapsed}
              />
            ))}
          </div>
        </div>
      )}

      {/* New Chat Action (Hidden on Dashboard) */}
      {!location.pathname.startsWith('/dashboard') && (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleNewChat}
                aria-label="Start a new chat"
                className={cn(
                  'group flex items-center gap-2.5 w-full mb-4 px-2.5 h-9 rounded-[7px] transition-all duration-200',
                  'border border-dashed border-primary/30 bg-primary/5 text-primary',
                  'hover:border-primary/60 hover:bg-primary/10 hover:shadow-[0_0_0_3px_hsl(var(--primary)/0.08)]'
                )}
              >
                <Plus
                  size={16}
                  className="shrink-0 transition-transform duration-200 group-hover:rotate-90"
                />
                {!isCollapsed && (
                  <span className="text-[13px] font-semibold truncate flex-1 text-left">
                    New chat
                  </span>
                )}
              </button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" className="font-medium text-[12px]">
                New chat
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Subjects Section (Hidden on Dashboard) */}
      {!location.pathname.startsWith('/dashboard') && (
        <div className="mb-6">
          {!isCollapsed && (
            <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground/50 px-3 mb-1.5">
              Subjects
            </p>
          )}
          <div className="space-y-0">
            {subjects.map((subject) => (
              <NavItem
                key={subject.id}
                icon={subject.icon}
                label={subject.label}
                isActive={currentSubject === subject.id && location.pathname === '/ai-assistant'}
                collapsed={isCollapsed}
                onClick={() => {
                  setSubject(subject.id);
                  if (location.pathname !== '/ai-assistant') {
                    navigate('/ai-assistant');
                  }
                }}
              />
            ))}
          </div>
        </div>
      )}


      {/* Recent Chats Section */}
      {!location.pathname.startsWith('/dashboard') && (
        <div className="mb-4">
          {!isCollapsed && (
            <div className="flex items-center gap-1.5 px-3 mb-1.5">
              <History size={14} className="text-muted-foreground/60" />
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60">
                Recent Chats
              </p>
            </div>
          )}
          <div className="space-y-0">
            {isLoadingChats ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-9 w-full bg-muted/20 animate-pulse rounded-[7px] mx-1" />
              ))
            ) : recentChats.length > 0 ? (
              recentChats.map((chat) => (
                <TooltipProvider key={chat._id} delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={`/ai-assistant/chat/${chat._id}`}
                        onClick={() => {
                          if (isMobile && onCloseMobile) onCloseMobile();
                        }}
                        className={cn(
                          'group flex items-center gap-2.5 px-2 h-9 rounded-[7px] transition-all duration-200 relative',
                          location.pathname.includes(chat._id)
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                      >
                        {!isCollapsed ? (
                          <>
                            {editingChatId === chat._id ? (
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, chat._id)}
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                onBlur={(e) => handleSaveEdit(e, chat._id)}
                                autoFocus
                                className="text-[13px] flex-1 font-medium px-1 bg-background border border-primary/50 rounded outline-none w-full min-w-0"
                              />
                            ) : (
                              <span className="text-[13px] truncate flex-1 font-medium px-1">
                                {chat.title || 'Untitled chat'}
                              </span>
                            )}

                            {editingChatId !== chat._id && (
                              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
                                <button 
                                  onClick={(e) => handleStartEdit(e, chat)}
                                  className="p-1 hover:bg-background rounded-md transition-colors text-muted-foreground hover:text-foreground"
                                >
                                  <Edit2 size={11} />
                                </button>
                                {/* Pin is visually present but usually managed server-side. For now, it's just a button. */}
                                <button 
                                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); /* Implement pinning later */ }}
                                  className="p-1 hover:bg-background rounded-md transition-colors text-muted-foreground hover:text-foreground"
                                >
                                  <Pin size={11} />
                                </button>
                                <button 
                                  onClick={(e) => promptDeleteChat(e, chat._id)}
                                  className="p-1 hover:bg-background rounded-md transition-colors text-red-500/70 hover:text-red-500"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            )}
                          </>
                        ) : (
                          <MessageSquare size={16} className="shrink-0 mx-auto" />
                        )}
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right" className="font-medium text-[12px]">
                        {chat.title || 'Untitled chat'}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              ))
            ) : !isCollapsed && (
              <p className="px-3 text-xs text-muted-foreground/60 italic">No recent chats</p>
            )}
          </div>
        </div>
      )}
    </div>

    {/* Bottom Utility Section */}
    <div className="p-3 border-t-[0.5px] border-border/50 shrink-0">
      <div className={cn("grid grid-cols-4 gap-1.5", isCollapsed && "grid-cols-1")}>
        {!location.pathname.startsWith('/dashboard') && (
          <>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/ai-assistant/history"
                    onClick={() => {
                      if (isMobile && onCloseMobile) onCloseMobile();
                    }}
                    className={cn(
                      'flex items-center justify-center h-9 rounded-[7px] transition-colors duration-200',
                      location.pathname === '/ai-assistant/history'
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <History size={16} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top" className="font-medium text-[12px] mb-1">Chat History</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/ai-assistant/lesson-planner"
                    onClick={() => {
                      if (isMobile && onCloseMobile) onCloseMobile();
                    }}
                    className={cn(
                      'flex items-center justify-center h-9 rounded-[7px] transition-colors duration-200',
                      location.pathname === '/ai-assistant/lesson-planner'
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <BookOpen size={16} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top" className="font-medium text-[12px] mb-1">Lesson Planner</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/ai-assistant/saved-notes"
                onClick={() => {
                  if (isMobile && onCloseMobile) onCloseMobile();
                }}
                className={cn(
                  'flex items-center justify-center h-9 rounded-[7px] transition-colors duration-200',
                  location.pathname === '/ai-assistant/saved-notes'
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <StickyNote size={16} />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="top" className="font-medium text-[12px] mb-1">Saved Notes</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/ai-assistant/settings"
                onClick={() => {
                  if (isMobile && onCloseMobile) onCloseMobile();
                }}
                className={cn(
                  'flex items-center justify-center h-9 rounded-[7px] transition-colors duration-200',
                  location.pathname === '/ai-assistant/settings'
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Settings size={16} />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="top" className="font-medium text-[12px] mb-1">Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
    <ConfirmModal
      open={!!chatToDelete}
      onOpenChange={(open) => !open && setChatToDelete(null)}
      title="Delete this chat?"
      description="This will permanently remove this chat session and all its messages. This cannot be undone."
      confirmLabel="Delete"
      onConfirm={confirmDeleteChat}
      loading={isDeleting}
    />
  </aside>
  );
};

export default ModernSidebar;
