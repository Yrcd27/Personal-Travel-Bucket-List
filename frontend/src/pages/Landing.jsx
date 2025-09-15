import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <main className="bg-gray-50 min-h-[calc(100vh-56px)]">
      <section className="max-w-5xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Plan, save, and track your dream trips
          </h1>
          <p className="mt-4 text-gray-600">
            Keep a personal travel bucket list, log places you love, and never lose your ideas again.
          </p>
          <div className="mt-6 space-x-3">
            <Link to="/signup" className="bg-blue-600 text-white px-5 py-2.5 rounded">
              Get started
            </Link>
            <Link to="/login" className="text-blue-600">
              I already have an account
            </Link>
          </div>
        </div>
        <div className="bg-white shadow rounded-xl p-6">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-blue-600"></span>
              Create a list of destinations
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-blue-600"></span>
              Track visited places and notes
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-blue-600"></span>
              Sync across devices
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
