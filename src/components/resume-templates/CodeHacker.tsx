"use client";
import React from "react";
import { useResume, ResumeData } from "@/app/dashboard/resume-builder/ResumeContext";

export function CodeHacker({ innerRef, overrideData }: { innerRef?: React.Ref<HTMLDivElement>, overrideData?: ResumeData }) {
  const { data: contextData } = useResume();
  const data = overrideData || contextData;

  return (
    <div ref={innerRef} className="bg-[#1e1e1e] w-[800px] h-[1131px] text-[#A9B7C6] mx-auto overflow-hidden relative shadow-xl shrink-0 p-10 flex flex-col font-mono text-[12px]" style={{ transformOrigin: 'top center', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
      
      <header className="mb-8 border-b-2 border-[#555] pb-6">
        <div className="text-[#CC7832] font-bold mb-1">class <span className="text-[#A9B7C6]">{data.fullName?.replace(' ', '') || 'Developer'}</span> {'{'}</div>
        <div className="pl-6 space-y-1">
           <div><span className="text-[#9876AA]">const</span> <span className="text-[#FFC66D]">email</span> = <span className="text-[#6A8759]">"{data.email}"</span>;</div>
           <div><span className="text-[#9876AA]">const</span> <span className="text-[#FFC66D]">phone</span> = <span className="text-[#6A8759]">"{data.phone}"</span>;</div>
           {data.linkedin && <div><span className="text-[#9876AA]">const</span> <span className="text-[#FFC66D]">linkedin</span> = <span className="text-[#6A8759]">"{data.linkedin}"</span>;</div>}
           {data.website && <div><span className="text-[#9876AA]">const</span> <span className="text-[#FFC66D]">website</span> = <span className="text-[#6A8759]">"{data.website}"</span>;</div>}
        </div>
        <div className="text-[#CC7832] font-bold mt-1">{'}'}</div>
      </header>

      <div className="flex-1 space-y-6">
        {data.summary && (
          <section>
            <div className="text-[#808080] italic mb-2">/**<br/> * @summary Professional Overview<br/> */</div>
            <p className="text-[#A9B7C6] leading-relaxed pl-4 border-l border-[#555] whitespace-pre-wrap">{data.summary}</p>
          </section>
        )}

        <div className="grid grid-cols-12 gap-8">
           <div className="col-span-8 space-y-6">
              {data.experience.length > 0 && (
                <section>
                  <div className="text-[#CC7832] font-bold mb-3"><span className="text-[#FFC66D]">getExperience</span>() {'{'}</div>
                  <div className="space-y-4 pl-6 border-l border-[#444]">
                    {data.experience.map(exp => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="font-bold text-[#E8BF6A]">{exp.role} <span className="text-[#A9B7C6]">@ {exp.company}</span></h3>
                          <span className="text-[#6897BB] text-[10px]">{exp.duration}</span>
                        </div>
                        <p className="text-[#A9B7C6] leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                  <div className="text-[#CC7832] font-bold mt-2">{'}'}</div>
                </section>
              )}

              {data.projects.length > 0 && (
                 <section>
                  <div className="text-[#CC7832] font-bold mb-3"><span className="text-[#FFC66D]">getProjects</span>() {'{'}</div>
                  <div className="space-y-4 pl-6 border-l border-[#444]">
                    {data.projects.map(proj => (
                      <div key={proj.id} className="bg-[#2b2b2b] p-3 rounded">
                        <div className="font-bold text-[#E8BF6A] mb-1"><span className="text-[#9876AA]">new</span> {proj.name}()</div>
                        <div className="text-[#6A8759] text-[10px] mb-2">[{proj.techStack}]</div>
                        <p className="text-[#A9B7C6] leading-relaxed whitespace-pre-wrap">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                  <div className="text-[#CC7832] font-bold mt-2">{'}'}</div>
                </section>
              )}
           </div>

           <div className="col-span-4 space-y-6">
              {data.skills && (
                <section>
                  <div className="text-[#808080] italic mb-2">// Technical Stack Array</div>
                  <div className="text-[#9876AA]">const</div> <div className="text-[#FFC66D]">skills</div> <div className="text-[#CC7832]">=</div> <div className="text-[#A9B7C6]">[</div>
                  <ul className="pl-4 leading-relaxed text-[#6A8759]">
                    {data.skills.split(',').map((skill, i) => (
                      <li key={i}>"{skill.trim()}",</li>
                    ))}
                  </ul>
                  <div className="text-[#A9B7C6]">];</div>
                </section>
              )}

              {data.education.length > 0 && (
                <section>
                   <div className="text-[#808080] italic mb-2">// Education Log</div>
                   <div className="space-y-3">
                      {data.education.map(edu => (
                        <div key={edu.id} className="border border-[#444] p-3 rounded bg-[#222]">
                           <h3 className="font-bold text-[#E8BF6A] text-[13px]">{edu.degree}</h3>
                           <div className="text-[#A9B7C6] mt-1">{edu.institution}</div>
                           <div className="text-[#6897BB] mt-1 text-[10px]">{edu.year}</div>
                        </div>
                      ))}
                   </div>
                </section>
              )}
           </div>
        </div>

      </div>
    </div>
  )
}
