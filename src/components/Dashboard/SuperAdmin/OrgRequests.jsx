import { useState, useEffect, useCallback } from "react";
import api from "../../../services/api";
import { toast } from "react-hot-toast";
import {
  FileText,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Building2,
  User,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import { Card } from "../../ui/card";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const OrgRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  // Review modal
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/org-requests", {
        params: { search, status: statusFilter, page, limit: 10 }
      });
      setRequests(res.data.data || []);
      setTotalPages(res.data.pagination?.pages || 1);
    } catch {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    const timer = setTimeout(fetchRequests, 500);
    return () => clearTimeout(timer);
  }, [fetchRequests]);

  const handleApprove = async (id) => {
    try {
      setActionLoading(true);
      await api.patch(`/api/v1/org-requests/${id}/approve`);
      toast.success("Organization created successfully!");
      setReviewModalOpen(false);
      setSelectedRequest(null);
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to approve");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    try {
      setActionLoading(true);
      await api.patch(`/api/v1/org-requests/${id}/reject`, { reason: rejectReason });
      toast.success("Request rejected");
      setReviewModalOpen(false);
      setSelectedRequest(null);
      setRejectReason("");
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to reject");
    } finally {
      setActionLoading(false);
    }
  };

  const statusColors = {
    pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    approved: "bg-green-500/10 text-green-600 border-green-500/20",
    rejected: "bg-red-500/10 text-red-600 border-red-500/20"
  };

  const statusIcons = {
    pending: Clock,
    approved: CheckCircle2,
    rejected: XCircle
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-heading font-bold">Organization Requests</h2>
          <p className="text-xs text-muted-foreground">Review and manage organization creation requests</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Input
            placeholder="Search requests..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="flex gap-2">
          {["", "pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => { setStatusFilter(status); setPage(1); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                statusFilter === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {status || "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : requests.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No requests found</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => {
            const StatusIcon = statusIcons[req.status] || Clock;
            return (
              <Card key={req._id} className="p-4 hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-sm">{req.orgName}</h3>
                      <p className="text-xs text-muted-foreground">/{req.slug}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {req.ownerName}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {req.district}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {req.contactEmail}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-label font-semibold uppercase px-2 py-0.5 rounded border ${statusColors[req.status]}`}>
                      <StatusIcon className="h-3 w-3 inline mr-1" />
                      {req.status}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setSelectedRequest(req); setReviewModalOpen(true); }}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Review
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3 py-1 bg-muted rounded disabled:opacity-50 text-sm"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1 bg-muted rounded disabled:opacity-50 text-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Review Modal */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Organization Request</DialogTitle>
            <DialogDescription>
              Review the details and verification documents before approving or rejecting.
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* Organization Info */}
              <div className="space-y-3">
                <h4 className="font-heading font-bold text-sm">Organization Details</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <p className="font-medium">{selectedRequest.orgName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Slug:</span>
                    <p className="font-medium">/{selectedRequest.slug}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Description:</span>
                    <p className="font-medium">{selectedRequest.description || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-3">
                <h4 className="font-heading font-bold text-sm">Location</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Address:</span>
                    <p className="font-medium">{selectedRequest.address}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">District:</span>
                    <p className="font-medium">{selectedRequest.district}</p>
                  </div>
                  {selectedRequest.thana && (
                    <div>
                      <span className="text-muted-foreground">Thana:</span>
                      <p className="font-medium">{selectedRequest.thana}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Branches */}
              {selectedRequest.branches?.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-heading font-bold text-sm">Branches ({selectedRequest.branches.length})</h4>
                  {selectedRequest.branches.map((branch, i) => (
                    <div key={i} className="p-3 bg-muted rounded-lg text-sm">
                      <p className="font-medium">{branch.name}</p>
                      <p className="text-muted-foreground">{branch.address}, {branch.district}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Owner Info */}
              <div className="space-y-3">
                <h4 className="font-heading font-bold text-sm">Owner Information</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <p className="font-medium">{selectedRequest.ownerName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">NID Number:</span>
                    <p className="font-medium">{selectedRequest.ownerNidNumber}</p>
                  </div>
                </div>
              </div>

              {/* Verification Documents */}
              <div className="space-y-3">
                <h4 className="font-heading font-bold text-sm">Verification Documents</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "NID Front", url: selectedRequest.ownerNidFront },
                    { label: "NID Back", url: selectedRequest.ownerNidBack },
                    { label: "Trade License", url: selectedRequest.tradeLicense },
                    { label: "Office Proof", url: selectedRequest.officeProof }
                  ].map((doc) => (
                    <div key={doc.label} className="space-y-1">
                      <span className="text-xs text-muted-foreground">{doc.label}</span>
                      {doc.url ? (
                        <a href={doc.url} target="_blank" rel="noopener noreferrer"
                          className="block p-2 bg-muted rounded-lg text-xs text-primary hover:underline">
                          View Document
                        </a>
                      ) : (
                        <p className="text-xs text-red-500">Not provided</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-3">
                <h4 className="font-heading font-bold text-sm">Contact</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <p className="font-medium">{selectedRequest.contactEmail}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone:</span>
                    <p className="font-medium">{selectedRequest.contactPhone}</p>
                  </div>
                  {selectedRequest.website && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Website:</span>
                      <p className="font-medium">{selectedRequest.website}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Requester */}
              <div className="space-y-3">
                <h4 className="font-heading font-bold text-sm">Requested By</h4>
                <p className="text-sm">
                  {selectedRequest.requesterId?.displayName} ({selectedRequest.requesterId?.email})
                </p>
                <p className="text-xs text-muted-foreground">
                  Submitted: {new Date(selectedRequest.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Rejection Reason (if rejected) */}
              {selectedRequest.status === "rejected" && selectedRequest.rejectionReason && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <span className="text-xs font-medium text-red-600">Rejection Reason:</span>
                  <p className="text-sm mt-1">{selectedRequest.rejectionReason}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            {selectedRequest?.status === "pending" && (
              <>
                <div className="flex-1">
                  <Input
                    placeholder="Rejection reason (optional for reject)"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                </div>
                <Button
                  variant="destructive"
                  onClick={() => handleReject(selectedRequest._id)}
                  disabled={actionLoading}
                >
                  {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <XCircle className="h-4 w-4 mr-1" />}
                  Reject
                </Button>
                <Button
                  onClick={() => handleApprove(selectedRequest._id)}
                  disabled={actionLoading}
                >
                  {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <CheckCircle2 className="h-4 w-4 mr-1" />}
                  Approve & Create Org
                </Button>
              </>
            )}
            {selectedRequest?.status !== "pending" && (
              <Button variant="outline" onClick={() => setReviewModalOpen(false)}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrgRequests;
