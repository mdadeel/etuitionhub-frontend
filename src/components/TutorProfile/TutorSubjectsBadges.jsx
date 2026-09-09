import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { BookOpen, Layers, CheckCircle2 } from 'lucide-react';

const SUBJECT_COLORS = {
  math: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
  mathematics: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
  'higher math': 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20',
  physics: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20',
  chemistry: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
  biology: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
  english: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20',
  bangla: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20',
  bengali: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20',
  ict: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20',
  accounting: 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20',
  economics: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-500/20',
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
