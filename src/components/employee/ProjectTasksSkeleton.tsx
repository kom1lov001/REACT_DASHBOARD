
import { Skeleton } from "@/components/ui/skeleton";

const ProjectTasksSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-40 bg-gray-200 dark:bg-gray-700" />
        <Skeleton className="h-9 w-28 bg-gray-200 dark:bg-gray-700" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-5 w-32 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
            <Skeleton className="h-4 w-full mb-2 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-4 w-3/4 mb-4 bg-gray-200 dark:bg-gray-700" />
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-4 w-16 bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectTasksSkeleton;
