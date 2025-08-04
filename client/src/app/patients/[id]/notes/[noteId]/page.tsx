'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Note = {
  id: number;
  transcriptRaw: string;
  transcriptText?: string;
  oasisFields: Record<string, string>;
  createdAt: string;
};

type Patient = {
  id: number;
  name: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Page({ params }: any) {
  const { id: patientId, noteId } = params;
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<string | null>(null);

const baseUrl =
  typeof window !== "undefined"
    ? "http://localhost:4000" 
    : process.env.NODE_ENV === "development"
    ? "http://host.docker.internal:4000" 
    : "http://api:4000"; 

  useEffect(() => {
    const fetchData = async () => {
      const [noteRes, patientRes] = await Promise.all([
        fetch(`${baseUrl}/notes/${noteId}`),
        fetch(`${baseUrl}/patients/${patientId}`),
      ]);

      if (!noteRes.ok || !patientRes.ok) {
        setError("Failed to load data.");
        return;
      }

      setNote(await noteRes.json());
      setPatient(await patientRes.json());
    };

    fetchData();
  }, []);

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this note?");
    if (!confirmed) return;

    const res = await fetch(`${baseUrl}/notes/${noteId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.push(`/patients/${patientId}`);
    } else {
      alert("Failed to delete the note.");
    }
  };

  if (error) {
    return (
      <div className="p-8 text-red-600">
        {error}
        <br />
        <Link href={`/patients/${patientId}`}>← Back to patient</Link>
      </div>
    );
  }

  if (!note || !patient) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="py-8 px-4">
      <h1 className="text-2xl font-bold mb-2">
        Note #{note.id} for {patient.name}
      </h1>
      <p className="text-gray-600 mb-6">
        Created at {new Date(note.createdAt).toLocaleString()}
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Transcript</h2>
        <div className="p-4 bg-white rounded shadow whitespace-pre-wrap break-words">
          {note.transcriptText ?? note.transcriptRaw}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">OASIS Section G</h2>
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="p-2 text-left">Field</th>
              <th className="p-2 text-left">Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(note.oasisFields).map(([key, val]) => (
              <tr key={key} className="border-t">
                <td className="p-2 font-medium">{key}</td>
                <td className="p-2">{val}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="mt-6 flex space-x-4">
        <Link
          href={`/patients/${patientId}`}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          ← Back
        </Link>

        <Link
          href={`/patients/${patientId}/notes/${noteId}/edit`}
          className="px-4 py-2 bg-black text-white rounded hover:opacity-90"
        >
          Edit Note
        </Link>

        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded hover:opacity-90"
        >
          Delete Note
        </button>
      </div>
    </div>
  );
}