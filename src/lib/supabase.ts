import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials not found in environment variables.");
}

// Create a safe client or a proxy that warns but doesn't throw on import if credentials are missing
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new Proxy({} as any, {
      get(target, prop) {
        if (prop === "auth") {
          return new Proxy({} as any, {
            get() {
              return () => ({ data: { session: null }, error: new Error("Supabase is not configured") });
            }
          });
        }
        // Return a function that returns a chainable proxy so chain queries like supabase.from().select() don't crash
        return () => new Proxy({} as any, {
          get(t, p) {
            return () => Promise.resolve({ data: null, error: new Error("Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.") });
          }
        });
      }
    });

