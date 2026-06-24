import React from "react";
import { CVData, CVTemplateType, Dictionary } from "../types";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Calendar,
  Award,
  BookOpen,
  Briefcase,
  Layers,
  GraduationCap,
  Wrench,
} from "lucide-react";

interface CVPreviewProps {
  cvData: CVData;
  template: CVTemplateType;
  dict: Dictionary;
}

export default function CVPreview({ cvData, template, dict }: CVPreviewProps) {
  const { personalInfo, profileSummary, education, experience, skills, languages, certifications, projects, references } = cvData;

  // Helper to format contact details cleanly
  const renderContactItem = (icon: React.ReactNode, value: string, textClass = "text-slate-700") => {
    if (!value) return null;
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="text-blue-500 flex-shrink-0">{icon}</span>
        <span className={`${textClass} break-all`}>{value}</span>
      </div>
    );
  };

  // Template 1: CLASSIC PROFESSIONAL
  const renderClassic = () => {
    return (
      <div className="p-8 text-slate-800 bg-white min-h-[1123px] font-sans">
        {/* Header */}
        <div className="text-center border-b-2 border-slate-900 pb-5 mb-6">
          {personalInfo.photoUrl && (
            <div className="mb-4 flex justify-center">
              <img
                src={personalInfo.photoUrl}
                alt={personalInfo.fullName}
                className="w-24 h-24 rounded-full object-cover border-2 border-slate-900 shadow-sm"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          <h1 className="text-3xl font-bold uppercase tracking-wide text-slate-900 mb-1">
            {personalInfo.fullName || "Tu Nombre Completo"}
          </h1>
          <p className="text-sm tracking-wider font-semibold text-slate-500 uppercase">
            {experience[0]?.position || "Título Profesional"}
          </p>

          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-3 text-slate-600 max-w-2xl mx-auto">
            {renderContactItem(<Mail className="w-3.5 h-3.5" />, personalInfo.email, "text-slate-600")}
            {renderContactItem(<Phone className="w-3.5 h-3.5" />, personalInfo.phone, "text-slate-600")}
            {personalInfo.city && renderContactItem(<MapPin className="w-3.5 h-3.5" />, `${personalInfo.city}, ${personalInfo.country}`, "text-slate-600")}
            {renderContactItem(<Linkedin className="w-3.5 h-3.5" />, personalInfo.linkedin, "text-slate-600")}
            {renderContactItem(<Globe className="w-3.5 h-3.5" />, personalInfo.website, "text-slate-600")}
          </div>
        </div>

        {/* Profile summary */}
        {profileSummary && (
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              {dict.profileSummary}
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed text-justify">{profileSummary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
              {dict.experience}
            </h3>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="text-xs">
                  <div className="flex justify-between font-bold text-slate-900 mb-0.5">
                    <span>{exp.position} — {exp.company}</span>
                    <span className="text-slate-500 font-normal whitespace-nowrap">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  {exp.description && (
                    <p className="text-slate-600 mt-1 leading-relaxed text-justify whitespace-pre-line">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
              {dict.education}
            </h3>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="text-xs">
                  <div className="flex justify-between font-bold text-slate-900 mb-0.5">
                    <span>{edu.degree}</span>
                    <span className="text-slate-500 font-normal whitespace-nowrap">{edu.startYear} - {edu.endYear}</span>
                  </div>
                  <div className="text-slate-700 font-medium">{edu.institution}</div>
                  {edu.description && (
                    <p className="text-slate-600 mt-1 leading-relaxed">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Two-column layout for Skills/Languages & Certifications/Projects */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Sub-column */}
          <div className="space-y-6">
            {/* Skills */}
            {skills.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                  {dict.skills}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <span key={skill} className="bg-slate-100 text-slate-800 text-[10px] font-semibold px-2.5 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                  {dict.languages}
                </h3>
                <div className="space-y-1">
                  {languages.map((lang) => (
                    <div key={lang.id} className="text-xs flex justify-between text-slate-700">
                      <span className="font-semibold">{lang.language}</span>
                      <span className="text-slate-500">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sub-column */}
          <div className="space-y-6">
            {/* Certifications */}
            {certifications.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                  {dict.certifications}
                </h3>
                <div className="space-y-2">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="text-xs">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{cert.name}</span>
                        <span className="text-slate-500 font-normal">{cert.year}</span>
                      </div>
                      <p className="text-slate-600">{cert.institution}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                  {dict.projects}
                </h3>
                <div className="space-y-2">
                  {projects.map((proj) => (
                    <div key={proj.id} className="text-xs">
                      <div className="font-bold text-slate-900">{proj.name}</div>
                      {proj.technologies && (
                        <div className="text-[10px] font-semibold text-blue-600 my-0.5">{proj.technologies}</div>
                      )}
                      <p className="text-slate-600">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* References */}
        {references.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
              {dict.references}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {references.map((ref) => (
                <div key={ref.id} className="text-xs p-2.5 bg-slate-50 rounded">
                  <div className="font-bold text-slate-950">{ref.name}</div>
                  <div className="text-slate-500 font-medium">{ref.position} — {ref.company}</div>
                  <div className="text-slate-600 mt-1 flex flex-col gap-0.5">
                    {ref.phone && <span>Tel: {ref.phone}</span>}
                    {ref.email && <span className="break-all">Email: {ref.email}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Template 2: MODERN (Sidebar design)
  const renderModern = () => {
    return (
      <div className="min-h-[1123px] bg-white text-slate-800 flex font-sans">
        {/* Left Sidebar */}
        <div className="w-[32%] bg-slate-900 text-slate-200 p-6 flex flex-col gap-6">
          {personalInfo.photoUrl ? (
            <div className="flex justify-center mb-2">
              <img
                src={personalInfo.photoUrl}
                alt={personalInfo.fullName}
                className="w-28 h-28 rounded-full object-cover border-4 border-slate-800 shadow-lg"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-2 border border-slate-700">
              <span className="text-slate-400 text-xs font-semibold">FOTO</span>
            </div>
          )}

          {/* Contact Details */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 border-b border-slate-800 pb-1 mb-3">
              {dict.personalInfo}
            </h3>
            <div className="space-y-3.5 text-[11px] text-slate-300">
              {personalInfo.email && (
                <div className="flex items-start gap-2">
                  <Mail className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="break-all">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-start gap-2">
                  <Phone className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.city && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>{personalInfo.city}, {personalInfo.country}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-start gap-2">
                  <Linkedin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="break-all">{personalInfo.linkedin}</span>
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-start gap-2">
                  <Globe className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="break-all">{personalInfo.website}</span>
                </div>
              )}
              {personalInfo.birthDate && (
                <div className="text-[10px] text-slate-400 mt-2">
                  {dict.birthDate}: {personalInfo.birthDate}
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 border-b border-slate-800 pb-1 mb-3">
                {dict.skills}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span key={skill} className="bg-slate-800 text-slate-200 text-[10px] px-2 py-0.5 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 border-b border-slate-800 pb-1 mb-3">
                {dict.languages}
              </h3>
              <div className="space-y-2 text-[11px]">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex flex-col">
                    <span className="font-semibold text-slate-100">{lang.language}</span>
                    <span className="text-slate-400 text-[10px]">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Main Panel */}
        <div className="w-[68%] p-8 flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {personalInfo.fullName || "Tu Nombre Completo"}
            </h1>
            <p className="text-sm font-semibold text-blue-600 mt-1 uppercase tracking-wide">
              {experience[0]?.position || "Título Profesional"}
            </p>
          </div>

          {/* Profile Summary */}
          {profileSummary && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-200 pb-1 mb-2.5">
                {dict.profileSummary}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed text-justify">{profileSummary}</p>
            </div>
          )}

          {/* Work Experience */}
          {experience.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-200 pb-1 mb-3">
                {dict.experience}
              </h3>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="text-xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{exp.position}</span>
                      <span className="text-blue-600 font-semibold whitespace-nowrap">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <div className="text-slate-500 font-semibold mb-1">{exp.company}</div>
                    {exp.description && (
                      <p className="text-slate-600 leading-relaxed text-justify whitespace-pre-line">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-200 pb-1 mb-3">
                {dict.education}
              </h3>
              <div className="space-y-3.5">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{edu.degree}</span>
                      <span className="text-slate-500 font-normal whitespace-nowrap">{edu.startYear} - {edu.endYear}</span>
                    </div>
                    <div className="text-blue-600 font-medium">{edu.institution}</div>
                    {edu.description && (
                      <p className="text-slate-600 mt-0.5 leading-relaxed">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications & Projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {certifications.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-200 pb-1 mb-2.5">
                  {dict.certifications}
                </h3>
                <div className="space-y-2">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="text-[11px]">
                      <span className="font-bold text-slate-800">{cert.name}</span>
                      <span className="text-slate-500 text-[10px] block">{cert.institution} ({cert.year})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {projects.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-200 pb-1 mb-2.5">
                  {dict.projects}
                </h3>
                <div className="space-y-2">
                  {projects.map((proj) => (
                    <div key={proj.id} className="text-[11px]">
                      <span className="font-bold text-slate-800 block">{proj.name}</span>
                      {proj.technologies && (
                        <span className="text-[9px] font-bold text-blue-600">{proj.technologies}</span>
                      )}
                      <p className="text-slate-600 text-[10px] mt-0.5 leading-relaxed">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* References */}
          {references.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-200 pb-1 mb-3">
                {dict.references}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {references.map((ref) => (
                  <div key={ref.id} className="text-[11px] p-2 bg-slate-50 rounded-lg">
                    <span className="font-bold text-slate-800 block">{ref.name}</span>
                    <span className="text-slate-500 text-[10px] block">{ref.position} @ {ref.company}</span>
                    <span className="text-slate-600 text-[10px] block mt-1">{ref.phone || ref.email}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Template 3: MINIMALIST (Ultra clean design)
  const renderMinimalist = () => {
    return (
      <div className="p-10 text-slate-800 bg-white min-h-[1123px] font-sans flex flex-col gap-8">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-6">
          <div>
            <h1 className="text-3xl font-light tracking-wide text-slate-900">
              {personalInfo.fullName || "Tu Nombre Completo"}
            </h1>
            <p className="text-xs font-medium tracking-widest text-slate-400 uppercase mt-1">
              {experience[0]?.position || "Título Profesional"}
            </p>
          </div>

          {personalInfo.photoUrl && (
            <img
              src={personalInfo.photoUrl}
              alt={personalInfo.fullName}
              className="w-20 h-20 rounded-xl object-cover filter grayscale contrast-125 border border-slate-100 shadow-sm"
              referrerPolicy="no-referrer"
            />
          )}
        </div>

        {/* Contact Info Row */}
        <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-[11px] text-slate-500 font-medium">
          {personalInfo.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {personalInfo.email}</span>}
          {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {personalInfo.phone}</span>}
          {personalInfo.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {personalInfo.city}, {personalInfo.country}</span>}
          {personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" /> {personalInfo.linkedin}</span>}
          {personalInfo.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {personalInfo.website}</span>}
        </div>

        {/* Profile Summary */}
        {profileSummary && (
          <div className="text-xs">
            <p className="text-slate-600 leading-relaxed text-justify italic">{profileSummary}</p>
          </div>
        )}

        {/* Experience & Education Grid */}
        <div className="grid grid-cols-1 gap-6">
          {/* Work Experience */}
          {experience.length > 0 && (
            <div>
              <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase border-b border-slate-100 pb-1 mb-3">
                {dict.experience}
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="text-xs">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="font-bold text-slate-800">{exp.position}</span>
                      <span className="text-slate-400 text-[10px]">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <div className="text-slate-500 font-medium mb-1">{exp.company}</div>
                    {exp.description && (
                      <p className="text-slate-600 leading-relaxed text-justify">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase border-b border-slate-100 pb-1 mb-3">
                {dict.education}
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="font-bold text-slate-800">{edu.degree}</span>
                      <span className="text-slate-400 text-[10px]">{edu.startYear} - {edu.endYear}</span>
                    </div>
                    <div className="text-slate-500 font-medium">{edu.institution}</div>
                    {edu.description && (
                      <p className="text-slate-500 mt-1 leading-relaxed">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Skills & Languages Row */}
        <div className="grid grid-cols-2 gap-6">
          {skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase border-b border-slate-100 pb-1 mb-2.5">
                {dict.skills}
              </h2>
              <div className="flex flex-wrap gap-1">
                {skills.map((skill) => (
                  <span key={skill} className="bg-slate-50 text-slate-700 text-[10px] px-2 py-0.5 border border-slate-100 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {languages.length > 0 && (
            <div>
              <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase border-b border-slate-100 pb-1 mb-2.5">
                {dict.languages}
              </h2>
              <div className="space-y-1">
                {languages.map((lang) => (
                  <div key={lang.id} className="text-xs flex justify-between text-slate-600">
                    <span>{lang.language}</span>
                    <span className="text-slate-400 text-[10px]">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Certifications & Projects */}
        <div className="grid grid-cols-2 gap-6">
          {certifications.length > 0 && (
            <div>
              <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase border-b border-slate-100 pb-1 mb-2.5">
                {dict.certifications}
              </h2>
              <div className="space-y-2">
                {certifications.map((cert) => (
                  <div key={cert.id} className="text-xs">
                    <span className="font-semibold text-slate-800 block">{cert.name}</span>
                    <span className="text-slate-400 text-[10px]">{cert.institution} ({cert.year})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {projects.length > 0 && (
            <div>
              <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase border-b border-slate-100 pb-1 mb-2.5">
                {dict.projects}
              </h2>
              <div className="space-y-2">
                {projects.map((proj) => (
                  <div key={proj.id} className="text-xs">
                    <span className="font-semibold text-slate-800 block">{proj.name}</span>
                    <p className="text-slate-500 text-[10px] mt-0.5">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* References */}
        {references.length > 0 && (
          <div>
            <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase border-b border-slate-100 pb-1 mb-3">
              {dict.references}
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {references.map((ref) => (
                <div key={ref.id} className="text-[10px] text-slate-600">
                  <span className="font-semibold text-slate-800 block">{ref.name}</span>
                  <span className="text-slate-400 block">{ref.position}</span>
                  <span className="text-slate-400 block">{ref.company}</span>
                  <span className="text-slate-500 block mt-1">{ref.phone || ref.email}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Template 4: CREATIVE (Stylish Accent design)
  const renderCreative = () => {
    return (
      <div className="min-h-[1123px] bg-slate-50 text-slate-800 flex flex-col font-sans">
        {/* Modern Colorful Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-800 text-white p-8 rounded-b-[2rem] shadow-md relative">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {personalInfo.photoUrl && (
              <img
                src={personalInfo.photoUrl}
                alt={personalInfo.fullName}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white/20 shadow-lg flex-shrink-0"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-extrabold tracking-tight">{personalInfo.fullName || "Tu Nombre"}</h1>
              <p className="text-sm font-semibold text-sky-200 mt-1 uppercase tracking-wider">
                {experience[0]?.position || "Título Profesional"}
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1.5 mt-4 text-xs text-white/90">
                {personalInfo.email && <span className="bg-white/10 px-2.5 py-1 rounded-full">{personalInfo.email}</span>}
                {personalInfo.phone && <span className="bg-white/10 px-2.5 py-1 rounded-full">{personalInfo.phone}</span>}
                {personalInfo.city && <span className="bg-white/10 px-2.5 py-1 rounded-full">{personalInfo.city}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Content Body Grid */}
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Summary */}
            {profileSummary && (
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-2 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  <span>{dict.profileSummary}</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed text-justify">{profileSummary}</p>
              </div>
            )}

            {/* Work Experience */}
            {experience.length > 0 && (
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-4 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  <span>{dict.experience}</span>
                </h3>
                <div className="space-y-4 pl-3 border-l-2 border-indigo-100">
                  {experience.map((exp) => (
                    <div key={exp.id} className="relative text-xs">
                      {/* Timeline Dot */}
                      <span className="absolute -left-[18px] top-1.5 w-2 h-2 rounded-full bg-indigo-500 border-2 border-white ring-4 ring-indigo-50" />
                      
                      <div className="flex justify-between font-bold text-slate-900 mb-0.5">
                        <span>{exp.position}</span>
                        <span className="text-indigo-600 font-semibold whitespace-nowrap">{exp.startDate} - {exp.endDate}</span>
                      </div>
                      <div className="text-slate-500 font-semibold mb-1">{exp.company}</div>
                      {exp.description && (
                        <p className="text-slate-600 leading-relaxed whitespace-pre-line">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-3 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  <span>{dict.projects}</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((proj) => (
                    <div key={proj.id} className="text-xs border border-slate-50 p-3 rounded-xl bg-slate-50/40">
                      <span className="font-bold text-slate-800 block">{proj.name}</span>
                      {proj.technologies && (
                        <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full inline-block my-1">
                          {proj.technologies}
                        </span>
                      )}
                      <p className="text-slate-500 mt-0.5 text-[11px] leading-relaxed">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Sidebar Column */}
          <div className="space-y-6">
            {/* Skills */}
            {skills.length > 0 && (
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-3 flex items-center gap-1.5">
                  <Wrench className="w-4 h-4" />
                  <span>{dict.skills}</span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <span key={skill} className="bg-indigo-50 text-indigo-700 text-[10px] font-semibold px-2.5 py-1 rounded-lg">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-3 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" />
                  <span>{dict.education}</span>
                </h3>
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id} className="text-[11px]">
                      <div className="font-bold text-slate-800">{edu.degree}</div>
                      <div className="text-slate-500">{edu.institution}</div>
                      <span className="text-indigo-500 font-medium text-[10px]">{edu.startYear} - {edu.endYear}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-3 flex items-center gap-1.5">
                  <Globe className="w-4 h-4" />
                  <span>{dict.languages}</span>
                </h3>
                <div className="space-y-2 text-[11px]">
                  {languages.map((lang) => (
                    <div key={lang.id} className="flex justify-between items-center text-slate-600">
                      <span className="font-semibold">{lang.language}</span>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-medium text-slate-500">
                        {lang.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-3 flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  <span>{dict.certifications}</span>
                </h3>
                <div className="space-y-2">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="text-[11px]">
                      <span className="font-bold text-slate-800 block">{cert.name}</span>
                      <span className="text-slate-400 text-[10px] block">{cert.institution}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Template 5: EXECUTIVE (Elegant Navy & Gold Accents)
  const renderExecutive = () => {
    return (
      <div className="p-10 text-slate-800 bg-white min-h-[1123px] font-sans flex flex-col gap-6">
        {/* Executive Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b-4 border-[#0f172a] pb-5 mb-2">
          {personalInfo.photoUrl && (
            <img
              src={personalInfo.photoUrl}
              alt={personalInfo.fullName}
              className="w-24 h-24 rounded-full object-cover border-4 border-amber-100/50 shadow-md flex-shrink-0"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="text-center md:text-left flex-1 space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#0f172a] uppercase">
              {personalInfo.fullName || "Tu Nombre Completo"}
            </h1>
            <p className="text-sm font-bold tracking-widest text-amber-600 uppercase flex items-center gap-2 justify-center md:justify-start">
              <span>{experience[0]?.position || "Título Profesional"}</span>
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1.5 pt-3 text-[11px] text-slate-600">
              {personalInfo.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-amber-600" /> {personalInfo.email}</span>}
              {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-amber-600" /> {personalInfo.phone}</span>}
              {personalInfo.city && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-amber-600" /> {personalInfo.city}, {personalInfo.country}</span>}
              {personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3.5 h-3.5 text-amber-600" /> {personalInfo.linkedin}</span>}
              {personalInfo.website && <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-amber-600" /> {personalInfo.website}</span>}
            </div>
          </div>
        </div>

        {/* Executive Profile Summary */}
        {profileSummary && (
          <div className="bg-slate-50 p-4 rounded-lg border-l-4 border-amber-500">
            <p className="text-xs text-slate-700 leading-relaxed text-justify whitespace-pre-line">{profileSummary}</p>
          </div>
        )}

        {/* Executive experience */}
        {experience.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f172a] border-b-2 border-amber-500 pb-1 mb-3 flex items-center gap-1">
              <span className="bg-[#0f172a] text-white px-2 py-0.5 text-[10px] rounded uppercase">I</span>
              <span>{dict.experience}</span>
            </h3>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="text-xs">
                  <div className="flex justify-between font-bold text-[#0f172a]">
                    <span>{exp.position}</span>
                    <span className="text-amber-600 font-semibold whitespace-nowrap">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div className="text-slate-500 font-bold mb-1.5">{exp.company}</div>
                  {exp.description && (
                    <p className="text-slate-600 leading-relaxed text-justify whitespace-pre-line pl-3 border-l border-slate-200">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Executive education */}
        {education.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f172a] border-b-2 border-amber-500 pb-1 mb-3 flex items-center gap-1">
              <span className="bg-[#0f172a] text-white px-2 py-0.5 text-[10px] rounded uppercase">II</span>
              <span>{dict.education}</span>
            </h3>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="text-xs">
                  <div className="flex justify-between font-bold text-[#0f172a]">
                    <span>{edu.degree}</span>
                    <span className="text-slate-500 font-normal whitespace-nowrap">{edu.startYear} - {edu.endYear}</span>
                  </div>
                  <div className="text-amber-600 font-semibold">{edu.institution}</div>
                  {edu.description && (
                    <p className="text-slate-600 mt-1 leading-relaxed pl-3 border-l border-slate-200">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Multi Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f172a] border-b border-slate-200 pb-1 mb-2.5">
                {dict.skills}
              </h3>
              <div className="flex flex-wrap gap-1">
                {skills.map((skill) => (
                  <span key={skill} className="bg-slate-100 text-[#0f172a] border-l-2 border-amber-500 text-[10px] font-semibold px-2.5 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {languages.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f172a] border-b border-slate-200 pb-1 mb-2.5">
                {dict.languages}
              </h3>
              <div className="space-y-1">
                {languages.map((lang) => (
                  <div key={lang.id} className="text-xs flex justify-between text-slate-700">
                    <span className="font-semibold text-slate-800">{lang.language}</span>
                    <span className="text-amber-600 font-medium">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f172a] border-b border-slate-200 pb-1 mb-2.5">
                {dict.certifications}
              </h3>
              <div className="space-y-2">
                {certifications.map((cert) => (
                  <div key={cert.id} className="text-xs">
                    <span className="font-bold text-[#0f172a] block">{cert.name}</span>
                    <span className="text-slate-500 text-[10px]">{cert.institution} ({cert.year})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {projects.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f172a] border-b border-slate-200 pb-1 mb-2.5">
                {dict.projects}
              </h3>
              <div className="space-y-2">
                {projects.map((proj) => (
                  <div key={proj.id} className="text-xs">
                    <span className="font-bold text-slate-900 block">{proj.name}</span>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* References */}
        {references.length > 0 && (
          <div className="mt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f172a] border-b-2 border-amber-500 pb-1 mb-3">
              {dict.references}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {references.map((ref) => (
                <div key={ref.id} className="text-xs border border-slate-100 p-3 rounded bg-slate-50">
                  <div className="font-bold text-[#0f172a]">{ref.name}</div>
                  <div className="text-slate-500 font-semibold text-[11px]">{ref.position} — {ref.company}</div>
                  <div className="text-slate-600 mt-1">
                    {ref.phone && <span className="block">Tel: {ref.phone}</span>}
                    {ref.email && <span className="block break-all">Email: {ref.email}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTemplate = () => {
    switch (template) {
      case "classic":
        return renderClassic();
      case "modern":
        return renderModern();
      case "minimalist":
        return renderMinimalist();
      case "creative":
        return renderCreative();
      case "executive":
        return renderExecutive();
      default:
        return renderClassic();
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-2xl bg-slate-100 border border-slate-200 p-4 md:p-8 flex justify-center shadow-inner scrollbar-thin">
      <div
        id="cv-preview-paper"
        className="w-full max-w-[800px] shadow-2xl rounded-sm overflow-hidden"
        style={{ aspectRatio: "1/1.414" }} // Perfect A4 aspect ratio representation
      >
        {renderTemplate()}
      </div>
    </div>
  );
}
