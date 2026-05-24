import * as React from "react";
import { Sheet } from "../ui/Sheet";
import { JobDetailView } from "./JobDetailView";
import type { JobDetail } from "../../lib/api/types";
import { getJobById } from "../../lib/api/jobs";
import { FaSpinner } from "react-icons/fa6";

interface JobSideViewProps {
  jobId: string;
  onClose?: () => void;
}

export function JobSideView({ jobId, onClose }: JobSideViewProps) {
  const [isOpen, setIsOpen] = React.useState(true);
  const [job, setJob] = React.useState<JobDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getJobById(jobId)
      .then((data) => {
        if (!cancelled) setJob(data);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load job details.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [jobId]);

  const handleClose = React.useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      onClose?.();
    }, 500);
  }, [onClose]);

  return (
    <Sheet isOpen={isOpen} onClose={handleClose}>
      {loading ? (
        <div className="py-40 flex flex-col items-center justify-center gap-4">
          <FaSpinner className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse font-medium">
            Loading job details...
          </p>
        </div>
      ) : error ? (
        <div className="py-20 text-center">
          <p className="text-destructive">{error}</p>
        </div>
      ) : job ? (
        <JobDetailView job={job} />
      ) : null}
    </Sheet>
  );
}
