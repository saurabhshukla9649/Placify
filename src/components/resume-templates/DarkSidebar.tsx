"use client";
import React from "react";
import { useResume, ResumeData } from "@/app/dashboard/resume-builder/ResumeContext";

export function DarkSidebar({ innerRef, overrideData }: { innerRef?: React.Ref<HTMLDivElement>, overrideData?: ResumeData }) {
  const { data: contextData } = useResume();
  const data = overrideData || contextData;

  return (
    <div ref={innerRef} className="bg-white w-[800px] h-[1131px] text-gray-800 mx-auto overflow-hidden relative shadow-xl shrink-0 flex font-sans" style={{ transformOrigin: 'top center' }}>
      
      {/* 33% Pure Black Sidebar */}
      <div className="w-[30%] bg-black text-white p-8 flex flex-col shrink-0 relative" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
        
        {data.photoUrl && data.photoSettings?.visible && (
          <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-gray-600 mb-8 bg-zinc-800">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src={data.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
          </div>
        )}
        {!data.photoUrl && data.photoSettings?.visible && (
          <div className="w-32 h-32 mx-auto rounded-full border-2 border-gray-600 mb-8 bg-zinc-800 flex items-center justify-center text-5xl font-light">
             {data.fullName?.charAt(0) || "U"}
          </div>
        )}

        <h2 className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-4 border-b border-white/20 pb-2">Contact</h2>
        <div className="space-y-3 text-[12px] text-gray-300 break-words mb-8">
           <p>{data.email}</p>
           <p>{data.phone}</p>
           <p>{data.linkedin}</p>
           <p>{data.website}</p>
        </div>

        {data.skills && (
          <>
            <h2 className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-4 border-b border-white/20 pb-2 mt-4">Skills</h2>
            <div className="flex flex-col gap-2">
              {data.skills.split(',').map((skill, i) => (
                <div key={i} className="bg-white/10 px-3 py-1.5 rounded-sm text-[12px] font-medium text-white text-center">
                  {skill.trim()}
                </div>
              ))}
            </div>
          </>
        )}
        
        <div className="mt-auto pt-8">
           <div className="w-12 h-1 bg-white/30"></div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-10 flex flex-col bg-white">
        <header className="mb-10">
          <h1 className="text-5xl font-black uppercase tracking-tight text-black mb-2">{data.fullName || "Your Name"}</h1>
          {data.summary && (
             <p className="text-[14px] leading-relaxed text-gray-600 mt-4 border-l-4 border-black pl-4">{data.summary}</p>
          )}
        </header>

        <div className="flex-1 space-y-8">
          {data.experience.length > 0 && (
            <section>
              <h2 className="text-[18px] font-bold uppercase tracking-widest text-black mb-4 flex items-center gap-2">
                <span className="w-6 h-0.5 bg-black"></span> Experience
              </h2>
              <div className="space-y-6">
                {data.experience.map(exp => (
                  <div key={exp.id}>
                    <h3 className="font-bold text-[15px]">{exp.role}</h3>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 text-[13px] font-semibold">{exp.company}</span>
                      <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1">{exp.duration}</span>
                    </div>
                    <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.projects.length > 0 && (
             <section>
              <h2 className="text-[18px] font-bold uppercase tracking-widest text-black mb-4 flex items-center gap-2">
                <span className="w-6 h-0.5 bg-black"></span> Projects
              </h2>
               <div className="space-y-5">
                {data.projects.map(proj => (
                  <div key={proj.id}>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-[14px]">{proj.name}</h3>
                      <span className="text-[10px] font-mono bg-black text-white px-2 py-0.5 rounded-full">{proj.techStack}</span>
                    </div>
                    <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.education.length > 0 && (
            <section>
              <h2 className="text-[18px] font-bold uppercase tracking-widest text-black mb-4 flex items-center gap-2">
                <span className="w-6 h-0.5 bg-black"></span> Education
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {data.education.map(edu => (
                  <div key={edu.id}>
                     <h3 className="font-bold text-[14px]">{edu.degree}</h3>
                     <div className="text-[13px] text-gray-600 mt-1 border-b border-gray-200 pb-1">{edu.institution}</div>
                     <div className="text-[11px] font-bold text-gray-400 mt-1">{edu.year}</div>
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
