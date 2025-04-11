// frontend/app/events/new/page.tsx
// for creating a new event

"use client";

import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import EventForm from '../../../components/EventForm';
import { useRouter } from 'next/navigation';

export default function CreateEvent() {
  const { token } = useAuth();
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch("http://localhost:8000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (response.status === 401) {
        logout();
        return;
      }
      if (response.ok) router.push("/dashboard");
      else alert("Failed to create event");
    } catch (err) {
      alert("An error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create New Event</h1>
        <EventForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}
