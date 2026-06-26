import DashboardPageHeader from './DashboardPageHeader';
import { Construction } from 'lucide-react';

/**
 * Reusable "Coming Soon" placeholder for org dashboard pages.
 * Replace this component with the real implementation when ready.
 */
export default function ComingSoon({ title, subtitle }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <DashboardPageHeader title={title} subtitle={subtitle} />
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="size-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <Construction className="size-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-heading font-bold text-foreground mb-1">
          Coming Soon
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          This feature is under development. Check back soon for updates.
        </p>
      </div>
    </div>
  );
}
