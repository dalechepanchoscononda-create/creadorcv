export interface PersonalInfo {
  fullName: string;
  birthDate: string;
  nationality: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  linkedin: string;
  website: string;
  photoUrl: string; // Base64 or local URL
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  startYear: string;
  endYear: string;
  description: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  level: string; // e.g. Nativo, Bilingüe, Avanzado, Intermedio, Básico
}

export interface CertificationItem {
  id: string;
  name: string;
  institution: string;
  year: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string; // Comma separated or text
}

export interface ReferenceItem {
  id: string;
  name: string;
  position: string;
  company: string;
  phone: string;
  email: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  profileSummary: string;
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: string[];
  languages: LanguageItem[];
  certifications: CertificationItem[];
  projects: ProjectItem[];
  references: ReferenceItem[];
}

export type CVTemplateType = "classic" | "modern" | "minimalist" | "creative" | "executive";

export interface Dictionary {
  // General labels
  title: string;
  subtitle: string;
  langSelect: string;
  clearForm: string;
  clearConfirm: string;
  autoSaved: string;
  progressBar: string;
  missingRequired: string;
  loading: string;
  success: string;
  error: string;
  
  // Tabs
  tabHome: string;
  tabCreate: string;
  tabTemplates: string;
  tabPreview: string;
  tabDownload: string;

  // Sections
  personalInfo: string;
  profileSummary: string;
  education: string;
  experience: string;
  skills: string;
  languages: string;
  certifications: string;
  projects: string;
  references: string;

  // Personal Fields
  fullName: string;
  birthDate: string;
  nationality: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  linkedin: string;
  website: string;
  photo: string;
  photoUpload: string;
  photoReplace: string;

  // Education Fields
  institution: string;
  degree: string;
  startYear: string;
  endYear: string;
  description: string;
  addEducation: string;

  // Experience Fields
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  addExperience: string;

  // Skills Fields
  addSkillPlaceholder: string;
  skillsHelp: string;

  // Languages Fields
  language: string;
  level: string;
  addLanguage: string;

  // Certifications Fields
  certName: string;
  certInstitution: string;
  certYear: string;
  addCertification: string;

  // Projects Fields
  projectName: string;
  projectTech: string;
  addProject: string;

  // References Fields
  refName: string;
  refPosition: string;
  refCompany: string;
  addReference: string;

  // Template select
  selectTemplate: string;
  templateClassic: string;
  templateClassicDesc: string;
  templateModern: string;
  templateModernDesc: string;
  templateMinimalist: string;
  templateMinimalistDesc: string;
  templateCreative: string;
  templateCreativeDesc: string;
  templateExecutive: string;
  templateExecutiveDesc: string;

  // Download section
  downloadTitle: string;
  downloadSub: string;
  btnPdf: string;
  btnDocx: string;
  
  // AI Translation Section
  aiTranslateTitle: string;
  aiTranslateBtn: string;
  aiTranslateBtnWorking: string;
  aiTranslateHelp: string;
}
