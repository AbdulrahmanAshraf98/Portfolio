"use client";

export function PrintCvButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden fixed top-4 right-4 z-10 rounded-sm bg-[#1b3a5f] px-4 py-2 text-sm text-white"
    >
      Download / Print CV
    </button>
  );
}
