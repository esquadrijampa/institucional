/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, DragEvent, ChangeEvent, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, MessageSquare, Upload, FileText, CheckCircle, X, Send } from 'lucide-react';
import { CONTACT_INFO } from '../data';

export default function ContatoSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceType: 'Janelas',
    message: '',
  });

  const [projectFile, setProjectFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Drag handlers
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      // Only allow PDF, images, or DWG/architectural files (or anything for versatility)
      setProjectFile(file);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProjectFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setProjectFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="page-enter py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-brand-gray-mid pb-8 mb-16 text-left">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand-orange font-bold">
            Envie Seu Projeto
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-brand-charcoal mt-2">
            Solicite um Orçamento
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600 font-sans max-w-3xl leading-relaxed">
            Nossos especialistas em esquadrias de alumínio e vidros farão a leitura detalhada das suas plantas executivas para enviar uma cotação justa e otimizada.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" id="contato-grid">
          {/* Left Column - Contact Details & Map */}
          <div className="lg:col-span-5 space-y-10">
            {/* Quick Contacts */}
            <div className="bg-brand-gray-light p-8 rounded-sm border border-brand-gray-mid space-y-6">
              <h3 className="font-display text-lg font-bold text-brand-charcoal">
                Canais de Atendimento
              </h3>

              <div className="space-y-4">
                <a
                  href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=Olá,%20gostaria%20de%20solicitar%20um%20orçamento%20de%20esquadrias.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-sm bg-emerald-50 hover:bg-emerald-100/80 transition-colors border border-emerald-100 group"
                >
                  <div className="bg-emerald-600 text-white p-2.5 rounded-sm shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider">WhatsApp Direto</h4>
                    <p className="text-sm font-sans font-semibold text-emerald-950">{CONTACT_INFO.phone}</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-4 rounded-sm bg-white border border-brand-gray-mid">
                  <div className="bg-brand-chumbo text-white p-2.5 rounded-sm shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="break-all">
                    <h4 className="text-xs font-mono font-bold text-gray-500 uppercase tracking-wider">E-mail Comercial</h4>
                    <a href={`mailto:${CONTACT_INFO.email}`} className="text-sm font-sans font-semibold text-brand-charcoal hover:text-brand-orange transition-colors">
                      {CONTACT_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-sm bg-white border border-brand-gray-mid">
                  <div className="bg-brand-chumbo text-white p-2.5 rounded-sm shrink-0">
                    <MapPin className="w-5 h-5 text-white shrink-0" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-gray-500 uppercase tracking-wider">Endereço do Escritório</h4>
                    <p className="text-sm font-sans font-medium text-brand-charcoal leading-relaxed mt-1">
                      {CONTACT_INFO.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map Embed */}
            <div className="border border-brand-gray-mid rounded-sm overflow-hidden h-72 shadow-sm" id="contato-mapa">
              <iframe
                title="Esquadrijampa no Google Maps"
                src={CONTACT_INFO.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right Column - Submission Form */}
          <div className="lg:col-span-7">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border border-emerald-200 p-8 sm:p-12 text-center rounded-sm"
                id="form-success-alert"
              >
                <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-6" />
                <h3 className="font-display text-2xl font-bold text-emerald-900 mb-2">
                  Solicitação Enviada com Sucesso!
                </h3>
                <p className="text-emerald-800 text-sm font-sans max-w-md mx-auto leading-relaxed mb-8">
                  Olá <strong className="text-emerald-950">{formData.name}</strong>, recebemos seus dados e o interesse em esquadrias do tipo <strong>{formData.serviceType}</strong>. Nossa equipe técnica de João Pessoa já foi acionada e entrará em contato em breve.
                </p>
                {projectFile && (
                  <div className="bg-white/80 p-3 rounded-sm border border-emerald-100 max-w-xs mx-auto flex items-center gap-2 mb-8 text-left">
                    <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-xs font-mono text-emerald-900 truncate flex-1">{projectFile.name}</span>
                  </div>
                )}
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ name: '', phone: '', email: '', serviceType: 'Janelas', message: '' });
                    setProjectFile(null);
                  }}
                  className="bg-emerald-600 text-white px-6 py-3 rounded-sm font-sans text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  Enviar Nova Solicitação
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-brand-gray-light p-8 rounded-sm border border-brand-gray-mid space-y-6" id="contato-orcamento-form">
                <h3 className="font-display text-xl font-bold text-brand-charcoal">
                  Formulário de Cotação
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Nome */}
                  <div className="flex flex-col">
                    <label htmlFor="name" className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-2 font-sans">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ex: João Silva"
                      className="bg-white border border-brand-gray-mid p-3 rounded-sm font-sans text-sm focus:outline-none focus:border-brand-orange text-brand-charcoal"
                    />
                  </div>

                  {/* Telefone */}
                  <div className="flex flex-col">
                    <label htmlFor="phone" className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-2 font-sans">
                      Telefone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Ex: (83) 99999-9999"
                      className="bg-white border border-brand-gray-mid p-3 rounded-sm font-sans text-sm focus:outline-none focus:border-brand-orange text-brand-charcoal"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="flex flex-col">
                    <label htmlFor="email" className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-2 font-sans">
                      E-mail para Retorno *
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Ex: seuemail@dominio.com"
                      className="bg-white border border-brand-gray-mid p-3 rounded-sm font-sans text-sm focus:outline-none focus:border-brand-orange text-brand-charcoal"
                    />
                  </div>

                  {/* Tipo de serviço */}
                  <div className="flex flex-col">
                    <label htmlFor="serviceType" className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-2 font-sans">
                      Tipo de Serviço *
                    </label>
                    <select
                      name="serviceType"
                      id="serviceType"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      className="bg-white border border-brand-gray-mid p-3 rounded-sm font-sans text-sm focus:outline-none focus:border-brand-orange text-brand-charcoal appearance-none cursor-pointer"
                    >
                      <option value="Janelas">Janelas de Alumínio</option>
                      <option value="Portas">Portas de Alumínio (Correr, Giro, Camarão)</option>
                      <option value="Pele de Vidro">Pele de Vidro (Stick, Unitizada)</option>
                      <option value="Fachada ACM">Fachada em ACM</option>
                      <option value="Brises/Ripados">Brises & Ripados de Alumínio (Muxarabi)</option>
                      <option value="Vidro Temperado">Vidros Temperados (Box, Guarda-Corpo, Portas)</option>
                      <option value="Outros">Outros Projetos</option>
                    </select>
                  </div>
                </div>

                {/* Mensagem */}
                <div className="flex flex-col">
                  <label htmlFor="message" className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-2 font-sans">
                    Mensagem / Detalhes da Obra *
                    </label>
                  <textarea
                    name="message"
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Nos conte sobre sua obra: metragem estimada, se já possui projeto executivo de esquadrias ou se precisa de auxílio para o dimensionamento..."
                    className="bg-white border border-brand-gray-mid p-3 rounded-sm font-sans text-sm focus:outline-none focus:border-brand-orange text-brand-charcoal leading-relaxed resize-none"
                  />
                </div>

                {/* Project File upload with Drag & Drop */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-2 font-sans">
                    Anexar Arquivo do Projeto (Opcional)
                  </label>
                  
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={triggerFileSelect}
                    className={`border-2 border-dashed p-6 rounded-sm text-center cursor-pointer transition-colors duration-200 flex flex-col items-center justify-center ${
                      isDragActive
                        ? 'border-brand-orange bg-brand-orange/5'
                        : 'border-brand-gray-mid hover:border-brand-orange/60 hover:bg-white'
                    }`}
                    id="dropzone-area"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg,.dwg,.dxf"
                      id="file-input-hidden"
                    />

                    {projectFile ? (
                      <div className="space-y-3 w-full max-w-xs" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-white p-3 rounded-sm border border-brand-gray-mid flex items-center gap-3">
                          <FileText className="w-8 h-8 text-brand-orange shrink-0" />
                          <div className="text-left flex-1 min-w-0">
                            <p className="text-xs font-bold text-brand-charcoal truncate">
                              {projectFile.name}
                            </p>
                            <p className="text-[10px] text-gray-400 font-mono">
                              {(projectFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={removeFile}
                            className="text-gray-400 hover:text-brand-orange p-1 hover:bg-brand-gray-light rounded-sm"
                            aria-label="Remover arquivo"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mb-2.5" />
                        <p className="text-xs font-bold text-brand-charcoal mb-1 font-sans">
                          Arraste e solte o projeto aqui ou <span className="text-brand-orange underline">clique para selecionar</span>
                        </p>
                        <p className="text-[10px] text-gray-400 font-sans">
                          Aceita formatos PDF, DWG, DXF, PNG ou JPG (Max: 10MB)
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Action button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white py-3.5 rounded-sm font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                    id="form-submit-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processando Anexo...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Enviar Solicitação de Orçamento
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
