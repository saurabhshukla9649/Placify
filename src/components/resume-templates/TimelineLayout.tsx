"use client";
import React from "react";
import { useResume, ResumeData } from "@/app/dashboard/resume-builder/ResumeContext";

export function TimelineLayout({ innerRef, overrideData }: { innerRef?: React.Ref<HTMLDivElement>, overrideData?: ResumeData }) {
  const { data: contextData } = useResume();
  const data = overrideData || contextData;

  return (
    <div ref={innerRef} className="bg-white w-[800px] h-[1131px] text-gray-800 mx-auto overflow-hidden relative shadow-xl shrink-0 p-12 flex flex-col font-sans" style={{ transformOrigin: 'top center' }}>
      
      <header className="mb-8">
        <h1 className="text-4xl font-bold uppercase tracking-tight text-emerald-700 mb-2">{data.fullName || "Your Name"}</h1>
        {data.summary && <p className="text-[14px] leading-relaxed text-gray-600 font-medium max-w-2xl">{data.summary}</p>}
        
        <div className="flex gap-4 text-xs font-semibold text-gray-500 mt-4 border-t border-gray-200 pt-3">
          <span>{data.email}</span>
          <span>{data.phone}</span>
          {data.linkedin && <span>{data.linkedin}</span>}
          {data.website && <span>{data.website}</span>}
        </div>
      </header>

      <div className="relative border-l-2 border-emerald-200 ml-3 pl-8 pb-4 space-y-10 flex-1">
        
        {data.experience.length > 0 && (
          <section className="relative">
            {/* Section Node */}
            <div className="absolute w-4 h-4 rounded-full bg-emerald-500 -left-[41px] top-1 border-4 border-white shadow-sm"></div>
            <h2 className="text-[18px] font-bold uppercase tracking-widest text-emerald-800 mb-6">Experience</h2>
            
            <div className="space-y-8">
              {data.experience.map(exp => (
                <div key={exp.id} className="relative">
                  <div className="absolute w-2 h-2 rounded-full bg-emerald-300 -left-[37px] top-2"></div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-[15px] text-gray-900">{exp.role}</h3>
                    <span className="text-[12px] font-bold text-gray-500">{exp.duration}</span>
                  </div>
                  <div className="text-[13px] font-bold text-emerald-600 mb-2">{exp.company}</div>
                  <p className="text-[13px] text-gray-600 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education.length > 0 && (
          <section className="relative">
             <div className="absolute w-4 h-4 rounded-full bg-emerald-500 -left-[41px] top-1 border-4 border-white shadow-sm"></div>
             <h2 className="text-[18px] font-bold uppercase tracking-widest text-emerald-800 mb-6">Education</h2>
             <div className="space-y-6">
                {data.education.map(edu => (
                  <div key={edu.id} className="relative">
                    <div className="absolute w-2 h-2 rounded-full bg-emerald-300 -left-[37px] top-2"></div>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-[14px] text-gray-900">{edu.degree}</h3>
                      <div className="text-[11px] font-bold text-emerald-700">{edu.year}</div>
                    </div>
                    <div className="text-[13px] text-gray-600 mt-1">{edu.institution}</div>
                  </div>
                ))}
            </div>
          </section>
        )}

      </div>

      <div className="grid grid-cols-2 gap-8 border-t border-emerald-200 pt-6 mt-4">
         {data.projects.length > 0 && (
           <section>
            <h2 className="text-[16px] font-bold uppercase tracking-widest text-emerald-800 mb-4">Projects</h2>
            <div className="space-y-4">
              {data.projects.map(proj => (
                <div key={proj.id}>
                  <h3 className="font-bold text-[13px] text-gray-900">{proj.name}</h3>
                  <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">{proj.techStack}</div>
                  <p className="text-[12px] text-gray-600 leading-relaxed whitespace-pre-wrap">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {data.skills && (
          <section>
            <h2 className="text-[16px] font-bold uppercase tracking-widest text-emerald-800 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.split(',').map((skill, i) => (
                <span key={i} className="text-[12px] font-semibold text-emerald-900 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">{skill.trim()}</span>
              ))}
            </div>
          </section>
        )}
      </div>

    </div>
  )
}
