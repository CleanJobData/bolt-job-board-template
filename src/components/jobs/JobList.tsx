import * as React from "react";
import type { Job, ListResponse } from "../../lib/api/types";
import type { ListQuery } from "../../lib/jobs/query-types";
import { JobGrid } from "./JobGrid";
import { Button } from "../ui/Button";
import { listJobs } from "../../lib/api/jobs";
import { FaSpinner } from "react-icons/fa6";

interface JobListProps {
  initialData: ListResponse<Job>;
  query: ListQuery;
  onCardClick?: (jobId: string) => void;
}

export function JobList({ initialData, query, onCardClick }: JobListProps) {
  const [jobs, setJobs] = React.useState<Job[]>(initialData.data);
  const [nextCursor, setNextCursor] = React.useState<string | null>(
    initialData.pagination.next_page
  );
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setJobs(initialData.data);
    setNextCursor(initialData.pagination.next_page);
    setError(null);
  }, [initialData]);

  const handleLoadMore = async () => {
    if (!nextCursor || isLoadingMore) return;

    setIsLoadingMore(true);
    setError(null);

    try {
      const result = await listJobs({
        ...query,
        cursor: nextCursor,
      });

      setJobs((prev) => [...prev, ...result.data]);
      setNextCursor(result.pagination.next_page);
    } catch (err) {
      setError("Failed to load more jobs. Please try again.");
      console.error(err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="space-y-12">
      <JobGrid jobs={jobs} onCardClick={onCardClick} />

      {nextCursor && (
        <div className="flex flex-col items-center gap-4">
          {error && (
            <p className="text-sm text-destructive font-medium">{error}</p>
          )}
          <Button
            variant="outline"
            size="lg"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="min-w-[200px]"
          >
            {isLoadingMore ? (
              <>
                <FaSpinner className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Jobs"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
