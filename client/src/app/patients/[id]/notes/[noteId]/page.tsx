import Link from "next/link";

type Note = {
  id: number;
  patientId: number;
  transcriptRaw: string;
  transcriptText: string;
  oasisFields: Record<string, string>;
  createdAt: string;
};

type Patient = {
  id: number;
  name: string;
};

type Props = {
  params: {
    id: string;
    noteId: string;
  };
};

export default async function NoteDetailPage(props: Props) {
  const { id, noteId } = props.params;

  const [noteRes, patientRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes/${noteId}`),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/patients/${id}`),
  ]);

  if (!noteRes.ok) {
    return (
      <main className="p-8">
        <p className="text-red-600">
          Note not found (status {noteRes.status})
        </p>
        <Link href={`/patients/${id}`}>← Back</Link>
      </main>
    );
  }
  if (!patientRes.ok) {
    throw new Error(`Failed to fetch patient: ${patientRes.status}`);
  }

  const note: Note = await noteRes.json();
  const patient: Patient = await patientRes.json();

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-2">
        Note #{note.id} for {patient.name}
      </h1>
      <p className="text-gray-600 mb-6">
        Created at: {new Date(note.createdAt).toLocaleString()}
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Transcript</h2>
        <pre className="p-4 bg-white rounded shadow overflow-auto">
          {note.transcriptText || note.transcriptRaw}
        </pre>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">OASIS Section G</h2>
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="text-left p-2">Field</th>
              <th className="text-left p-2">Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(note.oasisFields).map(
              ([key, val]: [string, string]) => (
                <tr key={key} className="border-t">
                  <td className="p-2 font-medium">{key}</td>
                  <td className="p-2">{val}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </section>

      <div className="mt-6">
        <Link
          href={`/patients/${id}`}
          className="inline-block px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
        >
          ← Back to patient
        </Link>
      </div>
    </main>
  );
}