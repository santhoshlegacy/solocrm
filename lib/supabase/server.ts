import { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function createServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  // Direct fetch-based Supabase REST interface for Edge/Node SSR without heavy external dependencies
  return {
    from: (table: keyof Database["public"]["Tables"]) => ({
      select: async (query = "*") => {
        try {
          const res = await fetch(`${supabaseUrl}/rest/v1/${table}?select=${query}`, {
            headers: {
              apikey: supabaseAnonKey,
              Authorization: `Bearer ${supabaseAnonKey}`,
            },
            next: { revalidate: 60 },
          });
          if (!res.ok) throw new Error(await res.text());
          const data = await res.json();
          return { data, error: null };
        } catch (err: any) {
          return { data: null, error: err.message };
        }
      },
      insert: async (values: any) => {
        try {
          const res = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: supabaseAnonKey,
              Authorization: `Bearer ${supabaseAnonKey}`,
              Prefer: "return=representation",
            },
            body: JSON.stringify(values),
          });
          if (!res.ok) throw new Error(await res.text());
          const data = await res.json();
          return { data, error: null };
        } catch (err: any) {
          return { data: null, error: err.message };
        }
      },
      update: async (values: any, matchKey: string, matchValue: any) => {
        try {
          const res = await fetch(`${supabaseUrl}/rest/v1/${table}?${matchKey}=eq.${matchValue}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              apikey: supabaseAnonKey,
              Authorization: `Bearer ${supabaseAnonKey}`,
              Prefer: "return=representation",
            },
            body: JSON.stringify(values),
          });
          if (!res.ok) throw new Error(await res.text());
          const data = await res.json();
          return { data, error: null };
        } catch (err: any) {
          return { data: null, error: err.message };
        }
      },
    }),
  };
}

