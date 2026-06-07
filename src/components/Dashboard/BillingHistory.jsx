import { useState } from "react";
import StudentPayments from "./StudentPayments";
import MyReceipts from "./MyReceipts";
import { AppleHeader } from "../shared/AppleUI";
import { CreditCard, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

const BillingHistory = () => {
  const [activeTab, setActiveTab] = useState("payments");

  const tabs = [
    { id: "payments", label: "Payment Log", icon: CreditCard },
    { id: "receipts", label: "Receipts & Slips", icon: Receipt },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <AppleHeader
        title="Billing & Financials"
        subtitle="Manage payments, track verification status, and view generated receipts."
        badge={
          <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-none bg-secondary/10 text-secondary">
            Financial Dashboard
          </span>
        }
      />

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 bg-muted/30 p-1.5 rounded-none border border-border/40 w-fit max-w-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 text-xs font-semibold transition-all duration-300 rounded-none whitespace-nowrap",
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
          // StudentPayments has its own headers internally, so we can let it render
          // Wait, let's see: StudentPayments has a header inside it!
          // If StudentPayments has a header inside it, does it duplicate the main header we just put in BillingHistory?
          // Ah! Let's check StudentPayments.jsx code:
          // Yes: it has:
          // <AppleHeader title="Payment History" subtitle="Track all your transactions and payment activities." ... />
          // Wait, if it has a header, then having two headers (one in BillingHistory and one in StudentPayments) would look redundant!
          // Same for MyReceipts: it has:
          // <header className="border-b border-border pb-6"> ... <h2>My Receipts</h2> ... </header>
          // Let's modify StudentPayments.jsx and MyReceipts.jsx to accept a prop `hideHeader` or remove their internal headers,
          // OR we can make StudentPayments.jsx and MyReceipts.jsx not have headers by default, and have BillingHistory show the header.
          // Wait! Since StudentPayments and MyReceipts are now only rendered inside BillingHistory (or redirected to it),
          // we can edit them to remove their internal headers or make them conditional on a `hideHeader` prop!
          // This is a very clean approach and keeps the components modular.
          <StudentPayments hideHeader />
        ) : (
          <MyReceipts hideHeader />
        )}
      </div>
    </div>
  );
};

export default BillingHistory;
