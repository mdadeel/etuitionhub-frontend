const PREFIX = '[e-tuition]';

export const logError = (context, message, error) => {
  console.error(`${PREFIX} ${context}:`, message, error || '');
};

export default { logError };
