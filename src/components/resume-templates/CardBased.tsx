"use client";
import React from "react";
import { useResume, ResumeData } from "@/app/dashboard/resume-builder/ResumeContext";

export function CardBased({ innerRef, overrideData }: { innerRef?: React.Ref<HTMLDivElement>, overrideData?: ResumeData }) {
  const { data: contextData } = useResume();
  const data = overrideData || contextData;

  return (
    <div ref={innerRef} className="bg-[#f0f2f5] w-[800px] h-[1131px] text-gray-900 mx-auto overflow-hidden relative shadow-xl shrink-0 p-8 flex flex-col font-sans gap-4" style={{ transformOrigin: 'top center', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
      
      {/* Header Card */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 flex items-center gap-6 shrink-0">
         {data.photoUrl && data.photoSettings?.visible && (
            <div className={`shrink-0 overflow-hidden ${data.photoSettings.shape==='square'?'rounded-xl':'rounded-full'} ${data.photoSettings.size==='small'?'w-20 h-20':data.photoSettings.size==='large'?'w-32 h-32':'w-24 h-24'}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
            </div>
         )}
         <div className="flex-1">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">{data.fullName || "Your Name"}</h1>
            <div className="flex gap-4 text-[12px] font-medium text-gray-500 mb-3 flex-wrap">
              <span className="bg-gray-100 px-3 py-1 rounded-full">{data.email}</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">{data.phone}</span>
              {data.linkedin && <span className="bg-gray-100 px-3 py-1 rounded-full">{data.linkedin}</span>}
            </div>
            <p className="text-[13px] text-gray-600 leading-relaxed font-medium">{data.summary}</p>
         </div>
      </div>

      <div className="grid grid-cols-3 gap-4 flex-1">
         {/* Left Column Data */}
         <div className="col-span-2 space-y-4">
            
            {/* Experience Card */}
            {data.experience.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                 <h2 className="text-sm font-bold uppercase tracking-widest text-[#3b82f6] mb-5">Experience</h2>
                 <div className="space-y-6">
                    {data.experience.map(exp => (
                      <div key={exp.id} className="relative pl-4 border-l-2 border-gray-100">
                        <div className="absolute w-2 h-2 bg-[#3b82f6] rounded-full -left-[5px] top-1.5"></div>
                        <h3 className="font-bold text-[15px]">{exp.role}</h3>
                        <div className="flex justify-between items-center text-xs mb-2">
                           <span className="text-gray-700 font-semibold">{exp.company}</span>
                           <span className="text-gray-400 bg-gray-50 px-2 rounded-md">{exp.duration}</span>
                        </div>
                        <p className="text-[12.5px] text-gray-600 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {/* Projects Card */}
            {data.projects.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                 <h2 className="text-sm font-bold uppercase tracking-widest text-[#3b82f6] mb-5">Projects</h2>
                 <div className="space-y-5">
                    {data.projects.map(proj => (
                      <div key={proj.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="font-bold text-[14px]">{proj.name}</h3>
                        </div>
                        <div className="text-[11px] font-mono text-blue-500 mb-2">{proj.techStack}</div>
                        <p className="text-[12.5px] text-gray-600 leading-relaxed whitespace-pre-wrap">{proj.description}</p>
                      </div>
                    ))}
                 </div>
              </div>
            )}

         </div>

         {/* Right Column Data */}
         <div className="col-span-1 space-y-4">
            
            {/* Skills Card */}
            {data.skills && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                 <h2 className="text-sm font-bold uppercase tracking-widest text-[#10b981] mb-5">Skills</h2>
                 <div className="flex flex-wrap gap-2">
                    {data.skills.split(',').map((skill, i) => (
                      <span key={i} className="bg-[#10b981]/10 text-[#10b981] px-3 py-1.5 rounded-lg text-[12px] font-bold">
                        {skill.trim()}
                      </span>
                    ))}
                 </div>
              </div>
            )}

            {/* Education Card */}
            {data.education.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                 <h2 className="text-sm font-bold uppercase tracking-widest text-[#8b5cf6] mb-5">Education</h2>
                 <div className="space-y-4">
                    {data.education.map(edu => (
                      <div key={edu.id} className="pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                         <h3 className="font-bold text-[13px]">{edu.degree}</h3>
                         <div className="text-[12px] text-gray-500 mt-1">{edu.institution}</div>
                         <div className="text-[11px] font-bold text-[#8b5cf6] mt-1">{edu.year}</div>
                      </div>
                    ))}
                 </div>
              </div>
            )}

         </div>
      </div>
    </div>
  )
}
