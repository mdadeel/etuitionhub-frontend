import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ModerationModal = ({ open, onOpenChange, targetUser, organizationId, onModerationComplete }) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, control, formState: { errors }, reset } = useForm({
    defaultValues: {
      action: 'warning',
      reason: '',
      durationDays: ''
    }
  });

  const actionValue = useWatch({
    control,
    name: 'action'
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const toastId = toast.loading('Applying moderation...');
    try {
      const payload = {
        userId: targetUser._id,
        action: data.action,
        reason: data.reason
      };
      if (organizationId) payload.organizationId = organizationId;
      if (data.action === 'suspend' && data.durationDays) {
        payload.durationDays = parseInt(data.durationDays, 10);
      }

      await api.post('/api/v1/moderation', payload);
      toast.dismiss(toastId);
      toast.success(`Successfully issued ${data.action} to ${targetUser?.displayName || targetUser?.email}`);
      reset();
      onOpenChange(false);
      if (onModerationComplete) onModerationComplete();
    } catch (err) {
      console.error('Failed to moderate user', err);
      toast.dismiss(toastId);
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Failed to moderate user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) reset();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Moderate User</DialogTitle>
          <DialogDescription>
            Applying moderation to <span className="font-bold text-foreground">{targetUser?.displayName || targetUser?.email}</span>.
            {organizationId ? ' This action applies only to this organization.' : ' This is a GLOBAL platform action.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Action</label>
            <Select 
              value={actionValue} 
              onValueChange={(val) => setValue('action', val)}
            >
              <SelectTrigger className="w-full h-11 bg-input/40 border-border rounded-xl">
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="warning">Issue Warning (Notification)</SelectItem>
                <SelectItem value="suspend">Temporary Suspension</SelectItem>
                <SelectItem value="ban">Permanent Ban</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {actionValue === 'suspend' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Duration (Days)</label>
              <input
                type="number"
                min="1"
                max="365"
                {...register('durationDays', { required: 'Duration is required for suspension' })}
                placeholder="e.g. 7"
                className="w-full text-sm border border-border rounded-xl px-4 py-3 bg-input/40 focus:outline-none focus:border-primary transition-colors"
              />
              {errors.durationDays && <p className="text-xs text-red-500">{errors.durationDays.message}</p>}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Reason</label>
            <Textarea
              {...register('reason', { 
                required: 'Please provide a reason',
                minLength: { value: 5, message: 'Reason must be at least 5 characters' }
              })}
              placeholder="Explain the reason for this action..."
              className="min-h-[100px] resize-none bg-input/40 border-border rounded-xl"
            />
            {errors.reason && <p className="text-xs text-red-500">{errors.reason.message}</p>}
          </div>

          <DialogFooter className="pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="rounded-xl h-11"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="rounded-xl h-11 bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? 'Applying...' : 'Apply Action'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModerationModal;
