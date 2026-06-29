/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PageViewEvent, ClickEvent, analyticsTracker } from './analyticsTracker';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc
} from 'firebase/firestore';
import { sendNewVisitorNotification } from './emailNotifier';


interface LocationInfo {
  city: string;
  state: string;
}

async function fetchLocation(): Promise<LocationInfo> {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (res.ok) {
      const data = await res.json();
      if (data && data.city) {
        return {
          city: data.city,
          state: data.region_code || data.region || 'PB'
        };
      }
    }
  } catch (e) {
    console.warn("Could not fetch location via IP:", e);
  }
  return {
    city: 'João Pessoa',
    state: 'PB'
  };
}


export interface ChatMessage {
  id: string;
  sender: 'visitor' | 'admin' | 'system';
  text: string;
  timestamp: string;
  read: boolean;
}

export interface VisitorSession {
  sessionId: string;
  visitorName: string;
  isRegistered: boolean;
  online: boolean;
  lastActive: string;
  startedAt: string;
  device: string;
  referrer: string;
  visitsCount: number; // Number of visits/entries in past days
  pagesPassed: string[]; // List of page paths visited in current session
  clicks: ClickEvent[];
  messages: ChatMessage[];
  adminNotes: string;
  customAttendantName?: string; // Custom name given by the admin/attendant
  customName?: string; // Custom display name
  isSimulated?: boolean;
  simulatedPersona?: string; // Type of lead for simulated responses
  city?: string;
  state?: string;
  archived?: boolean;
  phone?: string;
}

const CURRENT_VISITOR_KEY = 'esquadrijampa_current_visitor_info';

// Firebase credentials from firebase-applet-config.json
const firebaseConfig = {
  projectId: "gen-lang-client-0557399204",
  appId: "1:527253132399:web:7cff12e3a88774fbf8a99a",
  apiKey: "AIzaSyCz_T59t1q6cf4WFP6zUN6-NTBK_KoOb24",
  authDomain: "gen-lang-client-0557399204.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-esquadrijampa-2b8baaf1-ceeb-4d68-8856-e5167e9de1c6",
  storageBucket: "gen-lang-client-0557399204.firebasestorage.app",
  messagingSenderId: "527253132399",
  measurementId: ""
};

// Initialize Firebase App and Firestore Database (with custom database ID mapping)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");
const sessionsCollection = collection(db, 'sessions');

// Simulated personas to make the dashboard look active and fun to play with
const SIMULATED_PERSONAS = [
  {
    name: 'Carlos Mendes',
    persona: 'Construindo casa em Cabedelo, querendo orçamento para esquadrias pretas linha Gold.',
    initialMessage: 'Olá! Vocês fazem esquadrias sob medida para a linha Gold na cor preta?',
    path: ['/', '/esquadrias', '/portfolio', '/contato'],
    clicks: ['cta-home-orcamento'],
    device: 'Desktop',
    referrer: 'Google (Orgânico)',
    city: 'Cabedelo',
    state: 'PB',
    phone: '(83) 98877-6655',
    responses: [
      'Estou construindo uma casa de dois pavimentos no condomínio Alphaville.',
      'Preciso de esquadrias para 3 suítes, mais a pele de vidro da fachada.',
      'Excelente. Vocês conseguem me enviar um orçamento se eu mandar o projeto em PDF pelo WhatsApp?',
      'Perfeito! Vou clicar no botão do WhatsApp e enviar o projeto arquitetônico agora mesmo.'
    ]
  },
  {
    name: 'Amanda Souza (Arquiteta)',
    persona: 'Procura parceria de fachadas de vidro estrutural para projeto de consultório médico no Altiplano.',
    initialMessage: 'Boa tarde! Sou arquiteta e gostaria de saber se vocês executam fachadas Glazing em pele de vidro.',
    path: ['/', '/fachadas', '/portfolio'],
    clicks: ['floating-whatsapp-btn'],
    device: 'Mobile',
    referrer: 'Instagram',
    city: 'João Pessoa',
    state: 'PB',
    phone: '(83) 99123-4567',
    responses: [
      'Estou com um projeto de um consultório de 120m² no Altiplano e o cliente quer a fachada toda em vidro temperado refletivo.',
      'Perfeito, prezo muito pelo acabamento fino e pelo cumprimento de prazos.',
      'Vou salvar o contato de vocês para incluir no memorial descritivo dos meus próximos projetos.',
      'Muito obrigada pelo retorno ágil!'
    ]
  },
  {
    name: 'Juliana Pires',
    persona: 'Deseja colocar brises de alumínio amadeirado na varanda do apartamento em Manaíra.',
    initialMessage: 'Oi, tudo bem? Vocês vendem brises que imitam madeira? Queria colocar na minha varanda.',
    path: ['/', '/brises'],
    clicks: ['floating-whatsapp-btn'],
    device: 'Mobile',
    referrer: 'Direto / Favoritos',
    city: 'João Pessoa',
    state: 'PB',
    phone: '(83) 98765-4321',
    responses: [
      'Moro em um apartamento em Manaíra que pega muito sol da tarde na varanda.',
      'Gostaria de brises móveis para poder controlar a entrada de luz.',
      'A medida aproximada é de 2,40m de altura por 3,10m de largura.',
      'Maravilha. Vou agendar uma visita técnica de vocês para medição precisa.'
    ]
  }
];

class ChatManager {
  private sessions: VisitorSession[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      // Connect to Firestore real-time snapshot listener
      onSnapshot(sessionsCollection, (snapshot) => {
        const loaded: VisitorSession[] = [];
        snapshot.forEach((doc) => {
          loaded.push(doc.data() as VisitorSession);
        });

        // Sort by last active / started at so order is consistent
        loaded.sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime());

        if (loaded.length === 0) {
          // If Firestore is empty, seed initial simulated leads
          this.seedSimulatedLeadsInFirestore();
        } else {
          this.sessions = loaded;
          this.notifyListeners();
        }
      }, (error) => {
        console.error("Firestore snapshot error:", error);
      });
    }
  }

  private async seedSimulatedLeadsInFirestore() {
    const now = new Date();
    const simulated = SIMULATED_PERSONAS.map((p, idx) => {
      const started = new Date();
      started.setMinutes(now.getMinutes() - (idx + 1) * 20);
      
      const sessionID = `simulated_${idx + 1}`;
      return {
        sessionId: sessionID,
        visitorName: p.name,
        isRegistered: true,
        online: true,
        lastActive: new Date().toISOString(),
        startedAt: started.toISOString(),
        device: p.device,
        referrer: p.referrer,
        visitsCount: Math.floor(Math.random() * 3) + 1,
        pagesPassed: p.path,
        clicks: p.clicks.map(cId => ({
          text: cId === 'floating-whatsapp-btn' ? 'Fale no WhatsApp' : 'Solicitar Orçamento',
          elementId: cId,
          elementClass: 'btn-cta',
          category: cId === 'floating-whatsapp-btn' ? 'floating_buttons' : 'cta',
          path: p.path[p.path.length - 1],
          timestamp: new Date(started.getTime() + 120000).toISOString()
        })),
        messages: [
          {
            id: `msg_sim_${idx}_init`,
            sender: 'visitor',
            text: p.initialMessage,
            timestamp: new Date(started.getTime() + 180000).toISOString(),
            read: false
          }
        ],
        adminNotes: '',
        isSimulated: true,
        simulatedPersona: p.persona,
        city: p.city,
        state: p.state,
        phone: p.phone,
        archived: false
      } as VisitorSession;
    });

    for (const session of simulated) {
      await this.saveSessionToFirestore(session);
    }
  }

  private async saveSessionToFirestore(session: VisitorSession) {
    try {
      const docRef = doc(db, 'sessions', session.sessionId);
      await setDoc(docRef, session);
    } catch (err) {
      console.error('Failed to save session to Firestore:', err);
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(l => l());
  }

  // --- Visitor Side API ---

  public getOrCreateCurrentVisitor(): VisitorSession {
    const currentId = sessionStorage.getItem('esquadrijampa_analytics_session_id') || 'visitor_' + Date.now();
    if (!sessionStorage.getItem('esquadrijampa_analytics_session_id')) {
      sessionStorage.setItem('esquadrijampa_analytics_session_id', currentId);
    }
    
    // Check if we already have this session loaded in our firestore-synced list
    let session = this.sessions.find(s => s.sessionId === currentId);
    
    if (!session) {
      // Get visitor context from analytics tracker
      const allViews = analyticsTracker.getViews();
      let sessionViews = allViews.filter(v => v.sessionId === currentId);
      
      // Fallback for transition/legacy views without sessionId
      if (sessionViews.length === 0) {
        sessionViews = allViews.filter(v => {
          const d = new Date(v.timestamp);
          return (Date.now() - d.getTime()) < 3600000 * 2; // last 2 hours
        });
      }

      const pagesPassed = sessionViews.map(v => v.path);
      const referrer = sessionViews[0]?.referrer || 'Direto / Favoritos';
      const device = sessionViews[0]?.device || 'Mobile';

      // Load previous names/preferences if any
      const currentStoredInfoRaw = localStorage.getItem(CURRENT_VISITOR_KEY);
      const storedInfo = currentStoredInfoRaw ? JSON.parse(currentStoredInfoRaw) : {};

      // Filter clicks strictly by sessionId to prevent cross-session leaking
      const allClicks = analyticsTracker.getClicks();
      const sessionClicks = allClicks.filter(c => c.sessionId === currentId);

      session = {
        sessionId: currentId,
        visitorName: storedInfo.visitorName || 'Visitante Anônimo',
        isRegistered: !!storedInfo.isRegistered,
        online: true,
        lastActive: new Date().toISOString(),
        startedAt: new Date().toISOString(),
        device,
        referrer,
        visitsCount: 1,
        pagesPassed: pagesPassed.length > 0 ? pagesPassed : ['/'],
        clicks: sessionClicks,
        messages: [],
        adminNotes: '',
        phone: storedInfo.phone || '',
        city: 'João Pessoa',
        state: 'PB',
        archived: false
      };

      // Add to Firestore database
      this.saveSessionToFirestore(session);
      sendNewVisitorNotification(session);

      // Asynchronously fetch real city/state and update
      fetchLocation().then(loc => {
        if (session) {
          session.city = loc.city;
          session.state = loc.state;
          this.saveSessionToFirestore(session);
        }
      });
    } else {
      // Update activity status to online
      if (!session.online) {
        session.online = true;
        session.lastActive = new Date().toISOString();
        this.saveSessionToFirestore(session);
      }
    }

    return session;
  }

  public registerVisitorName(name: string, phone: string = '') {
    const session = this.getOrCreateCurrentVisitor();
    session.visitorName = name;
    session.phone = phone;
    session.isRegistered = true;
    session.lastActive = new Date().toISOString();

    // Store in general visitor configuration so it remembers them next visit
    localStorage.setItem(CURRENT_VISITOR_KEY, JSON.stringify({
      visitorName: name,
      phone,
      isRegistered: true
    }));

    // Add a system welcome message
    session.messages.push({
      id: 'sys_' + Date.now(),
      sender: 'system',
      text: `Olá ${name}! Um de nossos atendentes da Esquadrijampa entrará em contato em breve. Como podemos ajudar hoje?`,
      timestamp: new Date().toISOString(),
      read: true
    });

    this.saveSessionToFirestore(session);
    sendNewVisitorNotification(session);
  }

  // --- Message Sending API ---

  public sendMessage(sessionId: string, sender: 'visitor' | 'admin', text: string) {
    const session = this.sessions.find(s => s.sessionId === sessionId);
    if (!session) return;

    const newMessage: ChatMessage = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      sender,
      text,
      timestamp: new Date().toISOString(),
      read: sender === 'admin' ? false : true
    };

    session.messages.push(newMessage);
    session.lastActive = new Date().toISOString();
    
    if (sender === 'visitor') {
      session.online = true;
    }

    this.saveSessionToFirestore(session);

    // Trigger smart simulated replies if it's a simulated visitor
    if (sender === 'admin' && session.isSimulated) {
      this.triggerSimulatedResponse(session);
    }
  }

  private triggerSimulatedResponse(session: VisitorSession) {
    const personaData = SIMULATED_PERSONAS.find(p => p.name === session.visitorName || (session.visitorName && session.visitorName.startsWith(p.name)));
    if (!personaData) return;

    // Simulate typing delay (1.5 to 3.5 seconds)
    setTimeout(async () => {
      // Re-fetch latest snapshot of the session to prevent overwrites
      const currentSession = this.sessions.find(s => s.sessionId === session.sessionId);
      if (!currentSession) return;

      const adminMsgs = currentSession.messages.filter(m => m.sender === 'admin').length;
      const responseIndex = Math.min(adminMsgs - 1, personaData.responses.length - 1);
      const text = responseIndex >= 0 ? personaData.responses[responseIndex] : 'Entendido! Muito obrigado pelas informações, estou aguardando o contato.';

      const reply: ChatMessage = {
        id: 'msg_reply_' + Date.now(),
        sender: 'visitor',
        text,
        timestamp: new Date().toISOString(),
        read: false
      };

      currentSession.messages.push(reply);
      currentSession.lastActive = new Date().toISOString();
      await this.saveSessionToFirestore(currentSession);
    }, 2000 + Math.random() * 1500);
  }

  // Mark all messages as read for a session
  public markAsRead(sessionId: string) {
    const session = this.sessions.find(s => s.sessionId === sessionId);
    if (session) {
      session.messages = session.messages.map(m => ({ ...m, read: true }));
      this.saveSessionToFirestore(session);
    }
  }

  // --- Admin Customisation API ---

  public updateAdminNotes(sessionId: string, notes: string) {
    const session = this.sessions.find(s => s.sessionId === sessionId);
    if (session) {
      session.adminNotes = notes;
      this.saveSessionToFirestore(session);
    }
  }

  public updateCustomAttendantName(sessionId: string, customName: string) {
    const session = this.sessions.find(s => s.sessionId === sessionId);
    if (session) {
      session.customAttendantName = customName;
      session.customName = customName;
      this.saveSessionToFirestore(session);
    }
  }

  public renameVisitor(sessionId: string, newName: string) {
    const session = this.sessions.find(s => s.sessionId === sessionId);
    if (session) {
      session.customName = newName;
      session.customAttendantName = newName;
      this.saveSessionToFirestore(session);
    }
  }

  public async deleteSession(sessionId: string) {
    try {
      const docRef = doc(db, 'sessions', sessionId);
      await deleteDoc(docRef);
    } catch (err) {
      console.error('Failed to delete session from Firestore:', err);
    }
  }

  public updateVisitorPhone(sessionId: string, phone: string) {
    const session = this.sessions.find(s => s.sessionId === sessionId);
    if (session) {
      session.phone = phone;
      this.saveSessionToFirestore(session);
    }
  }

  public archiveSession(sessionId: string, archived: boolean = true) {
    const session = this.sessions.find(s => s.sessionId === sessionId);
    if (session) {
      session.archived = archived;
      this.saveSessionToFirestore(session);
    }
  }

  public trackPageNavigation(path: string) {
    const currentId = sessionStorage.getItem('esquadrijampa_analytics_session_id') || 'visitor_' + Date.now();
    if (!sessionStorage.getItem('esquadrijampa_analytics_session_id')) {
      sessionStorage.setItem('esquadrijampa_analytics_session_id', currentId);
    }

    let session = this.sessions.find(s => s.sessionId === currentId);
    if (!session) {
      session = this.getOrCreateCurrentVisitor();
    }

    if (session) {
      if (!session.pagesPassed) {
        session.pagesPassed = [];
      }
      
      const lastPage = session.pagesPassed[session.pagesPassed.length - 1];
      if (lastPage !== path) {
        session.pagesPassed = [...session.pagesPassed, path];
        session.lastActive = new Date().toISOString();
        this.saveSessionToFirestore(session);
      }
    }
  }

  public trackClickAction(clickText: string, clickId: string, elementClass: string, category: string, path: string) {
    const currentId = sessionStorage.getItem('esquadrijampa_analytics_session_id') || 'visitor_' + Date.now();
    if (!sessionStorage.getItem('esquadrijampa_analytics_session_id')) {
      sessionStorage.setItem('esquadrijampa_analytics_session_id', currentId);
    }

    let session = this.sessions.find(s => s.sessionId === currentId);
    if (!session) {
      session = this.getOrCreateCurrentVisitor();
    }

    if (session) {
      if (!session.clicks) {
        session.clicks = [];
      }
      
      const newClick: ClickEvent = {
        sessionId: currentId,
        text: clickText || 'Botão sem texto',
        elementId: clickId || 'sem_id',
        elementClass: elementClass || '',
        category: category || 'geral',
        path: path || window.location.pathname,
        timestamp: new Date().toISOString(),
      };

      // Avoid registering duplicate clicks in the exact same millisecond
      const isDuplicate = session.clicks.some(
        c => c.elementId === clickId && 
             Math.abs(new Date(c.timestamp).getTime() - Date.now()) < 500
      );

      if (!isDuplicate) {
        session.clicks = [...session.clicks, newClick];
        session.lastActive = new Date().toISOString();
        this.saveSessionToFirestore(session);
      }
    }
  }

  public async triggerSimulatedVisitor() {
    const p = SIMULATED_PERSONAS[Math.floor(Math.random() * SIMULATED_PERSONAS.length)];
    const randomId = 'simulated_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    
    const newSession: VisitorSession = {
      sessionId: randomId,
      visitorName: p.name + ' (Simulado)',
      isRegistered: true,
      online: true,
      lastActive: new Date().toISOString(),
      startedAt: new Date().toISOString(),
      device: p.device,
      referrer: p.referrer,
      visitsCount: Math.floor(Math.random() * 3) + 1,
      pagesPassed: p.path,
      clicks: p.clicks.map(cId => ({
        text: cId === 'floating-whatsapp-btn' ? 'Fale no WhatsApp' : 'Solicitar Orçamento',
        elementId: cId,
        elementClass: 'btn-cta',
        category: cId === 'floating-whatsapp-btn' ? 'floating_buttons' : 'cta',
        path: p.path[p.path.length - 1],
        timestamp: new Date().toISOString()
      })),
      messages: [
        {
          id: 'msg_sim_' + Date.now() + '_init',
          sender: 'visitor',
          text: p.initialMessage,
          timestamp: new Date().toISOString(),
          read: false
        }
      ],
      adminNotes: '',
      isSimulated: true,
      simulatedPersona: p.persona,
      city: p.city,
      state: p.state,
      phone: p.phone,
      archived: false
    };

    await this.saveSessionToFirestore(newSession);
    sendNewVisitorNotification(newSession);
  }

  public getSessions(): VisitorSession[] {
    return this.sessions;
  }

  // Keeps online states updated by ticking offline if idle for more than 4 minutes
  public updateOnlineStates() {
    const now = Date.now();
    this.sessions.forEach(s => {
      if (s.isSimulated) return;

      const idleTime = now - new Date(s.lastActive).getTime();
      const fourMinutes = 240000;
      const isOnlineNow = idleTime < fourMinutes;

      if (s.online !== isOnlineNow) {
        s.online = isOnlineNow;
        this.saveSessionToFirestore(s);
      }
    });
  }
}

export const chatManager = new ChatManager();

export function formatTimeOnline(startedAt: string): string {
  try {
    const d = new Date(startedAt);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return '';
  }
}
