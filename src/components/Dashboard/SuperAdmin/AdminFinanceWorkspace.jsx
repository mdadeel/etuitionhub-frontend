import { useState, lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DollarSign, ArrowDownToLine, CreditCard } from 'lucide-react';
import { cn } from "@/lib/utils";
import SEO from '@/components/shared/SEO';

const DashPayments = lazy(() => import('../DashPayments'));
const AdminWithdrawals = lazy(() => import('@/pages/AdminWithdrawals'));
const SubscriptionManagement = lazy(() => import('./SubscriptionManagement'));

const TabSkeleton = () => (
  <div className="space-y-4 animate-pulse pt-4">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-24 rounded-xl bg-muted/40 border border-border/50" />
      ))}
    </div>
    <div className="h-80 rounded-xl bg-muted/30 border border-border/50" />
  </div>
);

/**
 * Super Admin Finance Workspace
 * Unified financial hub managing incoming student payments, tutor withdrawal requests, and organization subscriptions.
 */
const AdminFinanceWorkspace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "payments";
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId }, { replace: true });
  };

  const tabs = [
    {
      id: 'payments',
      label: 'Incoming Payments & Escrow',
      icon: DollarSign,
      description: 'Review manual bKash/Nagad/Rocket student payments and reconcile escrow holds'
    },
    {
      id: 'withdrawals',
      label: 'Tutor Payouts & Withdrawals',
      icon: ArrowDownToLine,
      description: 'Approve and disburse settled earnings to tutor mobile banking accounts'
    },
    {
      id: 'subscriptions',
      label: 'Organization Subscriptions',
      icon: CreditCard,
      description: 'Manage SaaS tiers, institution billing cycles, and platform revenue plans'
    }
  ];

  return (
    <div className="space-y-6">
      <SEO
        title="Financial Workspace — Super Admin | eTuitionHub"
        description="Unified financial management hub for incoming payments, escrow holds, tutor withdrawals, and SaaS subscriptions."
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-foreground">
            Financial Workspace
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Reconcile platform transactions, approve disbursements, and monitor subscription billing.
          </p>
        </div>
      </div>

      {/* Segmented Tab Navigation */}
      <div className="flex items-center gap-1.5 p-1 bg-muted/60 border border-border/80 rounded-xl overflow-x-auto custom-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer select-none",
                isActive
                  ? "bg-card text-foreground shadow-xs border border-border/60"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/50"
              )}
            >
              <Icon className={cn("size-4", isActive ? "text-primary" : "text-muted-foreground")} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="pt-2">
        <Suspense fallback={<TabSkeleton />}>
          {activeTab === 'payments' && <DashPayments />}
          {activeTab === 'withdrawals' && <AdminWithdrawals />}
          {activeTab === 'subscriptions' && <SubscriptionManagement />}
        </Suspense>
      </div>
    </div>
  );
};

export default AdminFinanceWorkspace;
