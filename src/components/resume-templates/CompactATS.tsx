"use client";
import React from "react";
import { useResume, ResumeData } from "@/app/dashboard/resume-builder/ResumeContext";

export function CompactATS({ innerRef, overrideData }: { innerRef?: React.Ref<HTMLDivElement>, overrideData?: ResumeData }) {
  const { data: contextData } = useResume();
  const data = overrideData || contextData;

  return (
    <div ref={innerRef} className="bg-white w-[800px] h-[1131px] text-black mx-auto overflow-hidden relative shadow-xl shrink-0 p-8 flex flex-col font-sans" style={{ transformOrigin: 'top center' }}>
      
      {/* Super dense header */}
      <header className="mb-4">
        <h1 className="text-3xl font-black uppercase tracking-tight text-black">{data.fullName || "Your Name"}</h1>
        <div className="text-[11px] font-medium text-gray-600 mt-1 flex flex-wrap gap-x-4 gap-y-1">
          <span>{data.email}</span>
          <span>•</span>
          <span>{data.phone}</span>
          {data.linkedin && <><span>•</span><span>{data.linkedin}</span></>}
          {data.website && <><span>•</span><span>{data.website}</span></>}
        </div>
      </header>

      <div className="flex-1 space-y-3">
        {data.summary && (
          <div className="text-[12px] leading-tight text-gray-800 pb-2 border-b border-gray-300">{data.summary}</div>
        )}

        {data.experience.length > 0 && (
          <section>
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-black bg-gray-100 py-1 px-2 mb-2">Professional Experience</h2>
            <div className="space-y-3">
              {data.experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-bold text-[13px] text-black">{exp.role} <span className="font-normal text-gray-600">at {exp.company}</span></h3>
                    <span className="text-[11px] font-bold text-gray-500 whitespace-nowrap ml-4">{exp.duration}</span>
                  </div>
                  <p className="text-[11px] text-gray-800 leading-snug whitespace-pre-wrap">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.projects.length > 0 && (
           <section>
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-black bg-gray-100 py-1 px-2 mb-2 mt-2">Projects & Open Source</h2>
            <div className="grid grid-cols-2 gap-4">
              {data.projects.map(proj => (
                <div key={proj.id} className="border-l-2 border-black pl-2">
                  <h3 className="font-bold text-[12px]">{proj.name}</h3>
                  <div className="text-[10px] text-gray-600 font-mono mb-1">{proj.techStack}</div>
                  <p className="text-[11px] text-gray-800 leading-snug">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-5 gap-4 mt-2">
          {data.skills && (
             <section className="col-span-3">
               <h2 className="text-[13px] font-bold uppercase tracking-wider text-black bg-gray-100 py-1 px-2 mb-2">Technical Skills</h2>
               <p className="text-[11px] leading-relaxed font-mono">
                 {data.skills}
               </p>
             </section>
          )}

          {data.education.length > 0 && (
            <section className="col-span-2">
              <h2 className="text-[13px] font-bold uppercase tracking-wider text-black bg-gray-100 py-1 px-2 mb-2">Education</h2>
              <div className="space-y-2">
                {data.education.map(edu => (
                  <div key={edu.id}>
                     <h3 className="font-bold text-[12px] leading-tight">{edu.degree}</h3>
                     <div className="text-[11px] text-gray-600">{edu.institution}</div>
                     <div className="text-[10px] font-bold text-gray-400">{edu.year}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
