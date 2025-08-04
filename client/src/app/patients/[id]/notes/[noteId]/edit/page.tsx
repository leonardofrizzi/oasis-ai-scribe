"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

type OasisFields = Record<
  "M1800" | "M1810" | "M1820" | "M1830" | "M1840" | "M1850" | "M1860",
  string
>;

export default function EditNotePage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.id as string;
  const noteId = params.noteId as string;

  const [transcriptText, setTranscriptText] = useState("");
  const [oasisFields, setOasisFields] = useState<OasisFields>({
    M1800: "",
    M1810: "",
    M1820: "",
    M1830: "",
    M1840: "",
    M1850: "",
    M1860: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes/${noteId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load note");
        return res.json();
      })
      .then((note) => {
        setTranscriptText(note.transcriptText ?? note.transcriptRaw);
        setOasisFields(note.oasisFields);
      })
      .catch(() => setError("Could not load note"))
      .finally(() => setLoading(false));
  }, [noteId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/notes/${noteId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcriptText, oasisFields }),
      }
    );

    if (!res.ok) {
      setError(`Failed to update (${res.status})`);
      return;
    }

    // Redireciona para a página do paciente e força o refresh
    router.push(`/patients/${patientId}`);
    router.refresh();
  }

  if (loading) return <p className="p-8">Loading…</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;

  return (
    <div className="py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Edit Note #{noteId}</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white shadow rounded-lg p-6"
      >
        <div>
          <label className="block mb-1 font-medium">Transcript</label>
          <textarea
            value={transcriptText}
            onChange={(e) => setTranscriptText(e.target.value)}
            rows={6}
            className="w-full p-2 border rounded"
          />
        </div>
        <fieldset className="space-y-4">
          <legend className="font-medium">OASIS Section G</legend>
          {Object.entries(oasisFields).map(([key, val]) => (
            <div key={key} className="flex items-center space-x-4">
              <label className="w-20">{key}</label>
              <input
                type="text"
                value={val}
                onChange={(e) =>
                  setOasisFields({ ...oasisFields, [key]: e.target.value })
                }
                className="flex-1 p-1 border rounded"
              />
            </div>
          ))}
        </fieldset>
        {error && <p className="text-red-600">{error}</p>}
        <div className="flex space-x-4">
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded hover:opacity-90 transition"
          >
            Save Changes
          </button>
          <Link
            href={`/patients/${patientId}/notes/${noteId}`}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}