import { cn } from "@/lib/utils";

const DISTRICTS = [
  "Dhaka", "Chattogram", "Sylhet", "Rajshahi", "Khulna",
  "Barishal", "Rangpur", "Mymensingh", "Comilla", "Gazipur",
  "Narayanganj", "Bogra", "Cox's Bazar", "Jessore", "Dinajpur"
];

/**
 * Location filter with district selection.
 */
const LocationFilter = ({ value, onChange, className }) => {
  return (
    <div className={cn("min-w-[150px]", className)}>
      <label className="text-xs font-medium text-muted-foreground mb-1 block">Location</label>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <option value="">All Locations</option>
        {DISTRICTS.map(district => (
          <option key={district} value={district}>{district}</option>
        ))}
      </select>
    </div>
  );
};

export default LocationFilter;
