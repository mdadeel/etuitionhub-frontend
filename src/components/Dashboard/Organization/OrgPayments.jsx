import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import { toast } from "react-hot-toast";
import {
  DollarSign,
  Loader2,
  TrendingUp,
  ArrowDownToLine,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { Card } from "../../ui/card";
import DataTable from "@/components/ui/data-table";

const OrgPayments = () => {
  const { orgId } = useParams();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        // Fetch tuitions for this org, then derive payments from bookings
        const tuitionsRes = await api.get(`/api/v1/organizations/${orgId}/tuitions`).catch(() => ({ data: { data: [] } }));
        const tuitions = tuitionsRes.data.data || [];

        // Fetch payments for each tuition's bookings
        const paymentPromises = tuitions.map(t =>
          api.get(`/api/payments`, { params: { tuitionId: t._id } }).catch(() => ({ data: { data: [] } }))
        );
        const paymentResults = await Promise.all(paymentPromises);

        const allPayments = [];
        paymentResults.forEach((res) => {
          const list = res.data?.data || [];
          allPayments.push(...list);
        });

        setPayments(allPayments);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load payments");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [orgId]);

  const filtered = filter === "all" ? payments : payments.filter(p => p.status === filter);

  const totalConfirmed = payments.filter(p => p.status === 'confirmed' || p.status === 'withdrawn').reduce((sum, p) => sum + (p.grossAmount || 0), 0);
  const totalPending = payments.filter(p => p.status === 'pending_verification').reduce((sum, p) => sum + (p.grossAmount || 0), 0);

  const summaryCards = [
    { label: "Total Revenue", value: `৳${totalConfirmed.toLocaleString()}`, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Pending Verification", value: `৳${totalPending.toLocaleString()}`, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Total Transactions", value: payments.length, icon: DollarSign, color: "text-primary", bg: "bg-primary/10" },
  ];

  const columns = [
    {
      key: "createdAt",
      label: "Date",
      render: (_, row) => (
        <span className="text-xs text-muted-foreground">
          {new Date(row.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
    },
    {
      key: "studentEmail",
      label: "Student",
      render: (_, row) => (
        <span className="text-sm font-bold text-foreground">{(row.studentEmail || '').split('@')[0]}</span>
      ),
    },
    {
      key: "grossAmount",
      label: "Amount",
      align: "right",
      render: (_, row) => (
        <span className="text-sm font-heading font-bold text-primary tabular-nums">৳{row.grossAmount}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (_, row) => {
        const colors = {
          confirmed: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
          rejected: 'bg-red-500/10 text-red-700 border-red-500/20',
          withdrawn: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
        };
        return (
          <span className={`px-2.5 py-1 text-[9px] font-label font-semibold uppercase tracking-wider rounded-lg border ${colors[row.status] || 'bg-amber-500/10 text-amber-700 border-amber-500/20'}`}>
            {row.status?.replace(/_/g, ' ')}
          </span>
        );
      },
    },
  ];

  const filters = ["all", "confirmed", "pending_verification", "rejected"];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-1.5 bg-primary rounded-lg"></div>
          <span className="text-[9px] font-label font-semibold uppercase tracking-wider text-primary">Payments</span>
        </div>
        <h1 className="text-xl md:text-2xl font-heading font-bold uppercase tracking-tight text-foreground">Organization Payments</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summaryCards.map((card) => (
          <Card key={card.label} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`size-9 ${card.bg} rounded-lg flex items-center justify-center`}>
                <card.icon size={16} className={card.color} />
              </div>
            </div>
            <p className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">{card.label}</p>
            <p className="text-xl font-heading font-bold mt-1">{card.value}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            className={`px-4 py-2 text-[9px] font-heading font-semibold uppercase tracking-widest rounded-lg border transition-all duration-300 ${
              filter === f
                ? "bg-primary border-primary text-primary-foreground"
                : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted"
            }`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All" : f === "pending_verification" ? "Pending" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Payments Table */}
      <DataTable
        columns={columns}
        data={filtered}
        rowKey={(p) => p._id}
        resizable
        emptyState={
          <div className="flex flex-col items-center gap-3 py-12">
            <DollarSign size={32} className="text-muted-foreground/30" strokeWidth={1} />
            <p className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">No payments found</p>
          </div>
        }
      />
    </div>
  );
};

export default OrgPayments;
