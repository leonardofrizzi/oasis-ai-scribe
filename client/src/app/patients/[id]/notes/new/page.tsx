"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

type Props = {
  params: { id: string };
};

export default function NewNotePage({ params }: Props) {
  const router = useRouter();
  const patientId = params.id;

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Please select an audio file");
      return;
    }
    setSubmitting(true);

    const form = new FormData();
    form.append("patientId", patientId);
    form.append("audio", file);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/notes`,
      { method: "POST", body: form }
    );
    if (!res.ok) {
      setError(`Failed to create note (${res.status})`);
      setSubmitting(false);
      return;
    }
    const data = await res.json();
    router.push(`/patients/${patientId}/notes/${data.id}`);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto w-full max-w-3xl bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">
          New Note for Patient {patientId}
        </h1>

        {error && (
          <div className="mb-4 text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Audio File</label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-3 bg-black text-white rounded hover:opacity-90 disabled:opacity-50 transition"
          >
            {submitting ? "Uploading..." : "Upload & Transcribe"}
          </button>
        </form>
      </div>
    </div>
  );
}