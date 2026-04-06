"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Experience = {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
};

export type Education = {
  id: string;
  institution: string;
  degree: string;
  year: string;
};

export type Project = {
  id: string;
  name: string;
  techStack: string;
  description: string;
};

export type PhotoSettings = {
  size: "small" | "medium" | "large";
  shape: "circle" | "square";
  visible: boolean;
};

export type ResumeData = {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  website: string;
  photoUrl: string;
  photoSettings: PhotoSettings;
  summary: string;
  skills: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
};

type ResumeContextType = {
  data: ResumeData;
  updateData: (field: keyof ResumeData, value: any) => void;
  selectedTemplate: string;
  setSelectedTemplate: (template: string) => void;
  // helper for arrays
  updateArrayItem: (targetArray: "experience" | "education" | "projects", index: number, field: string, value: string) => void;
  addArrayItem: (targetArray: "experience" | "education" | "projects") => void;
  removeArrayItem: (targetArray: "experience" | "education" | "projects", index: number) => void;
};

export const defaultData: ResumeData = {
  fullName: "Saurabh Shukla",
  email: "saurabh.shukla@example.com",
  phone: "+91 98765 43210",
  linkedin: "linkedin.com/in/saurabhshukla",
  website: "saurabhdev.com",
  photoUrl: "https://i.pravatar.cc/300?img=11",
  photoSettings: {
    size: "medium",
    shape: "circle",
    visible: true,
  },
  summary: "A passionate Software Developer dedicated to building scalable and modern web applications. Proficient in multiple programming languages and frameworks.",
  skills: "Java, React, SQL, Next.js, Node.js",
  experience: [
    {
      id: "1",
      company: "Tech Mahindra",
      role: "Software Engineering Intern",
      duration: "Jan 2023 - Present",
      description: "Developed and optimized scalable applications using modern technologies resulting in 20% faster load times. Collaborated with senior engineers to implement new features."
    }
  ],
  education: [
    {
      id: "1",
      institution: "Indian Institute of Technology",
      degree: "B.Tech in Computer Science",
      year: "2019 - 2023"
    }
  ],
  projects: [
    {
      id: "1",
      name: "Placify Platform",
      techStack: "React, Firebase",
      description: "Built a comprehensive AI-powered career intelligence platform with real-time feedback."
    },
    {
      id: "2",
      name: "E-Commerce Backend",
      techStack: "Java, Spring Boot, SQL",
      description: "Designed a robust microservices architecture for an e-commerce backend."
    }
  ]
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ResumeData>(defaultData);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");

  const updateData = (field: keyof ResumeData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const updateArrayItem = (targetArray: "experience" | "education" | "projects", index: number, field: string, value: string) => {
    setData((prev) => {
      const arr = [...prev[targetArray]] as any[];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [targetArray]: arr };
    });
  };

  const addArrayItem = (targetArray: "experience" | "education" | "projects") => {
    setData((prev) => {
      const arr = [...prev[targetArray]];
      const newItem = targetArray === "experience"
        ? { id: Date.now().toString(), company: "", role: "", duration: "", description: "" }
        : targetArray === "education"
        ? { id: Date.now().toString(), institution: "", degree: "", year: "" }
        : { id: Date.now().toString(), name: "", techStack: "", description: "" };
      arr.push(newItem as any);
      return { ...prev, [targetArray]: arr };
    });
  };

  const removeArrayItem = (targetArray: "experience" | "education" | "projects", index: number) => {
    setData((prev) => {
      const arr = [...prev[targetArray]];
      arr.splice(index, 1);
      return { ...prev, [targetArray]: arr };
    });
  };

  return (
    <ResumeContext.Provider value={{ data, updateData, selectedTemplate, setSelectedTemplate, updateArrayItem, addArrayItem, removeArrayItem }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
}
