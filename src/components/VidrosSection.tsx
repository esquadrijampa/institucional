/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Shield, Check, MessageSquare, HelpCircle } from 'lucide-react';
import { ActivePage } from '../types';
import { IMAGES, CONTACT_INFO } from '../data';

interface VidrosSectionProps {
  setActivePage: (page: ActivePage) => void;
}

export default function VidrosSection({ setActivePage }: VidrosSectionProps) {
  const applications = [
    {
      title: 'Portas de Giro e Correr em Vidro',
      desc: 'Portas fabricadas totalmente em vidro temperado de 8mm ou 10mm com ferragens reforçadas em polímero, latão ou inox. Ideais para entradas de lojas, escritórios, consultórios ou divisórias de cozinhas e áreas de lazer.',
      image: IMAGES.portaDeGiroVidro,
      perks: ['Ferragens premium em inox/latão', 'Opção de puxador tubular gigante', 'Fechaduras de alta segurança', 'Dobradiças com mola de piso hidráulica']
    },
    {
      title: 'Fechamentos de Vãos e Sacadas',
      desc: 'Sistemas articulados ou de correr que isolam sacadas, varandas gourmet, áreas técnicas ou fachadas contra ventos, poluição e ruídos externos, mantendo a luminosidade e a visão panorâmica intactas.',
      image: IMAGES.vidros,
      perks: ['Garante visibilidade panorâmica 100%', 'Alta estanqueidade contra chuvas', 'Redução de ruídos urbanos', 'Fácil abertura por deslizamento']
    },
    {
      title: 'Guarda-Corpo e Box de Banheiro',
      desc: 'Guarda-corpos robustos em vidros laminados temperados fixados por pinças, botões de inox ou perfis embutidos de alumínio, seguindo rigorosamente a norma de segurança NBR 14718. Box de banheiro com roldanas aparentes de alto padrão.',
      image: IMAGES.guardaCorpo,
      perks: ['Segurança total contra quedas', 'Fixadores e pinças em inox AISI 304', 'Vidro laminado de segurança especial', 'Design minimalista sem montantes']
    }
  ];

  return (
    <div className="page-enter py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-brand-gray-mid pb-8 mb-16 text-left">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand-orange font-bold">
            Fornecimento & Instalação Premium
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-brand-charcoal mt-2">
            Vidro Temperado com Qualidade e Segurança
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600 font-sans max-w-3xl leading-relaxed">
            Unindo transparência, sofisticação e segurança em estruturas robustas de vidro temperado e laminado. Fornecemos soluções sob medida para portas de giro, fechamentos, guarda-corpos e boxes residenciais.
          </p>
        </div>

        {/* Core Value Banner */}
        <section className="bg-brand-gray-light p-8 sm:p-12 border border-brand-gray-mid rounded-sm flex flex-col md:flex-row gap-8 items-center mb-16">
          <div className="bg-white p-5 rounded-sm shadow-sm border border-brand-gray-mid shrink-0 text-brand-orange">
            <Shield className="w-12 h-12" />
          </div>
          <div>
            <h3 className="font-display text-lg sm:text-xl font-bold text-brand-charcoal mb-2">
              Por que usar o Vidro Temperado da Esquadrijampa?
            </h3>
            <p className="text-gray-600 text-sm font-sans leading-relaxed max-w-3xl">
              O vidro temperado passa por um tratamento térmico de têmpera, tornando-se até 5 vezes mais resistente a impactos do que o vidro comum. Em caso de quebra acidental, ele se fragmenta em pequenos pedaços arredondados e pouco cortantes, minimizando significativamente qualquer risco de ferimentos.
            </p>
          </div>
        </section>

        {/* Applications Catalog */}
        <div className="space-y-16">
          {applications.map((app, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <motion.div
                key={app.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-brand-gray-light pb-16 last:border-0 last:pb-0`}
                id={`vidro-app-${idx}`}
              >
                <div className={`lg:col-span-5 ${isEven ? 'order-first' : 'order-first lg:order-last'}`}>
                  <div className="relative border border-brand-gray-mid rounded-sm overflow-hidden h-80 shadow-md">
                    <img
                      src={app.image}
                      alt={app.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-brand-charcoal mb-4">
                    {app.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-sans mb-6">
                    {app.desc}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {app.perks.map((perk) => (
                      <div key={perk} className="flex items-center gap-2.5 text-xs text-gray-700 font-sans">
                        <Check className="w-4 h-4 text-brand-orange shrink-0" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="mt-20 pt-12 border-t border-brand-gray-mid text-center">
          <h3 className="font-display text-xl font-bold text-brand-charcoal mb-4">
            Deseja um orçamento personalizado de Vidros Temperados?
          </h3>
          <p className="text-gray-600 text-xs sm:text-sm font-sans mb-8 max-w-xl mx-auto leading-relaxed">
            Envie as dimensões e especificações técnicas da sua obra. Atendemos arquitetos, construtoras e proprietários particulares com vistorias no local.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => {
                setActivePage(ActivePage.Contato);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-brand-chumbo text-white px-6 py-3.5 rounded-sm font-sans text-xs font-semibold uppercase tracking-wider hover:bg-brand-charcoal transition-colors shadow-sm"
            >
              Solicitar Orçamento de Vidros
            </button>
            <a
              href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=Olá,%20gostaria%20de%20um%20orçamento%20de%20vidros%20temperados%20para%20minha%20obra.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3.5 rounded-sm font-sans text-xs font-semibold uppercase tracking-wider hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              Chamar WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
