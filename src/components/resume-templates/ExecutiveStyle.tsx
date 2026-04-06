"use client";
import React from "react";
import { useResume, ResumeData } from "@/app/dashboard/resume-builder/ResumeContext";

export function ExecutiveStyle({ innerRef, overrideData }: { innerRef?: React.Ref<HTMLDivElement>, overrideData?: ResumeData }) {
  const { data: contextData } = useResume();
  const data = overrideData || contextData;

  return (
    <div ref={innerRef} className="bg-[#fdfdfd] w-[800px] h-[1131px] text-gray-900 mx-auto overflow-hidden relative shadow-xl shrink-0 p-12 flex flex-col font-serif" style={{ transformOrigin: 'top center' }}>
      
      {/* Centered Header */}
      <header className="text-center mb-8 border-b-2 border-black pb-6">
        <h1 className="text-5xl font-normal tracking-wide uppercase mb-3 text-black">{data.fullName || "Your Name"}</h1>
        <div className="flex gap-4 justify-center text-sm font-sans tracking-widest text-gray-700 mx-auto flex-wrap px-12">
          <span>{data.email || "email@example.com"}</span>
          <span>{data.phone || "(123) 456-7890"}</span>
          {data.linkedin && <span>{data.linkedin}</span>}
          {data.website && <span>{data.website}</span>}
        </div>
      </header>

      <div className="flex-1 space-y-7 px-4">
        {data.summary && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-center mb-3">Professional Summary</h2>
            <p className="text-[13.5px] leading-relaxed text-justify indent-8 text-gray-800">{data.summary}</p>
          </section>
        )}

        {data.experience.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-center mb-4 mt-6 border-t border-gray-300 pt-6">Experience</h2>
            <div className="space-y-6">
              {data.experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-lg">{exp.company}</h3>
                    <span className="text-sm italic text-gray-600">{exp.duration}</span>
                  </div>
                  <div className="text-md italic text-gray-700 mb-2">{exp.role}</div>
                  <p className="text-[13px] text-gray-800 leading-relaxed whitespace-pre-wrap pl-4 border-l border-gray-200">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.projects.length > 0 && (
           <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-center mb-4 mt-6 border-t border-gray-300 pt-6">Key Projects</h2>
            <div className="space-y-5">
              {data.projects.map(proj => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline">
                     <h3 className="font-bold text-[15px]">{proj.name}</h3>
                     <span className="text-xs font-sans C text-gray-500 bg-gray-100 px-2 py-1">{proj.techStack}</span>
                  </div>
                  <p className="text-[13px] text-gray-800 mt-1 whitespace-pre-wrap">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-8 border-t border-gray-300 pt-6 mt-6">
          {data.education.length > 0 && (
             <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-4">Education</h2>
              <div className="space-y-4">
                {data.education.map(edu => (
                  <div key={edu.id}>
                     <h3 className="font-bold text-[14px]">{edu.institution}</h3>
                     <div className="text-[14px] italic">{edu.degree}</div>
                     <div className="text-[12px] text-gray-500">{edu.year}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.skills && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-4">Core Competencies</h2>
              <ul className="text-[13px] text-gray-800 leading-relaxed list-disc list-inside columns-1">
                {data.skills.split(',').map((skill, i) => (
                  <li key={i}>{skill.trim()}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
