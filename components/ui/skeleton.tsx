import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

interface SkeletonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: boolean
  footer?: boolean
}

function SkeletonCard({
  className,
  header = true,
  footer = true,
  ...props
}: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    >
      {header && (
        <div className="p-6 pb-4">
          <Skeleton className="h-7 w-1/3" />
          <Skeleton className="mt-2.5 h-4 w-1/2" />
        </div>
      )}
      <div className="p-6 pt-0">
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[80%]" />
        </div>
      </div>
      {footer && (
        <div className="border-t bg-muted/50 p-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-[100px]" />
          </div>
        </div>
      )}
    </div>
  )
}

interface SkeletonTableProps extends React.HTMLAttributes<HTMLDivElement> {
  rowCount?: number
  columnCount?: number
}

function SkeletonTable({
  className,
  rowCount = 5,
  columnCount = 4,
  ...props
}: SkeletonTableProps) {
  return (
    <div
      className={cn("rounded-md border bg-card text-card-foreground", className)}
      {...props}
    >
      <div className="border-b">
        <div className="grid grid-cols-4 gap-4 p-4">
          {Array.from({ length: columnCount }).map((_, i) => (
            <Skeleton key={i} className="h-6" />
          ))}
        </div>
      </div>
      <div className="divide-y">
        {Array.from({ length: rowCount }).map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-4 p-4">
            {Array.from({ length: columnCount }).map((_, j) => (
              <Skeleton key={j} className="h-6" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export { Skeleton, SkeletonCard, SkeletonTable }
