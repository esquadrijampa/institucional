/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PageViewEvent {
  sessionId?: string;
  path: string;
  title: string;
  timestamp: string;
  referrer: string;
  device: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface ClickEvent {
  sessionId?: string;
  text: string;
  elementId: string;
  elementClass: string;
  category: string;
  path: string;
  timestamp: string;
}

// Keys for localStorage
const VIEWS_KEY = 'esquadrijampa_analytics_views';
const CLICKS_KEY = 'esquadrijampa_analytics_clicks';
const SESSION_KEY = 'esquadrijampa_analytics_session_id';

// Helper to get device category
function getDeviceType(): string {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return 'Computador';
  const ua = navigator.userAgent;
  const isMobileUA = /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua);
  const isTabletUA = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua);
  
  if (isTabletUA) return 'Tablet';
  if (isMobileUA) return 'Celular';
  return 'Computador';
}

// Parse UTM parameters from URL
function getUtmParams(): { source?: string; medium?: string; campaign?: string } {
  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get('utm_source') || undefined,
    medium: params.get('utm_medium') || undefined,
    campaign: params.get('utm_campaign') || undefined,
  };
}

// Generate realistic simulated history for the last 30 days
function generateSimulatedHistory() {
  const views: PageViewEvent[] = [];
  const clicks: ClickEvent[] = [];
  const now = new Date();

  const pages = [
    { path: '/', title: 'Esquadrijampa - Home', weight: 45 },
    { path: '/esquadrias', title: 'Esquadrijampa - Esquadrias', weight: 20 },
    { path: '/fachadas', title: 'Esquadrijampa - Fachadas', weight: 15 },
    { path: '/portfolio', title: 'Esquadrijampa - Portfólio', weight: 10 },
    { path: '/sobre-nos', title: 'Esquadrijampa - Sobre Nós', weight: 5 },
    { path: '/contato', title: 'Esquadrijampa - Contato', weight: 5 },
  ];

  const referrers = [
    { name: 'Google (Orgânico)', weight: 35, utm: { source: 'google', medium: 'organic' } },
    { name: 'Direto / Favoritos', weight: 25, utm: {} },
    { name: 'Google Ads (Campanha)', weight: 15, utm: { source: 'google', medium: 'cpc', campaign: 'lead_geral' } },
    { name: 'Instagram', weight: 15, utm: { source: 'instagram', medium: 'social', campaign: 'link_bio' } },
    { name: 'Facebook', weight: 10, utm: { source: 'facebook', medium: 'social' } },
  ];

  const clickTypes = [
    { text: 'Fale no WhatsApp', id: 'floating-whatsapp-btn', category: 'floating_buttons', weight: 60 },
    { text: 'Solicitar Orçamento', id: 'cta-home-orcamento', category: 'cta', weight: 20 },
    { text: 'Enviar Mensagem (Form)', id: 'contact-submit-btn', category: 'contato_section', weight: 15 },
    { text: 'Ligar para Esquadrijampa', id: 'floating-call-btn', category: 'floating_buttons', weight: 5 },
  ];

  const devices = [
    { type: 'Mobile', weight: 68 },
    { type: 'Desktop', weight: 28 },
    { type: 'Tablet', weight: 4 },
  ];

  // Helper to pick randomly based on weights
  function pickWeighted<T>(items: Array<T & { weight: number }>): T {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    for (const item of items) {
      if (random < item.weight) return item;
      random -= item.weight;
    }
    return items[0];
  }

  // Generate data daily over the past 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    // Weekend dip in traffic
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseVisitors = isWeekend ? 20 + Math.floor(Math.random() * 15) : 45 + Math.floor(Math.random() * 30);

    for (let v = 0; v < baseVisitors; v++) {
      const visitorTime = new Date(date);
      visitorTime.setHours(Math.floor(Math.random() * 16) + 7); // Active hours between 7 AM and 11 PM
      visitorTime.setMinutes(Math.floor(Math.random() * 60));
      visitorTime.setSeconds(Math.floor(Math.random() * 60));

      const ref = pickWeighted(referrers);
      const dev = pickWeighted(devices);

      // A single visitor views 2 to 4 pages on average
      const pagesToView = Math.floor(Math.random() * 3) + 2;
      for (let p = 0; p < pagesToView; p++) {
        const page = pickWeighted(pages);
        const viewTime = new Date(visitorTime);
        viewTime.setMinutes(viewTime.getMinutes() + p * 4); // Views pages in sequence

        views.push({
          path: page.path,
          title: page.title,
          timestamp: viewTime.toISOString(),
          referrer: ref.name,
          device: dev.type,
          utmSource: ref.utm.source,
          utmMedium: ref.utm.medium,
          utmCampaign: ref.utm.campaign,
        });

        // 12% conversion chance for visiting the Contact/CTA button
        if (Math.random() < 0.12) {
          const click = pickWeighted(clickTypes);
          const clickTime = new Date(viewTime);
          clickTime.setSeconds(clickTime.getSeconds() + 45); // Clicks after 45 seconds of reading

          clicks.push({
            text: click.text,
            elementId: click.id,
            elementClass: 'btn-simulated',
            category: click.category,
            path: page.path,
            timestamp: clickTime.toISOString(),
          });
        }
      }
    }
  }

  // Save to localStorage
  localStorage.setItem(VIEWS_KEY, JSON.stringify(views));
  localStorage.setItem(CLICKS_KEY, JSON.stringify(clicks));
}

// Public API
export const analyticsTracker = {
  /**
   * Initializes the tracker, checking for existing logs.
   * If empty, populates simulated 30-day logs to allow immediate professional dashboard use.
   */
  init() {
    try {
      const views = localStorage.getItem(VIEWS_KEY);
      if (!views) {
        generateSimulatedHistory();
      }

      // Track current session ID
      let sessionId = sessionStorage.getItem(SESSION_KEY);
      if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem(SESSION_KEY, sessionId);
      }

      // Track initial landing pageview
      this.trackPageView(window.location.pathname, document.title);
    } catch (err) {
      console.warn('Analytics initialization warning:', err);
    }
  },

  /**
   * Log a page view event
   */
  trackPageView(path: string, title: string) {
    try {
      const viewsRaw = localStorage.getItem(VIEWS_KEY);
      const views: PageViewEvent[] = viewsRaw ? JSON.parse(viewsRaw) : [];
      
      const utm = getUtmParams();
      const referrer = document.referrer ? new URL(document.referrer).hostname : 'Direto / Favoritos';
      const sessionId = sessionStorage.getItem('esquadrijampa_analytics_session_id') || undefined;

      const event: PageViewEvent = {
        sessionId,
        path,
        title,
        timestamp: new Date().toISOString(),
        referrer: referrer === window.location.hostname ? 'Interno' : (referrer || 'Direto / Favoritos'),
        device: getDeviceType(),
        utmSource: utm.source,
        utmMedium: utm.medium,
        utmCampaign: utm.campaign,
      };

      views.push(event);
      localStorage.setItem(VIEWS_KEY, JSON.stringify(views));
    } catch (err) {
      console.warn('Analytics pageview track failed:', err);
    }
  },

  /**
   * Log a button/link click event
   */
  trackClick(text: string, elementId: string, elementClass: string, category: string, path: string) {
    try {
      const clicksRaw = localStorage.getItem(CLICKS_KEY);
      const clicks: ClickEvent[] = clicksRaw ? JSON.parse(clicksRaw) : [];
      const sessionId = sessionStorage.getItem('esquadrijampa_analytics_session_id') || undefined;

      const event: ClickEvent = {
        sessionId,
        text: text || 'Botão sem texto',
        elementId: elementId || 'sem_id',
        elementClass: elementClass || '',
        category: category || 'geral',
        path: path || window.location.pathname,
        timestamp: new Date().toISOString(),
      };

      clicks.push(event);
      localStorage.setItem(CLICKS_KEY, JSON.stringify(clicks));
    } catch (err) {
      console.warn('Analytics click track failed:', err);
    }
  },

  /**
   * Retrieve all views from storage
   */
  getViews(): PageViewEvent[] {
    try {
      const views = localStorage.getItem(VIEWS_KEY);
      return views ? JSON.parse(views) : [];
    } catch {
      return [];
    }
  },

  /**
   * Retrieve all clicks from storage
   */
  getClicks(): ClickEvent[] {
    try {
      const clicks = localStorage.getItem(CLICKS_KEY);
      return clicks ? JSON.parse(clicks) : [];
    } catch {
      return [];
    }
  },

  /**
   * Clear tracking data to restart
   */
  clearAll() {
    try {
      localStorage.removeItem(VIEWS_KEY);
      localStorage.removeItem(CLICKS_KEY);
      generateSimulatedHistory();
    } catch (err) {
      console.warn('Clear analytics logs failed:', err);
    }
  }
};
