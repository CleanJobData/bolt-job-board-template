import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getJobById } from "../lib/api/jobs";
import { JobDetailView } from "../components/jobs/JobDetailView";
import { Button } from "../components/ui/Button";
import { FaChevronLeft } from "react-icons/fa6";
import { ApiError } from "../lib/api/client";
import type { JobDetail } from "../lib/api/types";

export function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    getJobById(id)
      .then((data) => {
        setJob(data);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) {
          setError("not-found");
        } else {
          console.error("[Job Page Error]", err);
          setError("We couldn't load the job details. Please try again later.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <div className="animate-pulse text-muted-foreground font-medium">
          Loading job details...
        </div>
      </div>
    );
  }

  if (error === "not-found") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <h3 className="text-2xl font-semibold mb-6">Page Not Found</h3>
        <p className="text-muted-foreground mb-8 max-w-md">
          The job you are looking for doesn't exist or has been moved.
        </p>
        <Button href="/">Return Home</Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="text-muted-foreground mb-8">{error}</p>
        <Button href="/">Return to Job Board</Button>
      </div>
    );
  }

  if (!job) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.published,
    validThrough: job.expired_at,
    employmentType: job.employment_type,
    hiringOrganization: {
      "@type": "Organization",
      name: job.company?.name,
      sameAs: job.company?.website_url,
      logo: job.company?.logo,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
      },
    },
    baseSalary: job.salary_min
      ? {
          "@type": "MonetaryAmount",
          currency: job.salary_currency || "USD",
          value: {
            "@type": "QuantitativeValue",
            minValue: job.salary_min,
            maxValue: job.salary_max,
            unitText: "YEAR",
          },
        }
      : undefined,
  };

  return (
    <div className="container mx-auto py-12 px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mb-8">
        <Button variant="ghost" size="sm" href="/" className="-ml-2 text-muted-foreground">
          <FaChevronLeft className="mr-1 h-4 w-4" />
          Back to Jobs
        </Button>
      </div>

      <JobDetailView job={job} />
    </div>
  );
}
