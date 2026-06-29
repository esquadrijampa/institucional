/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import emailjs from '@emailjs/browser';
import { VisitorSession } from './chatManager';

// Configuration keys for EmailJS
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';
const RECIPIENT_EMAIL = import.meta.env.VITE_EMAILJS_NOTIFICATION_RECIPIENT_EMAIL || 'mktesquadrijampa@gmail.com';

export interface EmailLog {
  id: string;
  timestamp: string;
  visitorName: string;
  device: string;
  referrer: string;
  status: 'sent' | 'pending_credentials' | 'failed';
  error?: string;
}

// In-memory or localStorage tracking of notification logs so the admin can audit them
const EMAIL_LOGS_KEY = 'esquadrijampa_email_notification_logs';

export function getEmailLogs(): EmailLog[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(EMAIL_LOGS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveEmailLog(log: EmailLog) {
  if (typeof window === 'undefined') return;
  const logs = getEmailLogs();
  const updated = [log, ...logs].slice(0, 50); // Keep last 50 logs
  localStorage.setItem(EMAIL_LOGS_KEY, JSON.stringify(updated));
  
  // Trigger a custom event so the dashboard can refresh if viewing logs
  window.dispatchEvent(new CustomEvent('esquadrijampa_email_logs_updated'));
}

export async function sendNewVisitorNotification(session: VisitorSession): Promise<boolean> {
  const timestamp = new Date().toISOString();
  
  // Prepare template parameters
  const templateParams = {
    to_email: RECIPIENT_EMAIL,
    visitor_name: session.customName || session.visitorName,
    visitor_id: session.sessionId,
    device: session.device,
    referrer: session.referrer,
    pages_visited: session.pagesPassed.join(' -> '),
    visits_count: session.visitsCount.toString(),
    started_at: new Date(session.startedAt).toLocaleString('pt-BR'),
    dashboard_url: window.location.origin + '?tab=chat&session=' + session.sessionId
  };

  // If the credentials are not set up yet, we will log a warning but also create a simulated log
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn(
      'EmailJS credentials not configured. Please define VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID and VITE_EMAILJS_PUBLIC_KEY in your .env file to send real emails.'
    );
    
    saveEmailLog({
      id: 'log_' + Date.now(),
      timestamp,
      visitorName: session.customName || session.visitorName,
      device: session.device,
      referrer: session.referrer,
      status: 'pending_credentials',
      error: 'Variáveis de ambiente do EmailJS não configuradas'
    });
    
    return false;
  }

  try {
    const result = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    console.log('Email notification sent successfully:', result.status, result.text);
    
    saveEmailLog({
      id: 'log_' + Date.now(),
      timestamp,
      visitorName: session.customName || session.visitorName,
      device: session.device,
      referrer: session.referrer,
      status: 'sent'
    });
    
    return true;
  } catch (error: any) {
    console.error('Failed to send email notification:', error);
    
    saveEmailLog({
      id: 'log_' + Date.now(),
      timestamp,
      visitorName: session.customName || session.visitorName,
      device: session.device,
      referrer: session.referrer,
      status: 'failed',
      error: error?.text || error?.message || 'Erro desconhecido'
    });
    
    return false;
  }
}
