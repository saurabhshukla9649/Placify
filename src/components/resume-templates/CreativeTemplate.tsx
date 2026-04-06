"use client";

import React from "react";
import { useResume, ResumeData } from "@/app/dashboard/resume-builder/ResumeContext";

export function CreativeTemplate({ innerRef, overrideData }: { innerRef?: React.Ref<HTMLDivElement>, overrideData?: ResumeData }) {
  const { data: contextData } = useResume();
  const data = overrideData || contextData;

  return (
    <div ref={innerRef} className="bg-white w-[800px] h-[1131px] text-gray-800 mx-auto overflow-hidden text-sm relative shadow-xl shrink-0" style={{ transformOrigin: 'top center' }}>
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-bl-full z-0 pointer-events-none"></div>
      
      <div className="relative z-10 px-12 pt-14 pb-10">
        <h1 className="text-[44px] font-black text-black tracking-tighter mb-3 leading-none">{data.fullName || "Your Name"}</h1>
        <div className="flex gap-4 text-blue-600 font-semibold text-xs uppercase tracking-wide">
          <span>{data.email || "email@example.com"}</span>
          <span>{data.phone || "(123) 456-7890"}</span>
          {data.linkedin && <span>{data.linkedin}</span>}
          {data.website && <span>{data.website}</span>}
        </div>
      </div>

      <div className="relative z-10 px-12 grid grid-cols-12 gap-10">
        <div className="col-span-8">
          {data.summary && (
            <div className="mb-10">
              <p className="text-[15px] leading-relaxed text-gray-700 font-medium italic border-l-4 border-blue-500 pl-4 py-1">{data.summary}</p>
            </div>
          )}
          
          {data.experience.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-black mb-6 flex items-center">
                <span className="w-8 h-1.5 bg-blue-500 mr-3"></span>
                EXPERIENCE
              </h2>
              <div className="space-y-8">
                {data.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-end mb-1.5">
                      <h3 className="text-lg font-extrabold text-gray-900">{exp.role || "Role"}</h3>
                      <span className="text-xs font-bold text-blue-600 px-2.5 py-1 bg-blue-50 rounded-md">{exp.duration || "Duration"}</span>
                    </div>
                    <div className="text-[13px] font-bold text-gray-500 mb-3 uppercase tracking-wider">{exp.company || "Company Name"}</div>
                    <p className="text-[14px] text-gray-600 whitespace-pre-wrap leading-relaxed">{exp.description || "Job Description"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.projects.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-black mb-6 flex items-center">
                <span className="w-8 h-1.5 bg-blue-500 mr-3"></span>
                PROJECTS
              </h2>
              <div className="space-y-6">
                {data.projects.map((proj) => (
                  <div key={proj.id} className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                    <h3 className="text-[16px] font-bold text-gray-900 mb-1">{proj.name || "Project Name"}</h3>
                    <div className="text-[12px] text-blue-600 font-mono mb-3 font-semibold">{proj.techStack || "Technologies"}</div>
                    <p className="text-[14px] text-gray-600 whitespace-pre-wrap leading-relaxed">{proj.description || "Description"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="col-span-4 space-y-10 border-l border-gray-100 pl-8">
          {data.skills && (
            <div>
              <h2 className="text-lg font-bold text-black mb-5 flex items-center">
                <span className="w-6 h-1 bg-gray-300 mr-3"></span>
                SKILLS
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.split(',').map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-md text-[12px] font-bold border border-gray-200 shadow-sm">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {data.education.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-black mb-5 flex items-center">
                <span className="w-6 h-1 bg-gray-300 mr-3"></span>
                EDUCATION
              </h2>
              <div className="space-y-6">
                {data.education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="text-[14px] font-bold text-gray-900 mb-1 leading-tight">{edu.degree || "Degree"}</h3>
                    <div className="text-[13px] text-gray-600 font-medium mb-1.5">{edu.institution || "Institution"}</div>
                    <div className="text-[12px] text-gray-400 font-mono font-semibold">{edu.year || "Year"}</div>
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
