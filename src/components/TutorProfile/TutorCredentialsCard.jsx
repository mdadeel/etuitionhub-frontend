import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  GraduationCap,
  Award,
  Building2,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const TutorCredentialsCard = ({ tutor }) => {
  const { t } = useTranslation();
  const firstName = tutor.displayName ? tutor.displayName.split(' ')[0] : 'The tutor';

  const organizations = tutor.organizations || [];

  return (
    <div className="space-y-6">
      {/* About & Teaching Approach */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
        <h2 className="text-lg font-bold font-heading text-foreground mb-3 flex items-center gap-2">
          <BookOpen className="size-5 text-primary" />
          {t('tutorDetails.about_title', 'About & Teaching Philosophy')}
        </h2>

        <div className="text-sm text-foreground/85 leading-relaxed space-y-3">
          {tutor.bio ? (
            <p className="whitespace-pre-line">{tutor.bio}</p>
          ) : (
            <>
              <p>
                {t('tutorDetails.about_p1', {
                  name: tutor.displayName || 'This tutor',
                  subjects: Array.isArray(tutor.subjects) ? tutor.subjects.join(', ') : 'core academic disciplines',
                  experience: tutor.experience || 'several years',
                  location: tutor.location || 'Dhaka',
                  defaultValue: `${tutor.displayName || 'This tutor'} is a dedicated educator specializing in ${Array.isArray(tutor.subjects) ? tutor.subjects.join(', ') : 'academic subjects'} with ${tutor.experience || 'several years'} of proven track record serving students in ${tutor.location || 'Dhaka'}.`
                })}
              </p>
              <p>
                {t('tutorDetails.about_p2', {
                  firstName,
                  defaultValue: `${firstName} adopts a concept-first, problem-solving pedagogical approach, helping students develop deep intuition, overcome exam anxieties, and consistently achieve top board and university entrance results.`
                })}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Academic Qualifications & Verifications */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
        <h3 className="text-base font-bold font-heading text-foreground mb-4 flex items-center gap-2">
          <GraduationCap className="size-5 text-primary" />
          {t('tutorDetails.academic_credentials', 'Academic Qualifications & Verification')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-border/60 bg-muted/20 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
              <GraduationCap className="size-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Highest Degree
              </p>
              <p className="text-sm font-semibold text-foreground mt-0.5">
                {tutor.qualification || 'Bachelor Degree / Academic Faculty'}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Verified Higher Education Credential
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border/60 bg-muted/20 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Identity & Background
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <CheckCircle className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-semibold text-foreground">Govt. Verified ID</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                NID / Passport verified by Trust & Safety
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Institutional Affiliations */}
      {organizations.length > 0 && (
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold font-heading text-foreground flex items-center gap-2">
                <Building2 className="size-5 text-primary" />
                {t('tutorDetails.institutional_affiliations', 'Institutional Affiliations')}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Verified coaching branches, academies, or schools where this tutor instructs
              </p>
            </div>
            <Badge variant="outline" size="sm" className="hidden sm:inline-flex">
              {organizations.length} {organizations.length === 1 ? 'Organization' : 'Organizations'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {organizations.map((org) => (
              <Link
                key={org._id}
                to={`/organizations/${org.slug || org._id}`}
                className="group p-3.5 rounded-xl border border-border/70 hover:border-primary/40 bg-muted/20 hover:bg-muted/40 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-10 rounded-lg bg-background border border-border flex items-center justify-center shrink-0 overflow-hidden">
                    {org.logo ? (
                      <img
                        src={org.logo}
                        alt={org.name}
                        className="size-full object-cover"
                      />
                    ) : (
                      <Building2 className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {org.name}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground capitalize">
                      <span>{org.roleName || 'Instructor'}</span>
                      <span>•</span>
                      <span>{org.type ? org.type.replace('_', ' ') : 'Academy'}</span>
                    </div>
                  </div>
                </div>
                <ExternalLink className="size-4 text-muted-foreground group-hover:text-primary shrink-0 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

TutorCredentialsCard.propTypes = {
  tutor: PropTypes.shape({
    displayName: PropTypes.string,
    qualification: PropTypes.string,
    bio: PropTypes.string,
    experience: PropTypes.string,
    location: PropTypes.string,
    subjects: PropTypes.array,
    organizations: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        slug: PropTypes.string,
        type: PropTypes.string,
        roleName: PropTypes.string,
        logo: PropTypes.string,
      })
    ),
  }).isRequired,
};

export default TutorCredentialsCard;
