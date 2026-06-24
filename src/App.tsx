/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Phone } from 'lucide-react';
import { ActivePage } from './types';
import { CONTACT_INFO } from './data';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeSection from './components/HomeSection';
import EsquadriasSection from './components/EsquadriasSection';
import FachadasSection from './components/FachadasSection';
import BrisesSection from './components/BrisesSection';
import VidrosSection from './components/VidrosSection';
import PortfolioSection from './components/PortfolioSection';
import SobreNosSection from './components/SobreNosSection';
import ContatoSection from './components/ContatoSection';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>(ActivePage.Home);

  // Prevent browser scroll restoration and force scroll to top on mount
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  // Force scroll to top on section transitions
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activePage]);

  const renderSection = () => {
    switch (activePage) {
      case ActivePage.Home:
        return <HomeSection setActivePage={setActivePage} />;
      case ActivePage.Esquadrias:
        return <EsquadriasSection setActivePage={setActivePage} />;
      case ActivePage.Fachadas:
        return <FachadasSection setActivePage={setActivePage} />;
      case ActivePage.Brises:
        return <BrisesSection setActivePage={setActivePage} />;
      case ActivePage.Vidros:
        return <VidrosSection setActivePage={setActivePage} />;
      case ActivePage.Portfolio:
        return <PortfolioSection />;
      case ActivePage.SobreNos:
        return <SobreNosSection />;
      case ActivePage.Contato:
        return <ContatoSection />;
      default:
        return <HomeSection setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white selection:bg-brand-orange/30 selection:text-brand-charcoal">
      <div>
        {/* Navigation Header */}
        <Navbar activePage={activePage} setActivePage={setActivePage} />

        {/* Dynamic Main Content area with page transition animations */}
        <main id="main-content-area" className={activePage === ActivePage.Home ? '' : 'pt-20'}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Footer */}
      <Footer setActivePage={setActivePage} />

      {/* Persistent Floating WhatsApp Pulsing Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* Quick Call Button (mobile-focused helper) */}
        <a
          href={`tel:${CONTACT_INFO.whatsapp}`}
          className="bg-brand-chumbo text-white p-3.5 rounded-full shadow-lg hover:bg-brand-charcoal hover:scale-105 active:scale-95 transition-all duration-300 border border-brand-orange/40 flex items-center justify-center group"
          title="Ligar para Esquadrijampa"
          id="floating-call-btn"
        >
          <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        </a>

        {/* Pulsing Chat Button */}
        <a
          href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=Olá!%20Achei%20seu%20contato%20no%20site%20da%20Esquadrijampa%20e%20gostaria%20de%20solicitar%20um%20orçamento.`}
          target="_blank"
          rel="noopener noreferrer"
          className="relative bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center group"
          title="Falar no WhatsApp"
          id="floating-whatsapp-btn"
        >
          {/* Pulse Waves */}
          <span className="absolute inset-0 rounded-full bg-emerald-600/40 animate-ping opacity-75" />
          <MessageSquare className="w-6 h-6 relative z-10 group-hover:scale-110 transition-transform" />
        </a>
      </div>
    </div>
  );
}
