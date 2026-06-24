/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Hammer, Shield, Ruler, ArrowRight, MessageSquare } from 'lucide-react';
import { ActivePage } from '../types';
import { DIFFERENTIALS, HIGHLIGHT_SERVICES, PORTFOLIO_ITEMS, CONTACT_INFO, IMAGES } from '../data';

interface HomeSectionProps {
  setActivePage: (page: ActivePage) => void;
}

export default function HomeSection({ setActivePage }: HomeSectionProps) {
  // Map icons dynamically
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Hammer':
        return <Hammer className="w-8 h-8 text-brand-orange" />;
      case 'Shield':
        return <Shield className="w-8 h-8 text-brand-orange" />;
      case 'Ruler':
        return <Ruler className="w-8 h-8 text-brand-orange" />;
      default:
        return <Hammer className="w-8 h-8 text-brand-orange" />;
    }
  };

  return (
    <div className="page-enter">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-brand-charcoal text-white" id="home-hero">
        <div className="absolute inset-0 z-0">
          <img
            src={IMAGES.hero}
            alt="Esquadrias de Alumínio de Alto Padrão - Esquadrijampa"
            className="w-full h-full object-cover opacity-45 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-3"
          >
            <span className="font-mono text-xs uppercase tracking-[0.3em] bg-brand-orange text-white px-3 py-1 font-semibold">
              Fabricação Própria & Instalação
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight max-w-4xl"
            id="hero-headline"
          >
            Esquadrias de Alumínio que Transformam Projetos
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-gray-200 max-w-2xl font-sans font-light leading-relaxed"
            id="hero-subheadline"
          >
            Fabricação e instalação de esquadrias, brises, ripados, fachada em ACM e pele de vidro — do projeto à obra finalizada.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={() => {
                setActivePage(ActivePage.Contato);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-brand-orange text-white px-8 py-4 rounded-sm font-sans font-semibold uppercase tracking-wider text-sm hover:bg-brand-orange-hover transition-all duration-300 shadow-lg"
              id="hero-cta-primary"
            >
              Solicitar Orçamento
            </button>
            <button
              onClick={() => {
                setActivePage(ActivePage.Portfolio);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-transparent text-white px-8 py-4 rounded-sm font-sans font-semibold uppercase tracking-wider text-sm border-2 border-white/60 hover:bg-white/10 hover:border-white transition-all duration-300"
              id="hero-cta-secondary"
            >
              Ver Portfólio
            </button>
          </motion.div>
        </div>
      </section>

      {/* Diferenciais Section */}
      <section className="py-20 bg-white" id="diferenciais">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-xs uppercase tracking-[0.2em] text-brand-orange font-bold">
              Por que nos escolher?
            </h2>
            <p className="mt-2 font-display text-3xl font-bold tracking-tight text-brand-charcoal">
              Compromisso com o Padrão de Entrega
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {DIFFERENTIALS.map((diff, index) => (
              <motion.div
                key={diff.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-brand-gray-light p-8 rounded-sm border border-brand-gray-mid hover:shadow-md transition-shadow flex flex-col items-start"
                id={`diff-card-${diff.id}`}
              >
                <div className="bg-white p-4 rounded-sm shadow-sm border border-brand-gray-mid mb-6 shrink-0">
                  {getIcon(diff.iconName)}
                </div>
                <h3 className="font-display text-lg font-bold text-brand-charcoal mb-3">
                  {diff.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed font-sans">
                  {diff.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Serviços em Destaque Section */}
      <section className="py-20 bg-brand-gray-light" id="servicos-destaque">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-xs uppercase tracking-[0.2em] text-brand-orange font-bold">
              Nossos Serviços
            </h2>
            <p className="mt-2 font-display text-3xl font-bold tracking-tight text-brand-charcoal">
              Soluções Completas em Alumínio e Vidro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {HIGHLIGHT_SERVICES.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white rounded-sm overflow-hidden border border-brand-gray-mid group hover:shadow-lg transition-all"
                id={`service-highlight-${service.id}`}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="font-mono text-[9px] tracking-widest text-brand-orange uppercase bg-black/40 px-2 py-1 rounded-sm">
                      {service.page === ActivePage.Esquadrias ? 'Esquadrias' : service.page === ActivePage.Fachadas ? 'Fachadas' : service.page === ActivePage.Brises ? 'Proteção Solar' : 'Vidros'}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-display text-lg font-bold text-brand-charcoal mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 font-sans h-12 overflow-hidden line-clamp-2">
                    {service.description}
                  </p>
                  <button
                    onClick={() => {
                      setActivePage(service.page);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-orange uppercase tracking-wider group-hover:text-brand-orange-hover transition-colors"
                  >
                    Saber Mais
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfólio em Destaque Section */}
      <section className="py-20 bg-white" id="portfolio-destaque">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <h2 className="font-display text-xs uppercase tracking-[0.2em] text-brand-orange font-bold">
                Trabalhos Executados
              </h2>
              <p className="mt-2 font-display text-3xl font-bold tracking-tight text-brand-charcoal">
                Nosso Portfólio em Destaque
              </p>
            </div>
            <button
              onClick={() => {
                setActivePage(ActivePage.Portfolio);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-brand-chumbo text-white px-6 py-3 rounded-sm font-sans text-xs font-semibold uppercase tracking-wider hover:bg-brand-charcoal transition-colors shadow-sm"
              id="view-all-portfolio"
            >
              Ver Portfólio Completo
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PORTFOLIO_ITEMS.slice(0, 4).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onClick={() => {
                  setActivePage(ActivePage.Portfolio);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group relative h-80 rounded-sm overflow-hidden cursor-pointer"
                id={`portfolio-preview-${project.id}`}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col justify-end h-full">
                  <span className="font-mono text-[9px] tracking-widest text-brand-orange uppercase mb-1">
                    {project.subCategory}
                  </span>
                  <h4 className="font-display text-base font-bold text-white leading-snug group-hover:text-brand-orange transition-colors">
                    {project.title}
                  </h4>
                  <p className="text-xs text-gray-300 font-sans mt-2 line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    {project.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="relative py-24 bg-brand-chumbo text-white overflow-hidden" id="home-cta-bottom">
        <div className="absolute inset-0 z-0">
          <img
            src={IMAGES.brisesRipados}
            alt="Brises e Ripados de Alumínio"
            className="w-full h-full object-cover opacity-15 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-brand-charcoal/80" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mb-6">
            Vamos transformar seu projeto?
          </h2>
          <p className="text-gray-300 text-base sm:text-lg mb-10 max-w-2xl mx-auto font-sans leading-relaxed">
            Solicite um orçamento sem compromisso. Atendemos obras de alto padrão com soluções personalizadas e fabricação própria de esquadrias e vidros.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=Olá,%20gostaria%20de%20solicitar%20um%20orçamento%20para%20minha%20obra.%20Vi%20o%20site%20da%20Esquadrijampa.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-sm font-sans font-semibold uppercase tracking-wider text-sm hover:bg-emerald-700 transition-colors shadow-md"
              id="cta-bottom-whatsapp"
            >
              <MessageSquare className="w-5 h-5" />
              Fale no WhatsApp
            </a>
            <button
              onClick={() => {
                setActivePage(ActivePage.Contato);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-brand-orange text-white px-8 py-4 rounded-sm font-sans font-semibold uppercase tracking-wider text-sm hover:bg-brand-orange-hover transition-colors shadow-md border border-transparent"
              id="cta-bottom-form"
            >
              Preencher Formulário
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
