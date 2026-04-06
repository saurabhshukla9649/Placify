"use client";
import React from "react";
import { useResume, ResumeData } from "@/app/dashboard/resume-builder/ResumeContext";

export function TechInnovator({ innerRef, overrideData }: { innerRef?: React.Ref<HTMLDivElement>, overrideData?: ResumeData }) {
  const { data: contextData } = useResume();
  const data = overrideData || contextData;

  return (
    <div ref={innerRef} className="bg-white w-[800px] h-[1131px] text-gray-800 mx-auto overflow-hidden text-sm relative shadow-xl shrink-0 flex flex-col" style={{ transformOrigin: 'top center' }}>
      
      <header className="bg-slate-900 text-white p-10 flex items-center gap-8">
        {(data.photoUrl && data.photoSettings?.visible) && (
          <div className={`${data.photoSettings.size === 'small' ? 'w-24 h-24' : data.photoSettings.size === 'large' ? 'w-40 h-40' : 'w-32 h-32'} ${data.photoSettings.shape === 'square' ? 'rounded-md' : 'rounded-full'} overflow-hidden border-4 border-white/20 shrink-0 bg-slate-800`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.photoUrl} alt="Profile" className="w-full h-full object-cover" />
          </div>
        )}
        {(!data.photoUrl && data.photoSettings?.visible) && (
          <div className={`${data.photoSettings?.size === 'small' ? 'w-24 h-24' : data.photoSettings?.size === 'large' ? 'w-40 h-40' : 'w-32 h-32'} ${data.photoSettings?.shape === 'square' ? 'rounded-md' : 'rounded-full'} border-4 border-white/20 shrink-0 bg-slate-800 flex items-center justify-center text-3xl font-bold`}>
            {data.fullName?.charAt(0) || "U"}
          </div>
        )}
        <div>
          <h1 className="text-[44px] font-black tracking-tight mb-2 leading-none text-white">{data.fullName || "Your Name"}</h1>
          <div className="flex gap-4 text-blue-400 font-semibold text-xs uppercase tracking-wide flex-wrap mt-4">
            <span>{data.email || "email@example.com"}</span>
            <span>{data.phone || "(123) 456-7890"}</span>
            {data.linkedin && <span>{data.linkedin}</span>}
            {data.website && <span>{data.website}</span>}
          </div>
        </div>
      </header>

      <div className="flex-1 p-10 grid grid-cols-12 gap-10">
         <div className="col-span-8 space-y-8">
            {data.summary && (
              <section>
                <h2 className="text-xl font-bold border-b-2 border-slate-900 pb-2 mb-4">PROFILE</h2>
                <p className="text-[14px] leading-relaxed text-gray-700">{data.summary}</p>
              </section>
            )}

            {data.experience.length > 0 && (
              <section>
                <h2 className="text-xl font-bold border-b-2 border-slate-900 pb-2 mb-4">EXPERIENCE</h2>
                <div className="space-y-6">
                  {data.experience.map(exp => (
                    <div key={exp.id}>
                      <h3 className="font-bold text-[16px]">{exp.role}</h3>
                      <div className="text-blue-600 font-bold text-xs mb-2 uppercase tracking-wide">{exp.company} | {exp.duration}</div>
                      <p className="text-[14px] text-gray-600 whitespace-pre-wrap">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.projects.length > 0 && (
               <section>
                <h2 className="text-xl font-bold border-b-2 border-slate-900 pb-2 mb-4">PROJECTS</h2>
                <div className="space-y-6">
                  {data.projects.map(proj => (
                    <div key={proj.id}>
                      <h3 className="font-bold text-[16px]">{proj.name}</h3>
                      <div className="text-blue-600 font-mono text-xs mb-2 font-bold">{proj.techStack}</div>
                      <p className="text-[14px] text-gray-600 whitespace-pre-wrap">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
         </div>

         <div className="col-span-4 space-y-8">
            {data.skills && (
              <section>
                <h2 className="text-lg font-bold border-b-2 border-slate-900 pb-2 mb-4">TECHNICAL SKILLS</h2>
                <div className="flex flex-col gap-2">
                  {data.skills.split(',').map((skill, i) => (
                    <div key={i} className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                       <span className="text-[14px] text-gray-800 font-medium">{skill.trim()}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.education.length > 0 && (
               <section>
                <h2 className="text-lg font-bold border-b-2 border-slate-900 pb-2 mb-4">EDUCATION</h2>
                <div className="space-y-4">
                  {data.education.map(edu => (
                    <div key={edu.id}>
                       <h3 className="font-bold text-[14px]">{edu.degree}</h3>
                       <div className="text-[13px] text-gray-600 mt-1">{edu.institution}</div>
                       <div className="text-[12px] text-blue-500 font-bold mt-1">{edu.year}</div>
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
