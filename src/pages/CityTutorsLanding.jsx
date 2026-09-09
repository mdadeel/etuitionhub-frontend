import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  MapPin,
  ShieldCheck,
  Search,
  Sparkles,
  ChevronDown,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Users,
  Building2,
  HelpCircle,
} from 'lucide-react';
import SEO from '@/components/shared/SEO';
import Breadcrumb from '@/components/shared/Breadcrumb';
import TutorCard from '@/components/shared/TutorCard';
import ParentGuaranteeModal from '@/components/shared/ParentGuaranteeModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { resolveLocationData } from '@/data/bangladeshLocations';
import { breadcrumbJsonLd, faqPageJsonLd, serializeJsonLd } from '@/lib/jsonLd';
import api from '@/services/api';

const CURRICULUM_OPTIONS = [
  'All Curricula',
  'English Medium',
  'Bangla Medium',
  'English Version',
  'Admission Prep',
];

const CityTutorsLanding = () => {
  const { city, thana } = useParams();
  const navigate = useNavigate();

  const [guaranteeOpen, setGuaranteeOpen] = useState(false);
  const [selectedCurriculum, setSelectedCurriculum] = useState('All Curricula');
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const loc = useMemo(() => resolveLocationData(city, thana), [city, thana]);

  const breadcrumbs = useMemo(() => {
    const crumbs = [
      { label: 'Tutors', to: '/tutors' },
      { label: loc.cityName, to: `/tutors/${loc.canonicalCitySlug}` },
    ];
    if (loc.thanaName) {
      crumbs.push({ label: loc.thanaName });
    }
    return crumbs;
  }, [loc]);

  const jsonLdCrumbs = useMemo(() => {
    const list = [
      { name: 'Home', url: '/' },
      { name: 'Tutors', url: '/tutors' },
      { name: `Tutors in ${loc.cityName}`, url: `/tutors/${loc.canonicalCitySlug}` },
    ];
    if (loc.thanaName && loc.thanaSlug) {
      list.push({
        name: `Tutors in ${loc.thanaName}`,
        url: `/tutors/${loc.canonicalCitySlug}/${loc.thanaSlug}`,
      });
    }
    return list;
  }, [loc]);

  const localFaqs = useMemo(() => [
    {
      question: `What is the average home tutor fee in ${loc.displayName}?`,
      answer: `Home tutor rates in ${loc.displayName} typically range between ${loc.averageRate} depending on the student's class (Primary, Secondary, SSC, HSC, O/A Levels) and subjects. English Medium and specialized STEM/Admission prep often command higher rates.`,
    },
    {
      question: `How does the 100% Parent Guarantee work for parents in ${loc.displayName}?`,
      answer: `We guarantee complete peace of mind: your first 30-minute demo session is completely free. Tuition fees are held securely in our platform escrow and are never disbursed to the tutor until you confirm 100% satisfaction. If you are not satisfied, you receive an immediate tutor replacement or full refund.`,
    },
    {
      question: `How are tutors serving ${loc.displayName} verified?`,
      answer: `All tutors undergo our 4-tier verification protocol: National ID (NID) authentication, university student ID & graduation certificates verification (BUET, DU, DMC, NSU, etc.), contact validation, and continuous trust-score monitoring.`,
    },
    {
      question: `Can I request a tutor specifically for English Medium (Cambridge / Edexcel) in ${loc.displayName}?`,
      answer: `Yes, we have verified O-Level, A-Level, and Cambridge/Edexcel curriculum specialists across ${loc.displayName} ready for both physical in-home lessons and 1-on-1 interactive online tutoring.`,
    },
  ], [loc]);

  const fetchLocationTutors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/tutors', {
        params: {
          area: loc.queryArea,
          limit: 12,
        },
      });

      const list = Array.isArray(res.data?.tutors)
        ? res.data.tutors
        : Array.isArray(res.data)
          ? res.data
          : [];

      setTutors(list);
    } catch {
      setTutors([]);
    } finally {
      setLoading(false);
    }
  }, [loc.queryArea]);

  useEffect(() => {
    fetchLocationTutors();
  }, [fetchLocationTutors]);

  const filteredTutors = useMemo(() => {
    if (selectedCurriculum === 'All Curricula') return tutors;
    const filterLower = selectedCurriculum.toLowerCase();
    return tutors.filter((t) => {
      const subs = Array.isArray(t.subjects) ? t.subjects.map((s) => s.toLowerCase()) : [];
      const qual = (t.qualification || '').toLowerCase();
      return subs.some((s) => s.includes(filterLower)) || qual.includes(filterLower);
    });
  }, [tutors, selectedCurriculum]);

  const pageTitle = `Best Home & Online Tutors in ${loc.displayName} | 100% Parent Guarantee`;
  const pageDescription = `Find verified, top-rated home and online tutors in ${loc.displayName}. Background-checked BUET, DU, and English Medium educators. Free 1st demo session & escrow safe.`;

  return (
    <div className="min-h-screen bg-background pb-20">
      <SEO
        title={pageTitle}
        description={pageDescription}
        keywords={`tutors in ${loc.displayName}, home tutor ${loc.displayName}, online tuition ${loc.cityName}, private tutor ${loc.thanaName || loc.cityName}, English medium tutor ${loc.displayName}`}
      />

      <Helmet>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={serializeJsonLd(breadcrumbJsonLd(jsonLdCrumbs))}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={serializeJsonLd(faqPageJsonLd(localFaqs))}
        />
      </Helmet>

      {/* Hero / Header Section */}
      <section className="relative pt-6 pb-12 sm:pb-16 bg-gradient-to-b from-primary/5 via-background to-background border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <Breadcrumb items={breadcrumbs} />
          </div>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
              <span>100% Parent Guarantee · Free Demo · Escrow Protection</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground tracking-tight">
              Verified Home & Online Tutors in{' '}
              <span className="text-primary">{loc.displayName}</span>
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Connect with top-rated tutors from leading institutions serving {loc.displayName}.
              Every tutor is identity-verified, with an average rate of <strong className="text-foreground">{loc.averageRate}</strong>.
            </p>

            {/* Guarantee Trigger Pill & CTA */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                variant="primary"
                className="rounded-xl shadow-sm hover:shadow active:scale-95"
                onClick={() => navigate(`/post-tuition?location=${encodeURIComponent(loc.displayName)}`)}
              >
                <span>Post Tuition Request for {loc.displayName}</span>
                <ArrowRight size={16} className="ml-2" />
              </Button>

              <button
                type="button"
                onClick={() => setGuaranteeOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-card hover:bg-muted text-foreground border border-border shadow-sm transition-all cursor-pointer"
              >
                <Sparkles size={14} className="text-primary" />
                <span>How Our Parent Guarantee Works</span>
              </button>
            </div>
          </div>

          {/* Quick Thana Navigation (if in city with thanas) */}
          {loc.thanas && loc.thanas.length > 0 && (
            <div className="mt-8 pt-6 border-t border-border/60">
              <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <MapPin size={14} className="text-primary" />
                <span>Popular Areas in {loc.cityName}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/tutors/${loc.canonicalCitySlug}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                    !loc.thanaSlug
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-card text-muted-foreground hover:text-foreground hover:bg-muted border-border/80'
                  }`}
                >
                  All {loc.cityName}
                </Link>
                {loc.thanas.map((item) => {
                  const isActive = loc.thanaSlug === item.slug;
                  return (
                    <Link
                      key={item.slug}
                      to={`/tutors/${loc.canonicalCitySlug}/${item.slug}`}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                        isActive
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                          : 'bg-card text-muted-foreground hover:text-foreground hover:bg-muted border-border/80'
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content: Tutor List with Curriculum Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Curricula Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border/60">
          <div className="flex flex-wrap gap-2">
            {CURRICULUM_OPTIONS.map((curr) => (
              <button
                key={curr}
                type="button"
                onClick={() => setSelectedCurriculum(curr)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedCurriculum === curr
                    ? 'bg-foreground text-background font-semibold shadow-sm'
                    : 'bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted border border-border/60'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>

          <div className="text-xs text-muted-foreground font-medium">
            Showing <strong className="text-foreground">{filteredTutors.length}</strong> verified tutors in {loc.displayName}
          </div>
        </div>

        {/* Tutor Grid */}
        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-14 rounded-xl" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-full" />
                </Card>
              ))}
            </div>
          ) : filteredTutors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTutors.map((tutor) => (
                <TutorCard key={tutor._id} tutor={tutor} />
              ))}
            </div>
          ) : (
            <Card className="p-8 sm:p-12 text-center max-w-xl mx-auto rounded-2xl border-dashed">
              <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Search size={22} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                No immediate matches for {selectedCurriculum} in {loc.displayName}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Post your tuition requirements and our matchmaking team will connect you with verified tutors in {loc.displayName} within 2 hours.
              </p>
              <Button
                variant="primary"
                onClick={() => navigate(`/post-tuition?location=${encodeURIComponent(loc.displayName)}`)}
                className="rounded-xl shadow-sm"
              >
                Post a Tuition Job Free
              </Button>
            </Card>
          )}
        </div>
      </section>

      {/* Local Educational Context & Trust Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="rounded-2xl bg-card border border-border/80 p-6 sm:p-10 shadow-sm">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-start gap-3.5">
              <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">Zero Upfront Risk</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  First 30-min trial session is free. Tuition payments are secured in escrow until you approve.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Building2 size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">Top Institutional Background</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Tutors verified from BUET, DU, DMC, NSU, BRAC, and leading international curriculum schools.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="size-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">100% Replacement Guarantee</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Not a great fit? We replace the tutor promptly with zero extra charges or hassle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Localized FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-widest mb-2">
            <HelpCircle size={14} />
            <span>Local Tuition FAQs</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
            Tuition Guidance in {loc.displayName}
          </h2>
        </div>

        <div className="space-y-3">
          {localFaqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={faq.question}
                className="rounded-xl border border-border/80 bg-card overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-muted-foreground transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Sticky / Footer Conversion Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="rounded-3xl bg-gradient-to-r from-primary/15 via-primary/10 to-card border border-primary/20 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
              Looking for a custom tutor in {loc.displayName}?
            </h3>
            <p className="text-sm text-muted-foreground">
              Tell us your child's curriculum, subjects, and budget. Our platform matches you with vetted applicants with zero upfront cost.
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate(`/post-tuition?location=${encodeURIComponent(loc.displayName)}`)}
            className="rounded-2xl shadow-lg shadow-primary/20 shrink-0 font-bold"
          >
            <span>Post Tuition for Free</span>
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      </section>

      <ParentGuaranteeModal open={guaranteeOpen} onOpenChange={setGuaranteeOpen} />
    </div>
  );
};

export default CityTutorsLanding;
