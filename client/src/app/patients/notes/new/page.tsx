"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function NewNotePage() {
  const router = useRouter();
  const params = useSearchParams();
  const patientId = params.get("patientId") || "";

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!patientId) {
      setError("Missing patientId");
      return;
    }
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
      {
        method: "POST",
        body: form,
      }
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
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">New Note for Patient {patientId}</h1>
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
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {submitting ? "Uploading..." : "Upload & Transcribe"}
        </button>
      </form>
    </main>
  );
}