import { createClient } from '@supabase/supabase-js';
import { translations } from './src/translations.js';

const supabaseUrl = 'https://jhxqjkduohbzvyapwdej.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoeHFqa2R1b2hienZ5YXB3ZGVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MDQ0NDAsImV4cCI6MjEwMzQ4MDQ0MH0.d9-VX1atxlAvl-5WhSOYY8TaNYTjs4B4ViaJFmU6cDE';
const supabase = createClient(supabaseUrl, supabaseKey);

const portfolio = [
  {
    id: 'works',
    titleKey: 'works_title',
    subtitleKey: 'works_sub',
    image: '/works-cover-2.png',
    gallery: [
      '/works/work-1.jpg', '/works/work-2.jpg', '/works/work-3.jpg', '/works/work-4.jpg', '/works/work-5.png',
      '/works/work-6.jpg', '/works/work-7.jpg', '/works/work-8.jpg', '/works/work-9.png', '/works/work-10.jpg',
      '/works/work-11.jpg', '/works/work-12.png'
    ]
  },
  {
    id: 'available',
    titleKey: 'avail_title',
    subtitleKey: 'avail_sub',
    image: '/IMG_4115.JPEG',
    gallery: [
      '/IMG_4115.JPEG',
      '/available/avail-1.jpg',
      '/available/avail-2.jpg',
      '/available/avail-3.jpg',
      '/available/avail-4.jpg',
      '/available/avail-5.jpg',
      '/available/avail-6.jpg',
      '/available/avail-7.jpg',
      '/available/avail-8.jpg',
      '/available/avail-9.jpg',
      '/available/avail-10.jpg'
    ]
  }
];

async function seed() {
  console.log('Seeding translations...');
  const { error: tError } = await supabase
    .from('site_content')
    .upsert({ id: 'translations', data: translations });
  if (tError) console.error('Error seeding translations:', tError);

  console.log('Seeding portfolio...');
  const { error: pError } = await supabase
    .from('site_content')
    .upsert({ id: 'portfolio', data: portfolio });
  if (pError) console.error('Error seeding portfolio:', pError);

  console.log('Seeding complete.');
}

seed();
