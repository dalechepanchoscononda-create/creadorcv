import React, { useState } from "react";
import { CVData, Dictionary } from "../types";
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Plus,
  Trash2,
  Cpu,
  Users,
  Tag,
  Upload,
  X,
  PlusCircle,
} from "lucide-react";

interface CVFormProps {
  cvData: CVData;
  onChange: (updatedData: CVData) => void;
  dict: Dictionary;
}

export default function CVForm({ cvData, onChange, dict }: CVFormProps) {
  const [activeSection, setActiveSection] = useState<string>("personal");
  const [skillInput, setSkillInput] = useState<string>("");

  // Helper to update specific sub-keys
  const updatePersonalInfo = (field: string, value: string) => {
    onChange({
      ...cvData,
      personalInfo: {
        ...cvData.personalInfo,
        [field]: value,
      },
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        updatePersonalInfo("photoUrl", event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    updatePersonalInfo("photoUrl", "");
  };

  // Generic helpers for lists
  const addListEntry = (field: "education" | "experience" | "languages" | "certifications" | "projects" | "references", defaultItem: any) => {
    onChange({
      ...cvData,
      [field]: [...cvData[field], { ...defaultItem, id: crypto.randomUUID() }],
    });
  };

  const removeListEntry = (field: "education" | "experience" | "languages" | "certifications" | "projects" | "references", id: string) => {
    onChange({
      ...cvData,
      [field]: cvData[field].filter((item: any) => item.id !== id),
    });
  };

  const updateListEntry = (
    field: "education" | "experience" | "languages" | "certifications" | "projects" | "references",
    id: string,
    key: string,
    value: string
  ) => {
    onChange({
      ...cvData,
      [field]: cvData[field].map((item: any) => {
        if (item.id === id) {
          return { ...item, [key]: value };
        }
        return item;
      }),
    });
  };

  // Skill tag input helpers
  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  };

  const addSkill = () => {
    const cleaned = skillInput.trim().replace(/,$/, "");
    if (cleaned && !cvData.skills.includes(cleaned)) {
      onChange({
        ...cvData,
        skills: [...cvData.skills, cleaned],
      });
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onChange({
      ...cvData,
      skills: cvData.skills.filter((s) => s !== skillToRemove),
    });
  };

  const sections = [
    { id: "personal", label: dict.personalInfo, icon: User },
    { id: "profile", label: dict.profileSummary, icon: Briefcase },
    { id: "experience", label: dict.experience, icon: Briefcase },
    { id: "education", label: dict.education, icon: GraduationCap },
    { id: "skills", label: dict.skills, icon: Tag },
    { id: "languages", label: dict.languages, icon: Globe },
    { id: "certifications", label: dict.certifications, icon: Award },
    { id: "projects", label: dict.projects, icon: Cpu },
    { id: "references", label: dict.references, icon: Users },
  ];

  return (
    <div id="cv-form-container" className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar Section selectors */}
      <div className="lg:col-span-1 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible space-x-2 lg:space-x-0 lg:space-y-1 pb-3 lg:pb-0 border-b lg:border-b-0 lg:border-r border-gray-200/80 pr-0 lg:pr-4 scrollbar-thin">
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              id={`section-tab-${sec.id}`}
              onClick={() => setActiveSection(sec.id)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap cursor-pointer border-l-4 ${
                isActive
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/10 border-sky-400 pl-3"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 border-transparent"
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-sky-400" : "text-slate-400"}`} />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* Editor Main Canvas */}
      <div className="lg:col-span-3 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm min-h-[500px]">
        {/* PERSONAL INFORMATION */}
        {activeSection === "personal" && (
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-sky-400 rounded-sm"></div>
              <span>{dict.personalInfo}</span>
            </h3>

            {/* Photo upload */}
            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <div className="relative w-24 h-24 bg-slate-200 rounded-full overflow-hidden flex items-center justify-center border-2 border-white shadow-sm flex-shrink-0">
                {cvData.personalInfo.photoUrl ? (
                  <img
                    src={cvData.personalInfo.photoUrl}
                    alt="CV Profile"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User className="w-10 h-10 text-slate-400" />
                )}
              </div>
              <div className="flex-1 text-center sm:text-left space-y-2">
                <p className="text-sm font-medium text-slate-800">{dict.photo}</p>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded-lg font-medium inline-flex items-center gap-1.5 transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{dict.photoUpload}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                  {cvData.personalInfo.photoUrl && (
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="bg-red-50 hover:bg-red-100 text-red-600 text-xs px-3 py-2 rounded-lg font-medium inline-flex items-center gap-1 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{dict.photoReplace}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {dict.fullName} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cvData.personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                  placeholder="Juan Pérez"
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{dict.email} <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={cvData.personalInfo.email}
                  onChange={(e) => updatePersonalInfo("email", e.target.value)}
                  placeholder="juan.perez@example.com"
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{dict.phone}</label>
                <input
                  type="text"
                  value={cvData.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                  placeholder="+54 9 11 1234-5678"
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{dict.birthDate}</label>
                <input
                  type="text"
                  value={cvData.personalInfo.birthDate}
                  onChange={(e) => updatePersonalInfo("birthDate", e.target.value)}
                  placeholder="15/08/1992"
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{dict.nationality}</label>
                <input
                  type="text"
                  value={cvData.personalInfo.nationality}
                  onChange={(e) => updatePersonalInfo("nationality", e.target.value)}
                  placeholder="Argentino"
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{dict.address}</label>
                <input
                  type="text"
                  value={cvData.personalInfo.address}
                  onChange={(e) => updatePersonalInfo("address", e.target.value)}
                  placeholder="Av. del Libertador 1500"
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{dict.city}</label>
                <input
                  type="text"
                  value={cvData.personalInfo.city}
                  onChange={(e) => updatePersonalInfo("city", e.target.value)}
                  placeholder="CABA"
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{dict.country}</label>
                <input
                  type="text"
                  value={cvData.personalInfo.country}
                  onChange={(e) => updatePersonalInfo("country", e.target.value)}
                  placeholder="Argentina"
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{dict.linkedin}</label>
                <input
                  type="text"
                  value={cvData.personalInfo.linkedin}
                  onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                  placeholder="linkedin.com/in/juanperez"
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{dict.website}</label>
                <input
                  type="text"
                  value={cvData.personalInfo.website}
                  onChange={(e) => updatePersonalInfo("website", e.target.value)}
                  placeholder="juanperez.dev"
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                />
              </div>
            </div>
          </div>
        )}

        {/* PROFILE SUMMARY */}
        {activeSection === "profile" && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-sky-400 rounded-sm"></div>
              <span>{dict.profileSummary}</span>
            </h3>
            <p className="text-xs text-slate-500">
              Escribe un breve resumen de tu carrera, habilidades clave y logros notables.
            </p>
            <textarea
              rows={8}
              value={cvData.profileSummary}
              onChange={(e) => onChange({ ...cvData, profileSummary: e.target.value })}
              placeholder="Desarrollador web con más de 5 años de experiencia diseñando soluciones robustas..."
              className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 resize-none leading-relaxed"
            />
          </div>
        )}

        {/* WORK EXPERIENCE */}
        {activeSection === "experience" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <div className="w-1 h-4 bg-sky-400 rounded-sm"></div>
                <span>{dict.experience}</span>
              </h3>
              <button
                type="button"
                onClick={() =>
                  addListEntry("experience", {
                    company: "",
                    position: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                  })
                }
                className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 font-medium px-3 py-1.5 rounded-lg transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{dict.addExperience}</span>
              </button>
            </div>

            {cvData.experience.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500 font-medium">No se han agregado experiencias laborales.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {cvData.experience.map((exp, index) => (
                  <div
                    key={exp.id}
                    className="p-5 border border-slate-100 rounded-xl bg-slate-50/50 relative space-y-4"
                  >
                    <button
                      type="button"
                      onClick={() => removeListEntry("experience", exp.id)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Experiencia #{index + 1}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">{dict.company}</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateListEntry("experience", exp.id, "company", e.target.value)}
                          placeholder="Global Tech S.A."
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">{dict.position}</label>
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => updateListEntry("experience", exp.id, "position", e.target.value)}
                          placeholder="Desarrollador Frontend Senior"
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">{dict.startDate}</label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => updateListEntry("experience", exp.id, "startDate", e.target.value)}
                          placeholder="Marzo 2020"
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">{dict.endDate}</label>
                        <input
                          type="text"
                          value={exp.endDate}
                          onChange={(e) => updateListEntry("experience", exp.id, "endDate", e.target.value)}
                          placeholder="Presente / Diciembre 2024"
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-600 mb-1">{dict.description}</label>
                        <textarea
                          rows={3}
                          value={exp.description}
                          onChange={(e) => updateListEntry("experience", exp.id, "description", e.target.value)}
                          placeholder="Liderazgo de equipo, maquetación de componentes e integración de APIs..."
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ACADEMIC BACKGROUND */}
        {activeSection === "education" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <div className="w-1 h-4 bg-sky-400 rounded-sm"></div>
                <span>{dict.education}</span>
              </h3>
              <button
                type="button"
                onClick={() =>
                  addListEntry("education", {
                    institution: "",
                    degree: "",
                    startYear: "",
                    endYear: "",
                    description: "",
                  })
                }
                className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 font-medium px-3 py-1.5 rounded-lg transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{dict.addEducation}</span>
              </button>
            </div>

            {cvData.education.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <GraduationCap className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500 font-medium">No se han agregado estudios o cursos.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {cvData.education.map((edu, index) => (
                  <div
                    key={edu.id}
                    className="p-5 border border-slate-100 rounded-xl bg-slate-50/50 relative space-y-4"
                  >
                    <button
                      type="button"
                      onClick={() => removeListEntry("education", edu.id)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Estudio #{index + 1}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">{dict.institution}</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => updateListEntry("education", edu.id, "institution", e.target.value)}
                          placeholder="Universidad Tecnológica Nacional"
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">{dict.degree}</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateListEntry("education", edu.id, "degree", e.target.value)}
                          placeholder="Licenciatura en Sistemas"
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">{dict.startYear}</label>
                        <input
                          type="text"
                          value={edu.startYear}
                          onChange={(e) => updateListEntry("education", edu.id, "startYear", e.target.value)}
                          placeholder="2015"
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">{dict.endYear}</label>
                        <input
                          type="text"
                          value={edu.endYear}
                          onChange={(e) => updateListEntry("education", edu.id, "endYear", e.target.value)}
                          placeholder="2020 / En curso"
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-600 mb-1">{dict.description}</label>
                        <textarea
                          rows={2}
                          value={edu.description}
                          onChange={(e) => updateListEntry("education", edu.id, "description", e.target.value)}
                          placeholder="Orientación en ingeniería de software, promedio académico 9.2..."
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SKILLS */}
        {activeSection === "skills" && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-sky-400 rounded-sm"></div>
              <span>{dict.skills}</span>
            </h3>
            <p className="text-xs text-slate-500">{dict.skillsHelp}</p>

            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder={dict.addSkillPlaceholder}
                className="flex-1 text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
              />
              <button
                type="button"
                onClick={addSkill}
                className="bg-[#0f172a] hover:bg-slate-800 text-white text-xs px-4 py-2.5 rounded-xl font-medium transition cursor-pointer"
              >
                Agregar
              </button>
            </div>

            {cvData.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-2">
                {cvData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-3 py-1 text-xs font-semibold transition hover:bg-blue-100/80"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-blue-500 hover:text-blue-700 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm font-medium">
                No se han agregado habilidades.
              </div>
            )}
          </div>
        )}

        {/* LANGUAGES */}
        {activeSection === "languages" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <div className="w-1 h-4 bg-sky-400 rounded-sm"></div>
                <span>{dict.languages}</span>
              </h3>
              <button
                type="button"
                onClick={() => addListEntry("languages", { language: "", level: "" })}
                className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 font-medium px-3 py-1.5 rounded-lg transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{dict.addLanguage}</span>
              </button>
            </div>

            {cvData.languages.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Globe className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500 font-medium">No se han agregado idiomas.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cvData.languages.map((lang, index) => (
                  <div
                    key={lang.id}
                    className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50/50 relative"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">{dict.language}</label>
                        <input
                          type="text"
                          value={lang.language}
                          onChange={(e) => updateListEntry("languages", lang.id, "language", e.target.value)}
                          placeholder="Español, Inglés, etc."
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">{dict.level}</label>
                        <select
                          value={lang.level}
                          onChange={(e) => updateListEntry("languages", lang.id, "level", e.target.value)}
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                        >
                          <option value="">Selecciona nivel</option>
                          <option value="Nativo">Nativo / Native</option>
                          <option value="Bilingüe">Bilingüe / Bilingual</option>
                          <option value="Avanzado C1/C2">Avanzado C1/C2 / Advanced</option>
                          <option value="Intermedio B1/B2">Intermedio B1/B2 / Intermediate</option>
                          <option value="Básico A1/A2">Básico A1/A2 / Basic</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeListEntry("languages", lang.id)}
                      className="text-slate-400 hover:text-red-500 transition self-center pt-5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CERTIFICATIONS */}
        {activeSection === "certifications" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <div className="w-1 h-4 bg-sky-400 rounded-sm"></div>
                <span>{dict.certifications}</span>
              </h3>
              <button
                type="button"
                onClick={() => addListEntry("certifications", { name: "", institution: "", year: "" })}
                className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 font-medium px-3 py-1.5 rounded-lg transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{dict.addCertification}</span>
              </button>
            </div>

            {cvData.certifications.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500 font-medium">No se han agregado certificaciones.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cvData.certifications.map((cert, index) => (
                  <div
                    key={cert.id}
                    className="p-5 border border-slate-100 rounded-xl bg-slate-50/50 relative space-y-4"
                  >
                    <button
                      type="button"
                      onClick={() => removeListEntry("certifications", cert.id)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Certificación #{index + 1}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-600 mb-1">{dict.certName}</label>
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) => updateListEntry("certifications", cert.id, "name", e.target.value)}
                          placeholder="AWS Certified Solutions Architect"
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">{dict.certYear}</label>
                        <input
                          type="text"
                          value={cert.year}
                          onChange={(e) => updateListEntry("certifications", cert.id, "year", e.target.value)}
                          placeholder="2022"
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                        />
                      </div>

                      <div className="md:col-span-3">
                        <label className="block text-xs font-semibold text-slate-600 mb-1">{dict.certInstitution}</label>
                        <input
                          type="text"
                          value={cert.institution}
                          onChange={(e) => updateListEntry("certifications", cert.id, "institution", e.target.value)}
                          placeholder="Amazon Web Services"
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROJECTS */}
        {activeSection === "projects" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <div className="w-1 h-4 bg-sky-400 rounded-sm"></div>
                <span>{dict.projects}</span>
              </h3>
              <button
                type="button"
                onClick={() => addListEntry("projects", { name: "", description: "", technologies: "" })}
                className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 font-medium px-3 py-1.5 rounded-lg transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{dict.addProject}</span>
              </button>
            </div>

            {cvData.projects.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Cpu className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500 font-medium">No se han agregado proyectos destacados.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cvData.projects.map((proj, index) => (
                  <div
                    key={proj.id}
                    className="p-5 border border-slate-100 rounded-xl bg-slate-50/50 relative space-y-4"
                  >
                    <button
                      type="button"
                      onClick={() => removeListEntry("projects", proj.id)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Proyecto #{index + 1}
                    </h4>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">{dict.projectName}</label>
                        <input
                          type="text"
                          value={proj.name}
                          onChange={(e) => updateListEntry("projects", proj.id, "name", e.target.value)}
                          placeholder="CV Builder Pro"
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">{dict.projectTech}</label>
                        <input
                          type="text"
                          value={proj.technologies}
                          onChange={(e) => updateListEntry("projects", proj.id, "technologies", e.target.value)}
                          placeholder="React, TypeScript, TailwindCSS, Express"
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">{dict.description}</label>
                        <textarea
                          rows={2}
                          value={proj.description}
                          onChange={(e) => updateListEntry("projects", proj.id, "description", e.target.value)}
                          placeholder="Plataforma interactiva para la creación y exportación de currículums profesionales en múltiples formatos..."
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* REFERENCES */}
        {activeSection === "references" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <div className="w-1 h-4 bg-sky-400 rounded-sm"></div>
                <span>{dict.references}</span>
              </h3>
              <button
                type="button"
                onClick={() =>
                  addListEntry("references", {
                    name: "",
                    position: "",
                    company: "",
                    phone: "",
                    email: "",
                  })
                }
                className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 font-medium px-3 py-1.5 rounded-lg transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{dict.addReference}</span>
              </button>
            </div>

            {cvData.references.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500 font-medium">No se han agregado referencias laborales.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cvData.references.map((ref, index) => (
                  <div
                    key={ref.id}
                    className="p-5 border border-slate-100 rounded-xl bg-slate-50/50 relative space-y-4"
                  >
                    <button
                      type="button"
                      onClick={() => removeListEntry("references", ref.id)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Referente #{index + 1}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">{dict.refName}</label>
                        <input
                          type="text"
                          value={ref.name}
                          onChange={(e) => updateListEntry("references", ref.id, "name", e.target.value)}
                          placeholder="Ing. María Becerra"
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">{dict.refPosition}</label>
                        <input
                          type="text"
                          value={ref.position}
                          onChange={(e) => updateListEntry("references", ref.id, "position", e.target.value)}
                          placeholder="Directora de Tecnología / CTO"
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">{dict.refCompany}</label>
                        <input
                          type="text"
                          value={ref.company}
                          onChange={(e) => updateListEntry("references", ref.id, "company", e.target.value)}
                          placeholder="ArgenSoftware S.R.L."
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">{dict.phone}</label>
                        <input
                          type="text"
                          value={ref.phone}
                          onChange={(e) => updateListEntry("references", ref.id, "phone", e.target.value)}
                          placeholder="+54 11 9876-5432"
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-600 mb-1">{dict.email}</label>
                        <input
                          type="email"
                          value={ref.email}
                          onChange={(e) => updateListEntry("references", ref.id, "email", e.target.value)}
                          placeholder="maria.becerra@company.com"
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
