import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://rzkwakvmleqqhbuqweuw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6a3dha3ZtbGVxcWhidXF3ZXV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNTE2MDAsImV4cCI6MjA3OTgyNzYwMH0.FklrFlCbTsiZCkbpcUPXGh7RimMVSXyYQ495tecxQU0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
