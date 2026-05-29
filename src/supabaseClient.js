import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ndydkhyzfptabfvyigfv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5keWRraHl6ZnB0YWJmdnlpZ2Z2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNzk0NzIsImV4cCI6MjA5NTY1NTQ3Mn0.iHYJGou6yNIWvXCaHqj8vAMyGmWGf-cUradAwnmIpgk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)