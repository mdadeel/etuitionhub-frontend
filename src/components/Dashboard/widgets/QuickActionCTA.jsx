import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const QuickActionCTA = ({
  title = "Post a Tuition",
  description = "Reach 1000+ verified tutors in Bangladesh in under 24 hours.",
  to = "/post-tuition",
  icon: Icon = Plus,
  className,
  variant = "primary",
}) => {
  const isPrimary = variant === "primary";
  return (
    <Card
      className={cn(
        "overflow-hidden group transition-all duration-200",
        isPrimary
          ? "bg-primary text-primary-foreground border-primary hover:shadow-lg"
          : "hover:border-primary/30",
        className,
      )}
    >
      <CardContent className="p-5 flex items-center gap-4">
        <div
          className={cn(
            "shrink-0 size-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105",
            isPrimary ? "bg-primary-foreground/20" : "bg-primary/10",
          )}
        >
          {isPrimary ? (
            <Sparkles size={22} className="text-primary-foreground" />
          ) : (
            <Icon size={22} className="text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-heading font-bold truncate">{title}</h3>
          <p
            className={cn(
              "text-xs mt-0.5 leading-relaxed line-clamp-2",
              isPrimary ? "text-primary-foreground/85" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        </div>
        <Button
          asChild
          size="sm"
          variant={isPrimary ? "secondary" : "default"}
          className="shrink-0"
        >
          <Link to={to}>
            {isPrimary ? "Get started" : "Open"}
            <ArrowRight size={14} />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActionCTA;
