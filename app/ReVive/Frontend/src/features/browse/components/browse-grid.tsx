"use client"

import { useState, useCallback, useEffect } from "react"
import { MapPin, Clock, Package, User, Calendar, X, ChevronLeft, ChevronRight } from "lucide-react"
import { categoryLabel, conditionLabel, timeSlotLabel } from "@/lib/categories"
import { RequestDialog } from "@/features/browse/components/request-dialog"
import type { BrowseItem } from "@/features/search/types"

function timeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

function formatDateRange(from: string, to: string): string {
  const fmt = { month: "short", day: "numeric" } as const
  const startDate = new Date(from + "T00:00:00")
  const endDate = new Date(to + "T00:00:00")
  return `${startDate.toLocaleDateString("en-US", fmt)} – ${endDate.toLocaleDateString("en-US", fmt)}`
}

/* ── Photo Lightbox ──────────────────────────────────────────── */

interface LightboxProps {
  images: string[]
  currentIndex: number
  alt: string
  onClose: () => void
  onNavigate: (index: number) => void
}

function Lightbox({ images, currentIndex, alt, onClose, onNavigate }: LightboxProps) {
  const goPrev = useCallback(() => {
    onNavigate(currentIndex === 0 ? images.length - 1 : currentIndex - 1)
  }, [currentIndex, images.length, onNavigate])

  const goNext = useCallback(() => {
    onNavigate(currentIndex === images.length - 1 ? 0 : currentIndex + 1)
  }, [currentIndex, images.length, onNavigate])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
    }
    document.addEventListener("keydown", handleKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKey)
      document.body.style.overflow = ""
    }
  }, [onClose, goPrev, goNext])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        aria-label="Close"
      >
        <X className="size-5" />
      </button>

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Prev arrow */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goPrev() }}
          className="absolute left-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          aria-label="Previous photo"
        >
          <ChevronLeft className="size-5" />
        </button>
      )}

      {/* Image */}
      <img
        src={images[currentIndex]}
        alt={`${alt} — photo ${currentIndex + 1}`}
        className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Next arrow */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goNext() }}
          className="absolute right-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          aria-label="Next photo"
        >
          <ChevronRight className="size-5" />
        </button>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-xl bg-black/40 p-2 backdrop-blur-sm">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); onNavigate(idx) }}
              className={`size-12 overflow-hidden rounded-md border-2 transition-all ${
                idx === currentIndex
                  ? "border-white scale-110"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Browse Grid ─────────────────────────────────────────────── */

interface BrowseGridProps {
  items: BrowseItem[]
  onRequestSuccess?: () => void
}

export function BrowseGrid({ items, onRequestSuccess }: BrowseGridProps) {
  const [requestedIds, setRequestedIds] = useState<Set<number>>(new Set())
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number; alt: string } | null>(null)

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <Package className="mx-auto size-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">No items available</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Check back later or adjust your filters.
        </p>
      </div>
    )
  }

  const handleRequestSuccess = (itemId: number) => {
    setRequestedIds((prev) => new Set(prev).add(itemId))
    onRequestSuccess?.()
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const isRequested = requestedIds.has(item.id)

          return (
            <div
              key={item.id}
              className="flex flex-col rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-muted/30"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-semibold">
                    {item.deviceName}
                  </h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {categoryLabel(item.category)}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {conditionLabel(item.condition)}
                </span>
              </div>

              {/* Photos */}
              {item.images && item.images.length > 0 && (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {item.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setLightbox({ images: item.images!, index: idx, alt: item.deviceName })}
                      className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-border cursor-pointer"
                    >
                      <img
                        src={img}
                        alt={`${item.deviceName} photo ${idx + 1}`}
                        className="size-full object-cover transition-transform group-hover:scale-105"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
                        <span className="text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                          View
                        </span>
                      </div>
                      {idx === 0 && item.images!.length > 1 && (
                        <span className="absolute bottom-0.5 left-0.5 rounded bg-primary px-1 py-0.5 text-[9px] font-medium text-primary-foreground">
                          +{item.images!.length - 1}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Quantity */}
              {item.quantity > 1 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Qty: {item.quantity}
                </p>
              )}

              {/* Date range & time slot */}
              <div className="mt-3 flex flex-col gap-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-3.5 shrink-0" />
                  <span>{formatDateRange(item.availableFrom, item.availableTo)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3.5 shrink-0" />
                  <span>{timeSlotLabel(item.timeSlot)}</span>
                </div>
              </div>

              {/* Meta */}
              <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <MapPin className="size-3.5 shrink-0" />
                  <span className="truncate">{item.address}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="size-3.5 shrink-0" />
                  <span>Listed by {item.donorName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3.5 shrink-0" />
                  <span>{timeAgo(item.createdAt)}</span>
                </div>
              </div>

              {/* Notes preview */}
              {item.notes && (
                <p className="mt-3 line-clamp-2 text-xs text-muted-foreground/70 italic">
                  &ldquo;{item.notes}&rdquo;
                </p>
              )}

              {/* Request button */}
              <div className="mt-auto pt-4">
                {isRequested ? (
                  <div className="w-full rounded-lg bg-accent/10 py-2 text-center text-sm font-medium text-accent">
                    Request sent!
                  </div>
                ) : (
                  <RequestDialog
                    itemId={item.id}
                    availableFrom={item.availableFrom}
                    availableTo={item.availableTo}
                    timeSlot={item.timeSlot}
                    onRequestSuccess={handleRequestSuccess}
                  >
                    <div className="w-full rounded-lg bg-primary py-2 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                      Request Item
                    </div>
                  </RequestDialog>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Lightbox overlay */}
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          currentIndex={lightbox.index}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
          onNavigate={(idx) => setLightbox((prev) => prev ? { ...prev, index: idx } : null)}
        />
      )}
    </>
  )
}
