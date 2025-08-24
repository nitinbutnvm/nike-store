import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function createClient() {
  return createClientComponentClient()
}

// Also export a default instance for convenience
export const supabase = createClientComponentClient()
