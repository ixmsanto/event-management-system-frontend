import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import EventForm from '../../../../components/EventForm';
import { useRouter, useParams } from 'next/navigation';

export default function EditEvent() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id && token) {
      fetchEvent();
    }
  }, [id, token]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setEvent(data);
      } else {
        setError('Failed to fetch event');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch(`http://localhost:8000/api/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        router.push('/dashboard');
      } else {
        alert('Failed to update event');
      }
    } catch (err) {
      alert('An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Event not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Event</h1>
        <EventForm event={event} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}