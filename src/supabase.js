import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pokszytavgatsncritgk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBva3N6eXRhdmdhdHNuY3JpdGdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NjY3NzcsImV4cCI6MjA5NzQ0Mjc3N30.kUlYZBG839vPq12LeL2k5xZyVrzWwzVHVFk-TqWthGo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
