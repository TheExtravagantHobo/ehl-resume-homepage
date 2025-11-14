// components/skeletons/ShowcaseSkeleton.tsx
import { Skeleton } from '@/components/ui'

export function ShowcaseCardSkeleton() {
  return (
    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
      {/* Image skeleton - matches actual card aspect ratio */}
      <div className="w-full aspect-video bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600" />

      {/* Text skeleton - matches actual card text */}
      <div className="p-6 space-y-2">
        <div className="h-6 bg-gray-300 dark:bg-slate-600 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6" />
      </div>
    </div>
  )
}

export function ShowcaseGridSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <ShowcaseCardSkeleton key={i} />
      ))}
    </div>
  )
}
