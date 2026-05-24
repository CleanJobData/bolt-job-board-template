import { ExperienceLevelToken } from "../api/types";

export type SortBy = "published" | "relevance";

export type MaxAgePreset = "24h" | "7d" | "30d";

export interface JobBoardSearchParams {
  title?: string;
  location?: string;
  city_id?: string;
  state_id?: string;
  country_id?: string;
  remote?: string;
  experience_level?: string;
  salary?: string;
  max_age?: string;
  sort_by?: string;
  cursor?: string;
  limit?: string;
}

export interface ListQuery {
  title?: string;
  city_id?: number[];
  state_id?: number[];
  country_id?: number[];
  location?: string[];
  remote_only?: boolean;
  experience_level?: ExperienceLevelToken[];
  min_salary?: number;
  max_salary?: number;
  max_age_hours?: number;
  published_after?: string;
  company_name?: string;
  sort_by?: SortBy;
  cursor?: string;
  limit?: number;
  fields?: string;
  exclude_fields?: string;
  extra_fields?: string;
}
