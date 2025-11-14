// components/skeletons/PortfolioSkeleton.tsx
import { Skeleton, Card } from '@/components/ui'

export function PortfolioArticleSkeleton() {
  return (
    <Card hover className="h-full flex flex-col">
      {/* Image skeleton */}
      <Skeleton variant="rectangular" height={192} className="w-full mb-4 rounded-lg" />

      <div className="flex-1 flex flex-col space-y-3">
        {/* Title */}
        <Skeleton variant="text" width="90%" height={24} />

        {/* Subtitle */}
        <Skeleton variant="text" width="70%" height={16} />

        {/* Excerpt - 3 lines */}
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="95%" />
          <Skeleton variant="text" width="85%" />
        </div>

        {/* Date and read time */}
        <div className="flex items-center gap-4">
          <Skeleton variant="text" width={120} />
          <Skeleton variant="text" width={80} />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <Skeleton variant="rectangular" width={80} height={24} className="rounded-full" />
          <Skeleton variant="rectangular" width={100} height={24} className="rounded-full" />
          <Skeleton variant="rectangular" width={90} height={24} className="rounded-full" />
        </div>
      </div>
    </Card>
  )
}

export function PortfolioGridSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <PortfolioArticleSkeleton key={i} />
      ))}
    </div>
  )
}
