"use client";

import { useRef, useState } from "react";
import type { Platform } from "../lib/types";

interface FileUploaderProps {
  platform: Platform;
  onFilesChange: (files: File[]) => void;
  files: File[];
}

export default function FileUploader({ platform, onFilesChange, files }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files).filter((f) =>
      platform.accept ? f.name.endsWith(platform.accept.replace("*", "")) : true
    );
    onFilesChange(platform.multiple ? [...files, ...dropped] : dropped);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    onFilesChange(platform.multiple ? [...files, ...selected] : selected);
  };

  const removeFile = (idx: number) => {
    onFilesChange(files.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-3">
      <div
        className={`
          border-2 border-dashed rounded-xl p-6 flex flex-col items-center
          justify-center gap-3 cursor-pointer transition-all duration-200
          ${isDragging
            ? "border-[#cc97ff] bg-[#cc97ff]/5"
            : "border-[#494847]/40 hover:border-[#cc97ff]/40 hover:bg-[#131313]"
          }
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <span
          className="material-symbols-outlined text-4xl"
          style={{ color: platform.color }}
        >
          cloud_upload
        </span>
        <div className="text-center">
          <p
            className="text-white font-medium text-sm"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Trascina o clicca
          </p>
          <p className="text-[#adaaaa] text-xs mt-1">{platform.inputHint}</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={platform.accept}
          multiple={platform.multiple}
          onChange={handleChange}
        />
      </div>

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((f, i) => (
            <li
              key={i}
              className="flex items-center justify-between bg-[#131313] rounded-lg px-4 py-2"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#cc97ff] text-sm">
                  insert_drive_file
                </span>
                <span className="text-sm text-white truncate max-w-[200px]">{f.name}</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                className="text-[#adaaaa] hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}