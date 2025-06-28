
import { Skeleton } from "@/components/ui/skeleton";

const EmployeeTasksSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32 bg-gray-200 dark:bg-gray-700" />
        <Skeleton className="h-8 w-24 bg-gray-200 dark:bg-gray-700" />
      </div>
      
      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-5 w-48 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
            <Skeleton className="h-4 w-full mb-2 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-4 w-3/4 mb-3 bg-gray-200 dark:bg-gray-700" />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-4 w-20 bg-gray-200 dark:bg-gray-700" />
              </div>
              <Skeleton className="h-4 w-16 bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeTasksSkeleton;
