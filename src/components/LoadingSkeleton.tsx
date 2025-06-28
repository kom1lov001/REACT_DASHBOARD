
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  type: "card" | "table" | "stats" | "chart";
  count?: number;
}

const LoadingSkeleton = ({ type, count = 1 }: LoadingSkeletonProps) => {
  if (type === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-border p-6">
            <Skeleton className="h-4 w-3/4 mb-4 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-8 w-1/2 mb-2 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-3 w-full bg-gray-200 dark:bg-gray-700" />
          </div>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <Skeleton className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="p-6 space-y-4">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700" />
              </div>
              <Skeleton className="h-6 w-16 bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "stats") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-4 w-20 mb-2 bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-8 w-16 bg-gray-200 dark:bg-gray-700" />
              </div>
              <Skeleton className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="mt-4 flex items-center">
              <Skeleton className="h-3 w-12 mr-2 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-3 w-20 bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "chart") {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-border p-6">
        <Skeleton className="h-6 w-1/3 mb-6 bg-gray-200 dark:bg-gray-700" />
        <Skeleton className="h-64 w-full bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }

  return <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-700" />;
};

export default LoadingSkeleton;
