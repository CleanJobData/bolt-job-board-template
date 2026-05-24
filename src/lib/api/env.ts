export interface ApiConfig {
  baseUrl: string;
  apiKey: string;
}

export function getApiConfig(): ApiConfig {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "Missing VITE_SUPABASE_URL environment variable. " +
      "Please ensure it is set in your .env file."
    );
  }

  if (!supabaseAnonKey) {
    throw new Error(
      "Missing VITE_SUPABASE_ANON_KEY environment variable. " +
      "Please ensure it is set in your .env file."
    );
  }

  return {
    baseUrl: `${supabaseUrl}/functions/v1/cjd-proxy`,
    apiKey: supabaseAnonKey,
  };
}
