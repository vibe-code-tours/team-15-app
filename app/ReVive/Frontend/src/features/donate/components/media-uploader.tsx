"use client"

import { useState, useCallback } from "react"
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MediaUploaderProps {
  onFilesChange: (files: File[]) => void
  maxFiles?: number
  disabled?: boolean
}

export function MediaUploader({
  onFilesChange,
  maxFiles = 5,
  disabled = false,
}: MediaUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const fileArray = Array.from(newFiles)
      const imageFiles = fileArray.filter((f) => f.type.startsWith("image/"))
      const remainingSlots = maxFiles - files.length
      const filesToAdd = imageFiles.slice(0, remainingSlots)

      if (filesToAdd.length === 0) return

      const updatedFiles = [...files, ...filesToAdd]
      setFiles(updatedFiles)
      onFilesChange(updatedFiles)

      // Generate previews
      filesToAdd.forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          setPreviews((prev) => [...prev, e.target?.result as string])
        }
        reader.readAsDataURL(file)
      })
    },
    [files, maxFiles, onFilesChange]
  )

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    const updatedPreviews = previews.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    setPreviews(updatedPreviews)
    onFilesChange(updatedFiles)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Photos (Optional)</Label>
        <span className="text-xs text-muted-foreground">
          {files.length}/{maxFiles} photos
        </span>
      </div>

      {/* Upload Area */}
      <div
        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleChange}
          disabled={disabled || files.length >= maxFiles}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
        <Upload className="mb-2 size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-primary">Click to upload</span> or drag and drop
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          PNG, JPG, GIF up to 10MB each
        </p>
      </div>

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {previews.map((preview, index) => (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden rounded-lg border border-border"
            >
              <img
                src={preview}
                alt={`Upload ${index + 1}`}
                className="size-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeFile(index)}
                disabled={disabled}
                className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="size-4" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-1 left-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <label className={`text-sm font-medium ${className || ""}`}>
      {children}
    </label>
  )
}
