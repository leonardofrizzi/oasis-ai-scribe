import { useParams } from "next/navigation";
import Link from "next/link";

type Patient = {
  id: number;
  name: string;
  dob: string;
  createdAt: string;
};

type Note = {
  id: number;
  createdAt: string;
};

export default async function PatientDetailPage({ params }: { params: { id: string } }) {
  const id = params.id;

  const [patientRes, notesRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/patients/${id}`),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/patients/${id}/notes`)
  ]);

  if (!patientRes.ok) throw new Error("Failed to fetch patient");
  if (!notesRes.ok) throw new Error("Failed to fetch notes");

  const patient: Patient = await patientRes.json();
  const notes: Note[] = await notesRes.json();

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">{patient.name}</h1>
      <p className="text-gray-600 mb-8">
        DOB: {new Date(patient.dob).toLocaleDateString()}<br/>
        Joined: {new Date(patient.createdAt).toLocaleDateString()}
      </p>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Notes</h2>
        <ul className="space-y-3">
          {notes.map((n) => (
            <li key={n.id} className="p-4 bg-white rounded shadow hover:bg-blue-50 transition">
              <Link href={`/patients/${id}/notes/${n.id}`} className="block">
                <span className="text-gray-800">Note #{n.id}</span>
                <span className="text-sm text-gray-500 float-right">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-6">
        <Link
          href={`/notes/new?patientId=${id}`}
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          + Add Note
        </Link>
      </div>
    </main>
  );
}