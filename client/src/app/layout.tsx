import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Oasis AI Scribe",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <nav className="max-w-4xl mx-auto px-4 py-3 flex space-x-4">
            <Link href="/patients" className="font-medium hover:underline">
              Patients
            </Link>
            <Link href="/notes" className="font-medium hover:underline">
              Notes
            </Link>
          </nav>
        </header>
        <main className="max-w-4xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}