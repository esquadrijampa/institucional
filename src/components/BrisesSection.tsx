/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Sun, ShieldAlert, Check, MessageSquare } from 'lucide-react';
import { ActivePage } from '../types';
import { IMAGES, CONTACT_INFO } from '../data';

interface BrisesSectionProps {
  setActivePage: (page: ActivePage) => void;
}

export default function BrisesSection({ setActivePage }: BrisesSectionProps) {
  const items = [
    {
      id: 'brises',
      title: 'Brises de Alumínio (Fixos & Móveis)',
      desc: 'Elemento arquitetônico de alto padrão, ideal para controle de insolação direta sem bloquear a ventilação. Os brises fixos oferecem angulação permanente calculada com base na posição solar. Os brises móveis permitem regulagem manual ou motorizada das aletas.',
      features: [
        'Aletas reguláveis ou fixas',
        'Economia de energia com climatização',
        'Controle preciso de luminosidade',
        'Resistência estrutural contra ventos fortes'
      ],
      tag: 'CONFORTO TÉRMICO'
    },
    {
      id: 'ripados',
      title: 'Ripados de Alumínio',
      desc: 'A beleza estética do ripado de madeira com a durabilidade eterna do alumínio. Disponível em diversas tonalidades de anodização (preto, bronze, cinza) ou pintura amadeirada de altíssima fidelidade. Não empena, não mofa e dispensa manutenção ou verniz periódicos.',
      features: [
        'Pintura amadeirada com textura realista',
        'Aplicação em fachadas, portões e painéis internos',
        'Zero custo de manutenção anual',
        'Espaçamentos e perfis personalizáveis'
      ],
      tag: 'TENDÊNCIA ARQUITETÔNICA'
    },
    {
      id: 'muxarabi',
      title: 'Muxarabi de Alumínio',
      desc: 'Clássico elemento geométrico rendilhado herdado da arquitetura árabe, agora fabricado em perfis de alumínio soldados de alta precisão. Cria um maravilhoso jogo de luz e sombra no ambiente interno, mantendo a ventilação natural ativa e resguardando a privacidade da sua família.',
      features: [
        'Divisória decorativa e funcional',
        'Excelente ventilação permanente com privacidade',
        'Desenho geométrico sofisticado',
        'Pode ser integrado a portas e janelas de giro'
      ],
      tag: 'ELEMENTO TRADICIONAL'
    }
  ];

  return (
    <div className="page-enter py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-brand-gray-mid pb-8 mb-16 text-left">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand-orange font-bold">
            Proteção Solar & Revestimentos Decorativos
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-brand-charcoal mt-2">
            Brises e Ripados: Design e Funcionalidade
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600 font-sans max-w-3xl leading-relaxed">
            Unindo sofisticação e controle térmico. Descubra como nossos brises, ripados e muxarabis de alumínio valorizam a fachada residencial ou corporativa, gerando sombras artísticas e privacidade sob medida.
          </p>
        </div>

        {/* Highlight Image Banner */}
        <div className="relative rounded-sm overflow-hidden h-[400px] border border-brand-gray-mid mb-20 shadow-md">
          <img
            src={IMAGES.brisesRipados}
            alt="Detalhe de Ripados de Alumínio e Brises - Esquadrijampa"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal/80 via-brand-charcoal/30 to-transparent" />
          <div className="absolute bottom-8 left-8 max-w-lg text-white">
            <span className="font-mono text-xs text-brand-orange uppercase tracking-wider bg-black/40 px-3 py-1.5 rounded-sm">
              TECNOLOGIA EM FACHADAS
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mt-4">
              O Jogo Perfeito de Luz e Sombra
            </h3>
            <p className="text-gray-200 text-sm mt-2 font-sans leading-relaxed">
              Esquadrias e ripas projetadas de acordo com as especificações da obra, combinando leveza e robustez estrutural contra intempéries.
            </p>
          </div>
        </div>

        {/* Detailed Items List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-brand-gray-light border border-brand-gray-mid rounded-sm p-8 flex flex-col justify-between"
              id={`brise-card-${item.id}`}
            >
              <div>
                <span className="font-mono text-[10px] text-brand-orange font-bold tracking-widest uppercase bg-white border border-brand-gray-mid px-2.5 py-1 rounded-sm">
                  {item.tag}
                </span>
                <h3 className="font-display text-xl font-bold text-brand-charcoal mt-6 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed font-sans mb-6">
                  {item.desc}
                </p>
              </div>

              <div className="border-t border-brand-gray-mid pt-6">
                <ul className="space-y-2.5 mb-2">
                  {item.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-xs text-gray-700 font-sans">
                      <Check className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Help Box */}
        <div className="bg-brand-gray-light p-8 rounded-sm border border-brand-gray-mid text-center max-w-3xl mx-auto">
          <Sun className="w-8 h-8 text-brand-orange mx-auto mb-4" />
          <h3 className="font-display text-lg font-bold text-brand-charcoal mb-2">
            Precisa de soluções de controle de insolação?
          </h3>
          <p className="text-gray-600 text-xs sm:text-sm font-sans mb-6 leading-relaxed max-w-xl mx-auto">
            Nossos engenheiros e serralheiros desenvolvem o detalhamento completo dos brises de alumínio para que sua residência se beneficie da brisa natural sem o aquecimento incômodo do sol da tarde.
          </p>
          <a
            href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=Olá!%20Gostaria%20de%20conversar%20sobre%20soluções%20de%20Brises%20e%20Ripados%20da%20Esquadrijampa.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-sm font-sans text-xs font-semibold uppercase tracking-wider hover:bg-emerald-700 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Tirar Dúvidas por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
