import { createClient } from "@supabase/supabase-js"

// Create a singleton instance for the Supabase client
let supabaseInstance: ReturnType<typeof createClient> | null = null

export const getSupabaseClient = () => {
  if (supabaseInstance) return supabaseInstance

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anon Key is missing")
    throw new Error("Supabase credentials are not properly configured")
  }

  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storage: typeof window !== "undefined" ? window.localStorage : undefined,
      },
    })

    console.log("Supabase client initialized successfully")
  } catch (error) {
    console.error("Error initializing Supabase client:", error)
    throw new Error("Failed to initialize Supabase client")
  }

  return supabaseInstance
}

// For backward compatibility and to handle SSR
export const supabase = typeof window !== "undefined" ? getSupabaseClient() : null

// Utility function to check if we're offline
export const isOffline = () => {
  return typeof navigator !== "undefined" && !navigator.onLine
}

// Helper function to safely execute Supabase queries with fallback
export const safeQuery = async (queryFn: () => Promise<any>, fallbackData: any = null) => {
  if (isOffline()) {
    console.log("Offline mode: returning fallback data")
    return { data: fallbackData, error: new Error("You are offline") }
  }

  try {
    if (!supabase) {
      throw new Error("Supabase client is not initialized")
    }
    return await queryFn()
  } catch (error) {
    console.error("Error executing Supabase query:", error)
    return { data: fallbackData, error }
  }
}
