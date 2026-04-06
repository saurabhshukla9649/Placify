"use client";

import React, { useRef, useState } from "react";
import { useResume } from "@/app/dashboard/resume-builder/ResumeContext";
import { Button } from "@/components/ui/button";
import { UploadCloud, X, Image as ImageIcon } from "lucide-react";

export function PhotoUploader() {
  const { data, updateData } = useResume();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      updateData("photoUrl", result);
      if (!data.photoSettings.visible) {
        updateData("photoSettings", { ...data.photoSettings, visible: true });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const updateSetting = (key: string, value: string | boolean) => {
    updateData("photoSettings", { ...data.photoSettings, [key]: value });
  };

  return (
    <div className="w-full bg-black/40 border-white/10 glass-card p-5 rounded-xl border space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-semibold flex items-center gap-2 text-sm">
          <ImageIcon className="w-4 h-4 text-primary" /> Profile Photo
        </h3>
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input type="checkbox" className="sr-only" checked={data.photoSettings.visible} onChange={(e) => updateSetting("visible", e.target.checked)} />
            <div className={`block w-10 h-6 rounded-full transition-colors ${data.photoSettings.visible ? "bg-primary" : "bg-gray-600"}`}></div>
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${data.photoSettings.visible ? "translate-x-4" : ""}`}></div>
          </div>
          <span className="ml-2 text-xs text-gray-300">Show in Resume</span>
        </label>
      </div>

      <div className="flex gap-6 items-center">
        {data.photoUrl ? (
          <div className="space-y-4 w-full">
            <div className="flex items-center gap-6">
              <div className={`relative shrink-0 border-2 border-primary overflow-hidden ${data.photoSettings.shape === 'circle' ? 'rounded-full' : 'rounded-md'} w-24 h-24 bg-black/50`}>
                <img src={data.photoUrl} alt="Profile Preview" className="w-full h-full object-cover" />
              </div>
              
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" className="h-8 text-xs border-white/20 hover:bg-white/10 hover:border-white/40 text-white" onClick={() => fileInputRef.current?.click()}>
                   Change Photo
                </Button>
                <Button variant="ghost" size="sm" className="h-8 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/20" onClick={() => updateData("photoUrl", "")}>
                   <X className="w-3 h-3 mr-1" /> Remove
                </Button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/png, image/jpeg" onChange={handleFileChange} />
              </div>
            </div>

            {/* Editing Controls */}
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/5">
              <div>
                 <span className="text-xs text-gray-400 mb-2 block">Size</span>
                 <div className="flex bg-black/50 p-1 rounded-md border border-white/10">
                   {["small", "medium", "large"].map(s => (
                     <button key={s} onClick={() => updateSetting("size", s)} className={`flex-1 text-[10px] uppercase py-1 rounded transition-colors ${data.photoSettings.size === s ? 'bg-primary text-black font-bold' : 'text-gray-400 hover:text-white'}`}>
                       {s}
                     </button>
                   ))}
                 </div>
              </div>
              <div>
                 <span className="text-xs text-gray-400 mb-2 block">Shape</span>
                 <div className="flex bg-black/50 p-1 rounded-md border border-white/10">
                   {["circle", "square"].map(s => (
                     <button key={s} onClick={() => updateSetting("shape", s)} className={`flex-1 text-[10px] uppercase py-1 rounded transition-colors ${data.photoSettings.shape === s ? 'bg-primary text-black font-bold' : 'text-gray-400 hover:text-white'}`}>
                       {s}
                     </button>
                   ))}
                 </div>
              </div>
            </div>
          </div>
        ) : (
          <div 
            className={`w-full aspect-[3/1] border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer ${isDragging ? 'border-primary bg-primary/10' : 'border-white/20 hover:border-white/40 hover:bg-white/5'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-2 neon-glow">
              <UploadCloud className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm text-gray-300 font-medium">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG (max. 800x400px)</p>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/png, image/jpeg" onChange={handleFileChange} />
          </div>
        )}
      </div>
    </div>
  );
}
