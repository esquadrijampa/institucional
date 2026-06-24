/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Phone, Mail, MapPin, MessageSquare, ArrowRight } from 'lucide-react';
import { ActivePage } from '../types';
import { CONTACT_INFO } from '../data';
import logoImg from '../assets/images/logo.png';

interface FooterProps {
  setActivePage: (page: ActivePage) => void;
}

export default function Footer({ setActivePage }: FooterProps) {
  const handleNavigate = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-brand-charcoal text-white pt-16 pb-8 border-t-2 border-brand-orange">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Company Brief */}
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => handleNavigate(ActivePage.Home)}
              className="flex items-center focus:outline-none group text-left self-start"
            >
              <img
                src={logoImg}
                alt="Esquadrijampa Logo"
                className="h-12 w-auto object-contain brightness-0 invert transition-transform duration-200 group-hover:scale-[1.03]"
                referrerPolicy="no-referrer"
              />
            </button>
            <p className="text-gray-400 text-sm leading-relaxed font-sans">
              Fabricação própria de esquadrias de alumínio premium, fachadas em ACM, pele de vidro e brises sob medida. Soluções completas do projeto à instalação em João Pessoa e região.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=Olá,%20gostaria%20de%20solicitar%20um%20orçamento%20para%20minha%20obra.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold bg-brand-orange text-white px-4 py-2 hover:bg-brand-orange-hover transition-colors rounded-sm uppercase tracking-wider"
              >
                <MessageSquare className="w-4 h-4" />
                Fale no WhatsApp
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white border-b border-gray-800 pb-3 mb-4">
              Páginas do Site
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <button onClick={() => handleNavigate(ActivePage.Home)} className="hover:text-brand-orange transition-colors flex items-center gap-1 group">
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:text-brand-orange transition-all -ml-4 group-hover:ml-0" />
                  Início
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate(ActivePage.SobreNos)} className="hover:text-brand-orange transition-colors flex items-center gap-1 group">
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:text-brand-orange transition-all -ml-4 group-hover:ml-0" />
                  Sobre Nós
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate(ActivePage.Portfolio)} className="hover:text-brand-orange transition-colors flex items-center gap-1 group text-left">
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:text-brand-orange transition-all -ml-4 group-hover:ml-0" />
                  Nossos Projetos (Portfólio)
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate(ActivePage.Contato)} className="hover:text-brand-orange transition-colors flex items-center gap-1 group">
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:text-brand-orange transition-all -ml-4 group-hover:ml-0" />
                  Contato e Orçamento
                </button>
              </li>
            </ul>
          </div>

          {/* Solutions / Products */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white border-b border-gray-800 pb-3 mb-4">
              Nossas Soluções
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <button onClick={() => handleNavigate(ActivePage.Esquadrias)} className="hover:text-brand-orange transition-colors flex items-center gap-1 group text-left">
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:text-brand-orange transition-all -ml-4 group-hover:ml-0" />
                  Esquadrias de Alumínio (Portas/Janelas)
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate(ActivePage.Fachadas)} className="hover:text-brand-orange transition-colors flex items-center gap-1 group text-left">
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:text-brand-orange transition-all -ml-4 group-hover:ml-0" />
                  Fachadas (Pele de Vidro & ACM)
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate(ActivePage.Brises)} className="hover:text-brand-orange transition-colors flex items-center gap-1 group text-left">
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:text-brand-orange transition-all -ml-4 group-hover:ml-0" />
                  Brises e Ripados de Alumínio
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate(ActivePage.Vidros)} className="hover:text-brand-orange transition-colors flex items-center gap-1 group text-left">
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:text-brand-orange transition-all -ml-4 group-hover:ml-0" />
                  Vidro Temperado & Aplicações
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white border-b border-gray-800 pb-3 mb-4">
              Atendimento Comercial
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <span className="leading-relaxed">{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-orange shrink-0" />
                <span>{CONTACT_INFO.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-orange shrink-0" />
                <span className="break-all">{CONTACT_INFO.email}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Separator and copyright */}
        <div className="pt-8 border-t border-gray-800 text-center md:flex md:justify-between md:items-center text-xs text-gray-500 font-sans">
          <p>© {new Date().getFullYear()} Esquadrijampa. Todos os direitos reservados. Fabricação e instalação sob medida.</p>
          <p className="mt-2 md:mt-0 font-mono tracking-wider">DO PROJETO À OBRA CONCLUÍDA</p>
        </div>
      </div>
    </footer>
  );
}
