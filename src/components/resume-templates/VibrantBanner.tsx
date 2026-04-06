"use client";
import React from "react";
import { useResume, ResumeData } from "@/app/dashboard/resume-builder/ResumeContext";

export function VibrantBanner({ innerRef, overrideData }: { innerRef?: React.Ref<HTMLDivElement>, overrideData?: ResumeData }) {
  const { data: contextData } = useResume();
  const data = overrideData || contextData;

  return (
    <div ref={innerRef} className="bg-white w-[800px] h-[1131px] text-gray-800 mx-auto overflow-hidden relative shadow-xl shrink-0 flex flex-col font-sans" style={{ transformOrigin: 'top center' }}>
      
      {/* Mega Banner Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 w-full pt-16 pb-24 px-12 relative" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
         <h1 className="text-5xl font-black tracking-tight text-white mb-2">{data.fullName || "Your Name"}</h1>
         <div className="flex gap-4 text-sm font-semibold text-white/90">
            <span>{data.email}</span>
            <span>{data.phone}</span>
         </div>
      </div>

      {/* Floating Info Card */}
      <div className="px-12 relative -mt-16 z-10 flex gap-8">
         {data.photoUrl && data.photoSettings?.visible && (
            <div className={`overflow-hidden border-4 border-white bg-white shadow-lg ${data.photoSettings.shape==='square'?'rounded-xl':'rounded-full'} ${data.photoSettings.size==='small'?'w-24 h-24':data.photoSettings.size==='large'?'w-40 h-40':'w-32 h-32'}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
            </div>
         )}

         <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex-1 flex flex-col justify-center">
            {data.linkedin && <div className="text-xs font-bold text-gray-500 mb-1">LINKS</div>}
            <div className="text-sm font-semibold flex gap-4 text-pink-600">
               {data.linkedin && <a href="#">{data.linkedin}</a>}
               {data.website && <span className="text-purple-600">{data.website}</span>}
            </div>
            {data.summary && (
               <p className="text-[13px] text-gray-600 mt-3 font-medium">{data.summary}</p>
            )}
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-12 py-8 grid grid-cols-12 gap-10">
         
         <div className="col-span-7 space-y-8">
            {data.experience.length > 0 && (
              <section>
                <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-6 bg-pink-500 rounded-full"></span> Experience
                </h2>
                <div className="space-y-6">
                  {data.experience.map(exp => (
                    <div key={exp.id}>
                      <h3 className="font-bold text-[16px] text-gray-900">{exp.role}</h3>
                      <div className="text-[13px] font-bold text-gray-500 mb-2 uppercase">{exp.company} | <span className="text-purple-600">{exp.duration}</span></div>
                      <p className="text-[13px] text-gray-600 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.projects.length > 0 && (
               <section>
                <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-6 bg-orange-400 rounded-full"></span> Projects
                </h2>
                <div className="space-y-4">
                  {data.projects.map(proj => (
                    <div key={proj.id} className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-bold text-[14px] text-gray-900 mb-1">{proj.name}</h3>
                      <div className="text-[11px] font-bold text-gray-400 mb-2 uppercase">{proj.techStack}</div>
                      <p className="text-[12.5px] text-gray-600 leading-relaxed whitespace-pre-wrap">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
         </div>

         <div className="col-span-5 space-y-8">
            {data.skills && (
              <section>
                <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-6 bg-purple-600 rounded-full"></span> Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {data.skills.split(',').map((skill, i) => (
                    <span key={i} className="text-[12px] font-bold text-white bg-gray-800 px-3 py-1.5 rounded-md" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                       {skill.trim()}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {data.education.length > 0 && (
              <section>
                 <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-6 bg-indigo-500 rounded-full"></span> Education
                </h2>
                 <div className="space-y-5">
                    {data.education.map(edu => (
                      <div key={edu.id}>
                         <h3 className="font-bold text-[14px] text-gray-900 leading-tight">{edu.degree}</h3>
                         <div className="text-[13px] font-medium text-gray-600 mt-1">{edu.institution}</div>
                         <div className="text-[11px] font-black text-indigo-500 mt-1">{edu.year}</div>
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
