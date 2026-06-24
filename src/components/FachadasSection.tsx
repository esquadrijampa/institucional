/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Layers, Building, Check, ArrowRight } from 'lucide-react';
import { ActivePage } from '../types';
import { IMAGES } from '../data';

interface FachadasSectionProps {
  setActivePage: (page: ActivePage) => void;
}

export default function FachadasSection({ setActivePage }: FachadasSectionProps) {
  return (
    <div className="page-enter py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-brand-gray-mid pb-8 mb-16 text-left">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand-orange font-bold">
            Pele de Vidro & Revestimento em ACM
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-brand-charcoal mt-2">
            Fachadas que Marcam Presença
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600 font-sans max-w-3xl leading-relaxed">
            Estruturas imponentes projetadas para proporcionar isolamento térmico, estanqueidade e altíssima valorização estética para edificações comerciais e residenciais de alto padrão.
          </p>
        </div>

        {/* Section - Pele de Vidro */}
        <section className="mb-24" id="fachada-pele-vidro">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left side text details */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 mb-4">
                <Building className="w-5 h-5 text-brand-orange" />
                <span className="font-display text-sm font-bold uppercase tracking-wider text-brand-chumbo">
                  Pele de Vidro (Structural Glazing)
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-charcoal mb-6">
                Luminosidade natural e leveza estrutural
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-sans mb-8">
                As fachadas cortina, ou pele de vidro, ocultam os perfis de alumínio pelo lado externo, exibindo uma superfície vitrificada contínua. Trabalhamos com os dois principais modelos de mercado:
              </p>

              {/* Models Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-brand-gray-light p-6 rounded-sm border border-brand-gray-mid">
                  <h3 className="font-display text-base font-bold text-brand-charcoal mb-2">
                    Sistema Stick (Grelha)
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed font-sans">
                    A montagem da estrutura de alumínio é feita inteiramente no local da obra, com a posterior fixação das placas de vidro. Ideal para grandes áreas, permitindo ajustes milimétricos e encaixes estruturais refinados.
                  </p>
                </div>
                <div className="bg-brand-gray-light p-6 rounded-sm border border-brand-gray-mid">
                  <h3 className="font-display text-base font-bold text-brand-charcoal mb-2">
                    Sistema Unitizado
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed font-sans">
                    Os módulos de alumínio e vidro já chegam prontos e selados de fábrica. A instalação no local é feita por içamento, garantindo velocidade recorde e alto controle de qualidade industrial nas vedações.
                  </p>
                </div>
              </div>

              {/* Features list */}
              <ul className="space-y-2.5">
                <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 font-sans">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Vedação avançada contra infiltrações de ar e água.</span>
                </li>
                <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 font-sans">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Opção de vidros laminados, temperados e refletivos (controle solar).</span>
                </li>
                <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 font-sans">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Conforto térmico incomparável, reduzindo uso de ar-condicionado.</span>
                </li>
              </ul>
            </div>

            {/* Right side image */}
            <div className="lg:col-span-5">
              <div className="relative border border-brand-gray-mid rounded-sm overflow-hidden shadow-md">
                <img
                  src={IMAGES.peleDeVidro}
                  alt="Instalação de Pele de Vidro - Esquadrijampa"
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 bg-brand-charcoal/90 text-white text-[10px] font-mono tracking-wider py-1.5 px-3 uppercase border border-brand-orange/40 rounded-sm">
                  PELE DE VIDRO INSTALADA
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section - Fachada em ACM */}
        <section className="border-t border-brand-gray-mid pt-20" id="fachada-acm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left side image */}
            <div className="lg:col-span-5 order-last lg:order-first">
              <div className="relative border border-brand-gray-mid rounded-sm overflow-hidden shadow-md">
                <img
                  src={IMAGES.fachadaAcm}
                  alt="Fachada em Painéis de ACM - Esquadrijampa"
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-brand-charcoal/90 text-white text-[10px] font-mono tracking-wider py-1.5 px-3 uppercase border border-brand-orange/40 rounded-sm">
                  REVESTIMENTO EM ACM
                </div>
              </div>
            </div>

            {/* Right side text details */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-brand-orange" />
                <span className="font-display text-sm font-bold uppercase tracking-wider text-brand-chumbo">
                  Alumínio Composto (ACM)
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-charcoal mb-6">
                Design moderno e sofisticação durável
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-sans mb-8">
                Os painéis de ACM são formados por duas chapas de alumínio com um núcleo de polietileno de baixa densidade. Essa tecnologia resulta em um revestimento plano, rígido e extremamente leve, ideal para renovação de fachadas (retrofit) ou novas obras arquitetônicas de alto padrão.
              </p>

              {/* ACM Perks */}
              <div className="space-y-6 mb-8 font-sans">
                <div className="flex items-start gap-3">
                  <div className="bg-brand-orange/10 p-2.5 rounded-sm shrink-0 border border-brand-orange/20 mt-1">
                    <span className="text-xs text-brand-orange font-bold font-mono">01</span>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-brand-charcoal mb-1">Incomparável Durabilidade</h4>
                    <p className="text-gray-500 text-xs">As chapas possuem pintura PVDF ou poliéster de alta resistência, suportando raios UV, variações de temperatura e intempéries sem perder o brilho ou descascar.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-brand-orange/10 p-2.5 rounded-sm shrink-0 border border-brand-orange/20 mt-1">
                    <span className="text-xs text-brand-orange font-bold font-mono">02</span>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-brand-charcoal mb-1">Flexibilidade e Formas Geométricas</h4>
                    <p className="text-gray-500 text-xs">Pode ser dobrado, usinado ou calandrado para acompanhar as curvas e ângulos mais ousados do projeto executivo da sua obra.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-brand-orange/10 p-2.5 rounded-sm shrink-0 border border-brand-orange/20 mt-1">
                    <span className="text-xs text-brand-orange font-bold font-mono">03</span>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-brand-charcoal mb-1">Aplicações Comerciais e Residenciais</h4>
                    <p className="text-gray-500 text-xs">Utilizado em portais de lojas, revestimento de vigas e pilares, totens, marquises e em paredes inteiras de residências contemporâneas.</p>
                  </div>
                </div>
              </div>

              {/* Contact Redirect CTA */}
              <button
                onClick={() => {
                  setActivePage(ActivePage.Contato);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 bg-brand-orange text-white px-6 py-3 rounded-sm font-sans text-xs font-semibold uppercase tracking-wider hover:bg-brand-orange-hover transition-colors shadow-sm"
              >
                Orçar Fachada Personalizada
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
