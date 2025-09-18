import { log } from 'console';

export const logEvent = (action: string, details: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] - ACCIÓN: ${action}`, details);
};