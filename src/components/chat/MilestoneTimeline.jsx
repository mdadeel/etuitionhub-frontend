const MilestoneTimeline = ({ conversationId, onClose }) => {
  return (
    <div className="bg-card rounded-lg p-6 max-w-2xl w-full mx-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Milestone Timeline</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          ×
        </button>
      </div>
      <p className="text-sm text-muted-foreground">
        TODO: implement milestone timeline for conversation <code className="font-mono text-xs">{conversationId}</code>
      </p>
    </div>
  );
};

export default MilestoneTimeline;
