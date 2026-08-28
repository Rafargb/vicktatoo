import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jhxqjkduohbzvyapwdej.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoeHFqa2R1b2hienZ5YXB3ZGVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MDQ0NDAsImV4cCI6MjEwMzQ4MDQ0MH0.d9-VX1atxlAvl-5WhSOYY8TaNYTjs4B4ViaJFmU6cDE';

export const supabase = createClient(supabaseUrl, supabaseKey);
