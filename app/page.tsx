'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // Check if user has existing roadmaps
    const roadmaps = localStorage.getItem('roadmaps');
    
    if (roadmaps && JSON.parse(roadmaps).length > 0) {
      // User has roadmaps, go to dashboard
      router.push('/dashboard');
    } else {
      // New user, show home page
      router.push('/home');
    }
  }, [router]);

  return null; // This page just redirects
}
