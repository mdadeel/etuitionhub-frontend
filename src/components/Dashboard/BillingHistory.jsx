import { useState } from "react";
import StudentPayments from "./StudentPayments";
import MyReceipts from "./MyReceipts";
import { CreditCard, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppleHeader } from "@/components/shared/AppleUI";

const BillingHistory = () => {
  const [activeTab, setActiveTab] = useState("payments");

  const tabs = [
    { id: "payments", label: "Payment Log", icon: CreditCard },
    { id: "receipts", label: "Receipts & Slips", icon: Receipt },
  ];

  return (
    <div className="space-y-10 animate-in fade-in animate-fade-in-up duration-700">
      <AppleHeader
        title="Billing & Financials"
        subtitle="Manage payments, track verification status, and view generated receipts."
        badge={
          <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg bg-secondary/10 text-secondary">
            Financial Dashboard
          </span>
        }
      />

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 bg-muted/30 p-1.5 rounded-lg border border-border/40 w-fit max-w-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 text-xs font-semibold transition-all duration-300 rounded-lg whitespace-nowrap active:scale-[0.98]",
              activeTab === tab.id
                ? "bg-background text-primary shadow-sm shadow-primary/5 border border-border/40"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <tab.icon size={14} className={activeTab === tab.id ? "text-primary" : "opacity-60"} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-8">
        {activeTab === "payments" ? (
          <StudentPayments hideHeader />
        ) : (
          <MyReceipts hideHeader />
        )}
      </div>
    </div>
  );
};

export default BillingHistory;
