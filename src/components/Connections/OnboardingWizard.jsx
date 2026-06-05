import { useState } from 'react';
import ConnectionStatusBadge from './ConnectionStatusBadge';
import CancelConnectionDialog from './CancelConnectionDialog';
import ProposeDetailsForm from './steps/ProposeDetailsForm';
import ConfirmDetailsPanel from './steps/ConfirmDetailsPanel';
import PayPanel from './steps/PayPanel';
import ActivePanel from './steps/ActivePanel';

const currentStep = (connection, role) => {
  if (connection.status !== 'accepted') return null;
  if (!connection.proposedAt && role === 'tutor') return 'propose';
  if (!connection.proposedAt && role === 'student') return 'waitingForProposal';
  if (!connection.confirmedByStudent && role === 'student') return 'confirm';
  if (connection.relationshipStatus === 'waiting_for_payment' && role === 'tutor') return 'pay';
  return connection.relationshipStatus || 'active';
};

const STEP_TITLES = {
  propose: 'Step 1 of 4: Propose details',
  waitingForProposal: 'Step 1 of 4: Awaiting tutor proposal',
  confirm: 'Step 2 of 4: Confirm details',
  pay: 'Step 3 of 4: Mark payment',
  scheduled: 'Step 4 of 4: Scheduled',
  active: 'Tutoring is active',
  paused: 'Tutoring is paused',
  completed: 'Tutoring completed'
};

const OnboardingWizard = ({ connection, viewerRole, onChange }) => {
  const [cancelOpen, setCancelOpen] = useState(false);
  const step = currentStep(connection, viewerRole);
  if (!step) return null;

  return (
    <div className="border border-border rounded-lg p-4 bg-card space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">{STEP_TITLES[step]}</h3>
          <p className="text-xs text-muted-foreground">with {connection.tutorId?.displayName || connection.studentId?.displayName || '...'}</p>
        </div>
        <ConnectionStatusBadge status={connection.status} relationshipStatus={connection.relationshipStatus} />
      </div>

      {step === 'propose' && <ProposeDetailsForm connection={connection} onProposed={onChange} />}
      {step === 'waitingForProposal' && (
        <p className="text-sm text-muted-foreground">
          Your tutor is preparing the proposal. We'll notify you when it's ready.
        </p>
      )}
      {step === 'confirm' && <ConfirmDetailsPanel connection={connection} onConfirmed={onChange} />}
      {step === 'pay' && <PayPanel connection={connection} onMarked={onChange} />}
      {(step === 'scheduled' || step === 'active' || step === 'paused' || step === 'completed') && (
        <ActivePanel
          connection={connection}
          onPaused={onChange}
          onCompleted={onChange}
          onCancel={() => setCancelOpen(true)}
        />
      )}

      <CancelConnectionDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        connectionId={connection._id}
        onCancelled={onChange}
      />
    </div>
  );
};

export default OnboardingWizard;
