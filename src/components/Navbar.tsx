/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Menu, X, MessageSquare, ChevronDown } from 'lucide-react';
import { ActivePage } from '../types';
import { CONTACT_INFO } from '../data';
import logoImg from '../assets/images/logo.png';

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
}

export default function Navbar({ activePage, setActivePage }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Main high-level pages, excluding specific services because they're in the dropdown now
  const menuItems = [
    { label: 'Início', page: ActivePage.Home },
    { label: 'Projetos', page: ActivePage.Portfolio },
    { label: 'Sobre Nós', page: ActivePage.SobreNos },
    { label: 'Contato', page: ActivePage.Contato },
  ];

  const servicesItems = [
    { label: 'Esquadrias de Alumínio', page: ActivePage.Esquadrias },
    { label: 'Fachadas Pele de Vidro', page: ActivePage.Fachadas },
    { label: 'Brises & Ripados', page: ActivePage.Brises },
    { label: 'Vidros Especiais', page: ActivePage.Vidros },
  ];

  const handleNavigate = (page: ActivePage) => {
    setActivePage(page);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-brand-gray-mid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavigate(ActivePage.Home)}
            className="flex items-center focus:outline-none group text-left"
            id="nav-logo-btn"
          >
            <img
              src={logoImg}
              alt="Esquadrijampa Logo"
              className="h-14 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.03]"
              referrerPolicy="no-referrer"
            />
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex space-x-1 items-center" id="desktop-nav">
            {/* Início Link */}
            <button
              onClick={() => handleNavigate(ActivePage.Home)}
              className={`px-4 py-2 rounded-md font-sans text-sm font-medium transition-all duration-200 focus:outline-none relative ${
                activePage === ActivePage.Home
                  ? 'text-brand-orange font-semibold'
                  : 'text-gray-600 hover:text-brand-charcoal hover:bg-brand-gray-light'
              }`}
              id="nav-link-home"
            >
              Início
              {activePage === ActivePage.Home && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand-orange rounded-full" />
              )}
            </button>

            {/* Dropdown de Serviços */}
            <div className="relative group py-2">
              <button
                className={`px-4 py-2 rounded-md font-sans text-sm font-medium transition-all duration-200 focus:outline-none flex items-center gap-1.5 relative ${
                  [ActivePage.Esquadrias, ActivePage.Fachadas, ActivePage.Brises, ActivePage.Vidros].includes(activePage)
                    ? 'text-brand-orange font-semibold'
                    : 'text-gray-600 hover:text-brand-charcoal hover:bg-brand-gray-light'
                }`}
                id="nav-link-servicos"
              >
                Serviços
                <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                {[ActivePage.Esquadrias, ActivePage.Fachadas, ActivePage.Brises, ActivePage.Vidros].includes(activePage) && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand-orange rounded-full" />
                )}
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute left-1/2 -translate-x-1/2 mt-1 w-56 bg-white border border-brand-gray-mid rounded-md shadow-lg py-1.5 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top -translate-y-2 group-hover:translate-y-0">
                {servicesItems.map((subItem) => (
                  <button
                    key={subItem.page}
                    onClick={() => handleNavigate(subItem.page)}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-brand-gray-light ${
                      activePage === subItem.page
                        ? 'text-brand-orange font-semibold bg-brand-orange/5'
                        : 'text-gray-600 hover:text-brand-charcoal'
                    }`}
                  >
                    {subItem.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Outros Links Principais */}
            {menuItems.slice(1).map((item) => {
              const isActive = activePage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => handleNavigate(item.page)}
                  className={`px-4 py-2 rounded-md font-sans text-sm font-medium transition-all duration-200 focus:outline-none relative ${
                    isActive
                      ? 'text-brand-orange font-semibold'
                      : 'text-gray-600 hover:text-brand-charcoal hover:bg-brand-gray-light'
                  }`}
                  id={`nav-link-${item.page}`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand-orange rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Budget Quick Button Only */}
          <div className="hidden sm:flex items-center">
            <button
              onClick={() => handleNavigate(ActivePage.Contato)}
              className="bg-brand-orange text-white px-6 py-2.5 rounded-sm font-sans text-xs font-semibold uppercase tracking-wider hover:bg-brand-orange-hover transition-all duration-300 shadow-sm border border-transparent"
              id="nav-budget-btn"
            >
              Orçamento
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-brand-charcoal hover:bg-brand-gray-light focus:outline-none"
              aria-label="Toggle Menu"
              id="nav-mobile-toggle"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-brand-gray-mid py-4 px-6 space-y-4 shadow-lg absolute w-full left-0 z-50">
          <div className="flex flex-col space-y-1">
            {/* Início Link */}
            <button
              onClick={() => handleNavigate(ActivePage.Home)}
              className={`w-full text-left px-4 py-2.5 rounded-md font-sans text-base transition-colors ${
                activePage === ActivePage.Home
                  ? 'bg-brand-orange/10 text-brand-orange font-semibold'
                  : 'text-gray-700 hover:bg-brand-gray-light hover:text-brand-charcoal'
              }`}
              id="nav-mobile-link-home"
            >
              Início
            </button>

            {/* Serviços Sub-list */}
            <div className="py-1">
              <div className="px-4 py-1.5 font-mono text-xs tracking-wider text-gray-400 uppercase font-semibold">
                Serviços
              </div>
              <div className="flex flex-col space-y-0.5 mt-1">
                {servicesItems.map((subItem) => {
                  const isActive = activePage === subItem.page;
                  return (
                    <button
                      key={subItem.page}
                      onClick={() => handleNavigate(subItem.page)}
                      className={`w-full text-left pl-8 pr-4 py-2.5 rounded-md font-sans text-sm transition-colors ${
                        isActive
                          ? 'bg-brand-orange/5 text-brand-orange font-semibold'
                          : 'text-gray-600 hover:bg-brand-gray-light hover:text-brand-charcoal'
                      }`}
                      id={`nav-mobile-link-${subItem.page}`}
                    >
                      {subItem.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Outros Links no Mobile */}
            {menuItems.slice(1).map((item) => {
              const isActive = activePage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => handleNavigate(item.page)}
                  className={`w-full text-left px-4 py-2.5 rounded-md font-sans text-base transition-colors ${
                    isActive
                      ? 'bg-brand-orange/10 text-brand-orange font-semibold'
                      : 'text-gray-700 hover:bg-brand-gray-light hover:text-brand-charcoal'
                  }`}
                  id={`nav-mobile-link-${item.page}`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <div className="pt-4 border-t border-brand-gray-mid flex flex-col">
            <button
              onClick={() => handleNavigate(ActivePage.Contato)}
              className="w-full text-center bg-brand-orange text-white py-3.5 rounded-sm font-sans text-sm font-semibold uppercase tracking-wider hover:bg-brand-orange-hover transition-colors"
              id="nav-mobile-budget"
            >
              Solicitar Orçamento
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
