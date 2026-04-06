"use client";

import React from "react";
import { useResume, ResumeData } from "@/app/dashboard/resume-builder/ResumeContext";

export function SimpleTemplate({ innerRef, overrideData }: { innerRef?: React.Ref<HTMLDivElement>, overrideData?: ResumeData }) {
  const { data: contextData } = useResume();
  const data = overrideData || contextData;

  return (
    <div ref={innerRef} className="bg-white w-[800px] h-[1131px] p-12 text-black mx-auto overflow-hidden text-sm shadow-xl shrink-0" style={{ transformOrigin: 'top center' }}>
      <header className="border-b-2 border-black pb-4 mb-5 text-center">
        <h1 className="text-4xl font-bold uppercase tracking-wider mb-2">{data.fullName || "Your Name"}</h1>
        <div className="flex justify-center gap-4 text-gray-700 text-xs flex-wrap">
          <span>{data.email || "email@example.com"}</span>
          <span>•</span>
          <span>{data.phone || "(123) 456-7890"}</span>
          {data.linkedin && (
            <>
              <span>•</span>
              <span>{data.linkedin}</span>
            </>
          )}
          {data.website && (
            <>
              <span>•</span>
              <span>{data.website}</span>
            </>
          )}
        </div>
      </header>

      {data.summary && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 mb-2 border-b border-gray-300 pb-1">Professional Summary</h2>
          <p className="text-gray-800 leading-relaxed text-[13px]">{data.summary}</p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 mb-3 border-b border-gray-300 pb-1">Experience</h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-[14px] text-black">{exp.role || "Role"}</h3>
                  <span className="text-xs font-medium text-gray-600">{exp.duration || "Duration"}</span>
                </div>
                <div className="text-[13px] font-semibold text-gray-700 mb-1.5">{exp.company || "Company Name"}</div>
                <p className="text-[13px] text-gray-800 whitespace-pre-wrap leading-relaxed">{exp.description || "Describe your responsibilities and achievements..."}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 mb-3 border-b border-gray-300 pb-1">Projects</h2>
          <div className="space-y-4">
            {data.projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-[14px] text-black">{proj.name || "Project Name"}</h3>
                </div>
                <div className="text-xs font-medium text-gray-600 mb-1.5">Tech Stack: {proj.techStack || "Technologies used"}</div>
                <p className="text-[13px] text-gray-800 whitespace-pre-wrap leading-relaxed">{proj.description || "Describe the project..."}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 mb-3 border-b border-gray-300 pb-1">Education</h2>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-bold text-[14px] text-black">{edu.institution || "Institution Name"}</h3>
                  <div className="text-[13px] text-gray-700">{edu.degree || "Degree"}</div>
                </div>
                <span className="text-xs font-medium text-gray-600">{edu.year || "Year"}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.skills && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 mb-2 border-b border-gray-300 pb-1">Skills</h2>
          <p className="text-[13px] text-gray-800 leading-relaxed">{data.skills}</p>
        </section>
      )}
    </div>
  );
}
