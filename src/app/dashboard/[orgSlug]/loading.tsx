export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse p-1">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-9 w-48 bg-muted/80 rounded-xl" />
          <div className="h-4 w-72 bg-muted/60 rounded-lg" />
        </div>
        <div className="h-10 w-32 bg-muted/80 rounded-xl" />
      </div>

      {/* Grid of Skeleton Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-card/40 backdrop-blur-md shadow-subtle border border-border/40 rounded-2xl overflow-hidden flex flex-col p-6 h-64 justify-between animate-pulse"
          >
            <div>
              <div className="flex justify-between items-start">
                <div className="bg-secondary/40 h-10 w-10 rounded-xl" />
                <div className="bg-secondary/40 h-5 w-16 rounded-full" />
              </div>
              <div className="space-y-2 mt-6">
                <div className="h-6 w-2/3 bg-muted/80 rounded-lg" />
                <div className="h-4 w-5/6 bg-muted/60 rounded-lg" />
              </div>
            </div>
            <div className="flex justify-between items-end mt-auto">
              <div className="h-7 w-24 bg-muted/80 rounded-lg" />
              <div className="h-4 w-4 bg-muted/60 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
