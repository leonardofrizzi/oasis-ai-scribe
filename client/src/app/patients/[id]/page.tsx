"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PatientDetailPage({ params }: any) {
  const { id } = params;
  const [patient, setPatient] = useState<{
    id: number;
    name: string;
    dob: string;
    createdAt: string;
  } | null>(null);
  const [notes, setNotes] = useState<
    { id: number; createdAt: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/patients/${id}`),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/patients/${id}/notes`),
    ])
      .then(async ([pRes, nRes]) => {
        if (!pRes.ok || !nRes.ok) throw new Error();
        const p = await pRes.json();
        const n = await nRes.json();
        setPatient(p);
        setNotes(n);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleDelete = async (noteId: number) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes/${noteId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setNotes((prev) => prev.filter((note) => note.id !== noteId));
    } else {
      alert("Failed to delete note");
    }
  };

  if (loading) return <p>Loading…</p>;
  if (!patient) return <p>Patient not found.</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{patient.name}</h1>
      <p className="text-gray-600">
        DOB: {new Date(patient.dob).toLocaleDateString()}
        <br />
        Joined: {new Date(patient.createdAt).toLocaleDateString()}
      </p>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Notes</h2>
        {notes.length === 0 ? (
          <p className="text-gray-500">No notes yet.</p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="flex justify-between items-center p-4 bg-white rounded shadow mb-2"
            >
              <div>
                <span>Note #{note.id}</span>
                <span className="block text-gray-500 text-sm">
                  {new Date(note.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex gap-3">
                <Link
                  href={`/patients/${id}/notes/${note.id}`}
                  className="text-black hover:underline"
                >
                  View
                </Link>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
        <Link
          href={`/patients/${id}/notes/new`}
          className="block mt-4 w-full text-center px-4 py-3 bg-black text-white rounded hover:opacity-90"
        >
          Add New Note
        </Link>
      </div>
    </div>
  );
}