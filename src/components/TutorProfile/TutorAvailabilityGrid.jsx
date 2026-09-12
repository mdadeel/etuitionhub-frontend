import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  Calendar,
  Home,
  Laptop,
  Users,
  CheckCircle,
  Clock,
} from 'lucide-react';

const DAYS_OF_WEEK = [
  'Saturday',
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
];

const TutorAvailabilityGrid = ({ availableDays = [], location, thana }) => {
  const { t } = useTranslation();

  const activeDays = Array.isArray(availableDays) ? availableDays : [];

  const isDayAvailable = (dayName) => {
    return activeDays.some(
      (d) => d.toLowerCase().includes(dayName.toLowerCase()) || dayName.toLowerCase().includes(d.toLowerCase())
    );
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-6">
      {/* Delivery Modes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold font-heading text-foreground flex items-center gap-2">
              <Laptop className="size-5 text-primary" />
              {t('tutorDetails.tuition_modes', 'Tuition Delivery Modes')}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Available modes for conducting classes with this educator
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Home Tutoring */}
          <div className="p-4 rounded-xl border border-border/60 bg-muted/20 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="size-8 rounded-lg bg-success/10 text-success flex items-center justify-center">
                <Home className="size-4.5" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">In-Person Home Visits</h3>
              <p className="text-xs text-muted-foreground">
                Tutor travels directly to student residence in{' '}
                <strong className="text-foreground">{thana || location?.split(',')[0] || 'designated area'}</strong>.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-border/40 flex items-center gap-1.5 text-xs text-success font-medium">
              <CheckCircle className="size-3.5" />
              <span>Available</span>
            </div>
          </div>

          {/* Online Live */}
          <div className="p-4 rounded-xl border border-border/60 bg-muted/20 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Laptop className="size-4.5" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Online 1-on-1 Live</h3>
              <p className="text-xs text-muted-foreground">
                High-definition live interactive sessions via Zoom/Meet with digital writing pad.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-border/40 flex items-center gap-1.5 text-xs text-primary font-medium">
              <CheckCircle className="size-3.5" />
              <span>Available Nationwide</span>
            </div>
          </div>

          {/* Small Batch */}
          <div className="p-4 rounded-xl border border-border/60 bg-muted/20 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="size-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                <Users className="size-4.5" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Batch & Coaching</h3>
              <p className="text-xs text-muted-foreground">
                Focused small-group batches for board exam & competitive admissions prep.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-border/40 flex items-center gap-1.5 text-xs text-secondary font-medium">
              <CheckCircle className="size-3.5" />
              <span>Upon Request</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold font-heading text-foreground flex items-center gap-2">
            <Calendar className="size-4 text-primary" />
            {t('tutorDetails.availability', 'Weekly Availability')}
          </h3>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="size-3 text-primary" />
            <span>Evening & Afternoon slots preferred</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {DAYS_OF_WEEK.map((day) => {
            const available = isDayAvailable(day);
            return (
              <div
                key={day}
                className={`p-3 rounded-xl border text-center transition-all ${
                  available
                    ? 'border-success/40 bg-success/10 text-foreground shadow-xs'
                    : 'border-border/40 bg-muted/15 text-muted-foreground/50 opacity-60'
                }`}
              >
                <p className="text-xs font-semibold">{day.slice(0, 3)}</p>
                <p className="text-[11px] mt-1 font-medium">
                  {available ? (
                    <span className="text-success">Available</span>
                  ) : (
                    <span>Off</span>
                  )}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

TutorAvailabilityGrid.propTypes = {
  availableDays: PropTypes.arrayOf(PropTypes.string),
  location: PropTypes.string,
  thana: PropTypes.string,
};

export default TutorAvailabilityGrid;
