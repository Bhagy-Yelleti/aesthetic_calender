/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Calendar from "@/src/components/Calendar/Calendar";

export default function App() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12 px-4 font-sans text-gray-900">
      <header className="max-w-6xl mx-auto mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
          Luminar <span className="text-indigo-600">Calender</span>
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto text-lg">
          A modern take on the classic wall calendar. Plan your days, capture your thoughts, and stay inspired.
        </p>
      </header>

      <main>
        <Calendar />
      </main>

      <footer className="max-w-6xl mx-auto mt-20 pt-8 border-t border-gray-200 text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Luminar Design Studio. Built for the Frontend Engineering Challenge.</p>
      </footer>
    </div>
  );
}
