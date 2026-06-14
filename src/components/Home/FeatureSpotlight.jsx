import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  CheckCircle, Mail, Eye, BarChart3, Zap, MessageCircle, ArrowRight,
  TrendingUp, Users, BookOpen, Calendar, Star, Clock, Award, Target,
  GraduationCap, DollarSign, Search, Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

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
  const sectionRef = useRef(null);
  const dashboardRef = useRef(null);
  const featuresRef = useRef(null);
  const { user, dbUser } = useAuth();

  const isLoggedIn = !!user;
  const role = dbUser?.role?.toLowerCase() || 'guest';

  useGSAP(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.fromTo(dashboardRef.current,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
          );
          gsap.fromTo(featuresRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.4 }
          );
        },
        once: true,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

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
            <Target size={80} />
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3">
            <Target size={20} className="text-emerald-500" />
          </div>
          <h3 className="font-heading text-sm font-semibold tracking-tight mb-1">Track Goals</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">Set learning goals and monitor your progress over time</p>
        </div>

        <div className="bg-background/40 border border-border/30 rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute -bottom-6 -right-6 opacity-[0.07] group-hover:opacity-[0.12] transition-opacity">
            <MessageCircle size={80} />
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3">
            <MessageCircle size={20} className="text-amber-500" />
          </div>
          <h3 className="font-heading text-sm font-semibold tracking-tight mb-1">Connect</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">Message tutors, schedule sessions, and manage everything</p>
        </div>
      </div>

      <div className="bg-background/40 border border-border/30 rounded-2xl p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-50" />
        <div className="relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <GraduationCap size={28} className="text-primary" />
          </div>
          <h3 className="font-heading text-base font-semibold tracking-tight mb-2">Start Your Learning Journey</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-5">
            Join thousands of students finding the perfect tutors. Track your progress, manage sessions, and achieve your goals.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Get Started Free
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );

  const renderStudentDashboard = () => {
    const stats = [
      { value: "+12%", label: "Growth", color: "hsl(var(--accent))", pct: 88 },
      { value: "4", label: "Classes", color: "hsl(var(--primary))", pct: 25 },
      { value: "6.5", label: "Hours", color: "hsl(var(--success))", pct: 70 },
    ];

    return (
      <div className="rounded-[20px] p-6 md:p-10 relative overflow-hidden mb-8"
        style={{ background: 'linear-gradient(135deg, hsl(var(--primary) / 0.06) 0%, transparent 40%, hsl(var(--accent) / 0.04) 100%)' }}
      >
        <div className="absolute -top-1/2 -right-[20%] w-[300px] h-[300px] bg-primary/[0.06] rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-end justify-between flex-wrap gap-4 mb-8 relative">
          <div>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Learning Dashboard</span>
            <h2 className="text-2xl md:text-3xl font-heading font-bold tracking-tight mt-1">Weekly Progress</h2>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live &middot; Jun 24 – Jun 30
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
          {stats.map((s, idx) => {
            const radius = 30;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (s.pct / 100) * circumference;
            return (
              <div key={idx} className="relative bg-background/40 border border-border/30 rounded-2xl p-5 text-center overflow-hidden">
                <div className="w-[72px] h-[72px] mx-auto mb-3 relative">
                  <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90">
                    <circle cx="36" cy="36" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
                    <circle cx="36" cy="36" r={radius} fill="none" stroke={s.color} strokeWidth="4" strokeLinecap="round"
                      strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000 ease-out" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-heading text-lg font-bold tracking-tight" style={{ color: s.color }}>
                    {s.value}
                  </div>
                </div>
                <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{s.label}</div>
              </div>
            );
          })}
        </div>

        <div className="bg-background/40 border border-border/30 rounded-2xl p-5 relative">
          <h3 className="font-heading text-sm font-semibold tracking-tight mb-4">Subject Progress</h3>
          <div className="space-y-3">
            {studentSubjects.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-16 text-xs font-medium text-muted-foreground shrink-0">{s.name}</span>
                <div className="flex-1 h-[3px] bg-muted/50 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-primary/60 transition-all duration-1000 ease-out" style={{ width: `${s.pct}%` }} />
                </div>
                <span className="w-9 text-right text-xs font-semibold font-heading">{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderTutorDashboard = () => (
    <div className="rounded-[20px] p-6 md:p-10 relative overflow-hidden mb-8"
      style={{ background: 'linear-gradient(135deg, hsl(var(--primary) / 0.06) 0%, transparent 40%, hsl(var(--accent) / 0.04) 100%)' }}
    >
      <div className="absolute -top-1/2 -right-[20%] w-[300px] h-[300px] bg-primary/[0.06] rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-end justify-between flex-wrap gap-4 mb-8 relative">
        <div>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Tutor Dashboard</span>
          <h2 className="text-2xl md:text-3xl font-heading font-bold tracking-tight mt-1">Your Teaching Overview</h2>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-500 rounded-full text-xs font-semibold tracking-wide">
          <Star size={12} className="fill-amber-500" />
          4.9 Rating
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
        <div className="bg-background/40 border border-border/30 rounded-2xl p-5 text-center">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Users size={20} className="text-primary" />
          </div>
          <div className="text-xl font-heading font-bold tracking-tight text-foreground">24</div>
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mt-1">Active Students</div>
        </div>

        <div className="bg-background/40 border border-border/30 rounded-2xl p-5 text-center">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
            <Calendar size={20} className="text-emerald-500" />
          </div>
          <div className="text-xl font-heading font-bold tracking-tight text-foreground">12</div>
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mt-1">Sessions This Week</div>
        </div>

        <div className="bg-background/40 border border-border/30 rounded-2xl p-5 text-center">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
            <TrendingUp size={20} className="text-amber-500" />
          </div>
          <div className="text-xl font-heading font-bold tracking-tight text-foreground">৳42K</div>
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mt-1">Monthly Earnings</div>
        </div>
      </div>

      <div className="bg-background/40 border border-border/30 rounded-2xl p-5 relative">
        <h3 className="font-heading text-sm font-semibold tracking-tight mb-4">Your Subjects</h3>
        <div className="space-y-3">
          {tutorSubjects.map((s, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{s.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{s.students} students</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderActivitySection = () => {
    const activities = role === 'tutor' ? tutorActivities : studentActivities;
    return (
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="bg-background/40 border border-border/30 rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border/20 font-heading text-sm font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Recent Activity
          </div>
          {activities.map((a, i) => (
            <div key={i} className={`flex items-center gap-3 px-5 py-3.5 ${i < activities.length - 1 ? 'border-b border-border/20' : ''}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${a.color.replace('text-', 'bg-').replace('emerald-500', 'emerald-500/10').replace('primary', 'primary/10').replace('accent', 'accent/10').replace('amber-500', 'amber-500/10')}`}>
                <a.icon size={14} className={a.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{a.text}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{a.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-background/40 border border-border/30 rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border/20 font-heading text-sm font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Updates
          </div>
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border/20">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-emerald-500/10">
              <Zap size={14} className="text-emerald-500" />
            </div>
            <span className="text-sm text-foreground">New update</span>
          </div>
          <div className="flex items-center gap-3 px-5 py-3.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-primary/10">
              <CheckCircle size={14} className="text-primary" />
            </div>
            <span className="text-sm text-foreground">Session completed</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-20 md:py-28 bg-background">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div ref={dashboardRef}>
          {!isLoggedIn && renderGuestDashboard()}
          {isLoggedIn && role === 'student' && renderStudentDashboard()}
          {isLoggedIn && role === 'tutor' && renderTutorDashboard()}
          {isLoggedIn && renderActivitySection()}
        </div>

        <div ref={featuresRef} className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start pt-8 border-t border-border/20">
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-medium text-primary/70 uppercase tracking-[0.18em]">Our Features</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading text-foreground tracking-tight leading-[0.95] mt-3">
                Track Your <span className="text-primary">Learning</span>
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Take control of your educational journey with our comprehensive dashboard.
              Keep track of tutor interactions, lesson progress, and improvements in one
              simple, intuitive interface designed for students and parents.
            </p>
            <div className="flex items-center gap-3 text-sm text-muted-foreground pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="size-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-medium">
                    <span className="text-muted-foreground">U</span>
                  </div>
                ))}
              </div>
              <span>Trusted by 15,000+ students</span>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-0">
            {features.map((f, idx) => (
              <div key={idx} className="group flex items-start gap-5 py-6 border-b border-border/15 last:border-b-0">
                <div className="shrink-0 size-10 rounded-lg bg-primary/[0.06] border border-primary/10 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <f.icon size={18} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-heading text-foreground tracking-tight group-hover:text-primary transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                    {f.description}
                  </p>
                </div>
                <ArrowRight size={16} className="text-muted-foreground/30 group-hover:text-primary/50 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSpotlight;
