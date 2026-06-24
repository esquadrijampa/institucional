/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, X, Filter, Sparkles, Building, Layers, Shield } from 'lucide-react';
import { PORTFOLIO_ITEMS, CONTACT_INFO } from '../data';
import { PortfolioItem } from '../types';

export default function PortfolioSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null);

  const categories = [
    { id: 'todos', label: 'Todos os Projetos' },
    { id: 'janelas', label: 'Janelas' },
    { id: 'portas', label: 'Portas' },
    { id: 'fachadas', label: 'Fachadas' },
    { id: 'brises', label: 'Brises & Ripados' },
    { id: 'vidros', label: 'Vidros' },
  ];

  // Logic to filter items
  const filteredItems = PORTFOLIO_ITEMS.filter((item) => {
    if (selectedCategory === 'todos') return true;
    if (selectedCategory === 'janelas') {
      return item.title.toLowerCase().includes('janela') || item.subCategory.toLowerCase().includes('janela') || item.subCategory.toLowerCase().includes('correr');
    }
    if (selectedCategory === 'portas') {
      return item.title.toLowerCase().includes('porta') || item.subCategory.toLowerCase().includes('porta');
    }
    if (selectedCategory === 'fachadas') {
      return item.category === 'fachadas' || item.title.toLowerCase().includes('acm') || item.title.toLowerCase().includes('pele');
    }
    if (selectedCategory === 'brises') {
      return item.category === 'brises' || item.title.toLowerCase().includes('ripado') || item.title.toLowerCase().includes('brise') || item.title.toLowerCase().includes('muxarabi');
    }
    if (selectedCategory === 'vidros') {
      return item.category === 'vidros' || item.title.toLowerCase().includes('vidro');
    }
    return true;
  });

  return (
    <div className="page-enter py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="border-b border-brand-gray-mid pb-8 mb-12 text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand-orange font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Qualidade Executada
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-brand-charcoal mt-2">
              Nossos Projetos
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-600 font-sans leading-relaxed">
              Cada obra executada conta uma história de precisão técnica e requinte estético. Explore nossa galeria de projetos concluídos sob medida.
            </p>
          </div>
          <div className="text-gray-400 text-xs font-mono shrink-0">
            {filteredItems.length} PROJETOS ENCONTRADOS
          </div>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-12" id="portfolio-filters">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-2 flex items-center gap-1.5 font-sans">
            <Filter className="w-3.5 h-3.5" /> Filtrar por:
          </span>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-sm font-sans text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-brand-orange text-white shadow-sm'
                  : 'bg-brand-gray-light text-gray-600 hover:text-brand-charcoal hover:bg-brand-gray-mid'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16" id="portfolio-grid">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="group cursor-pointer bg-brand-gray-light border border-brand-gray-mid rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all"
                onClick={() => setActiveItem(item)}
                id={`portfolio-item-${item.id}`}
              >
                {/* Image Container with Eye Hover icon */}
                <div className="relative h-72 overflow-hidden bg-brand-charcoal">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-brand-charcoal/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <div className="bg-white/95 p-3 rounded-sm shadow-md text-brand-charcoal transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <Eye className="w-5 h-5 text-brand-orange" />
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="font-mono text-[9px] font-bold tracking-widest text-brand-orange bg-brand-charcoal/90 border border-brand-orange/20 px-2.5 py-1 uppercase rounded-sm">
                      {item.subCategory}
                    </span>
                  </div>
                </div>

                {/* Text details */}
                <div className="p-6">
                  <span className="font-mono text-[9px] tracking-[0.2em] text-gray-500 uppercase block mb-1">
                    {item.category === 'esquadrias' ? 'Esquadria de Alumínio' : item.category === 'fachadas' ? 'Pele de Vidro / ACM' : item.category === 'brises' ? 'Brises & Ripados' : 'Vidro Temperado'}
                  </span>
                  <h3 className="font-display text-base font-bold text-brand-charcoal mb-2 leading-snug group-hover:text-brand-orange transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-xs font-sans leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {activeItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-brand-charcoal/90 backdrop-blur-sm" id="portfolio-lightbox">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white max-w-4xl w-full rounded-sm overflow-hidden shadow-2xl relative border border-brand-gray-mid"
              >
                {/* Close Button */}
                <button
                  onClick={() => setActiveItem(null)}
                  className="absolute top-4 right-4 bg-brand-charcoal/90 text-white p-2.5 rounded-sm hover:bg-brand-orange transition-colors z-10"
                  aria-label="Fechar Modal"
                  id="lightbox-close-btn"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Left Column Image */}
                  <div className="h-80 md:h-[500px] bg-brand-charcoal relative">
                    <img
                      src={activeItem.image}
                      alt={activeItem.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Right Column Details */}
                  <div className="p-8 flex flex-col justify-between h-full bg-white">
                    <div className="space-y-6">
                      <div>
                        <span className="font-mono text-xs text-brand-orange uppercase tracking-[0.25em] font-semibold">
                          {activeItem.subCategory}
                        </span>
                        <h2 className="font-display text-2xl font-bold text-brand-charcoal mt-1 leading-tight">
                          {activeItem.title}
                        </h2>
                      </div>

                      <div className="border-t border-brand-gray-mid pt-4">
                        <h4 className="font-display text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                          Detalhes Executivos
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed font-sans">
                          {activeItem.description}
                        </p>
                      </div>

                      <div className="bg-brand-gray-light p-4 rounded-sm border border-brand-gray-mid">
                        <h4 className="font-display text-xs font-bold text-brand-charcoal mb-2 flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-brand-orange" /> Parâmetros Técnicos
                        </h4>
                        <p className="text-gray-500 text-[11px] leading-relaxed font-sans">
                          Montagem realizada seguindo as normas técnicas ABNT, com perfis estruturais em ligas de alumínio anodizado/pintado e acessórios de alta durabilidade e vedação.
                        </p>
                      </div>
                    </div>

                    {/* CTA on Lightbox */}
                    <div className="mt-8 pt-6 border-t border-brand-gray-mid flex flex-col sm:flex-row gap-3">
                      <a
                        href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=Olá,%20vi%20o%20projeto%20"${activeItem.title}"%20no%20portfólio%20do%20site%20da%20Esquadrijampa%20e%20gostaria%20de%20um%20orçamento%20semelhante.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center bg-emerald-600 text-white py-3 rounded-sm font-sans text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition-colors"
                      >
                        Fale no WhatsApp
                      </a>
                      <button
                        onClick={() => {
                          setActiveItem(null);
                          // Trigger redirect to contact page
                        }}
                        className="flex-1 bg-brand-chumbo text-white py-3 rounded-sm font-sans text-xs font-bold uppercase tracking-wider hover:bg-brand-charcoal transition-colors border border-transparent"
                      >
                        Voltar à Galeria
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
