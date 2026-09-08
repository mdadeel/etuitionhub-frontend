import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calculator,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Wallet,
  Sparkles,
  HelpCircle,
  ChevronDown,
  DollarSign,
  Award,
} from 'lucide-react';
import SEO from '@/components/shared/SEO';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Helmet } from 'react-helmet-async';
import { faqPageJsonLd, serializeJsonLd } from '@/lib/jsonLd';

const FAQ_ITEMS = [
  {
    question: 'How much does eTuitionHub deduct from my tuition salary?',
    answer: 'For home/monthly tuitions, eTuitionHub charges only a 20% platform fee on Month 1 (lowered to 12% for verified premium tutors). Unlike other agencies that take 50% to 60%, subsequent months are 100% yours with 0% platform deductions. For 1-on-1 hourly online sessions, our flat fee is only 12%.',
  },
  {
    question: 'How and when do I get paid?',
    answer: 'Parents deposit tuition fees into platform escrow at the start of tuition. Once sessions are completed and verified, your earnings are automatically transferred directly to your bKash, Nagad, or Bangladeshi bank account within 24 hours.',
  },
  {
    question: 'What happens if a parent cancels after the free demo?',
    answer: 'The first 30-minute demo session is an introduction. If the parent does not proceed, you owe ৳0, your profile remains in good standing, and our matchmaking algorithm prioritizes your profile for other student requests immediately.',
  },
  {
    question: 'Are there any hidden joining or registration fees?',
    answer: 'Zero. Registering, building your tutor profile, getting verified, and applying to tuition jobs on eTuitionHub is 100% free.',
  },
];

const TutorEarningsPage = () => {
  const navigate = useNavigate();
  const [monthlyFee, setMonthlyFee] = useState(8000);
  const [openFaq, setOpenFaq] = useState(null);

  // Comparisons for Month 1
  const comparisons = useMemo(() => {
    const fee = Math.max(1000, Number(monthlyFee) || 0);

    // eTuitionHub standard (20%) & premium (12%)
    const eTuitionHubTakeHome = fee * 0.8;
    const eTuitionHubPremiumTakeHome = fee * 0.88;

    // Caretutors (~50% first month)
    const careTutorsTakeHome = fee * 0.5;

    // Preply (~33% commission + 100% demo loss)
    const preplyTakeHome = fee * 0.67;

    // Traditional local media (~60% first month)
    const traditionalMediaTakeHome = fee * 0.4;

    const extraComparedToCaretutors = eTuitionHubTakeHome - careTutorsTakeHome;

    return {
      fee,
      eTuitionHubTakeHome,
      eTuitionHubPremiumTakeHome,
      careTutorsTakeHome,
      preplyTakeHome,
      traditionalMediaTakeHome,
      extraComparedToCaretutors,
    };
  }, [monthlyFee]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <SEO
        title="Tutor Earnings Calculator & Transparent Economics | eTuitionHub"
        description="Calculate your real net take-home tuition income. eTuitionHub keeps only 20% to 12% in Month 1 vs 50%+ on Caretutors and 33% on Preply. Subsequent months are 100% yours."
        keywords="tutor earnings calculator, tuition commission bangladesh, caretutors commission comparison, etuitionhub tutor fees, private tutor salary dhaka"
      />

      <Helmet>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={serializeJsonLd(faqPageJsonLd(FAQ_ITEMS))}
        />
      </Helmet>

      {/* Hero Header */}
      <section className="relative pt-12 pb-16 bg-gradient-to-b from-primary/10 via-background to-background border-b border-border/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <Sparkles size={14} />
            <span>Fair Economics for Bangladesh's Best Educators</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-bold text-foreground tracking-tight max-w-3xl mx-auto">
            Keep What You Earn.{' '}
            <span className="text-primary">No 50% Commission Traps.</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Traditional agencies take 50% to 60% of your hard-earned tuition.
            On eTuitionHub, Month 1 is just <strong>20% &rarr; 12%</strong>, and subsequent months are <strong>100% yours</strong>.
          </p>

          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/become-tutor')}
              className="rounded-xl shadow-lg shadow-primary/20 font-bold"
            >
              <span>Join as a Verified Tutor</span>
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Interactive Calculator Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <Card className="p-6 sm:p-10 rounded-3xl border-border/80 shadow-xl bg-card">
          <div className="flex items-center gap-2 mb-6">
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Calculator size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-heading font-bold text-foreground">
                First Month Net Take-Home Calculator
              </h2>
              <p className="text-xs text-muted-foreground">
                Move the slider or type your monthly tuition fee to compare net earnings.
              </p>
            </div>
          </div>

          {/* Slider & Input */}
          <div className="space-y-4 pb-8 border-b border-border/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <label htmlFor="tuition-slider" className="text-sm font-semibold text-foreground">
                Agreed Monthly Tuition Fee:
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-foreground">৳</span>
                <input
                  type="number"
                  min={1000}
                  max={50000}
                  step={500}
                  value={monthlyFee}
                  onChange={(e) => setMonthlyFee(Number(e.target.value) || 0)}
                  className="w-36 px-3 py-2 text-lg font-bold text-foreground bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <span className="text-xs text-muted-foreground">/month</span>
              </div>
            </div>

            <input
              id="tuition-slider"
              type="range"
              min={2000}
              max={30000}
              step={500}
              value={monthlyFee}
              onChange={(e) => setMonthlyFee(Number(e.target.value))}
              className="w-full accent-primary h-2 bg-muted rounded-lg cursor-pointer"
            />

            <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
              <span>৳2,000 (Primary/Single Subject)</span>
              <span>৳10,000 (SSC/HSC Science)</span>
              <span>৳30,000 (O/A Level / Multi-subject)</span>
            </div>
          </div>

          {/* Results Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            {/* eTuitionHub Box (Highlighted Winner) */}
            <div className="relative rounded-2xl bg-gradient-to-b from-primary/10 to-primary/5 border-2 border-primary p-6 flex flex-col justify-between shadow-md">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-wider">
                eTuitionHub (Winner)
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">You Keep</p>
                <div className="text-3xl sm:text-4xl font-heading font-extrabold text-foreground">
                  ৳{comparisons.eTuitionHubTakeHome.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Only 20% platform fee in Month 1 (<strong>৳{comparisons.eTuitionHubPremiumTakeHome.toLocaleString()}</strong> for Premium Tutors at 12%).
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-primary/20 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 size={14} />
                  <span>Month 2 onwards: 100% yours (0% fee)</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 size={14} />
                  <span>+৳{comparisons.extraComparedToCaretutors.toLocaleString()} vs Caretutors</span>
                </div>
              </div>
            </div>

            {/* Caretutors Box */}
            <div className="rounded-2xl bg-card border border-border/80 p-6 flex flex-col justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Caretutors</p>
                <div className="text-3xl sm:text-4xl font-heading font-bold text-muted-foreground">
                  ৳{comparisons.careTutorsTakeHome.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Charges <strong>50% to 60%</strong> of Month 1 fee + penalty fees on cancellations.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60 space-y-2 text-xs text-destructive">
                <div className="flex items-center gap-1.5">
                  <XCircle size={14} />
                  <span>You lose ৳{comparisons.extraComparedToCaretutors.toLocaleString()} in Month 1</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span>Delayed bank transfers (up to 7-14 days)</span>
                </div>
              </div>
            </div>

            {/* Preply / Global Platforms */}
            <div className="rounded-2xl bg-card border border-border/80 p-6 flex flex-col justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Preply / Global</p>
                <div className="text-3xl sm:text-4xl font-heading font-bold text-muted-foreground">
                  ৳{comparisons.preplyTakeHome.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Takes <strong>100% of 1st trial lesson</strong> + <strong>33% to 18%</strong> perpetual cut on all lessons.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60 space-y-2 text-xs text-destructive">
                <div className="flex items-center gap-1.5">
                  <XCircle size={14} />
                  <span>Permanent commission on every single class</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span>Foreign currency withdrawal fees (Payoneer)</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Head-to-Head Comparison Table */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
            Platform Transparency Comparison
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            See why ambitious tutors across Bangladesh choose eTuitionHub.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/80 bg-muted/40">
                <th className="p-4 font-semibold text-foreground">Feature</th>
                <th className="p-4 font-bold text-primary">eTuitionHub</th>
                <th className="p-4 font-semibold text-muted-foreground">Caretutors</th>
                <th className="p-4 font-semibold text-muted-foreground">Preply</th>
                <th className="p-4 font-semibold text-muted-foreground">Offline Agencies</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr>
                <td className="p-4 font-medium text-foreground">Month 1 Platform Fee</td>
                <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">20% (12% for Premium)</td>
                <td className="p-4 text-muted-foreground">50% to 60%</td>
                <td className="p-4 text-muted-foreground">33% + 100% trial cut</td>
                <td className="p-4 text-muted-foreground">50% to 70%</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground">Subsequent Months</td>
                <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">0% (100% Yours)</td>
                <td className="p-4 text-muted-foreground">0%</td>
                <td className="p-4 text-muted-foreground">18% to 28% forever</td>
                <td className="p-4 text-muted-foreground">0%</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground">Payout Speed</td>
                <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">Instant (bKash/Nagad 24h)</td>
                <td className="p-4 text-muted-foreground">Weekly / Bi-weekly</td>
                <td className="p-4 text-muted-foreground">Withdrawal delays</td>
                <td className="p-4 text-muted-foreground">Cash / In-person</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground">Parent Escrow Protection</td>
                <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">Guaranteed Escrow</td>
                <td className="p-4 text-muted-foreground">None (direct cash risk)</td>
                <td className="p-4 text-muted-foreground">Escrow</td>
                <td className="p-4 text-muted-foreground">None</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground">Financial Ledger Audit Trail</td>
                <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">Double-entry ledger</td>
                <td className="p-4 text-muted-foreground">Blackbox invoice</td>
                <td className="p-4 text-muted-foreground">Internal wallet</td>
                <td className="p-4 text-muted-foreground">Paper / None</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 3 Core Pillars */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-3">
            <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Wallet size={20} />
            </div>
            <h3 className="font-heading font-bold text-foreground">Fast Local Cashout</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No complicated foreign wire transfers. Receive your funds seamlessly via bKash, Nagad, Rocket, or direct BFTN to any Bangladeshi bank.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-heading font-bold text-foreground">Escrow Payment Security</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Never chase parents for unpaid salaries at the end of the month. Tuition fees are deposited in advance and held safely until sessions conclude.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="size-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <h3 className="font-heading font-bold text-foreground">Lower Fees With Longevity</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Maintain an active Trust Score and complete 10 verified tuitions to unlock our Premium Tier with just 12% Month 1 fee.
            </p>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={faq.question}
                className="rounded-xl border border-border/80 bg-card overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-semibold text-sm text-foreground hover:text-primary transition-colors cursor-pointer"
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

      {/* Bottom CTA Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="rounded-3xl bg-gradient-to-r from-primary/15 via-primary/10 to-card border border-primary/20 p-8 sm:p-12 text-center space-y-4">
          <h2 className="text-2xl sm:text-4xl font-heading font-bold text-foreground">
            Ready to Earn More and Teach on Your Terms?
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Join thousands of verified educators teaching students across Bangladesh. Profile setup takes less than 3 minutes.
          </p>
          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/become-tutor')}
              className="rounded-xl shadow-lg shadow-primary/20 font-bold"
            >
              <span>Create Free Tutor Profile</span>
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TutorEarningsPage;
