/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ActivePage, PortfolioItem } from './types';

// Image paths from generated assets
export const IMAGES = {
  hero: '/src/assets/images/esquadrijampa_hero_1782316069562.jpg',
  peleDeVidro: '/src/assets/images/pele_de_vidro_facade_1782316085953.jpg',
  fachadaAcm: '/src/assets/images/fachada_acm_panels_1782316100638.jpg',
  brisesRipados: '/src/assets/images/brises_ripados_detail_1782316117290.jpg',
  // Curated Unsplash images for additional context
  vidros: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  boxVidro: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
  guardaCorpo: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
  portaDeGiroVidro: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
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
    description: 'Trabalhamos com os melhores sistemistas do mercado de esquadrias, com perfis em bitolas de 20mm, 25mm e 32mm para alto desempenho.',
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
    image: IMAGES.hero,
  },
  {
    id: 'portas',
    title: 'Portas de Correr e Giro',
    description: 'Portas de correr panorâmicas, camarão e portas de giro em veneziana ou lambri.',
    page: ActivePage.Esquadrias,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
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
  whatsapp: '5583999999999', // Placeholder WhatsApp número (DDD 83 é João Pessoa - "Esquadrijampa")
  phone: '(83) 99999-9999',
  email: 'mktesquadrijampa@gmail.com', // Explicit user email from metadata! Perfect match.
  address: 'Av. Governador Flávio Ribeiro Coutinho, 500 - Manaíra, João Pessoa - PB, 58037-005',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.2562137604587!2d-34.83537232402434!3d-7.096277069566367!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ace8123067f93b%3A0xe549df9cfa902162!2sMana%C3%ADra%20Shopping!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr',
};
