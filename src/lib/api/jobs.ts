import { apiFetch } from "./client";
import { Job, JobDetail, ListResponse } from "./types";
import { ListQuery } from "../jobs/query-types";
import { buildApiUrlParams } from "../jobs/query-mapper";

export async function listJobs(
  query: ListQuery = {}
): Promise<ListResponse<Job>> {
  const params = buildApiUrlParams(query);
  const queryString = params.toString();
  const endpoint = `/jobs${queryString ? `?${queryString}` : ""}`;

  return apiFetch<ListResponse<Job>>(endpoint);
}

export async function getJobById(id: string): Promise<JobDetail> {
  return apiFetch<JobDetail>(`/jobs/${id}`);
}
