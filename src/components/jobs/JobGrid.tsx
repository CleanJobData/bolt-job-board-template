import * as React from "react";
import type { Job } from "../../lib/api/types";
import { JobCard } from "./JobCard";
import { JobCardSkeleton } from "./JobCardSkeleton";
import { Typography } from "../ui/Typography";

interface JobGridProps {
  jobs: Job[];
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  onCardClick?: (jobId: string) => void;
}

export function JobGrid({ jobs, isLoading, emptyState, onCardClick }: JobGridProps) {
  if (isLoading && jobs.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      emptyState || (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-xl">
          <Typography variant="h3" className="text-muted-foreground">
            No jobs found
          </Typography>
          <Typography variant="p" className="text-muted-foreground mt-2">
            Try adjusting your filters to find what you're looking for.
          </Typography>
        </div>
      )
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} onCardClick={onCardClick} />
        ))}
        {isLoading && (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <JobCardSkeleton key={`loading-${i}`} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
