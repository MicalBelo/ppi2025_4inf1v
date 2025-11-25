import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL="https://nsvtoddymalywnlyevfv.supabase.co",
    import.meta.env.VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zdnRvZGR5bWFseXdubHlldmZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MzQ0MTUsImV4cCI6MjA3MzExMDQxNX0.9ooH9N7VgYLrnHJrVeghSvcq-b5xj6nct1uEI6FMBNA",
);