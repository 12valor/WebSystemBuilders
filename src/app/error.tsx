"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { void error.digest; }, [error]);
  return <main id="main-content" className="grid min-h-[70vh] place-items-center bg-background px-5 py-16 text-center"><div className="max-w-xl"><span className="mx-auto grid size-12 place-items-center rounded-xl border border-red-400/20 text-sm font-semibold text-red-200" aria-hidden="true">!</span><h1 className="mt-6 text-4xl font-semibold tracking-[-0.05em]">This page could not be completed.</h1><p className="mt-4 leading-7 text-secondary">No partial transaction result should be assumed. You can try the page again safely.</p><button onClick={reset} className="mt-7 min-h-11 rounded-lg border border-white/15 px-5 text-sm font-semibold">Try again</button></div></main>;
}
