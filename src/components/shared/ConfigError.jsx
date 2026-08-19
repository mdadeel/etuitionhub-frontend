// ConfigError — shown by the route guards when the backend /api/config fetch
// (or Firebase init) fails. The app cannot authenticate without it, so we stop
// the loading skeleton and give the user a clear, retryable message instead of
// a silent redirect loop or a hung spinner.
import { AlertTriangle, RotateCw } from 'lucide-react';

const ConfigError = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 text-center">
        <AlertTriangle className="mx-auto mb-4 size-10 text-destructive" aria-hidden="true" />
        <h1 className="text-lg font-semibold text-foreground">Couldn't load app configuration</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The app needs to fetch its configuration from the server before you can sign in.
          Check your connection and try again.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <RotateCw className="size-4" aria-hidden="true" />
          Retry
        </button>
      </div>
    </div>
  );
};

export default ConfigError;
