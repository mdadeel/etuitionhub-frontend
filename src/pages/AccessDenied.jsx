import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import Logo from '../components/shared/Logo';
import { Button } from '@/components/ui/button';

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <Logo boxSize="size-10" iconSize="size-6" textSize="text-base" />
        </div>
        <div className="mx-auto size-14 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
          <ShieldAlert className="size-7 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">403 — Access Denied</h1>
          <p className="text-muted-foreground text-sm">
            Your account does not have permission to access this area.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Button onClick={() => navigate('/admin-login')}>Go to Admin Login</Button>
          <Button onClick={() => navigate('/')} variant="outline">
            Back to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
