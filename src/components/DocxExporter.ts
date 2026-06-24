import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
} from "docx";
import { CVData, Dictionary } from "../types";

/**
 * Generates and downloads a beautifully formatted MS Word document (.docx) from CVData.
 */
export async function downloadCVAsDocx(cvData: CVData, dict: Dictionary, fileName: string): Promise<void> {
  const { personalInfo, profileSummary, education, experience, skills, languages, certifications, projects, references } = cvData;

  // Helper to create styled section headings with horizontal borders
  const createSectionHeading = (title: string): Paragraph => {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 120 },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          color: "1e3a8a", // Soft dark blue
          size: 24, // 12pt
          font: "Arial",
        }),
      ],
      border: {
        bottom: {
          color: "cbd5e1", // Light grey border
          space: 4,
          style: BorderStyle.SINGLE,
          size: 12,
        },
      },
    });
  };

  const docChildren: any[] = [];

  // 1. HEADER (Name & Professional Title)
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 40 },
      children: [
        new TextRun({
          text: personalInfo.fullName || "TU NOMBRE COMPLETO",
          bold: true,
          color: "0f172a", // Dark Slate
          size: 40, // 20pt
          font: "Arial",
        }),
      ],
    })
  );

  const primaryRole = experience[0]?.position || "Profesional";
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: primaryRole.toUpperCase(),
          color: "475569", // Cool Grey
          size: 20, // 10pt
          bold: true,
          font: "Arial",
        }),
      ],
    })
  );

  // CONTACT INFORMATION LINE
  const contactParts: string[] = [];
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.city) contactParts.push(`${personalInfo.city}, ${personalInfo.country}`);
  if (personalInfo.linkedin) contactParts.push(personalInfo.linkedin);
  if (personalInfo.website) contactParts.push(personalInfo.website);

  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: contactParts.join("  |  "),
          color: "64748b",
          size: 18, // 9pt
          font: "Arial",
        }),
      ],
    })
  );

  // 2. PROFILE SUMMARY
  if (profileSummary) {
    docChildren.push(createSectionHeading(dict.profileSummary));
    docChildren.push(
      new Paragraph({
        spacing: { after: 180 },
        children: [
          new TextRun({
            text: profileSummary,
            size: 20, // 10pt
            font: "Arial",
          }),
        ],
      })
    );
  }

  // 3. WORK EXPERIENCE
  if (experience.length > 0) {
    docChildren.push(createSectionHeading(dict.experience));
    experience.forEach((exp) => {
      // Company and dates row
      docChildren.push(
        new Paragraph({
          spacing: { before: 100, after: 20 },
          children: [
            new TextRun({
              text: `${exp.position}   -   ${exp.company}`,
              bold: true,
              color: "0f172a",
              size: 20,
              font: "Arial",
            }),
            new TextRun({
              text: `      (${exp.startDate} - ${exp.endDate})`,
              italics: true,
              color: "64748b",
              size: 18,
              font: "Arial",
            }),
          ],
        })
      );

      // Tasks / Description
      if (exp.description) {
        docChildren.push(
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: exp.description,
                size: 20,
                font: "Arial",
              }),
            ],
          })
        );
      }
    });
  }

  // 4. EDUCATION
  if (education.length > 0) {
    docChildren.push(createSectionHeading(dict.education));
    education.forEach((edu) => {
      docChildren.push(
        new Paragraph({
          spacing: { before: 100, after: 20 },
          children: [
            new TextRun({
              text: `${edu.degree}   -   ${edu.institution}`,
              bold: true,
              color: "0f172a",
              size: 20,
              font: "Arial",
            }),
            new TextRun({
              text: `      (${edu.startYear} - ${edu.endYear})`,
              italics: true,
              color: "64748b",
              size: 18,
              font: "Arial",
            }),
          ],
        })
      );

      if (edu.description) {
        docChildren.push(
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: edu.description,
                size: 20,
                font: "Arial",
              }),
            ],
          })
        );
      }
    });
  }

  // 5. SKILLS
  if (skills.length > 0) {
    docChildren.push(createSectionHeading(dict.skills));
    docChildren.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: skills.join(", "),
            size: 20,
            font: "Arial",
          }),
        ],
      })
    );
  }

  // 6. LANGUAGES
  if (languages.length > 0) {
    docChildren.push(createSectionHeading(dict.languages));
    languages.forEach((lang) => {
      docChildren.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: `${lang.language}: `,
              bold: true,
              size: 20,
              font: "Arial",
            }),
            new TextRun({
              text: lang.level,
              size: 20,
              font: "Arial",
            }),
          ],
        })
      );
    });
  }

  // 7. CERTIFICATIONS
  if (certifications.length > 0) {
    docChildren.push(createSectionHeading(dict.certifications));
    certifications.forEach((cert) => {
      docChildren.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: `${cert.name}  -  ${cert.institution}`,
              bold: true,
              size: 20,
              font: "Arial",
            }),
            new TextRun({
              text: `  (${cert.year})`,
              italics: true,
              color: "64748b",
              size: 18,
              font: "Arial",
            }),
          ],
        })
      );
    });
  }

  // 8. PROJECTS
  if (projects.length > 0) {
    docChildren.push(createSectionHeading(dict.projects));
    projects.forEach((proj) => {
      docChildren.push(
        new Paragraph({
          spacing: { before: 100, after: 20 },
          children: [
            new TextRun({
              text: proj.name,
              bold: true,
              size: 20,
              font: "Arial",
            }),
          ],
        })
      );

      if (proj.technologies) {
        docChildren.push(
          new Paragraph({
            spacing: { after: 20 },
            children: [
              new TextRun({
                text: `${dict.projectTech.split(" ")[0]}: ${proj.technologies}`,
                italics: true,
                color: "1e3a8a",
                size: 18,
                font: "Arial",
              }),
            ],
          })
        );
      }

      if (proj.description) {
        docChildren.push(
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: proj.description,
                size: 20,
                font: "Arial",
              }),
            ],
          })
        );
      }
    });
  }

  // 9. REFERENCES
  if (references.length > 0) {
    docChildren.push(createSectionHeading(dict.references));
    references.forEach((ref) => {
      const contactInfo = [ref.phone, ref.email].filter(Boolean).join("  |  ");
      docChildren.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({
              text: ref.name,
              bold: true,
              size: 20,
              font: "Arial",
            }),
            new TextRun({
              text: `  -  ${ref.position} @ ${ref.company}`,
              color: "475569",
              size: 18,
              font: "Arial",
            }),
          ],
        })
      );

      if (contactInfo) {
        docChildren.push(
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: `Contacto: ${contactInfo}`,
                color: "64748b",
                size: 18,
                font: "Arial",
              }),
            ],
          })
        );
      }
    });
  }

  // Build Document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: docChildren,
      },
    ],
  });

  // Pack and Download
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
