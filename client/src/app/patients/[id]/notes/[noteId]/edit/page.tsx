"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";

type OasisFields = Record<
  "M1800" | "M1810" | "M1820" | "M1830" | "M1840" | "M1850" | "M1860",
  string
>;

type Props = {
  params: {
    id: string;
    noteId: string;
  };
};

export default function EditNotePage({ params }: Props) {
  const { id: patientId, noteId } = params;
  const router = useRouter();

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
    async function load() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/notes/${noteId}`
        );
        if (!res.ok) throw new Error();
        const note = await res.json();
        setTranscriptText(note.transcriptText ?? note.transcriptRaw);
        setOasisFields(note.oasisFields);
      } catch {
        setError("Could not load note");
      } finally {
        setLoading(false);
      }
    }
    load();
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
    router.push(`/patients/${patientId}/notes/${noteId}`);
  }

  if (loading) return <p className="p-8">Loading…</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Edit Note #{noteId}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
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
            <div key={key}>
              <label className="block mb-1">{key}</label>
              <input
                type="text"
                value={val}
                onChange={(e) =>
                  setOasisFields({ ...oasisFields, [key]: e.target.value })
                }
                className="w-32 p-1 border rounded"
              />
            </div>
          ))}
        </fieldset>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Save Changes
        </button>
      </form>
    </main>
  );
}