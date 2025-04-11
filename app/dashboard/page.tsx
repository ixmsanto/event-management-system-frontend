// frontend/app/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import Link from "next/link";

interface Event {
  id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  category: string;
}

export default function Dashboard() {
  const { token, logout, isLoading: authLoading } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) {
      fetchEvents();
    }
  }, [token]);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        setError("Failed to fetch events");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        const response = await fetch(`http://localhost:8000/api/events/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          setEvents(events.filter((event) => event.id !== id));
        } else {
          alert("Failed to delete event");
        }
      } catch (err) {
        alert("An error occurred");
      }
    }
  };

  if (authLoading || (token && loading)) {
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div>
            <Link
              href="/events/new"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 mr-4"
            >
              Create New Event
            </Link>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="grid gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
              <p className="text-gray-700 mb-2">{event.description}</p>
              <p className="text-gray-600">
                Start: {new Date(event.start_time).toLocaleString()}
              </p>
              <p className="text-gray-600">
                End: {new Date(event.end_time).toLocaleString()}
              </p>
              <p className="text-gray-600">Location: {event.location}</p>
              <p className="text-gray-600">Category: {event.category}</p>
              <div className="mt-4 flex gap-4">
                <Link
                  href={`/events/${event.id}/edit`}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}