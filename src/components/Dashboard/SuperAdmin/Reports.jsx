import { useState, useEffect, useCallback } from "react";
import api from "../../../services/api";
import { toast } from "react-hot-toast";
import {
  FileSpreadsheet,
  Loader2,
  PlayCircle,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";

const fmtDate = (d) => (d ? new Date(d).toLocaleString() : "—");
const fmtMoney = (v) => `৳${Number(v || 0).toLocaleString("en-US")}`;

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/reports");
      setReports(res.data.data || []);
    } catch {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleRunNow = async () => {
    try {
      setRunning(true);
      const res = await api.post("/api/admin/reports/run");
      toast.success(
        res.data.data?.status === "generated"
          ? "Digest generated and delivered"
          : "Digest generation failed — see report entry"
      );
      fetchReports();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to run digest");
    } finally {
      setRunning(false);
    }
  };

  const latest = reports[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-heading font-bold">Reports &amp; Digests</h2>
          <p className="text-xs text-muted-foreground">
            Weekly platform ops digest — auto-generated every Monday 8:00 AM, delivered to all super admins (in-app + email).
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={fetchReports} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button size="sm" onClick={handleRunNow} disabled={running}>
            {running ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
            ) : (
              <PlayCircle className="h-4 w-4 mr-1.5" />
            )}
            Run now
          </Button>
        </div>
      </div>

      {/* Latest digest snapshot */}
      {latest?.status === "generated" && latest.metrics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "New users (7d)", value: latest.metrics.period?.newUsers ?? 0 },
            { label: "New payments (7d)", value: latest.metrics.period?.newPayments ?? 0 },
            { label: "Pending verifications", value: latest.metrics.queues?.paymentVerification ?? 0 },
            { label: "Commission revenue", value: fmtMoney(latest.metrics.money?.commissionRevenue) },
          ].map(({ label, value }) => (
            <Card key={label} className="p-4">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-xl font-heading font-bold mt-1">{value}</p>
            </Card>
          ))}
        </div>
      )}

      {/* History table */}
      {loading && reports.length === 0 ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : reports.length === 0 ? (
        <Card className="p-12 text-center">
          <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <p className="text-muted-foreground text-sm">
            No reports yet — run one now or wait for Monday&apos;s scheduled generation.
          </p>
        </Card>
      ) : (
        <Card className="divide-y divide-border">
          {reports.map((r) => (
            <div key={r._id} className="p-4 flex items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-3 min-w-0">
                {r.status === "generated" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="font-medium truncate">Weekly Ops Digest</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {fmtDate(r.periodStart)} → {fmtDate(r.periodEnd)}
                  </p>
                  {r.error && (
                    <p className="text-xs text-rose-600 mt-0.5 truncate">{r.error}</p>
                  )}
                </div>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">
                Delivered to {r.deliveredTo?.length || 0} admin{(r.deliveredTo?.length || 0) === 1 ? "" : "s"}
              </span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};

export default Reports;
