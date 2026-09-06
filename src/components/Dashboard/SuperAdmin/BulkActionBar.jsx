import { Trash2, UserCheck, UserX, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '../../../services/api';
import { useAppMutation } from '../../../hooks/queries/useAppMutation';

const ACTIONS = [
  { key: 'suspend', label: 'Suspend', icon: UserX, variant: 'warning' },
  { key: 'activate', label: 'Activate', icon: UserCheck, variant: 'success' },
  { key: 'delete', label: 'Delete', icon: Trash2, variant: 'destructive' },
  { key: 'export', label: 'Export CSV', icon: Download, variant: 'default' },
];

const BulkActionBar = ({ selectedIds, onClear, onAction, total = 0 }) => {
  if (selectedIds.length === 0) return null;

  const bulkMutation = useAppMutation({
    mutationFn: ({ userIds, action }) => api.patch('/api/admin/users/bulk', { userIds, action }),
    queryKey: ['users'],
    successMessage: false, // custom toast below
    invalidate: true,
    onSuccess: (res, { action, userIds }) => {
      const msg = `${res.data.affected} ${action === 'delete' ? 'deleted' : action + 'd'}`;
      const skipped = res.data.skipped ? ` (${res.data.skipped} skipped — cannot affect self)` : '';
      toast.success(`${msg}${skipped}`);
      onAction?.();
      onClear();
    },
    errorTitle: 'Bulk action failed',
  });

  const handleAction = (action) => {
    if (action === 'export') {
      const params = new URLSearchParams();
      selectedIds.forEach((id) => params.append('ids', id));
      api
        .get(`/api/admin/users/export?${params}`, { responseType: 'blob' })
        .then((res) => {
          const url = URL.createObjectURL(res.data);
          const a = document.createElement('a');
          a.href = url;
          a.download = `users-export-${Date.now()}.csv`;
          a.click();
          URL.revokeObjectURL(url);
          toast.success(`Exported ${selectedIds.length} users`);
        })
        .catch(() => toast.error('Export failed'));
      return;
    }

    if (action === 'delete') {
      if (!window.confirm(`Delete ${selectedIds.length} users? This cannot be undone.`)) return;
    }

    bulkMutation.mutate({ userIds: selectedIds, action });
  };

  const loading = bulkMutation.isPending ? bulkMutation.variables?.action : null;

  return (
    <div className="sticky top-0 z-10 mb-3 flex items-center justify-between gap-3 px-4 py-2.5 bg-primary/5 border border-primary/20 rounded-lg backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-foreground">
          {selectedIds.length} selected
        </span>
        {total > selectedIds.length && (
          <span className="text-xs text-muted-foreground">of {total}</span>
        )}
        <button
          onClick={onClear}
          className="ml-1 p-1 hover:bg-muted rounded transition-colors"
          aria-label="Clear selection"
        >
          <X size={14} className="text-muted-foreground" />
        </button>
      </div>
      <div className="flex items-center gap-1.5">
        {ACTIONS.map(({ key, label, icon: Icon, variant }) => (
          <Button
            key={key}
            size="sm"
            variant={variant === 'destructive' ? 'destructive' : variant === 'warning' ? 'warning' : 'outline'}
            onClick={() => handleAction(key)}
            disabled={loading === key || (loading && loading !== key)}
            className="h-8"
          >
            <Icon size={13} />
            <span className="hidden sm:inline">{label}</span>
            {loading === key && <span className="ml-1 size-3 border-2 border-current border-t-transparent rounded-full animate-spin" />}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default BulkActionBar;
