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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function Page({ params }: any) {
  const { id: patientId, noteId } = params;

  const [noteRes, patientRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes/${noteId}`, {
      cache: "no-store",
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/patients/${patientId}`, {
      cache: "no-store",
    }),
  ]);

  if (!noteRes.ok || !patientRes.ok) {
    return (
      <div className="p-8 text-red-600">
        Failed to load data.
        <br />
        <Link href={`/patients/${patientId}`}>← Back to patient</Link>
      </div>
    );
  }

  const note: Note = await noteRes.json();
  const patient: Patient = await patientRes.json();
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