import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('Supabase credentials missing. Client initialized with placeholders.');
}

// Use createBrowserClient for client-side usage in Next.js App Router
// This automatically handles cookies for session management, ensuring
// the Middleware and API Routes can access the session.
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
