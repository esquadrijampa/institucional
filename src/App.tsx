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

const PAGE_META_MAP: Record<ActivePage, { title: string; path: string }> = {
  [ActivePage.Home]: { title: 'Esquadrijampa - Home', path: '/' },
  [ActivePage.Esquadrias]: { title: 'Esquadrijampa - Esquadrias de Alumínio', path: '/esquadrias' },
  [ActivePage.Fachadas]: { title: 'Esquadrijampa - Fachadas de Vidro e ACM', path: '/fachadas' },
  [ActivePage.Brises]: { title: 'Esquadrijampa - Brises e Venezianas', path: '/brises' },
  [ActivePage.Vidros]: { title: 'Esquadrijampa - Vidros Comuns e Temperados', path: '/vidros' },
  [ActivePage.Portfolio]: { title: 'Esquadrijampa - Nosso Portfólio', path: '/portfolio' },
  [ActivePage.SobreNos]: { title: 'Esquadrijampa - Sobre Nós', path: '/sobre-nos' },
  [ActivePage.Contato]: { title: 'Esquadrijampa - Fale Conosco', path: '/contato' },
};

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>(ActivePage.Home);

  // Prevent browser scroll restoration and force scroll to top on mount
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  // Global GTM dataLayer Click Listener
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      // Find the closest clickable element (button, link, or elements with role="button")
      const clickableElement = target.closest<HTMLElement>('a, button, [role="button"]');
      if (!clickableElement) return;

      // Determine click text
      let clickText = clickableElement.textContent?.trim() || '';
      
      // Fallback to title/alt/aria-label if no direct text (e.g. image buttons or icon-only buttons)
      if (!clickText) {
        clickText = 
          clickableElement.getAttribute('aria-label') || 
          clickableElement.getAttribute('title') || 
          clickableElement.querySelector('img')?.getAttribute('alt') || 
          clickableElement.querySelector('svg')?.getAttribute('title') || 
          clickableElement.getAttribute('id') ||
          '';
      }
      
      // Clean up whitespace/newlines from text
      clickText = clickText.replace(/\s+/g, ' ').trim();

      // Determine click ID
      const clickId = clickableElement.id || '';

      // Determine click URL
      const clickUrl = clickableElement.getAttribute('href') || '';

      // Determine click category based on semantic parents
      let clickCategory = 'cta'; // Default fallback category

      if (clickableElement.closest('nav') || clickableElement.closest('#navbar') || clickableElement.closest('.navbar')) {
        clickCategory = 'navbar';
      } else if (clickableElement.closest('footer') || clickableElement.closest('#footer') || clickableElement.closest('.footer')) {
        clickCategory = 'footer';
      } else if (clickId === 'floating-whatsapp-btn' || clickId === 'floating-call-btn') {
        clickCategory = 'floating_buttons';
      } else if (clickableElement.closest('#contact') || clickableElement.closest('#contato') || clickableElement.closest('.contato-section') || clickableElement.closest('form')) {
        clickCategory = 'contato_section';
      } else if (clickableElement.closest('header')) {
        clickCategory = 'header';
      }

      // Push mapped details to Google Tag Manager dataLayer
      const dataLayer = (window as any).dataLayer || [];
      dataLayer.push({
        event: 'click_botaomapeado',
        click_text: clickText,
        click_id: clickId,
        click_url: clickUrl,
        click_category: clickCategory,
        click_classes: clickableElement.className || '',
        page_path: window.location.pathname + window.location.hash,
      });
    };

    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  // Synchronize hash with activePage state
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const matchedPage = Object.values(ActivePage).find(
        (page) => page.toLowerCase() === hash
      );
      if (matchedPage) {
        setActivePage(matchedPage);
      } else if (!hash || hash === '') {
        setActivePage(ActivePage.Home);
      }
    };

    // Run on initial load
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Update hash when activePage changes, force scroll to top, and push virtual pageview to GTM
  useEffect(() => {
    const currentHash = window.location.hash.replace('#', '').toLowerCase();
    if (activePage === ActivePage.Home) {
      if (currentHash !== '') {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    } else {
      if (currentHash !== activePage.toLowerCase()) {
        window.history.pushState(null, '', `#${activePage}`);
      }
    }
    window.scrollTo(0, 0);

    // Push virtual pageview event for seamless Google Tag Manager and GA4 tracking
    const meta = PAGE_META_MAP[activePage];
    if (meta) {
      const dataLayer = (window as any).dataLayer || [];
      dataLayer.push({
        event: 'virtual_pageview',
        page_path: meta.path,
        page_title: meta.title,
      });
    }
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
