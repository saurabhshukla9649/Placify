"use client";

import React from "react";
import { useResume, ResumeData } from "@/app/dashboard/resume-builder/ResumeContext";

export function ModernTemplate({ innerRef, overrideData }: { innerRef?: React.Ref<HTMLDivElement>, overrideData?: ResumeData }) {
  const { data: contextData } = useResume();
  const data = overrideData || contextData;

  return (
    <div ref={innerRef} className="bg-white w-[800px] h-[1131px] flex flex-col text-black mx-auto overflow-hidden text-sm shadow-xl shrink-0" style={{ transformOrigin: 'top center' }}>
      <header className="bg-slate-800 text-white p-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">{data.fullName || "Your Name"}</h1>
        <div className="flex gap-5 text-slate-300 text-xs flex-wrap font-medium">
          <span>{data.email || "email@example.com"}</span>
          <span>{data.phone || "(123) 456-7890"}</span>
          {data.linkedin && <span>{data.linkedin}</span>}
          {data.website && <span>{data.website}</span>}
        </div>
      </header>

      <div className="flex flex-1">
        <div className="w-[35%] bg-slate-50 p-8 border-r border-slate-200">
          {data.summary && (
            <div className="mb-10">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800 mb-3 pb-2 border-b-2 border-slate-300">About Me</h2>
              <p className="text-[13px] leading-relaxed text-slate-700">{data.summary}</p>
            </div>
          )}
          {data.skills && (
            <div className="mb-10">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800 mb-3 pb-2 border-b-2 border-slate-300">Skills</h2>
              <p className="text-[13px] text-slate-700 leading-relaxed font-medium">{data.skills}</p>
            </div>
          )}
          {data.education.length > 0 && (
            <div className="mb-10">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800 mb-3 pb-2 border-b-2 border-slate-300">Education</h2>
              <div className="space-y-5">
                {data.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="text-[13px] font-bold text-slate-800">{edu.degree || "Degree"}</div>
                    <div className="text-[13px] text-slate-600 my-1">{edu.institution || "Institution"}</div>
                    <div className="text-xs text-slate-500 font-medium">{edu.year || "Year"}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="w-[65%] p-10">
          {data.experience.length > 0 && (
            <div className="mb-10">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800 mb-5 pb-2 border-b-2 border-slate-800">Experience</h2>
              <div className="space-y-7">
                {data.experience.map((exp) => (
                  <div key={exp.id} className="relative pl-5 border-l-2 border-slate-300">
                    <div className="absolute w-2.5 h-2.5 bg-slate-800 rounded-full -left-[6px] top-1"></div>
                    <h3 className="font-bold text-[15px] text-slate-900">{exp.role || "Role"}</h3>
                    <div className="text-[13px] text-slate-600 mb-2.5 font-medium">{exp.company || "Company"} <span className="mx-1.5">•</span> {exp.duration || "Duration"}</div>
                    <p className="text-[13px] text-slate-700 whitespace-pre-wrap leading-relaxed">{exp.description || "Description"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.projects.length > 0 && (
            <div className="mb-10">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800 mb-5 pb-2 border-b-2 border-slate-800">Projects</h2>
              <div className="space-y-7">
                {data.projects.map((proj) => (
                  <div key={proj.id} className="relative pl-5 border-l-2 border-slate-300">
                    <div className="absolute w-2.5 h-2.5 bg-slate-800 rounded-full -left-[6px] top-1"></div>
                    <h3 className="font-bold text-[15px] text-slate-900">{proj.name || "Project"}</h3>
                    <div className="text-[13px] text-slate-500 mb-2.5 font-medium">{proj.techStack || "Tech Stack"}</div>
                    <p className="text-[13px] text-slate-700 whitespace-pre-wrap leading-relaxed">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
