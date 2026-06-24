/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Check, Info, ArrowRight } from 'lucide-react';
import { ActivePage } from '../types';
import { IMAGES, SYSTEM_SPECS } from '../data';

interface EsquadriasSectionProps {
  setActivePage: (page: ActivePage) => void;
}

export default function EsquadriasSection({ setActivePage }: EsquadriasSectionProps) {
  const janelas = [
    {
      title: 'Janela de Correr',
      desc: 'Versão extremamente versátil de 2, 3, 4, 5 ou 6 folhas de correr. Pode ser fabricada com ou sem bandeira superior (para maior entrada de luz) e com ou sem peitoril inferior (para proteção estrutural).',
      features: ['2 a 6 folhas móveis ou fixas', 'Opção com bandeira integrada', 'Opção com peitoril de proteção', 'Excelente vedação acústica'],
      image: IMAGES.hero,
    },
    {
      title: 'Maxim-Ar',
      desc: 'Ideal para banheiros, cozinhas e áreas de circulação. Oferece ventilação controlada através do basculamento projetante. Pode conter peitoril inferior, bandeira superior ou ambos integrados.',
      features: ['Fácil higienização e manutenção', 'Abertura de até 90 graus', 'Com ou sem peitoril/bandeira', 'Estrutura leve e estanque'],
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Boca de Lobo',
      desc: 'Solução técnica de ventilação sob medida para áreas que exigem fluxo constante de ar e privacidade visual, como garagens residenciais, depósitos e casas de máquinas.',
      features: ['Ventilação permanente', 'Proteção contra entrada de chuva', 'Ideal para áreas técnicas', 'Perfis de alumínio de alta resistência'],
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const portas = [
    {
      title: 'Porta de Correr',
      desc: 'Portas de correr panorâmicas com 2, 3, 4, 5 ou 6 folhas móveis. Criam vãos amplos integrando a sala com a área gourmet. Podem conter travessa de reforço ou bandeira superior.',
      features: ['Até 6 folhas integradas', 'Trilhos embutidos no piso', 'Opção de vidro duplo térmico', 'Movimentação suave com roldanas premium'],
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Porta de Giro',
      desc: 'Disponível em veneziana fechada (privacidade total), lambri de alumínio (estética robusta e moderna) ou vidro temperado (transparência elegante). Ideal para entradas principais e áreas de serviço.',
      features: ['Fechamento pivotante ou convencional', 'Venezianas ventiladas ou cegas', 'Lambri duplo com excelente isolamento', 'Opção de fechadura eletrônica'],
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Porta Camarão',
      desc: 'Porta articulada dobrável que otimiza 100% da área do vão livre. Excelente para divisórias internas de ambientes, lavabos ou conexões compactas.',
      features: ['Abertura articulada de alto ganho de espaço', 'Dobradiças reforçadas ocultas', 'Ideal para vãos menores ou divisões', 'Funcionamento leve e silencioso'],
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="page-enter py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-brand-gray-mid pb-8 mb-16 text-left">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand-orange font-bold">
            Catálogo Completo
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-brand-charcoal mt-2">
            Soluções Completas em Esquadrias de Alumínio
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600 font-sans max-w-3xl leading-relaxed">
            Fabricamos e instalamos esquadrias de alto desempenho, aliando precisão geométrica à elegância dos perfis modernos. Da janela simples à esquadria complexa sob medida para grandes vãos.
          </p>
        </div>

        {/* Janelas Section */}
        <section className="mb-24" id="secao-janelas">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-charcoal tracking-tight">
              Janelas de Alumínio
            </h2>
            <div className="h-0.5 bg-brand-orange grow" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {janelas.map((janela, idx) => (
              <motion.div
                key={janela.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-brand-gray-light border border-brand-gray-mid rounded-sm overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="h-52 overflow-hidden relative">
                    <img
                      src={janela.image}
                      alt={janela.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold text-brand-charcoal mb-3">
                      {janela.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed font-sans mb-6">
                      {janela.desc}
                    </p>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <ul className="space-y-2 mb-2 border-t border-brand-gray-mid pt-4">
                    {janela.features.map((feat) => (
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
        </section>

        {/* Portas Section */}
        <section className="mb-24" id="secao-portas">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-charcoal tracking-tight">
              Portas de Alumínio
            </h2>
            <div className="h-0.5 bg-brand-orange grow" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {portas.map((porta, idx) => (
              <motion.div
                key={porta.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-brand-gray-light border border-brand-gray-mid rounded-sm overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="h-52 overflow-hidden relative">
                    <img
                      src={porta.image}
                      alt={porta.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold text-brand-charcoal mb-3">
                      {porta.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed font-sans mb-6">
                      {porta.desc}
                    </p>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <ul className="space-y-2 mb-2 border-t border-brand-gray-mid pt-4">
                    {porta.features.map((feat) => (
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
        </section>

        {/* Sistemas & Bitolas Section */}
        <section className="bg-brand-chumbo text-white p-8 sm:p-12 rounded-sm border border-brand-gray-mid" id="sistemas-bitolas">
          <div className="max-w-3xl mb-12">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand-orange font-bold flex items-center gap-2">
              <Info className="w-4 h-4" /> Especificações Técnicas
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mt-2">
              {SYSTEM_SPECS.title}
            </h2>
            <p className="text-gray-300 text-sm sm:text-base mt-4 font-sans leading-relaxed">
              {SYSTEM_SPECS.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SYSTEM_SPECS.bitolas.map((bitola, idx) => (
              <div
                key={bitola.size}
                className="bg-brand-charcoal p-6 border-l-4 border-brand-orange rounded-r-sm flex flex-col justify-between"
                id={`bitola-card-${bitola.size}`}
              >
                <div>
                  <div className="bg-brand-orange/10 border border-brand-orange/30 rounded-sm w-fit px-3 py-1 mb-4">
                    <span className="font-mono text-sm font-bold text-brand-orange">{bitola.size}</span>
                  </div>
                  <h3 className="font-display text-base font-bold text-white mb-2">
                    {bitola.title}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed font-sans">
                    {bitola.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 text-[10px] uppercase font-mono tracking-wider text-gray-400">
                  Qualidade Garantida
                </div>
              </div>
            ))}
          </div>

          {/* CTA Row */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-300 font-sans">
              Dúvidas sobre qual a bitola ideal para os vãos da sua obra? Converse com nossa equipe de fabricação.
            </p>
            <button
              onClick={() => {
                setActivePage(ActivePage.Contato);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 bg-brand-orange text-white px-5 py-3 rounded-sm font-sans text-xs font-semibold uppercase tracking-wider hover:bg-brand-orange-hover transition-colors whitespace-nowrap"
            >
              Consultar Especialista
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
