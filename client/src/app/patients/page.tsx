"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";

type Patient = { id: number; name: string; dob: string };

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

    fetch(`${baseUrl}/patients`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then(setPatients)
      .catch(console.error);
  }, []);

  const filtered = useMemo(() => {
    const uniqueByName = Array.from(
      new Map(patients.map((p) => [p.name.toLowerCase(), p])).values()
    );
    return uniqueByName.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [patients, query]);

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Patients</h1>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search patient name…"
      />

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No patients found.
          </div>
        ) : (
          filtered.map((p) => (
            <Link
              key={p.id}
              href={`/patients/${p.id}`}
              className="flex justify-between items-center px-6 py-4 border-b last:border-b-0 hover:bg-gray-50 transition"
            >
              <span className="text-gray-800">{p.name}</span>
              <span className="text-gray-600">
                {new Date(p.dob).toLocaleDateString("en-GB")}
              </span>
            </Link>
          ))
        )}
      </div>
    </>
  );
}