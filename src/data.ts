/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ActivePage, PortfolioItem } from './types';

// Import images as ES Modules so Vite compiles and resolves them correctly in production
import heroImg from './assets/images/esquadrijampa_hero_1782316069562.jpg';
import peleDeVidroImg from './assets/images/pele_de_vidro_facade_1782316085953.jpg';
import fachadaAcmImg from './assets/images/fachada_acm_panels_1782316100638.jpg';
import brisesRipadosImg from './assets/images/brises_ripados_detail_1782316117290.jpg';

import janelaCorrerImg from './assets/images/janela_correr_1782328624428.jpg';
import janelaMaximArImg from './assets/images/janela_maxim_ar_1782328634262.jpg';
import ventilacaoPermanenteImg from './assets/images/ventilacao_vertical_preta_1782332245714.jpg';
import portaCorrerImg from './assets/images/porta_correr_1782328657047.jpg';
import portaGiroLambriImg from './assets/images/porta_giro_lambri_1782328674994.jpg';
import portaCamaraoImg from './assets/images/porta_camarao_1782328685388.jpg';
import guardaCorpoVidroImg from './assets/images/guarda_corpo_vidro_1782328699427.jpg';

// Image paths from generated assets
export const IMAGES = {
  hero: heroImg,
  peleDeVidro: peleDeVidroImg,
  fachadaAcm: fachadaAcmImg,
  brisesRipados: brisesRipadosImg,
  janelaCorrer: janelaCorrerImg,
  janelaMaximAr: janelaMaximArImg,
  ventilacaoPermanente: ventilacaoPermanenteImg,
  portaCorrer: portaCorrerImg,
  portaGiroLambri: portaGiroLambriImg,
  portaCamarao: portaCamaraoImg,
  guardaCorpoVidro: guardaCorpoVidroImg,
  // Curated Unsplash images for additional context
  vidros: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  boxVidro: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
  guardaCorpo: guardaCorpoVidroImg,
  portaDeGiroVidro: portaGiroLambriImg,
};

export const DIFFERENTIALS = [
  {
    id: 'fabricacao',
    title: 'Fabricação Própria',
    description: 'Controle total sobre cada etapa do processo produtivo, desde o corte dos perfis de alumínio até a montagem final e entrega na obra.',
    iconName: 'Hammer',
  },
  {
    id: 'sistemas',
    title: 'Sistemas Premium',
    description: 'Trabalhamos com as melhores linhas de esquadrias de alumínio do mercado e ajudamos você a escolher a opção ideal para o seu projeto, garantindo beleza, segurança, durabilidade e o melhor custo-benefício.',
    iconName: 'Shield',
  },
  {
    id: 'medida',
    title: 'Projetos Sob Medida',
    description: 'Cada projeto é único. Desenvolvemos soluções personalizadas em alumínio e vidro que atendem perfeitamente às especificações da sua obra.',
    iconName: 'Ruler',
  },
];

export const HIGHLIGHT_SERVICES = [
  {
    id: 'janelas',
    title: 'Janelas de Correr',
    description: 'De 2 a 6 folhas, com ou sem bandeira, oferecendo alta luminosidade e ventilação ideal.',
    page: ActivePage.Esquadrias,
    image: IMAGES.janelaCorrer,
  },
  {
    id: 'portas',
    title: 'Portas de Correr e Giro',
    description: 'Portas de correr panorâmicas, camarão e portas de giro em veneziana ou lambri.',
    page: ActivePage.Esquadrias,
    image: IMAGES.portaCorrer,
  },
  {
    id: 'pele-vidro',
    title: 'Pele de Vidro',
    description: 'Fachadas cortina modernas em modelos Stick e Unitizado para controle térmico e acústico.',
    page: ActivePage.Fachadas,
    image: IMAGES.peleDeVidro,
  },
  {
    id: 'acm',
    title: 'Fachadas em ACM',
    description: 'Painéis de Alumínio Composto para revestimentos duráveis de alto padrão estético.',
    page: ActivePage.Fachadas,
    image: IMAGES.fachadaAcm,
  },
  {
    id: 'brises',
    title: 'Brises e Ripados',
    description: 'Soluções em alumínio para controle de luz solar e design de fachadas imponentes.',
    page: ActivePage.Brises,
    image: IMAGES.brisesRipados,
  },
  {
    id: 'vidros',
    title: 'Vidro Temperado',
    description: 'Instalações de alta segurança como divisórias, portas de vidro e guarda-corpos.',
    page: ActivePage.Vidros,
    image: IMAGES.vidros,
  },
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'p1',
    title: 'Residência Alphaville - Pele de Vidro & Brises',
    category: ActivePage.Fachadas,
    subCategory: 'Pele de Vidro Stick',
    image: IMAGES.peleDeVidro,
    description: 'Pele de vidro com sistema stick e vidros refletivos de alta performance, proporcionando conforto térmico.',
  },
  {
    id: 'p2',
    title: 'Casa Contemporânea - Esquadrias Linha Premium',
    category: ActivePage.Esquadrias,
    subCategory: 'Portas e Janelas de Correr',
    image: IMAGES.hero,
    description: 'Esquadrias integradas em alumínio preto com bitola de 32mm, permitindo grandes vãos de abertura.',
  },
  {
    id: 'p3',
    title: 'Edifício Corporativo - Revestimento ACM',
    category: ActivePage.Fachadas,
    subCategory: 'Fachada ACM',
    image: IMAGES.fachadaAcm,
    description: 'Revestimento externo em chapas de ACM cinza chumbo escuro, agregando elegância e facilidade de manutenção.',
  },
  {
    id: 'p4',
    title: 'Villa Moderna - Ripados & Muxarabi',
    category: ActivePage.Brises,
    subCategory: 'Ripados de Alumínio',
    image: IMAGES.brisesRipados,
    description: 'Ripados de alumínio instalados para sombreamento e brises móveis para flexibilidade de luz solar.',
  },
  {
    id: 'p5',
    title: 'Guarda-Corpo & Fechamentos em Vidro',
    category: ActivePage.Vidros,
    subCategory: 'Vidros Temperados',
    image: IMAGES.guardaCorpo,
    description: 'Fornecimento e instalação de guarda-corpos panorâmicos em vidro temperado de 10mm com pinças de inox.',
  },
  {
    id: 'p6',
    title: 'Porta de Giro Alumínio Lambri com Puxador',
    category: ActivePage.Esquadrias,
    subCategory: 'Portas de Giro',
    image: IMAGES.portaDeGiroVidro,
    description: 'Porta de entrada pivotante em lambri preto com puxador em aço inoxidável escovado.',
  },
];

export const SYSTEM_SPECS = {
  title: 'Precisão e Desempenho nos Nossos Sistemas',
  description: 'Trabalhamos com perfis certificados e variações de sistemas de acordo com a necessidade da sua obra:',
  bitolas: [
    {
      size: '20mm',
      title: 'Bitola 20mm (Linha Leve)',
      desc: 'Ideal para janelas e portas de dimensões padrão com excelente custo-benefício, mantendo a leveza de movimentação.',
    },
    {
      size: '25mm',
      title: 'Bitola 25mm (Linha Intermediária)',
      desc: 'Mais robustez e resistência mecânica. Indicada para vãos médios, garantindo excelente estanqueidade e vedação.',
    },
    {
      size: '32mm',
      title: 'Bitola 32mm (Linha de Alto Padrão)',
      desc: 'Máxima performance estrutural. Perfeita para vãos amplos com folhas pesadas de vidro duplo, atendendo a obras residenciais premium.',
    },
  ],
};

export const ABOUT_TEXT = {
  history: 'A Esquadrijampa nasceu da paixão por transformar projetos em realidade. Somos especializados na fabricação e instalação de esquadrias de alumínio de alto padrão, brises e ripados, fachadas em ACM e pele de vidro.',
  mission: 'Trabalhamos em parceria direta com os melhores sistemistas do mercado, utilizando variações de sistemas entre as bitolas de 20mm, 25mm e 32mm — garantindo a solução perfeita para cada tipo de arquitetura e obra.',
  commitment: 'Do primeiro orçamento e detalhamento técnico até a instalação final e vistorias, acompanhamos cada etapa com a mesma dedicação: entregar um trabalho refinado que valorize e faça a diferença no seu projeto.',
  values: [
    {
      title: 'Fabricação Própria',
      desc: 'Serralheria equipada com maquinário moderno que garante corte e usinagem de altíssima precisão.',
    },
    {
      title: 'Equipe Especializada',
      desc: 'Profissionais experientes que acompanham o projeto e garantem fixação e vedações perfeitas em campo.',
    },
    {
      title: 'Atendimento Personalizado',
      desc: 'Análise detalhada do projeto executivo para otimizar custos e sugerir as melhores linhas de perfis.',
    },
  ],
};

export const CONTACT_INFO = {
  whatsapp: '558393233500',
  phone: '+55 (83) 9323-3500',
  email: 'esquadrijampa@gmail.com',
  address: 'Rua Adalberto Florentino de Castro, 128 - Valentina, João Pessoa - PB, 58064-070',
  mapEmbedUrl: 'https://maps.google.com/maps?q=Rua%20Adalberto%20Florentino%20de%20Castro%20128,%20Valentina,%20Joao%20Pessoa%20PB&t=&z=16&ie=UTF8&iwloc=&output=embed',
};
