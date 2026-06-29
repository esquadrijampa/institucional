/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ActivePage {
  Home = 'home',
  Esquadrias = 'esquadrias',
  Fachadas = 'fachadas',
  Brises = 'brises',
  Vidros = 'vidros',
  Portfolio = 'portfolio',
  SobreNos = 'sobrenos',
  Contato = 'contato',
  Dashboard = 'dashboard'
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: ActivePage;
  subCategory: string;
  image: string;
  description: string;
}

export interface ServiceDetail {
  title: string;
  description: string;
  features: string[];
  image: string;
}

export interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  message: string;
  projectFile?: File | null;
}
