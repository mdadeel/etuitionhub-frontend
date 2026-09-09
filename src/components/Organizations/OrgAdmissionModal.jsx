import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";
import toast from "react-hot-toast";
import { Building2, Send, CheckCircle2 } from "lucide-react";

const OrgAdmissionModal = ({ open, onClose, organization, selectedCourse, onSuccess }) => {
  const { user, dbUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    studentName: dbUser?.displayName || user?.displayName || "",
    phone: dbUser?.mobileNumber || "",
    targetClass: "HSC",
    branchName: organization?.branches?.[0]?.name || "Main Campus",
    courseName: selectedCourse?.name || organization?.courses?.[0]?.name || "General Admission",
    notes: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to submit an admission application");
      return;
    }
    if (!formData.phone || formData.phone.trim().length < 8) {
      toast.error("Please provide a valid contact phone number");
      return;
    }

    setSubmitting(true);
    try {
      const inquiryMessage = `[Admission Inquiry] Student: ${formData.studentName} | Phone: ${formData.phone} | Level: ${formData.targetClass} | Branch: ${formData.branchName} | Program: ${formData.courseName}${formData.notes ? ` | Notes: ${formData.notes}` : ""}`;

      await api.post(`/api/v1/organizations/${organization._id}/join-request`, {
        message: inquiryMessage,
      });

      setSubmitted(true);
      toast.success("Admission inquiry submitted successfully!");
      if (typeof onSuccess === "function") {
        onSuccess();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to submit admission inquiry");
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  if (!organization) return null;

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="size-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle2 size={32} />
            </div>
            <DialogTitle className="text-xl font-bold font-heading text-foreground">
              Application Submitted!
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Your admission inquiry for <span className="font-semibold text-foreground">{organization.name}</span> has been routed to the campus administration. They will reach out to you via phone shortly.
            </DialogDescription>
            <div className="pt-4">
              <Button onClick={resetAndClose} className="w-full sm:w-auto text-xs font-semibold px-6">
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Building2 size={18} />
                </div>
                <DialogTitle className="text-lg font-bold font-heading text-foreground">
                  Apply for Admission
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs text-muted-foreground">
                Express your interest to enroll at <span className="font-semibold text-foreground">{organization.name}</span>.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Student Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. Tanvir Ahmed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="01700000000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Academic Class / Grade
                  </label>
                  <select
                    value={formData.targetClass}
                    onChange={(e) => setFormData({ ...formData, targetClass: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Class 8">Class 8 (JSC)</option>
                    <option value="Class 9">Class 9 (SSC Foundation)</option>
                    <option value="Class 10">Class 10 (SSC)</option>
                    <option value="HSC 1st Year">HSC 1st Year</option>
                    <option value="HSC 2nd Year">HSC 2nd Year</option>
                    <option value="Medical Admission">Medical Admission Prep</option>
                    <option value="Engineering Admission">Engineering (BUET) Prep</option>
                    <option value="Varsity Admission">Varsity Admission Prep</option>
                    <option value="O-Level">O-Level (Cambridge / Edexcel)</option>
                    <option value="A-Level">A-Level (Cambridge / Edexcel)</option>
                    <option value="Other">Skill / Language / Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Preferred Campus / Branch
                  </label>
                  <select
                    value={formData.branchName}
                    onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {organization.branches && organization.branches.length > 0 ? (
                      organization.branches.map((b, idx) => (
                        <option key={idx} value={b.name}>
                          {b.name} {b.district ? `(${b.district})` : ""}
                        </option>
                      ))
                    ) : (
                      <option value="Main Campus">Main Campus</option>
                    )}
                  </select>
                </div>
              </div>

              {organization.courses && organization.courses.length > 0 && (
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Target Program / Batch
                  </label>
                  <select
                    value={formData.courseName}
                    onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="General Admission">General Batch Admission</option>
                    {organization.courses.map((c) => (
                      <option key={c._id} value={c.name}>
                        {c.name} {c.fees?.monthly ? `(৳${c.fees.monthly}/mo)` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Additional Notes or Questions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ask about batch timings, fee concessions, or hostel options..."
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>
            </div>

            <DialogFooter className="pt-2 gap-2 sm:gap-0">
              <Button type="button" variant="ghost" size="sm" onClick={resetAndClose} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} size="sm" className="text-xs font-semibold gap-1.5">
                <Send size={13} />
                {submitting ? "Submitting..." : "Submit Application"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrgAdmissionModal;
