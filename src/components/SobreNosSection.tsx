/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Award, Users, Heart, CheckCircle2 } from 'lucide-react';
import { ABOUT_TEXT, IMAGES } from '../data';

export default function SobreNosSection() {
  const icons = [
    <Award key="award" className="w-6 h-6 text-brand-orange" />,
    <Users key="users" className="w-6 h-6 text-brand-orange" />,
    <Heart key="heart" className="w-6 h-6 text-brand-orange" />,
  ];

  return (
    <div className="page-enter py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-brand-gray-mid pb-8 mb-16 text-left">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand-orange font-bold">
            Conheça Nossa História
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-brand-charcoal mt-2">
            A Esquadrijampa
          </h1>
        </div>

        {/* Inception & Description */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24" id="sobrenos-intro">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-charcoal tracking-tight">
              Transformando Projetos e Valorizando Arquiteturas
            </h2>
            
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-sans">
              {ABOUT_TEXT.history}
            </p>
            
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-sans">
              {ABOUT_TEXT.mission}
            </p>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-sans">
              {ABOUT_TEXT.commitment}
            </p>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-brand-chumbo font-sans">Insumos Homologados</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-brand-chumbo font-sans">Atendimento Completo</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-brand-chumbo font-sans">Garantia e Pós-Venda</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-brand-chumbo font-sans">Serralheria Própria</span>
              </div>
            </div>
          </div>

          {/* Side Image */}
          <div className="lg:col-span-5">
            <div className="relative border border-brand-gray-mid rounded-sm overflow-hidden h-[450px] shadow-lg">
              <img
                src={IMAGES.hero}
                alt="Processo de fabricação de esquadrias - Esquadrijampa"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white font-mono text-[10px] tracking-wider uppercase bg-brand-charcoal/95 px-3 py-1.5 border border-brand-orange/30">
                PROJETO A ENTREGA FINALIZADA
              </div>
            </div>
          </div>
        </section>

        {/* Corporate Pillars */}
        <section className="bg-brand-gray-light p-8 sm:p-12 border border-brand-gray-mid rounded-sm" id="sobrenos-pilares">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="font-display text-xs uppercase tracking-[0.2em] text-brand-orange font-bold">
              Nossos Pilares de Atuação
            </h3>
            <p className="mt-2 font-display text-2xl font-bold tracking-tight text-brand-charcoal">
              Valores que são nosso combustível, sem ele não existimos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ABOUT_TEXT.values.map((value, idx) => (
              <div
                key={value.title}
                className="bg-white p-6 border border-brand-gray-mid rounded-sm shadow-sm"
                id={`value-pillar-${idx}`}
              >
                <div className="bg-brand-gray-light w-12 h-12 rounded-sm border border-brand-gray-mid flex items-center justify-center mb-5">
                  {icons[idx] || <CheckCircle2 className="w-6 h-6 text-brand-orange" />}
                </div>
                <h4 className="font-display text-base font-bold text-brand-charcoal mb-2">
                  {value.title}
                </h4>
                <p className="text-gray-500 text-xs leading-relaxed font-sans">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
