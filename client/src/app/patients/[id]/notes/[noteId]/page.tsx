"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

export default function NoteDetailPage({
  params,
}: {
  params: { id: string; noteId: string };
}) {
  const { id: patientId, noteId } = params;
  const [note, setNote] = useState<Note | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes/${noteId}`),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/patients/${patientId}`),
    ])
      .then(async ([nRes, pRes]) => {
        if (!nRes.ok) throw new Error("Failed to fetch note");
        if (!pRes.ok) throw new Error("Failed to fetch patient");
        const n: Note = await nRes.json();
        const p: Patient = await pRes.json();
        setNote(n);
        setPatient(p);
      })
      .catch((err) => setError(err.message));
  }, [patientId, noteId]);

  if (error)
    return (
      <div className="p-8 text-red-600">
        {error} <br />
        <Link href={`/patients/${patientId}`}>← Back to patient</Link>
      </div>
    );

  if (!note || !patient)
    return <p className="p-8">Loading note details…</p>;

  const fields = note.oasisFields;

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
        <pre className="p-4 bg-white rounded shadow overflow-auto">
          {note.transcriptText ?? note.transcriptRaw}
        </pre>
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
            {Object.entries(fields).map(([key, val]) => (
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
      </div>
    </div>
  );
}