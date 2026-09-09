import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Building2,
  MapPin,
  Users,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const TYPE_STYLES = Object.freeze({
  coaching_center: {
    label: 'Coaching Center',
    badge: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/25',
  },
  school: {
    label: 'School',
    badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25',
  },
  college: {
    label: 'College',
    badge: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/25',
  },
  academy: {
    label: 'Training Academy',
    badge: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/25',
  },
  other: {
    label: 'Institution',
    badge: 'bg-primary/10 text-primary border-primary/25',
  },
});

const getTypeMeta = (type) => {
  if (type && Object.prototype.hasOwnProperty.call(TYPE_STYLES, type)) {
    return TYPE_STYLES[type];
  }
  return TYPE_STYLES.other;
};

const OrganizationCard = ({ org, isMember, onApply }) => {
  const { t } = useTranslation();

  const typeMeta = getTypeMeta(org.type);
  const branchCount = org.branches?.length || 1;
  const studentCount = org.stats?.totalStudents || 0;
  const tutorCount = org.stats?.totalTutors || 0;
  const classCount = org.stats?.totalClasses || 0;

  const locationDisplay =
    org.profile?.thana && org.profile?.district
      ? `${org.profile.thana}, ${org.profile.district}`
      : org.profile?.district || org.profile?.address?.split(',')[0] || 'Bangladesh';

  return (
    <article className="group bg-card border border-border/80 hover:border-primary/40 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative">
      <div>
        {/* Visual Cover Banner with Glassmorphic Badges */}
        <div className="h-32 sm:h-36 bg-gradient-to-r from-primary/15 via-primary/5 to-accent/20 relative overflow-hidden">
          {org.profile?.banner ? (
            <img
              src={org.profile.banner}
              alt={org.name}
              className="size-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
          ) : (
            <div className="size-full flex items-center justify-center opacity-15">
              <Building2 className="size-16 text-primary" />
            </div>
          )}
          {/* Subtle Contrast Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />

          {/* Top Floating Badge Bar */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
            {/* Institution Category Tag */}
            <span
              className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg border backdrop-blur-md shadow-xs ${typeMeta.badge}`}
            >
              {typeMeta.label}
            </span>

            {/* Right Status: Affiliated only (Verified now inline tick, Share removed) */}
            <div className="flex items-center gap-1.5">
              {isMember && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-primary text-primary-foreground rounded-md shadow-xs">
                  {t('org.affiliated', 'Affiliated')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="px-5 space-y-3">
          <div>
            <Link
              to={`/organizations/${org.slug}`}
              className="block group-hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              <h3 className="text-base sm:text-lg font-bold font-heading text-foreground tracking-tight line-clamp-1 inline-flex items-center gap-1.5">
                <span className="truncate">{org.name}</span>
                {org.verificationStatus === 'verified' && (
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                )}
              </h3>
            </Link>

            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="size-3 text-primary shrink-0" />
                <span className="truncate max-w-[170px]">{locationDisplay}</span>
              </span>
              {branchCount > 1 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground bg-muted/50 border border-border/60 px-2.5 py-1 rounded-lg">
                  <Building2 className="size-3 text-primary" />
                  <span>{branchCount} Campuses</span>
                </span>
              )}
            </div>
          </div>

          {/* Bio / Description */}
          <p className="text-xs text-muted-foreground/90 line-clamp-2 leading-relaxed min-h-[32px]">
            {org.profile?.description ||
              t(
                'org.default_bio',
                'Comprehensive academic coaching, batch tuitions, and board exam preparation.'
              )}
          </p>

          {/* Stat Badges Strip */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/60 text-center">
            <div className="bg-muted/30 dark:bg-muted/15 p-2 rounded-xl border border-border/30">
              <p className="text-xs font-bold text-foreground flex items-center justify-center gap-1">
                <Users className="size-3 text-primary" />
                <span>{studentCount > 0 ? studentCount.toLocaleString() : '300+'}</span>
              </p>
              <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider mt-0.5">
                Students
              </p>
            </div>

            <div className="bg-muted/30 dark:bg-muted/15 p-2 rounded-xl border border-border/30">
              <p className="text-xs font-bold text-foreground flex items-center justify-center gap-1">
                <GraduationCap className="size-3 text-emerald-600 dark:text-emerald-400" />
                <span>{tutorCount > 0 ? tutorCount : '15+'}</span>
              </p>
              <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider mt-0.5">
                Faculty
              </p>
            </div>

            <div className="bg-muted/30 dark:bg-muted/15 p-2 rounded-xl border border-border/30">
              <p className="text-xs font-bold text-foreground flex items-center justify-center gap-1">
                <Layers className="size-3 text-amber-500" />
                <span>{classCount > 0 ? classCount : 'Active'}</span>
              </p>
              <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider mt-0.5">
                Programs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-5 pt-4 flex items-center gap-2.5">
        <Button
          asChild
          variant="secondary"
          className="flex-1 h-10 text-xs font-bold rounded-xl gap-1.5 hover:bg-primary hover:text-primary-foreground transition-all shadow-xs active:scale-98"
        >
          <Link to={`/organizations/${org.slug}`}>
            <span>{t('org.explore_campus', 'Explore Campus')}</span>
            <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onApply(org)}
          className="h-10 text-xs font-semibold px-4 rounded-xl border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all active:scale-98"
        >
          <Sparkles className="size-3 mr-1" />
          <span>{t('org.quick_apply', 'Apply')}</span>
        </Button>
      </div>
    </article>
  );
};

OrganizationCard.propTypes = {
  org: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    type: PropTypes.string,
    verificationStatus: PropTypes.string,
    profile: PropTypes.shape({
      logo: PropTypes.string,
      banner: PropTypes.string,
      description: PropTypes.string,
      district: PropTypes.string,
      thana: PropTypes.string,
      address: PropTypes.string,
    }),
    branches: PropTypes.array,
    stats: PropTypes.shape({
      totalStudents: PropTypes.number,
      totalTutors: PropTypes.number,
      totalClasses: PropTypes.number,
    }),
  }).isRequired,
  isMember: PropTypes.bool,
  onApply: PropTypes.func.isRequired,
};

export default OrganizationCard;
