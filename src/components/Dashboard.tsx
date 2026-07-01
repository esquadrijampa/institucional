/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef, FormEvent } from 'react';
import { 
  BarChart3, 
  MousePointerClick, 
  Globe, 
  Smartphone, 
  Layers, 
  LogOut, 
  Clock, 
  Calendar,
  Lock, 
  CheckCircle, 
  RefreshCw,
  Search,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  AlertCircle,
  MessageSquare,
  Send,
  User,
  Edit,
  FileText,
  History,
  Trash2,
  Sparkles,
  Check,
  X,
  Mail,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Archive,
  CheckCheck,
  Camera,
  MoreVertical,
  Plus,
  Pin,
  Phone,
  Users,
  Settings
} from 'lucide-react';
import { analyticsTracker, PageViewEvent, ClickEvent } from '../lib/analyticsTracker';
import { chatManager, VisitorSession, ChatMessage, formatTimeOnline } from '../lib/chatManager';
import { getEmailLogs, EmailLog, sendNewVisitorNotification } from '../lib/emailNotifier';
import { ActivePage } from '../types';

interface SessionDurationProps {
  startedAt: string;
  lastActive?: string;
  online?: boolean;
  className?: string;
}

function SessionDuration({ startedAt, lastActive, online, className = "" }: SessionDurationProps) {
  const [durationStr, setDurationStr] = useState<string>("");

  useEffect(() => {
    const update = () => {
      setDurationStr(formatTimeOnline(startedAt, lastActive, online));
    };

    update(); // Run immediately

    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [startedAt, lastActive, online]);

  return <span className={className}>{durationStr}</span>;
}

interface DashboardProps {
  onBackToHome: () => void;
}

export default function Dashboard({ onBackToHome }: DashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [timeRange, setTimeRange] = useState<'7' | '14' | '30' | 'custom'>('14');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [metricsSource, setMetricsSource] = useState<'real' | 'simulated'>('real');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Live Chat system state variables
  const [activeTab, setActiveTab] = useState<'metrics' | 'chat'>('metrics');
  const [chatSessions, setChatSessions] = useState<VisitorSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [showDossierOnMobile, setShowDossierOnMobile] = useState<boolean>(false);
  const [adminMessageInput, setAdminMessageInput] = useState<string>('');
  const [editingNameSessionId, setEditingNameSessionId] = useState<string | null>(null);
  const [editingNameValue, setEditingNameValue] = useState<string>('');
  const [editingPhoneSessionId, setEditingPhoneSessionId] = useState<string | null>(null);
  const [editingPhoneValue, setEditingPhoneValue] = useState<string>('');
  const [editingLocationSessionId, setEditingLocationSessionId] = useState<string | null>(null);
  const [editingCityValue, setEditingCityValue] = useState<string>('');
  const [editingStateValue, setEditingStateValue] = useState<string>('');
  const [editingNeighborhoodValue, setEditingNeighborhoodValue] = useState<string>('');
  const [chatSortBy, setChatSortBy] = useState<'recent' | 'online_time' | 'alphabetical' | 'unread'>('recent');
  const [currentSubTab, setCurrentSubTab] = useState<'active' | 'archived'>('active');
  const [notesSaveStatus, setNotesSaveStatus] = useState<string>('');
  const [chatSearchTerm, setChatSearchTerm] = useState<string>('');
  const [chatStatusFilter, setChatStatusFilter] = useState<'all' | 'online' | 'offline' | 'with_messages'>('all');
  const [quickSendSessionId, setQuickSendSessionId] = useState<string>('');
  const [quickSendMessageText, setQuickSendMessageText] = useState<string>('');
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  // Email Notification system states
  const [showEmailConfig, setShowEmailConfig] = useState<boolean>(false);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [isSendingTestEmail, setIsSendingTestEmail] = useState<boolean>(false);
  const [testEmailResult, setTestEmailResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showYouProfile, setShowYouProfile] = useState<boolean>(false);


  // Auto-authenticate if session token exists
  useEffect(() => {
    const auth = sessionStorage.getItem('esquadrijampa_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Handle Login submission
  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (password === '123456') {
      setIsAuthenticated(true);
      setError('');
      sessionStorage.setItem('esquadrijampa_admin_auth', 'true');
    } else {
      setError('Senha incorreta. Tente novamente.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('esquadrijampa_admin_auth');
    onBackToHome();
  };

  // State to hold raw tracking records
  const [views, setViews] = useState<PageViewEvent[]>([]);
  const [clicks, setClicks] = useState<ClickEvent[]>([]);

  // Load tracking records
  const loadData = () => {
    setViews(analyticsTracker.getViews());
    setClicks(analyticsTracker.getClicks());
  };

  // Real-time listener and poller
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      setChatSessions(chatManager.getSessions());

      // Subscribe to real-time cross-tab chat changes
      const unsubscribeChat = chatManager.subscribe(() => {
        setChatSessions(chatManager.getSessions());
      });

      // Poll page logs and update active session durations
      const interval = setInterval(() => {
        loadData();
        chatManager.updateOnlineStates();
      }, 5000);

      return () => {
        unsubscribeChat();
        clearInterval(interval);
      };
    }
  }, [isAuthenticated]);

  // Scroll to bottom and mark as read on new admin chat messages
  useEffect(() => {
    if (chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (selectedSessionId) {
      chatManager.markAsRead(selectedSessionId, 'admin');
    }
  }, [selectedSessionId, chatSessions]);

  // Load and subscribe to email notification logs
  useEffect(() => {
    if (isAuthenticated) {
      setEmailLogs(getEmailLogs());
      
      const handleLogsUpdate = () => {
        setEmailLogs(getEmailLogs());
      };
      
      window.addEventListener('esquadrijampa_email_logs_updated', handleLogsUpdate);
      return () => {
        window.removeEventListener('esquadrijampa_email_logs_updated', handleLogsUpdate);
      };
    }
  }, [isAuthenticated]);

  const handleResetData = () => {
    if (window.confirm('Deseja redefinir os dados para o padrão simulado de 30 dias? Eventos de teste atuais serão mesclados.')) {
      analyticsTracker.clearAll();
      loadData();
    }
  };

  const handleSendTestEmail = async () => {
    setIsSendingTestEmail(true);
    setTestEmailResult(null);
    
    // Create a dummy visitor session for the test email
    const dummySession: VisitorSession = {
      sessionId: 'test_' + Date.now(),
      visitorName: 'Visitante de Teste',
      isRegistered: true,
      online: true,
      lastActive: new Date().toISOString(),
      startedAt: new Date().toISOString(),
      device: 'Desktop (Simulado)',
      referrer: 'Painel Administrativo (Teste de Alerta)',
      visitsCount: 1,
      pagesPassed: ['/contato', '/portfolio'],
      clicks: [],
      messages: [],
      adminNotes: 'Esta é uma mensagem automática de teste para validar o funcionamento do EmailJS.'
    };
    
    const success = await sendNewVisitorNotification(dummySession);
    setIsSendingTestEmail(false);
    
    if (success) {
      setTestEmailResult({
        success: true,
        message: 'E-mail de teste enviado com sucesso! Verifique sua caixa de entrada.'
      });
    } else {
      setTestEmailResult({
        success: false,
        message: 'Falha no envio de e-mail real. Mas não se preocupe: a simulação foi registrada nas notas abaixo!'
      });
    }
    
    // Auto-clear result after 6 seconds
    setTimeout(() => {
      setTestEmailResult(null);
    }, 6000);
  };

  // Count unread customer messages for notification badges
  const unreadCount = useMemo(() => {
    return chatSessions.reduce((acc, s) => acc + s.messages.filter(m => m.sender === 'visitor' && !m.read).length, 0);
  }, [chatSessions]);

  // Dynamically compute views and clicks based on real Firestore session history vs simulated history
  const computedViewsAndClicks = useMemo(() => {
    if (metricsSource === 'simulated') {
      return { views, clicks };
    }

    // Compile from real Firestore chatSessions
    const realViews: PageViewEvent[] = [];
    const realClicks: ClickEvent[] = [];

    chatSessions.forEach(session => {
      // Ignore simulated sessions in real production view
      if (session.isSimulated) return;

      const baseDate = new Date(session.startedAt || session.lastActive || Date.now());

      // Aggregate pagesPassed as PageViewEvents
      if (session.pagesPassed && session.pagesPassed.length > 0) {
        session.pagesPassed.forEach((path, idx) => {
          // Stagger the views by a few minutes so they have distinct times
          const viewTime = new Date(baseDate.getTime() + idx * 3 * 60 * 1000);
          realViews.push({
            path,
            title: `Esquadrijampa - ${path === '/' ? 'Home' : path.substring(1)}`,
            timestamp: viewTime.toISOString(),
            referrer: session.referrer || 'Direto / Favoritos',
            device: session.device || 'Computador',
          });
        });
      } else {
        // Fallback for sessions that don't have pagesPassed array (single page)
        realViews.push({
          path: '/',
          title: 'Esquadrijampa - Home',
          timestamp: baseDate.toISOString(),
          referrer: session.referrer || 'Direto / Favoritos',
          device: session.device || 'Computador',
        });
      }

      // Aggregate clicks
      if (session.clicks && session.clicks.length > 0) {
        session.clicks.forEach(click => {
          realClicks.push({
            ...click,
            timestamp: click.timestamp || baseDate.toISOString(),
          });
        });
      }
    });

    return {
      views: realViews,
      clicks: realClicks,
    };
  }, [views, clicks, chatSessions, metricsSource]);

  // Computed data based on selected time range or custom range
  const filteredData = useMemo(() => {
    const sourceViews = computedViewsAndClicks.views;
    const sourceClicks = computedViewsAndClicks.clicks;

    let rangeViews = sourceViews;
    let rangeClicks = sourceClicks;

    if (timeRange !== 'custom') {
      const now = new Date();
      const thresholdDate = new Date();
      thresholdDate.setDate(now.getDate() - parseInt(timeRange));

      rangeViews = sourceViews.filter(v => new Date(v.timestamp) >= thresholdDate);
      rangeClicks = sourceClicks.filter(c => new Date(c.timestamp) >= thresholdDate);
    } else {
      if (startDate || endDate) {
        const startThreshold = startDate ? new Date(startDate) : new Date(0);
        // Include the entire end date by setting it to the end of day
        const endThreshold = endDate ? new Date(endDate + 'T23:59:59') : new Date();

        rangeViews = sourceViews.filter(v => {
          const viewDate = new Date(v.timestamp);
          return viewDate >= startThreshold && viewDate <= endThreshold;
        });
        rangeClicks = sourceClicks.filter(c => {
          const clickDate = new Date(c.timestamp);
          return clickDate >= startThreshold && clickDate <= endThreshold;
        });
      }
    }

    return {
      views: rangeViews,
      clicks: rangeClicks,
    };
  }, [computedViewsAndClicks, timeRange, startDate, endDate]);

  // Aggregate stats
  const stats = useMemo(() => {
    const v = filteredData.views;
    const c = filteredData.clicks;

    // Estimate unique visitors based on combinations of referrer + device + date (or actual session tracker)
    const visitorKeys = new Set();
    v.forEach(view => {
      const dt = view.timestamp.split('T')[0];
      visitorKeys.add(`${view.referrer}_${view.device}_${dt}`);
    });

    const uniqueVisitorsCount = Math.max(1, visitorKeys.size);
    const totalPageviews = v.length;
    const whatsappClicks = c.filter(click => click.elementId === 'floating-whatsapp-btn').length;
    const totalConversions = c.length;
    
    const conversionRate = uniqueVisitorsCount > 0 
      ? ((totalConversions / uniqueVisitorsCount) * 100).toFixed(1) 
      : '0.0';

    const avgPageviewsPerVisitor = uniqueVisitorsCount > 0 
      ? (totalPageviews / uniqueVisitorsCount).toFixed(1) 
      : '1.0';

    return {
      visitors: uniqueVisitorsCount,
      pageviews: totalPageviews,
      conversions: totalConversions,
      whatsappClicks,
      conversionRate,
      avgPageviews: avgPageviewsPerVisitor,
    };
  }, [filteredData]);

  // Daily Chart aggregation (Views & Visits over selected days)
  const chartData = useMemo(() => {
    const data: Array<{ dateStr: string; label: string; views: number; visits: number }> = [];
    const now = new Date();

    if (timeRange !== 'custom') {
      const days = parseInt(timeRange);
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        const yyyymmdd = d.toISOString().split('T')[0];

        // Views for this day
        const dayViews = filteredData.views.filter(v => v.timestamp.startsWith(yyyymmdd));
        
        // Visits for this day
        const visitorKeys = new Set();
        dayViews.forEach(view => {
          visitorKeys.add(`${view.referrer}_${view.device}`);
        });
        const dayVisits = Math.max(dayViews.length > 0 ? 1 : 0, visitorKeys.size);

        // Formatting label e.g., "25 Jun"
        const label = d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }).replace('.', '');

        data.push({
          dateStr: yyyymmdd,
          label,
          views: dayViews.length,
          visits: dayVisits,
        });
      }
    } else {
      // Custom date range charting
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        let days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        if (days > 120) days = 120; // safe limit

        for (let i = 0; i < days; i++) {
          const d = new Date(start);
          d.setDate(start.getDate() + i);
          const yyyymmdd = d.toISOString().split('T')[0];

          // Views for this day
          const dayViews = filteredData.views.filter(v => v.timestamp.startsWith(yyyymmdd));
          
          // Visits for this day
          const visitorKeys = new Set();
          dayViews.forEach(view => {
            visitorKeys.add(`${view.referrer}_${view.device}`);
          });
          const dayVisits = Math.max(dayViews.length > 0 ? 1 : 0, visitorKeys.size);

          // Formatting label e.g., "25 Jun"
          const label = d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }).replace('.', '');

          data.push({
            dateStr: yyyymmdd,
            label,
            views: dayViews.length,
            visits: dayVisits,
          });
        }
      } else {
        // Default to last 14 days if custom date range is selected but not completely set
        const days = 14;
        for (let i = days - 1; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(now.getDate() - i);
          const yyyymmdd = d.toISOString().split('T')[0];

          // Views for this day
          const dayViews = filteredData.views.filter(v => v.timestamp.startsWith(yyyymmdd));
          
          // Visits for this day
          const visitorKeys = new Set();
          dayViews.forEach(view => {
            visitorKeys.add(`${view.referrer}_${view.device}`);
          });
          const dayVisits = Math.max(dayViews.length > 0 ? 1 : 0, visitorKeys.size);

          // Formatting label e.g., "25 Jun"
          const label = d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }).replace('.', '');

          data.push({
            dateStr: yyyymmdd,
            label,
            views: dayViews.length,
            visits: dayVisits,
          });
        }
      }
    }

    return data;
  }, [filteredData, timeRange, startDate, endDate]);

  // Traffic Sources aggregation
  const trafficSources = useMemo(() => {
    const sourcesMap: Record<string, { count: number; name: string }> = {};
    filteredData.views.forEach(v => {
      let src = v.referrer || 'Direto / Favoritos';
      if (v.utmSource) {
        src = `${v.utmSource.toUpperCase()} (${v.utmMedium || 'cpc'})`;
      }
      sourcesMap[src] = sourcesMap[src] || { count: 0, name: src };
      sourcesMap[src].count++;
    });

    return Object.values(sourcesMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [filteredData]);

  // Device distribution
  const deviceStats = useMemo(() => {
    let mobile = 0, desktop = 0, tablet = 0;
    filteredData.views.forEach(v => {
      const dev = v.device?.toLowerCase() || '';
      if (dev.includes('mobile') || dev.includes('celular') || dev.includes('phone')) {
        mobile++;
      } else if (dev.includes('tablet') || dev.includes('ipad')) {
        tablet++;
      } else {
        desktop++;
      }
    });

    const total = Math.max(1, mobile + desktop + tablet);
    return [
      { name: 'Celulares', count: mobile, percentage: ((mobile / total) * 100).toFixed(0) },
      { name: 'Computadores', count: desktop, percentage: ((desktop / total) * 100).toFixed(0) },
      { name: 'Tablets', count: tablet, percentage: ((tablet / total) * 100).toFixed(0) },
    ];
  }, [filteredData]);

  // Most Visited Pages
  const pageStats = useMemo(() => {
    const pagesMap: Record<string, { path: string; title: string; count: number }> = {};
    filteredData.views.forEach(v => {
      const cleanPath = v.path || '/';
      pagesMap[cleanPath] = pagesMap[cleanPath] || { path: cleanPath, title: v.title, count: 0 };
      pagesMap[cleanPath].count++;
    });

    return Object.values(pagesMap)
      .sort((a, b) => b.count - a.count);
  }, [filteredData]);

  // Filter and highlight recent clicks
  const recentClicksList = useMemo(() => {
    let list = clicks;
    if (searchTerm) {
      list = clicks.filter(c => 
        c.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.elementId.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Sort descending by time
    return list.slice().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 15);
  }, [clicks, searchTerm]);

  // Calculate coordinates for SVG line chart dynamically
  const svgCoordinates = useMemo(() => {
    if (chartData.length === 0) return { viewPath: '', visitPath: '', points: [] };

    const width = 800;
    const height = 240;
    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 30;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    // Find max value for scaling
    const maxVal = Math.max(
      ...chartData.map(d => Math.max(d.views, d.visits)),
      10 // Default minimum ceiling
    );

    const stepX = chartWidth / (chartData.length - 1 || 1);

    const points = chartData.map((d, index) => {
      const x = paddingLeft + index * stepX;
      // SVG Y starts from top, so we invert
      const viewY = paddingTop + chartHeight - (d.views / maxVal) * chartHeight;
      const visitY = paddingTop + chartHeight - (d.visits / maxVal) * chartHeight;
      return { x, viewY, visitY, data: d, index };
    });

    // Create curved paths
    let viewPath = '';
    let visitPath = '';

    if (points.length > 0) {
      viewPath = `M ${points[0].x} ${points[0].viewY}`;
      visitPath = `M ${points[0].x} ${points[0].visitY}`;

      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        // Control points for bezier curves
        const cpX1 = prev.x + stepX / 3;
        const cpY1_view = prev.viewY;
        const cpX2 = curr.x - stepX / 3;
        const cpY2_view = curr.viewY;

        viewPath += ` C ${cpX1} ${cpY1_view}, ${cpX2} ${cpY2_view}, ${curr.x} ${curr.viewY}`;

        const cpY1_visit = prev.visitY;
        const cpY2_visit = curr.visitY;
        visitPath += ` C ${cpX1} ${cpY1_visit}, ${cpX2} ${cpY2_visit}, ${curr.x} ${curr.visitY}`;
      }
    }

    return { viewPath, visitPath, points, maxVal, chartHeight, paddingTop, paddingLeft, chartWidth };
  }, [chartData]);

  // Memoized filtered and sorted chat sessions for WhatsApp layout
  const filteredSessions = useMemo(() => {
    return chatSessions
      .filter(s => {
        const term = chatSearchTerm.toLowerCase();
        const matchesSearch = s.visitorName.toLowerCase().includes(term) || (s.customName || '').toLowerCase().includes(term);
        const matchesTab = currentSubTab === 'archived' ? s.archived === true : (!s.archived);
        const matchesStatus = chatStatusFilter === 'all' 
          ? true 
          : chatStatusFilter === 'online' 
            ? s.online === true 
            : chatStatusFilter === 'offline' 
              ? s.online !== true 
              : chatStatusFilter === 'unread'
                ? s.messages.filter(m => m.sender === 'visitor' && !m.read).length > 0
                : chatStatusFilter === 'with_messages'
                  ? s.messages.length > 0
                  : true;
        return matchesSearch && matchesTab && matchesStatus;
      })
      .slice()
      .sort((a, b) => {
        if (chatSortBy === 'online_time') {
          return new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime();
        }
        if (chatSortBy === 'alphabetical') {
          const nameA = (a.customName || a.visitorName).toLowerCase();
          const nameB = (b.customName || b.visitorName).toLowerCase();
          return nameA.localeCompare(nameB);
        }
        if (chatSortBy === 'unread') {
          const unreadA = a.messages.filter(m => m.sender === 'visitor' && !m.read).length;
          const unreadB = b.messages.filter(m => m.sender === 'visitor' && !m.read).length;
          return unreadB - unreadA;
        }
        return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
      });
  }, [chatSessions, chatSearchTerm, currentSubTab, chatStatusFilter, chatSortBy]);

  // Time format helper (Relative text)
  const formatTimeAgo = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Agora mesmo';
    if (diffMins < 60) return `Há ${diffMins} min`;
    if (diffHours < 24) return `Há ${diffHours} h`;
    return new Date(isoString).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render Login interface if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-900 flex flex-col justify-center items-center px-4 font-sans text-neutral-200">
        <div className="absolute top-6 left-6">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition-colors duration-200"
          >
            ← Voltar ao Início
          </button>
        </div>

        <div className="w-full max-w-md bg-neutral-800 border border-neutral-700/80 p-8 rounded shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-orange/10 text-brand-orange border border-brand-orange/20 mb-2">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">Acesso Restrito</h1>
            <p className="text-xs text-neutral-400 max-w-xs mx-auto">
              Digite a senha administrativa para consultar o painel de métricas do site Esquadrijampa.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                Senha Administrativa
              </label>
              <input
                type="password"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded p-3 text-white focus:outline-none focus:ring-1 focus:ring-brand-orange text-center tracking-[0.3em] font-mono text-lg transition-all"
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/40 border border-red-900/60 p-3 rounded">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white py-3 font-semibold rounded transition-colors text-sm uppercase tracking-wider shadow-lg shadow-brand-orange/10"
            >
              Autenticar Painel
            </button>
          </form>

          <div className="border-t border-neutral-700/50 pt-4 text-center">
            <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest">
              Esquadrijampa Analytics Engine v1.1
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Active highlighted day
  const highlightedDay = selectedDayIndex !== null ? chartData[selectedDayIndex] : null;

  return (
    <div className={`bg-neutral-950 text-neutral-100 font-sans selection:bg-brand-orange/30 ${activeTab === 'chat' && !showEmailConfig ? 'h-screen flex flex-col overflow-hidden' : 'min-h-screen pb-16'}`}>
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-neutral-900 border-b border-neutral-800 px-4 py-2 flex flex-col md:flex-row justify-between items-center gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-brand-orange/10 flex items-center justify-center text-brand-orange border border-brand-orange/20">
            {activeTab === 'metrics' ? <BarChart3 className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold text-white leading-none">
                {activeTab === 'metrics' ? 'Painel de Métricas' : 'Mesa de Atendimento'}
              </h1>
              <span className="bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 text-[8px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-full flex items-center gap-1">
                <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></span>
                Ativo
              </span>
            </div>
            <p className="text-[10px] text-neutral-500 hidden sm:block mt-0.5">
              {activeTab === 'metrics' 
                ? 'Dados de tráfego e comportamento' 
                : 'Monitoramento em tempo real'}
            </p>
          </div>
        </div>

        {/* Tab Controls (Centralized) */}
        <div className="bg-neutral-950 p-0.5 rounded border border-neutral-800/80 flex items-center text-[11px] overflow-x-auto max-w-full whitespace-nowrap scrollbar-none flex-shrink-0">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-3 py-1 rounded transition-all font-semibold flex items-center gap-1.5 cursor-pointer flex-shrink-0 ${
              activeTab === 'metrics' 
                ? 'bg-neutral-800 text-brand-orange shadow-sm' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3 h-3" />
            Métricas de Tráfego
          </button>
          <button
            onClick={() => {
              setActiveTab('chat');
              setShowDossierOnMobile(false);
              // Auto-select first session if nothing selected yet
              if (!selectedSessionId && chatSessions.length > 0) {
                const first = chatSessions[0];
                setSelectedSessionId(first.sessionId);
                chatManager.markAsRead(first.sessionId, 'admin');
              }
            }}
            className={`px-3 py-1 rounded transition-all font-semibold flex items-center gap-1.5 cursor-pointer relative flex-shrink-0 ${
              activeTab === 'chat' 
                ? 'bg-neutral-800 text-brand-orange shadow-sm' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3 h-3" />
            Chat & Visitantes
            
            {unreadCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-brand-orange text-white text-[8px] font-extrabold flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 w-full md:w-auto">
          {activeTab === 'metrics' && (
            <>
              {/* Fonte de Dados Toggle */}
              <div className="bg-neutral-950 p-0.5 rounded border border-neutral-800/80 flex items-center text-[10px] gap-0.5">
                <button
                  onClick={() => setMetricsSource('real')}
                  className={`px-2 py-1 rounded transition-all font-bold flex items-center gap-1 cursor-pointer border ${
                    metricsSource === 'real' 
                      ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20' 
                      : 'text-neutral-400 hover:text-white border-transparent'
                  }`}
                  title="Métricas em tempo real de visitantes do site"
                >
                  <span className={`w-1 h-1 rounded-full ${metricsSource === 'real' ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-500'}`}></span>
                  Dados Reais
                </button>
                <button
                  onClick={() => setMetricsSource('simulated')}
                  className={`px-2 py-1 rounded transition-all font-bold flex items-center gap-1 cursor-pointer border ${
                    metricsSource === 'simulated' 
                      ? 'bg-amber-950/40 text-amber-400 border-amber-500/20' 
                      : 'text-neutral-400 hover:text-white border-transparent'
                  }`}
                  title="Dados simulados de demonstração"
                >
                  <span className="w-1 h-1 rounded-full bg-amber-400"></span>
                  Demonstração
                </button>
              </div>

              <div className="bg-neutral-950 p-0.5 rounded border border-neutral-800/80 flex items-center text-[10px]">
                <button
                  onClick={() => setTimeRange('7')}
                  className={`px-2 py-1 rounded transition-colors font-semibold ${timeRange === '7' ? 'bg-neutral-800 text-brand-orange' : 'text-neutral-400 hover:text-white'}`}
                >
                  7d
                </button>
                <button
                  onClick={() => setTimeRange('14')}
                  className={`px-2 py-1 rounded transition-colors font-semibold ${timeRange === '14' ? 'bg-neutral-800 text-brand-orange' : 'text-neutral-400 hover:text-white'}`}
                >
                  14d
                </button>
                <button
                  onClick={() => setTimeRange('30')}
                  className={`px-2 py-1 rounded transition-colors font-semibold ${timeRange === '30' ? 'bg-neutral-800 text-brand-orange' : 'text-neutral-400 hover:text-white'}`}
                >
                  30d
                </button>
                <button
                  onClick={() => setTimeRange('custom')}
                  className={`px-2 py-1 rounded transition-colors font-semibold ${timeRange === 'custom' ? 'bg-neutral-800 text-brand-orange' : 'text-neutral-400 hover:text-white'}`}
                >
                  Personalizado
                </button>
              </div>
            </>
          )}

          {activeTab === 'chat' && (
            <>
              <button
                onClick={() => {
                  setShowEmailConfig(!showEmailConfig);
                }}
                className={`flex items-center gap-1 text-[11px] font-bold border px-2.5 py-1 rounded transition-all cursor-pointer ${
                  showEmailConfig
                    ? 'bg-brand-orange border-brand-orange text-white hover:bg-brand-orange/90'
                    : 'bg-neutral-950 border-neutral-800 hover:bg-neutral-800 text-neutral-300'
                }`}
              >
                <Mail className={`w-3 h-3 ${showEmailConfig ? 'text-white' : 'text-brand-orange'}`} />
                Alertas
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Deseja iniciar um visitante simulado para testar o atendimento?')) {
                    chatManager.triggerSimulatedVisitor();
                    setChatSessions(chatManager.getSessions());
                  }
                }}
                className="flex items-center gap-1 text-[11px] font-semibold bg-neutral-950 border border-neutral-800 hover:bg-neutral-800 px-2.5 py-1 rounded text-neutral-300 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-brand-orange" />
                Simular
              </button>
            </>
          )}

          <button
            onClick={handleResetData}
            title="Redefinir histórico simulado"
            className="p-1 rounded bg-neutral-950 border border-neutral-800 text-neutral-500 hover:text-white transition-colors hover:bg-neutral-800 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-[11px] font-semibold bg-neutral-800 hover:bg-red-950/30 hover:border-red-900/45 hover:text-red-400 px-2.5 py-1 rounded border border-neutral-700 transition-all text-neutral-400 cursor-pointer"
          >
            <LogOut className="w-3 h-3" />
            Sair
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className={`max-w-7xl mx-auto w-full animate-fade-in ${
        activeTab === 'chat' && !showEmailConfig
          ? 'flex-1 flex flex-col min-h-0 px-4 md:px-6 pt-4 pb-4 overflow-hidden space-y-0' 
          : 'px-6 pt-8 space-y-8'
      }`}>
        {activeTab === 'metrics' ? (
          <>
            {/* Custom Date Picker inputs shown ONLY when 'custom' is selected */}
            {timeRange === 'custom' && (
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between animate-fade-in">
                <div className="flex items-center gap-2 text-sm text-neutral-300">
                  <Calendar className="w-4 h-4 text-brand-orange" />
                  <span className="font-semibold">Período Personalizado:</span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-neutral-400 font-mono">De:</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-orange cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-neutral-400 font-mono">Até:</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-orange cursor-pointer"
                    />
                  </div>
                  {(startDate || endDate) && (
                    <button
                      onClick={() => {
                        setStartDate('');
                        setEndDate('');
                      }}
                      className="text-xs bg-neutral-800 hover:bg-neutral-750 text-neutral-300 px-3 py-1.5 rounded transition-all cursor-pointer border border-neutral-700/50"
                    >
                      Limpar
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* KPI Dashboard Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-neutral-900 border border-neutral-800/80 p-5 rounded relative overflow-hidden group hover:border-neutral-700 transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">Visitas Únicas</span>
              <div className="p-1.5 rounded bg-blue-500/5 text-blue-400 border border-blue-500/10">
                <Globe className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <h2 className="text-3xl font-bold tracking-tight text-white">{stats.visitors}</h2>
              <p className="text-[11px] text-neutral-500 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                Aumento gradual em canais orgânicos
              </p>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800/80 p-5 rounded relative overflow-hidden group hover:border-neutral-700 transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">Visualizações de Páginas</span>
              <div className="p-1.5 rounded bg-purple-500/5 text-purple-400 border border-purple-500/10">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <h2 className="text-3xl font-bold tracking-tight text-white">{stats.pageviews}</h2>
              <p className="text-[11px] text-neutral-400 font-mono">
                Média de <span className="text-brand-orange font-bold">{stats.avgPageviews}</span> páginas/visita
              </p>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800/80 p-5 rounded relative overflow-hidden group hover:border-neutral-700 transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">Conversões Totais</span>
              <div className="p-1.5 rounded bg-brand-orange/5 text-brand-orange border border-brand-orange/10">
                <MousePointerClick className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <h2 className="text-3xl font-bold tracking-tight text-white">{stats.conversions}</h2>
              <p className="text-[11px] text-neutral-400 font-mono">
                Cliques WhatsApp: <span className="text-emerald-400 font-bold">{stats.whatsappClicks}</span>
              </p>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800/80 p-5 rounded relative overflow-hidden group hover:border-neutral-700 transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">Taxa de Conversão</span>
              <div className="p-1.5 rounded bg-emerald-500/5 text-emerald-400 border border-emerald-500/10">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <h2 className="text-3xl font-bold tracking-tight text-white">{stats.conversionRate}%</h2>
              <p className="text-[11px] text-neutral-500">
                Proporção de visitantes que iniciam contato
              </p>
            </div>
          </div>

        </section>

        {/* Visual Analytics Chart Block */}
        <section className="bg-neutral-900 border border-neutral-800/80 p-6 rounded space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-800 pb-4">
            <div>
              <h3 className="text-base font-semibold text-white">Fluxo de Tráfego Diário</h3>
              <p className="text-xs text-neutral-400">Comparativo diário de visualizações de páginas versus acessos únicos</p>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 bg-brand-orange rounded-full inline-block"></span>
                <span className="text-neutral-400">Visualizações ({stats.pageviews})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 bg-blue-500 rounded-full inline-block"></span>
                <span className="text-neutral-400">Acessos Únicos ({stats.visitors})</span>
              </div>
            </div>
          </div>

          {/* SVG Line Chart (Highly responsive, with horizontal scroll fallback on mobile) */}
          <div className="relative">
            <div className="w-full overflow-x-auto scrollbar-none">
              <div className="min-w-[750px] lg:min-w-0 w-full">
                <svg 
                  viewBox="0 0 800 240" 
                  className="w-full h-auto overflow-visible select-none"
                  style={{ contentVisibility: 'auto' }}
                >
                {/* Definitions for Gradients */}
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="visitsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => {
                  const y = svgCoordinates.paddingTop + svgCoordinates.chartHeight * p;
                  const val = Math.round(svgCoordinates.maxVal * (1 - p));
                  return (
                    <g key={idx} className="opacity-40">
                      <line 
                        x1={svgCoordinates.paddingLeft} 
                        y1={y} 
                        x2={svgCoordinates.paddingLeft + svgCoordinates.chartWidth} 
                        y2={y} 
                        stroke="#262626" 
                        strokeWidth="1" 
                        strokeDasharray="4"
                      />
                      <text 
                        x={svgCoordinates.paddingLeft - 8} 
                        y={y + 4} 
                        fill="#737373" 
                        fontSize="9" 
                        textAnchor="end"
                        className="font-mono"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* SVG Area Fills */}
                <path
                  d={`${svgCoordinates.viewPath} L ${svgCoordinates.points[svgCoordinates.points.length - 1]?.x} ${svgCoordinates.paddingTop + svgCoordinates.chartHeight} L ${svgCoordinates.points[0]?.x} ${svgCoordinates.paddingTop + svgCoordinates.chartHeight} Z`}
                  fill="url(#viewsGrad)"
                />
                <path
                  d={`${svgCoordinates.visitPath} L ${svgCoordinates.points[svgCoordinates.points.length - 1]?.x} ${svgCoordinates.paddingTop + svgCoordinates.chartHeight} L ${svgCoordinates.points[0]?.x} ${svgCoordinates.paddingTop + svgCoordinates.chartHeight} Z`}
                  fill="url(#visitsGrad)"
                />

                {/* Line Paths */}
                <path
                  d={svgCoordinates.viewPath}
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={svgCoordinates.visitPath}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Hover Interaction Areas */}
                {svgCoordinates.points.map((pt, idx) => {
                  return (
                    <g key={idx}>
                      {/* Vertical line indicator on hover */}
                      {selectedDayIndex === idx && (
                        <line
                          x1={pt.x}
                          y1={svgCoordinates.paddingTop}
                          x2={pt.x}
                          y2={svgCoordinates.paddingTop + svgCoordinates.chartHeight}
                          stroke="#525252"
                          strokeWidth="1"
                          strokeDasharray="2"
                        />
                      )}

                      {/* Hotspot anchor */}
                      <rect
                        x={pt.x - 10}
                        y={svgCoordinates.paddingTop}
                        width="20"
                        height={svgCoordinates.chartHeight}
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseEnter={() => setSelectedDayIndex(idx)}
                        onMouseLeave={() => setSelectedDayIndex(null)}
                      />

                      {/* Highlight circles */}
                      {selectedDayIndex === idx && (
                        <>
                          <circle cx={pt.x} cy={pt.viewY} r="5" fill="#f97316" stroke="#ffffff" strokeWidth="1.5" />
                          <circle cx={pt.x} cy={pt.visitY} r="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
                        </>
                      )}
                    </g>
                  );
                })}

                {/* Bottom X-Axis labels */}
                {chartData.map((d, idx) => {
                  // Show labels conditionally to avoid congestion
                  const showLabel = chartData.length > 15 ? idx % 2 === 0 : true;
                  if (!showLabel) return null;

                  const pt = svgCoordinates.points[idx];
                  if (!pt) return null;

                  return (
                    <text
                      key={idx}
                      x={pt.x}
                      y={svgCoordinates.paddingTop + svgCoordinates.chartHeight + 18}
                      fill="#737373"
                      fontSize="9"
                      textAnchor="middle"
                      className="font-mono font-medium uppercase"
                    >
                      {d.label}
                    </text>
                  );
                })}
              </svg>
              </div>
            </div>

            {/* Floating Info Tooltip */}
            {highlightedDay && (
              <div 
                className="absolute top-4 left-1/2 -translate-x-1/2 bg-neutral-900 border border-neutral-700 p-3 rounded shadow-xl flex items-center gap-6 text-xs text-neutral-300 font-mono transition-all z-10 animate-fade-in"
              >
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="font-semibold text-white uppercase">{new Date(highlightedDay.dateStr).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                </div>
                <div className="h-4 w-[1px] bg-neutral-800"></div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-orange"></span>
                  <span>Visualizações: <strong className="text-white">{highlightedDay.views}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span>Únicos: <strong className="text-white">{highlightedDay.visits}</strong></span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Breakdowns section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Traffic Channels */}
          <div className="bg-neutral-900 border border-neutral-800/80 p-6 rounded lg:col-span-4 flex flex-col space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2 uppercase tracking-wider font-mono">
                <Globe className="w-4 h-4 text-brand-orange" />
                Origens de Tráfego
              </h3>
              <p className="text-xs text-neutral-400">Principais canais que trouxeram visitas ao site</p>
            </div>

            <div className="flex-1 space-y-4">
              {trafficSources.length === 0 ? (
                <div className="text-center text-xs text-neutral-500 py-12">Nenhum dado registrado neste intervalo.</div>
              ) : (
                trafficSources.map((source, idx) => {
                  const maxCount = Math.max(...trafficSources.map(s => s.count), 1);
                  const percentage = ((source.count / stats.pageviews) * 100).toFixed(0);
                  const widthPercent = (source.count / maxCount) * 100;

                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-neutral-300 font-medium truncate max-w-[200px]" title={source.name}>
                          {source.name}
                        </span>
                        <span className="text-neutral-400 font-mono">
                          {source.count} <span className="text-[10px] text-neutral-500">({percentage}%)</span>
                        </span>
                      </div>
                      <div className="h-2 w-full bg-neutral-950 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand-orange/80 rounded-full transition-all duration-500"
                          style={{ width: `${widthPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Devices Distribution */}
          <div className="bg-neutral-900 border border-neutral-800/80 p-6 rounded lg:col-span-4 flex flex-col space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2 uppercase tracking-wider font-mono">
                <Smartphone className="w-4 h-4 text-brand-orange" />
                Tipo de Dispositivo
              </h3>
              <p className="text-xs text-neutral-400">Distribuição entre celulares, desktops e tablets</p>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-5">
              {deviceStats.map((dev, idx) => {
                const colorMap = [
                  'bg-brand-orange',
                  'bg-blue-500',
                  'bg-purple-500'
                ];

                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-300 font-medium">{dev.name}</span>
                      <span className="text-neutral-400 font-mono">
                        {dev.count} <span className="text-[10px] text-neutral-500">({dev.percentage}%)</span>
                      </span>
                    </div>
                    <div className="h-2 w-full bg-neutral-950 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${colorMap[idx] || 'bg-brand-orange'} rounded-full transition-all duration-500`}
                        style={{ width: `${dev.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}

              <div className="border-t border-neutral-800/60 pt-4 grid grid-cols-3 gap-2 text-center text-[11px] text-neutral-500 font-mono">
                <div>
                  <span className="block text-white text-sm font-bold">{deviceStats[0].percentage}%</span>
                  Mobile
                </div>
                <div>
                  <span className="block text-white text-sm font-bold">{deviceStats[1].percentage}%</span>
                  Desktop
                </div>
                <div>
                  <span className="block text-white text-sm font-bold">{deviceStats[2].percentage}%</span>
                  Tablet
                </div>
              </div>
            </div>
          </div>

          {/* Most Visited Sections */}
          <div className="bg-neutral-900 border border-neutral-800/80 p-6 rounded lg:col-span-4 flex flex-col space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2 uppercase tracking-wider font-mono">
                <Layers className="w-4 h-4 text-brand-orange" />
                Seções mais Visitadas
              </h3>
              <p className="text-xs text-neutral-400">Desempenho de visualizações por rota/âncora</p>
            </div>

            <div className="flex-1 space-y-4">
              {pageStats.slice(0, 5).map((page, idx) => {
                const maxCount = Math.max(...pageStats.map(p => p.count), 1);
                const widthPercent = (page.count / maxCount) * 100;

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-300 font-mono font-medium max-w-[200px] truncate">
                        {page.path}
                      </span>
                      <span className="text-neutral-400 font-mono">{page.count}</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-950 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500/80 rounded-full transition-all duration-500"
                        style={{ width: `${widthPercent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </section>

        {/* Real-time Click logs / Behavior Mapping */}
        <section className="bg-neutral-900 border border-neutral-800/80 p-6 rounded space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-800 pb-4">
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <MousePointerClick className="w-4 h-4 text-brand-orange" />
                Mapeamento de Cliques de Visitantes (Tempo Real)
              </h3>
              <p className="text-xs text-neutral-400">Lista cronológica dos cliques realizados em botões de WhatsApp, formulários e links de contato</p>
            </div>

            {/* Filter Search */}
            <div className="relative w-full sm:w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-500">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                placeholder="Pesquisar clique..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded pl-9 pr-4 py-1.5 text-xs text-neutral-300 focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange"
              />
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full min-w-[800px] text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 font-mono uppercase tracking-wider text-[10px]">
                  <th className="pb-3 pl-4 font-semibold">Elemento/Texto</th>
                  <th className="pb-3 font-semibold">Identificador (ID)</th>
                  <th className="pb-3 font-semibold">Categoria</th>
                  <th className="pb-3 font-semibold">Página de Origem</th>
                  <th className="pb-3 font-semibold text-right pr-4">Horário / Ocorrido</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/40">
                {recentClicksList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-neutral-500">
                      Nenhum clique de botão localizado. Clique em algum botão do site para ver aparecer aqui instantaneamente!
                    </td>
                  </tr>
                ) : (
                  recentClicksList.map((click, idx) => {
                    // Check if clicked in last 2 minutes
                    const isNew = Date.now() - new Date(click.timestamp).getTime() < 120000;

                    return (
                      <tr 
                        key={idx} 
                        className={`hover:bg-neutral-800/25 transition-colors ${isNew ? 'bg-brand-orange/5 font-medium' : ''}`}
                      >
                        <td className="py-3.5 pl-4 font-sans text-neutral-200">
                          <div className="flex items-center gap-2">
                            {isNew && (
                              <span className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-ping shrink-0" title="Evento capturado ao vivo!"></span>
                            )}
                            <span className="max-w-[180px] truncate block font-semibold text-white" title={click.text}>
                              {click.text}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 font-mono text-neutral-400 text-[11px] max-w-[150px] truncate" title={click.elementId}>
                          {click.elementId || <span className="text-neutral-600">-</span>}
                        </td>
                        <td className="py-3.5">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wide ${
                            click.category === 'floating_buttons' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' :
                            click.category === 'cta' ? 'bg-brand-orange/10 text-brand-orange border border-brand-orange/15' :
                            'bg-neutral-800 text-neutral-400 border border-neutral-700/55'
                          }`}>
                            {click.category}
                          </span>
                        </td>
                        <td className="py-3.5 font-mono text-neutral-400 text-[11px]">
                          {click.path}
                        </td>
                        <td className="py-3.5 text-right pr-4 font-mono text-[11px] text-neutral-400 flex items-center justify-end gap-1.5">
                          <Clock className="w-3 h-3 text-neutral-500" />
                          <span>{formatTimeAgo(click.timestamp)}</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          <div className="bg-neutral-950/40 border border-neutral-800/80 p-4 rounded flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <span className="text-neutral-400 font-sans leading-relaxed">
              💡 <strong>Dica de Teste:</strong> Abra uma nova guia do site, clique em qualquer botão do WhatsApp ou preencha o formulário, e retorne a este painel. O novo clique aparecerá realçado acima em tempo real!
            </span>
            <button
              onClick={() => {
                analyticsTracker.trackClick(
                  'Clique de Teste Administrativo',
                  'test-admin-btn',
                  'btn-test',
                  'cta',
                  '/admin'
                );
                loadData();
              }}
              className="px-3.5 py-2 shrink-0 bg-neutral-800 hover:bg-neutral-700 hover:text-white text-neutral-300 font-semibold rounded text-[11px] uppercase tracking-wider font-mono border border-neutral-700"
            >
              Simular Clique Local
            </button>
          </div>
        </section>
        </>
        ) : showEmailConfig ? (
          <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4 space-y-4 font-sans max-w-4xl mx-auto animate-fade-in">
            {/* Header section with setup status */}
            <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-brand-orange" />
                  Alertas por E-mail
                </h2>
                <p className="text-[11px] text-neutral-400">
                  Receba avisos instantâneos sempre que novos visitantes interagirem com o site.
                </p>
              </div>
              
              <button
                onClick={() => setShowEmailConfig(false)}
                className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 hover:text-white rounded text-xs font-semibold border border-neutral-700 transition-colors cursor-pointer"
              >
                Voltar
              </button>
            </div>

            {/* Status Alert Banner & Test Box (Compact Row) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Left Column: Status / Credentials check */}
              <div className="space-y-3 bg-neutral-950 p-3.5 rounded border border-neutral-850">
                <div className="flex items-center gap-2">
                  {import.meta.env.VITE_EMAILJS_SERVICE_ID && import.meta.env.VITE_EMAILJS_TEMPLATE_ID && import.meta.env.VITE_EMAILJS_PUBLIC_KEY ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                      <span className="text-xs font-bold text-emerald-400">Serviço Ativo (EmailJS)</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" />
                      <span className="text-xs font-bold text-amber-400">Modo de Simulação</span>
                    </>
                  )}
                </div>

                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  {import.meta.env.VITE_EMAILJS_SERVICE_ID && import.meta.env.VITE_EMAILJS_TEMPLATE_ID && import.meta.env.VITE_EMAILJS_PUBLIC_KEY ? (
                    <span>Notificações reais configuradas para enviar ao destinatário definido nas variáveis de ambiente.</span>
                  ) : (
                    <span>Pendente de variáveis <code>.env</code>. Para receber e-mails reais, cadastre-se no <a href="https://www.emailjs.com" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline font-semibold">EmailJS</a> e configure as chaves.</span>
                  )}
                </p>

                <div className="pt-1.5 border-t border-neutral-850 space-y-1 text-[10px] text-neutral-500">
                  <div className="flex justify-between">
                    <span>Destinatário:</span>
                    <span className="font-mono text-brand-orange font-semibold">{import.meta.env.VITE_EMAILJS_NOTIFICATION_RECIPIENT_EMAIL || 'mktesquadrijampa@gmail.com'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ID do Serviço:</span>
                    <span className="font-mono">{import.meta.env.VITE_EMAILJS_SERVICE_ID ? 'Configurado ✓' : 'Pendente (Simulado) ✗'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ID do Modelo:</span>
                    <span className="font-mono">{import.meta.env.VITE_EMAILJS_TEMPLATE_ID ? 'Configurado ✓' : 'Pendente (Simulado) ✗'}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Console de Teste */}
              <div className="space-y-3 bg-neutral-950 p-3.5 rounded border border-neutral-850 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    🚀 Testar Alertas
                  </h3>
                  <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                    Dispare uma notificação simulada para verificar se o e-mail está chegando e testar a dinâmica de logs.
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    disabled={isSendingTestEmail}
                    onClick={handleSendTestEmail}
                    className="w-full py-1.5 bg-brand-orange hover:bg-brand-orange/90 text-white font-bold rounded text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSendingTestEmail ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Disparando...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Disparar Alerta de Teste
                      </>
                    )}
                  </button>

                  {testEmailResult && (
                    <div className={`p-2 rounded text-[10px] border ${
                      testEmailResult.success 
                        ? 'bg-emerald-500/10 border-emerald-500/15 text-emerald-400' 
                        : 'bg-amber-500/10 border-amber-500/15 text-amber-400'
                    } animate-fade-in`}>
                      {testEmailResult.message}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Audit Logs History Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  📋 Histórico de Disparos Recentes ({emailLogs.length})
                </h3>
                {emailLogs.length > 0 && (
                  <button
                    onClick={() => {
                      if (window.confirm('Deseja limpar os registros locais do histórico de e-mails?')) {
                        localStorage.removeItem('esquadrijampa_email_notification_logs');
                        setEmailLogs([]);
                      }
                    }}
                    className="text-[10px] text-neutral-500 hover:text-red-400 transition-colors uppercase tracking-wider font-mono font-bold"
                  >
                    Limpar Logs
                  </button>
                )}
              </div>

              <div className="bg-neutral-950 border border-neutral-850 rounded-lg overflow-x-auto scrollbar-none">
                <table className="w-full min-w-[750px] text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-400 font-mono uppercase tracking-wider text-[10px] bg-neutral-900/40">
                      <th className="p-3 pl-4 font-semibold">Horário / Data</th>
                      <th className="p-3 font-semibold">Visitante Notificado</th>
                      <th className="p-3 font-semibold">Origem (Referrer)</th>
                      <th className="p-3 font-semibold">Dispositivo</th>
                      <th className="p-3 text-right pr-4 font-semibold">Status de Envio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/40 font-mono text-[11px]">
                    {emailLogs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-10 text-neutral-500 font-sans">
                          Nenhum e-mail disparado ainda. Simule ou acesse o site de outra guia para ver as notificações aparecerem aqui!
                        </td>
                      </tr>
                    ) : (
                      emailLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-neutral-900/20 transition-colors">
                          <td className="p-3 pl-4 text-neutral-400">
                            {new Date(log.timestamp).toLocaleString('pt-BR')}
                          </td>
                          <td className="p-3 text-neutral-200 font-sans font-semibold">
                            {log.visitorName}
                          </td>
                          <td className="p-3 text-neutral-400">
                            {log.referrer}
                          </td>
                          <td className="p-3 text-neutral-400">
                            {log.device}
                          </td>
                          <td className="p-3 text-right pr-4">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium ${
                              log.status === 'sent' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              log.status === 'pending_credentials' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                              'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`} title={log.error}>
                              {log.status === 'sent' ? '✓ Enviado (Real)' : 
                               log.status === 'pending_credentials' ? '● Simulado (Local)' : 
                               '✗ Falhou'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Live Support Chat Workspace */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 flex-1 min-h-0 bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden font-sans h-[calc(100vh-210px)] md:h-[calc(100vh-160px)] lg:h-[calc(100vh-135px)]">
            
            {/* Left Column: Sessions List */}
            <div className={`lg:col-span-3 border-r border-neutral-800 flex flex-col h-full min-h-0 bg-[#0b141a] ${selectedSessionId ? 'hidden lg:flex' : 'flex'}`}>
              
              {/* WhatsApp-Style Left Column Header */}
              <div className="px-3 py-2 border-b border-neutral-800 space-y-2 bg-[#0b141a]">
                <div className="flex justify-between items-center">
                  <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                    Conversas
                    <span className="text-[9px] bg-brand-orange/20 text-brand-orange font-mono px-1 py-0.2 rounded-full font-bold uppercase tracking-wider">
                      {chatSessions.filter(s => s.online).length} On
                    </span>
                  </h2>

                  <div className="flex items-center gap-2.5 text-neutral-300">
                    {/* Camera simulation button */}
                    <button 
                      onClick={() => {
                        chatManager.triggerSimulatedVisitor();
                        setChatSessions(chatManager.getSessions());
                      }}
                      title="Disparar visita simulada rápida"
                      className="hover:text-white p-1 hover:bg-neutral-800/40 rounded transition-all cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-neutral-300" />
                    </button>

                    {/* Plus button inside circular emerald bubble */}
                    <button 
                      onClick={() => {
                        if (window.confirm('Deseja iniciar um visitante simulado para testar o atendimento?')) {
                          chatManager.triggerSimulatedVisitor();
                          setChatSessions(chatManager.getSessions());
                        }
                      }}
                      title="Simular Novo Cliente"
                      className="w-6 h-6 rounded-full bg-[#00a884] text-neutral-950 flex items-center justify-center hover:bg-[#008f72] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow"
                    >
                      <Plus className="w-3.5 h-3.5 text-neutral-950 stroke-[3px]" />
                    </button>

                    {/* Options menu */}
                    <div className="relative group">
                      <button className="hover:text-white p-1 hover:bg-neutral-800/40 rounded transition-all cursor-pointer">
                        <MoreVertical className="w-4 h-4 text-neutral-300" />
                      </button>
                      <div className="absolute right-0 top-6 w-48 bg-[#1f2c34] border border-neutral-800 rounded shadow-xl py-1 hidden group-hover:block z-50 text-xs">
                        <button
                          onClick={handleResetData}
                          className="w-full text-left px-3 py-1.5 text-neutral-200 hover:bg-[#2a3942] flex items-center gap-2 cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3 text-brand-orange" />
                          Redefinir Histórico
                        </button>
                        <button
                          onClick={() => {
                            setShowEmailConfig(true);
                            setShowYouProfile(false);
                          }}
                          className="w-full text-left px-3 py-1.5 text-neutral-200 hover:bg-[#2a3942] flex items-center gap-2 cursor-pointer"
                        >
                          <Mail className="w-3 h-3 text-brand-orange" />
                          Alertas por E-mail
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('metrics');
                            setShowYouProfile(false);
                          }}
                          className="w-full text-left px-3 py-1.5 text-neutral-200 hover:bg-[#2a3942] flex items-center gap-2 cursor-pointer"
                        >
                          <BarChart3 className="w-3 h-3 text-brand-orange" />
                          Ver Painel de Métricas
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Search box ("Pergunte à Meta AI ou pesquise") */}
                <div className="relative">
                  <Search className="absolute left-3 top-1.5 w-3.5 h-3.5 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Pergunte à Meta AI ou pesquise"
                    value={chatSearchTerm}
                    onChange={(e) => setChatSearchTerm(e.target.value)}
                    className="w-full bg-[#202c33] border border-transparent rounded-full pl-8 pr-3 py-1 text-[11px] text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#00a884] focus:bg-[#202c33] transition-all"
                  />
                </div>

                {/* Horizontal scrolling filters exactly like WhatsApp */}
                <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-0.5 -mx-1 px-1 whitespace-nowrap">
                  <button
                    onClick={() => {
                      setChatStatusFilter('all');
                      setCurrentSubTab('active');
                    }}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] transition-all font-semibold cursor-pointer flex-shrink-0 ${
                      chatStatusFilter === 'all' && currentSubTab === 'active'
                        ? 'bg-[#00a884]/20 text-[#00a884] border border-[#00a884]/30'
                        : 'bg-[#202c33] text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => {
                      setChatStatusFilter('unread' as any);
                      setCurrentSubTab('active');
                    }}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] transition-all font-semibold cursor-pointer flex-shrink-0 flex items-center gap-1 ${
                      chatStatusFilter === ('unread' as any)
                        ? 'bg-[#00a884]/20 text-[#00a884] border border-[#00a884]/30'
                        : 'bg-[#202c33] text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    Não lidas
                    {chatSessions.filter(s => s.messages.filter(m => m.sender === 'visitor' && !m.read).length > 0).length > 0 && (
                      <span className="bg-[#00a884] text-neutral-950 font-extrabold px-1 rounded text-[8px]">
                        {chatSessions.filter(s => s.messages.filter(m => m.sender === 'visitor' && !m.read).length > 0).length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setChatStatusFilter('online');
                      setCurrentSubTab('active');
                    }}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] transition-all font-semibold cursor-pointer flex-shrink-0 ${
                      chatStatusFilter === 'online'
                        ? 'bg-[#00a884]/20 text-[#00a884] border border-[#00a884]/30'
                        : 'bg-[#202c33] text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    Online ({chatSessions.filter(s => s.online).length})
                  </button>
                  <button
                    onClick={() => {
                      setChatStatusFilter('with_messages');
                      setCurrentSubTab('active');
                    }}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] transition-all font-semibold cursor-pointer flex-shrink-0 ${
                      chatStatusFilter === 'with_messages'
                        ? 'bg-[#00a884]/20 text-[#00a884] border border-[#00a884]/30'
                        : 'bg-[#202c33] text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    Conversas
                  </button>
                  <button
                    onClick={() => {
                      setCurrentSubTab('archived');
                      setChatStatusFilter('all');
                    }}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] transition-all font-semibold cursor-pointer flex-shrink-0 ${
                      currentSubTab === 'archived'
                        ? 'bg-[#00a884]/20 text-[#00a884] border border-[#00a884]/30'
                        : 'bg-[#202c33] text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    Arquivados ({chatSessions.filter(s => s.archived).length})
                  </button>
                </div>

                {/* Sub-header sort & filter control info */}
                <div className="flex items-center justify-between gap-2 pt-1 text-[9px] text-neutral-500 border-t border-neutral-800/30">
                  <span className="font-mono uppercase tracking-wider">Ordenação ativa:</span>
                  <select
                    value={chatSortBy}
                    onChange={(e) => setChatSortBy(e.target.value as any)}
                    className="bg-transparent border-none text-neutral-400 font-semibold cursor-pointer focus:outline-none"
                  >
                    <option value="recent">Atividade recente</option>
                    <option value="online_time">Tempo no site</option>
                    <option value="alphabetical">Nome (A-Z)</option>
                    <option value="unread">Não lidas primeiro</option>
                  </select>
                </div>
              </div>

              {/* Scrollable Conversations List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0b141a]">
                
                {/* Archived conversations row exactly like WhatsApp */}
                {currentSubTab === 'active' && chatSessions.filter(s => s.archived).length > 0 && (
                  <button
                    onClick={() => setCurrentSubTab('archived')}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#202c33]/30 border-b border-neutral-800/30 text-neutral-300 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5">
                      <Archive className="w-5 h-5 text-[#00a884] group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-semibold text-white">Arquivadas</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#00a884]">
                      {chatSessions.filter(s => s.archived).length}
                    </span>
                  </button>
                )}

                {/* Back button when inside archived view */}
                {currentSubTab === 'archived' && (
                  <button
                    onClick={() => setCurrentSubTab('active')}
                    className="w-full px-4 py-3 bg-[#00a884]/5 hover:bg-[#00a884]/10 text-xs text-[#00a884] font-bold flex items-center gap-2 border-b border-neutral-800/50 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 stroke-[2.5px]" />
                    Voltar para Conversas Ativas
                  </button>
                )}

                {filteredSessions.length === 0 ? (
                  <div className="p-8 text-center text-xs text-neutral-500 space-y-2">
                    <User className="w-8 h-8 text-neutral-600 mx-auto" />
                    <p>Nenhuma conversa localizada.</p>
                    {currentSubTab === 'active' && (
                      <p className="text-[10px] text-neutral-600">Simule um cliente de teste para começar!</p>
                    )}
                  </div>
                ) : (
                  filteredSessions.map((s) => {
                    const isActive = s.sessionId === selectedSessionId;
                    const unreadMessages = s.messages.filter(m => m.sender === 'visitor' && !m.read);
                    const isOnline = s.online;
                    const lastMsg = s.messages.length > 0 ? s.messages[s.messages.length - 1] : null;

                    // Stable unique color background for initials avatar
                    const getAvatarBg = (id: string) => {
                      const colors = [
                        'bg-blue-600/20 text-blue-300 border-blue-500/15',
                        'bg-purple-600/20 text-purple-300 border-purple-500/15',
                        'bg-pink-600/20 text-pink-300 border-pink-500/15',
                        'bg-amber-600/20 text-amber-300 border-amber-500/15',
                        'bg-indigo-600/20 text-indigo-300 border-indigo-500/15',
                        'bg-rose-600/20 text-rose-300 border-rose-500/15',
                        'bg-cyan-600/20 text-cyan-300 border-cyan-500/15',
                      ];
                      let hash = 0;
                      for (let i = 0; i < id.length; i++) {
                        hash = id.charCodeAt(i) + ((hash << 5) - hash);
                      }
                      return colors[Math.abs(hash) % colors.length];
                    };

                    const avatarBg = getAvatarBg(s.sessionId);

                    return (
                      <button
                        key={s.sessionId}
                        onClick={() => {
                          setSelectedSessionId(s.sessionId);
                          chatManager.markAsRead(s.sessionId, 'admin');
                          setShowDossierOnMobile(false);
                          setShowYouProfile(false);
                        }}
                        className={`w-full text-left p-3.5 transition-all flex items-start gap-3 border-b border-neutral-900 cursor-pointer ${
                          isActive 
                            ? 'bg-[#2a3942]/60 text-white' 
                            : unreadMessages.length > 0
                              ? 'bg-[#00a884]/5 hover:bg-[#00a884]/10 text-white animate-pulse-subtle'
                              : 'text-neutral-300 hover:bg-[#202c33]/30'
                        }`}
                      >
                        {/* Left Side: Avatar Circle */}
                        <div className="relative shrink-0 mt-0.5">
                          <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold border ${avatarBg}`}>
                            {s.visitorName.substring(0, 2).toUpperCase()}
                          </div>
                          <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0b141a] ${
                            isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-500'
                          }`} title={isOnline ? 'Online' : 'Offline'}></span>
                        </div>

                        {/* Middle: Content */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex justify-between items-baseline gap-1">
                            <span className={`font-semibold text-sm truncate block ${unreadMessages.length > 0 && !isActive ? 'text-[#00a884] font-bold' : 'text-white'}`}>
                              {s.customName || s.visitorName}
                              {s.customName && <span className="text-[9px] text-brand-orange ml-1.5 font-normal">(Editado)</span>}
                              {s.isRegistered && s.visitorCode && (
                                <span className="text-[9px] text-neutral-500 ml-1.5 font-normal">({s.visitorCode})</span>
                              )}
                            </span>

                            {/* Message Time formatted */}
                            <span className={`text-[10px] font-medium shrink-0 ${unreadMessages.length > 0 && !isActive ? 'text-[#00a884]' : 'text-neutral-500'}`}>
                              {(() => {
                                const targetTime = lastMsg ? lastMsg.timestamp : s.lastActive;
                                try {
                                  return new Date(targetTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                                } catch (e) {
                                  return '';
                                }
                              })()}
                            </span>
                          </div>

                          {/* Last message preview */}
                          <div className="flex items-center justify-between gap-1.5">
                            <p className={`text-xs truncate flex-1 ${unreadMessages.length > 0 && !isActive ? 'text-neutral-100 font-semibold' : 'text-neutral-400'}`}>
                              {/* Blue checkmarks for messages sent by us */}
                              {lastMsg && (lastMsg.sender === 'admin' || lastMsg.sender === 'system') && (
                                <span className="text-[#53bdeb] font-bold mr-1">✓✓</span>
                              )}
                              {lastMsg ? lastMsg.text : (
                                s.pagesPassed.length > 0 
                                  ? `📍 No site: ${s.pagesPassed[s.pagesPassed.length - 1]}` 
                                  : 'Acesso iniciado.'
                              )}
                            </p>

                            {/* Unread dot count badge */}
                            {unreadMessages.length > 0 && (
                              <span className="min-w-5 h-5 rounded-full bg-[#00a884] text-neutral-950 text-[10px] font-extrabold flex items-center justify-center px-1.5 shrink-0 shadow-sm animate-bounce">
                                {unreadMessages.length}
                              </span>
                            )}

                            {/* Pinned icon on online sessions */}
                            {isOnline && !unreadMessages.length && (
                              <Pin className="w-3 h-3 text-neutral-600 rotate-45 shrink-0" />
                            )}
                          </div>

                          {/* Subtle visitor tags under message preview */}
                          <div className="flex flex-wrap items-center gap-1 pt-1.5 text-[8px] font-mono text-neutral-500">
                            <span className="bg-[#202c33]/40 border border-neutral-800/40 px-1 py-0.2 rounded text-brand-orange uppercase">
                              {s.device}
                            </span>
                            <span className={`px-1 py-0.2 rounded font-semibold ${s.isNewUser ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/10' : 'bg-blue-950/20 text-blue-400 border border-blue-900/10'}`}>
                              {s.isNewUser ? 'Novo' : 'Retorno'}
                            </span>
                            {s.city && (
                              <span className="bg-[#202c33]/40 border border-neutral-800/40 px-1 py-0.2 rounded text-neutral-300 truncate max-w-[80px]">
                                📍 {s.city}
                              </span>
                            )}
                            {s.referrer && (
                              <span className="bg-[#202c33]/40 border border-neutral-800/40 px-1 py-0.2 rounded text-amber-500 font-semibold truncate max-w-[70px]" title={`Origem: ${s.referrer}`}>
                                🔗 {s.referrer}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Chat Workspace */}
            <div className={`lg:col-span-9 flex flex-col h-full min-h-0 bg-neutral-950/20 ${selectedSessionId || showYouProfile ? 'flex' : 'hidden lg:flex'}`}>
              {showYouProfile ? (
                <div className="flex flex-col h-full bg-[#0b141a] custom-scrollbar overflow-y-auto p-6 space-y-6">
                  {/* Profile Header */}
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <ChevronLeft 
                        className="w-5 h-5 text-[#00a884] lg:hidden cursor-pointer" 
                        onClick={() => setShowYouProfile(false)} 
                      />
                      Meu Perfil (Você)
                    </h2>
                    <span className="bg-[#00a884]/10 border border-[#00a884]/25 text-[#00a884] text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-[#00a884] rounded-full animate-pulse"></span>
                      Online
                    </span>
                  </div>

                  {/* Profile Card */}
                  <div className="bg-neutral-900/60 rounded-xl border border-neutral-850 p-6 flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-orange to-amber-500 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                        A
                      </div>
                      <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-4 border-[#0b141a] rounded-full animate-pulse"></span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-white">Atendente Esquadrijampa</h3>
                      <p className="text-xs text-neutral-400">mktesquadrijampa@gmail.com</p>
                    </div>

                    <div className="pt-2 w-full max-w-xs grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-850">
                        <p className="text-neutral-500 font-medium">Sessões Ativas</p>
                        <p className="text-lg font-bold text-white mt-1">{chatSessions.filter(s => s.online).length}</p>
                      </div>
                      <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-850">
                        <p className="text-neutral-500 font-medium">Total de Leads</p>
                        <p className="text-lg font-bold text-[#00a884] mt-1">{chatSessions.length}</p>
                      </div>
                    </div>
                  </div>

                  {/* Settings and Info List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-neutral-500 font-mono uppercase tracking-wider">Configurações Rápidas</h4>
                    
                    <div className="bg-[#111b21] border border-neutral-800/60 rounded-xl divide-y divide-neutral-800/80 overflow-hidden">
                      <button
                        onClick={() => {
                          setShowEmailConfig(true);
                          setShowYouProfile(false);
                        }}
                        className="w-full flex items-center justify-between p-4 hover:bg-[#202c33]/40 text-left transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-[#00a884]" />
                          <div>
                            <p className="text-xs font-semibold text-white">Alertas de e-mail</p>
                            <p className="text-[10px] text-neutral-500">Notificações em tempo real para novos leads</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-neutral-600" />
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('metrics');
                          setShowYouProfile(false);
                        }}
                        className="w-full flex items-center justify-between p-4 hover:bg-[#202c33]/40 text-left transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <BarChart3 className="w-4 h-4 text-[#00a884]" />
                          <div>
                            <p className="text-xs font-semibold text-white">Visualizar Métricas</p>
                            <p className="text-[10px] text-neutral-500">Acessar dados de tráfego do site</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-neutral-600" />
                      </button>

                      <div className="p-4 text-xs space-y-2 text-neutral-400">
                        <p className="flex justify-between">
                          <span>Status da Conexão:</span>
                          <span className="text-emerald-400 font-bold font-mono">ESTÁVEL</span>
                        </p>
                        <p className="flex justify-between">
                          <span>Ambiente do Servidor:</span>
                          <span className="text-neutral-500 font-mono">Cloud Run Container</span>
                        </p>
                        <p className="flex justify-between">
                          <span>Licença de Uso:</span>
                          <span className="text-brand-orange font-mono">Esquadrijampa VIP</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <div className="pt-4 pb-20">
                    <button
                      onClick={handleLogout}
                      className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-white" />
                      Sair da Conta (Logout)
                    </button>
                  </div>
                </div>
              ) : (
                (() => {
                  const activeSession = chatSessions.find(s => s.sessionId === selectedSessionId) || null;
                  if (!activeSession) {
                    const candidates = chatSessions.filter(s => !s.archived);
                    return (
                    <div className="flex flex-col justify-center items-center p-8 h-full space-y-6 max-w-lg mx-auto overflow-y-auto custom-scrollbar w-full">
                      <div className="text-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center text-brand-orange mx-auto">
                          <MessageSquare className="w-6 h-6 animate-pulse" />
                        </div>
                        <h3 className="text-base font-bold text-white">Enviar Mensagem Rápida</h3>
                        <p className="text-xs text-neutral-400 max-w-sm">
                          Escolha um visitante abaixo ou selecione um na barra lateral para iniciar o atendimento em tempo real.
                        </p>
                      </div>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const targetId = quickSendSessionId || (candidates[0]?.sessionId);
                          if (targetId && quickSendMessageText.trim()) {
                            chatManager.sendMessage(targetId, 'admin', quickSendMessageText.trim());
                            setSelectedSessionId(targetId);
                            setQuickSendMessageText('');
                          }
                        }}
                        className="w-full bg-neutral-900 p-5 rounded-xl border border-neutral-800 space-y-4 shadow-xl"
                      >
                        <div>
                          <label className="block text-[10px] text-neutral-400 uppercase font-mono tracking-wider font-semibold mb-1.5">
                            Destinatário (Visitante)
                          </label>
                          {candidates.length === 0 ? (
                            <div className="text-xs text-neutral-500 py-2.5 px-3 bg-neutral-950 rounded border border-neutral-850">
                              Nenhum visitante ativo no momento. Use "Simular Cliente" para testar!
                            </div>
                          ) : (
                            <select
                              value={quickSendSessionId}
                              onChange={(e) => setQuickSendSessionId(e.target.value)}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2.5 text-xs text-neutral-100 focus:outline-none focus:ring-1 focus:ring-brand-orange font-sans font-medium"
                            >
                              <option value="">Selecione um visitante...</option>
                              {candidates.map(s => (
                                <option key={s.sessionId} value={s.sessionId}>
                                  {s.online ? '🟢' : '⚫'} {s.customName || s.visitorName} ({s.visitorCode || 'Sem Código'})
                                </option>
                              ))}
                            </select>
                          )}
                        </div>

                        <div>
                          <label className="block text-[10px] text-neutral-400 uppercase font-mono tracking-wider font-semibold mb-1.5">
                            Mensagem para enviar
                          </label>
                          <textarea
                            required
                            rows={4}
                            placeholder="Escreva sua mensagem de atendimento aqui..."
                            value={quickSendMessageText}
                            onChange={(e) => setQuickSendMessageText(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded p-3 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange resize-none font-sans"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={!quickSendMessageText.trim() || (!quickSendSessionId && candidates.length === 0)}
                          className="w-full py-3 rounded bg-[#00a884] hover:bg-[#008f72] text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-45 disabled:cursor-not-allowed"
                        >
                          <Send className="w-4 h-4 text-neutral-950" />
                          Iniciar Atendimento & Enviar
                        </button>
                      </form>
                    </div>
                  );
                }

                return (
                  <div className="flex flex-col h-full divide-y divide-neutral-800">
                    {/* Active Header */}
                    <div className="px-3 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-neutral-900/60 border-b border-neutral-800/80">
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        {/* Botão de Voltar para Mobile */}
                        <button
                          onClick={() => setSelectedSessionId(null)}
                          className="lg:hidden flex items-center justify-center p-1.5 rounded bg-neutral-800 hover:bg-neutral-750 text-neutral-300 cursor-pointer border border-neutral-700/50 shrink-0"
                          title="Voltar para lista de visitantes"
                        >
                          <ChevronLeft className="w-3.5 h-3.5 text-brand-orange" />
                        </button>

                        <div className="space-y-0.5 flex-1 min-w-0">
                        {editingNameSessionId === activeSession.sessionId ? (
                          <form 
                            onSubmit={(e) => {
                              e.preventDefault();
                              chatManager.renameVisitor(activeSession.sessionId, editingNameValue);
                              setEditingNameSessionId(null);
                            }}
                            className="flex items-center gap-2 max-w-sm"
                          >
                            <input
                              type="text"
                              value={editingNameValue}
                              onChange={(e) => setEditingNameValue(e.target.value)}
                              className="bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-orange"
                              required
                              autoFocus
                            />
                            <button type="submit" className="p-1 rounded bg-brand-orange text-white cursor-pointer hover:bg-brand-orange-hover">
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              type="button" 
                              onClick={() => setEditingNameSessionId(null)}
                              className="p-1 rounded bg-neutral-850 text-neutral-400 hover:text-white cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </form>
                        ) : (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h2 className="text-xs font-bold text-white flex items-center gap-1.5">
                              {activeSession.customName || activeSession.visitorName}
                              {activeSession.visitorCode && activeSession.isRegistered && (
                                <span className="text-[11px] text-neutral-500 font-normal">({activeSession.visitorCode})</span>
                              )}
                            </h2>
                            <button
                              onClick={() => {
                                setEditingNameSessionId(activeSession.sessionId);
                                setEditingNameValue(activeSession.customName || activeSession.visitorName);
                              }}
                              className="text-neutral-500 hover:text-brand-orange p-0.5 transition-colors rounded hover:bg-neutral-800 cursor-pointer"
                              title="Renomear visitante"
                            >
                              <Edit className="w-3 h-3" />
                            </button>

                            <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[8px] font-mono tracking-wide ${
                              activeSession.online 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' 
                                : 'bg-neutral-800 text-neutral-400 border border-neutral-700/55'
                            }`}>
                              <span className={`w-1 h-1 rounded-full ${activeSession.online ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-500'}`}></span>
                              {activeSession.online ? 'Online' : 'Offline'}
                            </span>

                            <span className={`inline-flex items-center px-1.5 py-0.2 rounded-full text-[8px] font-mono tracking-wide ${
                              activeSession.isNewUser
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15'
                                : 'bg-blue-500/10 text-blue-400 border border-blue-500/15'
                            }`}>
                              {activeSession.isNewUser ? 'Novo' : 'Retorno'}
                            </span>
                          </div>
                        )}

                        <p className="text-[9px] text-neutral-500 font-mono">
                          ID: <span className="text-neutral-400">{activeSession.sessionId.substring(0, 8)}...</span> • Origem: <span className="text-brand-orange font-semibold">{activeSession.referrer}</span> • Disp: <span className="text-neutral-300 font-semibold">{activeSession.device}</span>
                        </p>
                      </div>
                    </div>

                      <div className="flex items-center gap-1.5">
                        {/* Toggle Dossiê/Chat on mobile */}
                        <button
                          onClick={() => setShowDossierOnMobile(!showDossierOnMobile)}
                          className="lg:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 rounded transition-all text-brand-orange cursor-pointer"
                          title={showDossierOnMobile ? "Ver Conversa" : "Ver Dossiê"}
                        >
                          {showDossierOnMobile ? (
                            <>
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Conversa</span>
                            </>
                          ) : (
                            <>
                              <User className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Dossiê</span>
                            </>
                          )}
                        </button>

                        {activeSession.archived ? (
                          <button
                            onClick={() => {
                              chatManager.archiveSession(activeSession.sessionId, false);
                              setChatSessions(chatManager.getSessions());
                            }}
                            className="px-3 py-2 text-xs font-bold bg-neutral-900 border border-neutral-850 hover:bg-emerald-950/20 hover:text-emerald-400 hover:border-emerald-900/50 rounded transition-all text-neutral-400 cursor-pointer flex items-center gap-1.5"
                            title="Reabrir Conversa"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            Reabrir Conversa
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              chatManager.archiveSession(activeSession.sessionId, true);
                              setChatSessions(chatManager.getSessions());
                              setSelectedSessionId(null);
                            }}
                            className="px-3 py-2 text-xs font-bold bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 hover:text-white rounded transition-all text-neutral-300 cursor-pointer flex items-center gap-1.5"
                            title="Encerrar Conversa e Arquivar"
                          >
                            <Archive className="w-3.5 h-3.5 text-neutral-400" />
                            Encerrar Atendimento
                          </button>
                        )}

                        <button
                          onClick={() => {
                            if (window.confirm('Deseja excluir esta sessão de atendimento permanentemente?')) {
                              chatManager.deleteSession(activeSession.sessionId);
                              setSelectedSessionId(null);
                            }
                          }}
                          className="p-2 text-xs font-semibold bg-neutral-900 border border-neutral-850 hover:bg-red-950/20 hover:text-red-400 hover:border-red-900/50 rounded transition-all text-neutral-400 cursor-pointer"
                          title="Excluir Atendimento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Chat Splitscreen: Feed and Tracking panels */}
                    <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
                      
                      {/* Left Side: Message feed (WhatsApp Mobile layout) */}
                      <div 
                        className={`lg:col-span-8 flex flex-col h-full min-h-0 bg-[#0b141a] overflow-hidden border-r border-neutral-800 relative ${showDossierOnMobile ? 'hidden lg:flex' : 'flex'}`}
                        style={{ 
                          backgroundImage: 'radial-gradient(#1f2c34 1.2px, transparent 1.2px)', 
                          backgroundSize: '20px 20px' 
                        }}
                      >
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                          {activeSession.messages.map((msg) => {
                            const isSystem = msg.sender === 'system';
                            const isAdmin = msg.sender === 'admin';

                            if (isSystem) {
                              return (
                                <div key={msg.id} className="flex justify-center my-2">
                                  <span className="bg-[#182229] border border-neutral-800/60 text-[#8696a0] text-[10px] px-3.5 py-1.5 rounded-md text-center max-w-[85%] shadow-sm font-medium">
                                    {msg.text}
                                  </span>
                                </div>
                              );
                            }

                            return (
                              <div
                                key={msg.id}
                                className={`flex ${isAdmin ? 'justify-end' : 'justify-start'} mb-1`}
                              >
                                <div
                                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs shadow-md relative leading-relaxed flex flex-col ${
                                    isAdmin
                                      ? 'bg-[#005c4b] text-neutral-100 rounded-tr-none'
                                      : 'bg-[#202c33] text-neutral-200 rounded-tl-none border border-neutral-800/30'
                                  }`}
                                >
                                  {/* Message Text with padding-bottom to avoid overlap with absolute timestamp */}
                                  <p className="whitespace-pre-wrap break-words pb-4 pr-2">{msg.text}</p>
                                  
                                  {/* Timestamp & Double Ticks */}
                                  <div className="absolute bottom-1.5 right-2.5 flex items-center gap-1 text-[9px] select-none text-[#8696a0] font-medium">
                                    <span>
                                      {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    {isAdmin && (
                                      msg.read ? (
                                        <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb] shrink-0" title="Lido" />
                                      ) : (
                                        <Check className="w-3.5 h-3.5 text-[#8696a0]/70 shrink-0" title="Entregue" />
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          <div ref={chatMessagesEndRef} />
                        </div>

                        {/* Input row (WhatsApp Mobile style) */}
                        <form 
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (adminMessageInput.trim()) {
                              chatManager.sendMessage(activeSession.sessionId, 'admin', adminMessageInput.trim());
                              setAdminMessageInput('');
                            }
                          }}
                          className="p-3 bg-[#1f2c34] flex items-center gap-2 border-t border-neutral-800/40"
                        >
                          <div className="flex-1 bg-[#2a3942] rounded-full flex items-center px-4 py-1 border border-neutral-800/20 shadow-inner">
                            <input
                              type="text"
                              required
                              placeholder="Mensagem"
                              value={adminMessageInput}
                              onChange={(e) => setAdminMessageInput(e.target.value)}
                              className="flex-1 text-xs text-white bg-transparent border-none outline-none py-2.5 focus:ring-0 placeholder-[#8696a0]"
                            />
                          </div>
                          <button
                            type="submit"
                            className="p-3 rounded-full bg-[#00a884] hover:bg-[#008f72] text-neutral-950 transition-colors cursor-pointer shadow-md shrink-0 flex items-center justify-center"
                            title="Enviar"
                          >
                            <Send className="w-4 h-4 text-neutral-950" />
                          </button>
                        </form>
                      </div>

                      {/* Right Side: Visitor Dossier & Notes */}
                      <div className={`lg:col-span-4 h-full min-h-0 overflow-y-auto custom-scrollbar divide-y divide-neutral-800 bg-neutral-900/10 ${showDossierOnMobile ? 'flex flex-col' : 'hidden lg:flex lg:flex-col'}`}>
                        
                        {/* Contact Dossier Card */}
                        <div className="p-4 space-y-3 bg-neutral-950/20">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-brand-orange" />
                            Dossiê de Contato & Localização
                          </span>

                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            {/* Localização */}
                            <div className="bg-neutral-950 p-2.5 rounded border border-neutral-850/60 space-y-1 col-span-2">
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] text-neutral-500 block uppercase">Localização</span>
                                {editingLocationSessionId !== activeSession.sessionId && (
                                  <button
                                    onClick={() => {
                                      setEditingLocationSessionId(activeSession.sessionId);
                                      setEditingCityValue(activeSession.city || 'João Pessoa');
                                      setEditingStateValue(activeSession.state || 'PB');
                                      setEditingNeighborhoodValue(activeSession.neighborhood || '');
                                    }}
                                    className="text-[9px] text-neutral-400 hover:text-brand-orange flex items-center gap-0.5 transition-colors cursor-pointer font-bold"
                                    type="button"
                                  >
                                    <Edit className="w-2.5 h-2.5" /> Editar
                                  </button>
                                )}
                              </div>
                              
                              {editingLocationSessionId === activeSession.sessionId ? (
                                <form
                                  onSubmit={(e) => {
                                    e.preventDefault();
                                    chatManager.updateSessionLocation(
                                      activeSession.sessionId,
                                      editingCityValue,
                                      editingStateValue,
                                      editingNeighborhoodValue
                                    );
                                    setEditingLocationSessionId(null);
                                    setChatSessions(chatManager.getSessions());
                                  }}
                                  className="space-y-1.5 pt-1 text-[11px]"
                                >
                                  <div className="grid grid-cols-3 gap-1.5">
                                    <div className="col-span-2">
                                      <span className="text-[8px] text-neutral-500 block uppercase">Cidade</span>
                                      <input
                                        type="text"
                                        value={editingCityValue}
                                        onChange={(e) => setEditingCityValue(e.target.value)}
                                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-0.5 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-brand-orange"
                                      />
                                    </div>
                                    <div>
                                      <span className="text-[8px] text-neutral-500 block uppercase">UF</span>
                                      <input
                                        type="text"
                                        value={editingStateValue}
                                        onChange={(e) => setEditingStateValue(e.target.value)}
                                        maxLength={2}
                                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-0.5 text-[10px] text-white uppercase focus:outline-none focus:ring-1 focus:ring-brand-orange"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-[8px] text-neutral-500 block uppercase">Bairro</span>
                                    <input
                                      type="text"
                                      value={editingNeighborhoodValue}
                                      onChange={(e) => setEditingNeighborhoodValue(e.target.value)}
                                      className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-0.5 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-brand-orange"
                                    />
                                  </div>
                                  <div className="flex gap-1 justify-end pt-1">
                                    <button
                                      type="submit"
                                      className="px-2 py-0.5 rounded bg-brand-orange text-white text-[9px] font-bold hover:bg-brand-orange/95 cursor-pointer"
                                    >
                                      Salvar
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setEditingLocationSessionId(null)}
                                      className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 text-[9px] font-bold hover:text-white cursor-pointer"
                                    >
                                      Cancelar
                                    </button>
                                  </div>
                                </form>
                              ) : (
                                <span className="text-white font-semibold flex flex-wrap items-center gap-1 leading-snug">
                                  📍 {activeSession.city || 'João Pessoa'}{activeSession.neighborhood ? ` / ${activeSession.neighborhood}` : ''}, {activeSession.state || 'PB'}
                                </span>
                              )}
                            </div>

                            {/* Tempo Online */}
                            <div className="bg-neutral-950 p-2.5 rounded border border-neutral-850/60 space-y-1">
                              <span className="text-[9px] text-neutral-500 block uppercase">Tempo no Site</span>
                              <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1">
                                ⏱️ <SessionDuration startedAt={activeSession.startedAt} lastActive={activeSession.lastActive} online={activeSession.online} />
                              </span>
                            </div>

                            {/* Tipo de Visitante */}
                            <div className="bg-neutral-950 p-2.5 rounded border border-neutral-850/60 space-y-1">
                              <span className="text-[9px] text-neutral-500 block uppercase">Tipo de Visitante</span>
                              <span className={`font-semibold flex items-center gap-1 ${activeSession.isNewUser ? 'text-emerald-400' : 'text-blue-400'}`}>
                                {activeSession.isNewUser ? '🆕 Novo' : '🔁 Recorrente'}
                              </span>
                            </div>

                            {/* Código Identificador */}
                            <div className="bg-neutral-950 p-2.5 rounded border border-neutral-850/60 space-y-1">
                              <span className="text-[9px] text-neutral-500 block uppercase">Ordem de Entrada</span>
                              <span className="text-brand-orange font-mono font-semibold flex items-center gap-1">
                                🆔 {activeSession.visitorCode || 'N/A'}
                              </span>
                            </div>
                          </div>

                          {/* Telefone / WhatsApp */}
                          <div className="bg-neutral-950 p-3 rounded border border-neutral-850/60 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] text-neutral-500 uppercase block font-medium">WhatsApp / Telefone</span>
                              {editingPhoneSessionId !== activeSession.sessionId && (
                                <button
                                  onClick={() => {
                                    setEditingPhoneSessionId(activeSession.sessionId);
                                    setEditingPhoneValue(activeSession.phone || '');
                                  }}
                                  className="text-[9px] text-neutral-400 hover:text-brand-orange flex items-center gap-1 transition-colors cursor-pointer font-bold"
                                >
                                  <Edit className="w-3 h-3" /> Editar
                                </button>
                              )}
                            </div>

                            {editingPhoneSessionId === activeSession.sessionId ? (
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  chatManager.updateVisitorPhone(activeSession.sessionId, editingPhoneValue);
                                  setEditingPhoneSessionId(null);
                                  setChatSessions(chatManager.getSessions());
                                }}
                                className="flex gap-1.5"
                              >
                                <input
                                  type="text"
                                  value={editingPhoneValue}
                                  onChange={(e) => setEditingPhoneValue(e.target.value)}
                                  placeholder="(83) 99999-9999"
                                  className="flex-1 bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-orange"
                                  autoFocus
                                />
                                <button type="submit" className="px-2 py-1 rounded bg-brand-orange text-white text-[10px] font-bold hover:bg-brand-orange/95 cursor-pointer">
                                  Salvar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingPhoneSessionId(null)}
                                  className="px-2 py-1 rounded bg-neutral-800 text-neutral-400 text-[10px] font-bold hover:text-white cursor-pointer"
                                >
                                  Cancelar
                                </button>
                              </form>
                            ) : (
                              <div className="flex items-center justify-between">
                                <span className="text-white font-bold font-mono text-xs">
                                  {activeSession.phone || 'Não informado'}
                                </span>
                                {activeSession.phone && (
                                  <a
                                    href={`https://wa.me/55${activeSession.phone.replace(/\D/g, '')}`}
                                    target="_blank"
                                    referrerPolicy="no-referrer"
                                    className="inline-flex items-center gap-1 text-[10px] bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 font-bold px-2 py-1 rounded border border-emerald-500/20 transition-colors"
                                  >
                                    Fale no WhatsApp
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Note block */}
                        <div className="p-4 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-brand-orange" />
                              Notas do Atendente
                            </span>
                            {notesSaveStatus && (
                              <span className="text-[9px] font-mono text-emerald-400 font-semibold animate-pulse">
                                {notesSaveStatus}
                              </span>
                            )}
                          </div>
                          
                          <textarea
                            placeholder="Anote contatos, telefones ou especificações de esquadrias solicitadas por este cliente..."
                            value={activeSession.notes}
                            onChange={(e) => {
                              chatManager.updateAdminNotes(activeSession.sessionId, e.target.value);
                              setNotesSaveStatus('Salvando...');
                              // Force redraw
                              setChatSessions(chatManager.getSessions());
                              setTimeout(() => setNotesSaveStatus('Salvo!'), 600);
                            }}
                            className="w-full h-20 bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-neutral-300 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-brand-orange leading-relaxed"
                          />
                        </div>

                        {/* Navigation History */}
                        <div className="p-4 space-y-2.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                            <History className="w-3.5 h-3.5 text-brand-orange" />
                            Páginas Visitadas ({activeSession.pagesPassed.length})
                          </span>

                          <div className="space-y-1.5 max-h-[120px] overflow-y-auto custom-scrollbar pr-1">
                            {activeSession.pagesPassed.map((page, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-[11px] text-neutral-300 font-mono bg-neutral-950 p-1.5 rounded border border-neutral-850">
                                <span className="text-[9px] text-neutral-500">#{idx + 1}</span>
                                <span className="truncate flex-1">{page}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-between text-[10px] text-neutral-400 pt-1">
                            <span>Vezes que acessou o site:</span>
                            <span className="text-brand-orange font-bold font-mono">{activeSession.visitsCount} entradas</span>
                          </div>
                        </div>

                        {/* Action clicks history */}
                        <div className="p-4 space-y-2.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                            <MousePointerClick className="w-3.5 h-3.5 text-brand-orange" />
                            Ações & Cliques Rastreados ({activeSession.clicks.length})
                          </span>

                          {activeSession.clicks.length === 0 ? (
                            <p className="text-[10px] text-neutral-500 italic">Nenhum clique de botão detectado neste acesso.</p>
                          ) : (
                            <div className="space-y-1.5 max-h-[140px] overflow-y-auto custom-scrollbar pr-1">
                              {activeSession.clicks.map((click, idx) => (
                                <div key={idx} className="bg-neutral-950 p-2 rounded border border-neutral-850 text-[10px] space-y-0.5">
                                  <div className="flex justify-between text-neutral-200 font-semibold gap-1">
                                    <span className="truncate">{click.text}</span>
                                    <span className="text-[8px] text-neutral-500 font-mono shrink-0">
                                      {new Date(click.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                  <p className="text-[8px] text-neutral-500 font-mono truncate">ID: {click.elementId || '-'}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })()
              )}
            </div>

          </div>
        )}
      </main>

      {/* WhatsApp-Style Mobile Bottom Navigation Bar (matches native screenshot) */}
      {!selectedSessionId && activeTab === 'chat' && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0b141a] border-t border-neutral-800/80 backdrop-blur-md px-2 py-2 flex justify-around items-center h-[65px] select-none shadow-2xl">
          {/* Tab: Atualizações (Metrics) */}
          <button
            onClick={() => {
              setActiveTab('metrics');
              setShowYouProfile(false);
            }}
            className={`flex flex-col items-center justify-center w-16 transition-all active:scale-95 cursor-pointer ${
              activeTab === 'metrics' && !showYouProfile ? 'text-[#00a884]' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <div className="relative p-1">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold mt-1">Atualizações</span>
          </button>

          {/* Tab: Conversas (Chats) */}
          <button
            onClick={() => {
              setActiveTab('chat');
              setShowYouProfile(false);
              setShowEmailConfig(false);
            }}
            className={`flex flex-col items-center justify-center w-16 transition-all active:scale-95 cursor-pointer ${
              activeTab === 'chat' && !showYouProfile && !showEmailConfig ? 'text-[#00a884]' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <div className="relative p-1">
              <MessageSquare className="w-5 h-5" />
              {(() => {
                const totalUnreadCount = chatSessions.reduce((acc, s) => acc + s.messages.filter(m => m.sender === 'visitor' && !m.read).length, 0);
                return totalUnreadCount > 0 ? (
                  <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] rounded-full bg-[#00a884] text-neutral-950 text-[9px] font-extrabold flex items-center justify-center px-1 shadow animate-pulse">
                    {totalUnreadCount}
                  </span>
                ) : null;
              })()}
            </div>
            <span className="text-[10px] font-semibold mt-1">Conversas</span>
          </button>

          {/* Tab: Simular (Plus) */}
          <button
            onClick={() => {
              setShowYouProfile(false);
              if (window.confirm('Deseja iniciar um visitante simulado para testar o atendimento?')) {
                chatManager.triggerSimulatedVisitor();
                setChatSessions(chatManager.getSessions());
              }
            }}
            className="flex flex-col items-center justify-center w-16 text-neutral-500 hover:text-neutral-300 transition-all active:scale-95 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#00a884]/15 border border-[#00a884]/20 flex items-center justify-center text-[#00a884] -mt-2 shadow-md hover:bg-[#00a884]/25">
              <Sparkles className="w-4.5 h-4.5 text-[#00a884]" />
            </div>
            <span className="text-[10px] font-semibold mt-1">Simular</span>
          </button>

          {/* Tab: Alertas (Email Config) */}
          <button
            onClick={() => {
              setActiveTab('chat');
              setShowEmailConfig(true);
              setShowYouProfile(false);
            }}
            className={`flex flex-col items-center justify-center w-16 transition-all active:scale-95 cursor-pointer ${
              showEmailConfig ? 'text-[#00a884]' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <div className="relative p-1">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold mt-1">Alertas</span>
          </button>

          {/* Tab: Você (You) */}
          <button
            onClick={() => {
              setShowYouProfile(true);
              setShowEmailConfig(false);
            }}
            className={`flex flex-col items-center justify-center w-16 transition-all active:scale-95 cursor-pointer ${
              showYouProfile ? 'text-[#00a884]' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <div className="relative">
              <div className="w-5 h-5 rounded-full bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-neutral-400 border border-neutral-700">
                AD
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#00a884] border border-[#0b141a] animate-pulse"></span>
            </div>
            <span className="text-[10px] font-semibold mt-1">Você</span>
          </button>
        </div>
      )}
    </div>
  );
}
