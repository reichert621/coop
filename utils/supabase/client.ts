import {createClient} from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://pjvktbprjuxmdziqshwk.supabase.co';
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqdmt0YnByanV4bWR6aXFzaHdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODgyOTkyNDAsImV4cCI6MjAwMzg3NTI0MH0.hgQtmlCiu1AJsTFo7thsBl2k8QdSRX-5l1sgy4hmjLA';

export const supabase = createClient(supabaseUrl, supabaseKey);
