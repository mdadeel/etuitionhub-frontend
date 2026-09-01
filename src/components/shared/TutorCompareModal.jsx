import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Scale, Star } from "lucide-react";
import { buildComparisonRows } from "@/lib/tutorCompare";
import { cn } from "@/lib/utils";

/**
 * Side-by-side tutor comparison modal. Renders one row per attribute and one
 * column per selected tutor. Only real list fields are compared — see
 * buildComparisonRows in lib/tutorCompare.
 */
const TutorCompareModal = ({ open, onOpenChange, tutors }) => {
  const navigate = useNavigate();
  const rows = useMemo(() => buildComparisonRows(tutors), [tutors]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl" showCloseButton>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale className="size-4 text-primary" strokeWidth={2.5} />
            Compare Tutors
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-x-auto -mx-1 px-1">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-3 text-[11px] font-label font-semibold uppercase tracking-wider text-muted-foreground w-32">
                  Attribute
                </th>
                {tutors.map((tutor) => (
                  <th key={tutor._id} className="p-3 text-left align-bottom">
                    <button
                      type="button"
                      onClick={() => {
                        onOpenChange(false);
                        navigate(`/tutor/${tutor._id}`);
                      }}
                      className="block text-left group"
                    >
                      <span className="block font-heading font-bold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {tutor.displayName}
                      </span>
                      <span className="block text-[11px] text-muted-foreground mt-0.5">
                        View profile →
                      </span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-t border-border">
                  <td className="p-3 text-[11px] font-label font-semibold uppercase tracking-wider text-muted-foreground">
                    {row.label}
                  </td>
                  {row.values.map((value, i) => (
                    <td key={i} className="p-3 text-xs text-foreground">
                      {row.label === "Rating" ? (
                        value ? (
                          <span className="inline-flex items-center gap-1 font-semibold">
                            <Star size={12} className="fill-warning text-warning" />
                            {Number(value).toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">New</span>
                        )
                      ) : row.label === "Verification" ? (
                        <VerificationChip status={value} />
                      ) : (
                        value || <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const VerificationChip = ({ status }) => {
  const isVerified =
    status === "verified_basic" || status === "verified_premium" || status === "verified";
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full border",
        isVerified
          ? "bg-success/15 text-success border-success/20"
          : "bg-muted text-muted-foreground border-border"
      )}
    >
      {isVerified ? "Verified" : "Unverified"}
    </span>
  );
};

export default TutorCompareModal;
