import { Card, CardContent } from "../Card";

import { Skeleton } from "./Skeleton";

export const GridSkeleton = ({ columns }) => (
  <>
    {[...Array(6)].map((_, index) => (
      <Card key={index} className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          {columns.slice(0, 4).map((_, colIndex) => (
            <div key={colIndex} className="mb-3">
              <Skeleton className="h-3 w-1/3 mb-1" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
          <div className="mt-4">
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>
    ))}
  </>
);
