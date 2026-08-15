"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrandLogo } from "@/components/brand/brand-logo";
import { completeOnboardingAction } from "@/features/auth/onboarding-actions";

const INTEREST_OPTIONS = [
  "Frontend", "Backend", "Full Stack", "UI Design", "Templates",
  "E-commerce", "POS Systems", "School Systems", "Inventory Systems",
  "Healthcare", "Hotel Management", "CRM", "ERP"
];

const COUNTRIES = [
  "Philippines", "United States", "Canada", "United Kingdom", "Australia",
  "Singapore", "Japan", "Germany", "France", "India", "Other"
];

export default function OnboardingWizardPage() {
  const [step, setStep] = useState(1);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("Philippines");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // Username validation state
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);

  useEffect(() => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      setUsernameError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setUsernameChecking(true);
      setUsernameError(null);

      try {
        const res = await fetch(`/api/users/check-username?username=${encodeURIComponent(username)}`);
        const data = await res.json();

        if (data.error) {
          setUsernameError(data.error);
          setUsernameAvailable(false);
        } else {
          setUsernameAvailable(data.available);
          if (!data.available) {
            setUsernameError("Username is already taken.");
          }
        }
      } catch {
        setUsernameError("Error checking username.");
      } finally {
        setUsernameChecking(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [username]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-10 px-6 sm:px-8 font-sans text-slate-900">
      <header className="sm:mx-auto sm:w-full sm:max-w-xl flex items-center justify-between">
        <Link href="/">
          <BrandLogo priority className="size-12" />
        </Link>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Step {step} of 5
        </span>
      </header>

      {/* Main Wizard Card */}
      <main className="my-auto sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white p-8 shadow-xl shadow-slate-200/50 border border-slate-200 rounded-2xl min-h-[420px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Step 1</span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-1">Upload Profile Picture</h2>
                  <p className="text-xs text-slate-500 mt-1">Optional. You can always change this later.</p>
                </div>

                <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-8 bg-slate-50/50">
                  {avatarUrl ? (
                    /* eslint-disable-next-html-element-suppression */
                    <img src={avatarUrl} alt="Avatar Preview" className="size-24 rounded-full object-cover border-2 border-blue-500 shadow" />
                  ) : (
                    <div className="size-24 rounded-full bg-slate-200 flex items-center justify-center border border-slate-300">
                      <svg className="size-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}

                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="Paste image URL (e.g. https://...)"
                    className="mt-4 w-full min-h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Step 2</span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-1">Choose a Unique Username</h2>
                  <p className="text-xs text-slate-500 mt-1">This will be your public developer identifier.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Username</label>
                  <div className="relative mt-1">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                      placeholder="dev_alex"
                      className="block w-full min-h-12 rounded-xl border border-slate-200 bg-slate-50/50 pl-4 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3.5">
                      {usernameChecking ? (
                        <span className="text-xs text-amber-500">Checking...</span>
                      ) : usernameAvailable === true ? (
                        <span className="text-xs font-bold text-emerald-600">Available</span>
                      ) : usernameAvailable === false ? (
                        <span className="text-xs font-bold text-red-500">Unavailable</span>
                      ) : null}
                    </div>
                  </div>
                  {usernameError && <p className="mt-1.5 text-xs font-medium text-red-500">{usernameError}</p>}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Step 3</span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-1">Select Your Country</h2>
                  <p className="text-xs text-slate-500 mt-1">Used to personalize catalog currencies and seller guidelines.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="mt-1 block w-full min-h-12 rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Step 4</span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-1">Select Your Interests</h2>
                  <p className="text-xs text-slate-500 mt-1">Pick topics and system categories you care about.</p>
                </div>

                <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto p-1">
                  {INTEREST_OPTIONS.map((interest) => {
                    const active = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition border ${
                          active
                            ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {interest} {active ? "Selected" : "+"}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 text-center py-4"
              >
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200">
                  <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">You&apos;re All Set!</h2>
                  <p className="text-xs text-slate-600 mt-2 leading-5">
                    Your profile <span className="font-bold text-slate-900">@{username || "user"}</span> has been configured. Click below to enter your unified Dashboard.
                  </p>
                </div>

                <form action={completeOnboardingAction}>
                  <input type="hidden" name="username" value={username} />
                  <input type="hidden" name="country" value={country} />
                  <input type="hidden" name="avatarUrl" value={avatarUrl} />
                  {selectedInterests.map((interest) => (
                    <input key={interest} type="hidden" name="interests" value={interest} />
                  ))}

                  <button
                    type="submit"
                    className="blue-button min-h-12 w-full bg-blue-600 text-sm font-semibold text-white"
                  >
                    Enter Dashboard &rarr;
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          {step < 5 && (
            <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-6">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  &larr; Back
                </button>
              ) : <div />}

              <button
                type="button"
                onClick={nextStep}
                disabled={step === 2 && (!usernameAvailable || !username)}
                className="blue-button bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white disabled:opacity-50"
              >
                Continue &rarr;
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="sm:mx-auto sm:w-full sm:max-w-xl text-center text-xs text-slate-400">
        WebSystemBuilders • Premium Software Marketplace
      </footer>
    </div>
  );
}
