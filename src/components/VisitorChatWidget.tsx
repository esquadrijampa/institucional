/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, FormEvent } from 'react';
import { MessageSquare, X, Send, User, ChevronDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { chatManager, VisitorSession } from '../lib/chatManager';

export default function VisitorChatWidget() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [session, setSession] = useState<VisitorSession | null>(null);
  const [nameInput, setNameInput] = useState<string>('');
  const [phoneInput, setPhoneInput] = useState<string>('');
  const [messageInput, setMessageInput] = useState<string>('');
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [lastAdminMessage, setLastAdminMessage] = useState<string | null>(null);
  const [showAdminToast, setShowAdminToast] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load and subscribe to chat session updates
  useEffect(() => {
    // Initialize or load current session
    const currentSession = chatManager.getOrCreateCurrentVisitor();
    setSession(currentSession);

    const unsubscribe = chatManager.subscribe(() => {
      const updated = chatManager.getOrCreateCurrentVisitor();
      setSession(updated);
    });

    // Tick online states and monitor updates
    const stateInterval = setInterval(() => {
      chatManager.updateOnlineStates();
    }, 15000);

    return () => {
      unsubscribe();
      clearInterval(stateInterval);
    };
  }, []);

  // Monitor incoming admin messages to show a prominent overlay/toast
  useEffect(() => {
    if (session && session.messages.length > 0) {
      const adminMessages = session.messages.filter(m => m.sender === 'admin');
      if (adminMessages.length > 0) {
        const lastAdminMsg = adminMessages[adminMessages.length - 1];
        if (!lastAdminMsg.read) {
          setLastAdminMessage(lastAdminMsg.text);
          if (!isOpen) {
            setShowAdminToast(true);
          }
        }
      }
    }
  }, [session?.messages, isOpen]);

  // Close toast when widget is opened
  useEffect(() => {
    if (isOpen) {
      setShowAdminToast(false);
    }
  }, [isOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Count unread admin messages when widget is closed
    if (session && !isOpen) {
      const unread = session.messages.filter(m => m.sender === 'admin' && !m.read).length;
      setUnreadCount(unread);
    } else if (isOpen && session) {
      setUnreadCount(0);
      chatManager.markAsRead(session.sessionId);
    }
  }, [session?.messages, isOpen]);

  const handleRegisterName = (e: FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      chatManager.registerVisitorName(nameInput.trim(), phoneInput.trim());
    }
  };

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() && session) {
      chatManager.sendMessage(session.sessionId, 'visitor', messageInput.trim());
      setMessageInput('');
    }
  };

  const handleChatToggle = () => {
    setIsOpen(!isOpen);
  };

  if (!session) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans" id="chat-widget-root">
      {/* Speech Bubble / Toast for Admin Messages */}
      <AnimatePresence>
        {!isOpen && showAdminToast && lastAdminMessage && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            className="absolute bottom-18 right-0 w-[280px] bg-neutral-900 border border-neutral-800 text-white rounded-xl p-4 shadow-2xl flex flex-col gap-2.5 z-50 font-sans"
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5">
              <span className="text-[10px] uppercase font-bold text-brand-orange tracking-widest font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-pulse"></span>
                Atendimento Esquadrijampa
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAdminToast(false);
                }}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <p className="text-xs text-neutral-200 leading-relaxed font-medium bg-neutral-950/40 p-2.5 rounded border border-neutral-800">
              "{lastAdminMessage}"
            </p>
            
            <button
              onClick={() => {
                setIsOpen(true);
                setShowAdminToast(false);
              }}
              className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white text-[10px] font-bold uppercase py-1.5 rounded tracking-wider transition-colors text-center cursor-pointer"
            >
              Responder ao vivo
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Launcher Button */}
      <motion.button
        onClick={handleChatToggle}
        id="chat-toggle-button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl cursor-pointer relative transition-colors duration-200 ${
          isOpen ? 'bg-neutral-800 text-white' : 'bg-brand-orange text-white'
        }`}
      >
        {isOpen ? <ChevronDown className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        
        {/* Unread Message Badge */}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center animate-bounce border-2 border-white">
            {unreadCount}
          </span>
        )}
      </motion.button>

      {/* Expandable Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chat-window-container"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="absolute bottom-18 right-0 w-[350px] sm:w-[380px] max-h-[520px] h-[520px] bg-white rounded-xl shadow-2xl border border-neutral-200/80 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-neutral-900 px-4 py-3.5 flex justify-between items-center text-white border-b border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center text-brand-orange">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-tight text-white">Suporte Esquadrijampa</h3>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                    Atendimento Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-white p-1 hover:bg-neutral-800 rounded transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Conversation Area */}
            <div className="flex-1 overflow-y-auto bg-neutral-50 p-4 space-y-4">
              {!session.isRegistered ? (
                /* Registration Screen */
                <div className="h-full flex flex-col justify-center items-center text-center space-y-5 px-3">
                  <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 mb-1 border border-neutral-200">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-neutral-800">Olá! Quer falar com um atendente?</h4>
                    <p className="text-xs text-neutral-500 max-w-xs">
                      Estamos prontos para tirar suas dúvidas sobre projetos, esquadrias e fachadas em alumínio.
                    </p>
                  </div>

                  <form onSubmit={handleRegisterName} className="w-full space-y-2">
                    <input
                      type="text"
                      required
                      placeholder="Qual o seu nome?"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full text-xs text-neutral-800 bg-white border border-neutral-300 rounded p-2.5 focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange text-center"
                    />
                    <input
                      type="tel"
                      placeholder="WhatsApp / Telefone"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="w-full text-xs text-neutral-800 bg-white border border-neutral-300 rounded p-2.5 focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange text-center"
                    />
                    <button
                      type="submit"
                      className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white py-2 px-4 rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Iniciar Atendimento
                    </button>
                  </form>

                  <p className="text-[10px] text-neutral-400">
                    *Seus dados de navegação ajudam no atendimento.
                  </p>
                </div>
              ) : (
                /* Chat Messages Stream */
                <div className="space-y-3.5">
                  <div className="bg-brand-orange/5 border border-brand-orange/15 rounded-lg p-3 text-[11px] text-neutral-600 space-y-1">
                    <div className="flex items-center gap-1.5 text-brand-orange font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Modo Demonstração</span>
                    </div>
                    <p>
                      Você está conectado como <strong>{session.visitorName}</strong>. Abra o Painel do Administrador em outra guia para enviar mensagens ao vivo para este chat!
                    </p>
                  </div>

                  {session.messages.length === 0 && (
                    <div className="text-center text-xs text-neutral-400 py-8">
                      Envie uma mensagem abaixo para falar com nossa equipe técnica de esquadrias de alumínio.
                    </div>
                  )}

                  {session.messages.map((msg) => {
                    const isSystem = msg.sender === 'system';
                    const isAdmin = msg.sender === 'admin';

                    if (isSystem) {
                      return (
                        <div key={msg.id} className="flex justify-center my-2">
                          <span className="bg-neutral-200/65 text-neutral-600 text-[10px] px-3 py-1 rounded-full text-center max-w-[85%] font-medium">
                            {msg.text}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-3.5 py-2.5 text-xs shadow-sm leading-relaxed ${
                            isAdmin
                              ? 'bg-neutral-800 text-white rounded-bl-none'
                              : 'bg-brand-orange text-white rounded-br-none'
                          }`}
                        >
                          <p>{msg.text}</p>
                          <span className={`block text-[8px] text-right mt-1.5 opacity-70 ${isAdmin ? 'text-neutral-300' : 'text-neutral-100'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Form Footer */}
            {session.isRegistered && (
              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-neutral-200/80 flex items-center gap-2">
                <input
                  type="text"
                  required
                  placeholder="Escreva sua mensagem..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 text-xs text-neutral-800 bg-neutral-100 border border-neutral-200 rounded-full px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-orange focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white transition-colors cursor-pointer shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
