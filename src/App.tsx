import { useState, useEffect } from "react";
import {
  FileText,
  User,
  Layout,
  Eye,
  Download,
  Sparkles,
  Trash2,
  Moon,
  Sun,
  Globe,
  CheckCircle,
  AlertCircle,
  Loader2,
  BookOpen,
  Compass,
} from "lucide-react";
import { CVData, CVTemplateType } from "./types";
import { esDict, enDict } from "./dictionary";
import CVForm from "./components/CVForm";
import CVPreview from "./components/CVPreview";
import { downloadCVAsPDF } from "./components/PDFExporter";
import { downloadCVAsDocx } from "./components/DocxExporter";
import { motion, AnimatePresence } from "motion/react";

// Sample prefilled resume data (in Spanish) to provide a premium onboarding experience
const initialCVData: CVData = {
  personalInfo: {
    fullName: "Juan Pérez García",
    birthDate: "12/04/1994",
    nationality: "Argentino",
    address: "Av. Corrientes 1200",
    city: "Buenos Aires",
    country: "Argentina",
    phone: "+54 9 11 9876-5432",
    email: "juan.perez@example.com",
    linkedin: "linkedin.com/in/juanperezdev",
    website: "juanperez.dev",
    photoUrl: "", // Blank so they can upload theirs, but will display sample photo placeholder in preview
  },
  profileSummary:
    "Desarrollador Full Stack apasionado por construir aplicaciones web eficientes, escalables y con excelente experiencia de usuario. Más de 5 años de experiencia en JavaScript, React, Node.js y bases de datos, liderando entregas ágiles y con excelente enfoque corporativo.",
  education: [
    {
      id: "edu-1",
      institution: "Universidad Tecnológica Nacional",
      degree: "Licenciatura en Sistemas de Información",
      startYear: "2013",
      endYear: "2018",
      description: "Orientación en ingeniería de software, arquitectura en la nube y optimización de algoritmos.",
    },
  ],
  experience: [
    {
      id: "exp-1",
      company: "MercadoLibre S.A.",
      position: "Desarrollador React Senior",
      startDate: "Enero 2021",
      endDate: "Actualidad",
      description:
        "Desarrollo de micro-frontends de alta disponibilidad y escala para millones de usuarios diarios. Optimización de tiempos de carga en un 35% y mentoría activa de desarrolladores junior.",
    },
    {
      id: "exp-2",
      company: "ArgenTech Solutions",
      position: "Desarrollador Full Stack Junior",
      startDate: "Marzo 2019",
      endDate: "Diciembre 2020",
      description:
        "Codificación de APIs seguras y escalables con Node.js y Express. Diseño e implementación de vistas altamente adaptables con CSS moderno e integración de pasarelas de cobro.",
    },
  ],
  skills: ["React", "TypeScript", "Node.js", "Express", "Tailwind CSS", "Git", "PostgreSQL", "Docker", "SCRUM"],
  languages: [
    { id: "lang-1", language: "Español", level: "Nativo" },
    { id: "lang-2", language: "Inglés", level: "Intermedio B1/B2" },
  ],
  certifications: [
    { id: "cert-1", name: "AWS Certified Cloud Practitioner", institution: "Amazon Web Services", year: "2023" },
    { id: "cert-2", name: "Meta Front-End Developer Professional Certificate", institution: "Meta", year: "2022" },
  ],
  projects: [
    {
      id: "proj-1",
      name: "E-Commerce Realtime Dashboard",
      description: "Desarrollo de panel administrativo interactivo con actualizaciones instantáneas, telemetría de ventas y gráficos SVG adaptables.",
      technologies: "React, Express, Node.js, Socket.io"
    }
  ],
  references: [
    {
      id: "ref-1",
      name: "Lic. Clara Benítez",
      position: "Líder de Ingeniería",
      company: "MercadoLibre",
      phone: "+54 11 5555-1234",
      email: "clara.benitez@mercadolibre.com",
    },
  ],
};

const emptyCVData: CVData = {
  personalInfo: {
    fullName: "",
    birthDate: "",
    nationality: "",
    address: "",
    city: "",
    country: "",
    phone: "",
    email: "",
    linkedin: "",
    website: "",
    photoUrl: "",
  },
  profileSummary: "",
  education: [],
  experience: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: [],
  references: [],
};

export default function App() {
  const [cvData, setCvData] = useState<CVData>(initialCVData);
  const [activeTab, setActiveTab] = useState<string>("home");
  const [lang, setLang] = useState<"es" | "en">("es");
  const [template, setTemplate] = useState<CVTemplateType>("classic");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  // Active dictionary selector
  const dict = lang === "es" ? esDict : enDict;

  // Load from local storage
  useEffect(() => {
    const savedData = localStorage.getItem("cv_builder_pro_data");
    const savedLang = localStorage.getItem("cv_builder_pro_lang");
    const savedTemplate = localStorage.getItem("cv_builder_pro_template");
    const savedTheme = localStorage.getItem("cv_builder_pro_theme");

    if (savedData) {
      try {
        setCvData(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse local resume data.");
      }
    }
    if (savedLang === "es" || savedLang === "en") setLang(savedLang);
    if (savedTemplate) setTemplate(savedTemplate as CVTemplateType);
    if (savedTheme === "dark") setIsDarkMode(true);
  }, []);

  // Autosave to local storage when state changes
  useEffect(() => {
    localStorage.setItem("cv_builder_pro_data", JSON.stringify(cvData));
    localStorage.setItem("cv_builder_pro_lang", lang);
    localStorage.setItem("cv_builder_pro_template", template);
    localStorage.setItem("cv_builder_pro_theme", isDarkMode ? "dark" : "light");
  }, [cvData, lang, template, isDarkMode]);

  // Show dynamic self-dismissing notifications
  const showNotification = (type: "success" | "error" | "info", text: string) => {
    setNotification({ type, text });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Clear entire form
  const handleClearForm = () => {
    if (window.confirm(dict.clearConfirm)) {
      setCvData(emptyCVData);
      showNotification("info", "Formulario limpiado con éxito");
    }
  };

  // Calculate Resume Completion Progress
  const calculateProgress = (): number => {
    let score = 0;
    const info = cvData.personalInfo;
    
    // Personal Info: 25% (Name, email, phone, city, photo)
    if (info.fullName) score += 5;
    if (info.email) score += 5;
    if (info.phone) score += 5;
    if (info.city) score += 5;
    if (info.photoUrl) score += 5;

    // Profile summary: 15%
    if (cvData.profileSummary.length > 20) score += 15;

    // Work Experience: 20%
    if (cvData.experience.length > 0) {
      const hasContent = cvData.experience.some(e => e.company && e.position);
      if (hasContent) score += 20;
    }

    // Education: 20%
    if (cvData.education.length > 0) {
      const hasContent = cvData.education.some(edu => edu.institution && edu.degree);
      if (hasContent) score += 20;
    }

    // Skills: 10%
    if (cvData.skills.length >= 2) score += 10;
    else if (cvData.skills.length === 1) score += 5;

    // Languages: 10%
    if (cvData.languages.length > 0) score += 10;

    return Math.min(score, 100);
  };

  const progress = calculateProgress();
  const isValid = !!(cvData.personalInfo.fullName && cvData.personalInfo.email);

  // AI-powered CV Translation via Gemini Server-side Route
  const handleAITranslate = async () => {
    setIsTranslating(true);
    showNotification("info", lang === "es" ? "Traduciendo currículum completo con Gemini..." : "Translating full resume with Gemini...");

    try {
      const targetLangCode = lang === "es" ? "en" : "es";
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvData, targetLang: targetLangCode }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to translate CV");
      }

      const { translatedData } = await response.json();
      setCvData(translatedData);
      setLang(targetLangCode);
      showNotification(
        "success",
        targetLangCode === "en"
          ? "Resume translated successfully into English!"
          : "¡Currículum traducido exitosamente al Español!"
      );
    } catch (err: any) {
      console.error(err);
      showNotification("error", err.message || "Failed to translate. Please configure GEMINI_API_KEY.");
    } finally {
      setIsTranslating(false);
    }
  };

  // Export handlers
  const handlePdfDownload = async () => {
    try {
      showNotification("info", dict.loading);
      // Wait a tiny bit to ensure the A4 preview element is correctly mounted and rendered
      setActiveTab("preview");
      setTimeout(async () => {
        const nameSanitized = (cvData.personalInfo.fullName || "CV").replace(/\s+/g, "_");
        await downloadCVAsPDF("cv-preview-paper", `CV_${nameSanitized}.pdf`);
        showNotification("success", "PDF descargado correctamente");
      }, 500);
    } catch (e: any) {
      showNotification("error", e.message || "Error al descargar PDF");
    }
  };

  const handleDocxDownload = async () => {
    try {
      showNotification("info", dict.loading);
      const nameSanitized = (cvData.personalInfo.fullName || "CV").replace(/\s+/g, "_");
      await downloadCVAsDocx(cvData, dict, `CV_${nameSanitized}.docx`);
      showNotification("success", "DOCX descargado correctamente");
    } catch (e: any) {
      showNotification("error", e.message || "Error al descargar Word");
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"}`}>
      {/* Top Banner Warning if required variables are missing */}
      {!isValid && (
        <div className="bg-amber-500 text-white px-4 py-2 text-center text-xs font-semibold flex items-center justify-center gap-2 shadow-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{dict.missingRequired}</span>
        </div>
      )}

      {/* Floating Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3.5 rounded-xl shadow-xl text-xs font-medium border ${
              notification.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-100 dark:bg-emerald-950/90 dark:text-emerald-100 dark:border-emerald-900"
                : notification.type === "error"
                ? "bg-rose-50 text-rose-800 border-rose-100 dark:bg-rose-950/90 dark:text-rose-100 dark:border-rose-900"
                : "bg-blue-50 text-blue-800 border-blue-100 dark:bg-blue-950/90 dark:text-blue-100 dark:border-blue-900"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-500" />
            )}
            <span>{notification.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER BAR */}
      <header className="bg-slate-900 text-white h-16 flex items-center justify-between px-4 sm:px-8 shadow-md shrink-0 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between h-full">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab("home")}>
            <div className="w-8 h-8 bg-sky-400 rounded-lg flex items-center justify-center shadow-md">
              <span className="font-bold text-slate-900 text-sm">CP</span>
            </div>
            <div>
              <span className="text-xl font-semibold tracking-tight text-white">
                CV Builder <span className="text-sky-400">Pro</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            {[
              { id: "home", label: dict.tabHome, icon: Compass },
              { id: "create", label: dict.tabCreate, icon: User },
              { id: "templates", label: dict.tabTemplates, icon: Layout },
              { id: "preview", label: dict.tabPreview, icon: Eye },
              { id: "download", label: dict.tabDownload, icon: Download },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-link-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1.5 pb-1 font-medium text-sm transition-all cursor-pointer border-b-2 ${
                    isSelected
                      ? "text-white border-sky-400 font-semibold"
                      : "text-slate-300 border-transparent hover:text-white hover:border-slate-500"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Configuration and Controls */}
          <div className="flex items-center space-x-3">
            {/* Display Language selector */}
            <div className="flex bg-slate-800 rounded-full p-1 border border-slate-700/40">
              <button
                onClick={() => setLang("es")}
                className={`px-3 py-1 text-xs rounded-full font-bold uppercase transition-all cursor-pointer ${
                  lang === "es"
                    ? "bg-sky-400 text-slate-900"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                ES
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-3 py-1 text-xs rounded-full font-bold uppercase transition-all cursor-pointer ${
                  lang === "en"
                    ? "bg-sky-400 text-slate-900"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                EN
              </button>
            </div>

            {/* Dark Mode toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition shadow-sm cursor-pointer"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
            </button>

            {/* Clear Form */}
            <button
              onClick={handleClearForm}
              title={dict.clearForm}
              className="p-2 rounded-xl bg-rose-950/20 border border-rose-900/50 text-rose-400 hover:bg-rose-900/40 transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE TAB DRAWER BAR */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200/80 dark:border-slate-800/80 fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 py-2.5 z-40 backdrop-blur-md shadow-lg">
        {[
          { id: "home", label: dict.tabHome, icon: Compass },
          { id: "create", label: dict.tabCreate, icon: User },
          { id: "templates", label: dict.tabTemplates, icon: Layout },
          { id: "preview", label: dict.tabPreview, icon: Eye },
          { id: "download", label: dict.tabDownload, icon: Download },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 cursor-pointer ${
                isSelected ? "text-blue-600 dark:text-blue-400" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] font-bold tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-12">
        
        {/* PROGRESS ENGINE & GLOBAL ACTIONS HERO */}
        {activeTab !== "home" && (
          <div className={`mb-8 p-5 rounded-2xl border transition-all ${isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200/60 shadow-sm"}`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-5">
              
              {/* Progress bar info */}
              <div className="w-full md:w-1/2 space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span>{dict.progressBar}</span>
                  <span className="text-sky-500 dark:text-sky-400">{progress}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-400 transition-all duration-500 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                  <span>{dict.autoSaved} en LocalStorage</span>
                </div>
              </div>

              {/* Smart AI translation engine button */}
              <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3 justify-end items-stretch sm:items-center">
                <button
                  onClick={handleAITranslate}
                  disabled={isTranslating}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-lg hover:shadow-slate-500/10 active:scale-95 transition-all inline-flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
                >
                  {isTranslating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                      <span>{dict.aiTranslateBtnWorking}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
                      <span>
                        {lang === "es"
                          ? "Traducir CV al Inglés con IA"
                          : "Translate CV to Spanish with AI"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVE ROUTE / TAB RENDER */}
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.div
              key="tab-home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-12"
            >
              {/* HEADING HERO */}
              <div className="text-center space-y-4 max-w-3xl mx-auto py-8">
                <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-widest border border-blue-100/30">
                  Estilo Profesional y Elegante
                </span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none bg-gradient-to-r from-[#0f172a] via-[#1e3a8a] to-[#2563eb] dark:from-white dark:via-blue-200 dark:to-sky-400 bg-clip-text text-transparent">
                  {dict.subtitle}
                </h2>
                <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
                  Completa tu perfil en simples pasos, traduce automáticamente todo el contenido con Inteligencia Artificial (Gemini) y exporta en PDF y Word listos para imprimir.
                </p>
                
                <div className="pt-4 flex justify-center gap-3">
                  <button
                    onClick={() => setActiveTab("create")}
                    className="bg-[#0f172a] dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-bold text-xs tracking-wider uppercase hover:shadow-lg transition cursor-pointer"
                  >
                    Comenzar Ahora
                  </button>
                  <button
                    onClick={() => setActiveTab("templates")}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-xl font-bold text-xs tracking-wider uppercase hover:bg-slate-50 transition cursor-pointer"
                  >
                    Ver Plantillas
                  </button>
                </div>
              </div>

              {/* BENTO GRID ACCENTS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`p-6 rounded-2xl border ${isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-100 shadow-sm"} space-y-3`}>
                  <div className="bg-slate-900 text-sky-400 p-3 rounded-xl w-fit shadow-md">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">Traducción con Gemini AI</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Traduce no solo los títulos, sino toda la redacción de tu perfil, tus experiencias previas y tus estudios con la potencia del modelo Gemini de Google.
                  </p>
                </div>

                <div className={`p-6 rounded-2xl border ${isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-100 shadow-sm"} space-y-3`}>
                  <div className="bg-slate-900 text-sky-400 p-3 rounded-xl w-fit shadow-md">
                    <Layout className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">5 Plantillas Premium</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Cambia de plantillas en tiempo real. Formatos Clásico, Moderno, Minimalista, Creativo y Ejecutivo aprobados por profesionales de reclutamiento.
                  </p>
                </div>

                <div className={`p-6 rounded-2xl border ${isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-100 shadow-sm"} space-y-3`}>
                  <div className="bg-slate-900 text-sky-400 p-3 rounded-xl w-fit shadow-md">
                    <Download className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">Exportación Dual</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Descarga en PDF con maquetación de alta definición pixel-perfect, o en formato Word .docx 100% editable para mayor versatilidad.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "create" && (
            <motion.div
              key="tab-create"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <CVForm cvData={cvData} onChange={setCvData} dict={dict} />
            </motion.div>
          )}

          {activeTab === "templates" && (
            <motion.div
              key="tab-templates"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{dict.selectTemplate}</h3>
                <p className="text-xs text-slate-400">Cada plantilla está diseñada con rigurosidad estética y espacial.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { id: "classic", label: dict.templateClassic, desc: dict.templateClassicDesc, color: "from-slate-700 to-slate-900" },
                  { id: "modern", label: dict.templateModern, desc: dict.templateModernDesc, color: "from-blue-700 to-slate-900" },
                  { id: "minimalist", label: dict.templateMinimalist, desc: dict.templateMinimalistDesc, color: "from-slate-100 to-slate-300 text-slate-800 border" },
                  { id: "creative", label: dict.templateCreative, desc: dict.templateCreativeDesc, color: "from-indigo-600 to-sky-500" },
                  { id: "executive", label: dict.templateExecutive, desc: dict.templateExecutiveDesc, color: "from-amber-600 to-slate-900" },
                ].map((temp) => {
                  const isSel = template === temp.id;
                  return (
                    <button
                      key={temp.id}
                      onClick={() => {
                        setTemplate(temp.id as CVTemplateType);
                        showNotification("success", `Plantilla cambiada a: ${temp.label}`);
                      }}
                      className={`text-left p-6 rounded-2xl border transition-all cursor-pointer ${
                        isSel
                          ? "ring-2 ring-sky-400 border-sky-400 bg-sky-950/10 dark:bg-sky-950/20"
                          : "border-slate-200/60 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                      }`}
                    >
                      <div className={`h-32 rounded-xl mb-4 bg-gradient-to-tr ${temp.color} p-4 flex flex-col justify-between shadow-sm overflow-hidden`}>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-black/20 backdrop-blur-md px-2.5 py-1 rounded-md w-fit">
                          {temp.id}
                        </span>
                        <div className="w-full space-y-1.5 opacity-90">
                          <div className="h-2 w-2/3 bg-white/40 rounded" />
                          <div className="h-1.5 w-full bg-white/20 rounded" />
                          <div className="h-1.5 w-5/6 bg-white/20 rounded" />
                        </div>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">{temp.label}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{temp.desc}</p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === "preview" && (
            <motion.div
              key="tab-preview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-sm">
                <div className="text-center sm:text-left">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Vista Previa A4 interactiva</h4>
                  <p className="text-xs text-slate-400">Tu diseño se amolda de forma impecable. Edita el CV para ver cambios inmediatos.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handlePdfDownload}
                    className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </button>
                  <button
                    onClick={handleDocxDownload}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>DOCX</span>
                  </button>
                </div>
              </div>

              <CVPreview cvData={cvData} template={template} dict={dict} />
            </motion.div>
          )}

          {activeTab === "download" && (
            <motion.div
              key="tab-download"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-2xl mx-auto space-y-6"
            >
              <div className={`p-8 rounded-2xl border text-center space-y-6 ${isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-100 shadow-sm"}`}>
                <div className="bg-slate-900 text-sky-400 p-4 rounded-full w-fit mx-auto shadow-md">
                  <Download className="w-8 h-8" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{dict.downloadTitle}</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">{dict.downloadSub}</p>
                </div>

                {!isValid && (
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/50 text-amber-800 dark:text-amber-200 text-xs font-medium inline-flex items-center gap-2 max-w-md mx-auto">
                    <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
                    <span>{dict.missingRequired}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                  <button
                    onClick={handlePdfDownload}
                    disabled={!isValid}
                    className="bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-extrabold text-xs tracking-wider uppercase px-6 py-4 rounded-xl shadow-lg shadow-rose-500/10 active:scale-95 transition-all inline-flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{dict.btnPdf}</span>
                  </button>

                  <button
                    onClick={handleDocxDownload}
                    disabled={!isValid}
                    className="bg-gradient-to-r from-slate-800 to-slate-950 hover:from-slate-900 hover:to-black text-white font-extrabold text-xs tracking-wider uppercase px-6 py-4 rounded-xl shadow-lg shadow-slate-900/10 active:scale-95 transition-all inline-flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{dict.btnDocx}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className={`border-t py-6 transition-colors text-center text-xs ${isDarkMode ? "bg-slate-950/40 border-slate-900/60 text-slate-500" : "bg-slate-50/50 border-slate-200/50 text-slate-400"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 CV Builder Pro. Creado por <span className="font-semibold text-slate-700 dark:text-slate-300 hover:text-sky-400 transition-colors">Marcelo Pereira</span>.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer">Soporte</span>
            <span className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer">Privacidad</span>
            <span className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer">Términos</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
