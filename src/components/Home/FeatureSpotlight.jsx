import {
  CheckCircle, Mail, Eye, BarChart3, Zap, MessageCircle, ArrowRight,
  TrendingUp, Users, BookOpen, Calendar, Star, Clock, Award, Target,
  GraduationCap, DollarSign, Search, Sparkles, FileText
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import useAnimateOnScroll from '../../hooks/useAnimateOnScroll';

const studentSubjects = [
  { name: "Math", pct: 88 },
  { name: "Science", pct: 72 },
  { name: "English", pct: 45 },
  { name: "Bangla", pct: 68 },
  { name: "ICT", pct: 52 },
];

const tutorSubjects = [
  { name: "Math", students: 24 },
  { name: "Physics", students: 18 },
  { name: "Chemistry", students: 15 },
];

const studentActivities = [
  { text: "Completed Math practice", time: "2h ago", icon: CheckCircle, color: "text-emerald-500" },
  { text: "New message from tutor", time: "4h ago", icon: Mail, color: "text-primary" },
  { text: "Lesson preview available", time: "Yesterday", icon: Eye, color: "text-accent" },
];

const tutorActivities = [
  { text: "New student application received", time: "1h ago", icon: Users, color: "text-primary" },
  { text: "Session confirmed with Rahim", time: "3h ago", icon: Calendar, color: "text-emerald-500" },
  { text: "Payment of ৳8,500 received", time: "Yesterday", icon: DollarSign, color: "text-amber-500" },
];

const features = [
  { icon: BarChart3, title: "Track Progress", description: "Monitor performance and improvements over time with our progress tracking tools." },
  { icon: Zap, title: "Real-time Updates", description: "Get instant notifications on your tuition applications, messages, and updates." },
  { icon: MessageCircle, title: "Dedicated Support", description: "Our support team is available 24/7 to help you with any questions or issues." },
];

const FeatureSpotlight = () => {
  const dashboardRef = useAnimateOnScroll();
  const featuresRef = useAnimateOnScroll();
  const { user, dbUser } = useAuth();

  const isLoggedIn = !!user;
  const role = dbUser?.role?.toLowerCase() || 'guest';

  const renderGuestDashboard = () => (
    <div className="rounded-[20px] p-6 md:p-10 relative overflow-hidden mb-8"
      style={{ background: 'linear-gradient(135deg, hsl(var(--primary) / 0.06) 0%, transparent 40%, hsl(var(--accent) / 0.04) 100%)' }}
    >
      <div className="absolute -top-1/2 -right-[20%] w-[300px] h-[300px] bg-primary/[0.06] rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-end justify-between flex-wrap gap-4 mb-8 relative">
        <div>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Your Learning Hub</span>
          <h2 className="text-2xl md:text-3xl font-heading font-bold tracking-tight mt-1">All-in-One Dashboard</h2>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-semibold tracking-wide">
          <Sparkles size={12} />
          Free for students
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-background/40 border border-border/30 rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute -bottom-6 -right-6 opacity-[0.07] group-hover:opacity-[0.12] transition-opacity">
            <BookOpen size={80} />
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
            <BookOpen size={20} className="text-primary" />
          </div>
          <h3 className="font-heading text-sm font-semibold tracking-tight mb-1">Find Tutors</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">Browse verified tutors across all subjects and locations</p>
        </div>

        <div className="bg-background/40 border border-border/30 rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute -bottom-6 -right-6 opacity-[0.07] group-hover:opacity-[0.12] transition-opacity">
            <MessageCircle size={80} />
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
            <MessageCircle size={20} className="text-primary" />
          </div>
          <h3 className="font-heading text-sm font-semibold tracking-tight mb-1">Direct Contact</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">Message tutors directly, no middlemen or agents</p>
        </div>

        <div className="bg-background/40 border border-border/30 rounded-2xl p-5 relative overflow-hidden group md:col-span-1 col-span-2">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp size={20} className="text-emerald-500" />
            </div>
            <div>
              <h3 className="font-heading text-sm font-semibold tracking-tight">Track Progress</h3>
              <p className="text-xs text-muted-foreground">Monitor improvement over time</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="size-7 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-background" />
              ))}
            </div>
            <span className="text-[11px] text-muted-foreground font-medium">+12 students this week</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-background/40 border border-border/30 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-foreground">Recent Activity</span>
          </div>
          <div className="space-y-3">
            {studentActivities.map((act, i) => (
              <div key={i} className="flex items-center gap-3">
                <act.icon size={14} className={act.color} />
                <span className="text-xs text-muted-foreground flex-1">{act.text}</span>
                <span className="text-[10px] text-muted-foreground/50">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-background/40 border border-border/30 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1.5">
              {studentSubjects.slice(0, 3).map((s, i) => (
                <div
                  key={i}
                  className="w-7 h-2 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, hsl(var(--primary) / 0.6) 0%, hsl(var(--primary) / ${s.pct / 100}) 100%)`,
                    opacity: 0.7 + i * 0.1,
                  }}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-foreground">Subject Progress</span>
          </div>
          <div className="space-y-2">
            {studentSubjects.map((subj, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-[10px] w-14 text-muted-foreground font-medium">{subj.name}</span>
                <div className="flex-1 h-1.5 rounded-full bg-border/40 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${subj.pct}%`, background: 'linear-gradient(90deg, hsl(var(--primary) / 0.7), hsl(var(--primary)))' }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground w-6 text-right">{subj.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudentDashboard = () => (
    <div className="rounded-[20px] p-6 md:p-10 relative overflow-hidden mb-8"
      style={{ background: 'linear-gradient(135deg, hsl(var(--primary) / 0.06) 0%, transparent 40%, hsl(var(--accent) / 0.04) 100%)' }}
    >
      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Your Dashboard</span>
          <h2 className="text-2xl md:text-3xl font-heading font-bold tracking-tight mt-1">Welcome back, Student</h2>
        </div>
        <Link to="/dashboard?tab=post-job" className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-xl hover:bg-primary/90 transition-all">
          Post a Request <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { icon: Search, label: "Find Tutors", value: "2,500+", color: "from-primary/20 to-primary/5" },
          { icon: FileText, label: "Active Requests", value: "3", color: "from-amber-500/20 to-amber-500/5" },
          { icon: Users, label: "Applications", value: "8", color: "from-emerald-500/20 to-emerald-500/5" },
          { icon: Calendar, label: "Sessions This Week", value: "5", color: "from-violet-500/20 to-violet-500/5" },
        ].map((item, i) => (
          <div key={i} className={`bg-gradient-to-br ${item.color} border border-border/20 rounded-2xl p-4`}>
            <item.icon size={18} className="text-foreground/70 mb-2" />
            <p className="text-2xl font-heading font-bold text-foreground tracking-tight">{item.value}</p>
            <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTutorDashboard = () => (
    <div className="rounded-[20px] p-6 md:p-10 relative overflow-hidden mb-8"
      style={{ background: 'linear-gradient(135deg, hsl(var(--primary) / 0.06) 0%, transparent 40%, hsl(var(--accent) / 0.04) 100%)' }}
    >
      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Your Dashboard</span>
          <h2 className="text-2xl md:text-3xl font-heading font-bold tracking-tight mt-1">Welcome back, Tutor</h2>
        </div>
        <Link to="/dashboard?tab=my-tuitions" className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-xl hover:bg-primary/90 transition-all">
          View Requests <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-background/40 border border-border/30 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold text-foreground">Applications Received</span>
          </div>
          <div className="space-y-3">
            {tutorActivities.slice(0, 2).map((act, i) => (
              <div key={i} className="flex items-center gap-3">
                <act.icon size={14} className={act.color} />
                <span className="text-xs text-muted-foreground flex-1">{act.text}</span>
                <span className="text-[10px] text-muted-foreground/50">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-background/40 border border-border/30 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold text-foreground">Subject Demand</span>
          </div>
          <div className="space-y-2">
            {tutorSubjects.map((subj, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-[10px] w-16 text-muted-foreground font-medium">{subj.name}</span>
                <div className="flex-1 h-2 rounded-full bg-border/40 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, (subj.students / 30) * 100)}%`,
                      background: 'linear-gradient(90deg, hsl(var(--primary) / 0.6), hsl(var(--primary)))',
                    }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground">{subj.students} students</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-primary/[0.02] to-background py-20 md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.04)_0%,transparent_50%)] pointer-events-none" />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div ref={dashboardRef} className="animate-in-up">
          {!isLoggedIn && renderGuestDashboard()}
          {isLoggedIn && role === 'tutor' && renderTutorDashboard()}
          {isLoggedIn && role !== 'tutor' && renderStudentDashboard()}
        </div>

        <div ref={featuresRef} className="animate-in-up animate-stagger grid md:grid-cols-3 gap-4 md:gap-6 mt-8">
          {features.map((f, idx) => (
            <div key={idx} className="animate-in-up-child p-5 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm flex items-start gap-4 transition-all duration-300 hover:shadow-md hover:border-primary/20">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <f.icon size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-heading font-semibold text-foreground">{f.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSpotlight;
