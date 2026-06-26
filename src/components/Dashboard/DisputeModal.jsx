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

const DisputeModal = ({ open, onOpenChange, connectionId, sessionId, paymentId, onDisputeFiled }) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, control, formState: { errors }, reset } = useForm({
    defaultValues: {
      type: 'session_dispute',
      reason: ''
    }
  });

  const typeValue = useWatch({
    control,
    name: 'type'
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const toastId = toast.loading('Filing dispute...');
    try {
      const payload = {
        connectionId,
        type: data.type,
        reason: data.reason
      };
      if (sessionId) payload.sessionId = sessionId;
      if (paymentId) payload.paymentId = paymentId;

      await api.post('/api/v1/disputes', payload);
      toast.dismiss(toastId);
      toast.success('Dispute filed successfully. Our team will review it shortly.');
      reset();
      onOpenChange(false);
      if (onDisputeFiled) onDisputeFiled();
    } catch (err) {
      console.error('Failed to file dispute', err);
      toast.dismiss(toastId);
      toast.error(err.response?.data?.message || 'Failed to file dispute');
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
          <DialogTitle>File a Dispute</DialogTitle>
          <DialogDescription>
            Please provide details about the issue. Our support team will review your dispute and take appropriate action.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Dispute Type</label>
            <Select 
              value={typeValue} 
              onValueChange={(val) => setValue('type', val)}
            >
              <SelectTrigger className="w-full h-11 bg-input/40 border-border rounded-xl">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="session_dispute">Session Issue (e.g. No show)</SelectItem>
                <SelectItem value="payment_dispute">Payment Issue</SelectItem>
                <SelectItem value="conduct_dispute">Conduct / Behavior Issue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Reason / Description</label>
            <Textarea
              {...register('reason', { 
                required: 'Please provide a detailed reason',
                minLength: { value: 10, message: 'Reason must be at least 10 characters' }
              })}
              placeholder="Explain what happened in detail..."
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
              {loading ? 'Submitting...' : 'Submit Dispute'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DisputeModal;
