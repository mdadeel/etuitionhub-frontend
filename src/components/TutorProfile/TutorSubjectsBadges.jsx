import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { BookOpen, Layers, CheckCircle2 } from 'lucide-react';

const SUBJECT_COLORS = {
  math: 'bg-primary/10 text-primary border-primary/20',
  mathematics: 'bg-primary/10 text-primary border-primary/20',
  'higher math': 'bg-primary/10 text-primary border-primary/20',
  physics: 'bg-secondary/15 text-secondary-foreground border-secondary/25',
  chemistry: 'bg-accent/15 text-accent-foreground border-accent/25',
  biology: 'bg-success/10 text-success border-success/20',
  english: 'bg-primary/10 text-primary border-primary/20',
  bangla: 'bg-secondary/15 text-secondary-foreground border-secondary/25',
  bengali: 'bg-secondary/15 text-secondary-foreground border-secondary/25',
  ict: 'bg-accent/15 text-accent-foreground border-accent/25',
  accounting: 'bg-warning/10 text-warning border-warning/20',
  economics: 'bg-warning/10 text-warning border-warning/20',
};

const getSubjectClass = (subjectName) => {
  const lower = (subjectName || '').toLowerCase().trim();
  for (const [key, cls] of Object.entries(SUBJECT_COLORS)) {
    if (lower.includes(key)) return cls;
  }
  return 'bg-muted/60 text-foreground border-border/80';
};

const TutorSubjectsBadges = ({ subjects = [] }) => {
  const { t } = useTranslation();

  const subjectList = Array.isArray(subjects) ? subjects : [];

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold font-heading text-foreground flex items-center gap-2">
            <BookOpen className="size-5 text-primary" />
            {t('tutorDetails.subjects_and_curriculums', 'Subject Mastery & Curriculums')}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Verified subjects and grade levels taught by this educator
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
          {subjectList.length} {subjectList.length === 1 ? 'Subject' : 'Subjects'}
        </span>
      </div>

      {/* Subject Badges */}
      {subjectList.length > 0 ? (
        <div className="flex flex-wrap gap-2.5">
          {subjectList.map((subject, idx) => {
            const badgeStyle = getSubjectClass(subject);
            return (
              <span
                key={idx}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all hover:scale-105 shadow-xs ${badgeStyle}`}
              >
                <CheckCircle2 className="size-3.5 opacity-80" />
                <span>{subject}</span>
              </span>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          {t('tutorDetails.no_subjects', 'No specific subjects listed')}
        </p>
      )}

      {/* Curriculum & Grade Levels Pill Strip */}
      <div className="mt-5 pt-4 border-t border-border/70">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Layers className="size-3.5 text-primary" />
          <span>Supported Curriculums</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {['Bangla Medium (NCTB)', 'English Version (NCTB)', 'English Medium (Edexcel/Cambridge)', 'University & Medical Admission'].map((curriculum) => (
            <span
              key={curriculum}
              className="text-xs px-2.5 py-1 rounded-lg bg-muted/40 text-muted-foreground border border-border/50"
            >
              {curriculum}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

TutorSubjectsBadges.propTypes = {
  subjects: PropTypes.arrayOf(PropTypes.string),
};

export default TutorSubjectsBadges;
