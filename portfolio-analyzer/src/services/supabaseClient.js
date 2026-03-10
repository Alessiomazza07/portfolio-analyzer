import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jvwtmrpncxtolueyvcau.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2d3RtcnBuY3h0b2x1ZXl2Y2F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODM0NzQsImV4cCI6MjA4ODU1OTQ3NH0.rHZ_fxFIQBcudSNwMdXAhpALDil1BoATWyv_jD4L9G8'; 

export const supabase = createClient(supabaseUrl, supabaseKey);