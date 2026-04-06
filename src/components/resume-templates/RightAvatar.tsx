"use client";
import React from "react";
import { useResume, ResumeData } from "@/app/dashboard/resume-builder/ResumeContext";

export function RightAvatar({ innerRef, overrideData }: { innerRef?: React.Ref<HTMLDivElement>, overrideData?: ResumeData }) {
  const { data: contextData } = useResume();
  const data = overrideData || contextData;

  return (
    <div ref={innerRef} className="bg-white w-[800px] h-[1131px] text-gray-900 mx-auto overflow-hidden relative shadow-xl shrink-0 p-12 flex flex-col font-sans" style={{ transformOrigin: 'top center' }}>
      
      {/* Heavy Typography Header with Right Aligned Photo */}
      <header className="flex justify-between items-center mb-10 pb-8 border-b-4 border-gray-900">
        <div className="max-w-[70%]">
          <h1 className="text-6xl font-black uppercase tracking-tight text-gray-900 mb-4 leading-none">{data.fullName || "Your Name"}</h1>
          <div className="grid grid-cols-2 gap-y-2 gap-x-8 text-sm font-semibold text-gray-600">
            <span className="flex items-center gap-2"><span className="text-gray-400">E.</span> {data.email}</span>
            <span className="flex items-center gap-2"><span className="text-gray-400">P.</span> {data.phone}</span>
            {data.linkedin && <span className="flex items-center gap-2"><span className="text-gray-400">IN.</span> {data.linkedin}</span>}
            {data.website && <span className="flex items-center gap-2"><span className="text-gray-400">W.</span> {data.website}</span>}
          </div>
        </div>
        
        {data.photoUrl && data.photoSettings?.visible && (
          <div className={`shrink-0 overflow-hidden ${data.photoSettings.shape==='square'?'rounded-lg':'rounded-full'} ${data.photoSettings.size==='small'?'w-24 h-24':data.photoSettings.size==='large'?'w-40 h-40':'w-32 h-32'} border-2 border-gray-200 shadow-md`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
          </div>
        )}
      </header>

      <div className="flex gap-10 h-full">
         
         <div className="w-[60%] flex flex-col gap-8">
            {data.summary && (
              <section>
                <h2 className="text-lg font-black uppercase tracking-widest text-gray-900 mb-3 bg-gray-100 inline-block px-2 py-1">Profile</h2>
                <p className="text-[13px] leading-relaxed text-gray-700 font-medium">{data.summary}</p>
              </section>
            )}

            {data.experience.length > 0 && (
              <section>
                <h2 className="text-lg font-black uppercase tracking-widest text-gray-900 mb-5 bg-gray-100 inline-block px-2 py-1">Experience</h2>
                <div className="space-y-6">
                  {data.experience.map(exp => (
                    <div key={exp.id}>
                      <h3 className="font-bold text-[16px] text-gray-900">{exp.role}</h3>
                      <div className="text-[13px] font-bold text-gray-500 mb-2">{exp.company} • {exp.duration}</div>
                      <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
         </div>

         <div className="w-[40%] flex flex-col gap-8 border-l border-gray-200 pl-10">
            {data.education.length > 0 && (
               <section>
                <h2 className="text-lg font-black uppercase tracking-widest text-gray-900 mb-5 bg-gray-100 inline-block px-2 py-1">Education</h2>
                <div className="space-y-4">
                  {data.education.map(edu => (
                    <div key={edu.id}>
                       <h3 className="font-bold text-[14px] text-gray-900">{edu.degree}</h3>
                       <div className="text-[13px] font-medium text-gray-600 mt-1">{edu.institution}</div>
                       <div className="text-[12px] font-bold text-gray-400 mt-1">{edu.year}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.projects.length > 0 && (
               <section>
                <h2 className="text-lg font-black uppercase tracking-widest text-gray-900 mb-5 bg-gray-100 inline-block px-2 py-1">Projects</h2>
                <div className="space-y-4">
                  {data.projects.map(proj => (
                    <div key={proj.id}>
                      <h3 className="font-bold text-[14px] text-gray-900">{proj.name}</h3>
                      <div className="text-[11px] font-bold text-blue-600 mb-1">{proj.techStack}</div>
                      <p className="text-[12px] text-gray-700 leading-relaxed whitespace-pre-wrap">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.skills && (
              <section>
                <h2 className="text-lg font-black uppercase tracking-widest text-gray-900 mb-4 bg-gray-100 inline-block px-2 py-1">Skills</h2>
                <div className="flex flex-col gap-3">
                  {data.skills.split(',').map((skill, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <span className="text-[13px] font-bold text-gray-700">{skill.trim()}</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(dot => (
                          <div key={dot} className={`w-2 h-2 rounded-full ${dot <= 4 ? 'bg-gray-800' : 'bg-gray-300'}`}></div>
                        ))}
                      </div>
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
