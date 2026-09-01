import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle2, AlertCircle, RotateCw } from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

// The five toggles mirror User.notificationPreferences on the backend. Each key
// gates a family of notification types (see NOTIFICATION_PREFERENCE_MAP).
const PREFERENCE_DEFINITIONS = [
  {
    key: "booking_confirmed",
    title: "Booking confirmed",
    description: "When a student books a slot with you.",
  },
  {
    key: "payment_verified",
    title: "Payment verified",
    description: "When a payment or transaction is verified.",
  },
  {
    key: "session_reminder",
    title: "Session reminders",
    description: "A nudge before an upcoming session begins.",
  },
  {
    key: "new_application",
    title: "New application",
    description: "When someone applies or sends you a request.",
  },
  {
    key: "new_tuition_match",
    title: "New tuition match",
    description: "When you are matched to a new tuition.",
  },
];

const DEFAULTS = Object.fromEntries(PREFERENCE_DEFINITIONS.map((p) => [p.key, true]));

const Switch = ({ checked, disabled, onCheckedChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={() => onCheckedChange(!checked)}
    className={cn(
      "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-150",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      checked ? "bg-primary border-primary" : "bg-muted border-border",
      disabled && "opacity-50 cursor-not-allowed"
    )}
  >
    <span
      className={cn(
        "inline-block size-4 transform rounded-full bg-background shadow-sm transition-transform duration-150",
        checked ? "translate-x-6" : "translate-x-1"
      )}
    />
  </button>
);

const NotificationPreferences = () => {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingKey, setSavingKey] = useState(null);
  const [savedKey, setSavedKey] = useState(null);

  useEffect(() => {
    let active = true;
    const loadPrefs = async () => {
      try {
        const res = await api.get("/api/users/me/notification-preferences");
        if (!active) return;
        const stored = res.data.data.notificationPreferences || {};
        setPrefs({ ...DEFAULTS, ...stored });
        setError(null);
      } catch {
        if (!active) return;
        setError("Couldn't load your notification preferences.");
      } finally {
        if (active) setLoading(false);
      }
    };
    loadPrefs();
    return () => {
      active = false;
    };
  }, []);

  const toggle = async (key, value) => {
    if (!user?.email) return;
    const previous = prefs;
    const next = { ...previous, [key]: value };
    setPrefs(next);
    setSavingKey(key);
    try {
      await api.patch(`/api/users/by-email/${encodeURIComponent(user.email)}`, {
        notificationPreferences: { [key]: value },
      });
      setSavedKey(key);
      setTimeout(() => setSavedKey(null), 1500);
    } catch {
      setPrefs(previous); // roll back on failure
      toast.error("Failed to update notification preferences.");
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <Card className="p-6 md:p-8" hover={false}>
      <div className="flex items-start gap-3 mb-6">
        <div className="size-10 rounded-lg bg-muted border border-border flex items-center justify-center text-primary shrink-0">
          <Bell size={18} />
        </div>
        <div>
          <h3 className="text-base font-bold text-foreground tracking-tight">Notification Preferences</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Choose which notifications you receive. Turn off what you don't need.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {PREFERENCE_DEFINITIONS.map((p) => (
            <div key={p.key} className="flex items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-3.5 w-40" />
                <Skeleton className="h-3 w-64 max-w-full" />
              </div>
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <AlertCircle className="size-8 text-destructive" />
          <p className="text-sm text-muted-foreground max-w-xs">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setLoading(true);
              setError(null);
              api
                .get("/api/users/me/notification-preferences")
                .then((res) => {
                  const stored = res.data.data.notificationPreferences || {};
                  setPrefs({ ...DEFAULTS, ...stored });
                })
                .catch(() => setError("Couldn't load your notification preferences."))
                .finally(() => setLoading(false));
            }}
          >
            <RotateCw className="mr-2 h-4 w-4" /> Retry
          </Button>
        </div>
      ) : (
        <div className="divide-y divide-border/60">
          {PREFERENCE_DEFINITIONS.map((p) => (
            <div key={p.key} className="flex items-center justify-between gap-4 py-3.5">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{p.title}</p>
                  {savedKey === p.key && (
                    <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{p.description}</p>
              </div>
              <Switch
                checked={prefs?.[p.key] !== false}
                disabled={savingKey !== null}
                onCheckedChange={(value) => toggle(p.key, value)}
                label={p.title}
              />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default NotificationPreferences;
