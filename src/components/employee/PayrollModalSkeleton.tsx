
import { Skeleton } from "@/components/ui/skeleton";

const PayrollModalSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32 bg-gray-200 dark:bg-gray-700" />
        <Skeleton className="h-8 w-20 bg-gray-200 dark:bg-gray-700" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-10 w-full bg-gray-200 dark:bg-gray-700" />
          </div>
        ))}
      </div>
      
      <div className="space-y-4">
        <Skeleton className="h-5 w-28 bg-gray-200 dark:bg-gray-700" />
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <Skeleton className="h-4 w-16 mb-2 bg-gray-200 dark:bg-gray-600" />
              <Skeleton className="h-6 w-20 bg-gray-200 dark:bg-gray-600" />
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Skeleton className="h-10 w-20 bg-gray-200 dark:bg-gray-700" />
        <Skeleton className="h-10 w-24 bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
};

export default PayrollModalSkeleton;
