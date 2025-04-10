// /frontend/app/page.tsx
// This file is a Next.js page component that serves as the main entry point for the application.
// It includes a simple layout with a logo, instructions, and links to deploy and read documentation.
// It uses Tailwind CSS for styling and includes responsive design for different screen sizes.
// Importing necessary modules and components

"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/login');
    } else {
      router.push('/dashboard');
    }
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-lg">Redirecting...</p>
    </div>
  );
}