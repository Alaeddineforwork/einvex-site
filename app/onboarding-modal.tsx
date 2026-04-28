"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const STORAGE_KEY = "einvex_onboarding_v1";

type Answers = {
  investing: string;
  sharia: string;
  interests: string[];
  experience: string;
};

const initialAnswers: Answers = {
  investing: "",
  sharia: "",
  interests: [],
  experience: "",
};

export default function OnboardingModal() {
  const { isLoaded, isSignedIn, user } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    const key = `${STORAGE_KEY}:${user.id}`;
    if (window.localStorage.getItem(key)) return;
    const openModal = window.setTimeout(() => setOpen(true), 0);
    return () => window.clearTimeout(openModal);
  }, [isLoaded, isSignedIn, user]);

  if (!open || !user) return null;

  const canSubmit =
    answers.investing &&
    answers.sharia &&
    answers.interests.length > 0 &&
    answers.experience;

  function toggleInterest(value: string) {
    setAnswers((current) => ({
      ...current,
      interests: current.interests.includes(value)
        ? current.interests.filter((item) => item !== value)
        : [...current.interests, value],
    }));
  }

  function submit() {
    if (!canSubmit || !user) return;
    window.localStorage.setItem(
      `${STORAGE_KEY}:${user.id}`,
      JSON.stringify({ ...answers, completedAt: new Date().toISOString() })
    );
    setOpen(false);
    router.replace(pathname);
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-6"
      style={{ background: "rgba(3,7,10,0.78)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="w-full max-w-xl rounded-xl border p-5 shadow-2xl"
        style={{
          borderColor: "rgba(255,255,255,0.10)",
          background: "#0d1218",
          color: "var(--text)",
        }}
      >
        <p className="section-label">Welcome to EinveX</p>
        <h2 className="mt-2 text-xl font-semibold">Set up your experience</h2>
        <div className="mt-5 grid gap-4">
          <Question
            label="Are you currently investing?"
            options={["Yes", "No", "Planning to start"]}
            value={answers.investing}
            onChange={(value) => setAnswers((current) => ({ ...current, investing: value }))}
          />
          <Question
            label="Is Sharia compliance important to you?"
            options={["Yes", "Somewhat", "No"]}
            value={answers.sharia}
            onChange={(value) => setAnswers((current) => ({ ...current, sharia: value }))}
          />
          <div>
            <p className="mb-2 text-[13px] font-semibold">What are you interested in?</p>
            <div className="flex flex-wrap gap-2">
              {["Stocks (CSE)", "Real estate", "Investment projects"].map((option) => {
                const active = answers.interests.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleInterest(option)}
                    className="rounded-md border px-3 py-2 text-[12px] font-medium"
                    style={{
                      borderColor: active ? "rgba(34,197,94,0.45)" : "var(--line)",
                      background: active ? "rgba(34,197,94,0.12)" : "transparent",
                      color: active ? "#a7f3d0" : "var(--text-dim)",
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
          <Question
            label="Experience level"
            options={["Beginner", "Intermediate", "Advanced"]}
            value={answers.experience}
            onChange={(value) => setAnswers((current) => ({ ...current, experience: value }))}
          />
        </div>
        <button
          type="button"
          disabled={!canSubmit}
          onClick={submit}
          className="btn-primary mt-5 w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function Question({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-[13px] font-semibold">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = value === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className="rounded-md border px-3 py-2 text-[12px] font-medium"
              style={{
                borderColor: active ? "rgba(34,197,94,0.45)" : "var(--line)",
                background: active ? "rgba(34,197,94,0.12)" : "transparent",
                color: active ? "#a7f3d0" : "var(--text-dim)",
              }}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
